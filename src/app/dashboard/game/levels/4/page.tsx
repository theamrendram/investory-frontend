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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GameLayout from "@/components/game-layout";
import LevelHeader from "@/components/level-header";
import RewardCard from "@/components/reward-card";
import HelpCard from "@/components/help-card";

const levelData = {
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
      title: "Watch a walkthrough of a real trading screen",
      completed: false,
    },
    { id: 2, title: "Practice placing a virtual order", completed: false },
    {
      id: 3,
      title: "Quiz: Match order types with their definitions",
      completed: false,
    },
  ],
  reward: {
    badge: "The First Trade",
    money: 5000,
  },
};

const orderTypes = [
  {
    id: 1,
    name: "Market Order",
    definition:
      "An order to buy or sell a stock immediately at the best available current price",
  },
  {
    id: 2,
    name: "Limit Order",
    definition: "An order to buy or sell a stock at a specific price or better",
  },
  {
    id: 3,
    name: "Stop Loss Order",
    definition:
      "An order to buy or sell a stock once the price reaches a specified price, known as the stop price",
  },
];

export default function Level4Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("story");
  const [tasks, setTasks] = useState(levelData.tasks);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    stock: "",
    quantity: "",
    orderType: "",
    price: "",
  });
  const [orderTypeAnswers, setOrderTypeAnswers] = useState<
    Record<number, string>
  >({});

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
    router.push("/dashboard/game/levels/5");
  };

  const handleOrderSubmit = () => {
    // Check if all fields are filled
    if (
      orderDetails.stock &&
      orderDetails.quantity &&
      orderDetails.orderType &&
      (orderDetails.orderType === "market" || orderDetails.price)
    ) {
      // Mark the task as completed
      setTasks((prev) =>
        prev.map((task) =>
          task.id === 2 ? { ...task, completed: true } : task
        )
      );
    }
  };

  const handleOrderTypeMatch = (orderId: number, definition: string) => {
    setOrderTypeAnswers((prev) => ({
      ...prev,
      [orderId]: definition,
    }));

    // Check if all order types have been matched
    const updatedAnswers = {
      ...orderTypeAnswers,
      [orderId]: definition,
    };

    if (Object.keys(updatedAnswers).length === orderTypes.length) {
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
                            Your first trade is a big step. Take your time to
                            understand the different order types before placing
                            real trades.
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
                                  [Trading Terminal Walkthrough Video]
                                </p>
                              </div>
                            </div>
                            <div className="p-4">
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
                        <div className="ml-7 mt-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">
                                Trading Terminal
                              </CardTitle>
                              <CardDescription>
                                Place a virtual order
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="stock">Select Stock</Label>
                                  <Select
                                    value={orderDetails.stock}
                                    onValueChange={(value) =>
                                      setOrderDetails({
                                        ...orderDetails,
                                        stock: value,
                                      })
                                    }>
                                    <SelectTrigger id="stock">
                                      <SelectValue placeholder="Select a stock" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TATAMOTORS">
                                        Tata Motors (₹800.50)
                                      </SelectItem>
                                      <SelectItem value="RELIANCE">
                                        Reliance Industries (₹2,450.75)
                                      </SelectItem>
                                      <SelectItem value="HDFCBANK">
                                        HDFC Bank (₹1,650.25)
                                      </SelectItem>
                                      <SelectItem value="INFY">
                                        Infosys (₹1,420.60)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="quantity">Quantity</Label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={orderDetails.quantity}
                                    onChange={(e) =>
                                      setOrderDetails({
                                        ...orderDetails,
                                        quantity: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="orderType">Order Type</Label>
                                  <Select
                                    value={orderDetails.orderType}
                                    onValueChange={(value) =>
                                      setOrderDetails({
                                        ...orderDetails,
                                        orderType: value,
                                      })
                                    }>
                                    <SelectTrigger id="orderType">
                                      <SelectValue placeholder="Select order type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="market">
                                        Market Order
                                      </SelectItem>
                                      <SelectItem value="limit">
                                        Limit Order
                                      </SelectItem>
                                      <SelectItem value="stoploss">
                                        Stop Loss Order
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {orderDetails.orderType &&
                                  orderDetails.orderType !== "market" && (
                                    <div className="grid gap-2">
                                      <Label htmlFor="price">Price (₹)</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        placeholder="Enter price"
                                        value={orderDetails.price}
                                        onChange={(e) =>
                                          setOrderDetails({
                                            ...orderDetails,
                                            price: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  )}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t">
                              <Button onClick={handleOrderSubmit}>
                                Place Order
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
                                Match Order Types
                              </CardTitle>
                              <CardDescription>
                                Match each order type with its definition
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {orderTypes.map((orderType) => (
                                  <div
                                    key={orderType.id}
                                    className="rounded-lg border p-3">
                                    <p className="mb-2 font-medium">
                                      {orderType.name}
                                    </p>
                                    <RadioGroup
                                      value={orderTypeAnswers[orderType.id]}
                                      onValueChange={(value) =>
                                        handleOrderTypeMatch(
                                          orderType.id,
                                          value
                                        )
                                      }>
                                      {orderTypes.map((def) => (
                                        <div
                                          key={def.id}
                                          className="flex items-center space-x-2">
                                          <RadioGroupItem
                                            value={def.definition}
                                            id={`${orderType.id}-${def.id}`}
                                          />
                                          <Label
                                            htmlFor={`${orderType.id}-${def.id}`}
                                            className="text-sm">
                                            {def.definition}
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                ))}
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
              { icon: BookOpen, label: "Order Types Guide", href: "#" },
              {
                icon: CircleHelp,
                label: "Trading Terminal Tutorial",
                href: "#",
              },
            ]}
          />
        </div>
      </div>
    </GameLayout>
  );
}
