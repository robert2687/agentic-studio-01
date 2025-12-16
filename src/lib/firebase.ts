
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

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

// Only initialize Firebase if running in browser AND config is complete
if (typeof window !== "undefined" && isFirebaseConfigured) {
  if (getApps().length) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
} else if (typeof window !== "undefined" && !isFirebaseConfigured) {
  console.warn("Firebase configuration is incomplete. Please set all required environment variables.");
}

export { app, auth };
