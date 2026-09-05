import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Official project configuration for website-ustaz-syaiful
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDd86ggV9Em9dp7oFo-JYp7ykcBaO6Fswc",
  authDomain: "website-ustaz-syaiful.firebaseapp.com",
  projectId: "website-ustaz-syaiful",
  storageBucket: "website-ustaz-syaiful.firebasestorage.app",
  messagingSenderId: "451218433070",
  appId: "1:451218433070:web:043b429d9969a4cfcf6bbf",
  firestoreDatabaseId: "(default)"
};

// Read config dynamically from localStorage fallback, applet config, or Vite env variables
export function getFirebaseConfig() {
  const env = (import.meta as any).env || {};
  let localConfig: any = {};
  try {
    const saved = localStorage.getItem('portal_gpi_firebase_custom_config');
    if (saved) {
      localConfig = JSON.parse(saved);
    }
  } catch (e) {
    // Ignore JSON error
  }

  return {
    apiKey: localConfig.apiKey || env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: localConfig.authDomain || env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: localConfig.projectId || env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: localConfig.storageBucket || env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: localConfig.messagingSenderId || env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: localConfig.appId || env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
    firestoreDatabaseId: localConfig.firestoreDatabaseId || env.VITE_FIREBASE_DATABASE_ID || DEFAULT_FIREBASE_CONFIG.firestoreDatabaseId
  };
}

export function saveCustomFirebaseConfig(config: {
  apiKey: string;
  projectId: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}) {
  localStorage.setItem('portal_gpi_firebase_custom_config', JSON.stringify(config));
  // Reset cached instances
  app = null;
  db = null;
  auth = null;
}

export function clearCustomFirebaseConfig() {
  localStorage.removeItem('portal_gpi_firebase_custom_config');
  app = null;
  db = null;
  auth = null;
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
}

export function initFirebase(): { app: FirebaseApp | null; db: Firestore | null; auth: Auth | null } {
  if (app && db && auth) {
    return { app, db, auth };
  }

  const config = getFirebaseConfig();
  if (!config.apiKey || !config.projectId) {
    return { app: null, db: null, auth: null };
  }

  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    db = getFirestore(app, config.firestoreDatabaseId || '(default)');
    auth = getAuth(app);
    return { app, db, auth };
  } catch (err) {
    console.error('Gagal memulakan Firebase:', err);
    return { app: null, db: null, auth: null };
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const currentUser = currentAuth?.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connectivity when app boots
export async function testFirestoreConnection(database: Firestore): Promise<boolean> {
  try {
    await getDocFromServer(doc(database, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore: Klien offline atau konfigurasi belum lengkap.');
    }
    return false;
  }
}

export { app, db, auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };
export type { User };
