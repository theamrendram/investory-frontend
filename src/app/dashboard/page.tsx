"use client";
import Link from "next/link";
import { Award, BookOpen, ChevronRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
import { useUserStore } from "@/store/user-store";
import { useEffect, useState } from "react";

// Animation variants for reuse
const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  rest: { scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } },
};

const buttonHover = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};


export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      setIsLoading(true);
      console.log("User signed in:", user);
      if (!user) {
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      router.push("/");
      console.error("Error during sign-in:", err);
    }
     finally {
       setIsLoading(false);
     }
  }, [user]);

  if(isLoading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <GameLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial="rest" whileHover="hover" variants={cardHover}>
          <Card className="h-full transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Level 1/5
                  </span>
                </div>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "20%" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}>
                  <Progress value={20} className="h-2" />
                </motion.div>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Level 1: The Market Awakens",
                    status: "Completed",
                    active: true,
                    delay: 0.6,
                  },
                  {
                    name: "Level 2: The IPO Mystery",
                    status: "Locked",
                    active: false,
                    delay: 0.7,
                  },
                  {
                    name: "Level 3: The Bulls & Bears",
                    status: "Locked",
                    active: false,
                    delay: 0.8,
                  },
                  {
                    name: "Level 4: The Trading Terminal",
                    status: "Locked",
                    active: false,
                    delay: 0.9,
                  },
                  {
                    name: "Level 5: The Portfolio Puzzle",
                    status: "Locked",
                    active: false,
                    delay: 1.0,
                  },
                ].map((level, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{
                      duration: 0.5,
                      delay: level.delay,
                      ease: "easeOut",
                    }}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen
                        className={`h-4 w-4 ${
                          level.active
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm">{level.name}</span>
                    </div>
                    <Badge variant={level.active ? "default" : "outline"}>
                      {level.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <motion.div
                className="w-full"
                initial="rest"
                whileHover="hover"
                variants={buttonHover}>
                <Button asChild className="w-full transition-all duration-300">
                  <Link href="/dashboard/levels/2">
                    Continue Learning
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Link>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial="rest" whileHover="hover" variants={cardHover}>
          <Card className="h-full transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Virtual Wallet</CardTitle>
              <CardDescription>Your investment capital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: "easeOut",
                  }}
                  className="text-4xl font-bold">
                  ₹10,000
                </motion.div>
                <p className="text-sm text-muted-foreground">
                  Starting Balance
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.9,
                  ease: "easeOut",
                }}
                className="mt-4 rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Recent Transactions</h4>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.1,
                    ease: "easeOut",
                  }}
                  className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Level 1 Completion Bonus</span>
                    <span className="font-medium text-green-600">+₹10,000</span>
                  </div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="rest" whileHover="hover" variants={cardHover}>
          <Card className="h-full transition-shadow duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "The Curious Investor",
                    active: true,
                    delay: 0.8,
                  },
                  {
                    name: "IPO Detective",
                    active: false,
                    delay: 0.9,
                  },
                  {
                    name: "Market Observer",
                    active: false,
                    delay: 1.0,
                  },
                  {
                    name: "The First Trade",
                    active: false,
                    delay: 1.1,
                  },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: achievement.active ? 1 : 0.5,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: achievement.delay,
                      ease: "easeOut",
                    }}
                    whileHover={achievement.active ? { scale: 1.05 } : {}}
                    className={`flex flex-col items-center rounded-lg border ${
                      !achievement.active && "border-dashed"
                    } p-4`}>
                    <motion.div
                      animate={
                        achievement.active
                          ? {
                              rotateY: [0, 360],
                              scale: [1, 1.2, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        delay: achievement.delay + 0.5,
                        ease: "easeInOut",
                      }}
                      className="mb-2">
                      <Award
                        className={`h-8 w-8 ${
                          achievement.active ? "text-primary" : ""
                        }`}
                      />
                    </motion.div>
                    <span className="text-center text-sm font-medium">
                      {achievement.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <motion.div
                className="w-full"
                initial="rest"
                whileHover="hover"
                variants={buttonHover}>
                <Button
                  variant="outline"
                  asChild
                  className="w-full transition-all duration-300">
                  <Link href="/achievements">View All Achievements</Link>
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        className="mt-6">
        <Card className="transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Today's market snapshot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "SENSEX",
                  value: "72,568.45",
                  change: "+1.2%",
                  points: "+856.7",
                  trend: "up",
                  delay: 1.0,
                },
                {
                  name: "NIFTY",
                  value: "22,045.75",
                  change: "+0.9%",
                  points: "+198.4",
                  trend: "up",
                  delay: 1.1,
                },
                {
                  name: "USD/INR",
                  value: "83.25",
                  change: "-0.3%",
                  points: "-0.25",
                  trend: "down",
                  delay: 1.2,
                },
              ].map((market, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: market.delay,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg border p-4 transition-shadow duration-300 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{market.name}</span>
                    <motion.div
                      animate={
                        market.trend === "up"
                          ? { y: [0, -3, 0] }
                          : { y: [0, 3, 0] }
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}>
                      <TrendingUp
                        className={`h-4 w-4 ${
                          market.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: market.delay + 0.2,
                      ease: "easeOut",
                    }}
                    className="mt-2 text-2xl font-bold">
                    {market.value}
                  </motion.div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      market.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                    <span>{market.change}</span>
                    <span className="text-muted-foreground">
                      ({market.points})
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </GameLayout>
  );
}
