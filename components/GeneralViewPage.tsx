
import React, { useMemo, useState, useEffect } from 'react';
import type { Note, Student, Group, Teacher, TeacherCollectionRecord, Expense, Donation, ParentVisit, LeaveRequest } from '../types';
import { ExpenseCategory, roundToNearest5 } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';
import UserIcon from './icons/UserIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import XIcon from './icons/XIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import PendingStudents from './PendingStudents';
import FinanceIncomeModal from './FinanceIncomeModal';
import FinanceExpenseModal from './FinanceExpenseModal';
import FinanceCollectionsModal from './FinanceCollectionsModal';
import UsersIcon from './icons/UsersIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import { getCairoDateString, getYesterdayDateString, parseCairoDateString, getArabicDayName } from '../services/cairoTimeHelper';
import Portal from './Portal';

interface GeneralViewPageProps {
    students: Student[];
    notes: Note[];
    groups: Group[];
    teachers: Teacher[];
    teacherCollections: TeacherCollectionRecord[];
    expenses: Expense[];
    donations: Donation[];
    onDeleteExpense: (expenseId: string) => void;
    onLogExpense: (expense: Omit<Expense, 'id'>) => void;
    onAddDonation: (donation: Omit<Donation, 'id'>) => void;
    onDeleteDonation: (donationId: string) => void;
    onToggleAcknowledge: (noteId: string) => void;
    onViewStudent: (studentId: string) => void;
    onApproveStudent: (studentId: string) => void;
    onRejectStudent: (studentId: string) => void;
    onEditStudent: (student: Student) => void;
    parentVisits: ParentVisit[];
    leaveRequests: LeaveRequest[];
    onUpdateLeaveStatus: (requestId: string, status: 'approved' | 'rejected') => void;
}

const FullScreenSection: React.FC<{
    onBack: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ onBack, title, icon, children }) => {
    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-6 border-b bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                {icon}
                            </div>
                            <h2 className="text-2xl font-black text-gray-800">{title}</h2>
                        </div>
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors group"
                            title="إغلاق"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-gray-50/30 text-right" dir="rtl">
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

const SectionTriggerCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
    summary?: string;
    className?: string;
}> = ({ title, icon, onClick, summary, className }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:bg-gray-50 hover:shadow-lg transition-all duration-300 group ${className || ''}`}
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors border border-gray-100">
                    {icon}
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    {summary && <p className="text-sm text-gray-500 mt-1">{summary}</p>}
                </div>
            </div>
            <div className="p-2 bg-gray-100 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-200 transition-all">
                <svg className="w-6 h-6 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
};

const GroupedStudentList: React.FC<{
    groupedData: { groupId: string; groupName: string; students: Student[] }[];
    expandedSet: Set<string>;
    onToggle: (groupId: string) => void;
    onViewStudent: (studentId: string) => void;
    dateField: 'joiningDate' | 'archiveDate';
}> = ({ groupedData, expandedSet, onToggle, onViewStudent, dateField }) => {
    if (groupedData.length === 0) {
        return <p className="text-center text-gray-400 py-4">لا يوجد طلاب لعرضهم.</p>;
    }

    return (
        <div className="space-y-2">
            {groupedData.map(({ groupId, groupName, students }) => {
                const isExpanded = expandedSet.has(groupId);
                return (
                    <div key={groupId} className="bg-gray-50 rounded-md overflow-hidden border">
                        <button
                            onClick={() => onToggle(groupId)}
                            className="w-full text-right p-3 flex justify-between items-center hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-700 text-lg">{groupName}</span>
                            <div className="flex items-center gap-2">
                                <span className="font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                    {students.length}
                                </span>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                        </button>
                        {isExpanded && (
                            <div className="border-t border-gray-200 p-2 space-y-1">
                                {students.map(student => (
                                    <div key={student.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-100 hover:shadow-sm transition-shadow">
                                        <button onClick={() => onViewStudent(student.id)} className="font-semibold text-gray-800 hover:text-blue-600 text-base">{student.name}</button>
                                        <span className="text-sm text-gray-500">{new Date(student[dateField]!).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


const GeneralViewPage: React.FC<GeneralViewPageProps> = ({ students, notes, groups, teachers, teacherCollections, expenses, donations, onDeleteExpense, onLogExpense, onAddDonation, onDeleteDonation, onToggleAcknowledge, onViewStudent, onApproveStudent, onRejectStudent, onEditStudent, parentVisits, leaveRequests, onUpdateLeaveStatus }) => {

    const [expandedNewGroups, setExpandedNewGroups] = useState<Set<string>>(new Set());
    const [expandedArchivedGroups, setExpandedArchivedGroups] = useState<Set<string>>(new Set());
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
    const [activeSection, setActiveSection] = useState<'finance' | 'new' | 'archived' | 'notes' | 'parentVisits' | 'leaveRequests' | null>(null);

    const handlePrevMonth = () => {
        const date = new Date(selectedMonth + '-01');
        date.setMonth(date.getMonth() - 1);
        setSelectedMonth(date.toISOString().slice(0, 7));
    };

    const handleNextMonth = () => {
        const date = new Date(selectedMonth + '-01');
        date.setMonth(date.getMonth() + 1);
        setSelectedMonth(date.toISOString().slice(0, 7));
    };

    // Modal States
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isIncomeModalOpen) { setIsIncomeModalOpen(false); return; }
                if (isExpenseModalOpen) { setIsExpenseModalOpen(false); return; }
                if (isCollectionsModalOpen) { setIsCollectionsModalOpen(false); return; }
                if (activeSection) { setActiveSection(null); return; }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isIncomeModalOpen, isExpenseModalOpen, isCollectionsModalOpen, activeSection]);

    const todayStr = new Date().toISOString().split('T')[0];

    const groupMap = useMemo(() => new Map(groups.map(g => [g.id, g.name])), [groups]);

    const newStudents = useMemo(() =>
        students.filter(s => !s.isArchived && s.joiningDate === todayStr)
            .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()),
        [students, todayStr]);

    const recentlyArchivedStudents = useMemo(() =>
        students.filter(s => s.isArchived && s.archiveDate && s.archiveDate.startsWith(todayStr))
            .sort((a, b) => new Date(b.archiveDate!).getTime() - new Date(a.archiveDate!).getTime()),
        [students, todayStr]);

    const groupStudents = (studentList: Student[]) => {
        const grouped: Record<string, Student[]> = {};
        studentList.forEach(student => {
            const groupId = student.groupId || 'unassigned';
            if (!grouped[groupId]) {
                grouped[groupId] = [];
            }
            grouped[groupId].push(student);
        });
        return Object.entries(grouped).map(([groupId, students]) => ({
            groupId,
            groupName: groupMap.get(groupId) || 'بدون مجموعة',
            students
        })).sort((a, b) => a.groupName.localeCompare(b.groupName, 'ar'));
    };

    const newStudentsByGroup = useMemo(() => groupStudents(newStudents), [newStudents, groupMap]);
    const archivedStudentsByGroup = useMemo(() => groupStudents(recentlyArchivedStudents), [recentlyArchivedStudents, groupMap]);

    const unacknowledgedNotes = useMemo(() =>
        notes.filter(n => !n.isAcknowledged)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        [notes]);

    // Parent Visits Calculations
    const visitStats = useMemo(() => {
        const today = getCairoDateString();
        const yesterday = getYesterdayDateString();

        const todayVisits = parentVisits.filter(v => v.date === today).length;
        const yesterdayVisits = parentVisits.filter(v => v.date === yesterday).length;
        const totalVisits = parentVisits.length;

        const groupedByDate: Record<string, number> = {};
        parentVisits.forEach(v => {
            groupedByDate[v.date] = (groupedByDate[v.date] || 0) + 1;
        });

        const history = Object.entries(groupedByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => b.date.localeCompare(a.date));

        return { todayVisits, yesterdayVisits, totalVisits, history };
    }, [parentVisits]);


    // --- Financial Calculations ---

    const teacherCollectionsSummary = useMemo(() => {
        const collectionsThisMonth = teacherCollections.filter(c => c.month === selectedMonth);
        const handedOverByTeachers = collectionsThisMonth.reduce((sum, c) => sum + c.amount, 0);

        // Director income (collectedBy 'director')
        const directorIncome = students.flatMap(s => s.fees || [])
            .filter(f => f.month === selectedMonth && f.paid && f.amountPaid && f.collectedBy === 'director')
            .reduce((sum, f) => sum + (f.amountPaid || 0), 0);

        // Total received by center = Handed over by teachers + Collected by director
        const totalReceived = handedOverByTeachers + directorIncome;

        const teacherTotals: { [key: string]: number } = {};
        collectionsThisMonth.forEach(collection => {
            teacherTotals[collection.teacherId] = (teacherTotals[collection.teacherId] || 0) + collection.amount;
        });

        const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

        const details = Object.entries(teacherTotals).map(([teacherId, amount]) => ({
            teacherId,
            teacherName: teacherMap.get(teacherId) || 'مدرس غير معروف',
            amount,
        })).sort((a, b) => b.amount - a.amount);

        return { totalReceived, handedOverByTeachers, directorIncome, details };
    }, [teacherCollections, teachers, selectedMonth, students]);


    const financialOverview = useMemo(() => {
        const income = students.flatMap(s => s.fees)
            .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
            .reduce((sum, f) => sum + f.amountPaid!, 0);

        const totalExpenses = expenses
            .filter(e => {
                const isSalary = [
                    ExpenseCategory.TEACHER_SALARY,
                    ExpenseCategory.SUPERVISOR_SALARY,
                    ExpenseCategory.STAFF_SALARY,
                    ExpenseCategory.TEACHER_BONUS
                ].includes(e.category);

                if (isSalary) {
                    const match = e.description.match(/شهر (\d{4}-\d{2})/);
                    if (match && match[1]) {
                        return match[1] === selectedMonth;
                    }
                }
                return e.date.startsWith(selectedMonth);
            })
            .reduce((sum, e) => sum + e.amount, 0);

        const net = teacherCollectionsSummary.totalReceived - totalExpenses;
        return { income, totalExpenses, net };
    }, [students, expenses, selectedMonth, teacherCollectionsSummary.totalReceived]);


    const toggleNewGroup = (groupId: string) => {
        setExpandedNewGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) newSet.delete(groupId);
            else newSet.add(groupId);
            return newSet;
        });
    };

    const toggleArchivedGroup = (groupId: string) => {
        setExpandedArchivedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) newSet.delete(groupId);
            else newSet.add(groupId);
            return newSet;
        });
    };

    const handleWhatsAppClick = (student: Student, noteContent: string) => {
        const phone = student.phone.replace(/[^0-9]/g, '');
        if (!phone) {
            alert('لا يوجد رقم هاتف مسجل لهذا الطالب.');
            return;
        }

        const message = `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب/ة: ${student.name} المحترم،\n\nنود إفادتكم بملحوظة إدارية:\n"${noteContent}"\n\nنرجو منكم المتابعة والاهتمام.\nشاكرين لكم حسن تعاونكم.\n\nإدارة مركز الشاطبي`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const renderContent = () => {
        const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
        const pastRequests = leaveRequests.filter(r => r.status !== 'pending');
        const financeModal = activeSection === 'finance' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="الملخص المالي للشهر المحدد"
                icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />}
            >
                <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-4 justify-between">
                        <label htmlFor="month-filter" className="font-semibold text-gray-700">اختر الشهر للعرض:</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleNextMonth}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
                                title="الشهر القادم"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <input
                                type="month"
                                id="month-filter"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-left dir-ltr font-bold text-gray-700"
                            />
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
                                title="الشهر السابق"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => setIsIncomeModalOpen(true)}
                        className="bg-green-50 border border-green-200 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 group"
                    >
                        <p className="text-xl text-green-800 font-bold mb-3">إجمالي الدخل</p>
                        <p className="text-4xl font-extrabold text-green-600 dir-ltr group-hover:scale-110 transition-transform">
                            EGP {roundToNearest5(financialOverview.income).toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700 mt-3 font-medium">مصروفات الطلاب المسددة</p>
                    </button>

                    <button
                        onClick={() => setIsExpenseModalOpen(true)}
                        className="bg-red-50 border border-red-200 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 group"
                    >
                        <p className="text-xl text-red-800 font-bold mb-3">إجمالي المصروفات</p>
                        <p className="text-4xl font-extrabold text-red-600 dir-ltr group-hover:scale-110 transition-transform">
                            EGP {roundToNearest5(financialOverview.totalExpenses).toLocaleString()}
                        </p>
                        <p className="text-sm text-red-700 mt-3 font-medium">الرواتب والمصاريف العامة</p>
                    </button>

                    <button
                        onClick={() => setIsCollectionsModalOpen(true)}
                        className="bg-cyan-50 border border-cyan-200 p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 group"
                    >
                        <p className="text-xl text-cyan-800 font-bold mb-3">المبلغ المستلم</p>
                        <p className="text-4xl font-extrabold text-cyan-600 dir-ltr group-hover:scale-110 transition-transform">
                            EGP {roundToNearest5(teacherCollectionsSummary.totalReceived).toLocaleString()}
                        </p>
                        <p className="text-sm text-cyan-700 mt-3 font-medium">من تحصيلات المدرسين</p>
                    </button>

                    <div className={`p-6 rounded-xl text-center border shadow-sm ${financialOverview.net >= 0 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
                        <p className={`text-xl font-bold mb-3 ${financialOverview.net >= 0 ? 'text-orange-800' : 'text-red-800'}`}>
                            صافي الربح / الخسارة
                        </p>
                        <p className={`text-4xl font-extrabold dir-ltr ${financialOverview.net >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                            {roundToNearest5(financialOverview.net).toLocaleString()} EGP
                        </p>
                        <p className={`text-sm mt-3 font-medium ${financialOverview.net >= 0 ? 'text-orange-700' : 'text-red-700'}`}>
                            المبلغ المستلم - المصروفات
                        </p>
                    </div>
                </div>
            </FullScreenSection>
        );


        const newStudentsModal = activeSection === 'new' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="الطلاب الجدد (اليوم)"
                icon={<UserPlusIcon className="w-8 h-8 text-blue-500" />}
            >
                <GroupedStudentList
                    groupedData={newStudentsByGroup}
                    expandedSet={expandedNewGroups}
                    onToggle={toggleNewGroup}
                    onViewStudent={onViewStudent}
                    dateField="joiningDate"
                />
            </FullScreenSection>
        );


        const archivedModal = activeSection === 'archived' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="الطلاب المؤرشفون (اليوم)"
                icon={<ArchiveIcon className="w-8 h-8 text-orange-500" />}
            >
                <GroupedStudentList
                    groupedData={archivedStudentsByGroup}
                    expandedSet={expandedArchivedGroups}
                    onToggle={toggleArchivedGroup}
                    onViewStudent={onViewStudent}
                    dateField="archiveDate"
                />
            </FullScreenSection>
        );


        const notesModal = activeSection === 'notes' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="أحدث الملحوظات للمراجعة"
                icon={<ClipboardListIcon className="w-8 h-8 text-yellow-500" />}
            >
                <div className="space-y-4">
                    {unacknowledgedNotes.length > 0 ? unacknowledgedNotes.map(note => {
                        const student = students.find(s => s.id === note.studentId);
                        return (
                            <div key={note.id} className="bg-white rounded-lg border border-yellow-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                                <div className="mb-3">
                                    <h3 className="font-bold text-gray-900 text-lg leading-relaxed">{note.content}</h3>
                                </div>

                                <div className="flex items-center justify-between border-t pt-3 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">{note.authorName}</span>
                                        {student && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => onViewStudent(student.id)}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                                                >
                                                    {student.name}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {student && (
                                            <button
                                                onClick={() => handleWhatsAppClick(student, note.content)}
                                                className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                title="إرسال عبر واتساب"
                                            >
                                                <WhatsAppIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onToggleAcknowledge(note.id)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors border border-green-200"
                                            title="تأكيد المراجعة"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span className="text-sm font-semibold">تمت المراجعة</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                            <CheckCircleIcon className="w-20 h-20 text-green-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl">لا توجد ملحوظات جديدة للمراجعة</p>
                        </div>
                    )}
                </div>
            </FullScreenSection>
        );


        const parentVisitsModal = activeSection === 'parentVisits' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="تقرير زيارات أولياء الأمور"
                icon={<UsersIcon className="w-8 h-8 text-indigo-500" />}
            >
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-center shadow-sm">
                            <p className="text-indigo-800 font-bold mb-2">زيارات اليوم</p>
                            <p className="text-4xl font-black text-indigo-600 tracking-tight">{visitStats.todayVisits}</p>
                            <p className="text-xs text-indigo-400 mt-2 font-medium">بتوقيت القاهرة</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
                            <p className="text-blue-800 font-bold mb-2">زيارات أمس</p>
                            <p className="text-4xl font-black text-blue-600 tracking-tight">{visitStats.yesterdayVisits}</p>
                            <p className="text-xs text-blue-400 mt-2 font-medium">إجمالي اليوم السابق</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center shadow-sm">
                            <p className="text-gray-800 font-bold mb-2">إجمالي الزيارات</p>
                            <p className="text-4xl font-black text-gray-600 tracking-tight">{visitStats.totalVisits}</p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">منذ بدء التفعيل</p>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">سجل الزيارات اليومي</h3>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">آخر {visitStats.history.length} يوم</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-right">التاريخ</th>
                                        <th className="px-6 py-4 font-bold text-right">اليوم</th>
                                        <th className="px-6 py-4 font-bold text-right">عدد الزوار المميزين</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {visitStats.history.map((h, idx) => {
                                        const date = parseCairoDateString(h.date);
                                        const dayName = getArabicDayName(date);
                                        return (
                                            <tr key={h.date} className={`hover:bg-gray-50 transition-colors ${idx === 0 ? 'bg-indigo-50/30' : ''}`}>
                                                <td className="px-6 py-4 font-medium text-gray-900 dir-ltr text-right">{h.date}</td>
                                                <td className="px-6 py-4 text-gray-600">{dayName}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${idx === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {h.count} زيارة
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {visitStats.history.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-gray-400">لا توجد بيانات متاحة بعد.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </FullScreenSection>
        );


        const leaveRequestsModal = activeSection === 'leaveRequests' && (
            <FullScreenSection
                onBack={() => setActiveSection(null)}
                title="طلبات الإجازات"
                icon={<CalendarCheckIcon className="w-8 h-8 text-amber-500" />}
            >
                <div className="space-y-4">
                    {pendingRequests.length > 0 ? pendingRequests.map(request => (
                        <div key={request.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 text-right" dir="rtl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-black text-gray-800">{request.studentName}</h3>
                                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
                                            {request.days} {request.days === 1 ? 'يوم' : request.days === 2 ? 'يومين' : 'أيام'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 font-bold mb-3 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                                        "{request.reason}"
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="w-3.5 h-3.5" />
                                            <span>ولي الأمر: {request.parentName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <WhatsAppIcon className="w-3.5 h-3.5" />
                                            <span className="dir-ltr">{request.parentPhone}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>بتاريخ: {new Date(request.date).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                    <button
                                        onClick={() => onUpdateLeaveStatus(request.id, 'rejected')}
                                        className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-black text-sm"
                                    >
                                        رفض
                                    </button>
                                    <button
                                        onClick={() => onUpdateLeaveStatus(request.id, 'approved')}
                                        className="px-6 py-2.5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all font-black text-sm"
                                    >
                                        موافقة
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                            <CalendarCheckIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-bold">لا توجد طلبات إجازة معلقة حالياً</p>
                        </div>
                    )}

                    {pastRequests.length > 0 && (
                        <div className="mt-12">
                            <h4 className="text-sm font-black text-gray-400 mb-4 px-2 tracking-widest uppercase text-right">الطلبات السابقة</h4>
                            <div className="space-y-3 opacity-60">
                                {pastRequests.slice(0, 10).map(request => (
                                    <div key={request.id} className="bg-gray-50/50 rounded-xl p-4 flex items-center justify-between border border-gray-100 text-right" dir="rtl">
                                        <div>
                                            <p className="font-bold text-gray-700 text-sm">{request.studentName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{request.days} أيام - {request.status === 'approved' ? 'مقبول' : 'مرفوض'}</p>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {request.status === 'approved' ? '✓ تم القبول' : '✗ تم الرفض'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </FullScreenSection>
        );


        // Dashboard View (Default)
        return (
            <div className="space-y-8">
                {/* Pending Students Section */}
                <PendingStudents
                    students={students}
                    groups={groups}
                    onApprove={onApproveStudent}
                    onReject={onRejectStudent}
                    onEdit={onEditStudent}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

                    <SectionTriggerCard
                        title="الملخص المالي"
                        icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />}
                        onClick={() => setActiveSection('finance')}
                        summary={`للشهر المحدد: ${selectedMonth}`}
                        className="border-green-100 border-2"
                    />

                    <SectionTriggerCard
                        title="طلاب جدد (اليوم)"
                        icon={<UserPlusIcon className="w-8 h-8 text-blue-500" />}
                        onClick={() => setActiveSection('new')}
                        summary={`${newStudents.length} طالب جديد`}
                        className="border-blue-100 border-2"
                    />

                    <SectionTriggerCard
                        title="طلاب مؤرشفون (اليوم)"
                        icon={<ArchiveIcon className="w-8 h-8 text-orange-500" />}
                        onClick={() => setActiveSection('archived')}
                        summary={`${recentlyArchivedStudents.length} طالب مؤرشف`}
                        className="border-orange-100 border-2"
                    />

                    <SectionTriggerCard
                        title="أحدث الملحوظات"
                        icon={<ClipboardListIcon className="w-8 h-8 text-yellow-500" />}
                        onClick={() => setActiveSection('notes')}
                        summary={unacknowledgedNotes.length > 0 ? `${unacknowledgedNotes.length} ملحوظة جديدة` : 'لا توجد ملحوظات'}
                        className="border-yellow-100 border-2"
                    />

                    <SectionTriggerCard
                        title="زيارات أولياء الأمور"
                        icon={<UsersIcon className="w-8 h-8 text-indigo-500" />}
                        onClick={() => setActiveSection('parentVisits')}
                        summary={`اليوم: ${visitStats.todayVisits} | أمس: ${visitStats.yesterdayVisits}`}
                        className="border-indigo-100 border-2"
                    />

                    <SectionTriggerCard
                        title="طلبات الإجازات"
                        icon={<CalendarCheckIcon className="w-8 h-8 text-amber-500" />}
                        onClick={() => setActiveSection('leaveRequests')}
                        summary={leaveRequests.filter(r => r.status === 'pending').length > 0 ? `${leaveRequests.filter(r => r.status === 'pending').length} طلب جديد` : 'لا توجد طلبات معلقة'}
                        className="border-amber-100 border-2"
                    />

                </div>
                {financeModal}
                {newStudentsModal}
                {archivedModal}
                {notesModal}
                {parentVisitsModal}
                {leaveRequestsModal}
            </div>
        );
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {renderContent()}

            {/* Modals (Still used for sub-details of Finance) */}
            <FinanceIncomeModal
                key={`income-modal-${donations ? donations.length : 0}`}
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                month={selectedMonth}
                students={students}
                groups={groups}
                donations={donations}
                onAddDonation={onAddDonation}
                onDeleteDonation={onDeleteDonation}
            />
            <FinanceExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                month={selectedMonth}
                expenses={expenses}
                onDeleteExpense={onDeleteExpense}
                onLogExpense={onLogExpense}
            />
            <FinanceCollectionsModal
                isOpen={isCollectionsModalOpen}
                onClose={() => setIsCollectionsModalOpen(false)}
                month={selectedMonth}
                collectionsSummary={teacherCollectionsSummary}
            />
        </main>
    );
};

export default GeneralViewPage;