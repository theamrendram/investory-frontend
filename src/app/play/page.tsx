"use client";

import { useState, useEffect } from "react";
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
  Lock,
  CheckCircle2,
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton";
import GameLayout from "@/components/game-layout";
import { useProgressStore } from "@/store/progress-store";
import { fetchUserProgress } from "@/lib/api/progress";
import { toast } from "sonner";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const {
    currentLevel,
    totalBalance,
    levels,
    badges,
    setProgress,
    setError,
    clearError,
  } = useProgressStore();

  // Load user progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        clearError();
        const progress = await fetchUserProgress();
        setProgress(progress);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load progress",
        );
        toast.error("Failed to load your progress");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [setProgress, setError, clearError]);

  const levelData = [
    {
      id: 1,
      name: "The Market Awakens",
      badge: "The Curious Investor",
      reward: 10000,
    },
    {
      id: 2,
      name: "The IPO Mystery",
      badge: "IPO Detective",
      reward: 5000,
    },
    {
      id: 3,
      name: "The Bulls & Bears",
      badge: "Market Observer",
      reward: 2500,
    },
    {
      id: 4,
      name: "The Trading Terminal",
      badge: "The First Trade",
      reward: 5000,
    },
    {
      id: 5,
      name: "The Portfolio Puzzle",
      badge: "Portfolio Strategist",
      reward: 5000,
    },
  ];

  const getLevelStatus = (levelId: number) => {
    const isUnlocked = currentLevel >= levelId;
    const isCompleted = levels[levelId]?.isCompleted || false;
    const levelProgress = levels[levelId];

    if (isCompleted) {
      return { status: "completed", progress: 100, icon: CheckCircle2 };
    } else if (isUnlocked) {
      const taskProgress = levelProgress?.tasksCompleted?.length || 0;
      const quizProgress =
        levelProgress?.quizScore && levelProgress?.totalQuestions
          ? (levelProgress.quizScore / levelProgress.totalQuestions) * 100
          : 0;
      const progress = Math.max(taskProgress * 20, quizProgress * 0.8); // Tasks worth 20% each, quiz worth 80%
      return {
        status: "in-progress",
        progress: Math.min(progress, 100),
        icon: BookOpen,
      };
    } else {
      return { status: "locked", progress: 0, icon: Lock };
    }
  };

  const getOverallProgress = () => {
    const completedLevels = Object.values(levels).filter(
      (level) => level.isCompleted,
    ).length;
    return Math.round((completedLevels / 5) * 100);
  };

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
      0,
    );
  };

  const portfolioValue = calculatePortfolioValue();
  const totalAssets = totalBalance + portfolioValue;

  if (isLoading) {
    return (
      <GameLayout>
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Current Level</CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="mb-2 h-4 w-12" />
                  <Skeleton className="mb-2 h-8 w-8" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Across all levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Levels</CardTitle>
            <CardDescription>Your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-48" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-2 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Play</h1>
        <p className="text-muted-foreground">
          Your learning progress at a glance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Level</CardTitle>
            <CardDescription>Continue where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-semibold">{currentLevel}</p>
                <p className="text-sm">{levelData[currentLevel - 1]?.name}</p>
              </div>
              <Button asChild>
                <Link href={`/play/levels/${currentLevel}`}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Across all levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {getOverallProgress()}%
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Levels</CardTitle>
          <CardDescription>Your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {levelData.map((level) => {
              const { status, progress, icon: Icon } = getLevelStatus(level.id);
              const isUnlocked = currentLevel >= level.id;
              const isCompleted = levels[level.id]?.isCompleted || false;

              return (
                <div
                  key={level.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        status === "completed" &&
                          "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                        status === "in-progress" &&
                          "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                        status === "locked" &&
                          "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Level {level.id}: {level.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {status === "completed" && "✓ Completed"}
                        {status === "in-progress" && "In Progress"}
                        {status === "locked" && "Locked"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <Progress value={progress} className="h-2" />
                    </div>
                    {isUnlocked && !isCompleted && (
                      <Button size="sm" asChild>
                        <Link href={`/play/levels/${level.id}`}>Continue</Link>
                      </Button>
                    )}
                    {isCompleted && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                    {!isUnlocked && (
                      <Badge variant="outline" className="text-gray-500">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Badges Earned</CardTitle>
          <CardDescription>Your achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {levelData.map((level) => {
              const badgeEarned = badges.find((b) => b.levelId === level.id);
              const isEarned = !!badgeEarned;

              return (
                <div
                  key={level.id}
                  className={cn(
                    "flex flex-col items-center rounded-lg border p-4 transition-all",
                    isEarned
                      ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20"
                      : "border-muted-foreground/20 bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "mb-2 flex h-12 w-12 items-center justify-center rounded-full",
                      isEarned
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                        : "bg-muted-foreground/20 text-muted-foreground",
                    )}
                  >
                    <Award className="h-6 w-6" />
                  </div>
                  <p
                    className={cn(
                      "text-center text-sm font-medium",
                      isEarned
                        ? "text-yellow-900 dark:text-yellow-100"
                        : "text-muted-foreground",
                    )}
                  >
                    {level.badge}
                  </p>
                  {isEarned && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      +₹{level.reward.toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </GameLayout>
  );
}
