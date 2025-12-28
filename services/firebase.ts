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

// الحصول على نسخة من Firestore
// تم تعطيل التخزين المحلي (Offline Persistence) لضمان مزامنة البيانات من الخادم دائماً
const db = getFirestore(app);

const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { db, messaging };

