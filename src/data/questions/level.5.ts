// Level 5 quiz questions
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const level5Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a stock portfolio?",
    options: [
      "A collection of different investments held by an individual",
      "A single stock owned by a person",
      "A government bond certificate",
      "A type of trading account",
    ],
    answer: 0,
  },
  {
    id: 2,
    question: "Why is diversification important in investing?",
    options: [
      "It helps reduce risk by spreading investments across different assets",
      "It guarantees higher returns",
      "It is required by law",
      "It only benefits large investors",
    ],
    answer: 0,
  },
  {
    id: 3,
    question: "If you put all your money in one stock, what is the main risk?",
    options: [
      "You could lose a lot if that one stock performs badly",
      "You will always make a profit",
      "You will pay less tax",
      "You will get more dividends",
    ],
    answer: 0,
  },
  {
    id: 4,
    question: "What is the relationship between risk and reward in investing?",
    options: [
      "Higher potential reward usually comes with higher risk",
      "Lower risk always means higher reward",
      "There is no relationship",
      "Risk only matters for short-term investors",
    ],
    answer: 0,
  },
  {
    id: 5,
    question: "Which of the following is an example of diversification?",
    options: [
      "Investing in stocks from different sectors",
      "Putting all money in one company",
      "Only buying government bonds",
      "Investing only in real estate",
    ],
    answer: 0,
  },
];

export default level5Questions;
