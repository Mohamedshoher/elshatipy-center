
// Simple notification sound (Bell)
const BELL_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; // Professional bell sound

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const playNotificationSound = () => {
    try {
        const audio = new Audio(BELL_SOUND_URL);
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
