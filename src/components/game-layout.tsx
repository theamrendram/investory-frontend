"use client";

import { type ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Menu,
  TrendingUp,
  User,
  Lock,
  CheckCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserStore } from "@/store/user-store";
import SignOutButton from "@/components/common/SignOutButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Determine current level from pathname
  const currentLevel = pathname.includes("/levels/")
    ? Number.parseInt(pathname.split("/levels/")[1])
    : 0;

  const [userLevel, setUserLevel] = useState(user?.level || 1);
  const [balance, setBalance] = useState(user?.amount || 10000);

  // Update user level when current level is higher
  useEffect(() => {
    if (currentLevel > 0 && currentLevel > userLevel) {
      setUserLevel(currentLevel);
      // Update user in store
      if (user) {
        setUser({
          ...user,
          level: currentLevel,
        });
      }
    }
  }, [currentLevel, user, userLevel, setUser]);

  const levels = [
    { id: 1, name: "The Market", completed: userLevel > 1 },
    { id: 2, name: "The IPO", completed: userLevel > 2 },
    { id: 3, name: "Bulls & Bears", completed: userLevel > 3 },
    { id: 4, name: "Trading Terminal", completed: userLevel > 4 },
    { id: 5, name: "Portfolio", completed: userLevel > 5 },
  ];

  const badges = [
    { id: 1, name: "The Curious Investor", unlocked: userLevel > 1 },
    { id: 2, name: "IPO Detective", unlocked: userLevel > 2 },
    { id: 3, name: "Market Observer", unlocked: userLevel > 3 },
    { id: 4, name: "The First Trade", unlocked: userLevel > 4 },
    { id: 5, name: "Portfolio Strategist", unlocked: userLevel > 5 },
  ];

  // Function to complete current level and proceed to next
  const completeLevel = (levelId: any) => {
    const nextLevel = levelId + 1;
    if (nextLevel <= 5) {
      // Update user level in store
      if (user) {
        setUser({
          ...user,
          level: nextLevel,
        });
      }
      setUserLevel(nextLevel);

      // Navigate to the next level
      router.push(`/play/levels/${nextLevel}`);
    } else {
      // Handle game completion
      router.push("/dashboard/completion");
    }
  };

  // Helper function to render level items with proper locking
  const renderLevelItem = (level: any) => {
    const isLocked = level.id > userLevel;
    const isActive = pathname === `/play/levels/${level.id}`;
    const isCompleted = level.completed;

    // For locked levels
    if (isLocked) {
      return (
        <TooltipProvider key={level.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1 opacity-50 cursor-not-allowed",
                  isActive && "bg-accent"
                )}>
                <BookOpen className="h-4 w-4" />
                <span>
                  Level {level.id}: {level.name}
                </span>
                <Lock className="h-4 w-4 ml-auto" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Complete previous levels to unlock</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // For unlocked levels
    return (
      <Link
        key={level.id}
        href={`/play/levels/${level.id}`}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent",
          isActive && "bg-accent font-medium",
          isCompleted && "text-green-600"
        )}>
        <BookOpen className="h-4 w-4" />
        <span>
          Level {level.id}: {level.name}
        </span>
        {isCompleted && (
          <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
        )}
      </Link>
    );
  };

  // Helper function to render sidebar menu items with locking
  const renderSidebarMenuItem = (level: any) => {
    const isLocked = level.id > userLevel;
    const isActive = pathname === `/play/levels/${level.id}`;
    const isCompleted = level.completed;

    // For locked levels
    if (isLocked) {
      return (
        <SidebarMenuItem key={level.id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1 opacity-50 cursor-not-allowed",
                    isActive && "bg-accent"
                  )}>
                  <BookOpen className="h-4 w-4" />
                  <span>
                    Level {level.id}: {level.name}
                  </span>
                  <Lock className="h-4 w-4 ml-auto" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete previous levels to unlock</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarMenuItem>
      );
    }

    // For unlocked levels
    return (
      <SidebarMenuItem key={level.id}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={cn("my-1", isCompleted && "text-green-600")}>
          <Link href={`/play/levels/${level.id}`}>
            <BookOpen className="h-4 w-4" />
            <span>
              Level {level.id}: {level.name}
            </span>
            {isCompleted && (
              <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                <Link href="/" className="flex items-center gap-2 px-2 py-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-semibold">Investory</span>
                </Link>
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent ${
                      pathname === "/dashboard" ? "bg-accent font-medium" : ""
                    }`}>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {levels.map((level) => renderLevelItem(level))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-lg font-semibold">Investory</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">₹{balance.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar className="hidden lg:flex bg-purple-50 border-r border-blue-500 shadow-sm">
          <SidebarHeader className="border-b border-blue-500 px-6 py-3 bg-blue-50">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xl font-bold">Investory</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="bg-blue-50">
            <div className="px-4 py-2">
              <div className="mb-4 flex items-center gap-4 rounded-lg border p-3">
                <Avatar>
                  <AvatarImage src={user?.avatar || ""} alt="Avatar" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user?.name || "batman"}{" "}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard className="h-3 w-3" />
                    <span>₹{balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium">Progress</span>
                  <span className="text-xs text-muted-foreground">
                    Level {userLevel}/5
                  </span>
                </div>
                <Progress value={userLevel * 20} className="h-2" />
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/dashboard"
                      className={`${
                        pathname === "/dashboard" ? "bg-accent text-white" : ""
                      }`}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <div className="my-2 px-2">
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    LEVELS
                  </h3>
                  {levels.map((level) => renderSidebarMenuItem(level))}
                </div>
                <div className="my-2 px-2">
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    PROFILE
                  </h3>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/achievements">
                        <Award className="h-4 w-4" />
                        <span>Achievements</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/achievements">
                        <Award className="h-4 w-4" />
                        <span>
                          <SignOutButton className="bg-transparent hover:bg-transparent text-black hover:text-white p-0" />
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t border-blue-500 p-4 bg-blue-50">
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                BADGES
              </h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={badge.unlocked ? "default" : "outline"}
                    className={cn(
                      "cursor-default",
                      !badge.unlocked && "opacity-50"
                    )}>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 pt-14 lg:pt-0 bg-blue-50">
          <main className="container mx-auto p-4 lg:p-6">
            {children}

            {/* Level completion button - can be conditionally rendered when level is completed */}
            {/* {pathname.includes("/levels/") &&
              currentLevel === userLevel &&
              currentLevel < 5 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => completeLevel(currentLevel)}
                    className="bg-green-600 hover:bg-green-700">
                    Complete Level {currentLevel} & Unlock Next
                  </Button>
                </div>
              )} */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
