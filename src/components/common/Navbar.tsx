"use client";
import { use, useEffect, useState } from "react";
import {
  Search,
  PieChart,
  Bell,
  User,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { signInWithGoogle, signOutUser } from "@/firebase/auth";
import { useUserStore } from "@/store/user-store";
import { Button } from "../ui/button";
import ClientOnly from "./client-only";

const Navbar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <nav className="flex h-16 w-full items-center justify-between bg-primary px-6 py-3 text-white">
      {/* Logo section */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold">INVESTORY</div>
      </div>

      <div className="flex items-center space-x-4">
        {/* CHANGE: Added More dropdown and adjusted icons */}
        {user && (
          <Button
            variant={"outline"}
            className="bg-slate-600 hover:bg-slate-500"
            onClick={() => {
              window.location.href = "/play";
            }}
          >
            Go to Dashboard
          </Button>
        )}
        <ClientOnly>
          {user === null ? (
            <Button
              className="flex items-center space-x-1 text-primary hover:text-green-50"
              variant={"outline"}
              onClick={() => signInWithGoogle()}
            >
              Sign In
            </Button>
          ) : (
            <div className="flex items-center gap-1">
              <p className="font-medium">{user.name?.split(" ")[0]}</p>
              <Button onClick={() => signOutUser()} className="text-red-500">
                Sign Out
              </Button>
            </div>
          )}
        </ClientOnly>
      </div>
    </nav>
  );
};

export default Navbar;
