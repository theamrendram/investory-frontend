"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  allAnswered: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function QuizNavigation({
  currentQuestionIndex,
  totalQuestions,
  isAnswered,
  allAnswered,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
}: QuizNavigationProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={onSubmit}
            disabled={!allAnswered || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isAnswered}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
