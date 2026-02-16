import Navbar from './components/Navbar'
import Menu from './pages/Menu'
import Quiz from './pages/Quiz'
import { Routes, Route } from "react-router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { requestTokenURL } from './requests';
import Button from 'react-bootstrap/Button';

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState([])

  useEffect(() => {
    const controller = new AbortController();

    const retrieveToken = async () => {
      try {
        const response = await axios.get(requestTokenURL, {
          signal: controller.signal
        });
        setToken(response.data.token);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Failed to retrieve Token');
        }
      } finally {
        setLoading(false);
      }
    };

    retrieveToken();

    return () => controller.abort();
  }, []);

  const selectedCategory = (category) => {
    setCategory(category);
  };

  const retryTokenFetch = () => {
    setLoading(true);
    setError(null);
    const retrieveToken = async () => {
      try {
        const response = await axios.get(requestTokenURL);
        setToken(response.data.token);
      } catch {
        setError('Failed to retrieve Token');
      } finally {
        setLoading(false);
      }
    };
    retrieveToken();
  };

  if (loading) return <div className="container text-center mt-5">Loading Token ...</div>;
  if (error) return (
    <div className="container text-center mt-5">
      <div>{error}</div>
      <Button variant="primary" onClick={retryTokenFetch} className="mt-3">
        Retry
      </Button>
    </div>
  );

  return (
    <div className="bg-dark text-white" style={{ minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Menu setCategory={selectedCategory}/>} />
        <Route path="/quiz/:categoryID/:difficulty/:type/" element={<Quiz token={token} category={category}/>} />
      </Routes>
    </div>
  )
}
