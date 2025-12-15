
"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import { auth } from "./firebase";

export async function signInWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signUpWithEmail(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
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

export function signOut() {
  if (!auth) {
    throw new Error("Firebase auth is not initialized");
  }
  return firebaseSignOut(auth);
}

export function useAuth(callback: (user: User | null) => void) {
  if (!auth) {
    console.warn("Firebase auth is not initialized. Auth state will not be monitored.");
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
