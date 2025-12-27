import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

// هام: يرجى استبدال القيم التالية بإعدادات مشروع Firebase الخاص بك
// يمكنك الحصول عليها من إعدادات المشروع في لوحة تحكم Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDU7Iw6HPkcLABpHpZHi54wzzMgGKAPSX0",
  authDomain: "app2-d293c.firebaseapp.com",
  projectId: "app2-d293c",
  storageBucket: "app2-d293c.firebasestorage.app",
  messagingSenderId: "715319785410",
  appId: "1:715319785410:web:f41995c8d174553789485b",
  measurementId: "G-4RBNQ8TJWV"
};

import { getMessaging } from "firebase/messaging";

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// الحصول على نسخة من Firestore مع تمكين التخزين المحلي
let db;
// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({})
    });
    console.log("✅ Offline persistence enabled.");
  } catch (err: any) {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open - this is expected, use fallback
      db = getFirestore(app);
    } else if (err.code == 'unimplemented') {
      console.warn("⚠️ Browser doesn't support persistence. Using in-memory cache.");
      db = getFirestore(app);
    } else {
      console.error("❌ Error enabling offline persistence: ", err);
      // Fallback to in-memory cache
      db = getFirestore(app);
    }
  }
} else {
  // Server-side: use default Firestore
  db = getFirestore(app);
}

const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { db, messaging };

