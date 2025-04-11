"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LevelHeaderProps {
  levelId: number;
  title: string;
  subtitle: string;
  isCompleted?: boolean;
  onComplete?: () => void;
}

export default function LevelHeader({
  levelId,
  title,
  subtitle,
  isCompleted = false,
  onComplete,
}: LevelHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Level {levelId}: {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {levelId > 1 && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/levels/${levelId - 1}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Level
            </Link>
          </Button>
        )}
        {/* {levelId < 5 && !isCompleted && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/levels/${levelId + 1}`}>
              Next Level
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {isCompleted && onComplete && (
          <Button size="sm" onClick={onComplete}>
            {levelId < 5 ? (
              <>
                Next Level
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Game"
            )}
          </Button>
        )} */}
      </div>
    </div>
  );
}
