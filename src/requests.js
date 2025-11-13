import axios from 'axios'

const baseUrl = 'https://opentdb.com/api.php'
export const requestTokenURL = 'https://opentdb.com/api_token.php?command=request';
export const baseCategoryUrl = 'https://opentdb.com/api_category.php'
const baseCategoryCountUrl = 'https://opentdb.com/api_count.php'

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

export function shuffleAnswers(question) {
  var answers = []

  if (question.type === 'multiple' ) {
    answers = [
      question.correct_answer,
      ...question.incorrect_answers,
    ];

    for (var i = answers.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); 
      [answers[i], answers[j]] = [answers[j], answers[i]]; 
    };
  } else {
    answers = ['True', 'False'];
  }

  return answers;
};

export function createTriviaApiUrl(amount, categoryID, difficulty, type, token) {
  let url = `${baseUrl}?amount=${amount}&category=${categoryID}`;

  if (difficulty !== 'all') url += `&difficulty=${difficulty}`;
  if (type !== 'all') url += `&type=${type}`;
  if (token) url += `&token=${token}`;

  return url;
};

// - https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&token=???
//   - amount = # of questions
//   - category = defined below
//   - difficulty = easy/medium/hard
//   - type = boolean/multiple
//   - token = api token


// - https://opentdb.com/api_category.php # category list and ids
export async function getCategories() {
  try {
    const response = await axios.get(baseCategoryUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
// { "id": 9, "name": "General Knowledge" }

// - https://opentdb.com/api_count.php?category=CATEGORY_ID_HERE # number of questions in a category
export async function getCategoryCount(categoryID) {
  try {
    const response = await axios.get(baseCategoryCountUrl, {
      params: {
        category: categoryID
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
// {
//   "category_id": 9,
//   "category_question_count": {
//     "total_question_count": 365,
//     "total_easy_question_count": 161,
//     "total_medium_question_count": 142,
//     "total_hard_question_count": 62
//   }
// }
