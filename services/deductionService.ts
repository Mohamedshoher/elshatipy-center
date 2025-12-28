import { db } from './firebase';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { TeacherAttendanceRecord, Notification } from '../types';

export const applyDeductions = async (records: TeacherAttendanceRecord[], notifications: Notification[]) => {
    const batch = writeBatch(db);

    records.forEach(record => {
        const ref = record.id ? doc(db, 'teacherAttendance', record.id) : doc(collection(db, 'teacherAttendance'));
        batch.set(ref, record);
    });

    notifications.forEach(notification => {
        const ref = notification.id ? doc(db, 'notifications', notification.id) : doc(collection(db, 'notifications'));
        batch.set(ref, notification);
    });

    try {
        await batch.commit();
        return true;
    } catch (error) {
        console.error("Error applying deductions: ", error);
        throw error;
    }
};
