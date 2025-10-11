"use client";

import { useState, useEffect, useCallback } from "react";
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
  Lock,
  AlertCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import GameLayout from "@/components/game-layout";
import RewardClaimModal from "@/components/reward-claim-modal";
import { QuizNavigation } from "@/components/quiz-navigation";
import { QuizResults, type QuizResult } from "@/components/quiz-results";
import { useProgressStore } from "@/store/progress-store";
import {
  fetchUserProgress,
  updateLevelTasks,
  submitQuiz,
  completeLevel,
  resetQuiz,
} from "@/lib/api/progress";
import { toast } from "sonner";

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

function QuestionsSection({
  levelId,
  onClaimReward,
}: {
  levelId: number;
  onClaimReward: () => void;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  const {
    levels,
    submitQuiz: updateStoreQuiz,
    setError,
    clearError,
  } = useProgressStore();

  const levelProgress = levels[levelId];

  useEffect(() => {
    if (questionImports[levelId]) {
      questionImports[levelId]().then((mod) => setQuestions(mod.default || []));
    }
  }, [levelId]);

  // Load existing quiz answers if available
  useEffect(() => {
    if (levelProgress?.quizAnswers) {
      setAnswers(levelProgress.quizAnswers);
      if (levelProgress.quizScore > 0) {
        // Show results if quiz was already completed
        const score = levelProgress.quizScore;
        const totalQuestions = levelProgress.totalQuestions;
        const percentage = (score / totalQuestions) * 100;
        const passed = percentage >= 70;

        const results: QuizResult = {
          score,
          totalQuestions,
          percentage,
          passed,
          answers: questions.map((q) => ({
            questionId: q.id,
            question: q.question,
            userAnswer: levelProgress.quizAnswers[q.id],
            correctAnswer: q.answer,
            isCorrect: levelProgress.quizAnswers[q.id] === q.answer,
            options: q.options,
          })),
        };

        setQuizResults(results);
        setShowResults(true);
      }
    }
  }, [levelProgress, questions]);

  const handleAnswer = (qid: number, idx: number) => {
    if (showResults) return; // Don't allow changes after submission
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered =
    currentQuestion && answers.hasOwnProperty(currentQuestion.id);
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers.hasOwnProperty(q.id));

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!allAnswered) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const score = questions.reduce(
        (acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc),
        0,
      );

      // Submit to backend
      await submitQuiz(levelId, answers, score, questions.length);

      // Update store
      updateStoreQuiz(levelId, answers, score, questions.length);

      // Create results object
      const percentage = (score / questions.length) * 100;
      const passed = percentage >= 70;

      const results: QuizResult = {
        score,
        totalQuestions: questions.length,
        percentage,
        passed,
        answers: questions.map((q) => ({
          questionId: q.id,
          question: q.question,
          userAnswer: answers[q.id],
          correctAnswer: q.answer,
          isCorrect: answers[q.id] === q.answer,
          options: q.options,
        })),
      };

      setQuizResults(results);
      setShowResults(true);

      if (passed) {
        toast.success(
          `Quiz passed! You scored ${score}/${questions.length} (${Math.round(percentage)}%)`,
        );
      } else {
        toast.error(
          `Quiz failed. You scored ${score}/${questions.length} (${Math.round(percentage)}%). You need 70% to pass.`,
        );
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to submit quiz",
      );
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryQuiz = async () => {
    try {
      await resetQuiz(levelId);
      setAnswers({});
      setShowResults(false);
      setQuizResults(null);
      setCurrentQuestionIndex(0);
      clearError();
      toast.info("Quiz reset. You can try again!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset quiz");
      toast.error("Failed to reset quiz. Please try again.");
    }
  };

  if (!questions.length) {
    return (
      <Card className="mt-6">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading quiz...</span>
        </CardContent>
      </Card>
    );
  }

  // Show results if quiz is completed
  if (showResults && quizResults) {
    return (
      <div className="mt-6">
        <QuizResults
          results={quizResults}
          onRetry={handleRetryQuiz}
          onClaimReward={onClaimReward}
        />
      </div>
    );
  }

  // Show question-by-question quiz
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>
          Test your knowledge for this level. You need 70% (5 out of 7) to pass.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQuestion?.question}</h3>

          <RadioGroup
            value={
              currentQuestion ? answers[currentQuestion.id]?.toString() : ""
            }
            onValueChange={(value) => {
              if (currentQuestion) {
                handleAnswer(currentQuestion.id, parseInt(value));
              }
            }}
            className="space-y-3"
          >
            {currentQuestion?.options.map((option: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label
                  htmlFor={`option-${idx}`}
                  className="flex-1 cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <QuizNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          isAnswered={isAnswered}
          allAnswered={allAnswered}
          onPrevious={previousQuestion}
          onNext={nextQuestion}
          onSubmit={handleSubmitQuiz}
          isSubmitting={isSubmitting}
        />
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
  const [isLoading, setIsLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  const {
    currentLevel,
    levels,
    badges,
    updateLevelTasks: updateStoreTasks,
    completeLevel: updateStoreComplete,
    setProgress,
    setError,
    clearError,
    isLoading: storeLoading,
  } = useProgressStore();

  const levelProgress = levels[levelId];

  // Check if level is unlocked
  const isLevelUnlocked = currentLevel >= levelId;

  // Load user progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const progress = await fetchUserProgress();
        setProgress(progress);

        // Load existing task completion
        if (progress.progress[levelId]?.tasksCompleted) {
          const completedTaskIds = progress.progress[levelId].tasksCompleted;
          setTasks((prev) =>
            prev.map((task) => ({
              ...task,
              completed: completedTaskIds.includes(task.id),
            })),
          );
        }
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
  }, [levelId, setProgress, setError]);

  // Redirect if level is locked
  useEffect(() => {
    if (!isLoading && !isLevelUnlocked) {
      toast.error(
        `Level ${levelId} is locked. Complete previous levels first.`,
      );
      router.push("/play");
    }
  }, [isLoading, isLevelUnlocked, levelId, router]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  // Debounced task update
  const debouncedUpdateTasks = useCallback(
    debounce(async (taskIds: number[]) => {
      try {
        await updateLevelTasks(levelId, taskIds);
        updateStoreTasks(levelId, taskIds);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to update tasks",
        );
        toast.error("Failed to save task progress");
      }
    }, 500),
    [levelId, updateStoreTasks, setError],
  );

  const toggleTask = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );

    setTasks(updatedTasks);

    const completedTaskIds = updatedTasks
      .filter((task) => task.completed)
      .map((task) => task.id);

    debouncedUpdateTasks(completedTaskIds);
  };

  const handleCompleteLevel = async () => {
    try {
      clearError();

      // Check if quiz is passed
      const quizScore = levelProgress?.quizScore || 0;
      const totalQuestions = levelProgress?.totalQuestions || 0;
      const passPercentage =
        totalQuestions > 0 ? (quizScore / totalQuestions) * 100 : 0;

      if (passPercentage < 70) {
        toast.error(
          "You must pass the quiz (70% or higher) to complete this level",
        );
        return;
      }

      // Auto-complete all tasks when quiz passes
      const allTaskIds = tasks.map((t) => t.id);
      await updateLevelTasks(levelId, allTaskIds);
      updateStoreTasks(levelId, allTaskIds);

      // Complete level
      const result = await completeLevel(
        levelId,
        level.reward.money,
        level.reward.badge,
      );

      // Update store
      updateStoreComplete(levelId, result.newBalance, {
        levelId,
        badgeName: result.badgeEarned,
        earnedAt: new Date().toISOString(),
      });

      // Show reward modal
      setRewardData({
        levelId,
        badgeName: result.badgeEarned,
        moneyAwarded: result.moneyAwarded,
        newBalance: result.newBalance,
      });
      setShowRewardModal(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to complete level",
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to complete level",
      );
    }
  };

  const canCompleteLevel = () => {
    const quizPassed =
      levelProgress?.quizScore && levelProgress?.totalQuestions
        ? (levelProgress.quizScore / levelProgress.totalQuestions) * 100 >= 70
        : false;

    return quizPassed;
  };

  // Loading state
  if (isLoading || storeLoading) {
    return (
      <GameLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading level...</p>
          </div>
        </div>
      </GameLayout>
    );
  }

  // Level locked
  if (!isLevelUnlocked) {
    return (
      <GameLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Alert className="max-w-md">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Level {levelId} is locked. Complete previous levels to unlock this
              level.
            </AlertDescription>
          </Alert>
        </div>
      </GameLayout>
    );
  }

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
          {levelId < 5 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/play/levels/${levelId + 1}`}>
                Next Level
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="story">
                <BookOpen className="mr-2 h-4 w-4" />
                Story
              </TabsTrigger>
              <TabsTrigger value="objectives">
                <Lightbulb className="mr-2 h-4 w-4" />
                Objectives
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
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Level Reward</CardTitle>
              <CardDescription>
                Pass the quiz (70% or higher) to earn this reward
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
                disabled={!canCompleteLevel()}
                onClick={handleCompleteLevel}
              >
                {canCompleteLevel() ? "Claim Reward" : "Pass Quiz to Unlock"}
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
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read the glossary</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <CircleHelp className="h-4 w-4" />
                    <span>Watch tutorial video</span>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuestionsSection levelId={levelId} onClaimReward={handleCompleteLevel} />

      {/* Reward Modal */}
      {showRewardModal && rewardData && (
        <RewardClaimModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          levelId={rewardData.levelId}
          badgeName={rewardData.badgeName}
          moneyAwarded={rewardData.moneyAwarded}
          newBalance={rewardData.newBalance}
        />
      )}
    </GameLayout>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
