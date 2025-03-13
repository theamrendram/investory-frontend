"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { signInWithGoogle } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/store/user-store";
import { setuid } from "process";
const Login = () => {
  const [error, setError] = useState("");
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("User signed in:", user);
    } catch (err: any) {
      router.push("/dashboard");
      console.error("Error during sign-in:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
        // Redirect to login page or show login button
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <motion.div
      className="flex h-screen justify-center items-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        className="bg-gray-800 p-8 rounded-xl shadow-lg text-center"
        initial={{ y: "-100vh" }}
        animate={{ y: 0 }}
        exit={{ y: "100vh" }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}>
        <motion.h1
          className="text-2xl font-bold mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}>
          Welcome Back
        </motion.h1>
        <p className="mb-6">Sign in to access your account</p>

        {error && (
          <motion.p
            className="text-red-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            {error}
          </motion.p>
        )}

        <motion.button
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md shadow-md font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}>
          Sign in with Google
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Login;
