
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import type { Student, AttendanceStatus, TestRecord, Group, FeePayment, Teacher, CurrentUser, Staff, Expense, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings, Note, WeeklySchedule, TeacherCollectionRecord, Notification, DirectorNotification, ProgressPlan, ProgressPlanRecord, GroupType, Supervisor, TeacherManualBonus, Donation, Parent, UserRole } from './types';
import { ExpenseCategory, TeacherAttendanceStatus, DayOfWeek, TestType as TestTypeEnum, DirectorNotificationType } from './types';
import { getCairoNow, getCairoDateString, getYesterdayDateString, getCairoTimeInMinutes, isCairoAfterMidnight, isCairoAfter12_05, getCairoDayOfWeek, isCairoWorkday } from './services/cairoTimeHelper';

// --- Lazy Load Pages and Modals for Performance ---
const StudentCard = lazy(() => import('./components/StudentCard'));
const StudentForm = lazy(() => import('./components/StudentForm'));
const GroupManagerModal = lazy(() => import('./components/GroupManagerModal'));
const FeePaymentModal = lazy(() => import('./components/FeePaymentModal'));
const TeacherManagerModal = lazy(() => import('./components/TeacherManagerModal'));
const TeacherManagerPage = lazy(() => import('./components/TeacherManagerPage'));
const GroupReportPage = lazy(() => import('./components/GroupReportPage'));
const TeacherReportPage = lazy(() => import('./components/TeacherReportPage'));
const DirectorReportsPage = lazy(() => import('./components/DirectorReportsPage'));
const DirectorNotesPage = lazy(() => import('./components/DirectorNotesPage'));
const GroupStudentsPage = lazy(() => import('./components/GroupStudentsPage'));
const StudentDetailsPage = lazy(() => import('./components/StudentDetailsPage'));
const TeacherDetailsPage = lazy(() => import('./components/TeacherDetailsPage'));
const FinancePage = lazy(() => import('./components/FinancePage'));
const ChatPage = lazy(() => import('./components/ChatPage'));
const GeneralViewPage = lazy(() => import('./components/GeneralViewPage'));
const FeeCollectionPage = lazy(() => import('./components/FeeCollectionPage'));
const DirectorNotificationsPage = lazy(() => import('./components/DirectorNotificationsPage'));
const UnpaidStudentsPage = lazy(() => import('./components/UnpaidStudentsPage'));
const AllStudentsPage = lazy(() => import('./components/AllStudentsPage'));
const PendingStudents = lazy(() => import('./components/PendingStudents'));
const GroupsPage = lazy(() => import('./components/GroupsPage'));
const AttendanceReportPage = lazy(() => import('./components/AttendanceReportPage'));
const TestsReportPage = lazy(() => import('./components/TestsReportPage'));
const FinancialReportPage = lazy(() => import('./components/FinancialReportPage'));
const DebtorsPage = lazy(() => import('./components/DebtorsPage'));
const UnarchiveModal = lazy(() => import('./components/UnarchiveModal'));

const ParentDashboard = lazy(() => import('./components/ParentDashboard'));
const ParentView = lazy(() => import('./components/ParentView'));
const ArchivePage = lazy(() => import('./components/ArchivePage'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const LandingPageContentManager = lazy(() => import('./components/LandingPageContentManager'));

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
import HomeIcon from './components/icons/HomeIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowRightIcon from './components/icons/ArrowRightIcon';
import ArchiveIcon from './components/icons/ArchiveIcon';
import UserPlusIcon from './components/icons/UserPlusIcon';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createParentAccountIfNeeded } from './services/parentHelpers';
import { db } from './services/firebase';
import { applyDeductions } from './services/deductionService';
import { generateAllParents } from './services/parentGenerationService';
const LoginScreen = lazy(() => import('./components/LoginScreen'));
// Pre-load critical components
const preloadComponents = () => {
    const components = [
        () => import('./components/LoginScreen'),
        () => import('./components/LandingPage'),
        () => import('./components/AllStudentsPage'),
    ];
    components.forEach(c => c());
};
preloadComponents();
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc, writeBatch, query, where, getDocs, arrayUnion, setDoc, deleteField, orderBy, limit, documentId } from 'firebase/firestore';
import UsersIcon from './components/icons/UsersIcon';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAutomationChecks } from './hooks/useAutomationChecks';
import CloudOffIcon from './components/icons/CloudOffIcon';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { requestNotificationPermission, playNotificationSound, showLocalNotification, setAppBadge, registerFCMToken, setupOnMessageListener } from './services/notificationService';
import { HeaderSkeleton, SidebarSkeleton, ListSkeleton } from './components/Skeleton';
import FilterIcon from './components/icons/FilterIcon';
import { getGroupTypeFromName, filterSupervisorData, filterTeacherStudents, getVisibleGroups, getFilteredStudents } from './services/dataService';

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
    const navigate = useNavigate();
    const location = useLocation();
    // --- Data from Firestore ---
    // --- Data from Firestore with Local Caching for Instant Load ---
    const [activeStudentsRaw, setActiveStudentsRaw] = useState<Student[]>([]);
    const [archivedStudentsRaw, setArchivedStudentsRaw] = useState<Student[]>([]);
    const students = useMemo(() => [...activeStudentsRaw, ...archivedStudentsRaw], [activeStudentsRaw, archivedStudentsRaw]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

    const activeTeachers = useMemo(() => teachers.filter(t => t.status === TeacherStatus.ACTIVE), [teachers]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [directorNotifications, setDirectorNotifications] = useState<DirectorNotification[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInitialUserId, setChatInitialUserId] = useState<string | undefined>(undefined);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);


    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>([]);
    const [teacherPayrollAdjustments, setTeacherPayrollAdjustments] = useState<TeacherPayrollAdjustment[]>([]);
    const [teacherCollections, setTeacherCollections] = useState<TeacherCollectionRecord[]>([]);
    const [teacherManualBonuses, setTeacherManualBonuses] = useState<TeacherManualBonus[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [financialSettings, setFinancialSettings] = useState<FinancialSettings>({ workingDaysPerMonth: 22, absenceDeductionPercentage: 100 });

    // --- Loading State ---
    const [isDataLoading, setIsDataLoading] = useState(true);




    // --- Error State ---
    const [permissionError, setPermissionError] = useState(false);

    // --- Local UI State & Session ---
    const [currentUser, setCurrentUser] = useLocalStorage<CurrentUser | null>('shatibi-center-currentUser', null);

    // --- Parent UI States ---



    // Listener for unread messages and notifications
    useEffect(() => {
        if (!currentUser) {
            setAppBadge(0);
            return;
        }
        const myId = currentUser.role === 'director' ? 'director' : currentUser.id;

        if (!myId) return; // Prevent crash if ID is missing

        // Request notification permission and register FCM token
        registerFCMToken(myId);

        // Setup listener for foreground messages (FCM)
        const unsubscribeFCM = setupOnMessageListener();

        const q = query(
            collection(db, 'messages'),
            where('receiverId', '==', myId)
        );

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const allMessages = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
            const unreadMessages = allMessages.filter((m: any) => !m.read);
            const count = unreadMessages.length;
            setUnreadMessagesCount(count);
            setAppBadge(count);

            // Trigger notification for each NEW incoming unread message
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const msg = change.doc.data();
                    const msgTime = msg.timestamp?.toMillis ? msg.timestamp.toMillis() : Date.now();

                    // Only notify for messages sent in the last 1 minute to avoid spamming old unread messages on load
                    if (Date.now() - msgTime < 60000) {
                        playNotificationSound(true); // Pass true because it's a chat message
                        showLocalNotification(
                            `رسالة جديدة من ${msg.senderName}`,
                            msg.content
                        );
                    }
                }
            });
        });

        return () => {
            unsubscribeMessages();
            if (typeof unsubscribeFCM === 'function') unsubscribeFCM();
            setAppBadge(0);
        };
    }, [currentUser]);
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

    // Landing Page Content Manager State
    const [isLandingPageContentOpen, setIsLandingPageContentOpen] = useState(false);
    const [parentViewingLandingPage, setParentViewingLandingPage] = useState(false);
    const [teacherViewingLandingPage, setTeacherViewingLandingPage] = useState(false);

    // View State
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const [viewingGroupStudents, setViewingGroupStudents] = useState<Group | null>(null);
    const [viewingTeacherReportId, setViewingTeacherReportId] = useState<string | null>(null);

    const [isTeacherFilterVisible, setIsTeacherFilterVisible] = useState(false);

    // Filter State for Student View (Lifted up)
    const [studentTypeFilter, setStudentTypeFilter] = useState<GroupType>('all');


    // --- 1. Public Data Listeners (Always active for Login) ---
    useEffect(() => {
        const publicCollections: { name: string, setter: React.Dispatch<any>, cacheKey: string }[] = [
            { name: 'teachers', setter: setTeachers, cacheKey: 'shatibi_cache_teachers' },
            { name: 'supervisors', setter: setSupervisors, cacheKey: 'shatibi_cache_supervisors' },
            { name: 'parents', setter: setParents, cacheKey: 'shatibi_cache_parents' },
        ];

        const unsubscribers = publicCollections.map(({ name, setter, cacheKey }) =>
            onSnapshot(collection(db, name), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setter(data);
            }, (error) => {
                console.error(`Error fetching public ${name}:`, error.message);
            })
        );

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    // --- 2. Protected Data Listeners (Only after Login) ---
    useEffect(() => {
        if (!currentUser) {
            setActiveStudentsRaw([]);
            setArchivedStudentsRaw([]);
            setGroups([]);
            setNotes([]);
            setStaff([]);
            setExpenses([]);
            setTeacherAttendance([]);
            setTeacherPayrollAdjustments([]);
            setTeacherCollections([]);
            setTeacherManualBonuses([]);
            setDonations([]);
            ['shatibi_cache_students_active', 'shatibi_cache_groups', 'shatibi_cache_teachers', 'shatibi_cache_supervisors', 'shatibi_cache_parents'].forEach(k => localStorage.removeItem(k));
            return;
        }

        const unsubscribers: (() => void)[] = [];

        // 2a. Groups Listener (Role Scoped)
        let groupsQuery = query(collection(db, 'groups'));
        if (currentUser.role === 'teacher') {
            groupsQuery = query(collection(db, 'groups'), where('teacherId', '==', currentUser.id));
        } else if (currentUser.role === 'parent') {
            // Parents don't really need all groups, maybe only those their children are in
            // But for now, we'll keep it simple to not break ParentView
        }
        const unsubGroups = onSnapshot(groupsQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Group));
            setGroups(data);
        });
        unsubscribers.push(unsubGroups);

        // 2b. Active Students (Role Scoped + Fragmented)
        const fetchStudents = () => {
            let activeStudentsQuery = query(collection(db, 'students'), where('isArchived', '==', false));

            if (currentUser.role === 'parent') {
                // Use the latest studentIds from the live parents state if available
                const liveParent = parents.find(p => p.id === (currentUser as any).id);
                const studentIds = liveParent ? liveParent.studentIds : (currentUser as any).studentIds;

                if (studentIds && studentIds.length > 0) {
                    activeStudentsQuery = query(collection(db, 'students'), where(documentId(), 'in', studentIds.slice(0, 30)));
                } else {
                    setActiveStudentsRaw([]);
                    return () => { };
                }
            } else if (currentUser.role === 'teacher') {
                // If they have groups, we could scope by groupId. 
                // However, teachers usually have < 10 groups, so if we have them we can use them.
                // For now, to keep it robust against group changes, we use the active filter.
            }

            return onSnapshot(activeStudentsQuery, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Student));
                setActiveStudentsRaw(data);
                setIsDataLoading(false);
            });
        };
        const unsubActiveStudents = fetchStudents();
        unsubscribers.push(unsubActiveStudents);

        // 2c. Other Collections (Role Scoped for Teachers)
        const essentialCollections = [
            { name: 'notes', setter: setNotes },
        ];

        essentialCollections.forEach(({ name, setter }) => {
            const unsub = onSnapshot(query(collection(db, name)), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
                setter(data);
            });
            unsubscribers.push(unsub);
        });

        // Add teacherAttendance for Director (needed for automation checks)
        if (currentUser.role === 'director' || currentUser.role === 'supervisor') {
            const unsub = onSnapshot(query(collection(db, 'teacherAttendance')), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
                setTeacherAttendance(data);
            });
            unsubscribers.push(unsub);
        } else if (currentUser.role === 'teacher') {
            const unsub = onSnapshot(query(collection(db, 'teacherAttendance'), where('teacherId', '==', currentUser.id)), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
                setTeacherAttendance(data);
            });
            unsubscribers.push(unsub);
        }

        // Settings
        const settingsDocRef = doc(db, 'settings', 'financial');
        const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
            if (docSnap.exists()) setFinancialSettings(docSnap.data() as FinancialSettings);
        });
        unsubscribers.push(unsubSettings);

        return () => unsubscribers.forEach(unsub => unsub());
    }, [currentUser]);

    // 2e. Defer heavy finance listeners to only run when on relevant pages
    useEffect(() => {
        if (!currentUser) return;

        const isFinanceRelatedPage = ['/finance', '/director-reports', '/financial-report', '/teacher-manager', '/general-view', '/fee-collection'].includes(location.pathname);
        if (!isFinanceRelatedPage) {
            // We don't clear the state here to avoid flickering, but we don't start new listeners
            return;
        }

        const unsubscribers: (() => void)[] = [];
        const financeCollections = [
            { name: 'staff', setter: setStaff, directorOnly: true },
            { name: 'expenses', setter: setExpenses, directorOnly: true },
            { name: 'teacherPayrollAdjustments', setter: setTeacherPayrollAdjustments },
            { name: 'teacherCollections', setter: setTeacherCollections },
            { name: 'teacherManualBonuses', setter: setTeacherManualBonuses },
            { name: 'donations', setter: setDonations, directorOnly: true },
        ];

        financeCollections.forEach(({ name, setter, directorOnly }) => {
            if (directorOnly && currentUser.role !== 'director' && currentUser.role !== 'supervisor') return;

            let q = query(collection(db, name));
            if (currentUser.role === 'teacher') {
                q = query(collection(db, name), where('teacherId', '==', currentUser.id));
            }

            const unsub = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
                setter(data);
            });
            unsubscribers.push(unsub);
        });

        return () => unsubscribers.forEach(unsub => unsub());
    }, [currentUser, location.pathname]);

    // 2d. Fragmented Snapshot for Archived Students (Lazy Loaded)
    useEffect(() => {
        if (!currentUser) {
            setArchivedStudentsRaw([]);
            return;
        }

        // Load archived students for pages that need them for financial calculations or reporting
        const relevantPages = ['/archive', '/finance', '/teacher-manager', '/director-reports', '/financial-report', '/fee-collection', '/debtors', '/general-view', '/teacher-report', '/staff-details'];
        const isNeeded = relevantPages.includes(location.pathname) ||
            currentUser.role === 'director' ||
            currentUser.role === 'supervisor' ||
            !!viewingTeacherReportId;

        if (!isNeeded) {
            setArchivedStudentsRaw([]);
            return;
        }

        console.log("Loading archived students snapshot...");
        const archivedQuery = query(collection(db, 'students'), where('isArchived', '==', true));
        const unsub = onSnapshot(archivedQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Student));
            setArchivedStudentsRaw(data);
        });

        return () => unsub();
    }, [currentUser, location.pathname, viewingTeacherReportId]);

    // Optimized Notifications Fetching (Last 30 Days)
    useEffect(() => {
        if (!currentUser) {
            setNotifications([]);
            return;
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dateString = thirtyDaysAgo.toISOString();

        // Temporarily simplifying query to debug stack overflow
        const q = query(
            collection(db, 'notifications'),
            where('date', '>=', dateString)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Safely sort in memory to avoid Firestore index issues for now
            const sortedData = (data as any).sort((a: any, b: any) => b.date.localeCompare(a.date));
            setNotifications(sortedData);
        }, (error) => {
            console.error("Error fetching notifications:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Optimized Director Notifications Fetching (Last 60 Days)
    useEffect(() => {
        if (!currentUser) {
            setDirectorNotifications([]);
            return;
        }

        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const dateString = sixtyDaysAgo.toISOString();

        // Temporarily simplifying query to debug stack overflow
        const q = query(
            collection(db, 'directorNotifications'),
            where('date', '>=', dateString)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Safely sort in memory
            const sortedData = (data as any).sort((a: any, b: any) => b.date.localeCompare(a.date));
            setDirectorNotifications(sortedData);
        }, (error) => {
            console.error("Error fetching directorNotifications:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // --- Automatic Missing Reports Check (Extracted to Hook) ---
    useAutomationChecks({
        currentUser,
        students,
        teachers,
        groups,
        financialSettings,
        teacherAttendance
    });

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

    const activeStudents = useMemo(() => students.filter(s => !s.isArchived && !s.isPending), [students]);
    const archivedStudents = useMemo(() => students.filter(s => s.isArchived), [students]);

    // FILTER LOGIC FOR SUPERVISOR
    // FILTER LOGIC FOR SUPERVISOR
    const supervisorFilteredData = useMemo(() =>
        filterSupervisorData(currentUser, students, groups, teachers, expenses, teacherCollections, teacherAttendance, teacherPayrollAdjustments),
        [currentUser, groups, students, teachers, expenses, teacherCollections, teacherAttendance, teacherPayrollAdjustments]);


    const visibleGroups = useMemo(() =>
        getVisibleGroups(currentUser, groups, supervisorFilteredData?.groups),
        [groups, currentUser, supervisorFilteredData]);

    const teacherStudents = useMemo(() =>
        filterTeacherStudents(currentUser, students, groups),
        [currentUser, groups, students]);

    const groupsForUnarchiveModal = useMemo(() => {
        if (currentUser?.role === 'director') return groups;
        if (currentUser?.role === 'supervisor') return supervisorFilteredData?.groups || [];
        if (currentUser?.role === 'teacher') return groups.filter(g => g.teacherId === currentUser.id);
        return [];
    }, [groups, currentUser, supervisorFilteredData]);

    // Helper to get student count based on current filter
    const getFilteredStudentCount = () => {
        return getFilteredStudents(currentUser, activeStudents, teacherStudents.students, supervisorFilteredData?.students, studentTypeFilter, groups).length;
    };

    // ... (Event Handlers) ...
    const handleBackToMain = useCallback(() => {
        setViewingGroup(null);
        setViewingGroupStudents(null);
        setViewingTeacherReportId(null);
        setDetailsModalState(null);
        setTeacherForDetails(null);
        setSupervisorForDetails(null);
        setIsFormOpen(false);
        setIsTeacherFormOpen(false);
        setIsGroupManagerOpen(false);
        setIsSidebarOpen(false);
        setIsSearchVisible(false);
        setSearchTerm('');
        navigate('/students');
    }, [navigate]);

    const handleOpenStudentDetails = useCallback((student: Student, initialTab: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports' = 'attendanceLog') => {
        setDetailsModalState({ student, initialTab });
        navigate('/student-details');
    }, [navigate]);

    const handleCloseStudentDetails = useCallback(() => {
        setDetailsModalState(null);
    }, []);

    const handleOpenTeacherDetails = useCallback((teacher: Teacher) => {
        setTeacherForDetails(teacher);
        setSupervisorForDetails(null);
        navigate('/staff-details');
    }, [navigate]);

    const handleOpenSupervisorDetails = useCallback((supervisor: Supervisor) => {
        setSupervisorForDetails(supervisor);
        setTeacherForDetails(null);
        navigate('/staff-details');
    }, [navigate]);

    const handleCloseEmployeeDetails = useCallback(() => {
        setTeacherForDetails(null);
        setSupervisorForDetails(null);
    }, []);

    const handleLogin = useCallback((user: CurrentUser) => {
        handleBackToMain();
        setStudentToEdit(null);
        setTeacherToEdit(null);
        setSupervisorToEdit(null);
        setIsFormOpen(false);
        setIsTeacherFormOpen(false);
        setIsGroupManagerOpen(false);
        setIsSidebarOpen(false);
        setIsChatOpen(false);

        setCurrentUser(user);
    }, [handleBackToMain, setCurrentUser]);

    // تسجيل دخول ولي الأمر


    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        navigate('/');
    }, [navigate, setCurrentUser]);

    // Effect to sync parent currentUser with live parents data
    useEffect(() => {
        if (currentUser?.role === 'parent') {
            const liveParent = parents.find(p => p.id === (currentUser as any).id);
            if (liveParent) {
                // Only update if studentIds have changed to avoid loops
                if (JSON.stringify(liveParent.studentIds) !== JSON.stringify((currentUser as any).studentIds)) {
                    setCurrentUser({
                        ...currentUser,
                        studentIds: liveParent.studentIds,
                        name: liveParent.name
                    } as any);
                }
            }
        }
    }, [parents, (currentUser as any)?.id]);

    const handleOpenMenu = useCallback(() => {
        setIsSidebarOpen(true);
        if (isSearchVisible) {
            setIsSearchVisible(false);
            setSearchTerm('');
        }
    }, [isSearchVisible]);

    const toggleSearch = useCallback(() => {
        const newVisibility = !isSearchVisible;
        setIsSearchVisible(newVisibility);
        if (!newVisibility) { setSearchTerm(''); }
    }, [isSearchVisible]);

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
                const docRef = await addDoc(collection(db, 'students'), sanitizedData);

                // إنشاء حساب ولي أمر تلقائياً إذا كان رقم الهاتف صالحاً
                if (studentData.phone) {
                    await createParentAccountIfNeeded(studentData.phone, studentData.name, docRef.id, parents);
                }

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

        // تحديث حساب ولي الأمر عند التعديل
        if (studentId && studentData.phone) {
            await createParentAccountIfNeeded(studentData.phone, studentData.name, studentId, parents);
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
                approvalDate: getCairoDateString()
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
                            date: getCairoNow().toISOString(),
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
                tests: arrayUnion({ id: crypto.randomUUID(), date: getCairoDateString(), ...testData })
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
                date: getCairoNow().toISOString(),
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
            await updateDoc(studentRef, { lastWeeklyReportDate: getCairoNow().toISOString() });
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
                archiveDate: getCairoDateString(),
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
                paymentDate: getCairoNow().toISOString(),
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
                paymentDate: getCairoNow().toISOString(),
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
    const handleLogExpense = async (expense: Omit<Expense, 'id'>) => { await addDoc(collection(db, 'expenses'), expense); }; // Handler for logging expenses

    const handleAddDonation = async (donation: Omit<Donation, 'id'>) => {
        try {
            await addDoc(collection(db, 'donations'), donation);
            // alert("تم حفظ التبرع بنجاح"); // Optional: Feedback to user
        } catch (error) {
            console.error("Error adding donation: ", error);
            alert(`حدث خطأ أثناء حفظ التبرع: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleDeleteDonation = async (donationId: string) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا التبرع؟")) return;
        try {
            await deleteDoc(doc(db, 'donations', donationId));
        } catch (error) {
            console.error("Error deleting donation: ", error);
            alert("حدث خطأ أثناء حذف التبرع.");
        }
    };



    const handleDeleteExpense = useCallback(async (expenseId: string) => {
        try {
            await deleteDoc(doc(db, 'expenses', expenseId));
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("حدث خطأ أثناء حذف المصروف.");
        }
    }, []);

    const handleDeleteTeacherAttendance = async (recordId: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
        try {
            // ✅ تحويل الخصم إلى "معذور" بدلاً من حذفه نهائياً
            await updateDoc(doc(db, "teacherAttendance", recordId), {
                status: TeacherAttendanceStatus.EXCUSED,
                reason: 'تم الإعفاء من قبل المدير'
            });
            console.log(`✅ تم تحويل السجل ${recordId} إلى EXCUSED`);
        } catch (error) {
            console.error("Error updating teacher attendance:", error);
        }
    };

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

    const handleAddManualBonus = useCallback(async (bonusData: Omit<TeacherManualBonus, 'id'>) => {
        try {
            const docRef = await addDoc(collection(db, 'teacherManualBonuses'), bonusData);

            // إشعار عام للجميع (مدرسين ومديرين)
            const teacher = teachers.find(t => t.id === bonusData.teacherId);
            const content = `🎉 خبر سار: حصل المدرس/ة ${teacher?.name || '...'} على مكافأة تشجيعية تقديراً لجهوده المتميزة. بارك الله في عملكم جميعاً.`;

            await addDoc(collection(db, "notifications"), {
                date: getCairoNow().toISOString(),
                content,
                senderName: 'المدير',
                recipientId: 'all', // سيراه جميع المدرسين في الجرس
                readBy: []
            });

            // إشعار في سجل المدير
            await addDoc(collection(db, "directorNotifications"), {
                date: getCairoNow().toISOString(),
                forDate: bonusData.date,
                content: `✅ تم إضافة مكافأة يدوية للمدرس ${teacher?.name} بمبلغ ${bonusData.amount} جنيه.`,
                isRead: false,
                type: 'teacher_manual_bonus',
                teacherId: bonusData.teacherId,
                teacherName: teacher?.name || ''
            });

        } catch (error) {
            console.error("Error adding manual bonus:", error);
            alert("حدث خطأ أثناء إضافة المكافأة.");
        }
    }, [teachers]);

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

    // --- Back Button Handling ---
    const handleBackButton = useCallback(() => {
        // Priority 1: Modals
        if (studentToArchive) { setStudentToArchive(null); return true; }
        if (studentToUnarchiveId) { setStudentToUnarchiveId(null); return true; }
        if (isFeeModalOpen) { setIsFeeModalOpen(false); setPaymentDetails(null); return true; }
        if (isTeacherFormOpen) { setIsTeacherFormOpen(false); setTeacherToEdit(null); setSupervisorToEdit(null); return true; }
        if (isGroupManagerOpen) { setIsGroupManagerOpen(false); return true; }
        if (detailsModalState) { setDetailsModalState(null); return true; }
        if (teacherForDetails || supervisorForDetails) { setTeacherForDetails(null); setSupervisorForDetails(null); return true; }
        if (isFormOpen) { setIsFormOpen(false); setStudentToEdit(null); return true; }
        if (isSidebarOpen) { setIsSidebarOpen(false); return true; }
        if (isSearchVisible) { setIsSearchVisible(false); setSearchTerm(''); return true; }

        // Priority 2: Sub-Views (Drill down)
        if (viewingTeacherReportId) { setViewingTeacherReportId(null); return true; }
        if (viewingGroup) { setViewingGroup(null); return true; }
        if (viewingGroupStudents) { setViewingGroupStudents(null); return true; }

        // Priority 3: Routing
        const mainTabs = ['/students', '/groups', '/attendance_report', '/tests_report', '/financial_report'];
        if (!mainTabs.includes(location.pathname)) {
            navigate('/students');
            return true;
        }

        return false;
    }, [navigate, location.pathname, studentToArchive, studentToUnarchiveId, isFeeModalOpen, isTeacherFormOpen, isGroupManagerOpen, detailsModalState, teacherForDetails, supervisorForDetails, isFormOpen, isSidebarOpen, isSearchVisible, viewingTeacherReportId, viewingGroup, viewingGroupStudents]);

    useEffect(() => {
        const isOverlayOpen =
            studentToArchive !== null || studentToUnarchiveId !== null || isFeeModalOpen ||
            teacherForDetails !== null || supervisorForDetails !== null || isTeacherFormOpen ||
            isGroupManagerOpen || detailsModalState !== null || isFormOpen || isSidebarOpen || isSearchVisible ||
            viewingTeacherReportId !== null || viewingGroup !== null || viewingGroupStudents !== null;

        if (isOverlayOpen) {
            if (!window.history.state?.pushed) {
                window.history.pushState({ pushed: true }, '');
            }
        }
    }, [studentToArchive, studentToUnarchiveId, isFeeModalOpen, teacherForDetails, supervisorForDetails, isTeacherFormOpen, isGroupManagerOpen, detailsModalState, isFormOpen, isSidebarOpen, isSearchVisible, viewingTeacherReportId, viewingGroup, viewingGroupStudents]);

    useEffect(() => {
        const onPopState = () => {
            handleBackButton();
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [handleBackButton]);

    // Sync detailsModalState with significant changes in students data
    useEffect(() => {
        if (detailsModalState) {
            const updatedStudent = students.find(s => s.id === detailsModalState.student.id);
            if (updatedStudent && updatedStudent !== detailsModalState.student) {
                setDetailsModalState(prev => prev ? { ...prev, student: updatedStudent } : null);
            }
        }
    }, [students, detailsModalState]);



    const handleUpdateFinancialSettings = async (settings: FinancialSettings) => { await setDoc(doc(db, 'settings', 'financial'), settings); };

    // ✅ دالة ذكية لإضافة إجازة وتنظيف الخصومات تلقائياً
    const handleAddHoliday = async (dateStr: string) => {
        if (!dateStr) return;
        const currentHolidays = financialSettings.publicHolidays || [];
        if (currentHolidays.includes(dateStr)) return;

        try {
            const batch = writeBatch(db);

            // 1. تحديث قائمة الإجازات
            const newSettings = {
                ...financialSettings,
                publicHolidays: [...currentHolidays, dateStr]
            };
            batch.set(doc(db, 'settings', 'financial'), newSettings);

            // 2. البحث عن وحذف جميع الخصومات في هذا اليوم
            const recordsToDelete = teacherAttendance.filter(r => r.date === dateStr);
            recordsToDelete.forEach(r => {
                batch.delete(doc(db, 'teacherAttendance', r.id));
            });

            // 3. البحث عن وحذف جميع الإشعارات في هذا اليوم
            const notificationsToDelete = directorNotifications.filter(n => n.forDate === dateStr);
            notificationsToDelete.forEach(n => {
                batch.delete(doc(db, 'directorNotifications', n.id));
            });

            await batch.commit();
            console.log(`✅ Holiday added: ${dateStr}. Deleted ${recordsToDelete.length} records and ${notificationsToDelete.length} notifications.`);
            alert(`تم إضافة الإجازة بنجاح، وتم حذف ${recordsToDelete.length} خصم و ${notificationsToDelete.length} إشعار متعلقين بهذا اليوم.`);

        } catch (error) {
            console.error("Error adding holiday:", error);
            alert("حدث خطأ أثناء إضافة الإجازة");
        }
    };

    // ... (Notification Handlers) ...
    const handleSendNotification = useCallback(async (target: Notification['target'], content: string) => {
        await addDoc(collection(db, "notifications"), { date: getCairoNow().toISOString(), content, senderName: 'المدير', target, readBy: [] });
    }, []);

    const handleSendNotificationToTeacher = useCallback(async (teacherId: string, content: string) => {
        const sender = currentUser?.role === 'director' ? 'المدير' : (currentUser?.role === 'supervisor' ? 'المشرف' : 'الإدارة');
        await addDoc(collection(db, "notifications"), {
            date: getCairoNow().toISOString(),
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
                date: getCairoNow().toISOString(),
                content,
                senderName: sender,
                target: { type: 'teacher', id: teacher.id },
                readBy: []
            });
        });

        targetGroups.forEach(group => {
            const notificationRef = doc(collection(db, "notifications"));
            batch.set(notificationRef, {
                date: getCairoNow().toISOString(),
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


    const handleViewGroupReport = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            setViewingGroup(group);
            navigate('/group-report');
        }
    };

    const handleViewGroupStudents = (group: Group) => {
        setViewingGroupStudents(group);
        navigate('/group-students');
    };

    const handleViewTeacherReport = (id: string) => {
        setViewingTeacherReportId(id);
        navigate('/teacher-report');
    };


    const handleViewStudent = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            handleBackToMain();
            setSearchTerm(student.name);
            navigate('/students');
        }
    };

    const handleBottomNavSelect = (view: ActiveView) => {
        handleBackToMain();
        navigate('/' + view);
    };

    // Sync activeView with path
    const activeView = useMemo<ActiveView>(() => {
        const path = location.pathname;
        if (path === '/groups') return 'groups';
        if (path === '/attendance_report') return 'attendance_report';
        if (path === '/tests_report') return 'tests_report';
        if (path === '/financial_report') return 'financial_report';
        return 'students';
    }, [location.pathname]);


    // ... (Error Handling & Login - No Changes) ...

    // Global Key Listener for Modals (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (studentToArchive) { setStudentToArchive(null); return; }
                if (studentToUnarchiveId) { setStudentToUnarchiveId(null); return; }
                if (isFeeModalOpen) { setIsFeeModalOpen(false); setPaymentDetails(null); return; }
                if (teacherForDetails || supervisorForDetails) { setTeacherForDetails(null); setSupervisorForDetails(null); return; }
                if (isTeacherFormOpen) { setIsTeacherFormOpen(false); setTeacherToEdit(null); setSupervisorToEdit(null); return; }
                if (isGroupManagerOpen) { setIsGroupManagerOpen(false); return; }
                if (detailsModalState) { setDetailsModalState(null); return; }
                if (isFormOpen) { setIsFormOpen(false); setStudentToEdit(null); return; }
                if (isSidebarOpen) { setIsSidebarOpen(false); return; }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [studentToArchive, studentToUnarchiveId, isFeeModalOpen, teacherForDetails, supervisorForDetails, isTeacherFormOpen, isGroupManagerOpen, detailsModalState, isFormOpen, isSidebarOpen]);

    if (permissionError) {
        return (
            <div className="fixed inset-0 bg-red-100 z-50 flex justify-center items-center p-4 text-right">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
                    <h2 className="text-2xl font-bold mb-4 text-red-700">خطأ: الوصول إلى قاعدة البيانات مرفوض</h2>
                    <p className="text-gray-700 mb-4">
                        يبدو أن تطبيقك لا يملك الصلاحية للوصول إلى بيانات Firestore. هذا عادةً بسبب قواعد الأمان في مشروعك على Firebase التي تمنع القراءة والكتابة افتراضياً.
                    </p>
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

    // --- Unified Public View (Landing & Login) ---
    if (!currentUser) {
        const isLanding = location.pathname === '/';

        return (
            <div className="min-h-screen bg-slate-50 overflow-x-hidden" dir="rtl">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
                    {isLanding ? (
                        <LandingPage />
                    ) : (
                        <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden" dir="rtl">
                            {/* Modern Background Elements */}
                            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none"></div>

                            {/* Header for Login Page */}
                            <header className="w-full px-6 py-4 flex items-center justify-between z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/30">
                                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight hidden xs:block">مركز الشاطبي</span>
                                </div>

                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 text-white transition-all bg-white/10 hover:bg-blue-600 border border-white/20 hover:border-transparent px-5 py-2.5 rounded-xl backdrop-blur-md group shadow-xl hover:shadow-blue-500/20"
                                    title="العودة للصفحة الرئيسية"
                                >
                                    <HomeIcon className="w-5 h-5" />
                                    <span className="font-bold text-sm">الصفحة الرئيسية</span>
                                </button>
                            </header>

                            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                                <div className="w-full max-w-[480px] py-8">
                                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
                                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">مركز الشاطبي</h1>
                                        <p className="text-blue-200/60 text-base sm:text-lg italic">نظام الإدارة التعليمية المتكامل</p>
                                    </div>

                                    <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-2 sm:p-3 shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-500">
                                        <div className="p-6 sm:p-10 pt-4">
                                            <LoginScreen onLogin={handleLogin} teachers={teachers} supervisors={supervisors} parents={parents} />
                                        </div>
                                    </div>

                                    <p className="text-center text-blue-200/40 text-xs mt-8 font-medium">
                                        &copy; {new Date().getFullYear()} مركز الشاطبي للإدارة والتدريب. جميع الحقوق محفوظة.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>
        );
    }

    const renderHeader = () => {
        if (currentUser.role === 'parent') {
            if (parentViewingLandingPage) {
                // لا نعرض أي هيدر عندما يكون ولي الأمر في الصفحة الرئيسية
                return null;
            } else {
                // Header for Parent Dashboard
                // في اليمين: زر الصفحة الرئيسية
                const homeButtonContent = (
                    <button
                        onClick={() => setParentViewingLandingPage(true)}
                        className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
                        title="الصفحة الرئيسية"
                    >
                        <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="hidden sm:inline font-bold">الرئيسية</span>
                    </button>
                );

                // في الوسط: الترحيب ورقم الهاتف
                const centerInfoContent = (
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] sm:text-sm text-gray-500 font-medium whitespace-nowrap">مرحباً بك يا</span>
                        <div className="flex items-center gap-1 text-gray-800" dir="ltr">
                            <span className="text-xs sm:text-lg font-black tracking-wider">{(currentUser as any).phone}</span>
                            <UserIcon className="w-3 h-3 sm:w-5 sm:h-5 text-indigo-500" />
                        </div>
                    </div>
                );

                // في اليسار: زر تسجيل الخروج
                const logoutButtonContent = (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all border border-red-100 shadow-sm"
                        title="تسجيل الخروج"
                    >
                        <LogoutIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="hidden sm:inline font-bold">خروج</span>
                    </button>
                );

                // نظرأً لأن الموقع RTL:
                // leftContent يظهر في اليمين (البداية) -> نضع فيه زر الرئيسية
                // rightContent يظهر في اليسار (النهاية) -> نضع فيه زر الخروج
                return <Header leftContent={homeButtonContent} centerContent={centerInfoContent} rightContent={logoutButtonContent} showLogo={true} />;
            }
        }

        const path = location.pathname;
        let title = 'مركز الشاطبي';
        let isSubView = false;
        let searchPlaceholder = 'البحث...';

        if (currentUser.role === 'supervisor') title = `مركز الشاطبي - المشرف: ${currentUser.name}`;

        if (path === '/archive') { title = 'الأرشيف'; isSubView = true; }
        else if (path === '/debtors') { title = 'المدينون'; isSubView = true; }
        else if (path === '/general-view') { title = 'نظرة عامة'; isSubView = true; }
        else if (path === '/finance') { title = 'الإدارة المالية'; isSubView = true; }
        else if (path === '/fee-collection') { title = 'تحصيل الرسوم'; isSubView = true; }
        else if (path === '/teacher-manager') { title = 'الإدارة'; isSubView = true; searchPlaceholder = 'البحث عن موظف...'; }
        else if (path === '/directornotifications') { title = 'الرسائل والإشعارات'; isSubView = true; }
        else if (path === '/notes') { title = 'سجل الملحوظات'; isSubView = true; }
        else if (path === '/reports') { title = 'التقارير العامة'; isSubView = true; }
        else if (path === '/unpaid') { title = 'الطلاب غير المسددين'; isSubView = true; }

        if (viewingGroup) { title = `تقرير: ${viewingGroup.name}`; isSubView = true; }
        else if (viewingTeacherReportId) { const teacher = teachers.find(t => t.id === viewingTeacherReportId); title = `تقرير: ${teacher?.name || 'مدرس'}`; isSubView = true; }

        if (!isSubView) {
            const studentCount = activeView === 'students' ? getFilteredStudentCount() : (currentUser.role === 'director' ? activeStudents.length : (currentUser.role === 'supervisor' ? (supervisorFilteredData?.students.length || 0) : teacherStudents.students.length));
            const groupCount = currentUser.role === 'director' ? groups.length : (currentUser.role === 'supervisor' ? (supervisorFilteredData?.groups.length || 0) : visibleGroups.length);

            const titleMap: Record<ActiveView, string> = {
                students: `الطلاب (${studentCount})`,
                groups: `المجموعات (${groupCount})`,
                attendance_report: 'تقرير الحضور',
                tests_report: 'تقرير الاختبارات',
                financial_report: 'المصروفات'
            }
            title = titleMap[activeView] || title;
            searchPlaceholder = activeView === 'groups' ? 'البحث عن مجموعة...' : 'البحث عن طالب...';
        }

        const backButton = (<button onClick={() => handleBackButton()} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all" aria-label="العودة"> <ArrowRightIcon className="w-6 h-6" /> </button>);

        let leftContent = null;
        let centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>;
        let rightContent = null;

        const directorBell = currentUser.role === 'director' ? <DirectorNotificationBell notifications={directorNotifications.filter(n => !n.isDeleted).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} onMarkAsRead={handleMarkDirectorNotificationsAsRead} onDelete={handleDeleteDirectorNotifications} /> : null;

        if (currentUser.role === 'director' || currentUser.role === 'supervisor') {
            if (isSubView) {
                leftContent = backButton;
                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input type="search" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"> <SearchIcon className="w-5 h-5" /> </div>
                        </div>
                    );
                } else if (path === '/teacher-manager' || path === '/archive' || path === '/debtors') {
                    centerContent = (
                        <div className="flex items-center gap-2">
                            <button onClick={toggleSearch} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"> <SearchIcon className="w-5 h-5" /> </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>
                        </div>
                    );
                }

                if (path === '/teacher-manager') {
                    rightContent = (
                        <div className="flex items-center gap-2">
                            <button onClick={handleOpenAddTeacherForm} className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-all"> <UserPlusIcon className="w-6 h-6" /> </button>
                        </div>
                    );
                } else {
                    rightContent = directorBell;
                }
            } else {
                leftContent = (
                    <>
                        <button onClick={handleOpenMenu} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all lg:hidden"> <MenuIcon className="w-6 h-6" /> </button>
                        {(activeView === 'students' || activeView === 'groups') && (
                            <button onClick={toggleSearch} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all"> <SearchIcon className="w-6 h-6" /> </button>
                        )}
                    </>
                );
                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input type="search" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"> <SearchIcon className="w-5 h-5" /> </div>
                        </div>
                    );
                    rightContent = activeView === 'groups' ? null : directorBell;
                } else {
                    let actionButton = null;
                    if (activeView === 'students') {
                        actionButton = (
                            <button onClick={handleOpenAddStudentForm} className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition-all"> <UserPlusIcon className="w-6 h-6" /> </button>
                        );
                    } else if (activeView === 'groups') {
                        actionButton = (
                            <div className="flex gap-2">
                                {currentUser.role === 'director' && (
                                    <button onClick={handleGenerateAllParents} className="p-2 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 transition-all" title="تحديث حسابات أولياء الأمور"> <UsersIcon className="w-6 h-6" /> </button>
                                )}
                                <button onClick={() => setIsGroupManagerOpen(true)} className="p-2 rounded-lg text-blue-600 bg-blue-100 shadow hover:bg-blue-200 transition-all"> <UsersIcon className="w-6 h-6" /> </button>
                            </div>
                        );
                    }
                    rightContent = <div className="flex items-center gap-2">{actionButton}{activeView === 'groups' ? null : directorBell}</div>;
                }
            }
        } else { // Teacher view
            if (teacherViewingLandingPage) return null;

            if (viewingGroup || path === '/archive') {
                leftContent = backButton;
                centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{viewingGroup ? `تقرير: ${viewingGroup.name}` : 'الأرشيف'}</h1>;
            } else {
                leftContent = (
                    <div className="flex gap-2">
                        <button onClick={handleLogout} className="p-2 rounded-lg bg-red-100 text-red-700 shadow hover:bg-red-200 transition-all" title="تسجيل الخروج"> <LogoutIcon className="w-6 h-6" /> </button>
                        <button onClick={() => setTeacherViewingLandingPage(true)} className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shadow hover:bg-indigo-200 transition-all" title="الصفحة الرئيسية"> <HomeIcon className="w-6 h-6" /> </button>
                        {(activeView === 'students' || activeView === 'groups') && (
                            <button onClick={toggleSearch} className="p-2 rounded-lg bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all"> <SearchIcon className="w-6 h-6" /> </button>
                        )}
                    </div>
                );
                if (isSearchVisible) {
                    centerContent = (
                        <div className="relative">
                            <input type="search" placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-48 sm:w-72 pl-4 pr-10 py-2 border rounded-full bg-gray-100 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"> <SearchIcon className="w-5 h-5" /> </div>
                        </div>
                    );
                } else {
                    centerContent = <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-2">{title}</h1>;
                    rightContent = (
                        <div className="flex items-center gap-2">
                            {(activeView === 'students' || activeView === 'groups') && (
                                <button onClick={handleOpenAddStudentForm} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-3 rounded-lg shadow hover:bg-blue-700 transition-all"> <UserPlusIcon className="w-5 h-5" /><span className="hidden sm:inline">إضافة طالب</span> </button>
                            )}
                            <NotificationBell currentUser={currentUser as Extract<CurrentUser, { role: 'teacher' }>} notifications={notifications} groups={groups} onMarkAsRead={handleMarkNotificationsAsRead} onDelete={handleDeleteTeacherNotifications} />
                        </div>
                    );
                }
            }
        }
        return <Header leftContent={leftContent} centerContent={centerContent} rightContent={rightContent} />;
    };

    const handleApplyDeductions = async (records: TeacherAttendanceRecord[], notifications: Notification[]) => {
        try {
            await applyDeductions(records, notifications);
            alert('تم تطبيق الخصومات وإرسال الإشعارات بنجاح.');
        } catch (error) {
            alert('حدث خطأ أثناء تطبيق الخصومات.');
        }
    };


    const renderSupervisorContent = () => {
        if (!supervisorFilteredData) return null;
        const { students, allStudents, groups, teachers, expenses, collections, teacherAttendance, teacherPayrollAdjustments } = supervisorFilteredData;

        return (
            <Routes>
                {/* Landing Page - Accessible to all authenticated users */}
                <Route path="/" element={
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>جاري التحميل...</p></div>}>
                        <LandingPage />
                    </Suspense>
                } />
                {/* Main Views */}
                <Route path="/students" element={
                    <AllStudentsPage
                        students={students}
                        searchTerm={searchTerm}
                        groups={groups}
                        onOpenFeeModal={handleOpenFeeModal}
                        onEdit={handleEditStudent}
                        onToggleAttendance={handleToggleAttendance}
                        onArchive={handleArchiveStudent}
                        currentUserRole="supervisor"
                        onViewDetails={handleOpenStudentDetails}
                        typeFilter={studentTypeFilter}
                        onTypeFilterChange={setStudentTypeFilter}
                        onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                    />
                } />
                <Route path="/groups" element={
                    <GroupsPage students={students} searchTerm={searchTerm} groups={groups} teachers={teachers} notes={notes} onViewGroupReport={handleViewGroupReport} onViewStudents={handleViewGroupStudents} onOpenFeeModal={handleOpenFeeModal} onAddTest={handleAddTest} onDeleteTest={handleDeleteTest} onAddNote={handleAddNote} onEdit={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchive={handleArchiveStudent} currentUserRole="supervisor" onViewDetails={handleOpenStudentDetails} onMarkWeeklyReportSent={handleMarkWeeklyReportSent} />
                } />
                <Route path="/attendance_report" element={
                    <AttendanceReportPage students={students} groups={groups} onViewStudent={handleViewStudent} onArchive={handleArchiveStudent} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser?.role} />
                } />
                <Route path="/tests_report" element={
                    <TestsReportPage students={students} groups={groups} onViewStudent={handleViewStudent} onBack={() => handleBackButton()} />
                } />
                <Route path="/financial_report" element={
                    <FinancialReportPage students={students} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />
                } />

                {/* Sidebar Views */}
                <Route path="/finance" element={<FinancePage onBack={() => handleBackButton()} students={allStudents} teachers={teachers} staff={[]} expenses={expenses} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onLogExpense={handleLogExpense} onDeleteExpense={handleDeleteExpense} onSetTeacherAttendance={handleSetTeacherAttendance} onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments} financialSettings={financialSettings} onUpdateFinancialSettings={handleUpdateFinancialSettings} groups={groups} onResetTeacherPayment={handleResetTeacherPayment} onResetStaffPayment={handleResetStaffPayment} teacherCollections={collections} onViewTeacherDetails={handleOpenTeacherDetails} supervisors={[]} onApplyDeductions={handleApplyDeductions} donations={donations} onAddDonation={handleAddDonation} onDeleteDonation={handleDeleteDonation} />} />
                <Route path="/teacher-manager" element={<TeacherManagerPage
                    onBack={() => handleBackButton()}
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
                    onUpdateFinancialSettings={handleUpdateFinancialSettings}
                    onViewTeacherReport={handleViewTeacherReport}
                    onSendNotificationToAll={handleSendNotificationToAll}
                    onSendNotificationToTeacher={handleSendNotificationToTeacher}
                    onViewTeacherDetails={handleOpenTeacherDetails}
                    onViewSupervisorDetails={handleOpenSupervisorDetails}
                    searchTerm={searchTerm}
                    isFilterVisible={isTeacherFilterVisible}
                    onToggleFilter={() => setIsTeacherFilterVisible(!isTeacherFilterVisible)}
                />} />
                <Route path="/directornotifications" element={<DirectorNotificationsPage onBack={() => handleBackButton()} teachers={teachers} groups={groups} notifications={notifications} onSendNotification={handleSendNotification} />} />
                <Route path="/notes" element={<DirectorNotesPage onBack={() => handleBackButton()} notes={notes} students={students} groups={groups} teachers={teachers} onToggleAcknowledge={handleToggleNoteAcknowledge} onOpenStudentDetails={handleOpenStudentDetails} />} />
                <Route path="/archive" element={<ArchivePage students={students} groups={groups} searchTerm={searchTerm} currentUser={currentUser!} onOpenFeeModal={handleOpenFeeModal} onEditStudent={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchiveStudent={handleArchiveStudent} onOpenStudentDetails={handleOpenStudentDetails} onDeleteStudentPermanently={handleDeleteStudentPermanently} supervisorFilteredData={supervisorFilteredData} />} />
                <Route path="/debtors" element={<DebtorsPage students={students} groups={groups} onPayDebt={handlePayDebt} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser?.role as UserRole} searchTerm={searchTerm} />} />
                <Route path="/general-view" element={<GeneralViewPage students={allStudents} notes={notes} groups={groups} teachers={teachers} teacherCollections={collections} expenses={expenses} donations={donations || []} onDeleteExpense={handleDeleteExpense} onLogExpense={handleLogExpense} onAddDonation={handleAddDonation} onDeleteDonation={handleDeleteDonation} onToggleAcknowledge={handleToggleNoteAcknowledge} onViewStudent={handleViewStudent} onApproveStudent={handleApproveStudent} onRejectStudent={handleRejectStudent} onEditStudent={handleEditStudent} />} />
                <Route path="/reports" element={<DirectorReportsPage groups={groups} students={students} onBack={() => handleBackButton()} />} />
                <Route path="/unpaid" element={<UnpaidStudentsPage onBack={() => handleBackButton()} teachers={teachers} groups={groups} students={students} />} />
                <Route path="/fee-collection" element={<FeeCollectionPage onBack={() => handleBackButton()} teachers={teachers} groups={groups} students={students} teacherCollections={collections} onAddTeacherCollection={handleAddTeacherCollection} onDeleteTeacherCollection={handleDeleteTeacherCollection} />} />

                {/* Catch-all for sub-views that aren't yet routed */}
                <Route path="*" element={
                    (() => {
                        if (viewingTeacherReportId) {
                            const reportTeacher = teachers.find(t => t.id === viewingTeacherReportId);
                            if (reportTeacher) {
                                return <TeacherReportPage teacher={reportTeacher} groups={groups} students={students} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={() => handleBackButton()} teacherCollections={collections} currentUserRole={currentUser?.role} />;
                            }
                        }
                        if (teacherForDetails || supervisorForDetails) return <TeacherDetailsPage
                            teacher={teacherForDetails}
                            supervisor={supervisorForDetails}
                            groups={groups}
                            students={students}
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
                            onViewTeacherReport={handleViewTeacherReport}
                            onSendNotificationToAll={handleSendNotificationToAll}
                            teacherCollections={collections}
                            teacherManualBonuses={teacherManualBonuses}
                            currentUserRole={currentUser?.role}
                            onAddTeacherCollection={handleAddTeacherCollection}
                            onDeleteTeacherCollection={handleDeleteTeacherCollection}
                            onAddManualBonus={handleAddManualBonus}
                            onDeleteManualBonus={handleDeleteManualBonus}
                            onDeleteTeacherAttendance={handleDeleteTeacherAttendance}
                            onResetPayment={handleResetTeacherPayment}
                            onBack={() => handleBackButton()}
                        />;
                        if (detailsModalState) return <StudentDetailsPage
                            student={detailsModalState.student}
                            initialTab={detailsModalState.initialTab}
                            currentUser={currentUser}
                            notes={notes.filter(n => n.studentId === detailsModalState.student.id)}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onSaveProgressPlan={handleSaveStudentProgressPlan}
                            onUpdatePlanRecord={handleUpdatePlanRecord}
                            onTogglePlanCompletion={handleTogglePlanCompletion}
                            onDeletePlanRecord={handleDeletePlanRecord}
                            onCancelFeePayment={handleCancelFeePayment}
                            onBack={() => handleBackButton()}
                        />;
                        if (viewingTeacherReportId) {
                            const reportTeacher = teachers.find(t => t.id === viewingTeacherReportId);
                            if (reportTeacher) {
                                return <TeacherReportPage teacher={reportTeacher} groups={groups} students={students} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={() => handleBackButton()} teacherCollections={collections} currentUserRole={currentUser?.role} />;
                            }
                        }
                        if (viewingGroup) return <GroupReportPage group={viewingGroup} students={students.filter(s => s.groupId === viewingGroup.id)} teacher={teachers.find(t => t.id === viewingGroup.teacherId)} onBack={() => handleBackButton()} currentUserRole={currentUser?.role} />;
                        if (viewingGroupStudents) return <GroupStudentsPage
                            group={viewingGroupStudents}
                            students={students.filter(s => s.groupId === viewingGroupStudents.id)}
                            teachers={teachers}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onEdit={handleEditStudent}
                            onToggleAttendance={handleToggleAttendance}
                            onArchive={handleArchiveStudent}
                            currentUserRole={currentUser?.role}
                            onViewDetails={handleOpenStudentDetails}
                            onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                            onBack={() => handleBackButton()}
                        />;
                        return <Navigate to="/students" replace />;
                    })()
                } />
            </Routes>
        );
    }

    const renderDirectorContent = () => {
        return (
            <Routes>
                {/* Landing Page - Accessible to all authenticated users */}
                <Route path="/" element={
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>جاري التحميل...</p></div>}>
                        <LandingPage />
                    </Suspense>
                } />
                {/* Main Views */}
                <Route path="/students" element={
                    <AllStudentsPage
                        students={activeStudents}
                        searchTerm={searchTerm}
                        groups={groups}
                        onOpenFeeModal={handleOpenFeeModal}
                        onEdit={handleEditStudent}
                        onToggleAttendance={handleToggleAttendance}
                        onArchive={handleArchiveStudent}
                        currentUserRole="director"
                        onViewDetails={handleOpenStudentDetails}
                        typeFilter={studentTypeFilter}
                        onTypeFilterChange={setStudentTypeFilter}
                        onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                    />
                } />
                <Route path="/groups" element={
                    <GroupsPage students={activeStudents} searchTerm={searchTerm} groups={groups} teachers={teachers} notes={notes} onViewGroupReport={handleViewGroupReport} onViewStudents={handleViewGroupStudents} onOpenFeeModal={handleOpenFeeModal} onAddTest={handleAddTest} onDeleteTest={handleDeleteTest} onAddNote={handleAddNote} onEdit={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchive={handleArchiveStudent} currentUserRole="director" onViewDetails={handleOpenStudentDetails} onMarkWeeklyReportSent={handleMarkWeeklyReportSent} />
                } />
                <Route path="/attendance_report" element={
                    <AttendanceReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} onArchive={handleArchiveStudent} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser?.role} />
                } />
                <Route path="/tests_report" element={
                    <TestsReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} onBack={() => handleBackButton()} />
                } />
                <Route path="/financial_report" element={
                    <FinancialReportPage students={activeStudents} groups={groups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />
                } />

                {/* Sidebar Views */}
                <Route path="/finance" element={<FinancePage onBack={handleBackToMain} students={activeStudents} teachers={teachers} staff={staff} expenses={expenses} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} onLogExpense={handleLogExpense} onDeleteExpense={handleDeleteExpense} onSetTeacherAttendance={handleSetTeacherAttendance} onUpdatePayrollAdjustments={handleUpdatePayrollAdjustments} financialSettings={financialSettings} onUpdateFinancialSettings={handleUpdateFinancialSettings} groups={groups} onResetTeacherPayment={handleResetTeacherPayment} onResetStaffPayment={handleResetStaffPayment} teacherCollections={teacherCollections} onViewTeacherDetails={handleOpenTeacherDetails} supervisors={supervisors} onApplyDeductions={handleApplyDeductions} donations={donations} onAddDonation={handleAddDonation} onDeleteDonation={handleDeleteDonation} />} />
                <Route path="/teacher-manager" element={<TeacherManagerPage
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
                    onUpdateFinancialSettings={handleUpdateFinancialSettings}
                    onViewTeacherReport={handleViewTeacherReport}
                    onSendNotificationToAll={handleSendNotificationToAll}
                    onSendNotificationToTeacher={handleSendNotificationToTeacher}
                    onViewTeacherDetails={handleOpenTeacherDetails}
                    onViewSupervisorDetails={handleOpenSupervisorDetails}
                    searchTerm={searchTerm}
                    isFilterVisible={isTeacherFilterVisible}
                    onToggleFilter={() => setIsTeacherFilterVisible(!isTeacherFilterVisible)}
                />} />
                <Route path="/directornotifications" element={<DirectorNotificationsPage onBack={handleBackToMain} teachers={teachers} groups={groups} notifications={notifications} onSendNotification={handleSendNotification} />} />
                <Route path="/notes" element={<DirectorNotesPage onBack={handleBackToMain} notes={notes} students={students} groups={groups} teachers={teachers} onToggleAcknowledge={handleToggleNoteAcknowledge} onOpenStudentDetails={handleOpenStudentDetails} />} />
                <Route path="/archive" element={<ArchivePage students={students} groups={groups} searchTerm={searchTerm} currentUser={currentUser!} onOpenFeeModal={handleOpenFeeModal} onEditStudent={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchiveStudent={handleArchiveStudent} onOpenStudentDetails={handleOpenStudentDetails} onDeleteStudentPermanently={handleDeleteStudentPermanently} supervisorFilteredData={supervisorFilteredData} />} />
                <Route path="/debtors" element={<DebtorsPage students={students} groups={groups} onPayDebt={handlePayDebt} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser?.role as UserRole} searchTerm={searchTerm} />} />
                <Route path="/general-view" element={<GeneralViewPage students={students} notes={notes} groups={groups} teachers={teachers} teacherCollections={teacherCollections} expenses={expenses} donations={donations || []} onDeleteExpense={handleDeleteExpense} onLogExpense={handleLogExpense} onAddDonation={handleAddDonation} onDeleteDonation={handleDeleteDonation} onToggleAcknowledge={handleToggleNoteAcknowledge} onViewStudent={handleViewStudent} onApproveStudent={handleApproveStudent} onRejectStudent={handleRejectStudent} onEditStudent={handleEditStudent} />} />
                <Route path="/reports" element={<DirectorReportsPage groups={groups} students={students} onBack={handleBackToMain} />} />
                <Route path="/unpaid" element={<UnpaidStudentsPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={students} />} />
                <Route path="/fee-collection" element={<FeeCollectionPage onBack={handleBackToMain} teachers={teachers} groups={groups} students={students} teacherCollections={teacherCollections} onAddTeacherCollection={handleAddTeacherCollection} onDeleteTeacherCollection={handleDeleteTeacherCollection} />} />

                {/* Catch-all for sub-views that aren't yet routed */}
                <Route path="*" element={
                    (() => {
                        if (viewingTeacherReportId) {
                            const reportTeacher = teachers.find(t => t.id === viewingTeacherReportId);
                            if (reportTeacher) {
                                return <TeacherReportPage teacher={reportTeacher} groups={groups} students={students} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={handleBackToMain} teacherCollections={teacherCollections} currentUserRole={currentUser?.role} />;
                            }
                        }
                        if (teacherForDetails || supervisorForDetails) return <TeacherDetailsPage
                            teacher={teacherForDetails}
                            supervisor={supervisorForDetails}
                            groups={groups}
                            students={students}
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
                            onViewTeacherReport={handleViewTeacherReport}
                            onSendNotificationToAll={handleSendNotificationToAll}
                            teacherCollections={teacherCollections}
                            teacherManualBonuses={teacherManualBonuses}
                            currentUserRole={currentUser?.role}
                            onAddTeacherCollection={handleAddTeacherCollection}
                            onDeleteTeacherCollection={handleDeleteTeacherCollection}
                            onAddManualBonus={handleAddManualBonus}
                            onDeleteManualBonus={handleDeleteManualBonus}
                            onDeleteTeacherAttendance={handleDeleteTeacherAttendance}
                            onResetPayment={handleResetTeacherPayment}
                            onBack={() => handleBackButton()}
                        />;
                        if (detailsModalState) return <StudentDetailsPage
                            student={detailsModalState.student}
                            initialTab={detailsModalState.initialTab}
                            currentUser={currentUser}
                            notes={notes.filter(n => n.studentId === detailsModalState.student.id)}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onSaveProgressPlan={handleSaveStudentProgressPlan}
                            onUpdatePlanRecord={handleUpdatePlanRecord}
                            onTogglePlanCompletion={handleTogglePlanCompletion}
                            onDeletePlanRecord={handleDeletePlanRecord}
                            onCancelFeePayment={handleCancelFeePayment}
                            onBack={() => handleBackButton()}
                        />;
                        if (viewingTeacherReportId) {
                            const reportTeacher = teachers.find(t => t.id === viewingTeacherReportId);
                            if (reportTeacher) {
                                return <TeacherReportPage teacher={reportTeacher} groups={groups} students={activeStudents} teacherAttendance={teacherAttendance} teacherPayrollAdjustments={teacherPayrollAdjustments} financialSettings={financialSettings} onBack={handleBackToMain} teacherCollections={teacherCollections} currentUserRole={currentUser?.role} />;
                            }
                        }
                        if (viewingGroup) return <GroupReportPage group={viewingGroup} students={activeStudents.filter(s => s.groupId === viewingGroup.id)} teacher={teachers.find(t => t.id === viewingGroup.teacherId)} onBack={handleBackToMain} currentUserRole={currentUser?.role} />;
                        if (viewingGroupStudents) return <GroupStudentsPage
                            group={viewingGroupStudents}
                            students={activeStudents.filter(s => s.groupId === viewingGroupStudents.id)}
                            teachers={teachers}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onEdit={handleEditStudent}
                            onToggleAttendance={handleToggleAttendance}
                            onArchive={handleArchiveStudent}
                            currentUserRole={currentUser?.role}
                            onViewDetails={handleOpenStudentDetails}
                            onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                            onBack={handleBackToMain}
                        />;
                        return <Navigate to="/students" replace />;
                    })()
                } />
            </Routes>
        );
    }

    // ... (renderTeacherContent - No Changes)
    const renderTeacherContent = () => {
        return (
            <Routes>
                {/* Landing Page - Accessible to all authenticated users */}
                <Route path="/" element={<Navigate to="/students" replace />} />
                {/* Main Views */}
                <Route path="/students" element={
                    <AllStudentsPage
                        students={teacherStudents.students}
                        searchTerm={searchTerm}
                        groups={visibleGroups}
                        onOpenFeeModal={handleOpenFeeModal}
                        onEdit={handleEditStudent}
                        onToggleAttendance={handleToggleAttendance}
                        onArchive={handleArchiveStudent}
                        currentUserRole="teacher"
                        onViewDetails={handleOpenStudentDetails}
                        typeFilter={studentTypeFilter}
                        onTypeFilterChange={setStudentTypeFilter}
                    />
                } />
                <Route path="/groups" element={
                    <GroupsPage students={teacherStudents.students} searchTerm={searchTerm} groups={visibleGroups} teachers={teachers} notes={notes} onViewGroupReport={handleViewGroupReport} onViewStudents={handleViewGroupStudents} onOpenFeeModal={handleOpenFeeModal} onAddTest={handleAddTest} onDeleteTest={handleDeleteTest} onAddNote={handleAddNote} onEdit={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchive={handleArchiveStudent} currentUserRole="teacher" onViewDetails={handleOpenStudentDetails} />
                } />
                <Route path="/attendance_report" element={
                    <AttendanceReportPage students={teacherStudents.students} groups={visibleGroups} onViewStudent={handleViewStudent} onArchive={handleArchiveStudent} onViewDetails={handleOpenStudentDetails} currentUserRole={currentUser?.role} />
                } />
                <Route path="/tests_report" element={
                    <TestsReportPage students={teacherStudents.students} groups={visibleGroups} onViewStudent={handleViewStudent} onBack={() => handleBackButton()} />
                } />
                <Route path="/financial_report" element={
                    <FinancialReportPage students={teacherStudents.students} groups={visibleGroups} onViewStudent={handleViewStudent} currentUserRole={currentUser?.role} />
                } />

                {/* Sub-views as Route wrappers or catch-all */}
                <Route path="/archive" element={<ArchivePage students={students} groups={groups} searchTerm={searchTerm} currentUser={currentUser!} onOpenFeeModal={handleOpenFeeModal} onEditStudent={handleEditStudent} onToggleAttendance={handleToggleAttendance} onArchiveStudent={handleArchiveStudent} onOpenStudentDetails={handleOpenStudentDetails} onDeleteStudentPermanently={handleDeleteStudentPermanently} supervisorFilteredData={supervisorFilteredData} />} />
                <Route path="*" element={
                    (() => {
                        if (viewingGroup) return <GroupReportPage group={viewingGroup} students={activeStudents.filter(s => s.groupId === viewingGroup.id)} teacher={teachers.find(t => t.id === viewingGroup.teacherId)} onBack={() => handleBackButton()} currentUserRole={currentUser?.role} />;
                        if (viewingGroupStudents) return <GroupStudentsPage
                            group={viewingGroupStudents}
                            students={activeStudents.filter(s => s.groupId === viewingGroupStudents.id)}
                            teachers={teachers}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onEdit={handleEditStudent}
                            onToggleAttendance={handleToggleAttendance}
                            onArchive={handleArchiveStudent}
                            currentUserRole={currentUser?.role}
                            onViewDetails={handleOpenStudentDetails}
                            onMarkWeeklyReportSent={handleMarkWeeklyReportSent}
                            onBack={() => handleBackButton()}
                        />;
                        if (detailsModalState) return <StudentDetailsPage
                            student={detailsModalState.student}
                            initialTab={detailsModalState.initialTab}
                            currentUser={currentUser}
                            notes={notes.filter(n => n.studentId === detailsModalState.student.id)}
                            onOpenFeeModal={handleOpenFeeModal}
                            onAddTest={handleAddTest}
                            onDeleteTest={handleDeleteTest}
                            onAddNote={handleAddNote}
                            onSaveProgressPlan={handleSaveStudentProgressPlan}
                            onUpdatePlanRecord={handleUpdatePlanRecord}
                            onTogglePlanCompletion={handleTogglePlanCompletion}
                            onDeletePlanRecord={handleDeletePlanRecord}
                            onCancelFeePayment={handleCancelFeePayment}
                            onBack={() => handleBackButton()}
                        />;
                        return <Navigate to="/students" replace />;
                    })()
                } />
            </Routes>
        );
    };

    // عرض محتوى ولي الأمر (تم نقله إلى ParentView)

    // دالة إنشاء حسابات لجميع الطلاب القدامى
    // دالة إنشاء حسابات لجميع الطلاب القدامى
    const handleGenerateAllParents = async () => {
        if (!window.confirm('هل أنت متأكد من رغبتك في إنشاء حسابات أولياء أمور لجميع الطلاب الحاليين؟\nسيتم استخدام أرقام الهواتف المسجلة.\nقد تستغرق هذه العملية بعض الوقت.')) return;

        try {
            const result = await generateAllParents(students, parents);
            alert(`تمت العملية بنجاح! \n\n✅ تم التحديث/الإنشاء: ${result.createdCount}\n⏭️ تم التخطي (موجود مسبقاً): ${result.validSkipped}\n❌ أرقام غير صالحة: ${result.invalidCount}`);
        } catch (error) {
            console.error("Error generating parents:", error);
            alert("حدث خطأ أثناء المعالجة.");
        }
    };

    return (
        <div key={currentUser?.role === 'director' ? 'director' : (currentUser as any)?.id} className="min-h-screen bg-gray-50 font-sans">
            {!isOnline && (
                <div className="bg-red-500 text-white text-center p-2 font-semibold flex items-center justify-center gap-2">
                    <CloudOffIcon className="w-5 h-5" />
                    <span>أنت غير متصل بالإنترنت. سيتم حفظ التغييرات ومزامنتها عند عودة الاتصال.</span>
                </div>
            )}
            <div className="flex">
                <Suspense fallback={<SidebarSkeleton />}>
                    {currentUser && (currentUser.role === 'director' || currentUser.role === 'supervisor') && location.pathname !== '/' && (
                        <Sidebar
                            isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                            onShowGeneralView={() => navigate('/general-view')}
                            onShowFinance={() => navigate('/finance')}
                            onShowFeeCollection={() => navigate('/fee-collection')}
                            onShowNotifications={() => navigate('/directornotifications')}
                            onShowNotes={() => navigate('/notes')}
                            onShowTeacherManager={() => navigate('/teacher-manager')}
                            onShowArchive={() => navigate('/archive')}
                            onShowDebtors={() => navigate('/debtors')}
                            onShowLandingPageContent={() => setIsLandingPageContentOpen(true)}
                            onShowLandingPage={() => navigate('/')}
                            onLogout={handleLogout}
                            currentUserRole={currentUser.role}
                            unreadMessagesCount={unreadMessagesCount}
                        />
                    )}
                </Suspense>

                <div className="flex-1 flex flex-col w-full min-w-0">
                    <Suspense fallback={<HeaderSkeleton />}>
                        {currentUser && location.pathname !== '/' && renderHeader()}
                    </Suspense>

                    <main className="flex-1 overflow-y-auto pb-20">
                        <ErrorBoundary>
                            <Suspense fallback={<ListSkeleton />}>
                                {isDataLoading && activeStudents.length === 0 ? (
                                    <ListSkeleton />
                                ) : (
                                    currentUser.role === 'director'
                                        ? renderDirectorContent()
                                        : (currentUser.role === 'supervisor'
                                            ? renderSupervisorContent()
                                            : (currentUser.role === 'parent'
                                                ? (parentViewingLandingPage ? (
                                                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>جاري التحميل...</p></div>}>
                                                        <LandingPage onBackToParent={() => setParentViewingLandingPage(false)} />
                                                    </Suspense>
                                                ) : (
                                                    <ParentView
                                                        currentUser={currentUser}
                                                        students={students}
                                                        groups={groups}
                                                        teachers={teachers}
                                                        unreadMessagesCount={unreadMessagesCount}
                                                        setIsChatOpen={setIsChatOpen}
                                                        setChatInitialUserId={setChatInitialUserId}
                                                        onNavigateToHome={() => setParentViewingLandingPage(true)}
                                                    />
                                                ))
                                                : (teachers.length > 0 ? (
                                                    teacherViewingLandingPage ? (
                                                        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>جاري التحميل...</p></div>}>
                                                            <LandingPage onBackToParent={() => setTeacherViewingLandingPage(false)} />
                                                        </Suspense>
                                                    ) : renderTeacherContent()
                                                ) : <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>)))
                                )}

                                {/* Modals & Overlays - Now inside the main Suspense */}
                                <StudentForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setStudentToEdit(null); }} onSave={addOrUpdateStudent} studentToEdit={studentToEdit} groups={visibleGroups} />

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
                                    </>
                                )}

                                <FeePaymentModal isOpen={isFeeModalOpen} onClose={() => { setIsFeeModalOpen(false); setPaymentDetails(null); }} onSave={handleSaveFeePayment} paymentDetails={paymentDetails} />
                                <UnarchiveModal isOpen={!!studentToUnarchiveId} onClose={() => setStudentToUnarchiveId(null)} onConfirm={handleConfirmUnarchive} groups={groupsForUnarchiveModal} studentName={students.find(s => s.id === studentToUnarchiveId)?.name || ''} />

                                {/* Chat System - Always mounted for instant opening */}
                                {currentUser && location.pathname !== '/' && (
                                    <>
                                        <button
                                            onClick={() => setIsChatOpen(true)}
                                            className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all hover:scale-105 flex items-center gap-2 group border-2 border-white focus:outline-none focus:ring-4 focus:ring-blue-300 ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                                            style={{ position: 'fixed', left: '20px', bottom: '80px', right: 'auto', zIndex: 9999 }}
                                            title="المحادثات"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            <span className="font-bold hidden md:inline ml-1">المحادثات</span>
                                            {unreadMessagesCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                                    {unreadMessagesCount > 9 ? '+9' : unreadMessagesCount}
                                                </span>
                                            )}
                                        </button>

                                        <div
                                            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 transition-all duration-300 ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                        >
                                            <div className={`w-full max-w-6xl h-full max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isChatOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                                                <ChatPage
                                                    key={currentUser.role === 'director' ? 'director' : (currentUser as any).id || 'unknown'}
                                                    currentUser={{
                                                        uid: currentUser.role === 'director' ? 'director' : ((currentUser as any).id || 'unknown'),
                                                        role: currentUser.role,
                                                        name: currentUser.role === 'director' ? 'الإدارة' : ((currentUser as any).name || 'Unknown')
                                                    }}
                                                    teachers={activeTeachers || []}
                                                    groups={groups}
                                                    students={currentUser.role === 'parent' ? students.filter(s => (currentUser as any).studentIds?.includes(s.id)) : students}
                                                    parents={parents}
                                                    supervisors={supervisors}
                                                    initialSelectedUserId={chatInitialUserId}
                                                    onBack={() => {
                                                        setIsChatOpen(false);
                                                        setChatInitialUserId(undefined);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Suspense>
                        </ErrorBoundary>
                    </main>
                    <Suspense fallback={null}>
                        {currentUser && currentUser.role !== 'parent' && location.pathname !== '/' && !teacherViewingLandingPage && <BottomNavBar activeView={activeView} onSelectView={handleBottomNavSelect} />}
                    </Suspense>
                </div>
            </div>

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

            {/* Landing Page Content Manager */}
            {isLandingPageContentOpen && currentUser.role === 'director' && (
                <Suspense fallback={null}>
                    <LandingPageContentManager
                        onClose={() => setIsLandingPageContentOpen(false)}
                        currentDirector={currentUser}
                    />
                </Suspense>
            )}
        </div>
    );
};
export default App;
