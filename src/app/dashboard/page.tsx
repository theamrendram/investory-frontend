import Link from "next/link";
import { Award, BookOpen, ChevronRight, TrendingUp } from "lucide-react";

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
import GameLayout from "@/components/game-layout";

export default function DashboardPage() {
  return (
    <GameLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">Level 1/5</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">Level 1: The Market Awakens</span>
                </div>
                <Badge>Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Level 2: The IPO Mystery</span>
                </div>
                <Badge variant="outline">Locked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Level 3: The Bulls & Bears</span>
                </div>
                <Badge variant="outline">Locked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Level 4: The Trading Terminal</span>
                </div>
                <Badge variant="outline">Locked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Level 5: The Portfolio Puzzle</span>
                </div>
                <Badge variant="outline">Locked</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/levels/2">
                Continue Learning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Virtual Wallet</CardTitle>
            <CardDescription>Your investment capital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-6">
              <div className="text-4xl font-bold">₹10,000</div>
              <p className="text-sm text-muted-foreground">Starting Balance</p>
            </div>
            <div className="mt-4 rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-medium">Recent Transactions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Level 1 Completion Bonus</span>
                  <span className="font-medium text-green-600">+₹10,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Badges you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg border p-4">
                <Award className="mb-2 h-8 w-8 text-primary" />
                <span className="text-center text-sm font-medium">
                  The Curious Investor
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-dashed p-4 opacity-50">
                <Award className="mb-2 h-8 w-8" />
                <span className="text-center text-sm">IPO Detective</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-dashed p-4 opacity-50">
                <Award className="mb-2 h-8 w-8" />
                <span className="text-center text-sm">Market Observer</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-dashed p-4 opacity-50">
                <Award className="mb-2 h-8 w-8" />
                <span className="text-center text-sm">The First Trade</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/achievements">View All Achievements</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Today's market snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SENSEX</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="mt-2 text-2xl font-bold">72,568.45</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <span>+1.2%</span>
                  <span className="text-muted-foreground">(+856.7)</span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">NIFTY</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="mt-2 text-2xl font-bold">22,045.75</div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <span>+0.9%</span>
                  <span className="text-muted-foreground">(+198.4)</span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">USD/INR</span>
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div className="mt-2 text-2xl font-bold">83.25</div>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <span>-0.3%</span>
                  <span className="text-muted-foreground">(-0.25)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}
