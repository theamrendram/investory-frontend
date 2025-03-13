"use client";
import React from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useUserStore } from "@/store/user-store";
const SignInButton = () => {
  const user = useUserStore((state) => state.user);
  return <button onClick={() => signInWithGoogle()}></button>;
};

export default SignInButton;
