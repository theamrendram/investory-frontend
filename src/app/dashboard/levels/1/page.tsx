"use client";

import { useState } from "react";
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
import nse_logo from "@/public/nse.png";

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

export default function Level1Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [companyAnswers, setCompanyAnswers] = useState<Record<string, string>>(
    {}
  );

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
    router.push("./2");
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
          task.id === 2 ? { ...task, completed: true } : task
        )
      );
    }
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
                              : "border-muted-foreground"
                          )}
                          onClick={() => toggleTask(1)}>
                          {tasks[0].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[0].completed && "line-through opacity-70"
                          )}>
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
                              allowFullScreen></iframe>
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
                              : "border-muted-foreground"
                          )}
                          onClick={() => toggleTask(2)}>
                          {tasks[1].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[1].completed && "line-through opacity-70"
                          )}>
                          {tasks[1].title}
                        </span>
                      </div>
                      {!tasks[1].completed && (
                        <div className="ml-7 mt-2 space-y-4">
                          {companies.map((company) => (
                            <div
                              key={company.name}
                              className="rounded-lg border p-3">
                              <p className="mb-2 font-medium">{company.name}</p>
                              <RadioGroup
                                value={companyAnswers[company.name]}
                                onValueChange={(value) =>
                                  handleCompanyTypeChange(company.name, value)
                                }>
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
                              : "border-muted-foreground"
                          )}
                          onClick={() => toggleTask(3)}>
                          {tasks[2].completed && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            tasks[2].completed && "line-through opacity-70"
                          )}>
                          {tasks[2].title}
                        </span>
                      </div>
                      {!tasks[2].completed && (
                        <div className="ml-7 mt-2">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-3">
                              <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                <div className="flex h-full items-center justify-center">
                                  <Image
                                    src={"/nse.png"}
                                    width={100}
                                    height={100}
                                    alt="National Stock Exchange"
                                    className="w-full h-ful"
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
                                      alt="National Stock Exchange"
                                      className="w-full h-full"
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
            isCompleted={isCompleted}
            onClaim={completeLevel}
          />

          <HelpCard
            links={[
              { icon: BookOpen, label: "Read the glossary", href: "#" },
              { icon: CircleHelp, label: "Watch tutorial video", href: "#" },
            ]}
          />
        </div>
      </div>
    </GameLayout>
  );
}
