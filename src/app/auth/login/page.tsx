"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth } from "@/firebase/firebase";
import { signInWithGoogle } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/store/user-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const authStateListener = useRef<(() => void) | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push("/play");
      return;
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!isMounted.current) return;

        if (firebaseUser) {
          router.push("/play");
        }
      },
      (error) => {
        if (!isMounted.current) return;

        console.error("Auth state change error:", error);
        setError("Authentication error occurred. Please try again.");
        setLoading(false);
      },
    );

    authStateListener.current = unsubscribe;

    return () => {
      if (authStateListener.current) {
        authStateListener.current();
      }
    };
  }, [user, router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (authStateListener.current) {
        authStateListener.current();
      }
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      toast.success("Successfully logged in with Google!");
      // Don't manually redirect here - let the auth state listener handle it
    } catch (error: any) {
      if (!isMounted.current) return;

      console.error("Google login error:", error);

      // Handle specific error cases
      let errorMessage = "Failed to login with Google";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setRetryCount((prev) => prev + 1);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    handleGoogleLogin();
  };

  const handleClearError = () => {
    setError(null);
    setRetryCount(0);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Welcome to Investory
            </CardTitle>
            <CardDescription>
              Sign in or sign up to your account to continue learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearError}
                      className="h-6 px-2 text-xs"
                    >
                      Dismiss
                    </Button>
                    {retryCount < 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetry}
                        className="h-6 px-2 text-xs"
                        disabled={loading}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Retry
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading || retryCount >= 3}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {loading
                ? "Signing in..."
                : retryCount >= 3
                  ? "Too many attempts. Please refresh the page."
                  : "Sign in with Google"}
            </Button>

            {retryCount >= 3 && (
              <div className="text-center">
                <p className="mb-2 text-sm text-muted-foreground">
                  Having trouble signing in?
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-xs"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Refresh Page
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
