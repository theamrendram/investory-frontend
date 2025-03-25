"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Menu,
  TrendingUp,
  User,
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

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const pathname = usePathname();
  const currentLevel = pathname.includes("/levels/")
    ? Number.parseInt(pathname.split("/levels/")[1])
    : 0;
    const user = useUserStore((state) => state.user);
    const [balance, setBalance] = useState(user?.amount || 10000);
  const levels = [
    { id: 1, name: "The Market Awakens", completed: currentLevel > 1 },
    { id: 2, name: "The IPO Mystery", completed: currentLevel > 2 },
    { id: 3, name: "The Bulls & Bears", completed: currentLevel > 3 },
    { id: 4, name: "The Trading Terminal", completed: currentLevel > 4 },
    { id: 5, name: "The Portfolio Puzzle", completed: currentLevel > 5 },
  ];

  const badges = [
    { id: 1, name: "The Curious Investor", unlocked: currentLevel > 1 },
    { id: 2, name: "IPO Detective", unlocked: currentLevel > 2 },
    { id: 3, name: "Market Observer", unlocked: currentLevel > 3 },
    { id: 4, name: "The First Trade", unlocked: currentLevel > 4 },
    { id: 5, name: "Portfolio Strategist", unlocked: currentLevel > 5 },
  ];

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
                  <span className="text-lg font-semibold">StockSage</span>
                </Link>
                <div className="flex flex-col gap-2 px-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {levels.map((level) => (
                    <Link
                      key={level.id}
                      href={`/dashboard/levels/${level.id}`}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent",
                        pathname === `/dashboard/levels/${level.id}` &&
                          "bg-accent font-medium"
                      )}>
                      <BookOpen className="h-4 w-4" />
                      <span>Level {level.id}</span>
                      {level.completed && (
                        <Badge variant="outline" className="ml-auto">
                          Completed
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-lg font-semibold">StockSage</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">₹{balance.toLocaleString()}</span>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar className="hidden lg:flex">
          <SidebarHeader className="border-b px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xl font-bold">StockSage</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
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
                    Level {currentLevel}/5
                  </span>
                </div>
                <Progress value={currentLevel * 20} className="h-2" />
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <div className="my-2 px-2">
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    LEVELS
                  </h3>
                  {levels.map((level) => (
                    <SidebarMenuItem key={level.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/dashboard/levels/${level.id}`}>
                        <Link href={`/dashboard/levels/${level.id}`}>
                          <BookOpen className="h-4 w-4" />
                          <span>
                            Level {level.id}: {level.name}
                          </span>
                          {level.completed && (
                            <Badge variant="outline" className="ml-auto">
                              Completed
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
                </div>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
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
        <div className="flex-1 pt-14 lg:pt-0">
          <main className="container mx-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
