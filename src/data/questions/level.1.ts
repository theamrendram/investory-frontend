// Level 1 quiz questions
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const level1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does owning a stock represent?",
    options: [
      "A loan to a company",
      "Ownership in a company",
      "A type of bond",
      "A government security",
    ],
    answer: 1,
  },
  {
    id: 2,
    question: "Which of the following is a public company?",
    options: [
      "Ola Cabs",
      "Byjus",
      "Reliance Industries",
      "Your local grocery store",
    ],
    answer: 2,
  },
  {
    id: 3,
    question:
      "What is the main difference between a private and a public company?",
    options: [
      "Public companies are owned by the government",
      "Private companies have more employees",
      "Public companies are listed on a stock exchange",
      "Private companies are always startups",
    ],
    answer: 2,
  },
  {
    id: 4,
    question: "What are the full forms of NSE and BSE?",
    options: [
      "National Stock Exchange & Bombay Stock Exchange",
      "New Stock Exchange & Bharat Stock Exchange",
      "National Securities Exchange & Bombay Securities Exchange",
      "None of the above",
    ],
    answer: 0,
  },
  {
    id: 5,
    question: "Which city is known as the heart of India’s financial world?",
    options: ["Delhi", "Bangalore", "Mumbai", "Chennai"],
    answer: 2,
  },
  {
    id: 6,
    question: "Why do companies go public?",
    options: [
      "To raise money from the public",
      "To avoid paying taxes",
      "To become a government company",
      "To reduce their workforce",
    ],
    answer: 0,
  },
  {
    id: 7,
    question: "What is the role of a stock exchange?",
    options: [
      "To provide a marketplace for buying and selling stocks",
      "To lend money to companies",
      "To set company salaries",
      "To manage government bonds",
    ],
    answer: 0,
  },
];

export default level1Questions;
