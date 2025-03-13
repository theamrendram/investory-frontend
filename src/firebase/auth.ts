// auth.js
import { auth, googleProvider } from "@/firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useUserStore } from "@/store/user-store";
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const setUser = useUserStore.getState().setUser;
    setUser(result.user as any);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    const removeUser = useUserStore.getState().removeUser;
    removeUser();
    console.log("User signed out.");
  } catch (error) {
    console.error("Error during sign-out:", error);
  }
};

export { signInWithGoogle, signOutUser };
