
"use client";

import * as React from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

export async function signInWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  let result = null,
    error = null;
  try {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signUpWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  let result = null,
    error = null;
  try {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  const provider = new GoogleAuthProvider();
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    error = e;
  }
  return { result, error };
}

export async function signOut() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  const { signOut: firebaseSignOut } = await import("firebase/auth");
  return firebaseSignOut(auth);
}

export function useAuth(callback: (user: User | null) => void) {
  const [authModule, setAuthModule] = React.useState<{ unsubscribe: () => void } | null>(null);
  
  React.useEffect(() => {
    getFirebaseAuth().then(async (auth) => {
      if (!auth) {
        console.warn("Firebase auth is not initialized. Auth state will not be monitored.");
        return;
      }
      const { onAuthStateChanged } = await import("firebase/auth");
      const unsubscribe = onAuthStateChanged(auth, callback);
      setAuthModule({ unsubscribe });
    });
  }, [callback]);

  return () => {
    if (authModule?.unsubscribe) {
      authModule.unsubscribe();
    }
  };
}
