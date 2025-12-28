import React, { useEffect } from 'react';
import { doc, getDoc, collection, writeBatch } from 'firebase/firestore';
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

    const lastRunDateRef = React.useRef<string>('');

    useEffect(() => {
        // تشغيل الفحص فقط للمدير لضمان التنفيذ التلقائي من جهة واحدة وتوفير الموارد
        if (!currentUser || currentUser.role !== 'director' || !students.length || !teachers.length || !groups.length) return;

        const todayString = getCairoDateString();
        if (lastRunDateRef.current === todayString) return;

        const runNotificationChecks = async () => {
            try {
                // Singleton Execution Guard - لضمان التنفيذ مرة واحدة فقط في اليوم
                const automationRef = doc(db, 'system', 'automation');
                const automationSnap = await getDoc(automationRef);
                const automationData = automationSnap.exists() ? automationSnap.data() : {};

                // If it already ran today on any device, don't run again
                if (automationData.lastGlobalRun === todayString) {
                    lastRunDateRef.current = todayString;
                    return;
                }

                const today = getCairoNow();
                const yesterdayString = getYesterdayDateString();

                // Optimized data grouping
                const teacherGroupMap = new Map();
                groups.forEach(g => {
                    if (g.teacherId) {
                        const list = teacherGroupMap.get(g.teacherId) || [];
                        list.push(g.id);
                        teacherGroupMap.set(g.teacherId, list);
                    }
                });

                const activeTeachersWithStudents = teachers
                    .filter(t => t.status === TeacherStatus.ACTIVE)
                    .map(teacher => {
                        const teacherGroupIds = teacherGroupMap.get(teacher.id) || [];
                        const teacherStudents = students.filter(s => teacherGroupIds.includes(s.groupId) && !s.isArchived);
                        return { ...teacher, students: teacherStudents };
                    })
                    .filter(t => t.students.length > 0);

                const lastAbsenceCheck = automationData.lastAbsenceCheck || '';
                const lastDeductionCheck = automationData.lastDeductionCheck || '';

                // فحص اليوم السابق (Yesterday)
                const dateToCheck = new Date(today);
                dateToCheck.setHours(0, 0, 0, 0);
                const dayOfWeek = today.getDay();

                const yesterdayDate = new Date(today);
                yesterdayDate.setDate(today.getDate() - 1);
                const isWorkday = isCairoWorkday(yesterdayDate);
                const isHoliday = (financialSettings.publicHolidays || []).includes(yesterdayString);

                const IS_AFTER_MIDNIGHT = isCairoAfterMidnight();
                const IS_AFTER_12_05 = isCairoAfter12_05();

                const batch = writeBatch(db);
                let operationsCount = 0;

                // 1. نظام موحد: فحص التقارير المفقودة وتسجيل الخصم
                if (IS_AFTER_12_05 && lastDeductionCheck !== yesterdayString && isWorkday && !isHoliday) {
                    batch.set(automationRef, { lastDeductionCheck: yesterdayString }, { merge: true });
                    operationsCount++;

                    for (const teacher of activeTeachersWithStudents) {
                        if (!teacher.students.some(s => new Date(s.joiningDate) <= dateToCheck)) continue;

                        const alreadyHasDeduction = teacherAttendance.some(r =>
                            r.teacherId === teacher.id && r.date === yesterdayString && r.status === TeacherAttendanceStatus.MISSING_REPORT
                        );

                        if (alreadyHasDeduction) continue;

                        const hasAttendanceRecord = teacher.students.some(s => s.attendance.some(r => r.date === yesterdayString));

                        if (!hasAttendanceRecord) {
                            const deductionId = `auto-missed-${teacher.id}-${yesterdayString}`;
                            const deductionRef = doc(db, 'teacherAttendance', deductionId);

                            batch.set(deductionRef, {
                                teacherId: teacher.id,
                                teacherName: teacher.name,
                                date: yesterdayString,
                                status: TeacherAttendanceStatus.MISSING_REPORT,
                                reason: 'تلقائي: لم يتم تسليم التقرير اليومي',
                                timestamp: getCairoNow().toISOString()
                            });

                            const dayName = dateToCheck.toLocaleDateString('ar-EG', { weekday: 'long' });
                            const dirNoteId = `dir-deduct-${teacher.id}-${yesterdayString}`;
                            batch.set(doc(db, 'directorNotifications', dirNoteId), {
                                date: getCairoNow().toISOString(),
                                forDate: yesterdayString,
                                content: `⚠️ تم خصم (ربع يوم) للمدرس ${teacher.name} لعدم إرسال تقرير يوم ${dayName}.`,
                                isRead: false,
                                type: 'teacher_absent_report',
                                teacherId: teacher.id,
                                teacherName: teacher.name,
                            });

                            const teacherNoteId = `notif-missed-${teacher.id}-${yesterdayString}`;
                            batch.set(doc(db, 'notifications', teacherNoteId), {
                                id: teacherNoteId,
                                date: getCairoNow().toISOString(),
                                content: `⚠️ تنبيه إداري آلي: تم تسجيل خصم (ربع يوم) من راتبك لعدم إرسال تقرير الحضور الخاص بمجموعاتك ليوم ${dayName}. يرجى الالتزام لتجنب الخصومات المتكررة.`,
                                senderName: "نظام المتابعة الآلي",
                                target: { type: 'teacher', id: teacher.id },
                                readBy: [],
                                deletedBy: []
                            });
                            operationsCount += 3;
                        }
                    }
                }

                // 2. فحص الغياب المتصل - 3 أيام
                if (IS_AFTER_MIDNIGHT && lastAbsenceCheck !== yesterdayString && isWorkday && !isHoliday) {
                    batch.set(automationRef, { lastAbsenceCheck: yesterdayString }, { merge: true });
                    operationsCount++;

                    for (const student of students) {
                        if (student.isArchived || student.isPending) continue;
                        const sortedAtt = [...student.attendance].sort((a, b) => b.date.localeCompare(a.date));
                        if (sortedAtt.length >= 3) {
                            const last3 = sortedAtt.slice(0, 3);
                            if (last3.every(r => r.status === AttendanceStatus.ABSENT) && last3[0].date === yesterdayString) {
                                const group = groups.find(g => g.id === student.groupId);
                                if (group?.teacherId) {
                                    const tchAbsNoteId = `tch-abs-${student.id}-${yesterdayString}`;
                                    batch.set(doc(db, 'notifications', tchAbsNoteId), {
                                        date: getCairoNow().toISOString(),
                                        content: `📢 تنبيه غياب: الطالب ${student.name} غاب لمدة 3 أيام متصلة. يرجى التواصل مع ولي الأمر.`,
                                        senderName: "نظام المتابعة",
                                        target: { type: 'teacher', id: group.teacherId },
                                        readBy: [],
                                    });
                                    operationsCount++;
                                }
                                const dirAbsNoteId = `dir-abs-${student.id}-${yesterdayString}`;
                                batch.set(doc(db, 'directorNotifications', dirAbsNoteId), {
                                    date: getCairoNow().toISOString(),
                                    forDate: yesterdayString,
                                    content: `📢 انتباه: الطالب ${student.name} (مجموعة ${group?.name || '...'}) غاب لـ 3 أيام متتالية.`,
                                    isRead: false,
                                    type: 'student_consecutive_absence',
                                    teacherId: group?.teacherId || '',
                                    teacherName: teachers.find(t => t.id === group?.teacherId)?.name || 'غير محدد'
                                });
                                operationsCount++;
                            }
                        }
                    }
                }

                // 3. الفحص الأسبوعي
                if (dayOfWeek === 4 && IS_AFTER_12_05) {
                    const diff = (dayOfWeek + 1) % 7;
                    const lastSaturday = new Date(today);
                    lastSaturday.setDate(today.getDate() - diff);
                    const saturdayString = lastSaturday.toISOString().split('T')[0];
                    const lastWeeklyCheck = automationData.lastWeeklyCheck || '';

                    if (lastWeeklyCheck !== saturdayString) {
                        batch.set(automationRef, { lastWeeklyCheck: saturdayString, lastGlobalRun: todayString }, { merge: true });
                        const workdays = [0, 1, 2, 3, 4].map(i => {
                            const d = new Date(lastSaturday);
                            d.setDate(lastSaturday.getDate() + i);
                            return d.toISOString().split('T')[0];
                        });
                        const wednesdayString = workdays[4];

                        for (const teacher of activeTeachersWithStudents) {
                            const daysWithTests = workdays.filter(dateStr => teacher.students.some(s => s.tests.some(t => t.date === dateStr)));
                            if (daysWithTests.length === 0) {
                                batch.set(doc(db, 'teacherAttendance', `auto-5day-no-tests-${teacher.id}-${saturdayString}`), {
                                    teacherId: teacher.id, teacherName: teacher.name, date: wednesdayString,
                                    status: TeacherAttendanceStatus.DEDUCTION_HALF_DAY,
                                    reason: `تلقائي: عدم تسجيل اختبارات للأسبوع (${saturdayString} إلى ${wednesdayString})`,
                                    timestamp: getCairoNow().toISOString()
                                });
                                batch.set(doc(db, 'directorNotifications', `note-5day-fail-${teacher.id}-${saturdayString}`), {
                                    date: getCairoNow().toISOString(), forDate: wednesdayString,
                                    content: `⚠️ خصم تلقائي (نصف يوم) للمدرس ${teacher.name} لعدم تسجيل اختبارات طوال الأسبوع.`,
                                    isRead: false, type: 'teacher_5day_no_tests_deduction', teacherId: teacher.id, teacherName: teacher.name
                                });
                                operationsCount += 2;
                            } else if (daysWithTests.length === 5) {
                                batch.set(doc(db, 'teacherAttendance', `auto-5day-bonus-${teacher.id}-${saturdayString}`), {
                                    teacherId: teacher.id, teacherName: teacher.name, date: wednesdayString,
                                    status: TeacherAttendanceStatus.BONUS_HALF_DAY,
                                    reason: `تلقائي: الالتزام بتسجيل الاختبارات يومياً (${saturdayString} إلى ${wednesdayString})`,
                                    timestamp: getCairoNow().toISOString()
                                });
                                batch.set(doc(db, 'notifications', `public-bonus-${teacher.id}-${saturdayString}`), {
                                    date: getCairoNow().toISOString(), content: `🎉 بطل/ة الأسبوع: حصل المدرس/ة ${teacher.name} على مكافأة (نصف يوم) للالتزام التام بتسجيل الاختبارات يومياً.`,
                                    isRead: false, recipientId: 'all'
                                });
                                batch.set(doc(db, 'directorNotifications', `dir-bonus-${teacher.id}-${saturdayString}`), {
                                    date: getCairoNow().toISOString(), forDate: wednesdayString,
                                    content: `✅ مكافأة تلقائية (نصف يوم) للمدرس ${teacher.name} للالتزام بتسجيل الاختبارات.`,
                                    isRead: false, type: 'teacher_weekly_bonus', teacherId: teacher.id, teacherName: teacher.name
                                });
                                operationsCount += 3;
                            }
                        }
                    }
                }

                if (operationsCount > 0) {
                    await batch.commit();
                }

                // Mark as run for this session even if no operations were needed
                lastRunDateRef.current = todayString;

            } catch (error) {
                console.error("Automation error:", error);
            }
        };

        const timer = setTimeout(runNotificationChecks, 6000); // Wait 6 seconds
        return () => clearTimeout(timer);
    }, [currentUser, students.length, teachers.length, groups.length]);
};
