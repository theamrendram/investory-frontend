import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/store/user-store";
import axios from "axios";
import getIdToken from "@/firebase/getIdToken";

export function useAuth(requireAuth: boolean = true) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const isMounted = useRef(true);
  const authStateListener = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!isMounted.current) return;

        if (firebaseUser) {
          // User is signed in
          setAuthenticated(true);
          setError(null);

          // Update user store if needed
          if (!user || user.uid !== firebaseUser.uid) {
            try {
              // Fetch user data from backend
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
                {
                  firebase_uid: firebaseUser.uid,
                  name:
                    firebaseUser.displayName ||
                    firebaseUser.email?.split("@")[0],
                  email: firebaseUser.email,
                },
              );

              // Update user store with fresh data
              const userData = {
                uid: firebaseUser.uid,
                name:
                  firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                email: firebaseUser.email,
                avatar: firebaseUser.photoURL,
                amount: Math.round(response.data.amount),
                level: response.data.currentLevel,
                idToken: await getIdToken(),
              };

              setUser(userData as any);
            } catch (error) {
              console.error("Error fetching user data:", error);
              // Still set authenticated but with basic Firebase data
              const userData = {
                uid: firebaseUser.uid,
                name:
                  firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                email: firebaseUser.email,
                avatar: firebaseUser.photoURL,
                amount: 0,
                level: 1,
                idToken: await getIdToken(),
              };
              setUser(userData as any);
            }
          }
        } else {
          // User is signed out
          setAuthenticated(false);
          if (requireAuth) {
            router.push("/auth/login");
          }
        }
        setLoading(false);
      },
      (error) => {
        if (!isMounted.current) return;

        console.error("Auth state change error:", error);
        setError("Authentication error occurred");
        setLoading(false);
        setAuthenticated(false);

        if (requireAuth) {
          router.push("/auth/login");
        }
      },
    );

    authStateListener.current = unsubscribe;

    return () => {
      if (authStateListener.current) {
        authStateListener.current();
      }
    };
  }, [requireAuth, router, user, setUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (authStateListener.current) {
        authStateListener.current();
      }
    };
  }, []);

  return { loading, authenticated, user, error };
}
