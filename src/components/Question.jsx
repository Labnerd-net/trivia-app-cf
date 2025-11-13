import { useEffect } from 'react';
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { shuffleAnswers } from '../requests';

export default function Question({ question}) {
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
    <div>
      <div className="fs-4 fw-bold lead">
        <div dangerouslySetInnerHTML={{ __html: question.question }} />
      </div>
      <Button variant="primary" onClick={toggleShowAnswer}>
        Toggle Answer
      </Button>
      <ul className="list-group my-3">
        {shuffledAnswers.map((opt, index) => (
          <li key={index}
            className={`list-group-item list-group-item-action my-1 rounded-pill disabled 
            ${opt === question.correct_answer && showAnswers ? 'bg-success border border-success text-white' : ''}`}
          >
            <div dangerouslySetInnerHTML={{ __html: opt }} />
          </li>
        ))}
      </ul>
    </div>
  )
}
