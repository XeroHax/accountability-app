"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";

interface EmailAuthFormProps {
  className?: string;
}

export default function EmailAuthForm({ className = "" }: EmailAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result: UserCredential;

      if (isSignUp) {
        // Create new user with email and password
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      const user = result.user;

      if (isSignUp) {
        // Check if user document already exists
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            display_name: user.displayName || email.split("@")[0], // Use part of email as display name if none provided
            photo_url: null, // Email auth doesn't provide a photo URL
            created_time: serverTimestamp()
          });
        }
      }

      // Redirect to goals setup page
      router.push("/goals-setup");
    } catch (err: unknown) {
      console.error("Error with email authentication:", err);

      // Type guard for Firebase Auth Error
      const firebaseError = err as { code?: string; message?: string };

      // Handle specific Firebase auth errors
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try signing in instead.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground/70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-white focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground/70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm bg-white focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="••••••••"
            required
            minLength={6}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? <span className="animate-spin mr-2">⟳</span> : null}
          {loading
            ? "Processing..."
            : isSignUp
            ? "Sign up with Email"
            : "Sign in with Email"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-foreground/50 hover:text-foreground/70 focus:outline-none"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </form>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
