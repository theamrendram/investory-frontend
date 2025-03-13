"use client";
import { useEffect, useState } from "react";
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
    <nav className="bg-primary text-white px-6 py-3 flex items-center justify-between h-16 w-full">
      {/* Logo section */}
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold">Project</div>
      </div>
      {/* Search bar */}
      <div className="flex-grow mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search stocks, MFs, smallcases & more"
            className="w-full bg-[#1A2A3A] text-white px-4 py-2 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* CHANGE: Added More dropdown and adjusted icons */}
        <button className="flex items-center space-x-1 hover:text-green-500">
          <PieChart size={20} />
          <span>Portfolio</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-green-500">
          <CreditCard size={20} />
          <span>Credit</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-green-500">
          <span>More</span>
          <ChevronDown size={16} />
        </button>
        <ClientOnly>
          {user === null ? (
            <Button
              className="flex items-center space-x-1 text-primary hover:text-green-50"
              variant={"outline"}
              onClick={() => signInWithGoogle()}>
              Sign In
            </Button>
          ) : (
            <div className="">
              <p>{user.displayName}</p>
              <Button onClick={() => signOutUser()}>Sign Out</Button>
            </div>
          )}
        </ClientOnly>
      </div>
    </nav>
  );
};

export default Navbar;
