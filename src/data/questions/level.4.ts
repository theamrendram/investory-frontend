// Level 4 quiz questions
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const level4Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a market order?",
    options: [
      "An order to buy or sell immediately at the best available price",
      "An order to buy or sell at a specific price",
      "An order that is only valid for one day",
      "An order placed after market hours",
    ],
    answer: 0,
  },
  {
    id: 2,
    question: "What is a limit order?",
    options: [
      "An order to buy or sell at a specific price or better",
      "An order to buy or sell immediately at any price",
      "An order that is only for large investors",
      "An order that is always executed at market close",
    ],
    answer: 0,
  },
  {
    id: 3,
    question: "What does 'bid price' mean?",
    options: [
      "The highest price a buyer is willing to pay for a stock",
      "The lowest price a seller will accept",
      "The last traded price",
      "The price of a government bond",
    ],
    answer: 0,
  },
  {
    id: 4,
    question: "What does 'ask price' mean?",
    options: [
      "The lowest price a seller is willing to accept for a stock",
      "The highest price a buyer will pay",
      "The price of a mutual fund",
      "The price at market open",
    ],
    answer: 0,
  },
  {
    id: 5,
    question:
      "Which order type lets you set the maximum price you are willing to pay for a stock?",
    options: ["Limit order", "Market order", "Stop loss order", "Day order"],
    answer: 0,
  },
];

export default level4Questions;
