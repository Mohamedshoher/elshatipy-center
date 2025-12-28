import { useEffect } from 'react';
import { doc, getDoc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebase';
import { CurrentUser, Student, Teacher, Group, TeacherStatus, TeacherAttendanceStatus, FinancialSettings, TeacherAttendanceRecord, AttendanceStatus } from '../types';
import { getCairoNow, getCairoDateString, getYesterdayDateString, isCairoAfterMidnight, isCairoAfter12_05, isCairoWorkday } from '../services/cairoTimeHelper';

interface UseAutomationChecksProps {
    currentUser: CurrentUser | null;
    students: Student[];
    teachers: Teacher[];
    groups: Group[];
    financialSettings: FinancialSettings;
    teacherAttendance: TeacherAttendanceRecord[];
}

export const useAutomationChecks = ({
    currentUser,
    students,
    teachers,
    groups,
    financialSettings,
    teacherAttendance
}: UseAutomationChecksProps) => {

    useEffect(() => {
        // تشغيل الفحص فقط للمدير لضمان التنفيذ التلقائي من جهة واحدة وتوفير الموارد
        if (!currentUser || currentUser.role !== 'director' || !students.length || !teachers.length || !groups.length) return;

        const getActiveTeachers = () => {
            return teachers
                .filter(t => t.status === TeacherStatus.ACTIVE)
                .map(teacher => {
                    const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
                    const teacherGroupIds = teacherGroups.map(g => g.id);
                    const teacherStudents = students.filter(s => teacherGroupIds.includes(s.groupId) && !s.isArchived);
                    return { ...teacher, students: teacherStudents };
                })
                .filter(t => t.students.length > 0);
        };

        const runNotificationChecks = async () => {
            // استخدام توقيت القاهرة بدلاً من التوقيت المحلي
            const today = getCairoNow();
            const todayString = getCairoDateString();
            const yesterdayString = getYesterdayDateString();

            // 1. Singleton Execution Guard - لضمان التنفيذ مرة واحدة فقط في اليوم
            const automationRef = doc(db, 'system', 'automation');
            const automationSnap = await getDoc(automationRef);
            const automationData = automationSnap.exists() ? automationSnap.data() : {};
            const lastAbsenceCheck = automationData.lastAbsenceCheck || '';
            const lastDeductionCheck = automationData.lastDeductionCheck || '';

            const activeTeachersWithStudents = getActiveTeachers();

            // فحص اليوم السابق (Yesterday)
            const dateToCheck = new Date(today);
            dateToCheck.setHours(0, 0, 0, 0);
            const dayOfWeek = today.getDay(); // 0=Sunday, ..., 6=Saturday

            // للحصول على حالة يوم "أمس" (yesterday)
            const yesterdayDate = new Date(today);
            yesterdayDate.setDate(today.getDate() - 1);
            const isWorkday = isCairoWorkday(yesterdayDate);
            const isHoliday = (financialSettings.publicHolidays || []).includes(yesterdayString);

            // مصفوفة لتجميع العمليات اليومية
            const dailyPromises: Promise<void>[] = [];

            // التحقق من الوقت بتوقيت القاهرة
            const IS_AFTER_MIDNIGHT = isCairoAfterMidnight(); // 12:00 AM
            const IS_AFTER_12_05 = isCairoAfter12_05();        // 12:05 AM

            // 1. نظام موحد: فحص التقارير المفقودة وتسجيل الخصم (بعد 12:05 ص)
            if (IS_AFTER_12_05 && lastDeductionCheck !== yesterdayString && isWorkday && !isHoliday) {
                // تحديث علامة الخصم فوراً
                dailyPromises.push(setDoc(automationRef, { lastDeductionCheck: yesterdayString }, { merge: true }));

                for (const teacher of activeTeachersWithStudents) {
                    if (!teacher.students.some(s => new Date(s.joiningDate) <= dateToCheck)) continue;

                    // Check if deduction already exists (Manual check or previous run)
                    const alreadyHasDeduction = teacherAttendance.some(r =>
                        r.teacherId === teacher.id &&
                        r.date === yesterdayString &&
                        r.status === TeacherAttendanceStatus.MISSING_REPORT
                    );

                    if (alreadyHasDeduction) continue;

                    const hasAttendanceRecord = teacher.students.some(s => s.attendance.some(r => r.date === yesterdayString));

                    if (!hasAttendanceRecord) {
                        const deductionId = `auto-missed-${teacher.id}-${yesterdayString}`;
                        const deductionRef = doc(db, 'teacherAttendance', deductionId);

                        dailyPromises.push((async () => {
                            const dedSnap = await getDoc(deductionRef);
                            // Double check inside async in case of race/snapshot latency, though the outer check catches most
                            if (!dedSnap.exists()) {
                                // تسجيل الخصم المالي
                                await setDoc(deductionRef, {
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                    date: yesterdayString,
                                    status: TeacherAttendanceStatus.MISSING_REPORT,
                                    reason: 'تلقائي: لم يتم تسليم التقرير اليومي',
                                    timestamp: getCairoNow().toISOString()
                                });

                                const dayName = dateToCheck.toLocaleDateString('ar-EG', { weekday: 'long' });

                                // إشعار للمدير
                                const dirNoteId = `dir-deduct-${teacher.id}-${yesterdayString}`;
                                await setDoc(doc(db, 'directorNotifications', dirNoteId), {
                                    date: getCairoNow().toISOString(),
                                    forDate: yesterdayString,
                                    content: `⚠️ تم خصم (ربع يوم) للمدرس ${teacher.name} لعدم إرسال تقرير يوم ${dayName}.`,
                                    isRead: false,
                                    type: 'teacher_absent_report',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                });

                                // ج - إخطار المدرس نفسه بوقوع الخصم
                                const teacherNoteId = `notif-missed-${teacher.id}-${yesterdayString}`;
                                await setDoc(doc(db, 'notifications', teacherNoteId), {
                                    id: teacherNoteId,
                                    date: getCairoNow().toISOString(),
                                    content: `⚠️ تنبيه إداري آلي: تم تسجيل خصم (ربع يوم) من راتبك لعدم إرسال تقرير الحضور الخاص بمجموعاتك ليوم ${dayName}. يرجى الالتزام لتجنب الخصومات المتكررة.`,
                                    senderName: "نظام المتابعة الآلي",
                                    target: { type: 'teacher', id: teacher.id },
                                    readBy: [],
                                    deletedBy: []
                                });
                            }
                        })());
                    }
                }
            }

            // 2. فحص الغياب المتصل - 3 أيام (بعد 12:00 ص)
            if (IS_AFTER_MIDNIGHT && lastAbsenceCheck !== yesterdayString && isWorkday && !isHoliday) {
                // تحديث علامة غياب الطلاب فوراً
                dailyPromises.push(setDoc(automationRef, { lastAbsenceCheck: yesterdayString }, { merge: true }));

                for (const student of students) {
                    if (student.isArchived || student.isPending) continue;

                    const sortedAtt = [...student.attendance].sort((a, b) => b.date.localeCompare(a.date));

                    // نتحقق من آخر 3 سجلات حضور
                    if (sortedAtt.length >= 3) {
                        const last3 = sortedAtt.slice(0, 3);
                        const isThreeDaysConsecutive = last3.every(r => r.status === AttendanceStatus.ABSENT);
                        const isEndingYesterday = last3[0].date === yesterdayString;

                        if (isThreeDaysConsecutive && isEndingYesterday) {
                            const absNoteId = `abs-3day-${student.id}-${yesterdayString}`;
                            const group = groups.find(g => g.id === student.groupId);

                            dailyPromises.push((async () => {
                                // إشعار للمدرس والمدير
                                if (group && group.teacherId) {
                                    const tchAbsNoteId = `tch-abs-${student.id}-${yesterdayString}`;
                                    const teacherDoc = doc(db, 'notifications', tchAbsNoteId);
                                    if (!(await getDoc(teacherDoc)).exists()) {
                                        await setDoc(teacherDoc, {
                                            date: getCairoNow().toISOString(),
                                            content: `📢 تنبيه غياب: الطالب ${student.name} غاب لمدة 3 أيام متصلة. يرجى التواصل مع ولي الأمر.`,
                                            senderName: "نظام المتابعة",
                                            target: { type: 'teacher', id: group.teacherId },
                                            readBy: [],
                                        });
                                    }
                                }

                                const dirAbsNoteId = `dir-abs-${student.id}-${yesterdayString}`;
                                const dirDoc = doc(db, 'directorNotifications', dirAbsNoteId);
                                if (!(await getDoc(dirDoc)).exists()) {
                                    await setDoc(dirDoc, {
                                        date: getCairoNow().toISOString(),
                                        forDate: yesterdayString,
                                        content: `📢 انتباه: الطالب ${student.name} (مجموعة ${group?.name || '...'}) غاب لـ 3 أيام متتالية.`,
                                        isRead: false,
                                        type: 'student_consecutive_absence',
                                        teacherId: group?.teacherId || '',
                                        teacherName: teachers.find(t => t.id === group?.teacherId)?.name || 'غير محدد'
                                    });
                                }
                            })());
                        }
                    }
                }
            }

            // --- الفحص الأسبوعي للتحفيز والخصم (السبت - الأربعاء) ---
            const weeklyPromises: Promise<void>[] = [];
            // يتم الفحص يوم الخميس (4) فقط لمراجعة الأسبوع المنتهي بالأربعاء
            if (dayOfWeek === 4 && IS_AFTER_12_05) {
                // حساب تاريخ السبت الماضي (بداية الأسبوع المستهدف)
                // السبت=6، الأحد=0، الاثنين=1، الثلاثاء=2، الأربعاء=3، الخميس=4، الجمعة=5
                const diff = (dayOfWeek + 1) % 7;
                const lastSaturday = new Date(today);
                lastSaturday.setDate(today.getDate() - diff);
                lastSaturday.setHours(0, 0, 0, 0);
                const saturdayString = lastSaturday.toISOString().split('T')[0];

                const lastWeeklyCheck = automationData.lastWeeklyCheck || '';

                if (lastWeeklyCheck !== saturdayString) {
                    await setDoc(automationRef, { lastWeeklyCheck: saturdayString }, { merge: true });

                    const workdays: string[] = [];
                    for (let i = 0; i < 5; i++) { // من السبت إلى الأربعاء
                        const d = new Date(lastSaturday);
                        d.setDate(lastSaturday.getDate() + i);
                        workdays.push(d.toISOString().split('T')[0]);
                    }
                    const wednesdayString = workdays[4];

                    for (const teacher of activeTeachersWithStudents) {
                        if (!teacher.students.some(s => new Date(s.joiningDate) <= new Date(wednesdayString))) continue;

                        const daysWithTests = workdays.filter(dateStr =>
                            teacher.students.some(s => s.tests.some(t => t.date === dateStr))
                        );

                        // حالة 1: لا توجد اختبارات طوال الـ 5 أيام -> خصم نصف يوم
                        if (daysWithTests.length === 0) {
                            const deductionId = `auto-5day-no-tests-${teacher.id}-${saturdayString}`;
                            const attRef = doc(db, 'teacherAttendance', deductionId);
                            const attSnap = await getDoc(attRef);

                            if (!attSnap.exists()) {
                                await setDoc(attRef, {
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                    date: wednesdayString,
                                    status: TeacherAttendanceStatus.DEDUCTION_HALF_DAY,
                                    reason: `تلقائي: عدم تسجيل اختبارات للأسبوع (${saturdayString} إلى ${wednesdayString})`,
                                    timestamp: getCairoNow().toISOString()
                                });

                                // إخطار الإدارة بمعرّف ثابت
                                const noteId = `note-5day-fail-${teacher.id}-${saturdayString}`;
                                await setDoc(doc(db, 'directorNotifications', noteId), {
                                    date: getCairoNow().toISOString(),
                                    forDate: wednesdayString,
                                    content: `⚠️ خصم تلقائي (نصف يوم) للمدرس ${teacher.name} لعدم تسجيل اختبارات طوال الأسبوع.`,
                                    isRead: false,
                                    type: 'teacher_5day_no_tests_deduction',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name
                                });
                            }
                        }
                        // حالة 2: اختبارات يومية -> مكافأة نصف يوم
                        else if (daysWithTests.length === 5) {
                            const bonusId = `auto-5day-bonus-${teacher.id}-${saturdayString}`;
                            const attRef = doc(db, 'teacherAttendance', bonusId);
                            const attSnap = await getDoc(attRef);

                            if (!attSnap.exists()) {
                                await setDoc(attRef, {
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                    date: wednesdayString,
                                    status: TeacherAttendanceStatus.BONUS_HALF_DAY,
                                    reason: `تلقائي: الالتزام بتسجيل الاختبارات يومياً (${saturdayString} إلى ${wednesdayString})`,
                                    timestamp: getCairoNow().toISOString()
                                });

                                // إخطار عام بمعرّف ثابت
                                const pubNoteId = `public-bonus-${teacher.id}-${saturdayString}`;
                                await setDoc(doc(db, 'notifications', pubNoteId), {
                                    date: getCairoNow().toISOString(),
                                    content: `🎉 بطل/ة الأسبوع: حصل المدرس/ة ${teacher.name} على مكافأة (نصف يوم) للالتزام التام بتسجيل الاختبارات يومياً.`,
                                    isRead: false,
                                    recipientId: 'all'
                                });

                                // إخطار الإدارة
                                const dirBonusNoteId = `dir-bonus-${teacher.id}-${saturdayString}`;
                                await setDoc(doc(db, 'directorNotifications', dirBonusNoteId), {
                                    date: getCairoNow().toISOString(),
                                    forDate: wednesdayString,
                                    content: `✅ مكافأة تلقائية (نصف يوم) للمدرس ${teacher.name} للالتزام بتسجيل الاختبارات.`,
                                    isRead: false,
                                    type: 'teacher_weekly_bonus',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name
                                });
                            }
                        }
                    }
                }
            }

            try {
                await Promise.all([...dailyPromises, ...weeklyPromises]);
            } catch (error) {
                console.error("Error creating notifications:", error);
            }
        };

        const timer = setTimeout(runNotificationChecks, 3000);
        return () => clearTimeout(timer);
    }, [students, teachers, groups, currentUser, teacherAttendance, financialSettings]);
};
