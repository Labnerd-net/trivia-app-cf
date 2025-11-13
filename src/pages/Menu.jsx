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

  // - https://opentdb.com/api_category.php # category list and ids
  // - response: { "id": 9, "name": "General Knowledge" }

  useEffect(() => {
    const retreiveCategories = async () => {
      try {
        const response = await axios.get(baseCategoryUrl);
        console.log(response.data.trivia_categories);
        setCategories(response.data.trivia_categories);
      } catch (err) {
        setError('Failed to retreive Categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    retreiveCategories();
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

  if (loading) return <div>Loading Categories ...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container d-flex flex-column align-items-start justify-content-center w-100 py-5 text-white">
      <Form onSubmit={startQuiz}>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Select a Trivia category</Form.Label>
          <Form.Select
            label="Category"
            name="category"
            onChange={selectCategory}>
            {categories.map((data, index) =>
              <option key={index} value={data.id}>{data.name}</option> 
            )};
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Select a Trivia difficulty</Form.Label>
          <Form.Select 
            label="Category"
            name="category"
            onChange={selectDifficulty}>
            {difficulties.map((data, index) =>
              <option key={index} value={data.value}>{data.label}</option> 
            )};
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Select a Trivia type</Form.Label>
          <Form.Select
            label="Type"
            name="type"
            onChange={selectType}>
            {types.map((data, index) =>
              <option key={index} value={data.value}>{data.label}</option> 
            )};
         </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Get Trivia Questions
        </Button>
      </Form>
    </div>
  )
}
