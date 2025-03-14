// auth.js
import { auth, googleProvider } from "@/firebase/firebase";
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserStore } from "@/store/user-store";
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result);
    console.log("User signed in:", result.user);
    const user = result.user;

    if (user) {
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      const setUser = useUserStore.getState().setUser;
      console.log("user data", userData);
      setUser(userData as any);
    }
    return
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const setUser = useUserStore.getState().setUser;
    setUser(userCredential.user as any);
    console.log("User signed in:", userCredential.user);
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};

const handleSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const setUser = useUserStore.getState().setUser;
    setUser(userCredential.user as any);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error during sign-up:", error);
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

export { signInWithGoogle, signOutUser, handleLogin, handleSignUp };
