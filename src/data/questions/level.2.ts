// Level 2 quiz questions
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const level2Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does IPO stand for?",
    options: [
      "Initial Public Offering",
      "Indian Public Organization",
      "International Price Order",
      "Investment Portfolio Option",
    ],
    answer: 0,
  },
  {
    id: 2,
    question: "Why do companies issue an IPO?",
    options: [
      "To raise money from the public",
      "To become a private company",
      "To pay off all debts immediately",
      "To avoid regulations",
    ],
    answer: 0,
  },
  {
    id: 3,
    question: "What is a prospectus in the context of an IPO?",
    options: [
      "A document describing the company and the IPO details",
      "A type of stock certificate",
      "A government license",
      "A trading algorithm",
    ],
    answer: 0,
  },
  {
    id: 4,
    question: "What does 'oversubscription' mean in an IPO?",
    options: [
      "More people want shares than are available",
      "The IPO is cancelled",
      "The company issues more shares than planned",
      "The IPO is only for private investors",
    ],
    answer: 0,
  },
  {
    id: 5,
    question:
      "If you invest in an IPO and it is oversubscribed, what might happen?",
    options: [
      "You may get fewer shares than you applied for",
      "You get all the shares you applied for",
      "You get no shares at all",
      "You automatically get a refund",
    ],
    answer: 0,
  },
  {
    id: 6,
    question: "What is the minimum investment amount for most IPOs in India?",
    options: [
      "₹10,000 - ₹15,000",
      "₹1,000 - ₹5,000",
      "₹50,000 - ₹1,00,000",
      "There is no minimum amount",
    ],
    answer: 0,
  },
  {
    id: 7,
    question: "Which regulatory body oversees IPOs in India?",
    options: [
      "SEBI (Securities and Exchange Board of India)",
      "RBI (Reserve Bank of India)",
      "NSE (National Stock Exchange)",
      "BSE (Bombay Stock Exchange)",
    ],
    answer: 0,
  },
];

export default level2Questions;
