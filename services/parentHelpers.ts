import { collection, doc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Parent } from '../types';

/**
 * إنشاء أو تحديث حساب ولي أمر تلقائياً عند حفظ/تعديل طالب
 * @param studentPhone رقم هاتف الطالب (يجب أن يكون 16 رقم يبدأ بـ 02)
 * @param studentName اسم الطالب
 * @param studentId معرّف الطالب
 * @param existingParents قائمة أولياء الأمور الحالية
 */
export const createParentAccountIfNeeded = async (
    studentPhone: string,
    studentName: string,
    studentId: string,
    existingParents: Parent[]
): Promise<void> => {
    // تطبيع رقم الهاتف (تحويل 11 رقم إلى 13 رقم ببادئة 02 إذا كان مصرياً)
    let processedPhone = studentPhone.replace(/\D/g, '');
    if (processedPhone.length === 11 && (processedPhone.startsWith('010') || processedPhone.startsWith('011') || processedPhone.startsWith('012') || processedPhone.startsWith('015'))) {
        processedPhone = '02' + processedPhone;
    }

    // التحقق من صحة رقم الهاتف النهائي (13 رقم يبدأ بـ 02)
    if (!processedPhone.startsWith('02') || processedPhone.length !== 13) {
        console.log('رقم الهاتف غير صالح لإنشاء حساب ولي أمر:', processedPhone);
        return;
    }

    const studentPhoneToUse = processedPhone;

    try {
        // التحقق من وجود حساب ولي أمر بهذا الرقم
        const existingParent = existingParents.find(p => p.phone === studentPhoneToUse);

        if (existingParent) {
            // تحديث قائمة الطلاب إذا لم يكن الطالب موجوداً
            if (!existingParent.studentIds.includes(studentId)) {
                await updateDoc(doc(db, 'parents', existingParent.id), {
                    studentIds: arrayUnion(studentId)
                });
                console.log(`✅ تم إضافة الطالب ${studentName} لحساب ولي الأمر الموجود`);
            }
        } else {
            // إنشاء حساب جديد
            const password = studentPhoneToUse.slice(-6); // آخر 6 أرقام
            await addDoc(collection(db, 'parents'), {
                phone: studentPhoneToUse,
                name: `ولي أمر ${studentName}`,
                password: password,
                studentIds: [studentId]
            });
            console.log(`✅ تم إنشاء حساب جديد لولي أمر ${studentName}`);
            console.log(`📱 رقم الهاتف: ${studentPhoneToUse}`);
            console.log(`🔑 كلمة المرور: ${password}`);
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء/تحديث حساب ولي الأمر:', error);
    }
};
