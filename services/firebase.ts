import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// هام: يرجى استبدال القيم التالية بإعدادات مشروع Firebase الخاص بك
// يمكنك الحصول عليها من إعدادات المشروع في لوحة تحكم Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDU7Iw6HPkclABpHpZHi54wzzMgGKaPSX0",
  authDomain: "app2-d293c.firebaseapp.com",
  projectId: "app2-d293c",
  storageBucket: "app2-d293c.firebasestorage.app",
  messagingSenderId: "715319785410",
  appId: "1:715319785410:web:f41995c8d174553789485b",
  measurementId: "G-4RBNQ8TJWV"
};

import { getMessaging } from "firebase/messaging";
import { getAnalytics, isSupported } from "firebase/analytics";

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة Firestore
// تهيئة Firestore مع التخزين المؤقت (Offline Persistence) لتحسين السرعة
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
const storage = getStorage(app);

// تهيئة Analytics (فقط في المتصفح)
let analytics;
isSupported().then(supported => {
  if (supported && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
});

export { db, messaging, storage, analytics };

// ===== LANDING PAGE IMAGE UPLOAD FUNCTIONS =====

/**
 * رفع الصورة إلى Firebase Storage
 * @param file - ملف الصورة
 * @param folderPath - المسار في التخزين (مثل: 'landing-page')
 * @returns رابط الصورة للتحميل
 */
export const uploadImage = async (
  file: File,
  folderPath: string = 'landing-page'
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    throw new Error('فشل رفع الصورة. يرجى المحاولة مجددًا.');
  }
};

/**
 * حذف الصورة من Firebase Storage
 * @param imageUrl - رابط الصورة الكامل
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // استخراج المسار من الرابط الكامل
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    // لا نرمي خطأ هنا لأن الصورة قد تكون محذوفة بالفعل
  }
};

