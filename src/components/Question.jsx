import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { shuffleAnswers, decodeHtml } from '../requests';

export default function Question({ question }) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    const answers = shuffleAnswers(question);
    setShuffledAnswers(answers);
    setShowAnswers(false);
  }, [question]);

  const toggleShowAnswer = () => {
    setShowAnswers(!showAnswers)
  };

  return (
    <div className="mb-4">
      <div className="fs-4 fw-bold lead">
        {decodeHtml(question.question)}
      </div>
      <Button variant="primary" onClick={toggleShowAnswer} className="my-2">
        {showAnswers ? 'Hide Answer' : 'Show Answer'}
      </Button>
      <ul className="list-group my-3">
        {shuffledAnswers.map((opt) => (
          <li
            key={opt}
            className={`list-group-item list-group-item-action my-1 rounded-pill
            ${opt === question.correct_answer && showAnswers ? 'bg-success border border-success text-white' : 'bg-secondary'}`}
            aria-label={opt === question.correct_answer ? 'Correct answer' : 'Answer option'}
          >
            {decodeHtml(opt)}
          </li>
        ))}
      </ul>
    </div>
  )
}
