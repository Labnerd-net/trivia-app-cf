import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router'
import axios from 'axios'
import { baseCategoryUrl, difficulties, types } from '../requests';

export default function Menu({ setCategory }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: '9',
    difficulty: 'all',
    type: 'all',
  });

  useEffect(() => {
    const controller = new AbortController();

    const retrieveCategories = async () => {
      try {
        const response = await axios.get(baseCategoryUrl, {
          signal: controller.signal
        });
        setCategories(response.data.trivia_categories);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Failed to retrieve Categories');
        }
      } finally {
        setLoading(false);
      }
    };

    retrieveCategories();

    return () => controller.abort();
  }, []);

  const selectCategory = (event) => {
    setFormData((prev) => ({
      ...prev,
      category: event.target.value,
    }))
  }

  const selectDifficulty = (event) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: event.target.value,
    }))
  }

  const selectType = (event) => {
    setFormData((prev) => ({
      ...prev,
      type: event.target.value,
    }))
  }

  const startQuiz = (event) => {
    event.preventDefault()
    const chosenCategory = categories.find((cat) => Number(cat.id) === Number(formData.category));
    setCategory(chosenCategory);
    navigate(`/quiz/${formData.category}/${formData.difficulty}/${formData.type}/`)
  }

  if (loading) return <div className="container text-center mt-5">Loading Categories ...</div>;
  if (error) return <div className="container text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="container d-flex flex-column align-items-start justify-content-center w-100 py-5 text-white">
      <Form onSubmit={startQuiz}>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Select a Trivia category</Form.Label>
          <Form.Select
            label="Category"
            name="category"
            onChange={selectCategory}
            value={formData.category}
          >
            {categories.map((data) =>
              <option key={data.id} value={data.id}>{data.name}</option>
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formDifficulty">
          <Form.Label>Select a Trivia difficulty</Form.Label>
          <Form.Select
            label="Difficulty"
            name="difficulty"
            onChange={selectDifficulty}
            value={formData.difficulty}
          >
            {difficulties.map((data) =>
              <option key={data.value} value={data.value}>{data.label}</option>
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formType">
          <Form.Label>Select a Trivia type</Form.Label>
          <Form.Select
            label="Type"
            name="type"
            onChange={selectType}
            value={formData.type}
          >
            {types.map((data) =>
              <option key={data.value} value={data.value}>{data.label}</option>
            )}
         </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Get Trivia Questions
        </Button>
      </Form>
    </div>
  )
}
