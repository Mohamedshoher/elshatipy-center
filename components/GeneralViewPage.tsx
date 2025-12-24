
import React, { useMemo, useState, useEffect } from 'react';
import type { Note, Student, Group, Teacher, TeacherCollectionRecord, Expense, Donation } from '../types';
import { ExpenseCategory, roundToNearest5 } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';
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
}

const FullScreenSection: React.FC<{
    onBack: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}> = ({ onBack, title, icon, children }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-in slide-in-from-bottom-4 duration-300 min-h-[500px]">
            <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group border border-gray-200"
                    title="عودة"
                >
                    <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="p-3 bg-gray-50 rounded-full">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            </div>
            <div>
                {children}
            </div>
        </div>
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


const GeneralViewPage: React.FC<GeneralViewPageProps> = ({ students, notes, groups, teachers, teacherCollections, expenses, donations, onDeleteExpense, onLogExpense, onAddDonation, onDeleteDonation, onToggleAcknowledge, onViewStudent, onApproveStudent, onRejectStudent }) => {

    const [expandedNewGroups, setExpandedNewGroups] = useState<Set<string>>(new Set());
    const [expandedArchivedGroups, setExpandedArchivedGroups] = useState<Set<string>>(new Set());
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
    const [activeSection, setActiveSection] = useState<'finance' | 'new' | 'archived' | 'notes' | null>(null);

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


    // --- Financial Calculations ---

    const teacherCollectionsSummary = useMemo(() => {
        const collectionsThisMonth = teacherCollections.filter(c => c.month === selectedMonth);
        const totalReceived = collectionsThisMonth.reduce((sum, c) => sum + c.amount, 0);

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

        return { totalReceived, details };
    }, [teacherCollections, teachers, selectedMonth]);


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
        if (activeSection === 'finance') {
            return (
                <FullScreenSection
                    onBack={() => setActiveSection(null)}
                    title="الملخص المالي للشهر المحدد"
                    icon={<CurrencyDollarIcon className="w-8 h-8 text-green-500" />}
                >
                    <div className="mb-6 bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-4 justify-between">
                            <label htmlFor="month-filter" className="font-semibold text-gray-700">اختر الشهر للعرض:</label>
                            <input
                                type="month"
                                id="month-filter"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-left dir-ltr"
                            />
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
        }

        if (activeSection === 'new') {
            return (
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
        }

        if (activeSection === 'archived') {
            return (
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
        }

        if (activeSection === 'notes') {
            return (
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
        }

        // Dashboard View (Default)
        return (
            <div className="space-y-8">
                {/* Pending Students Section */}
                <PendingStudents
                    students={students}
                    groups={groups}
                    onApprove={onApproveStudent}
                    onReject={onRejectStudent}
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

                </div>
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