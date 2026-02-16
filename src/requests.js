const baseUrl = 'https://opentdb.com/api.php'
export const requestTokenURL = 'https://opentdb.com/api_token.php?command=request';
export const baseCategoryUrl = 'https://opentdb.com/api_category.php'

export const difficulties = [
    { value: "all", label: "Any difficulty" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

export const types = [
    { value: "all", label: "Any type" },
    { value: "multiple", label: "Multiple Choice" },
    { value: "boolean", label: "True/False" },
];

/**
 * Decodes HTML entities in a string to prevent XSS while displaying special characters
 */
export function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Shuffles answers for a trivia question
 */
export function shuffleAnswers(question) {
  let answers = []

  if (question.type === 'multiple') {
    answers = [
      question.correct_answer,
      ...question.incorrect_answers,
    ];

    // Fisher-Yates shuffle
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
  } else {
    answers = ['True', 'False'];
  }

  return answers;
}

/**
 * Creates a properly formatted OpenTDB API URL
 */
export function createTriviaApiUrl(amount, categoryID, difficulty, type, token) {
  let url = `${baseUrl}?amount=${amount}&category=${categoryID}`;

  if (difficulty !== 'all') url += `&difficulty=${difficulty}`;
  if (type !== 'all') url += `&type=${type}`;
  if (token) url += `&token=${token}`;

  return url;
}
