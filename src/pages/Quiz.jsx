import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router";
import Button from 'react-bootstrap/Button'
import Question from '../components/Question';
import { createTriviaApiUrl, difficulties, types } from '../requests';
import axios from 'axios'


export default function Quiz({ token, category }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate()

  const numberOfQuestions = 10;
  const { categoryID, difficulty, type } = useParams();
  const url = createTriviaApiUrl(numberOfQuestions, categoryID, difficulty, type, token.token);
  
  const retreiveQuestions = async (url) => {
    try {
      console.log(url)
      const response = await axios.get(url);
      console.log(response.data)
      setQuestions(response.data);
    } catch (err) {
      console.log('Failed to retreive Questions')
      setError('Failed to retreive Questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     retreiveQuestions(url);
  }, [url]);

  const nextQuestions = () => {
    retreiveQuestions(url);
    window.scrollTo(0, 0)
    setPage((prev) => prev + 1)
  }

  const returnToMenu = () => {
    navigate(`/`)
  }

  if (loading) return <div>Loading Questions ...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="text-white">
      <div className="container my-5">
        <div className="d-flex flex-column justify-content-start align-items-start">
          <div className="d-flex flex-row justify-content-between align-items-center w-100 my-2">
            <div className="bg-info p-2 rounded-1">
              Category: {category.name}
            </div>
            <div className="bg-info p-2 rounded-1">
              Difficulty: {difficulties.find(diff => diff.value === difficulty).label}
            </div>
            <div className="bg-info p-2 rounded-1">
              Question Type: {types.find(t => t.value === type).label}
            </div>            
            <div className="bg-info p-2 rounded-1">
              <span className="my-2">Page {page + 1}</span>
            </div>
          </div>
        </div>
        <div>
          {questions.results.map((data, index) => (
            <Question key={index} question={data} />
          ))}
        </div>
        <Button variant="primary" onClick={nextQuestions}>
          Next Questions
        </Button>
        <Button variant="primary" onClick={returnToMenu}>
          Menu
        </Button>
      </div>
    </div>
  )
}
