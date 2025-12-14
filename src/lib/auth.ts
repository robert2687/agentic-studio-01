
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
  return firebaseSignOut(auth);
}

export function useAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
