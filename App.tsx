
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Student, AttendanceStatus, TestRecord, Group, FeePayment, Teacher, CurrentUser, Staff, Expense, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings, Note, WeeklySchedule, TeacherCollectionRecord, Notification, DirectorNotification, ProgressPlan, ProgressPlanRecord, GroupType, Supervisor, TeacherManualBonus } from './types';
import { ExpenseCategory, TeacherAttendanceStatus, DayOfWeek, TestType as TestTypeEnum } from './types';
import StudentCard from './components/StudentCard';
import StudentForm from './components/StudentForm';
import GroupManagerModal from './components/GroupManagerModal';
import FeePaymentModal from './components/FeePaymentModal';
import TeacherManagerModal from './components/TeacherManagerModal';
import TeacherManagerPage from './components/TeacherManagerPage';
import GroupReportPage from './components/GroupReportPage';
import TeacherReportPage from './components/TeacherReportPage';
import DirectorReportsPage from './components/DirectorReportsPage';
import DirectorNotesPage from './components/DirectorNotesPage';
import FinancePage from './components/FinancePage';
import GeneralViewPage from './components/GeneralViewPage';
import FeeCollectionPage from './components/FeeCollectionPage';
import DirectorNotificationsPage from './components/DirectorNotificationsPage';
import UnpaidStudentsPage from './components/UnpaidStudentsPage';
import AllStudentsPage from './components/AllStudentsPage';
import PendingStudents from './components/PendingStudents';
import GroupsPage from './components/GroupsPage';
import AttendanceReportPage from './components/AttendanceReportPage';
import TestsReportPage from './components/TestsReportPage';
import FinancialReportPage from './components/FinancialReportPage';
import DebtorsPage from './components/DebtorsPage';
import NotificationBell from './components/NotificationBell';
import DirectorNotificationBell from './components/DirectorNotificationBell';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import ErrorBoundary from './components/ErrorBoundary';
import { AttendanceStatus as AttendanceEnum, TeacherStatus } from './types';
import LogoutIcon from './components/icons/LogoutIcon';
import MenuIcon from './components/icons/MenuIcon';
import BriefcaseIcon from './components/icons/BriefcaseIcon';
import UserIcon from './components/icons/UserIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowRightIcon from './components/icons/ArrowRightIcon';
import ArchiveIcon from './components/icons/ArchiveIcon';
import UserPlusIcon from './components/icons/UserPlusIcon';
import UnarchiveModal from './components/UnarchiveModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import TeacherDetailsModal from './components/TeacherDetailsModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { db } from './services/firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc, writeBatch, query, where, getDocs, arrayUnion, setDoc, deleteField } from 'firebase/firestore';
import UsersIcon from './components/icons/UsersIcon';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import CloudOffIcon from './components/icons/CloudOffIcon';
import FilterIcon from './components/icons/FilterIcon';

type ActiveView = 'students' | 'groups' | 'attendance_report' | 'tests_report' | 'financial_report';

const defaultSchedule = (): WeeklySchedule[] => [
    { day: DayOfWeek.SUNDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.MONDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.TUESDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.WEDNESDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.THURSDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.FRIDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
    { day: DayOfWeek.SATURDAY, isEnabled: false, startTime: '09:00', endTime: '11:00' },
];

const App: React.FC = () => {
    // --- Data from Firestore ---
    const [students, setStudents] = useState<Student[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [directorNotifications, setDirectorNotifications] = useState<DirectorNotification[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>([]);
    const [teacherPayrollAdjustments, setTeacherPayrollAdjustments] = useState<TeacherPayrollAdjustment[]>([]);
    const [teacherCollections, setTeacherCollections] = useState<TeacherCollectionRecord[]>([]);
    const [teacherManualBonuses, setTeacherManualBonuses] = useState<TeacherManualBonus[]>([]);
    const [financialSettings, setFinancialSettings] = useState<FinancialSettings>({ workingDaysPerMonth: 22, absenceDeductionPercentage: 100 });

    // --- Error State ---
    const [permissionError, setPermissionError] = useState(false);

    // --- Local UI State & Session ---
    const [currentUser, setCurrentUser] = useLocalStorage<CurrentUser | null>('shatibi-center-currentUser', null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
    const [supervisorToEdit, setSupervisorToEdit] = useState<Supervisor | null>(null);
    const [isTeacherFormOpen, setIsTeacherFormOpen] = useState(false);
    const [teacherForDetails, setTeacherForDetails] = useState<Teacher | null>(null);
    const [supervisorForDetails, setSupervisorForDetails] = useState<Supervisor | null>(null);
    const [studentToUnarchiveId, setStudentToUnarchiveId] = useState<string | null>(null);
    const [studentToArchive, setStudentToArchive] = useState<Student | null>(null);
    const [isGroupManagerOpen, setIsGroupManagerOpen] = useState(false);
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<{ studentId: string; month: string; amount: number; } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailsModalState, setDetailsModalState] = useState<{ student: Student; initialTab: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports'; } | null>(null);

    const isOnline = useOnlineStatus();

    // View State
    const [activeView, setActiveView] = useState<ActiveView>('students');
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const [isGeneralView, setIsGeneralView] = useState(false);
    const [isDirectorReportView, setIsDirectorReportView] = useState(false);
    const [isDirectorNotesView, setIsDirectorNotesView] = useState(false);
    const [isDirectorNotificationsView, setIsDirectorNotificationsView] = useState(false);
    const [isUnpaidStudentsView, setIsUnpaidStudentsView] = useState(false);
    const [isFinanceView, setIsFinanceView] = useState(false);
    const [isFeeCollectionView, setIsFeeCollectionView] = useState(false);
    const [isTeacherManagerView, setIsTeacherManagerView] = useState(false);
    const [isArchiveView, setIsArchiveView] = useState(false);
    const [isDebtorsView, setIsDebtorsView] = useState(false); // Add isDebtorsView state
    const [viewingTeacherReportId, setViewingTeacherReportId] = useState<string | null>(null);

    const [isTeacherFilterVisible, setIsTeacherFilterVisible] = useState(false);

    // Filter State for Student View (Lifted up)
    const [studentTypeFilter, setStudentTypeFilter] = useState<GroupType>('all');

    const getGroupTypeFromName = (name: string | undefined): GroupType | null => {
        if (!name) return null;
        const lowerName = name.toLowerCase();
        if (lowerName.includes('قرآن')) return 'قرآن';
        if (lowerName.includes('نور بيان')) return 'نور بيان';
        if (lowerName.includes('تلقين') || lowerName.includes('تقلين')) return 'تلقين';
        if (lowerName.includes('إقراء') || lowerName.includes('اقراء')) return 'إقراء';
        return null;
    };

    // Fetch all data from Firestore in real-time
    useEffect(() => {
        const collections: { name: string, setter: React.Dispatch<any> }[] = [
            { name: 'students', setter: setStudents },
            { name: 'groups', setter: setGroups },
            { name: 'teachers', setter: setTeachers },
            { name: 'supervisors', setter: setSupervisors },
            { name: 'notes', setter: setNotes },
            { name: 'notifications', setter: setNotifications },
            { name: 'directorNotifications', setter: setDirectorNotifications },
            { name: 'staff', setter: setStaff },
            { name: 'expenses', setter: setExpenses },
            { name: 'teacherAttendance', setter: setTeacherAttendance },
            { name: 'teacherPayrollAdjustments', setter: setTeacherPayrollAdjustments },
            { name: 'teacherCollections', setter: setTeacherCollections },
            { name: 'teacherManualBonuses', setter: setTeacherManualBonuses },
        ];

        const unsubscribers = collections.map(({ name, setter }) =>
            onSnapshot(collection(db, name), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setter(data);
            }, (error) => {
                console.error(`Error fetching ${name}:`, error.message);
                if (error.code === 'permission-denied') {
                    setPermissionError(true);
                }
            })
        );

        // Listener for single settings document
        const settingsDocRef = doc(db, 'settings', 'financial');
        const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setFinancialSettings(docSnap.data() as FinancialSettings);
            } else {
                const defaultSettings: FinancialSettings = { workingDaysPerMonth: 22, absenceDeductionPercentage: 100 };
                setDoc(settingsDocRef, defaultSettings).catch(e => console.error("Error creating settings doc:", e));
            }
        }, (error) => {
            console.error(`Error fetching settings:`, error.message);
            if (error.code === 'permission-denied') {
                setPermissionError(true);
            }
        });
        unsubscribers.push(unsubSettings);

        return () => unsubscribers.forEach(unsub => unsub());
    }, []);

    // ... (Notification Effects - Same as before) ...
    // Effect for Director to check for missing teacher reports (daily and weekly)
    useEffect(() => {
        if (currentUser?.role !== 'director' || !students.length || !teachers.length || !groups.length) return;

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
            const activeTeachersWithStudents = getActiveTeachers();
            const today = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            if (today.getTime() < endOfDay.getTime()) {
                // It's not the end of the day yet, don't run today's check
            }

            // --- Daily Absent Report Check ---
            const dailyPromises: Promise<void>[] = [];
            // Check for yesterday and the 3 days before that
            for (let i = 1; i < 5; i++) {
                const dateToCheck = new Date();
                dateToCheck.setDate(today.getDate() - i);
                dateToCheck.setHours(12, 0, 0, 0); // Normalize time
                const dayOfWeek = dateToCheck.getDay();
                // Assuming Friday (5) and maybe Saturday (6) are off days. Adjust if needed.
                const isWorkday = ![5].includes(dayOfWeek);
                if (!isWorkday) continue;

                const dateString = dateToCheck.toISOString().split('T')[0];

                for (const teacher of activeTeachersWithStudents) {
                    if (!teacher.students.some(s => new Date(s.joiningDate) <= dateToCheck)) continue;

                    const hasAttendanceRecord = teacher.students.some(s => s.attendance.some(r => r.date === dateString));
                    if (!hasAttendanceRecord) {
                        const notificationId = `teacher-report-${teacher.id}-${dateString}`;
                        const notificationRef = doc(db, 'directorNotifications', notificationId);
                        dailyPromises.push((async () => {
                            const docSnap = await getDoc(notificationRef);
                            if (!docSnap.exists()) {
                                const dayName = dateToCheck.toLocaleDateString('ar-EG', { weekday: 'long' });
                                await setDoc(notificationRef, {
                                    date: new Date().toISOString(),
                                    forDate: dateString,
                                    content: `المدرس ${teacher.name} لم يسجل تقرير يوم ${dayName}.`,
                                    isRead: false,
                                    type: 'teacher_absent_report',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                });
                            }
                        })());
                    }
                }
            }

            // --- Weekly Checks (5 Consecutive Workdays: Saturday to Wednesday) ---
            const weeklyPromises: Promise<void>[] = [];
            const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

            // Run checks on Thursday (4) to evaluate the previous 5 workdays (Sat-Wed)
            if (dayOfWeek === 4) { // Thursday
                // Calculate the 5 workdays: Saturday to Wednesday
                const wednesday = new Date(today);
                wednesday.setDate(today.getDate() - 1); // Yesterday (Wednesday)

                const saturday = new Date(wednesday);
                saturday.setDate(wednesday.getDate() - 4); // 4 days before Wednesday = Saturday

                const saturdayString = saturday.toISOString().split('T')[0];
                const wednesdayString = wednesday.toISOString().split('T')[0];

                for (const teacher of activeTeachersWithStudents) {
                    if (!teacher.students.some(s => new Date(s.joiningDate) <= wednesday)) continue;

                    // Check if teacher has tests for all 5 consecutive workdays
                    const workdays = [];
                    for (let i = 0; i < 5; i++) {
                        const day = new Date(saturday);
                        day.setDate(saturday.getDate() + i);
                        workdays.push(day.toISOString().split('T')[0]);
                    }

                    // Count how many days have tests
                    const daysWithTests = workdays.filter(dateString =>
                        teacher.students.some(s => s.tests.some(t => t.date === dateString))
                    );

                    const weekIdentifier = saturdayString; // Use Saturday as week identifier

                    // Case 1: No tests for all 5 days → Deduct half day
                    if (daysWithTests.length === 0) {
                        const deductionNotificationId = `teacher-5day-no-tests-${teacher.id}-${weekIdentifier}`;
                        const deductionNotificationRef = doc(db, 'directorNotifications', deductionNotificationId);

                        weeklyPromises.push((async () => {
                            const docSnap = await getDoc(deductionNotificationRef);
                            if (!docSnap.exists()) {
                                // Create notification
                                await setDoc(deductionNotificationRef, {
                                    date: new Date().toISOString(),
                                    forDate: wednesdayString,
                                    content: `⚠️ المدرس ${teacher.name} لم يسجل أي اختبارات لمدة 5 أيام متتالية (${saturdayString} إلى ${wednesdayString}). تم خصم نصف يوم تلقائياً.`,
                                    isRead: false,
                                    type: 'teacher_5day_no_tests_deduction',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                });

                                // Apply automatic deduction (half day)
                                const attendanceId = `auto-deduction-${teacher.id}-${weekIdentifier}`;
                                const attendanceRef = doc(db, 'teacherAttendance', attendanceId);
                                const attendanceSnap = await getDoc(attendanceRef);
                                if (!attendanceSnap.exists()) {
                                    await setDoc(attendanceRef, {
                                        teacherId: teacher.id,
                                        date: wednesdayString,
                                        status: TeacherAttendanceStatus.DEDUCTION_HALF_DAY,
                                        reason: `عدم تسجيل اختبارات لمدة 5 أيام متتالية (${saturdayString} - ${wednesdayString})`
                                    });
                                }
                            }
                        })());
                    }
                    // Case 2: Tests recorded for all 5 days → Bonus half day
                    else if (daysWithTests.length === 5) {
                        const bonusNotificationId = `teacher-5day-tests-bonus-${teacher.id}-${weekIdentifier}`;
                        const bonusNotificationRef = doc(db, 'directorNotifications', bonusNotificationId);

                        weeklyPromises.push((async () => {
                            const docSnap = await getDoc(bonusNotificationRef);
                            if (!docSnap.exists()) {
                                // Create notification
                                await setDoc(bonusNotificationRef, {
                                    date: new Date().toISOString(),
                                    forDate: wednesdayString,
                                    content: `🎉 المدرس ${teacher.name} سجل اختبارات لمدة 5 أيام متتالية (${saturdayString} إلى ${wednesdayString}). تم منحه مكافأة نصف يوم تلقائياً.`,
                                    isRead: false,
                                    type: 'teacher_5day_tests_bonus',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                });

                                // Apply automatic bonus (half day)
                                const attendanceId = `auto-bonus-${teacher.id}-${weekIdentifier}`;
                                const attendanceRef = doc(db, 'teacherAttendance', attendanceId);
                                const attendanceSnap = await getDoc(attendanceRef);
                                if (!attendanceSnap.exists()) {
                                    await setDoc(attendanceRef, {
                                        teacherId: teacher.id,
                                        date: wednesdayString,
                                        status: TeacherAttendanceStatus.BONUS_HALF_DAY,
                                        reason: `تسجيل اختبارات لمدة 5 أيام متتالية (${saturdayString} - ${wednesdayString})`
                                    });
                                }

                                // Send public notification to all teachers
                                const publicNotificationId = `public-bonus-${teacher.id}-${weekIdentifier}`;
                                const publicNotificationRef = doc(db, 'notifications', publicNotificationId);
                                const publicNotificationSnap = await getDoc(publicNotificationRef);
                                if (!publicNotificationSnap.exists()) {
                                    await setDoc(publicNotificationRef, {
                                        date: new Date().toISOString(),
                                        content: `🎉 مكافأة! حصل المدرس/ة ${teacher.name} على مكافأة (نصف يوم) لتسجيل الاختبارات بانتظام لمدة 5 أيام متتالية. بارك الله فيه/ا.`,
                                        isRead: false,
                                        recipientId: 'all'
                                    });
                                }
                            }
                        })());
                    }

                    // 2. Weekly No-Fee Collection Check (keep existing)
                    const weeklyFeeNotificationId = `teacher-no-fees-${teacher.id}-${saturdayString}`;
                    const hasFeeCollectionsInWeek = teacherCollections.some(c => c.teacherId === teacher.id && c.date >= saturdayString && c.date <= wednesdayString);
                    if (!hasFeeCollectionsInWeek) {
                        const feeNotificationRef = doc(db, 'directorNotifications', weeklyFeeNotificationId);
                        weeklyPromises.push((async () => {
                            const docSnap = await getDoc(feeNotificationRef);
                            if (!docSnap.exists()) {
                                await setDoc(feeNotificationRef, {
                                    date: new Date().toISOString(),
                                    forDate: wednesdayString,
                                    content: `المدرس ${teacher.name} لم يقم بتسليم أي مصروفات الأسبوع الماضي.`,
                                    isRead: false,
                                    type: 'teacher_no_fees_report',
                                    teacherId: teacher.id,
                                    teacherName: teacher.name,
                                });
                            }
                        })());
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
    }, [students, teachers, groups, currentUser, directorNotifications, teacherCollections]);

    // Effect for cleaning up old, read notifications
    useEffect(() => {
        const cleanupNotifications = async () => {
            if ((!notifications || notifications.length === 0) && (!directorNotifications || directorNotifications.length === 0)) {
                return;
            }

            const batch = writeBatch(db);
            const now = new Date();
            // Cleanup for regular teachers: 24 hours
            const twentyFourHoursAgo = now.getTime() - (24 * 60 * 60 * 1000);
            // Cleanup for Director: 7 days. 
            // Important: We keep Director notifications longer (7 days) so that the "runNotificationChecks"
            // (which looks back ~4 days) can see they exist (as read/deleted) and doesn't re-create them.
            const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);

            // 1. Find Director Notifications to delete (Hard Delete from DB)
            // Clean up both Read AND Deleted notifications that are older than 7 days.
            const directorNotificationsToDelete = directorNotifications.filter(n =>
                (n.isRead || n.isDeleted) && new Date(n.date).getTime() < sevenDaysAgo
            );

            // 2. Find Teacher/Group Notifications to delete
            const teacherNotificationsToDelete = notifications.filter(n => {
                if (new Date(n.date).getTime() >= twentyFourHoursAgo) {
                    return false; // Not old enough
                }

                // Skip notifications without target (e.g. public ones) or handle them differently
                if (!n.target) return false;

                let isFullyRead = false;
                if (n.target.type === 'teacher') {
                    isFullyRead = n.readBy?.includes(n.target.id);
                } else if (n.target.type === 'group') {
                    const group = groups.find(g => g.id === n.target.id);
                    if (group && group.teacherId) {
                        isFullyRead = n.readBy?.includes(group.teacherId);
                    }
                }
                return isFullyRead;
            });

            if (directorNotificationsToDelete.length > 0 || teacherNotificationsToDelete.length > 0) {
                directorNotificationsToDelete.forEach(n => {
                    const docRef = doc(db, 'directorNotifications', n.id);
                    batch.delete(docRef);
                });

                teacherNotificationsToDelete.forEach(n => {
                    const docRef = doc(db, 'notifications', n.id);
                    batch.delete(docRef);
                });

                try {
                    await batch.commit();
                    console.log(`Cleaned up ${directorNotificationsToDelete.length} director and ${teacherNotificationsToDelete.length} teacher/group notifications.`);
                } catch (error) {
                    console.error("Error cleaning up old notifications:", error);
                }
            }
        };

        const interval = setInterval(cleanupNotifications, 60 * 60 * 1000); // Every hour
        const timer = setTimeout(cleanupNotifications, 10000); // 10 seconds after load

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [notifications, directorNotifications, groups]);

    const activeStudents = useMemo(() => students.filter(s => !s.isArchived), [students]);
    const archivedStudents = useMemo(() => students.filter(s => s.isArchived), [students]);

    // FILTER LOGIC FOR SUPERVISOR
    const supervisorFilteredData = useMemo(() => {
        if (currentUser?.role !== 'supervisor') return null;

        const sections = currentUser.section;

        // 1. Groups in these sections
        const filteredGroups = groups.filter(g => {
            const groupType = getGroupTypeFromName(g.name);
            return groupType && sections.includes(groupType);
        });
        const filteredGroupIds = filteredGroups.map(g => g.id);

        // 2. Students in those groups
        const filteredStudents = activeStudents.filter(s => filteredGroupIds.includes(s.groupId));

        // 3. Teachers who teach those groups
        const filteredTeacherIds = filteredGroups.map(g => g.teacherId).filter(id => id);
        const filteredTeachers = teachers.filter(t => filteredTeacherIds.includes(t.id));

        // 4. Expenses (Salaries of these teachers + Bonus)
        const filteredExpenses = expenses.filter(e => {
            if (e.category === ExpenseCategory.TEACHER_SALARY || e.category === ExpenseCategory.TEACHER_BONUS) {
                return filteredTeachers.some(t => e.description.includes(t.name));
            }
            return false;
        });

        // 5. Collections from these teachers
        const filteredCollections = teacherCollections.filter(c => filteredTeacherIds.includes(c.teacherId));

        // 6. Attendance/Payroll
        const filteredTeacherAttendance = teacherAttendance.filter(a => filteredTeacherIds.includes(a.teacherId));
        const filteredPayroll = teacherPayrollAdjustments.filter(p => filteredTeacherIds.includes(p.teacherId));

        return {
            groups: filteredGroups,
            students: filteredStudents,
            teachers: filteredTeachers,
            expenses: filteredExpenses,
            collections: filteredCollections,
            teacherAttendance: filteredTeacherAttendance,
            teacherPayrollAdjustments: filteredPayroll
        };
    }, [currentUser, groups, activeStudents, teachers, expenses, teacherCollections, teacherAttendance, teacherPayrollAdjustments]);


    const visibleGroups = useMemo(() => {
        if (currentUser?.role === 'director') return groups;
        if (currentUser?.role === 'supervisor') return supervisorFilteredData?.groups || [];
        return groups.filter(g => g.teacherId === currentUser?.id);
    }, [groups, currentUser, supervisorFilteredData]);

    const teacherStudents = useMemo(() => {
        if (currentUser?.role !== 'teacher') return [];
        const teacherGroupIds = groups.filter(g => g.teacherId === currentUser.id).map(g => g.id);
        return activeStudents.filter(s => teacherGroupIds.includes(s.groupId));
    }, [currentUser, groups, activeStudents]);

    const groupsForUnarchiveModal = useMemo(() => {
        if (currentUser?.role === 'director') return groups;
        if (currentUser?.role === 'supervisor') return supervisorFilteredData?.groups || [];
        if (currentUser?.role === 'teacher') return groups.filter(g => g.teacherId === currentUser.id);
        return [];
    }, [groups, currentUser, supervisorFilteredData]);

    // Helper to get student count based on current filter
    const getFilteredStudentCount = () => {
        if (currentUser?.role === 'supervisor') return supervisorFilteredData?.students.length || 0;

        let targetStudents = currentUser?.role === 'director' ? activeStudents : teacherStudents;

        if (studentTypeFilter !== 'all') {
            targetStudents = targetStudents.filter(s => {
                const group = groups.find(g => g.id === s.groupId);
                return getGroupTypeFromName(group?.name) === studentTypeFilter;
            });
        }
        return targetStudents.length;
    };

    // ... (Event Handlers) ...
    const handleOpenStudentDetails = (student: Student, initialTab: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports' = 'attendanceLog') => {
        setDetailsModalState({ student, initialTab });
    };

    const handleCloseStudentDetails = () => {
        setDetailsModalState(null);
    };

    const handleOpenTeacherDetails = (teacher: Teacher) => {
        setTeacherForDetails(teacher);
        setSupervisorForDetails(null);
    };

    const handleOpenSupervisorDetails = (supervisor: Supervisor) => {
        setSupervisorForDetails(supervisor);
        setTeacherForDetails(null);
    };

    const handleCloseEmployeeDetails = () => {
        setTeacherForDetails(null);
        setSupervisorForDetails(null);
    };

    const handleLogin = (user: CurrentUser) => { setCurrentUser(user); };
    const handleLogout = () => { setCurrentUser(null); handleBackToMain(); setIsSidebarOpen(false); };
    const handleOpenMenu = () => { setIsSidebarOpen(true); if (isSearchVisible) { setIsSearchVisible(false); setSearchTerm(''); } };

    const toggleSearch = () => {
        const newVisibility = !isSearchVisible;
        setIsSearchVisible(newVisibility);
        if (!newVisibility) { setSearchTerm(''); }
    };

    // ... (CRUD Handlers) ...
    const addOrUpdateStudent = async (studentData: Omit<Student, 'id' | 'attendance' | 'fees' | 'tests'>, studentId?: string) => {
        const normalizedNewName = studentData.name.trim().toLowerCase();
        const isDuplicate = students.some(
            student => student.id !== studentId && student.name.trim().toLowerCase() === normalizedNewName
        );

        if (isDuplicate) {
            alert(`الطالب "${studentData.name}" مسجل بالفعل. يرجى استخدام اسم آخر.`);
            return;
        }

        try {
            if (studentId) {
                // When editing, preserve existing approval status
                await updateDoc(doc(db, 'students', studentId), studentData);
                // Alert removed as per user request
            } else {
                // When adding a new student
                const isTeacher = currentUser?.role === 'teacher';

                // Prepare the base student data
                const baseStudentData = {
                    ...studentData,
                    attendance: [],
                    fees: [],
                    tests: [],
                    schedule: defaultSchedule(),
                    progressPlan: {},
                    progressPlanHistory: [],
                    isPending: isTeacher,
                };

                // Only add addedBy if it's a teacher and ID exists
                let addedByValue: string | undefined;
                if (isTeacher && currentUser?.id) {
                    addedByValue = currentUser.id;
                } else if (currentUser?.role === 'director') {
                    addedByValue = 'director';
                }

                const newStudentData: any = {
                    ...baseStudentData,
                };

                if (addedByValue) {
                    newStudentData.addedBy = addedByValue;
                }

                // Sanitize object to remove any undefined values (including nested)
                const sanitizeObject = (obj: any): any => {
                    if (obj === null || obj === undefined) return null;
                    if (Array.isArray(obj)) return obj;
                    if (typeof obj !== 'object') return obj;

                    const sanitized: any = {};
                    Object.keys(obj).forEach(key => {
                        const value = obj[key];
                        if (value !== undefined) {
                            sanitized[key] = typeof value === 'object' && !Array.isArray(value)
                                ? sanitizeObject(value)
                                : value;
                        }
                    });
                    return sanitized;
                };

                const sanitizedData = sanitizeObject(newStudentData);

                console.log('Attempting to save student:', sanitizedData);
                await addDoc(collection(db, 'students'), sanitizedData);

                // Show appropriate message based on user role
                if (isTeacher) {
                    alert('تم إضافة الطالب بنجاح! سيتم مراجعته من قبل المشرف أو المدير.');
                } else {
                    alert('تم إضافة الطالب بنجاح!');
                }
            }
        } catch (error: any) {
            console.error("Error saving student: ", error);
            console.error("Error code:", error?.code);
            console.error("Error message:", error?.message);
            const errorMessage = error?.code === 'permission-denied'
                ? 'ليس لديك صلاحية لحفظ بيانات الطالب. يرجى التواصل مع المدير.'
                : error?.message
                    ? `حدث خطأ: ${error.message}`
                    : 'حدث خطأ أثناء حفظ بيانات الطالب.';
            alert(errorMessage);
        }
        setStudentToEdit(null);
    };

    const handleEditStudent = (student: Student) => { setStudentToEdit(student); setIsFormOpen(true); };

    const handleOpenAddStudentForm = () => {
        if (visibleGroups.length === 0) {
            if (currentUser?.role === 'director' || currentUser?.role === 'supervisor') {
                alert('يرجى التأكد من وجود مجموعات متاحة قبل إضافة طالب.');
            } else {
                alert('لم يتم تعيينك لأي مجموعة بعد. لا يمكنك إضافة طلاب.');
            }
            return;
        }
        setStudentToEdit(null);
        setIsFormOpen(true);
    };

    // ... (Pending Student Approval Handlers) ...
    const handleApproveStudent = async (studentId: string) => {
        if (!currentUser || (currentUser.role !== 'director' && currentUser.role !== 'supervisor')) {
            alert('ليس لديك صلاحية للموافقة على الطلاب.');
            return;
        }

        try {
            await updateDoc(doc(db, 'students', studentId), {
                isPending: false,
                approvedBy: currentUser.role === 'director' ? 'director' : currentUser.id,
                approvalDate: new Date().toISOString().split('T')[0]
            });
            // Alert removed as per user request
        } catch (error) {
            console.error("Error approving student: ", error);
            alert("حدث خطأ أثناء قبول الطالب.");
        }
    };

    const handleRejectStudent = async (studentId: string) => {
        if (!currentUser || (currentUser.role !== 'director' && currentUser.role !== 'supervisor')) {
            alert('ليس لديك صلاحية لرفض الطلاب.');
            return;
        }

        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const rejectionReason = prompt(`يرجى إدخال سبب رفض الطالب "${student.name}":`);
        if (rejectionReason === null || rejectionReason.trim() === '') {
            return;
        }

        if (window.confirm(`هل أنت متأكد من رفض الطالب "${student.name}"؟ سيتم حذفه نهائياً.`)) {
            try {
                if (student.addedBy) {
                    const teacher = teachers.find(t => t.id === student.addedBy);
                    if (teacher) {
                        const rejectorName = currentUser.role === 'director' ? 'المدير' : `المشرف ${currentUser.name}`;
                        await addDoc(collection(db, 'notifications'), {
                            date: new Date().toISOString(),
                            content: `تم رفض الطالب "${student.name}" من قبل ${rejectorName}.\nسبب الرفض: ${rejectionReason.trim()}`,
                            senderName: rejectorName,
                            target: { type: 'teacher', id: student.addedBy },
                            readBy: [],
                        });
                    }
                }
                await deleteDoc(doc(db, 'students', studentId));
                alert('تم رفض الطالب وحذفه، وتم إرسال إشعار للمدرس.');
            } catch (error) {
                console.error("Error rejecting student: ", error);
                alert("حدث خطأ أثناء رفض الطالب.");
            }
        }
    };

    // ... (Test, Note, Attendance Handlers - Same as before) ...
    const handleAddTest = useCallback(async (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => {
        try {
            await updateDoc(doc(db, 'students', studentId), {
                tests: arrayUnion({ id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], ...testData })
            });
        } catch (error) { console.error("Error adding test: ", error); }
    }, []);

    const handleDeleteTest = useCallback(async (studentId: string, testId: string) => {
        try {
            const studentDoc = await getDoc(doc(db, 'students', studentId));
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const updatedTests = studentData.tests.filter(t => t.id !== testId);
            await updateDoc(doc(db, 'students', studentId), { tests: updatedTests });
        } catch (error) {
            console.error("Error deleting test: ", error);
            alert("حدث خطأ أثناء حذف الاختبار.");
        }
    }, []);

    const handleAddNote = useCallback(async (studentId: string, content: string) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, 'notes'), {
                studentId, content,
                authorId: currentUser.role === 'director' ? 'director' : currentUser.id,
                authorName: currentUser.role === 'director' ? 'المدير' : (currentUser.role === 'supervisor' ? `المشرف ${currentUser.name}` : currentUser.name),
                date: new Date().toISOString(),
                isAcknowledged: false,
            });
        } catch (error) { console.error("Error adding note:", error); }
    }, [currentUser]);

    const handleToggleNoteAcknowledge = useCallback(async (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            try { await updateDoc(doc(db, 'notes', noteId), { isAcknowledged: !note.isAcknowledged }); }
            catch (error) { console.error("Error toggling note acknowledge:", error); }
        }
    }, [notes]);

    const handleToggleAttendance = useCallback(async (studentId: string, date: string, status: AttendanceStatus) => {
        try {
            const studentDoc = await getDoc(doc(db, 'students', studentId));
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const attendance = [...studentData.attendance];
            const recordIndex = attendance.findIndex(a => a.date === date);
            recordIndex > -1 ? attendance[recordIndex].status = status : attendance.push({ date, status });
            await updateDoc(doc(db, 'students', studentId), { attendance });
        } catch (error) { console.error("Error toggling attendance: ", error); }
    }, []);

    const handleSaveStudentProgressPlan = useCallback(async (studentId: string, plan: ProgressPlan, authorName: string) => {
        try {
            const studentRef = doc(db, 'students', studentId);
            if (!plan['new'] && !plan['recent_past'] && !plan['distant_past']) {
                await updateDoc(studentRef, { progressPlan: plan });
                return;
            }
            const newPlanRecord: Omit<ProgressPlanRecord, 'id'> = {
                date: new Date().toISOString(),
                plan: plan,
                isCompleted: false,
                authorName: authorName,
            };
            await updateDoc(studentRef, {
                progressPlan: plan,
                progressPlanHistory: arrayUnion({ id: crypto.randomUUID(), ...newPlanRecord })
            });
        } catch (error) { console.error("Error saving progress plan:", error); }
    }, []);

    const handleTogglePlanCompletion = useCallback(async (studentId: string, planId: string) => {
        try {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const history = studentData.progressPlanHistory || [];
            const updatedHistory = history.map(record =>
                record.id === planId ? { ...record, isCompleted: !record.isCompleted } : record
            );
            await updateDoc(studentRef, { progressPlanHistory: updatedHistory });
        } catch (error) {
            console.error("Error toggling plan completion:", error);
        }
    }, []);

    const handleDeletePlanRecord = useCallback(async (studentId: string, planId: string) => {
        if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذه الخطة من السجل؟")) return;
        try {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const history = studentData.progressPlanHistory || [];
            const updatedHistory = history.filter(record => record.id !== planId);
            await updateDoc(studentRef, { progressPlanHistory: updatedHistory });
        } catch (error) {
            console.error("Error deleting plan record:", error);
        }
    }, []);

    const handleUpdatePlanRecord = useCallback(async (studentId: string, updatedRecord: ProgressPlanRecord, modifierName: string) => {
        try {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const history = studentData.progressPlanHistory || [];
            const updatedHistory = history.map(record =>
                record.id === updatedRecord.id
                    ? {
                        ...updatedRecord,
                        modifiedBy: modifierName,
                        modifiedDate: new Date().toISOString(),
                    }
                    : record
            );
            await updateDoc(studentRef, { progressPlanHistory: updatedHistory });
        } catch (error) {
            console.error("Error updating plan record:", error);
        }
    }, []);

    const handleMarkWeeklyReportSent = useCallback(async (studentId: string) => {
        try {
            const studentRef = doc(db, 'students', studentId);
            await updateDoc(studentRef, { lastWeeklyReportDate: new Date().toISOString() });
        } catch (error) {
            console.error("Error marking weekly report as sent:", error);
        }
    }, []);

    // ... (Archive Handlers - Same as before) ...
    const handleArchiveStudent = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;
        if (student.isArchived) {
            if (student.hasDebt) {
                alert("لا يمكن استعادة هذا الطالب لوجود مصروفات مستحقة عليه. يرجى سداد الديون أولاً من صفحة المدينين.");
                return;
            }
            setStudentToUnarchiveId(studentId);
        } else {
            setStudentToArchive(student);
        }
    };

    const confirmArchiveStudent = async () => {
        if (!studentToArchive) return;

        // Store the data we need before closing the modal
        const studentId = studentToArchive.id;
        const archivedByValue = currentUser?.role === 'director' ? 'director' : (currentUser?.role === 'supervisor' ? `supervisor:${currentUser.id}` : currentUser?.id);

        // Check for unpaid fees with 10+ attendance
        const debtMonths: string[] = [];
        const attendance = studentToArchive.attendance;

        // Group attendance by month
        const attendanceByMonth: { [month: string]: number } = {};
        attendance.forEach(record => {
            if (record.status === 'present') {
                const month = record.date.substring(0, 7); // YYYY-MM
                attendanceByMonth[month] = (attendanceByMonth[month] || 0) + 1;
            }
        });

        // Check each month for unpaid fees with 10+ attendance
        Object.entries(attendanceByMonth).forEach(([month, count]) => {
            if (count >= 10) {
                const feeRecord = studentToArchive.fees.find(f => f.month === month);
                if (!feeRecord || !feeRecord.paid) {
                    debtMonths.push(month);
                }
            }
        });

        const hasDebt = debtMonths.length > 0;

        // Close modal immediately for faster UX
        setStudentToArchive(null);

        // Then archive in background
        try {
            const currentGroupName = groups.find(g => g.id === studentToArchive.groupId)?.name || 'غير محدد';
            const updateData: any = {
                isArchived: true,
                archivedBy: archivedByValue,
                archiveDate: new Date().toISOString().split('T')[0],
                hasDebt: hasDebt,
                archivedGroupName: currentGroupName, // Save group name for history even if group is deleted
            };

            if (hasDebt) {
                updateData.debtMonths = debtMonths;
            }

            await updateDoc(doc(db, 'students', studentId), updateData);
        } catch (error) { console.error("Error archiving student: ", error); }
    };

    const handleConfirmUnarchive = async (newGroupId: string) => {
        if (!studentToUnarchiveId) return;

        // Store the ID before the modal closes
        const studentId = studentToUnarchiveId;

        try {
            const isTeacher = currentUser?.role === 'teacher';

            const updateData: any = {
                isArchived: false,
                groupId: newGroupId,
                archivedBy: deleteField(),
                archiveDate: deleteField(),
            };

            // If teacher unarchives, set as pending approval
            if (isTeacher) {
                updateData.isPending = true;
                updateData.addedBy = currentUser.id; // Track who requested the unarchive
                // Clear approval fields if they existed
                updateData.approvedBy = deleteField();
                updateData.approvalDate = deleteField();
            } else {
                // If director/supervisor unarchives, approve immediately
                updateData.isPending = false;
                updateData.approvedBy = currentUser?.role === 'director' ? 'director' : currentUser?.id;
                updateData.approvalDate = new Date().toISOString().split('T')[0];
            }

            await updateDoc(doc(db, 'students', studentId), updateData);

            // Alerts removed as per user request
            if (isTeacher) {
                // Optional: You might want a toast notification here instead, or nothing.
                // For now, removing the alert as requested.
            }

        } catch (error) { console.error("Error unarchiving student: ", error); }
        // Modal is now closed before this function is called, so no need to close it here
    };

    const handleDeleteStudentPermanently = async (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        if (window.confirm(`هل أنت متأكد من رغبتك في حذف الطالب "${student.name}" بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            try {
                await deleteDoc(doc(db, 'students', studentId));
                const notesQuery = query(collection(db, "notes"), where("studentId", "==", studentId));
                const notesSnapshot = await getDocs(notesQuery);
                const batch = writeBatch(db);
                notesSnapshot.forEach(doc => batch.delete(doc.ref));
                await batch.commit();
                // Alert removed as per user request
            } catch (error) {
                console.error("Error permanently deleting student: ", error);
                alert("حدث خطأ أثناء حذف الطالب.");
            }
        }
    };

    // ... (Fee, Group, Teacher Handlers) ...
    const handleOpenFeeModal = (studentId: string, month: string, amount: number) => { setPaymentDetails({ studentId, month, amount }); setIsFeeModalOpen(true); };

    const handleSaveFeePayment = async (details: { studentId: string; month: string; amountPaid: number; receiptNumber: string; }) => {
        try {
            const studentDoc = await getDoc(doc(db, 'students', details.studentId));
            if (!studentDoc.exists()) return;
            const studentData = studentDoc.data() as Student;
            const fees = [...studentData.fees];
            const feeIndex = fees.findIndex(f => f.month === details.month);
            const collectedBy = currentUser?.role === 'director' ? 'director' : currentUser?.id;
            const collectedByName = currentUser?.role === 'director' ? 'المدير' : currentUser?.name;

            const paymentData = {
                paid: true,
                paymentDate: new Date().toISOString(),
                amountPaid: details.amountPaid,
                receiptNumber: details.receiptNumber,
                collectedBy,
                collectedByName
            };
            feeIndex > -1 ? (fees[feeIndex] = { ...fees[feeIndex], ...paymentData }) : fees.push({ month: details.month, amount: studentData.monthlyFee, ...paymentData });
            await updateDoc(doc(db, 'students', details.studentId), { fees });
        } catch (error) { console.error("Error saving fee payment: ", error); }
        // Modal is now closed before this function is called, so no need to close it here
    };

    const handleCancelFeePayment = async (studentId: string, month: string) => {
        if (!window.confirm(`هل أنت متأكد من إلغاء دفع شهر ${month}؟\nسيتم وضع علامة على هذا الشهر كغير مدفوع.`)) {
            return;
        }
        try {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) return;

            const studentData = studentDoc.data() as Student;
            const updatedFees = studentData.fees.map(fee => {
                if (fee.month === month) {
                    // Keep the original amount due, but mark as unpaid and remove payment details
                    const { paymentDate, amountPaid, receiptNumber, ...rest } = fee;
                    return {
                        ...rest,
                        paid: false,
                    };
                }
                return fee;
            });
            await updateDoc(studentRef, { fees: updatedFees });
            // No alert needed for success, the UI update is enough and faster
        } catch (error) {
            console.error("Error cancelling fee payment: ", error);
            alert("حدث خطأ أثناء إلغاء الدفعة.");
        }
    };

    const handlePayDebt = async (studentId: string, month: string, amount: number) => {
        try {
            const studentRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentRef);
            if (!studentDoc.exists()) return;

            const studentData = studentDoc.data() as Student;

            // 1. Update Fees
            const fees = [...studentData.fees];
            const feeIndex = fees.findIndex(f => f.month === month);
            const paymentData = {
                paid: true,
                paymentDate: new Date().toISOString(),
                amountPaid: amount,
                receiptNumber: 'DEBT_PAYMENT',
                collectedBy: currentUser?.role === 'director' ? 'director' : currentUser?.id,
                collectedByName: currentUser?.role === 'director' ? 'المدير' : currentUser?.name
            };

            if (feeIndex > -1) {
                fees[feeIndex] = { ...fees[feeIndex], ...paymentData };
            } else {
                fees.push({ month: month, amount: studentData.monthlyFee, ...paymentData });
            }

            // 2. Update Debt Months
            const updatedDebtMonths = studentData.debtMonths?.filter(m => m !== month) || [];
            const hasRemainingDebt = updatedDebtMonths.length > 0;

            // 3. Save Updates
            const updateData: any = {
                fees,
                debtMonths: updatedDebtMonths,
                hasDebt: hasRemainingDebt
            };

            await updateDoc(studentRef, updateData);
            // Alert removed as per user request

        } catch (error) {
            console.error("Error paying debt: ", error);
            alert("حدث خطأ أثناء دفع الدين.");
        }
    };

    const handleAddGroup = async (name: string, teacherId?: string) => { await addDoc(collection(db, 'groups'), { name, teacherId: teacherId || "" }); };
    const handleUpdateGroup = async (groupId: string, newName: string, newTeacherId?: string) => { await updateDoc(doc(db, 'groups', groupId), { name: newName, teacherId: newTeacherId || "" }); };
    const handleDeleteGroup = async (groupId: string) => {
        if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه المجموعة؟")) {
            if (students.some(s => s.groupId === groupId)) {
                try {
                    const q = query(collection(db, "students"), where("groupId", "==", groupId));
                    const querySnapshot = await getDocs(q);
                    const batch = writeBatch(db);
                    querySnapshot.forEach((doc) => batch.update(doc.ref, { groupId: "" }));
                    await batch.commit();
                } catch (error) { console.error("Error unassigning students:", error); return; }
            }
            await deleteDoc(doc(db, 'groups', groupId));
        }
    };

    const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id'>, teacherId?: string) => {
        if (!teacherId) {
            const isDuplicate = teachers.some(t => t.name.trim() === teacherData.name.trim());
            if (isDuplicate) {
                alert('هذا المدرس مسجل بالفعل.');
                return;
            }
        }
        try {
            // Clean up fields based on payment type
            const cleanedData: any = { ...teacherData };

            if (teacherData.paymentType === 'partnership') {
                // If partnership, remove salary field from database
                cleanedData.salary = deleteField();
            } else {
                // If salary, remove partnership percentage field from database
                cleanedData.partnershipPercentage = deleteField();
            }

            if (teacherId) {
                await updateDoc(doc(db, 'teachers', teacherId), cleanedData);
            } else {
                // For new teachers, don't include deleteField
                const newTeacherData: any = { ...teacherData };
                if (teacherData.paymentType === 'partnership') {
                    delete newTeacherData.salary;
                } else {
                    delete newTeacherData.partnershipPercentage;
                }
                await addDoc(collection(db, 'teachers'), newTeacherData);
            }
        } catch (e) { console.error("Error saving teacher:", e); }
    };

    const handleEditTeacher = (teacher: Teacher) => {
        setTeacherToEdit(teacher);
        setSupervisorToEdit(null);
        setIsTeacherFormOpen(true);
    };

    const handleOpenAddTeacherForm = () => {
        setTeacherToEdit(null);
        setSupervisorToEdit(null);
        setIsTeacherFormOpen(true);
    };

    const handleDeleteTeacher = async (teacherId: string) => {
        if (groups.some(g => g.teacherId === teacherId)) { alert('لا يمكن حذف المدرس لأنه مسؤول عن مجموعة واحدة على الأقل.'); return; }
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المدرس؟')) { await deleteDoc(doc(db, 'teachers', teacherId)); }
    };

    // SUPERVISOR MANAGEMENT
    const handleSaveSupervisor = async (data: Omit<Supervisor, 'id'>, id?: string) => {
        try {
            if (id) {
                await updateDoc(doc(db, 'supervisors', id), data);
            } else {
                await addDoc(collection(db, 'supervisors'), data);
            }
        } catch (e) { console.error("Error saving supervisor:", e); }
    };

    const handleEditSupervisor = (supervisor: Supervisor) => {
        setSupervisorToEdit(supervisor);
        setTeacherToEdit(null);
        setIsTeacherFormOpen(true);
    }

    const handleDeleteSupervisor = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'supervisors', id));
        } catch (e) { console.error("Error deleting supervisor:", e); }
    };

    // Finance Handlers
    const handleAddStaff = async (staffMember: Omit<Staff, 'id'>) => { await addDoc(collection(db, 'staff'), staffMember); };
    const handleUpdateStaff = async (staffId: string, updatedData: Partial<Staff>) => { await updateDoc(doc(db, 'staff', staffId), updatedData); };
    const handleDeleteStaff = async (staffId: string) => { await deleteDoc(doc(db, 'staff', staffId)); };
    const handleLogExpense = async (expense: Omit<Expense, 'id'>) => { await addDoc(collection(db, 'expenses'), expense); };

    const handleDeleteExpense = useCallback(async (expenseId: string) => {
        try {
            await deleteDoc(doc(db, 'expenses', expenseId));
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("حدث خطأ أثناء حذف المصروف.");
        }
    }, []);

    const handleSetTeacherAttendance = async (teacherId: string, date: string, status: TeacherAttendanceStatus, reason?: string) => {
        try {
            const q = query(collection(db, "teacherAttendance"), where("teacherId", "==", teacherId), where("date", "==", date));
            const querySnapshot = await getDocs(q);
            const existingDoc = querySnapshot.docs[0];

            if (status === TeacherAttendanceStatus.PRESENT) {
                if (existingDoc) {
                    await deleteDoc(existingDoc.ref);
                }
            } else {
                const attendanceData: any = { teacherId, date, status };
                if (reason) {
                    attendanceData.reason = reason;
                }

                if (existingDoc) {
                    await updateDoc(existingDoc.ref, attendanceData);
                } else {
                    await addDoc(collection(db, "teacherAttendance"), attendanceData);
                }

                // Send notification to all teachers if it's a bonus
                const isBonusStatus = [
                    TeacherAttendanceStatus.BONUS_DAY,
                    TeacherAttendanceStatus.BONUS_HALF_DAY,
                    TeacherAttendanceStatus.BONUS_QUARTER_DAY
                ].includes(status);

                if (isBonusStatus) {
                    const teacher = teachers.find(t => t.id === teacherId);
                    if (teacher) {
                        let bonusType = '';
                        if (status === TeacherAttendanceStatus.BONUS_DAY) bonusType = 'يوم إضافي كامل';
                        else if (status === TeacherAttendanceStatus.BONUS_HALF_DAY) bonusType = 'نصف يوم إضافي';
                        else if (status === TeacherAttendanceStatus.BONUS_QUARTER_DAY) bonusType = 'ربع يوم إضافي';

                        const notificationContent = `تم منح المدرس ${teacher.name} مكافأة: ${bonusType}${reason ? `\nالسبب: ${reason}` : ''}`;

                        // Send to all active teachers
                        const activeTeachers = teachers.filter(t => t.status === 'active');
                        const batch = writeBatch(db);

                        activeTeachers.forEach(t => {
                            const notificationRef = doc(collection(db, 'notifications'));
                            batch.set(notificationRef, {
                                id: notificationRef.id,
                                date: new Date().toISOString(),
                                content: notificationContent,
                                senderName: 'الإدارة',
                                target: { type: 'teacher', id: t.id },
                                readBy: [],
                                deletedBy: []
                            });
                        });

                        await batch.commit();
                    }
                }
            }
        } catch (error) { console.error("Error setting teacher attendance:", error); }
    };

    const handleUpdatePayrollAdjustments = async (adjustment: Partial<TeacherPayrollAdjustment> & Pick<TeacherPayrollAdjustment, 'teacherId' | 'month'> & { isPaid?: boolean }) => {
        const q = query(collection(db, "teacherPayrollAdjustments"), where("teacherId", "==", adjustment.teacherId), where("month", "==", adjustment.month));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            await updateDoc(querySnapshot.docs[0].ref, adjustment);
        } else {
            await addDoc(collection(db, "teacherPayrollAdjustments"), { bonus: 0, isPaid: false, ...adjustment });
        }
    };




    const handleAddTeacherCollection = useCallback(async (collectionData: Omit<TeacherCollectionRecord, 'id'>) => {
        try {
            await addDoc(collection(db, 'teacherCollections'), collectionData);
        } catch (error) {
            console.error("Error adding teacher collection:", error);
            alert("حدث خطأ أثناء إضافة التحصيل.");
        }
    }, []);

    const handleDeleteTeacherCollection = useCallback(async (collectionId: string) => {
        if (window.confirm("هل أنت متأكد من رغبتك في حذف سجل التسليم هذا؟")) {
            try {
                await deleteDoc(doc(db, 'teacherCollections', collectionId));
            } catch (error) {
                console.error("Error deleting teacher collection:", error);
                alert("حدث خطأ أثناء حذف السجل.");
            }
        }
    }, []);

    // Manual Bonus Handlers
    const handleAddManualBonus = useCallback(async (bonusData: Omit<TeacherManualBonus, 'id'>) => {
        try {
            await addDoc(collection(db, 'teacherManualBonuses'), bonusData);
        } catch (error) {
            console.error("Error adding manual bonus:", error);
            alert("حدث خطأ أثناء إضافة المكافأة.");
        }
    }, []);

    const handleDeleteManualBonus = useCallback(async (bonusId: string) => {
        try {
            await deleteDoc(doc(db, 'teacherManualBonuses', bonusId));
        } catch (error) {
            console.error("Error deleting manual bonus:", error);
            alert("حدث خطأ أثناء حذف المكافأة.");
        }
    }, []);

    // ... (Reset Pay handlers) ...
    const handleResetTeacherPayment = useCallback(async (teacherId: string, month: string, teacherName: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في إلغاء دفع راتب المدرس "${teacherName}" لشهر ${month}؟ سيتم حذف المصروف من السجل المالي.`)) {
            const batch = writeBatch(db);
            try {
                // Get all salary expenses and filter in memory
                const expenseQuery = query(
                    collection(db, "expenses"),
                    where("category", "in", [ExpenseCategory.TEACHER_SALARY, ExpenseCategory.SUPERVISOR_SALARY])
                );
                const expenseSnapshot = await getDocs(expenseQuery);

                // Filter in memory to find the exact expense
                const targetExpense = expenseSnapshot.docs.find(d => {
                    const data = d.data();
                    return data.description.includes(teacherName) && data.description.includes(month);
                });

                if (targetExpense) {
                    batch.delete(targetExpense.ref);
                    console.log('Found and deleting expense:', targetExpense.data());
                } else {
                    console.log('No expense found for teacher:', teacherName, 'month:', month);
                }

                // Update payroll adjustment to mark as unpaid
                const payrollQuery = query(
                    collection(db, "teacherPayrollAdjustments"),
                    where("teacherId", "==", teacherId),
                    where("month", "==", month)
                );
                const payrollSnapshot = await getDocs(payrollQuery);
                if (!payrollSnapshot.empty) {
                    batch.update(payrollSnapshot.docs[0].ref, { isPaid: false });
                    console.log('Marking payroll as unpaid');
                } else {
                    console.log('No payroll adjustment found');
                }

                await batch.commit();
                alert('تم إلغاء الدفع بنجاح.');
            } catch (error) {
                console.error("Error resetting teacher payment:", error);
                alert("حدث خطأ أثناء إلغاء دفع الراتب.");
            }
        }
    }, []);

    const handleResetStaffPayment = useCallback(async (staffId: string, month: string, staffName: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في إلغاء دفع راتب الموظف "${staffName}" لشهر ${month}؟ سيتم حذف المصروف من السجل المالي.`)) {
            try {
                const expenseQuery = query(
                    collection(db, "expenses"),
                    where("category", "==", ExpenseCategory.STAFF_SALARY),
                    where("description", "==", `راتب الموظف: ${staffName} (${staffId}) - شهر ${month}`)
                );
                const expenseSnapshot = await getDocs(expenseQuery);
                if (!expenseSnapshot.empty) {
                    await deleteDoc(expenseSnapshot.docs[0].ref);
                }
            } catch (error) {
                console.error("Error resetting staff payment:", error);
                alert("حدث خطأ أثناء إلغاء دفع الراتب.");
            }
        }
    }, []);

    const handleUpdateFinancialSettings = async (settings: FinancialSettings) => { await setDoc(doc(db, 'settings', 'financial'), settings); };

    // ... (Notification Handlers) ...
    const handleSendNotification = async (target: Notification['target'], content: string) => {
        await addDoc(collection(db, "notifications"), { date: new Date().toISOString(), content, senderName: 'المدير', target, readBy: [] });
    };

    const handleSendNotificationToTeacher = useCallback(async (teacherId: string, content: string) => {
        const sender = currentUser?.role === 'director' ? 'المدير' : (currentUser?.role === 'supervisor' ? 'المشرف' : 'الإدارة');
        await addDoc(collection(db, "notifications"), {
            date: new Date().toISOString(),
            content,
            senderName: sender,
            target: { type: 'teacher', id: teacherId },
            readBy: []
        });
    }, [currentUser]);

    const handleSendNotificationToAll = useCallback(async (content: string) => {
        const batch = writeBatch(db);
        const sender = currentUser?.role === 'director' ? 'المدير' : (currentUser?.role === 'supervisor' ? 'المشرف' : 'الإدارة');

        // Filter targets based on supervisor section if applicable
        let targetTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);
        let targetGroups = groups;

        if (currentUser?.role === 'supervisor') {
            const sections = currentUser.section;
            // Filter groups that belong to any of the supervisor's sections
            const sectionGroups = groups.filter(g => {
                const gType = getGroupTypeFromName(g.name);
                return gType && sections.includes(gType);
            });
            targetGroups = sectionGroups;
            const sectionTeacherIds = sectionGroups.map(g => g.teacherId).filter(id => id);
            targetTeachers = targetTeachers.filter(t => sectionTeacherIds.includes(t.id));
        }

        targetTeachers.forEach(teacher => {
            const notificationRef = doc(collection(db, "notifications"));
            batch.set(notificationRef, {
                date: new Date().toISOString(),
                content,
                senderName: sender,
                target: { type: 'teacher', id: teacher.id },
                readBy: []
            });
        });

        targetGroups.forEach(group => {
            const notificationRef = doc(collection(db, "notifications"));
            batch.set(notificationRef, {
                date: new Date().toISOString(),
                content,
                senderName: sender,
                target: { type: 'group', id: group.id, name: group.name },
                readBy: []
            });
        });

        try {
            await batch.commit();
            alert("تم إرسال الإشعار للجميع بنجاح!");
        } catch (error) {
            console.error("Error sending notification to all:", error);
            alert("حدث خطأ أثناء إرسال الإشعار.");
        }
    }, [teachers, groups, currentUser]);

    const handleMarkNotificationsAsRead = async (notificationIdsToMark: string[], teacherId: string) => {
        const batch = writeBatch(db);
        notificationIdsToMark.forEach(id => {
            batch.update(doc(db, "notifications", id), { readBy: arrayUnion(teacherId) });
        });
        await batch.commit();
    };

    const handleDeleteTeacherNotifications = async (notificationIds: string[], teacherId: string) => {
        const batch = writeBatch(db);
        notificationIds.forEach(id => {
            batch.update(doc(db, "notifications", id), { deletedBy: arrayUnion(teacherId) });
        });
        await batch.commit();
    };

    const handleMarkDirectorNotificationsAsRead = async (notificationIdsToMark: string[]) => {
        const batch = writeBatch(db);
        notificationIdsToMark.forEach(id => {
            batch.update(doc(db, "directorNotifications", id), { isRead: true });
        });
        await batch.commit();
    };

    const handleDeleteDirectorNotifications = async (notificationIds: string[]) => {
        const batch = writeBatch(db);
        notificationIds.forEach(id => {
            batch.update(doc(db, "directorNotifications", id), { isDeleted: true });
        });
        await batch.commit();
    }

    // View Navigation
    const handleBackToMain = () => {
        setViewingGroup(null); setIsDirectorReportView(false); setIsDirectorNotesView(false); setIsFinanceView(false);
        setIsFeeCollectionView(false); setIsTeacherManagerView(false); setIsDirectorNotificationsView(false);
        setViewingTeacherReportId(null); setIsUnpaidStudentsView(false); setIsArchiveView(false); setIsGeneralView(false);
        setIsDebtorsView(false); // Reset Debtors View
        setIsTeacherFilterVisible(false); // Reset filter visibility
        if (isSearchVisible) { setIsSearchVisible(false); setSearchTerm(''); }
    };

    const handleViewGroupReport = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            setViewingGroup(group);
        }
    };

    const openDirectorView = (viewSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        handleBackToMain();
        viewSetter(true);
    };

    const handleViewStudent = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            handleBackToMain();
            setActiveView('students');
            setSearchTerm(student.name);
        }
    };

    const handleBottomNavSelect = (view: ActiveView) => {
        handleBackToMain();
        setActiveView(view);
    };

    const renderArchiveList = () => {
        let studentsToDisplay = students.filter(s => s.isArchived);
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            studentsToDisplay = studentsToDisplay.filter(s => s.name.toLowerCase().includes(searchLower))
                .sort((a, b) => {
                    const aName = a.name.toLowerCase();
                    const bName = b.name.toLowerCase();
                    const aStartsWith = aName.startsWith(searchLower);
                    const bStartsWith = bName.startsWith(searchLower);
                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;
                    return a.name.localeCompare(b.name, 'ar');
                });
        }
        studentsToDisplay = studentsToDisplay.filter(s => {
            if (currentUser?.role === 'director') return true;
            if (currentUser?.role === 'supervisor') {
                return supervisorFilteredData?.students.some(sf => sf.id === s.id) || false;
            }
            if (currentUser?.role === 'teacher') {
                return s.archivedBy === currentUser.id;
            }
            return false;
        }).sort((a, b) => a.name.localeCompare(b.name, 'ar'));

        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {studentsToDisplay.length > 0 ? (
                        studentsToDisplay.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                groupName={student.archivedGroupName || groups.find(g => g.id === student.groupId)?.name}
                                onOpenFeeModal={handleOpenFeeModal}
                                onEdit={handleEditStudent}
                                onToggleAttendance={handleToggleAttendance}
                                onArchive={handleArchiveStudent}
                                currentUserRole={currentUser!.role}
                                onViewDetails={handleOpenStudentDetails}
                                onDeletePermanently={handleDeleteStudentPermanently}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl shadow">
                            <h2 className="text-2xl font-semibold text-gray-600">الأرشيف فارغ</h2>
                            <p className="text-gray-400 mt-2">لا يوجد طلاب مؤرشفون لعرضهم.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ... (Error Handling & Login - No Changes) ...

    if (permissionError) {
        // ... (Same as existing error UI)
        return (
            <div className="fixed inset-0 bg-red-100 z-50 flex justify-center items-center p-4 text-right">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
                    <h2 className="text-2xl font-bold mb-4 text-red-700">خطأ: الوصول إلى قاعدة البيانات مرفوض</h2>
                    <p className="text-gray-700 mb-4">
                        يبدو أن تطبيقك لا يملك الصلاحية للوصول إلى بيانات Firestore. هذا عادةً بسبب قواعد الأمان في مشروعك على Firebase التي تمنع القراءة والكتابة افتراضياً.
                    </p>
                    {/* ... */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold"
                        >
                            لقد قمت بتحديث القواعد، أعد تحميل الصفحة
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <LocalLoginScreen onLogin={handleLogin} teachers={teachers} supervisors={supervisors} />;
    }

    const renderHeader = () => {
        const backButton = (<button onClick={handleBackToMain} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all" aria-label="العودة"> <ArrowRightIcon className="w-6 h-6" /> </button>);

        const isSubView = viewingGroup || isGeneralView || isDirectorReportView || isDirectorNotesView || isFinanceView || isFeeCollectionView || isTeacherManagerView || isDirectorNotificationsView || viewingTeacherReportId || isUnpaidStudentsView || isArchiveView || isDebtorsView;

        let title = 'مركز الشاطبي';
        if (currentUser.role === 'supervisor') title = `مركز الشاطبي - المشرف: ${currentUser.name}`;

        if (isArchiveView) { title = 'الأرشيف'; }
        else if (isDebtorsView) { title = 'المدينون'; }
        else if (viewingGroup) { title = `تقرير: ${viewingGroup.name}`; }
        else if (isGeneralView) { title = 'نظرة عامة'; }
        else if (isDirectorReportView) { title = 'التقارير العامة'; }
        else if (isDirectorNotesView) { title = 'سجل الملحوظات'; }
        else if (isFinanceView) { title = 'الإدارة المالية'; }
        else if (isFeeCollectionView) { title = 'تحصيل الرسوم'; }
        else if (isTeacherManagerView) { title = 'الإدارة'; }
        else if (isDirectorNotificationsView) { title = 'الرسائل والإشعارات'; }
        else if (viewingTeacherReportId) { const teacher = teachers.find(t => t.id === viewingTeacherReportId); title = `تقرير: ${teacher?.name || 'مدرس'}`; }
        else if (isUnpaidStudentsView) { title = 'الطلاب غير المسددين'; }
        else if (currentUser.role === 'director' || currentUser.role === 'teacher' || currentUser.role === 'supervisor') {
            // Calculate count for filtered students
            const studentCount = activeView === 'students' ? getFilteredStudentCount() : (currentUser.role === 'director' ? activeStudents.length : (currentUser.role === 'supervisor' ? (supervisorFilteredData?.students.length || 0) : teacherStudents.length));

            const groupCount = currentUser.role === 'director' ? groups.length : (currentUser.role === 'supervisor' ? (supervisorFilteredData?.groups.length || 0) : visibleGroups.length);

            const titleMap: Record<ActiveView, string> = {
                students: `الطلاب (${studentCount})`,
                groups: `المجموعات (${groupCount})`,
                attendance_report: 'تقرير الحضور',
                tests_report: 'تقرير الاختبارات',
                financial_report: 'المصروفات'
            }
            title = titleMap[activeView];
        }

        let leftContent = null;
        let centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>;
        let rightContent = null;

        if (currentUser.role === 'director' || currentUser.role === 'supervisor') {
            // Director & Supervisor Logic
            const directorBell = currentUser.role === 'director' ? <DirectorNotificationBell notifications={directorNotifications.filter(n => !n.isDeleted).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} onMarkAsRead={handleMarkDirectorNotificationsAsRead} onDelete={handleDeleteDirectorNotifications} /> : null;

            if (isSubView) {
                leftContent = backButton;

                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input
                                type="search"
                                placeholder={isTeacherManagerView ? 'البحث عن مدرس أو مشرف...' : 'البحث...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                } else if (isTeacherManagerView || isArchiveView || isDebtorsView) {
                    centerContent = (
                        <div className="flex items-center gap-2">
                            <button onClick={toggleSearch} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors" aria-label="بحث">
                                <SearchIcon className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>
                        </div>
                    );
                }

                if (isTeacherManagerView) {
                    rightContent = (
                        <div className="flex items-center gap-2">
                            {directorBell}
                            <button onClick={handleOpenAddTeacherForm} className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-all" aria-label="إضافة موظف جديد">
                                <UserPlusIcon className="w-6 h-6" />
                            </button>
                        </div>
                    );
                } else {
                    rightContent = directorBell;
                }
            } else {
                leftContent = (
                    <>
                        <button onClick={handleOpenMenu} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all lg:hidden" aria-label="فتح القائمة">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        {(activeView === 'students' || activeView === 'groups' || isTeacherManagerView) && (
                            <button onClick={toggleSearch} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all" aria-label="بحث">
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        )}
                    </>
                );
                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input type="search" placeholder={isTeacherManagerView ? 'البحث عن مدرس أو مشرف...' : (activeView === 'groups' ? 'البحث عن مجموعة...' : 'البحث عن طالب...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                    rightContent = directorBell;
                } else {
                    let actionButton = null;
                    if (isTeacherManagerView) {
                        actionButton = (
                            <button onClick={handleOpenAddTeacherForm} className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-all" aria-label="إضافة مدرس جديد">
                                <UserPlusIcon className="w-6 h-6" />
                            </button>
                        );
                    } else if (activeView === 'students') {
                        actionButton = (
                            <button onClick={handleOpenAddStudentForm} className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-all" aria-label="إضافة طالب جديد">
                                <UserPlusIcon className="w-6 h-6" />
                            </button>
                        );
                    } else if (activeView === 'groups') {
                        actionButton = (
                            <button onClick={() => setIsGroupManagerOpen(true)} className="p-2 rounded-lg text-blue-600 bg-blue-100 shadow hover:bg-blue-200 transition-all" aria-label="إدارة المجموعات">
                                <UsersIcon className="w-6 h-6" />
                            </button>
                        );
                    }
                    rightContent = (
                        <div className="flex items-center gap-2">
                            {actionButton}
                            {directorBell}
                        </div>
                    );
                }
            }
        } else { // Teacher view
            // ... (Same as existing teacher view)
            if (viewingGroup || isArchiveView) {
                leftContent = backButton;
                centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{viewingGroup ? `تقرير: ${viewingGroup.name}` : 'الأرشيف'}</h1>;
                rightContent = null;
            } else {
                leftContent = (
                    <>
                        <button onClick={handleLogout} className="p-2 rounded-lg bg-red-100 text-red-700 shadow hover:bg-red-200 transition-all" aria-label="تسجيل الخروج">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                        {(activeView === 'students' || activeView === 'groups') && (
                            <button onClick={toggleSearch} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all" aria-label="بحث">
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        )}
                    </>
                );

                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input type="search" placeholder={activeView === 'groups' ? 'البحث عن مجموعة...' : 'البحث عن طالب...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                    rightContent = null;
                } else {
                    centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>;
                    rightContent = (
                        <div className="flex items-center gap-2">
                            {(activeView === 'students' || activeView === 'groups') && (
                                <button onClick={handleOpenAddStudentForm} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-3 rounded-lg shadow hover:bg-blue-700 transition-all" aria-label="إضافة طالب جديد">
                                    <UserPlusIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">إضافة طالب</span>
                                </button>
                            )}
                            <button onClick={() => setIsArchiveView(true)} className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none" title="الأرشيف">
                                <ArchiveIcon className="w-6 h-6" />
                            </button>
                            <NotificationBell currentUser={currentUser as Extract<CurrentUser, { role: 'teacher' }>} notifications={notifications} groups={groups} onMarkAsRead={handleMarkNotificationsAsRead} onDelete={handleDeleteTeacherNotifications} />
                        </div>
                    );
                }
            }
        }
        return <Header leftContent={leftContent} centerContent={centerContent} rightContent={rightContent} />;
    };

    const handleApplyDeductions = async (records: TeacherAttendanceRecord[], notifications: Notification[]) => {
        const batch = writeBatch(db);

        records.forEach(record => {
            const ref = doc(collection(db, 'teacherAttendance'));
            batch.set(ref, record);
        });

        notifications.forEach(notification => {
            const ref = doc(collection(db, 'notifications'));
            batch.set(ref, notification);
        });

        try {
            await batch.commit();
            alert('تم تطبيق الخصومات وإرسال الإشعارات بنجاح.');
        } catch (error) {
            console.error("Error applying deductions: ", error);
            alert('حدث خطأ أثناء تطبيق الخصومات.');
        }
    };

    const renderSupervisorContent = () => {
        if (!supervisorFilteredData) return null;
        const { students, groups, teachers, expenses, collections, teacherAttendance, teacherPayrollAdjustments } = supervisorFilteredData;

        const subViewContent = (() => {
            if (isArchiveView) return renderArchiveList();
            if (isDebtorsView) return <DebtorsPage students={students} groups={groups} onPayDebt={handlePayDebt} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser.role} searchTerm={searchTerm} />;
            if (isGeneralView) return <GeneralViewPage students={students} notes={notes} groups={groups} teachers={teachers} teacherCollections={collections} expenses={expenses} onDeleteExpense={handleDeleteExpense} onToggleAcknowledge={handleToggleNoteAcknowledge} onViewStudent={handleViewStudent} onApproveStudent={handleApproveStudent} onRejectStudent={handleRejectStudent} />;
            if (isUnpaidStudentsView) return <UnpaidStudentsPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={students} />;
            if (isDirectorNotificationsView) return <DirectorNotificationsPage onBack={handleBackToMain} teachers={teachers} groups={groups} notifications={notifications} onSendNotification={handleSendNotification} />;
            if (isFeeCollectionView) return <FeeCollectionPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={students} teacherCollections={collections} onAddTeacherCollection={handleAddTeacherCollection} onDeleteTeacherCollection={handleDeleteTeacherCollection} />;
            if (viewingTeacherReportId) return <TeacherReportPage teacher={teachers.find(t => t.id === viewingTeacherReportId)!} groups={groups} students={students} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={handleBackToMain} teacherCollections={collections} currentUserRole={currentUser?.role} />;
            if (isTeacherManagerView) return <TeacherManagerPage
                onBack={handleBackToMain}
                teachers={teachers}
                supervisors={[]}
                groups={groups}
                students={students}
                teacherAttendance={teacherAttendance}
                teacherPayrollAdjustments={teacherPayrollAdjustments}
                onAddTeacherClick={handleOpenAddTeacherForm}
                onEditTeacherClick={handleEditTeacher}
                onEditSupervisorClick={() => { }}
                onDeleteTeacher={handleDeleteTeacher}
                onDeleteSupervisor={() => { }}
                onSetTeacherAttendance={handleSetTeacherAttendance}
                onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments}
                onLogExpense={handleLogExpense}
                financialSettings={financialSettings}
                onViewTeacherReport={(id) => setViewingTeacherReportId(id)}
                onSendNotificationToAll={handleSendNotificationToAll}
                onSendNotificationToTeacher={handleSendNotificationToTeacher}
                onViewTeacherDetails={handleOpenTeacherDetails}
                onViewSupervisorDetails={() => { }}
                searchTerm={searchTerm}
                isFilterVisible={isTeacherFilterVisible}
                onToggleFilter={() => setIsTeacherFilterVisible(!isTeacherFilterVisible)}
            />;
            if (isDirectorNotesView) return <DirectorNotesPage onBack={handleBackToMain} notes={notes} students={students} groups={groups} teachers={teachers} onToggleAcknowledge={handleToggleNoteAcknowledge} />;
            if (isFinanceView) return <FinancePage onBack={handleBackToMain} students={students} teachers={teachers} staff={[]} expenses={expenses} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onLogExpense={handleLogExpense} onDeleteExpense={handleDeleteExpense} onSetTeacherAttendance={handleSetTeacherAttendance} onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments} financialSettings={financialSettings} onUpdateFinancialSettings={handleUpdateFinancialSettings} groups={groups} onResetTeacherPayment={handleResetTeacherPayment} onResetStaffPayment={handleResetStaffPayment} teacherCollections={collections} onViewTeacherDetails={handleOpenTeacherDetails} supervisors={[]} onApplyDeductions={handleApplyDeductions} />;
            if (isDirectorReportView) return <DirectorReportsPage groups={groups} students={students} onBack={handleBackToMain} />;
            if (viewingGroup) return <GroupReportPage group={viewingGroup} students={students.filter(s => s.groupId === viewingGroup.id)} teacher={teachers.find(t => t.id === viewingGroup.teacherId)} onBack={handleBackToMain} currentUserRole={currentUser?.role} />;
            return null;
        })();

        // ... (Rest of renderSupervisorContent)
        if (subViewContent) {
            return subViewContent;
        }

        return (
            <div>
                {(() => {
                    switch (activeView) {
                        case 'students':
                            return <AllStudentsPage
                                students={students}
                                searchTerm={searchTerm}
                                notes={notes}
                                groups={groups}
                                onOpenFeeModal={handleOpenFeeModal}
                                onAddTest={handleAddTest}
                                onDeleteTest={handleDeleteTest}
                                onAddNote={handleAddNote}
                                onEdit={handleEditStudent}
                                onToggleAttendance={handleToggleAttendance}
                                onArchive={handleArchiveStudent}
                                currentUserRole="supervisor"
                                onViewDetails={handleOpenStudentDetails}
                                typeFilter={studentTypeFilter}
                                onTypeFilterChange={setStudentTypeFilter}
                                onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                            />;
                        case 'groups':
                            return <GroupsPage students={students} searchTerm={searchTerm} groups={groups} teachers={teachers} notes={notes} onViewGroupReport={handleViewGroupReport} onOpenFeeModal={handleOpenFeeModal} onAddTest={handleAddTest} onDeleteTest={handleDeleteTest} onAddNote={handleAddNote} onEdit={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchive={handleArchiveStudent} currentUserRole="supervisor" onViewDetails={handleOpenStudentDetails} onMarkWeeklyReportSent={handleMarkWeeklyReportSent} />;
                        case 'attendance_report':
                            return <AttendanceReportPage students={students} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        case 'tests_report':
                            return <TestsReportPage students={students} groups={groups} onViewStudent={handleViewStudent} />;
                        case 'financial_report':
                            return <FinancialReportPage students={students} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        default:
                            return null;
                    }
                })()}
            </div>
        )
    }

    const renderDirectorContent = () => {
        const subViewContent = (() => {
            if (isArchiveView) return renderArchiveList();
            if (isDebtorsView) return <DebtorsPage students={students} groups={groups} onPayDebt={handlePayDebt} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser.role} searchTerm={searchTerm} />;
            if (isGeneralView) return <GeneralViewPage students={students} notes={notes} groups={groups} teachers={teachers} teacherCollections={teacherCollections} expenses={expenses} onDeleteExpense={handleDeleteExpense} onToggleAcknowledge={handleToggleNoteAcknowledge} onViewStudent={handleViewStudent} onApproveStudent={handleApproveStudent} onRejectStudent={handleRejectStudent} />;
            if (isUnpaidStudentsView) return <UnpaidStudentsPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={activeStudents} />;
            if (isDirectorNotificationsView) return <DirectorNotificationsPage onBack={handleBackToMain} teachers={teachers} groups={groups} notifications={notifications} onSendNotification={handleSendNotification} />;
            if (isFeeCollectionView) return <FeeCollectionPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={activeStudents} teacherCollections={teacherCollections} onAddTeacherCollection={handleAddTeacherCollection} onDeleteTeacherCollection={handleDeleteTeacherCollection} />;
            if (viewingTeacherReportId) return <TeacherReportPage teacher={teachers.find(t => t.id === viewingTeacherReportId)!} groups={groups} students={activeStudents} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={handleBackToMain} teacherCollections={teacherCollections} currentUserRole={currentUser?.role} />;
            if (isTeacherManagerView) return <TeacherManagerPage
                onBack={handleBackToMain}
                teachers={teachers}
                supervisors={supervisors}
                groups={groups}
                students={activeStudents}
                teacherAttendance={teacherAttendance}
                teacherPayrollAdjustments={teacherPayrollAdjustments}
                onAddTeacherClick={handleOpenAddTeacherForm}
                onEditTeacherClick={handleEditTeacher}
                onEditSupervisorClick={handleEditSupervisor}
                onDeleteTeacher={handleDeleteTeacher}
                onDeleteSupervisor={handleDeleteSupervisor}
                onSetTeacherAttendance={handleSetTeacherAttendance}
                onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments}
                onLogExpense={handleLogExpense}
                financialSettings={financialSettings}
                onViewTeacherReport={(id) => setViewingTeacherReportId(id)}
                onSendNotificationToAll={handleSendNotificationToAll}
                onSendNotificationToTeacher={handleSendNotificationToTeacher}
                onViewTeacherDetails={handleOpenTeacherDetails}
                onViewSupervisorDetails={handleOpenSupervisorDetails}
                searchTerm={searchTerm}
                isFilterVisible={isTeacherFilterVisible}
                onToggleFilter={() => setIsTeacherFilterVisible(!isTeacherFilterVisible)}
            />;
            if (isDirectorNotesView) return <DirectorNotesPage onBack={handleBackToMain} notes={notes} students={students} groups={groups} teachers={teachers} onToggleAcknowledge={handleToggleNoteAcknowledge} />;
            if (isFinanceView) return <FinancePage onBack={handleBackToMain} students={activeStudents} teachers={teachers} staff={staff} expenses={expenses} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onLogExpense={handleLogExpense} onDeleteExpense={handleDeleteExpense} onSetTeacherAttendance={handleSetTeacherAttendance} onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments} financialSettings={financialSettings} onUpdateFinancialSettings={handleUpdateFinancialSettings} groups={groups} onResetTeacherPayment={handleResetTeacherPayment} onResetStaffPayment={handleResetStaffPayment} teacherCollections={teacherCollections} onViewTeacherDetails={handleOpenTeacherDetails} supervisors={supervisors} onApplyDeductions={handleApplyDeductions} />;
            if (isDirectorReportView) return <DirectorReportsPage groups={groups} students={activeStudents} onBack={handleBackToMain} />;
            if (viewingGroup) return <GroupReportPage group={viewingGroup} students={activeStudents.filter(s => s.groupId === viewingGroup.id)} teacher={teachers.find(t => t.id === viewingGroup.teacherId)} onBack={handleBackToMain} currentUserRole={currentUser?.role} />;
            return null;
        })();

        if (subViewContent) {
            return subViewContent;
        }

        return (
            <div>
                {(() => {
                    switch (activeView) {
                        case 'students':
                            return <AllStudentsPage
                                students={activeStudents}
                                searchTerm={searchTerm}
                                notes={notes}
                                groups={groups}
                                onOpenFeeModal={handleOpenFeeModal}
                                onAddTest={handleAddTest}
                                onDeleteTest={handleDeleteTest}
                                onAddNote={handleAddNote}
                                onEdit={handleEditStudent}
                                onToggleAttendance={handleToggleAttendance}
                                onArchive={handleArchiveStudent}
                                currentUserRole="director"
                                onViewDetails={handleOpenStudentDetails}
                                typeFilter={studentTypeFilter}
                                onTypeFilterChange={setStudentTypeFilter}
                                onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                            />;
                        case 'groups':
                            return <GroupsPage students={activeStudents} searchTerm={searchTerm} groups={groups} teachers={teachers} notes={notes} onViewGroupReport={handleViewGroupReport} onOpenFeeModal={handleOpenFeeModal} onAddTest={handleAddTest} onDeleteTest={handleDeleteTest} onAddNote={handleAddNote} onEdit={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchive={handleArchiveStudent} currentUserRole="director" onViewDetails={handleOpenStudentDetails} onMarkWeeklyReportSent={handleMarkWeeklyReportSent} />;
                        case 'attendance_report':
                            return <AttendanceReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        case 'tests_report':
                            return <TestsReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} />;
                        case 'financial_report':
                            return <FinancialReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        default:
                            return null;
                    }
                })()}
            </div>
        )
    }

    // ... (renderTeacherContent - No Changes)
    const renderTeacherContent = () => {
        if (isArchiveView) return renderArchiveList();
        if (viewingGroup) {
            return <GroupReportPage
                group={viewingGroup}
                students={activeStudents.filter(s => s.groupId === viewingGroup.id)}
                teacher={teachers.find(t => t.id === viewingGroup.teacherId)}
                onBack={handleBackToMain}
                currentUserRole={currentUser?.role}
            />;
        }

        return (
            <div>
                {(() => {
                    switch (activeView) {
                        case 'students':
                            return <AllStudentsPage
                                students={teacherStudents}
                                searchTerm={searchTerm}
                                notes={notes}
                                groups={visibleGroups}
                                onOpenFeeModal={handleOpenFeeModal}
                                onAddTest={handleAddTest}
                                onDeleteTest={handleDeleteTest}
                                onAddNote={handleAddNote}
                                onEdit={handleEditStudent}
                                onToggleAttendance={handleToggleAttendance}
                                onArchive={handleArchiveStudent}
                                currentUserRole="teacher"
                                onViewDetails={handleOpenStudentDetails}
                                typeFilter={studentTypeFilter}
                                onTypeFilterChange={setStudentTypeFilter}
                            />;
                        case 'groups':
                            return <GroupsPage
                                students={teacherStudents}
                                searchTerm={searchTerm}
                                groups={visibleGroups}
                                teachers={teachers}
                                notes={notes}
                                onViewGroupReport={handleViewGroupReport}
                                onOpenFeeModal={handleOpenFeeModal}
                                onAddTest={handleAddTest}
                                onDeleteTest={handleDeleteTest}
                                onAddNote={handleAddNote}
                                onEdit={handleEditStudent}
                                onToggleAttendance={handleToggleAttendance}
                                onArchive={handleArchiveStudent}
                                currentUserRole="teacher"
                                onViewDetails={handleOpenStudentDetails}
                            />;
                        case 'attendance_report':
                            return <AttendanceReportPage students={teacherStudents} groups={visibleGroups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        case 'tests_report':
                            return <TestsReportPage students={teacherStudents} groups={visibleGroups} onViewStudent={handleViewStudent} />;
                        case 'financial_report':
                            return <FinancialReportPage students={teacherStudents} groups={visibleGroups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />;
                        default:
                            return null;
                    }
                })()}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {!isOnline && (
                <div className="bg-red-500 text-white text-center p-2 font-semibold flex items-center justify-center gap-2">
                    <CloudOffIcon className="w-5 h-5" />
                    <span>أنت غير متصل بالإنترنت. سيتم حفظ التغييرات ومزامنتها عند عودة الاتصال.</span>
                </div>
            )}
            <div className="flex">
                {(currentUser.role === 'director' || currentUser.role === 'supervisor') && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        onShowGeneralView={() => openDirectorView(setIsGeneralView)}
                        onShowFinance={() => openDirectorView(setIsFinanceView)}
                        onShowFeeCollection={() => openDirectorView(setIsFeeCollectionView)}
                        onShowNotifications={() => openDirectorView(setIsDirectorNotificationsView)}
                        onShowNotes={() => openDirectorView(setIsDirectorNotesView)}
                        onShowTeacherManager={() => openDirectorView(setIsTeacherManagerView)}
                        onShowArchive={() => openDirectorView(setIsArchiveView)}
                        onShowDebtors={() => openDirectorView(setIsDebtorsView)}
                        onLogout={handleLogout}
                        currentUserRole={currentUser.role}
                    />
                )}
                <div className="flex-1 flex flex-col w-full min-w-0">
                    {renderHeader()}
                    <main className="flex-1 overflow-y-auto pb-20">
                        <ErrorBoundary>
                            {currentUser.role === 'director'
                                ? renderDirectorContent()
                                : (currentUser.role === 'supervisor' ? renderSupervisorContent() : renderTeacherContent())
                            }
                        </ErrorBoundary>
                    </main>
                    <BottomNavBar activeView={activeView} onSelectView={handleBottomNavSelect} />
                </div>
            </div>

            <StudentForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setStudentToEdit(null); }} onSave={addOrUpdateStudent} studentToEdit={studentToEdit} groups={visibleGroups} />

            <StudentDetailsModal
                isOpen={!!detailsModalState}
                onClose={handleCloseStudentDetails}
                student={detailsModalState ? students.find(s => s.id === detailsModalState.student.id) || null : null}
                initialTab={detailsModalState?.initialTab || 'attendanceLog'}
                currentUser={currentUser}
                notes={detailsModalState ? notes.filter(n => n.studentId === detailsModalState.student.id) : []}
                onOpenFeeModal={handleOpenFeeModal}
                onAddTest={handleAddTest}
                onDeleteTest={handleDeleteTest}
                onAddNote={handleAddNote}
                onSaveProgressPlan={handleSaveStudentProgressPlan}
                onUpdatePlanRecord={handleUpdatePlanRecord}
                onTogglePlanCompletion={handleTogglePlanCompletion}
                onDeletePlanRecord={handleDeletePlanRecord}
                onCancelFeePayment={handleCancelFeePayment}
            />

            {(currentUser.role === 'director' || currentUser.role === 'supervisor') && (
                <>
                    <GroupManagerModal isOpen={isGroupManagerOpen} onClose={() => setIsGroupManagerOpen(false)} groups={visibleGroups} students={students} onAddGroup={handleAddGroup} onUpdateGroup={handleUpdateGroup} onDeleteGroup={handleDeleteGroup} teachers={teachers} />
                    <TeacherManagerModal
                        isOpen={isTeacherFormOpen}
                        onClose={() => { setIsTeacherFormOpen(false); setTeacherToEdit(null); setSupervisorToEdit(null); }}
                        onSaveTeacher={handleSaveTeacher}
                        onSaveSupervisor={handleSaveSupervisor}
                        teacherToEdit={teacherToEdit}
                        supervisorToEdit={supervisorToEdit}
                    />
                    <TeacherDetailsModal
                        isOpen={!!teacherForDetails || !!supervisorForDetails}
                        onClose={handleCloseEmployeeDetails}
                        teacher={teacherForDetails}
                        supervisor={supervisorForDetails}
                        groups={visibleGroups}
                        students={activeStudents}
                        teacherAttendance={teacherAttendance}
                        teacherPayrollAdjustments={teacherPayrollAdjustments}
                        financialSettings={financialSettings}
                        onEditTeacherClick={handleEditTeacher}
                        onEditSupervisorClick={handleEditSupervisor}
                        onDeleteTeacher={handleDeleteTeacher}
                        onDeleteSupervisor={handleDeleteSupervisor}
                        onSetTeacherAttendance={handleSetTeacherAttendance}
                        onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments}
                        onLogExpense={handleLogExpense}
                        onViewTeacherReport={setViewingTeacherReportId}
                        onSendNotificationToAll={handleSendNotificationToAll}
                        teacherCollections={teacherCollections}
                        teacherManualBonuses={teacherManualBonuses}
                        currentUserRole={currentUser?.role}
                        onAddTeacherCollection={handleAddTeacherCollection}
                        onAddManualBonus={handleAddManualBonus}
                        onDeleteManualBonus={handleDeleteManualBonus}
                    />
                </>
            )}

            <FeePaymentModal isOpen={isFeeModalOpen} onClose={() => { setIsFeeModalOpen(false); setPaymentDetails(null); }} onSave={handleSaveFeePayment} paymentDetails={paymentDetails} />
            <UnarchiveModal isOpen={!!studentToUnarchiveId} onClose={() => setStudentToUnarchiveId(null)} onConfirm={handleConfirmUnarchive} groups={groupsForUnarchiveModal} studentName={students.find(s => s.id === studentToUnarchiveId)?.name || ''} />
            {studentToArchive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">رسالة تأكيد للأرشفة</h2>
                        <p className="text-gray-600 mb-6">هل أنت متأكد من رغبتك في نقل الطالب "{studentToArchive.name}" إلى الأرشيف؟</p>
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <button type="button" onClick={() => setStudentToArchive(null)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
                            <button type="button" onClick={confirmArchiveStudent} className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors order-1 sm:order-2">نعم، أرشفة</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (LocalLoginScreen remains unchanged)
const LocalLoginScreen: React.FC<{ onLogin: (user: CurrentUser) => void, teachers: Teacher[], supervisors: Supervisor[] }> = ({ onLogin, teachers, supervisors }) => {
    const [loginType, setLoginType] = useState<'director' | 'supervisor' | 'teacher'>('director');

    const [directorPassword, setDirectorPassword] = useState('');

    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');

    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [supervisorPassword, setSupervisorPassword] = useState('');

    const activeTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);
    const DIRECTOR_PASSWORD = 'admin123';

    const handleDirectorLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (directorPassword === DIRECTOR_PASSWORD) {
            onLogin({ role: 'director' });
        } else {
            alert('كلمة مرور المدير غير صحيحة.');
            setDirectorPassword('');
        }
    };
    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const teacher = teachers.find(t => t.id === selectedTeacherId);
        if (teacher && teacher.password === teacherPassword) {
            onLogin({ role: 'teacher', id: teacher.id, name: teacher.name });
        } else {
            alert('كلمة مرور المدرس غير صحيحة أو لم يتم اختيار مدرس.');
            setTeacherPassword('');
        }
    };

    const handleSupervisorLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const supervisor = supervisors.find(s => s.id === selectedSupervisorId);
        if (supervisor && supervisor.password === supervisorPassword) {
            // Ensure backward compatibility or correct typing for array
            const sections = Array.isArray(supervisor.section) ? supervisor.section : (supervisor.section ? [supervisor.section] : []);
            onLogin({ role: 'supervisor', id: supervisor.id, name: supervisor.name, section: sections as GroupType[] });
        } else {
            alert('كلمة مرور المشرف غير صحيحة أو لم يتم اختيار مشرف.');
            setSupervisorPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">مركز الشاطبي</h1>

                <div className="flex justify-center mb-6 bg-white p-1 rounded-lg shadow-sm">
                    <button onClick={() => setLoginType('director')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${loginType === 'director' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>المدير</button>
                    <button onClick={() => setLoginType('supervisor')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${loginType === 'supervisor' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>المشرف</button>
                    <button onClick={() => setLoginType('teacher')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${loginType === 'teacher' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>المدرس</button>
                </div>

                <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-6">
                    {loginType === 'director' && (
                        <form onSubmit={handleDirectorLogin}>
                            <div className="flex items-center justify-center mb-6"> <BriefcaseIcon className="w-12 h-12 text-blue-600" /> </div>
                            <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">تسجيل دخول المدير</h2>
                            <p className="text-center text-gray-500 mb-6">وصول كامل لجميع البيانات والصلاحيات.</p>
                            <div className="mb-4"> <input id="director-password" type="password" value={directorPassword} onChange={(e) => setDirectorPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" required /> </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-px"> الدخول كمدير </button>
                        </form>
                    )}

                    {loginType === 'supervisor' && (
                        <form onSubmit={handleSupervisorLogin}>
                            <div className="flex items-center justify-center mb-6"> <UserIcon className="w-12 h-12 text-blue-600" /> </div>
                            <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">تسجيل دخول المشرف</h2>
                            <p className="text-center text-gray-500 mb-6">إشراف علمي ومالي على الأقسام المحددة.</p>
                            <div className="mb-4">
                                <select value={selectedSupervisorId} onChange={(e) => setSelectedSupervisorId(e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" required>
                                    <option value="" disabled>-- اختر اسمك --</option>
                                    {supervisors.map(s => {
                                        const sectionDisplay = Array.isArray(s.section) ? s.section.join('، ') : s.section;
                                        return <option key={s.id} value={s.id}>{s.name} - ({sectionDisplay})</option>
                                    })}
                                </select>
                            </div>
                            <div className="mb-4"> <input id="supervisor-password" type="password" value={supervisorPassword} onChange={(e) => setSupervisorPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" required disabled={!selectedSupervisorId} /> </div>
                            <button type="submit" disabled={!selectedSupervisorId} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed"> الدخول كمشرف </button>
                        </form>
                    )}

                    {loginType === 'teacher' && (
                        <>
                            <div className="flex items-center justify-center mb-6"> <UserIcon className="w-12 h-12 text-teal-600" /> </div>
                            <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">تسجيل دخول المدرس</h2>
                            <p className="text-center text-gray-500 mb-6">وصول للمجموعات والطلاب المسؤول عنهم فقط.</p>
                            {activeTeachers.length > 0 ? (
                                <form onSubmit={handleTeacherLogin}>
                                    <div className="mb-4">
                                        <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-center" required>
                                            <option value="" disabled>-- اختر اسمك --</option>
                                            {activeTeachers.map(teacher => (<option key={teacher.id} value={teacher.id}>{teacher.name}</option>))}
                                        </select>
                                    </div>
                                    <div className="mb-4"> <input id="teacher-password" type="password" value={teacherPassword} onChange={(e) => setTeacherPassword(e.target.value)} placeholder="كلمة المرور" className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 text-center" required disabled={!selectedTeacherId} /> </div>
                                    <button type="submit" disabled={!selectedTeacherId} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed"> الدخول كمدرس </button>
                                </form>
                            ) : (<p className="text-center text-gray-500 p-4 bg-gray-100 rounded-lg">لا يوجد مدرسون نشطون حالياً.</p>)}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
