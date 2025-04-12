"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, CircleHelp, Lightbulb } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GameLayout from "@/components/game-layout";
import LevelHeader from "@/components/level-header";
import RewardCard from "@/components/reward-card";
import HelpCard from "@/components/help-card";

const levelData = {
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
    { id: 1, title: "Arrange a sample portfolio", completed: false },
    { id: 2, title: "Predict the impact of a news event", completed: false },
    {
      id: 3,
      title: "Quiz: How would you split ₹50,000 between 5 sectors?",
      completed: false,
    },
  ],
  reward: {
    badge: "Portfolio Strategist",
    money: 5000,
  },
};

const newsEvents = [
  {
    id: 1,
    event: "RBI Hikes Interest Rates by 0.5%",
    sector: "Banking",
    impact: "positive",
  },
  {
    id: 2,
    event: "Government Announces New Tech Policy",
    sector: "Technology",
    impact: "positive",
  },
  {
    id: 3,
    event: "Global Oil Prices Surge",
    sector: "Energy",
    impact: "positive",
  },
  {
    id: 4,
    event: "Pharmaceutical Breakthrough Announced",
    sector: "Healthcare",
    impact: "positive",
  },
];

export default function Level5Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [portfolioAllocation, setPortfolioAllocation] = useState({
    tech: 25,
    banking: 25,
    fmcg: 25,
    pharma: 15,
    cash: 10,
  });
  const [newsImpacts, setNewsImpacts] = useState<Record<number, string>>({});
  const [sectorAllocation, setSectorAllocation] = useState({
    tech: 10000,
    banking: 10000,
    energy: 10000,
    healthcare: 10000,
    fmcg: 10000,
  });

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
    router.push("/dashboard");
  };

  const handlePortfolioSubmit = () => {
    // Check if portfolio adds up to 100%
    const total = Object.values(portfolioAllocation).reduce(
      (sum, value) => sum + value,
      0
    );
    if (total === 100) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 1 ? { ...task, completed: true } : task
        )
      );
    }
  };

  const handleNewsImpactChange = (eventId: number, impact: string) => {
    setNewsImpacts((prev) => ({
      ...prev,
      [eventId]: impact,
    }));

    // Check if all news events have been answered
    const updatedImpacts = {
      ...newsImpacts,
      [eventId]: impact,
    };

    if (Object.keys(updatedImpacts).length === newsEvents.length) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 2 ? { ...task, completed: true } : task
        )
      );
    }
  };

  const handleSectorAllocationChange = (sector: string, value: number) => {
    // Calculate remaining amount
    const currentTotal = Object.entries(sectorAllocation)
      .filter(([key]) => key !== sector)
      .reduce((sum, [, value]) => sum + value, 0);

    const maxAllowed = 50000 - currentTotal;
    const newValue = Math.min(value, maxAllowed);

    setSectorAllocation((prev) => ({
      ...prev,
      [sector]: newValue,
    }));

    // Check if allocation adds up to 50,000
    const newTotal = Object.entries({
      ...sectorAllocation,
      [sector]: newValue,
    }).reduce((sum, [, value]) => sum + value, 0);

    if (newTotal === 50000) {
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
                            A well-balanced portfolio is like a good cricket
                            team - you need different players with different
                            strengths to win in various conditions.
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
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Portfolio Allocation
                              </CardTitle>
                              <CardDescription>
                                Arrange a sample portfolio (must add up to 100%)
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Technology</span>
                                    <span className="text-sm font-medium">
                                      {portfolioAllocation.tech}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[portfolioAllocation.tech]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) =>
                                      setPortfolioAllocation({
                                        ...portfolioAllocation,
                                        tech: value[0],
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Banking</span>
                                    <span className="text-sm font-medium">
                                      {portfolioAllocation.banking}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[portfolioAllocation.banking]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) =>
                                      setPortfolioAllocation({
                                        ...portfolioAllocation,
                                        banking: value[0],
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">FMCG</span>
                                    <span className="text-sm font-medium">
                                      {portfolioAllocation.fmcg}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[portfolioAllocation.fmcg]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) =>
                                      setPortfolioAllocation({
                                        ...portfolioAllocation,
                                        fmcg: value[0],
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Pharma</span>
                                    <span className="text-sm font-medium">
                                      {portfolioAllocation.pharma}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[portfolioAllocation.pharma]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) =>
                                      setPortfolioAllocation({
                                        ...portfolioAllocation,
                                        pharma: value[0],
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Cash</span>
                                    <span className="text-sm font-medium">
                                      {portfolioAllocation.cash}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[portfolioAllocation.cash]}
                                    min={0}
                                    max={100}
                                    step={5}
                                    onValueChange={(value) =>
                                      setPortfolioAllocation({
                                        ...portfolioAllocation,
                                        cash: value[0],
                                      })
                                    }
                                  />
                                </div>
                                <div className="rounded-lg bg-muted p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Total</span>
                                    <span
                                      className={cn(
                                        "font-medium",
                                        Object.values(
                                          portfolioAllocation
                                        ).reduce(
                                          (sum, value) => sum + value,
                                          0
                                        ) === 100
                                          ? "text-green-600"
                                          : "text-red-600"
                                      )}>
                                      {Object.values(
                                        portfolioAllocation
                                      ).reduce((sum, value) => sum + value, 0)}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t">
                              <Button
                                onClick={handlePortfolioSubmit}
                                disabled={
                                  Object.values(portfolioAllocation).reduce(
                                    (sum, value) => sum + value,
                                    0
                                  ) !== 100
                                }>
                                Submit Portfolio
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
                          {newsEvents.map((event) => (
                            <div
                              key={event.id}
                              className="rounded-lg border p-3">
                              <p className="mb-2 font-medium">{event.event}</p>
                              <p className="mb-2 text-sm text-muted-foreground">
                                How will this affect the {event.sector} sector?
                              </p>
                              <RadioGroup
                                value={newsImpacts[event.id]}
                                onValueChange={(value) =>
                                  handleNewsImpactChange(event.id, value)
                                }>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="positive"
                                    id={`${event.id}-positive`}
                                  />
                                  <Label htmlFor={`${event.id}-positive`}>
                                    Positive Impact
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="negative"
                                    id={`${event.id}-negative`}
                                  />
                                  <Label htmlFor={`${event.id}-negative`}>
                                    Negative Impact
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="neutral"
                                    id={`${event.id}-neutral`}
                                  />
                                  <Label htmlFor={`${event.id}-neutral`}>
                                    Neutral Impact
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
                                Investment Allocation
                              </CardTitle>
                              <CardDescription>
                                How would you split ₹50,000 between 5 sectors?
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Technology</span>
                                    <span className="text-sm font-medium">
                                      ₹{sectorAllocation.tech.toLocaleString()}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[sectorAllocation.tech]}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    onValueChange={(value) =>
                                      handleSectorAllocationChange(
                                        "tech",
                                        value[0]
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Banking</span>
                                    <span className="text-sm font-medium">
                                      ₹
                                      {sectorAllocation.banking.toLocaleString()}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[sectorAllocation.banking]}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    onValueChange={(value) =>
                                      handleSectorAllocationChange(
                                        "banking",
                                        value[0]
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Energy</span>
                                    <span className="text-sm font-medium">
                                      ₹
                                      {sectorAllocation.energy.toLocaleString()}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[sectorAllocation.energy]}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    onValueChange={(value) =>
                                      handleSectorAllocationChange(
                                        "energy",
                                        value[0]
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">Healthcare</span>
                                    <span className="text-sm font-medium">
                                      ₹
                                      {sectorAllocation.healthcare.toLocaleString()}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[sectorAllocation.healthcare]}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    onValueChange={(value) =>
                                      handleSectorAllocationChange(
                                        "healthcare",
                                        value[0]
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm">FMCG</span>
                                    <span className="text-sm font-medium">
                                      ₹{sectorAllocation.fmcg.toLocaleString()}
                                    </span>
                                  </div>
                                  <Slider
                                    value={[sectorAllocation.fmcg]}
                                    min={0}
                                    max={50000}
                                    step={1000}
                                    onValueChange={(value) =>
                                      handleSectorAllocationChange(
                                        "fmcg",
                                        value[0]
                                      )
                                    }
                                  />
                                </div>
                                <div className="rounded-lg bg-muted p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Total</span>
                                    <span
                                      className={cn(
                                        "font-medium",
                                        Object.values(sectorAllocation).reduce(
                                          (sum, value) => sum + value,
                                          0
                                        ) === 50000
                                          ? "text-green-600"
                                          : "text-red-600"
                                      )}>
                                      ₹
                                      {Object.values(sectorAllocation)
                                        .reduce((sum, value) => sum + value, 0)
                                        .toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
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
              {
                icon: BookOpen,
                label: "Portfolio Management Guide",
                href: "#",
              },
              {
                icon: CircleHelp,
                label: "Diversification Strategies",
                href: "#",
              },
            ]}
          />
        </div>
      </div>
    </GameLayout>
  );
}
