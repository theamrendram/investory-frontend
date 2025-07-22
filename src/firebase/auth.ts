// auth.js
import { auth, googleProvider } from "@/firebase/firebase";
import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUserStore } from "@/store/user-store";
import axios from "axios";
import getIdToken from "@/firebase/getIdToken";
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result);
    console.log("User signed in:", result.user);
    const user = result.user;

    // check if user exists in database
    const getUser = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
      {
        firebase_id: user.uid,
        name: user.displayName,
        email: user.email,
      }
    );
    console.log("get user", getUser);

    // set user in store
    if (user && getUser) {
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        amount: Math.round(getUser.data.amount),
        level: getUser.data.currentLevel,
        idToken: await getIdToken(),
      };
      const setUser = useUserStore.getState().setUser;
      console.log("user data", userData);
      setUser(userData as any);
    }
    return;
  } catch (error) {
    console.error("Error during sign-in:", error);
  }
};
// handleLogin and handleSignUp functions
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

// signOutUser function
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
