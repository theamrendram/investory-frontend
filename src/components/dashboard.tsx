"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import SignInButton from "./common/SignInButton";
import SignOutButton from "./common/SignOutButton";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
        // Redirect to login page or show login button
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>
        Dashboard
        {isLoggedIn ? (
          <p>   
            You are logged in. <SignOutButton />
          </p>
        ) : (
          <SignInButton />
        )}
      </h1>
    </div>
  );
};

export default Dashboard;
