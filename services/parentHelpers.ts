import { collection, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Parent } from '../types';

/**
 * تطبيع رقم الهاتف ليتناسب مع نظام حسابات أولياء الأمور
 */
export const normalizePhoneForParent = (phone: string): string | null => {
    let processedPhone = phone.replace(/\D/g, '');

    if (processedPhone.startsWith('0020')) {
        processedPhone = processedPhone.slice(2);
    }

    if (processedPhone.startsWith('20') && processedPhone.length === 12) {
        processedPhone = '0' + processedPhone;
    } else if (processedPhone.length === 11 && (processedPhone.startsWith('010') || processedPhone.startsWith('011') || processedPhone.startsWith('012') || processedPhone.startsWith('015'))) {
        processedPhone = '02' + processedPhone;
    }

    if (!processedPhone.startsWith('02') || processedPhone.length !== 13) {
        return null;
    }

    return processedPhone;
};

/**
 * إنشاء أو تحديث حساب ولي أمر تلقائياً عند حفظ/تعديل طالب
 */
export const createParentAccountIfNeeded = async (
    studentPhone: string,
    studentName: string,
    studentId: string,
    existingParents: Parent[]
): Promise<void> => {
    const studentPhoneToUse = normalizePhoneForParent(studentPhone);
    if (!studentPhoneToUse) {
        console.log('رقم الهاتف غير صالح لإنشاء حساب ولي أمر:', studentPhone);
        return;
    }

    try {
        const existingParent = existingParents.find(p => p.phone === studentPhoneToUse);

        if (existingParent) {
            if (!existingParent.studentIds.includes(studentId)) {
                await updateDoc(doc(db, 'parents', existingParent.id), {
                    studentIds: arrayUnion(studentId)
                });
                console.log(`✅ تم إضافة الطالب ${studentName} لحساب ولي الأمر الموجود`);
            }
        } else {
            const password = studentPhoneToUse.slice(-6);
            await addDoc(collection(db, 'parents'), {
                phone: studentPhoneToUse,
                name: `ولي أمر ${studentName}`,
                password: password,
                studentIds: [studentId]
            });
            console.log(`✅ تم إنشاء حساب جديد لولي أمر ${studentName}`);
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء/تحديث حساب ولي الأمر:', error);
    }
};

/**
 * إزالة طالب من حساب ولي أمر (عند تغيير رقم الهاتف أو الحذف)
 */
export const removeStudentFromParent = async (
    oldPhone: string,
    studentId: string,
    existingParents: Parent[]
): Promise<void> => {
    const phoneToSearch = normalizePhoneForParent(oldPhone);
    if (!phoneToSearch) return;

    try {
        const parent = existingParents.find(p => p.phone === phoneToSearch);
        if (parent && parent.studentIds.includes(studentId)) {
            const updatedStudentIds = parent.studentIds.filter(id => id !== studentId);
            await updateDoc(doc(db, 'parents', parent.id), {
                studentIds: updatedStudentIds
            });
            console.log(`✅ تم إزالة الطالب من حساب ولي الأمر القديم (${phoneToSearch})`);
        }
    } catch (error) {
        console.error('❌ خطأ في إزالة الطالب من حساب ولي الأمر:', error);
    }
};
