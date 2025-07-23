// Level 3 quiz questions
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const level3Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a bull market?",
    options: [
      "A market where prices are rising or expected to rise",
      "A market where prices are falling",
      "A market with no trading activity",
      "A market for cattle stocks only",
    ],
    answer: 0,
  },
  {
    id: 2,
    question: "What is a bear market?",
    options: [
      "A market where prices are rising",
      "A market where prices are falling or expected to fall",
      "A market for animal products",
      "A market with only government bonds",
    ],
    answer: 1,
  },
  {
    id: 3,
    question: "How does investor sentiment affect stock prices?",
    options: [
      "Positive sentiment can drive prices up, negative sentiment can drive prices down",
      "Sentiment has no effect on prices",
      "Only government policy affects prices",
      "Sentiment only affects bond markets",
    ],
    answer: 0,
  },
  {
    id: 4,
    question: "Which of the following events could trigger a bear market?",
    options: [
      "A major economic crisis",
      "A new product launch",
      "A company paying dividends",
      "A sports event win",
    ],
    answer: 0,
  },
  {
    id: 5,
    question: "How can global news impact the Indian stock market?",
    options: [
      "It can cause prices to rise or fall depending on the news",
      "It has no impact at all",
      "It only affects foreign stocks",
      "It only affects the bond market",
    ],
    answer: 0,
  },
];

export default level3Questions;
