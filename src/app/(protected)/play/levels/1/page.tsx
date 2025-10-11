"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, CircleHelp, Lightbulb } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
import LevelHeader from "@/components/level-header";
import RewardCard from "@/components/reward-card";
import HelpCard from "@/components/help-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import createAxiosInstance from "@/lib/axios-instance";
import { useUserStore } from "@/store/user-store";
import level1Questions from "@/data/questions/level.1";
import { QuizComponent } from "@/components/quiz-component";

const levelData = {
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
      title: "Identify whether given companies are public or private",
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
};

const companies = [
  { name: "Reliance Industries", type: "public" },
  { name: "Tata Consultancy Services", type: "public" },
  { name: "Zomato", type: "public" },
  { name: "Ola Cabs", type: "private" },
  { name: "Byjus", type: "private" },
];

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const quizQuestions: QuizQuestion[] = [
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

function getQuizScore(
  quizAnswers: Record<number, number>,
  quizQuestions: QuizQuestion[],
) {
  let score = 0;
  for (const q of quizQuestions) {
    if (quizAnswers[q.id] === q.answer) score++;
  }
  return score;
}

export default function Level1Page() {
  const router = useRouter();
  const pathname = usePathname();
  const levelPath = pathname.split("/").pop();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [companyAnswers, setCompanyAnswers] = useState<Record<string, string>>(
    {},
  );
  const [hasCompleted, setHasCompleted] = useState(false);
  const hasCalledComplete = useRef(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

  const user = useUserStore((state) => state.user);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );

    // Check if all tasks are completed
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );

    if (updatedTasks.every((task) => task.completed)) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const completeLevel = async () => {
    if (!isCompleted) {
      alert("Please complete all tasks before proceeding.");
      return;
    }

    if (!quizCompleted) {
      alert("Please complete the quiz before claiming rewards.");
      return;
    }

    const percentage = (quizScore / quizTotal) * 100;
    if (percentage < 70) {
      alert(
        `You need at least 70% to pass. Your score: ${percentage.toFixed(1)}%`,
      );
      return;
    }

    try {
      const axiosInstance = await createAxiosInstance();
      const response = await axiosInstance.post(
        `/api/progress/level/${levelData.id}/complete`,
        {
          rewardMoney: levelData.reward.money,
          badgeName: levelData.reward.badge,
        },
      );

      if (response.status === 200) {
        if (levelData.id < 5) {
          router.push(`./${levelData.id + 1}`);
        } else {
          router.push("/play");
        }
      }
    } catch (error: any) {
      console.error("Error completing level:", error);
      alert(error.response?.data?.message || "Error completing level");
    }
  };

  const handleCompanyTypeChange = (company: string, value: string) => {
    setCompanyAnswers((prev) => ({
      ...prev,
      [company]: value,
    }));

    // Check if all companies have been answered
    const updatedAnswers = {
      ...companyAnswers,
      [company]: value,
    };

    if (Object.keys(updatedAnswers).length === companies.length) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 2 ? { ...task, completed: true } : task,
        ),
      );
    }
  };

  const handleQuizAnswer = (questionId: number, optionIdx: number) => {
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionIdx };
      // If all questions are answered, mark the task as complete
      if (Object.keys(updated).length === quizQuestions.length) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === 3 ? { ...task, completed: true } : task,
          ),
        );
      }
      return updated;
    });
  };

  const handleQuizComplete = async (score: number, total: number) => {
    console.log(`Quiz completed: ${score}/${total}`);
    setQuizScore(score);
    setQuizTotal(total);
    setQuizCompleted(true);
    // Quiz progress is already saved by QuizComponent
  };

  // Removed auto-completion useEffect - level now only completes when user clicks "Claim Reward"

  return (
    <GameLayout>
      <LevelHeader
        levelId={levelData.id}
        title={levelData.title}
        subtitle={levelData.subtitle}
        isCompleted={isCompleted}
        onComplete={completeLevel}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{levelData.story}</p>
                    <div className="mt-4 rounded-lg bg-muted p-4">
                      <div className="flex items-start gap-2">
                        <CircleHelp className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Mentor's Tip</h4>
                          <p className="text-sm text-muted-foreground">
                            The stock market can seem complex at first, but
                            remember that at its core, it's simply a marketplace
                            where people buy and sell ownership in companies.
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
                    {levelData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
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
                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex items-start gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border",
                            tasks[0].completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground",
                          )}
                          onClick={() => toggleTask(1)}
                        >
                          {tasks[0].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[0].completed && "line-through opacity-70",
                          )}
                        >
                          {tasks[0].title}
                        </span>
                      </div>
                      {!tasks[0].completed && (
                        <div className="ml-7 mt-2">
                          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <iframe
                              className="h-full w-full object-cover"
                              src="https://www.youtube.com/embed/p7HKvqRI_Bo?si=UkA2fL-LWj5v2sUr"
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex items-start gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border",
                            tasks[1].completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground",
                          )}
                          onClick={() => toggleTask(2)}
                        >
                          {tasks[1].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[1].completed && "line-through opacity-70",
                          )}
                        >
                          {tasks[1].title}
                        </span>
                      </div>
                      {!tasks[1].completed && (
                        <div className="ml-7 mt-2 space-y-4">
                          {companies.map((company) => (
                            <div
                              key={company.name}
                              className="rounded-lg border p-3"
                            >
                              <p className="mb-2 font-medium">{company.name}</p>
                              <RadioGroup
                                value={companyAnswers[company.name]}
                                onValueChange={(value) =>
                                  handleCompanyTypeChange(company.name, value)
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="public"
                                    id={`${company.name}-public`}
                                  />
                                  <Label htmlFor={`${company.name}-public`}>
                                    Public Company
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="private"
                                    id={`${company.name}-private`}
                                  />
                                  <Label htmlFor={`${company.name}-private`}>
                                    Private Company
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex items-start gap-2">
                        <div
                          className={cn(
                            "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border",
                            tasks[2].completed
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground",
                          )}
                          onClick={() => toggleTask(3)}
                        >
                          {tasks[2].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[2].completed && "line-through opacity-70",
                          )}
                        >
                          {tasks[2].title}
                        </span>
                      </div>
                      {!tasks[2].completed && (
                        <div className="ml-7 mt-2 space-y-6">
                          {quizQuestions.map((q) => (
                            <div key={q.id} className="rounded-lg border p-3">
                              <p className="mb-2 font-medium">{q.question}</p>
                              <RadioGroup
                                value={quizAnswers[q.id]?.toString()}
                                onValueChange={(val) =>
                                  handleQuizAnswer(q.id, Number(val))
                                }
                              >
                                {q.options.map((opt, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={idx.toString()}
                                      id={`q${q.id}-opt${idx}`}
                                    />
                                    <Label htmlFor={`q${q.id}-opt${idx}`}>
                                      {opt}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                          {tasks[2].completed && (
                            <div className="mt-4 rounded-lg border bg-green-50 p-3 text-green-900 dark:bg-green-900/20 dark:text-green-200">
                              <p className="font-semibold">Quiz Complete!</p>
                              <p>
                                You scored{" "}
                                {getQuizScore(quizAnswers, quizQuestions)} out
                                of {quizQuestions.length}.
                              </p>
                            </div>
                          )}
                          {/* Existing logo matching quiz (optional, can be kept as bonus) */}
                          <div className="rounded-lg border p-3">
                            <p className="mb-2 font-medium">
                              Match the stock exchange logos with their names:
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="rounded-lg border p-3">
                                <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                  <div className="flex h-full items-center justify-center">
                                    <Image
                                      src={"/nse.png"}
                                      width={100}
                                      height={100}
                                      alt="National Stock Exchange"
                                      className="h-ful w-full"
                                    />
                                  </div>
                                </div>
                                <RadioGroup>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="nse" id="nse-1" />
                                    <Label htmlFor="nse-1">
                                      National Stock Exchange
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bse" id="bse-1" />
                                    <Label htmlFor="bse-1">
                                      Bombay Stock Exchange
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              <div className="rounded-lg border p-3">
                                <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                  <div className="flex h-full items-center justify-center">
                                    <Image
                                      src={"/bse.webp"}
                                      width={100}
                                      height={100}
                                      alt="Bombay Stock Exchange"
                                      className="h-full w-full"
                                    />
                                  </div>
                                </div>
                                <RadioGroup>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="nse" id="nse-2" />
                                    <Label htmlFor="nse-2">
                                      National Stock Exchange
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bse" id="bse-2" />
                                    <Label htmlFor="bse-2">
                                      Bombay Stock Exchange
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
          <RewardCard
            badge={levelData.reward.badge}
            money={levelData.reward.money}
            isCompleted={isCompleted && quizCompleted}
            onClaim={completeLevel}
            levelId={levelData.id}
            levelTitle={`Level ${levelData.id} Reward`}
          />

          <HelpCard
            links={[
              { icon: BookOpen, label: "Read the glossary", href: "#" },
              { icon: CircleHelp, label: "Watch tutorial video", href: "#" },
            ]}
          />
        </div>
      </div>
      <QuizComponent
        questions={level1Questions}
        onComplete={handleQuizComplete}
        showDialog={true}
        levelId={levelData.id}
      />
    </GameLayout>
  );
}
