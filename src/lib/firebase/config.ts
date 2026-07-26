import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for mandatory config values to prevent crash
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

// Initialize Firebase defensively
let app;
try {
  if (isConfigValid) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  } else {
    console.warn("Firebase config is incomplete. Some features like Notifications and Auth will be disabled.");
    app = getApps().length === 0 ? initializeApp({ apiKey: "empty", projectId: "empty", appId: "empty" }) : getApps()[0];
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export const messaging = (typeof window !== "undefined" && isConfigValid) ? getMessaging(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;
