// auth.js
import { auth, googleProvider } from "@/firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("User signed in:", user);
    // Handle user data as needed
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

export { signInWithGoogle, signOutUser };
