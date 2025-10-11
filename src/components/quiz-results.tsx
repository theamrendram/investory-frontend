"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  answers: Array<{
    questionId: number;
    question: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    options: string[];
  }>;
}

interface QuizResultsProps {
  results: QuizResult;
  onRetry: () => void;
  onClaimReward: () => void;
  isClaiming?: boolean;
}

export function QuizResults({
  results,
  onRetry,
  onClaimReward,
  isClaiming = false,
}: QuizResultsProps) {
  const { score, totalQuestions, percentage, passed, answers } = results;

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          {passed ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <XCircle className="h-8 w-8" />
            </div>
          )}
        </div>

        <CardTitle
          className={cn("text-2xl", passed ? "text-green-600" : "text-red-600")}
        >
          {passed ? "🎉 Quiz Passed!" : "❌ Quiz Failed"}
        </CardTitle>

        <CardDescription className="text-lg">
          Score: {score} out of {totalQuestions} ({percentage}%)
        </CardDescription>

        <div className="mt-4 flex justify-center">
          <Badge
            variant={passed ? "default" : "destructive"}
            className={cn(
              "px-4 py-2 text-sm",
              passed
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
            )}
          >
            {passed ? "Congratulations!" : "Keep Learning!"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <h3 className="mb-4 text-lg font-semibold">Answer Review</h3>

          {answers.map((result, idx) => (
            <div
              key={result.questionId}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                result.isCorrect
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-medium">Q{idx + 1}:</span>
                    <span className="text-sm text-muted-foreground">
                      {result.question}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        result.isCorrect
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300",
                      )}
                    >
                      <span className="font-medium">Your answer:</span>
                      <span>{result.options[result.userAnswer]}</span>
                      {result.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>

                    {!result.isCorrect && (
                      <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                        <span className="font-medium">Correct answer:</span>
                        <span>{result.options[result.correctAnswer]}</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <span
                    className={cn(
                      "text-2xl",
                      result.isCorrect ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {result.isCorrect ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        {passed ? (
          <Button
            onClick={onClaimReward}
            disabled={isClaiming}
            className="px-8 py-3 text-lg"
          >
            {isClaiming ? "Claiming Reward..." : "Claim Reward & Continue"}
          </Button>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Don't worry! Review the correct answers above and try again.
            </p>
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Quiz
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
