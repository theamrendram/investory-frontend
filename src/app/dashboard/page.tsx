"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  ChevronRight,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  ListChecks,
  PieChart,
  TrendingDown,
  TrendingUp,
  Trophy,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameLayout from "@/components/game-layout";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [balance, setBalance] = useState(10000);
  const [currentLevel, setCurrentLevel] = useState(1);

  const levels = [
    {
      id: 1,
      name: "The Market Awakens",
      completed: currentLevel > 1,
      progress: 100,
    },
    {
      id: 2,
      name: "The IPO Mystery",
      completed: currentLevel > 2,
      progress: currentLevel === 2 ? 33 : 0,
    },
    {
      id: 3,
      name: "The Bulls & Bears",
      completed: currentLevel > 3,
      progress: 0,
    },
    {
      id: 4,
      name: "The Trading Terminal",
      completed: currentLevel > 4,
      progress: 0,
    },
    {
      id: 5,
      name: "The Portfolio Puzzle",
      completed: currentLevel > 5,
      progress: 0,
    },
  ];

  const badges = [
    { id: 1, name: "The Curious Investor", unlocked: currentLevel > 1 },
    { id: 2, name: "IPO Detective", unlocked: currentLevel > 2 },
    { id: 3, name: "Market Observer", unlocked: currentLevel > 3 },
    { id: 4, name: "The First Trade", unlocked: currentLevel > 4 },
    { id: 5, name: "Portfolio Strategist", unlocked: currentLevel > 5 },
  ];

  const portfolio = [
    {
      name: "Reliance Industries",
      symbol: "RELIANCE",
      shares: 5,
      price: 2450.75,
      change: 1.2,
    },
    {
      name: "HDFC Bank",
      symbol: "HDFCBANK",
      shares: 10,
      price: 1650.25,
      change: -0.5,
    },
    { name: "Infosys", symbol: "INFY", shares: 8, price: 1420.6, change: 0.8 },
  ];

  const marketIndices = [
    { name: "SENSEX", value: 72568.45, change: 1.2, changeValue: 856.7 },
    { name: "NIFTY", value: 22045.75, change: 0.9, changeValue: 198.4 },
    { name: "USD/INR", value: 83.25, change: -0.3, changeValue: -0.25 },
  ];

  const recentActivities = [
    { type: "level_complete", level: 1, reward: 10000, date: "2 days ago" },
    {
      type: "quiz_complete",
      level: 1,
      task: "Stock Exchange Quiz",
      date: "2 days ago",
    },
    { type: "badge_earned", badge: "The Curious Investor", date: "2 days ago" },
  ];

  const learningResources = [
    { title: "Stock Market Basics", type: "Article", difficulty: "Beginner" },
    { title: "Understanding IPOs", type: "Video", difficulty: "Intermediate" },
    { title: "Technical Analysis", type: "Course", difficulty: "Advanced" },
  ];

  const calculatePortfolioValue = () => {
    return portfolio.reduce(
      (total, stock) => total + stock.shares * stock.price,
      0
    );
  };

  const portfolioValue = calculatePortfolioValue();
  const totalAssets = balance + portfolioValue;

  return (
    <GameLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and manage your investments
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Learning</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assets
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalAssets.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cash: ₹{balance.toLocaleString()} | Stocks: ₹
                  {portfolioValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Level
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Level {currentLevel}</div>
                <p className="text-xs text-muted-foreground">
                  {levels[currentLevel - 1].name}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Badges Earned
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {badges.filter((b) => b.unlocked).length}/{badges.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest:{" "}
                  {badges.filter((b) => b.unlocked)[0]?.name || "None yet"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentLevel * 20}%</div>
                <Progress value={currentLevel * 20} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Level Progress</CardTitle>
                <CardDescription>
                  Track your journey through the game
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levels.map((level) => (
                    <div key={level.id} className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BookOpen
                            className={cn(
                              "mr-2 h-4 w-4",
                              level.completed
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm font-medium",
                              level.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}>
                            Level {level.id}: {level.name}
                          </span>
                        </div>
                        {level.completed ? (
                          <Badge>Completed</Badge>
                        ) : level.progress > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            {level.progress}% complete
                          </span>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                      <Progress value={level.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/levels/${currentLevel}`}>
                    Continue Learning
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 border-b pb-3 last:border-0 last:pb-0">
                      {activity.type === "level_complete" && (
                        <>
                          <div className="rounded-full bg-primary/10 p-1">
                            <Trophy className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Completed Level {activity.level}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Earned ₹{activity.reward?.toLocaleString() || '0'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.date}
                            </p>
                          </div>
                        </>
                      )}
                      {activity.type === "quiz_complete" && (
                        <>
                          <div className="rounded-full bg-primary/10 p-1">
                            <ListChecks className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Completed {activity.task}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Level {activity.level}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.date}
                            </p>
                          </div>
                        </>
                      )}
                      {activity.type === "badge_earned" && (
                        <>
                          <div className="rounded-full bg-primary/10 p-1">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Earned Badge</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.badge}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.date}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Today's market snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {marketIndices.map((index) => (
                  <div key={index.name} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{index.name}</span>
                      {index.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="mt-2 text-2xl font-bold">
                      {index.value.toLocaleString()}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        index.change > 0 ? "text-green-600" : "text-red-600"
                      )}>
                      <span>
                        {index.change > 0 ? "+" : ""}
                        {index.change}%
                      </span>
                      <span className="text-muted-foreground">
                        ({index.change > 0 ? "+" : ""}
                        {index.changeValue.toLocaleString()})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cash Balance
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{balance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for trading
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Portfolio Value
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{portfolioValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {portfolio.length} stocks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assets
                </CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalAssets.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Cash + Portfolio Value
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Portfolio Allocation
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex items-center justify-center py-6">
                <div className="h-24 w-24 rounded-full border-8 border-primary/30 border-t-primary" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Stocks</CardTitle>
              <CardDescription>
                Current holdings and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Stock</div>
                  <div>Symbol</div>
                  <div className="text-right">Shares</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Value</div>
                </div>
                {portfolio.length > 0 ? (
                  <div className="divide-y">
                    {portfolio.map((stock) => (
                      <div
                        key={stock.symbol}
                        className="grid grid-cols-5 p-3 text-sm">
                        <div className="font-medium">{stock.name}</div>
                        <div>{stock.symbol}</div>
                        <div className="text-right">{stock.shares}</div>
                        <div className="text-right">
                          <div>₹{stock.price.toLocaleString()}</div>
                          <div
                            className={cn(
                              "text-xs",
                              stock.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}>
                            {stock.change > 0 ? "+" : ""}
                            {stock.change}%
                          </div>
                        </div>
                        <div className="text-right font-medium">
                          ₹{(stock.shares * stock.price).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    You don't own any stocks yet. Complete more levels to start
                    trading!
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                disabled={currentLevel < 4}>
                {currentLevel < 4
                  ? "Unlock Trading at Level 4"
                  : "Trade Stocks"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent trades and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div>Type</div>
                  <div>Details</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Date</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-4 p-3 text-sm">
                    <div className="font-medium">Reward</div>
                    <div>Level 1 Completion</div>
                    <div className="text-right text-green-600">+₹10,000</div>
                    <div className="text-right text-muted-foreground">
                      2 days ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>
                Achievements you've earned through your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={cn(
                      "flex flex-col items-center rounded-lg border p-4 text-center",
                      !badge.unlocked && "border-dashed opacity-50"
                    )}>
                    <div
                      className={cn(
                        "mb-2 flex h-12 w-12 items-center justify-center rounded-full",
                        badge.unlocked ? "bg-primary/10" : "bg-muted"
                      )}>
                      <Award
                        className={cn(
                          "h-6 w-6",
                          badge.unlocked
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <h3 className="text-sm font-medium">{badge.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {badge.unlocked ? "Unlocked" : "Locked"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Level Completion</CardTitle>
                <CardDescription>
                  Your progress through the game
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {levels.map((level) => (
                    <div key={level.id} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2",
                          level.completed
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted bg-muted/50 text-muted-foreground"
                        )}>
                        {level.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{level.name}</p>
                          {level.completed ? (
                            <Badge>Completed</Badge>
                          ) : level.progress > 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {level.progress}% complete
                            </span>
                          ) : (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </div>
                        <Progress value={level.progress} className="mt-2 h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>
                  Special achievements in your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">First Steps</p>
                      <p className="text-sm text-muted-foreground">
                        Complete Level 1
                      </p>
                      <Badge
                        className="mt-2"
                        variant={currentLevel > 1 ? "default" : "outline"}>
                        {currentLevel > 1 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-muted p-1.5">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">First Trade</p>
                      <p className="text-sm text-muted-foreground">
                        Buy your first stock
                      </p>
                      <Badge className="mt-2" variant="outline">
                        Locked
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-muted p-1.5">
                      <PieChart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Diversified Investor</p>
                      <p className="text-sm text-muted-foreground">
                        Own stocks in 3 different sectors
                      </p>
                      <Badge className="mt-2" variant="outline">
                        Locked
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="rounded-full bg-muted p-1.5">
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Market Master</p>
                      <p className="text-sm text-muted-foreground">
                        Complete all levels
                      </p>
                      <Badge className="mt-2" variant="outline">
                        Locked
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Learning Path</CardTitle>
                <CardDescription>
                  Your journey through the stock market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                  {levels.map((level) => (
                    <div key={level.id} className="relative">
                      <div
                        className={cn(
                          "absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full",
                          level.completed ? "bg-primary" : "bg-muted"
                        )}>
                        {level.completed && (
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            level.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}>
                          Level {level.id}: {level.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {level.id === 1 && "Understanding Stocks"}
                          {level.id === 2 && "How Companies Go Public"}
                          {level.id === 3 && "Understanding Market Trends"}
                          {level.id === 4 && "Placing Your First Order"}
                          {level.id === 5 && "Managing Your Investments"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/levels/${currentLevel}`}>
                    Continue Learning
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>
                  Additional materials to enhance your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningResources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border p-3">
                      <div className="rounded-full bg-primary/10 p-1.5">
                        {resource.type === "Article" && (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                        {resource.type === "Video" && (
                          <BookOpen className="h-5 w-5 text-primary" />
                        )}
                        {resource.type === "Course" && (
                          <GraduationCap className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Resources
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Glossary</CardTitle>
                <CardDescription>Key terms and definitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Stock</p>
                    <p className="text-sm text-muted-foreground">
                      A type of security that represents ownership in a company
                      and a claim on part of the company's assets and earnings.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">IPO</p>
                    <p className="text-sm text-muted-foreground">
                      Initial Public Offering - The process by which a private
                      company offers shares to the public for the first time.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Bull Market</p>
                    <p className="text-sm text-muted-foreground">
                      A market condition in which prices are rising or expected
                      to rise.
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="font-medium">Bear Market</p>
                    <p className="text-sm text-muted-foreground">
                      A market condition in which prices are falling or expected
                      to fall.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Glossary
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quiz Center</CardTitle>
              <CardDescription>
                Test your knowledge with these quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">Stock Market Basics</h3>
                    <Badge>Level 1</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Test your understanding of stock market fundamentals.
                  </p>
                  <Button size="sm" className="w-full">
                    Start Quiz
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">IPO Knowledge</h3>
                    <Badge>Level 2</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Test your knowledge about Initial Public Offerings.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Unlock at Level 2
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">Market Trends</h3>
                    <Badge>Level 3</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Test your ability to identify bull and bear markets.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Unlock at Level 3
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </GameLayout>
  );
}
