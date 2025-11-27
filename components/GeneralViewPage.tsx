

import React, { useMemo, useState } from 'react';
import type { Note, Student, Group, Teacher, TeacherCollectionRecord } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import CashIcon from './icons/CashIcon';
import XIcon from './icons/XIcon';
import PendingStudents from './PendingStudents';

interface GeneralViewPageProps {
    students: Student[];
    notes: Note[];
    groups: Group[];
    teachers: Teacher[];
    teacherCollections: TeacherCollectionRecord[];
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


const GeneralViewPage: React.FC<GeneralViewPageProps> = ({ students, notes, groups, teachers, teacherCollections, onToggleAcknowledge, onViewStudent, onApproveStudent, onRejectStudent }) => {

    const [expandedNewGroups, setExpandedNewGroups] = useState<Set<string>>(new Set());
    const [expandedArchivedGroups, setExpandedArchivedGroups] = useState<Set<string>>(new Set());
    const [isReceivedMoneyModalOpen, setIsReceivedMoneyModalOpen] = useState(false);

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentMonth = now.toISOString().substring(0, 7);

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

    const financialSummary = useMemo(() => {
        let totalCollected = 0;
        let totalDue = 0;
        const activeStudentsInMonth = students.filter(s => !s.isArchived && s.joiningDate.substring(0, 7) <= currentMonth);

        activeStudentsInMonth.forEach(student => {
            totalDue += student.monthlyFee;
            const feeRecord = student.fees.find(f => f.month === currentMonth);
            if (feeRecord?.paid) {
                totalCollected += feeRecord.amountPaid || student.monthlyFee;
            }
        });

        return {
            collected: totalCollected,
            remaining: totalDue - totalCollected
        };
    }, [students, currentMonth]);

    const teacherCollectionsSummary = useMemo(() => {
        const collectionsThisMonth = teacherCollections.filter(c => c.month === currentMonth);
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

        return {
            totalReceived,
            details,
        };
    }, [teacherCollections, teachers, currentMonth]);

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
                    <InfoCard title="الملخص المالي للشهر الحالي" icon={<CurrencyDollarIcon className="w-6 h-6 text-green-500" />}>
                        <div className="space-y-3">
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex justify-between items-center">
                                <p className="font-semibold">المبلغ المحصّل</p>
                                <p className="text-2xl font-bold">EGP {financialSummary.collected.toLocaleString()}</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex justify-between items-center">
                                <p className="font-semibold">المبلغ المتبقي</p>
                                <p className="text-2xl font-bold">EGP {financialSummary.remaining.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setIsReceivedMoneyModalOpen(true)}
                                className="w-full text-right bg-cyan-50 border border-cyan-200 text-cyan-700 p-4 rounded-lg flex justify-between items-center hover:bg-cyan-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                <p className="font-semibold">المبلغ المستلم</p>
                                <p className="text-2xl font-bold">EGP {teacherCollectionsSummary.totalReceived.toLocaleString()}</p>
                            </button>
                        </div>
                    </InfoCard>

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

            {isReceivedMoneyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg flex flex-col max-h-[90vh]">
                        <div className="flex-shrink-0 flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-700">تفاصيل المبلغ المستلم</h2>
                            <button onClick={() => setIsReceivedMoneyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                            {teacherCollectionsSummary.details.length > 0 ? teacherCollectionsSummary.details.map(detail => (
                                <div key={detail.teacherId} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                    <span className="font-semibold text-gray-700">{detail.teacherName}</span>
                                    <span className="font-bold text-gray-800">{detail.amount.toLocaleString()} EGP</span>
                                </div>
                            )) : (
                                <p className="text-center text-gray-400 py-8">لم يتم استلام مبالغ من المدرسين هذا الشهر.</p>
                            )}
                        </div>
                        <div className="flex-shrink-0 mt-6 flex justify-end">
                            <button onClick={() => setIsReceivedMoneyModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">إغلاق</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GeneralViewPage;