"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  CircleHelp,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GameLayout from "@/components/game-layout";
import LevelHeader from "@/components/level-header";
import RewardCard from "@/components/reward-card";
import HelpCard from "@/components/help-card";

const levelData = {
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
      title: "Identify whether past events were bullish or bearish",
      completed: false,
    },
    {
      id: 3,
      title: "Choose a reaction: If a market falls by 10%, what would you do?",
      completed: false,
    },
  ],
  reward: {
    badge: "Market Observer",
    money: 2500,
  },
};

const marketEvents = [
  { id: 1, event: "2008 Global Financial Crisis", type: "bearish" },
  { id: 2, event: "2020 COVID-19 Market Crash", type: "bearish" },
  { id: 3, event: "2017 Bull Run in Indian Markets", type: "bullish" },
  { id: 4, event: "2021 Post-COVID Recovery", type: "bullish" },
];

export default function Level3Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [eventAnswers, setEventAnswers] = useState<Record<number, string>>({});
  const [marketReaction, setMarketReaction] = useState("");

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
    router.push("/dashboard/game/levels/4");
  };

  const handleEventTypeChange = (eventId: number, value: string) => {
    setEventAnswers((prev) => ({
      ...prev,
      [eventId]: value,
    }));

    // Check if all events have been answered
    const updatedAnswers = {
      ...eventAnswers,
      [eventId]: value,
    };

    if (Object.keys(updatedAnswers).length === marketEvents.length) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 2 ? { ...task, completed: true } : task
        )
      );
    }
  };

  const handleReactionSubmit = () => {
    if (marketReaction) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 3 ? { ...task, completed: true } : task
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
                            Market sentiment is powerful. Understanding whether
                            we're in a bull or bear market helps you make better
                            investment decisions.
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
                          <div className="rounded-lg border overflow-hidden">
                            <div className="aspect-video w-full bg-muted">
                              <div className="flex h-full items-center justify-center">
                                <p className="text-center text-sm text-muted-foreground">
                                  [Market Simulation Video]
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="mb-4 grid grid-cols-2 gap-4">
                                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                                  <div className="flex items-center gap-2">
                                    <ArrowUp className="h-5 w-5 text-green-600" />
                                    <h3 className="font-medium">Bull Market</h3>
                                  </div>
                                  <p className="mt-2 text-sm">
                                    A market characterized by rising prices and
                                    optimism. Investors expect continued growth.
                                  </p>
                                </div>
                                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                                  <div className="flex items-center gap-2">
                                    <ArrowDown className="h-5 w-5 text-red-600" />
                                    <h3 className="font-medium">Bear Market</h3>
                                  </div>
                                  <p className="mt-2 text-sm">
                                    A market characterized by falling prices and
                                    pessimism. Investors expect continued
                                    decline.
                                  </p>
                                </div>
                              </div>
                              <Button onClick={() => toggleTask(1)}>
                                Mark as Watched
                              </Button>
                            </div>
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
                          {marketEvents.map((event) => (
                            <div
                              key={event.id}
                              className="rounded-lg border p-3">
                              <p className="mb-2 font-medium">{event.event}</p>
                              <RadioGroup
                                value={eventAnswers[event.id]}
                                onValueChange={(value) =>
                                  handleEventTypeChange(event.id, value)
                                }>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="bullish"
                                    id={`${event.id}-bullish`}
                                  />
                                  <Label
                                    htmlFor={`${event.id}-bullish`}
                                    className="flex items-center gap-1">
                                    <ArrowUp className="h-4 w-4 text-green-600" />
                                    Bullish
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="bearish"
                                    id={`${event.id}-bearish`}
                                  />
                                  <Label
                                    htmlFor={`${event.id}-bearish`}
                                    className="flex items-center gap-1">
                                    <ArrowDown className="h-4 w-4 text-red-600" />
                                    Bearish
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
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Market Scenario
                              </CardTitle>
                              <CardDescription>
                                If the market falls by 10%, what would you do?
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <RadioGroup
                                value={marketReaction}
                                onValueChange={setMarketReaction}>
                                <div className="space-y-4">
                                  <div className="rounded-lg border p-3">
                                    <RadioGroupItem
                                      value="buy"
                                      id="reaction-buy"
                                      className="sr-only"
                                    />
                                    <Label
                                      htmlFor="reaction-buy"
                                      className="flex cursor-pointer flex-col gap-2">
                                      <div className="font-medium">
                                        Buy More
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        I see this as an opportunity to buy
                                        quality stocks at a discount.
                                      </div>
                                    </Label>
                                  </div>
                                  <div className="rounded-lg border p-3">
                                    <RadioGroupItem
                                      value="hold"
                                      id="reaction-hold"
                                      className="sr-only"
                                    />
                                    <Label
                                      htmlFor="reaction-hold"
                                      className="flex cursor-pointer flex-col gap-2">
                                      <div className="font-medium">Hold</div>
                                      <div className="text-sm text-muted-foreground">
                                        I'll stay calm and maintain my current
                                        portfolio without making changes.
                                      </div>
                                    </Label>
                                  </div>
                                  <div className="rounded-lg border p-3">
                                    <RadioGroupItem
                                      value="sell"
                                      id="reaction-sell"
                                      className="sr-only"
                                    />
                                    <Label
                                      htmlFor="reaction-sell"
                                      className="flex cursor-pointer flex-col gap-2">
                                      <div className="font-medium">Sell</div>
                                      <div className="text-sm text-muted-foreground">
                                        I'll sell my holdings to prevent further
                                        losses.
                                      </div>
                                    </Label>
                                  </div>
                                </div>
                              </RadioGroup>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t">
                              <Button onClick={handleReactionSubmit}>
                                Submit Answer
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
            isCompleted={isCompleted}
            onClaim={completeLevel}
          />

          <HelpCard
            links={[
              { icon: BookOpen, label: "Market Trends Guide", href: "#" },
              { icon: CircleHelp, label: "Bull vs Bear Markets", href: "#" },
            ]}
          />
        </div>
      </div>
    </GameLayout>
  );
}
