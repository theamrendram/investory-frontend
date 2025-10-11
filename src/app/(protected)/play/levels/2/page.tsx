"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import createAxiosInstance from "@/lib/axios-instance";
import {
  BookOpen,
  CheckCircle2,
  CircleHelp,
  FileText,
  Lightbulb,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import GameLayout from "@/components/game-layout";
import LevelHeader from "@/components/level-header";
import RewardCard from "@/components/reward-card";
import HelpCard from "@/components/help-card";
import level2Questions from "@/data/questions/level.2";
import { QuizComponent } from "@/components/quiz-component";

const levelData = {
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
    { id: 3, title: "Quiz: Fill in the blanks", completed: false },
  ],
  reward: {
    badge: "IPO Detective",
    money: 5000,
  },
};

export default function Level2Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);

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

  const handleInvestmentSubmit = () => {
    // Mark the task as completed
    setTasks((prev) =>
      prev.map((task) => (task.id === 2 ? { ...task, completed: true } : task)),
    );
  };

  const handleQuizSubmit = () => {
    // Check if all questions are answered
    if (quizAnswers.q1 && quizAnswers.q2 && quizAnswers.q3) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 3 ? { ...task, completed: true } : task,
        ),
      );
    }
  };

  const handleQuizComplete = async (score: number, total: number) => {
    console.log(`Quiz completed: ${score}/${total}`);
    setQuizScore(score);
    setQuizTotal(total);
    setQuizCompleted(true);
    // Quiz progress is already saved by QuizComponent
  };

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
                            When a company goes public through an IPO, it's a
                            significant milestone. It's opening its doors for
                            anyone to become a part-owner.
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
                          <Card>
                            <CardHeader className="bg-muted/50 py-2">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <CardTitle className="text-base">
                                  TechFuture Ltd. - IPO Prospectus
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 text-sm">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold">
                                    Company Overview
                                  </h3>
                                  <p>
                                    TechFuture Ltd. is a technology company
                                    specializing in artificial intelligence
                                    solutions for businesses.
                                  </p>
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    Offer Details
                                  </h3>
                                  <ul className="list-disc space-y-1 pl-5">
                                    <li>Issue Size: ₹500 Crores</li>
                                    <li>Price Band: ₹900 - ₹950 per share</li>
                                    <li>Lot Size: 15 shares</li>
                                    <li>Issue Opens: April 15, 2023</li>
                                    <li>Issue Closes: April 18, 2023</li>
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="font-semibold">
                                    Use of Proceeds
                                  </h3>
                                  <p>
                                    The company intends to use the funds for:
                                  </p>
                                  <ul className="list-disc space-y-1 pl-5">
                                    <li>
                                      Expansion of R&D facilities (₹200 Crores)
                                    </li>
                                    <li>Debt repayment (₹150 Crores)</li>
                                    <li>
                                      Working capital requirements (₹100 Crores)
                                    </li>
                                    <li>
                                      General corporate purposes (₹50 Crores)
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t p-2">
                              <Button size="sm" onClick={() => toggleTask(1)}>
                                Mark as Read
                              </Button>
                            </CardFooter>
                          </Card>
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
                        <div className="ml-7 mt-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                InnoTech IPO Simulation
                              </CardTitle>
                              <CardDescription>
                                Decide how much to invest in this IPO
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="rounded-lg bg-muted p-3">
                                  <h3 className="mb-2 font-medium">
                                    InnoTech Ltd. IPO Details
                                  </h3>
                                  <ul className="space-y-1 text-sm">
                                    <li>Price: ₹500 per share</li>
                                    <li>Minimum lot: 10 shares (₹5,000)</li>
                                    <li>Expected listing gain: 15-20%</li>
                                    <li>Risk level: Moderate</li>
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="mb-2 font-medium">
                                    Your Investment
                                  </h3>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm">
                                          Amount to Invest
                                        </span>
                                        <span className="text-sm font-medium">
                                          ₹{investmentAmount.toLocaleString()}
                                        </span>
                                      </div>
                                      <Slider
                                        value={[investmentAmount]}
                                        min={5000}
                                        max={50000}
                                        step={5000}
                                        onValueChange={(value) =>
                                          setInvestmentAmount(value[0])
                                        }
                                      />
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                          Shares you'll get
                                        </span>
                                        <span className="text-sm font-medium">
                                          {Math.floor(investmentAmount / 500)}{" "}
                                          shares
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t">
                              <Button onClick={handleInvestmentSubmit}>
                                Submit Application
                              </Button>
                            </CardFooter>
                          </Card>
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
                        <div className="ml-7 mt-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Fill in the Blanks
                              </CardTitle>
                              <CardDescription>
                                Complete the sentences about IPOs
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <p className="mb-2">
                                    A company issues an IPO to raise{" "}
                                    <Input
                                      className="mx-1 inline-block w-32"
                                      value={quizAnswers.q1}
                                      onChange={(e) =>
                                        setQuizAnswers({
                                          ...quizAnswers,
                                          q1: e.target.value,
                                        })
                                      }
                                    />
                                    .
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-2">
                                    The document that contains all details about
                                    a company's IPO is called a{" "}
                                    <Input
                                      className="mx-1 inline-block w-32"
                                      value={quizAnswers.q2}
                                      onChange={(e) =>
                                        setQuizAnswers({
                                          ...quizAnswers,
                                          q2: e.target.value,
                                        })
                                      }
                                    />
                                    .
                                  </p>
                                </div>
                                <div>
                                  <p className="mb-2">
                                    When an IPO receives more applications than
                                    available shares, it is called{" "}
                                    <Input
                                      className="mx-1 inline-block w-32"
                                      value={quizAnswers.q3}
                                      onChange={(e) =>
                                        setQuizAnswers({
                                          ...quizAnswers,
                                          q3: e.target.value,
                                        })
                                      }
                                    />
                                    .
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t">
                              <Button onClick={handleQuizSubmit}>
                                Submit Answers
                              </Button>
                            </CardFooter>
                          </Card>
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
              { icon: BookOpen, label: "IPO Glossary", href: "#" },
              { icon: CircleHelp, label: "How IPOs work", href: "#" },
            ]}
          />
        </div>
      </div>
      <QuizComponent
        questions={level2Questions}
        onComplete={handleQuizComplete}
        showDialog={true}
        levelId={levelData.id}
      />
    </GameLayout>
  );
}
