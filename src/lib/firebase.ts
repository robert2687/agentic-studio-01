
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required Firebase config values are present
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firebaseInitPromise: Promise<void> | null = null;

// Lazy initialization function
async function initializeFirebase() {
  if (firebaseInitPromise) {
    return firebaseInitPromise;
  }

  if (typeof window === "undefined" || !isFirebaseConfigured) {
    if (typeof window !== "undefined") {
      console.warn("Firebase configuration is incomplete. Please set all required environment variables.");
    }
    return;
  }

  firebaseInitPromise = (async () => {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");

    if (getApps().length) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    auth = getAuth(app);
  })();

  return firebaseInitPromise;
}

// Getter functions that initialize Firebase on demand
export async function getFirebaseApp(): Promise<FirebaseApp | undefined> {
  await initializeFirebase();
  return app;
}

export async function getFirebaseAuth(): Promise<Auth | undefined> {
  await initializeFirebase();
  return auth;
}

// For backward compatibility, export app and auth (but they will be undefined until initialized)
export { app, auth };
