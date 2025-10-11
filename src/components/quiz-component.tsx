"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import createAxiosInstance from "@/lib/axios-instance";

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => Promise<void>;
  showDialog?: boolean;
  levelId?: number;
}

export function QuizComponent({
  questions,
  onComplete,
  showDialog = false,
  levelId,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isCurrentQuestionAnswered = answers[currentQuestion.id] !== undefined;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: parseInt(value),
    }));
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (allQuestionsAnswered) {
      setIsSubmitted(true);
      const score = questions.reduce(
        (acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc),
        0,
      );

      // Save quiz progress to backend if levelId is provided
      if (levelId) {
        try {
          const axiosInstance = await createAxiosInstance();
          await axiosInstance.put(`/api/progress/level/${levelId}`, {
            quizScore: score,
            totalQuestions: questions.length,
            quizAnswers: answers,
          });
        } catch (error) {
          console.error("Error saving quiz progress:", error);
        }
      }

      // Call onComplete callback
      if (onComplete) {
        await onComplete(score, questions.length);
      }
    }
  };

  // Auto-close dialog after 2 seconds when submitted
  useEffect(() => {
    if (isSubmitted && showDialog) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        // Reset quiz state when dialog closes
        setCurrentQuestionIndex(0);
        setAnswers({});
        setIsSubmitted(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, showDialog]);

  const handleDialogClose = () => {
    setIsOpen(false);
    // Reset quiz state when dialog closes
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    return questions.reduce(
      (acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc),
      0,
    );
  };

  const renderQuizContent = () => {
    if (isSubmitted) {
      const score = calculateScore();
      return (
        <div>
          <div className="rounded-lg bg-green-50 p-4 text-green-900 dark:bg-green-900/20 dark:text-green-200">
            <p className="font-semibold">Quiz Complete!</p>
            <p>
              You scored {score} out of {questions.length}.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Progress Header */}
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6 h-2" />

        {/* Question */}
        <div className="mb-6">
          <p className="mb-4 text-lg font-medium">{currentQuestion.question}</p>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={handleAnswerChange}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`q${currentQuestion.id}-opt${index}`}
                />
                <Label htmlFor={`q${currentQuestion.id}-opt${index}`}>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="flex items-center gap-2"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (showDialog) {
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} className="mt-6">
          Start Quiz
        </Button>
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Quiz</DialogTitle>
              <DialogDescription>
                Test your knowledge for this level
              </DialogDescription>
            </DialogHeader>
            {renderQuizContent()}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Inline version (backward compatibility)
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>Test your knowledge for this level</CardDescription>
      </CardHeader>
      <CardContent>{renderQuizContent()}</CardContent>
    </Card>
  );
}
