"use client";

import { useState } from "react";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, appleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";

interface AppleAuthButtonProps {
  className?: string;
}

export default function AppleAuthButton({ className = "" }: AppleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Apple
      const result: UserCredential = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      // Check if user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          display_name: user.displayName,
          photo_url: user.photoURL,
          created_time: serverTimestamp()
        });
      }
      
      // Redirect to goals setup page
      router.push("/goals-setup");
    } catch (err) {
      console.error("Error signing in with Apple:", err);
      setError("Failed to sign in with Apple. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleAppleSignIn}
        disabled={loading}
        className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-background bg-foreground border border-border rounded-md shadow-sm hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {loading ? (
          <span className="mr-2 animate-spin">⟳</span>
        ) : (
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
            />
          </svg>
        )}
        {loading ? "Signing in..." : "Sign in with Apple"}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
