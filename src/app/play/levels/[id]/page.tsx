"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Lightbulb,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import GameLayout from "@/components/game-layout";
import { useEffect } from "react";

const levelData = [
  {
    id: 1,
    title: "The Market Awakens",
    subtitle: "Understanding Stocks",
    story:
      "You are Aman, a young entrepreneur in Mumbai, eager to understand how businesses grow. One day, your mentor, Mr. Mehta, a retired stockbroker, takes you to Dalal Street, the heart of India's financial world.",
    objectives: [
      "What is a stock? (Owning a piece of a company)",
      "Difference between private and public companies",
      "Introduction to NSE and BSE (India's major stock exchanges)",
    ],
    tasks: [
      {
        id: 1,
        title: "Watch an animated introduction to the stock market",
        completed: false,
      },
      {
        id: 2,
        title:
          "Identify whether given companies (e.g., Reliance, Zomato, Tata Steel) are public or private",
        completed: false,
      },
      {
        id: 3,
        title: "Quiz: Match stock exchange logos with their names",
        completed: false,
      },
    ],
    reward: {
      badge: "The Curious Investor",
      money: 10000,
    },
  },
  {
    id: 2,
    title: "The IPO Mystery",
    subtitle: "How Companies Go Public",
    story:
      'Mr. Mehta hands you an old newspaper clipping about Infosys\' IPO in 1993. "Do you know how companies enter the stock market?" he asks. You decide to investigate.',
    objectives: [
      "What is an IPO (Initial Public Offering)?",
      "Why do companies list on the stock exchange?",
      "Basic terms: Prospectus, Subscription, Oversubscription",
    ],
    tasks: [
      { id: 1, title: "Read a simplified IPO prospectus", completed: false },
      {
        id: 2,
        title:
          "Participate in a simulated IPO (decide how much to invest in a mock IPO)",
        completed: false,
      },
      {
        id: 3,
        title:
          'Quiz: Fill in the blanks (e.g., "A company issues an IPO to raise __?")',
        completed: false,
      },
    ],
    reward: {
      badge: "IPO Detective",
      money: 5000,
    },
  },
  {
    id: 3,
    title: "The Bulls & Bears",
    subtitle: "Understanding Market Trends",
    story:
      'You hear heated arguments at a tea stall near the exchange. "The market is bullish!" "No, it\'s a bear trap!" Confused, you ask Mr. Mehta.',
    objectives: [
      "What are bull and bear markets?",
      "How investor sentiment affects stock prices",
      "How global news impacts the Indian stock market",
    ],
    tasks: [
      {
        id: 1,
        title: "Watch a simulation of bull and bear market scenarios",
        completed: false,
      },
      {
        id: 2,
        title:
          "Identify whether past events (e.g., 2008 crash, 2020 COVID dip) were bullish or bearish",
        completed: false,
      },
      {
        id: 3,
        title:
          "Choose a reaction: If a market falls by 10%, what would you do?",
        completed: false,
      },
    ],
    reward: {
      badge: "Market Observer",
      money: 2500,
    },
  },
  {
    id: 4,
    title: "The Trading Terminal",
    subtitle: "Placing Your First Order",
    story:
      'Mr. Mehta takes you inside a broker\'s office and shows you a trading terminal. "Ready to place your first trade?" he asks.',
    objectives: [
      "Difference between market order and limit order",
      "Basics of bid/ask prices",
      "How to place a buy or sell order",
    ],
    tasks: [
      {
        id: 1,
        title: "Watch a walkthrough of a real trading screen (dummy interface)",
        completed: false,
      },
      {
        id: 2,
        title:
          "Practice placing a virtual order (e.g., Buy 10 shares of Tata Motors)",
        completed: false,
      },
      {
        id: 3,
        title:
          "Quiz: Match order types (Market, Limit, Stop Loss) with their definitions",
        completed: false,
      },
    ],
    reward: {
      badge: "The First Trade",
      money: 5000,
    },
  },
  {
    id: 5,
    title: "The Portfolio Puzzle",
    subtitle: "Managing Your Investments",
    story:
      'You\'ve now bought your first stocks, but Mr. Mehta warns: "Owning stocks is easy. Managing them is the real challenge."',
    objectives: [
      "What is a stock portfolio?",
      "Understanding diversification (why not put all money in one stock?)",
      "Risk vs. Reward in stock investing",
    ],
    tasks: [
      {
        id: 1,
        title:
          "Arrange a sample portfolio (e.g., 40% Tech, 30% Banking, 20% FMCG, 10% Cash)",
        completed: false,
      },
      {
        id: 2,
        title:
          "Predict the impact of a news event (e.g., RBI hikes interest rates—how does it affect banking stocks?)",
        completed: false,
      },
      {
        id: 3,
        title:
          "Quiz: If you had ₹50,000 to invest, how would you split it between 5 sectors?",
        completed: false,
      },
    ],
    reward: {
      badge: "Portfolio Strategist",
      money: 5000,
    },
  },
];

const questionImports: Record<number, () => Promise<any>> = {
  1: () => import("@/data/questions/level.1"),
  2: () => import("@/data/questions/level.2"),
  3: () => import("@/data/questions/level.3"),
  4: () => import("@/data/questions/level.4"),
  5: () => import("@/data/questions/level.5"),
};

function QuestionsSection({ levelId }: { levelId: number }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    if (questionImports[levelId]) {
      questionImports[levelId]().then((mod) => setQuestions(mod.default || []));
    }
  }, [levelId]);

  const handleAnswer = (qid: number, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const score = questions.reduce(
    (acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc),
    0
  );

  if (!questions.length) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>Test your knowledge for this level</CardDescription>
      </CardHeader>
      <CardContent>
        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="font-medium mb-2">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt: string, idx: number) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={idx}
                    checked={answers[q.id] === idx}
                    onChange={() => handleAnswer(q.id, idx)}
                    disabled={showScore}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!showScore && (
          <Button
            className="mt-4"
            disabled={Object.keys(answers).length !== questions.length}
            onClick={() => setShowScore(true)}>
            Submit Quiz
          </Button>
        )}
        {showScore && (
          <div className="mt-4 p-4 rounded bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200">
            <p className="font-semibold">Quiz Complete!</p>
            <p>
              You scored {score} out of {questions.length}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = Number.parseInt(params.id as string);
  const level = levelData.find((l) => l.id === levelId) || levelData[0];

  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(level.tasks);
  const [isCompleted, setIsCompleted] = useState(false);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // Check if all tasks are completed
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    if (updatedTasks.every((task) => task.completed)) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const completeLevel = () => {
    // In a real app, you would save progress to the backend here
    if (levelId < 5) {
      router.push(`/play/levels/${levelId + 1}`);
    } else {
      router.push("/play");
    }
  };

  return (
    <GameLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Level {level.id}: {level.title}
          </h1>
          <p className="text-muted-foreground">{level.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {levelId > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/play/levels/${levelId - 1}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Level
              </Link>
            </Button>
          )}
          {levelId < 5 && !isCompleted && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/play/levels/${levelId + 1}`}>
                Next Level
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {isCompleted && (
            <Button size="sm" onClick={completeLevel}>
              {levelId < 5 ? (
                <>
                  Next Level
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Complete Game"
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="story">
                <BookOpen className="mr-2 h-4 w-4" />
                Story
              </TabsTrigger>
              <TabsTrigger value="objectives">
                <Lightbulb className="mr-2 h-4 w-4" />
                Objectives
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="story" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Story</CardTitle>
                  <CardDescription>
                    Follow Aman's journey into the world of stocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{level.story}</p>
                    <div className="mt-4 rounded-lg bg-muted p-4">
                      <div className="flex items-start gap-2">
                        <CircleHelp className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Mentor's Tip</h4>
                          <p className="text-sm text-muted-foreground">
                            {level.id === 1 &&
                              "The stock market can seem complex at first, but remember that at its core, it's simply a marketplace where people buy and sell ownership in companies."}
                            {level.id === 2 &&
                              "When a company goes public through an IPO, it's a significant milestone. It's opening its doors for anyone to become a part-owner."}
                            {level.id === 3 &&
                              "Market sentiment is powerful. Understanding whether we're in a bull or bear market helps you make better investment decisions."}
                            {level.id === 4 &&
                              "Your first trade is a big step. Take your time to understand the different order types before placing real trades."}
                            {level.id === 5 &&
                              "A well-balanced portfolio is like a good cricket team - you need different players with different strengths to win in various conditions."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="objectives" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>
                    What you'll learn in this level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {level.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="mt-0.5 h-5 w-5 text-primary" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Complete these tasks to finish the level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {tasks.map((task) => (
                      <li key={task.id} className="flex items-start gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border",
                            task.completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          )}
                          onClick={() => toggleTask(task.id)}>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            task.completed && "line-through opacity-70"
                          )}>
                          {task.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm">
                        {completedTasks}/{tasks.length} tasks
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Level Reward</CardTitle>
              <CardDescription>
                Complete all tasks to earn this reward
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">{level.reward.badge}</h3>
                  <p className="text-sm text-muted-foreground">Badge</p>
                </div>
                <div className="text-center">
                  <h3 className="font-medium">
                    ₹{level.reward.money.toLocaleString()}
                  </h3>
                  <p className="text-sm text-muted-foreground">Virtual Money</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!isCompleted}
                onClick={completeLevel}>
                {isCompleted ? "Claim Reward" : "Complete All Tasks"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Resources for this level</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <BookOpen className="h-4 w-4" />
                    <span>Read the glossary</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <CircleHelp className="h-4 w-4" />
                    <span>Watch tutorial video</span>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <QuestionsSection levelId={levelId} />
    </GameLayout>
  );
}
