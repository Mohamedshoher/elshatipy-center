

import React, { useMemo, useState } from 'react';
import type { Note, Student, Group, Teacher, TeacherCollectionRecord, Expense } from '../types';
import { ExpenseCategory, roundToNearest5 } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import XIcon from './icons/XIcon';
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
    onToggleAcknowledge: (noteId: string) => void;
    onViewStudent: (studentId: string) => void;
    onApproveStudent: (studentId: string) => void;
    onRejectStudent: (studentId: string) => void;
}

const InfoCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    defaultExpanded?: boolean;
}> = ({ title, icon, children, className, defaultExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className || ''}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </h2>
                <ChevronDownIcon
                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            {isExpanded && (
                <div className="px-6 pb-6">
                    {children}
                </div>
            )}
        </div>
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
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {groupedData.map(({ groupId, groupName, students }) => {
                const isExpanded = expandedSet.has(groupId);
                return (
                    <div key={groupId} className="bg-gray-50 rounded-md overflow-hidden border">
                        <button
                            onClick={() => onToggle(groupId)}
                            className="w-full text-right p-2 flex justify-between items-center hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-700">{groupName}</span>
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
                                    <div key={student.id} className="flex justify-between items-center bg-white p-2 rounded-md">
                                        <button onClick={() => onViewStudent(student.id)} className="font-semibold text-gray-700 hover:text-blue-600 text-sm">{student.name}</button>
                                        <span className="text-xs text-gray-500">{new Date(student[dateField]!).toLocaleDateString('ar-EG')}</span>
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


const GeneralViewPage: React.FC<GeneralViewPageProps> = ({ students, notes, groups, teachers, teacherCollections, expenses, onToggleAcknowledge, onViewStudent, onApproveStudent, onRejectStudent }) => {

    const [expandedNewGroups, setExpandedNewGroups] = useState<Set<string>>(new Set());
    const [expandedArchivedGroups, setExpandedArchivedGroups] = useState<Set<string>>(new Set());
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));

    // Modal States
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groupMap = useMemo(() => new Map(groups.map(g => [g.id, g.name])), [groups]);

    const newStudents = useMemo(() =>
        students.filter(s => !s.isArchived && new Date(s.joiningDate) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()),
        [students, sevenDaysAgo]);

    const recentlyArchivedStudents = useMemo(() =>
        students.filter(s => s.isArchived && s.archiveDate && new Date(s.archiveDate) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.archiveDate!).getTime() - new Date(a.archiveDate!).getTime()),
        [students, sevenDaysAgo]);

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
                // Check if it's a salary expense
                const isSalary = [
                    ExpenseCategory.TEACHER_SALARY,
                    ExpenseCategory.SUPERVISOR_SALARY,
                    ExpenseCategory.STAFF_SALARY,
                    ExpenseCategory.TEACHER_BONUS
                ].includes(e.category);

                if (isSalary) {
                    // Try to extract month from description " - شهر YYYY-MM"
                    const match = e.description.match(/شهر (\d{4}-\d{2})/);
                    if (match && match[1]) {
                        return match[1] === selectedMonth;
                    }
                }

                // Fallback to date for non-salaries or if extraction fails
                return e.date.startsWith(selectedMonth);
            })
            .reduce((sum, e) => sum + e.amount, 0);

        // Net Profit = Received from Teachers - Total Expenses
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

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Pending Students Section */}
            <PendingStudents
                students={students}
                groups={groups}
                onApprove={onApproveStudent}
                onReject={onRejectStudent}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                <div className="space-y-8">
                    {/* Financial Summary Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0">
                                    <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
                                    <span>الملخص المالي للشهر المحدد</span>
                                </h2>
                                <div className="w-full sm:w-auto">
                                    <label htmlFor="month-filter" className="sr-only">عرض بيانات شهر</label>
                                    <input
                                        type="month"
                                        id="month-filter"
                                        value={selectedMonth}
                                        onChange={e => setSelectedMonth(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                                        dir="ltr"
                                    />
                                    <div className="text-xs text-gray-500 mt-1 text-right">عرض بيانات شهر</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Total Income (Student Fees) */}
                                <button
                                    onClick={() => setIsIncomeModalOpen(true)}
                                    className="bg-green-100 p-6 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <p className="text-lg text-green-800 font-semibold mb-2">إجمالي الدخل</p>
                                    <p className="text-3xl font-bold text-green-700 dir-ltr">
                                        EGP {roundToNearest5(financialOverview.income).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-green-700 mt-2">مصروفات الطلاب المسددة</p>
                                </button>

                                {/* Total Expenses */}
                                <button
                                    onClick={() => setIsExpenseModalOpen(true)}
                                    className="bg-red-100 p-6 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <p className="text-lg text-red-800 font-semibold mb-2">إجمالي المصروفات</p>
                                    <p className="text-3xl font-bold text-red-700 dir-ltr">
                                        EGP {roundToNearest5(financialOverview.totalExpenses).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-red-700 mt-2">الرواتب والمصاريف العامة</p>
                                </button>

                                {/* Amount Received (From Teachers) */}
                                <button
                                    onClick={() => setIsCollectionsModalOpen(true)}
                                    className="bg-cyan-100 p-6 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                >
                                    <p className="text-lg text-cyan-800 font-semibold mb-2">المبلغ المستلم</p>
                                    <p className="text-3xl font-bold text-cyan-700 dir-ltr">
                                        EGP {roundToNearest5(teacherCollectionsSummary.totalReceived).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-cyan-700 mt-2">من تحصيلات المدرسين</p>
                                </button>

                                {/* Net Profit / Loss */}
                                <div className={`p-6 rounded-lg text-center ${financialOverview.net >= 0 ? 'bg-orange-50' : 'bg-red-50'}`}>
                                    <p className={`text-lg font-semibold mb-2 ${financialOverview.net >= 0 ? 'text-orange-800' : 'text-red-800'}`}>
                                        صافي الربح / الخسارة
                                    </p>
                                    <p className={`text-3xl font-bold dir-ltr ${financialOverview.net >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                        {roundToNearest5(financialOverview.net).toLocaleString()} EGP
                                    </p>
                                    <p className={`text-sm mt-2 ${financialOverview.net >= 0 ? 'text-orange-700' : 'text-red-700'}`}>
                                        المبلغ المستلم - المصروفات
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <InfoCard title="طلاب جدد (آخر 7 أيام)" icon={<UserPlusIcon className="w-6 h-6 text-blue-500" />}>
                        <GroupedStudentList
                            groupedData={newStudentsByGroup}
                            expandedSet={expandedNewGroups}
                            onToggle={toggleNewGroup}
                            onViewStudent={onViewStudent}
                            dateField="joiningDate"
                        />
                    </InfoCard>

                    <InfoCard title="طلاب مؤرشفون (آخر 7 أيام)" icon={<ArchiveIcon className="w-6 h-6 text-orange-500" />}>
                        <GroupedStudentList
                            groupedData={archivedStudentsByGroup}
                            expandedSet={expandedArchivedGroups}
                            onToggle={toggleArchivedGroup}
                            onViewStudent={onViewStudent}
                            dateField="archiveDate"
                        />
                    </InfoCard>
                </div>

                <InfoCard title="أحدث الملحوظات للمراجعة" icon={<ClipboardListIcon className="w-6 h-6 text-yellow-500" />}>
                    <div className="space-y-3">
                        {unacknowledgedNotes.length > 0 ? unacknowledgedNotes.map(note => (
                            <div key={note.id} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <p className="text-gray-800 mb-2">{note.content}</p>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="text-gray-500">
                                        <span>بواسطة: {note.authorName}</span>
                                        <span className="mx-1">|</span>
                                        <button onClick={() => onViewStudent(note.studentId)} className="hover:underline">الطالب</button>
                                    </div>
                                    <button
                                        onClick={() => onToggleAcknowledge(note.id)}
                                        className="flex items-center gap-1 text-green-600 hover:text-green-800 font-semibold"
                                        title="تأكيد المراجعة"
                                    >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span>تمت المراجعة</span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                                <p className="text-gray-500">لا توجد ملحوظات جديدة للمراجعة. عمل رائع!</p>
                            </div>
                        )}
                    </div>
                </InfoCard>

            </div>

            {/* Modals */}
            <FinanceIncomeModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                month={selectedMonth}
                students={students}
                groups={groups}
            />
            <FinanceExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                month={selectedMonth}
                expenses={expenses}
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