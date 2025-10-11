"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, X, CheckCircle, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelId: number;
  badgeName: string;
  moneyAwarded: number;
  newBalance: number;
  onContinue?: () => void;
}

export default function RewardClaimModal({
  isOpen,
  onClose,
  levelId,
  badgeName,
  moneyAwarded,
  newBalance,
  onContinue,
}: RewardClaimModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setAnimationStep(0);

      // Animation sequence
      const timer1 = setTimeout(() => setAnimationStep(1), 500);
      const timer2 = setTimeout(() => setAnimationStep(2), 1000);
      const timer3 = setTimeout(() => setAnimationStep(3), 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      // Navigate to next level or dashboard
      if (levelId < 5) {
        router.push(`/play/levels/${levelId + 1}`);
      } else {
        router.push("/play");
      }
    }
    onClose();
  };

  const handleClose = () => {
    setShowConfetti(false);
    setAnimationStep(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="mx-4 sm:mx-0 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            🎉 Level {levelId} Complete!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="pointer-events-none absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute h-2 w-2 animate-bounce rounded-full bg-yellow-400",
                    animationStep >= 1 && "opacity-100",
                  )}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Badge Award */}
          <div
            className={cn(
              "flex flex-col items-center space-y-3 transition-all duration-500",
              animationStep >= 1
                ? "scale-100 opacity-100"
                : "scale-75 opacity-0",
            )}
          >
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -right-1 -top-1">
                <CheckCircle className="h-6 w-6 rounded-full bg-white text-green-500" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Badge Earned!
              </h3>
              <Badge variant="secondary" className="mt-2 text-sm">
                {badgeName}
              </Badge>
            </div>
          </div>

          {/* Money Award */}
          <div
            className={cn(
              "flex items-center space-x-3 rounded-lg bg-green-50 p-4 transition-all duration-500 dark:bg-green-900/20",
              animationStep >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Virtual Money Earned
              </p>
              <p className="text-xl font-bold text-green-600">
                +₹{moneyAwarded.toLocaleString()}
              </p>
            </div>
          </div>

          {/* New Balance */}
          <div
            className={cn(
              "text-center transition-all duration-500",
              animationStep >= 3 ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              New Balance
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{newBalance.toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className={cn(
              "flex w-full space-x-3 transition-all duration-500",
              animationStep >= 3 ? "opacity-100" : "opacity-0",
            )}
          >
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {levelId < 5 ? "Next Level" : "Dashboard"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
