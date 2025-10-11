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
import { useUserStore } from "@/store/user-store";
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

  const user = useUserStore((state) => state.user);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Generate recent activities from progress data
  const getRecentActivities = () => {
    const activities: Array<{
      type: string;
      level?: number;
      badge?: string;
      task?: string;
      reward?: number;
      date: string;
    }> = [];

    // Add completed levels
    Object.entries(levels).forEach(([levelId, levelProgress]) => {
      if (levelProgress.isCompleted && levelProgress.completedAt) {
        const level = levelData.find((l) => l.id === parseInt(levelId));
        activities.push({
          type: "level_complete",
          level: parseInt(levelId),
          reward: level?.reward || 0,
          date: formatDate(levelProgress.completedAt),
        });
      }
    });

    // Add earned badges
    badges.forEach((badge) => {
      activities.push({
        type: "badge_earned",
        badge: badge.badgeName,
        date: formatDate(badge.earnedAt),
      });
    });

    // Sort by date (most recent first)
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Show only 5 most recent
  };

  // Get learning resources based on current level
  const getLearningResources = () => {
    const resources = [
      {
        level: 1,
        title: "Stock Market Basics",
        type: "Article",
        difficulty: "Beginner",
      },
      {
        level: 2,
        title: "Understanding IPOs",
        type: "Video",
        difficulty: "Intermediate",
      },
      {
        level: 3,
        title: "Bull & Bear Markets",
        type: "Article",
        difficulty: "Intermediate",
      },
      {
        level: 4,
        title: "Trading Strategies",
        type: "Course",
        difficulty: "Advanced",
      },
      {
        level: 5,
        title: "Portfolio Management",
        type: "Course",
        difficulty: "Advanced",
      },
    ];

    // Show resources for current and next level
    return resources.filter(
      (r) => r.level >= currentLevel && r.level <= currentLevel + 1,
    );
  };

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

  // Sync user store with progress store
  useEffect(() => {
    // Sync user amount with progress store if different
    if (user?.amount && user.amount !== totalBalance) {
      setProgress({ totalBalance: user.amount });
    }

    // Sync current level
    if (user?.level && user.level !== currentLevel) {
      setProgress({ currentLevel: user.level });
    }
  }, [user, totalBalance, currentLevel, setProgress]);

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
  const displayBalance = user?.amount ?? totalBalance;
  const totalAssets = displayBalance + portfolioValue;

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
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{displayBalance.toLocaleString()}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Virtual trading money
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {getRecentActivities().length > 0 ? (
              <div className="space-y-3">
                {getRecentActivities().map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "level_complete" && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "badge_earned" && (
                        <Award className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === "level_complete" &&
                          `Completed Level ${activity.level}`}
                        {activity.type === "badge_earned" &&
                          `Earned ${activity.badge} badge`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                    {activity.reward && (
                      <div className="text-sm font-medium text-green-600">
                        +₹{activity.reward.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <ListChecks className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">
                  Start completing levels to see your progress!
                </p>
              </div>
            )}
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
          {badges.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => (
                <Card key={badge.levelId}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{badge.badgeName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(badge.earnedAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No badges earned yet. Complete levels to earn badges!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </GameLayout>
  );
}
