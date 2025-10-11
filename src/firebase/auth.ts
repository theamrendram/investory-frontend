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
    console.log("User signed in:", result.user);
    const user = result.user;

    // check if user exists in database
    const getUser = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
      {
        firebase_uid: user.uid,
        name: user.displayName,
        email: user.email,
      },
    );
    const userFromDB = getUser.data;

    // set user in store
    if (user && userFromDB) {
      console.log("getUser", userFromDB);
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        amount: Math.round(userFromDB.data.amount),
        level: userFromDB.data.currentLevel,
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

const handleSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Fetch user data from backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
      {
        firebase_uid: user.uid,
        name: user.displayName || user.email?.split("@")[0],
        email: user.email,
      },
    );

    // Update user store with fresh data
    const userData = {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0],
      email: user.email,
      avatar: user.photoURL,
      amount: Math.round(response.data.data.amount),
      level: response.data.data.currentLevel,
      idToken: await getIdToken(),
    };

    const setUser = useUserStore.getState().setUser;
    setUser(userData as any);
    console.log("User signed up:", userCredential.user);
    return user;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
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

export { signInWithGoogle, signOutUser, handleSignUp };
