import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Support loading Firebase config from environment variables (safe for public code)
// with a fallback to the local configuration file if present
const env = (import.meta as any).env || {};

// import.meta.glob allows dynamic checking of local file presence during build
// preventing compilation failures if firebase-applet-config.json is absent (due to .gitignore)
const configFiles = (import.meta as any).glob('../firebase-applet-config.json', { eager: true }) as Record<string, any>;
const localConfig = configFiles['../firebase-applet-config.json']?.default || configFiles['../firebase-applet-config.json'] || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || localConfig.apiKey || "missing-api-key-please-configure-in-netlify",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "missing-auth-domain-please-configure",
  projectId: env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || "missing-project-id-please-configure",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "missing-storage-bucket",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "missing-sender-id",
  appId: env.VITE_FIREBASE_APP_ID || localConfig.appId || "missing-app-id",
  firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || "ai-studio-66922dff-4faa-4cac-8607-237f0774bb38",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || localConfig.measurementId || '',
};

const isConfigMissing = 
  !env.VITE_FIREBASE_API_KEY && !localConfig.apiKey ||
  !env.VITE_FIREBASE_PROJECT_ID && !localConfig.projectId;

if (isConfigMissing) {
  console.warn(
    "⚠️ Firebase configuration is missing! The app is running in offline/demo fallback mode. " +
    "If you are deploying on Netlify or Vercel, please define the VITE_FIREBASE_* environment variables " +
    "in your deployment settings panel so that the live database and login function correctly."
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

// Connectivity check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check configuration.");
    }
  }
}
testConnection();
