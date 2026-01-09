import { getToken, onMessage } from "firebase/messaging";
import { messaging, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

// Simple notification sound (Bell)
const BELL_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; // Professional bell sound
const CHAT_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3'; // Sweet message sound

// VAPID مفتاح عام (يجب الحصول عليه من لوحة تحكم Firebase -> Cloud Messaging)
const VAPID_KEY = ""; // اتركه فارغاً مؤقتاً لحين إضافة مفتاح حقيقي

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

export const registerFCMToken = async (userId: string) => {
    if (!messaging) return;

    try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return;

        if (!VAPID_KEY) {
            console.warn("FCM VAPID_KEY is missing. Notifications might not work.");
            return;
        }
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
            console.log("FCM Token registered:", currentToken);
            // حفظ التوكن في Firestore لربط المستخدم بالإشعارات
            await setDoc(doc(db, "fcm_tokens", userId), {
                token: currentToken,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

export const setupOnMessageListener = () => {
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
        console.log('Message received while app is in foreground: ', payload);
        if (payload.notification) {
            showLocalNotification(
                payload.notification.title || 'رسالة جديدة',
                payload.notification.body || '',
                '/logo.png'
            );
            playNotificationSound(payload.data?.type === 'chat');
        }
    });
};

export const playNotificationSound = (isChat = false) => {
    try {
        const audio = new Audio(isChat ? CHAT_SOUND_URL : BELL_SOUND_URL);
        audio.play().catch(e => console.error('Error playing sound:', e));
    } catch (err) {
        console.error('Failed to play sound', err);
    }
};

export const showLocalNotification = (title: string, body: string, icon = '/logo.png') => {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body,
            icon,
            badge: icon,
            vibrate: [200, 100, 200]
        } as any);

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
};

export const setAppBadge = (count: number) => {
    if ('setAppBadge' in navigator) {
        if (count > 0) {
            (navigator as any).setAppBadge(count).catch((e: any) => console.error('Error setting badge:', e));
        } else {
            (navigator as any).clearAppBadge().catch((e: any) => console.error('Error clearing badge:', e));
        }
    }
};
