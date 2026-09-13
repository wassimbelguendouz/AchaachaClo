// Firebase Cloud Database Initialization & Configuration
/*import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase is configured with real credentials
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey !== 'AIzaSyDF25injYgsD__Kq3yihtgcsIy7DNlqltI'
);

let db = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log('✅ Firebase Cloud Firestore connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase :', error);
  }
} else {
  console.warn('⚠️ Firebase n\'est pas encore configuré dans le fichier .env (Mode fallback localStorage actif).');
}

export { db };*/

// Firebase Cloud Database Initialization & Configuration
import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDF25injYgsD__Kq3yihtgcsIy7DNlqltI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'achaachaclo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'achaachaclo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'achaachaclo.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1089791054529',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1089791054529:web:98b7ad9e63b60a806a7a40'
};

// Vérification simplifiée : s'assure seulement que les clés principales existent
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;

if (isFirebaseConfigured) {
  try {
    // Initialise l'application une seule fois
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    
    // Initialise Firestore avec l'option pour ignorer les valeurs undefined
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true
    });
    
    console.log('✅ Firebase Cloud Firestore connecté avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase :', error);
  }
} else {
  console.warn('⚠️ Firebase n\'est pas encore configuré (Mode fallback actif).');
}

// Une seule et unique exportation à la fin du fichier
export { db };