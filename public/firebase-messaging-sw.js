// f:\1- برامجياتي\مركز الشاطبي\elshatipy-git -hap\public\firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// هام: يجب أن تتطابق هذه الإعدادات مع إعدادات مشروعك في firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyDU7Iw6HPkcLABpHpZHi54wzzMgGKAPSX0",
    authDomain: "app2-d293c.firebaseapp.com",
    projectId: "app2-d293c",
    storageBucket: "app2-d293c.firebasestorage.app",
    messagingSenderId: "715319785410",
    appId: "1:715319785410:web:f41995c8d174553789485b"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// معالجة الرسائل الواردة في الخلفية
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title || 'رسالة جديدة - الشاطبي';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png',
        badge: '/logo.png',
        data: payload.data,
        tag: 'chat-notification', // يمنع تكرار الإشعارات لنفس المحادثة
        renotify: true,
        vibrate: [200, 100, 200], // اهتزاز للهاتف
        actions: [
            { action: 'open', title: 'عرض الرسالة' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = new URL('/', self.location.origin).href;

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});
