

import React, { useState, useMemo } from 'react';
import type { Teacher, Group, Student, TeacherCollectionRecord } from '../types';
import { TeacherStatus } from '../types';
import CashIcon from './icons/CashIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import TrashIcon from './icons/TrashIcon';


interface FeeCollectionPageProps {
    onBack: () => void;
    teachers: Teacher[];
    groups: Group[];
    students: Student[];
    teacherCollections: TeacherCollectionRecord[];
    onAddTeacherCollection: (collectionData: Omit<TeacherCollectionRecord, 'id' | 'date'>) => void;
    onDeleteTeacherCollection: (collectionId: string) => void;
}

const FeeCollectionPage: React.FC<FeeCollectionPageProps> = ({ onBack, teachers, groups, students, teacherCollections, onAddTeacherCollection, onDeleteTeacherCollection }) => {
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
    const [expandedTeacherId, setExpandedTeacherId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'قرآن' | 'نور بيان' | 'تلقين'>('all');

    const activeTeachers = useMemo(() => {
        return teachers
            .filter(t => {
                const isActive = t.status === TeacherStatus.ACTIVE;
                if (!isActive) return false;

                if (activeTab === 'all') return true;

                // Check if teacher has any group in the active tab section
                const teacherGroups = groups.filter(g => g.teacherId === t.id);
                return teacherGroups.some(g => g.name.includes(activeTab));
            })
            .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    }, [teachers, activeTab, groups]);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div className="max-w-xs w-full sm:w-auto">
                        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض بيانات شهر</label>
                        <input
                            type="month"
                            id="month-filter"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto overflow-x-auto">
                        {(['all', 'تلقين', 'نور بيان', 'قرآن'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-white text-cyan-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab === 'all' ? 'الكل' : tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {activeTeachers.map(teacher => (
                    <TeacherFeeCard
                        key={teacher.id}
                        teacher={teacher}
                        groups={groups}
                        students={students}
                        teacherCollections={teacherCollections}
                        selectedMonth={selectedMonth}
                        onAddTeacherCollection={onAddTeacherCollection}
                        onDeleteTeacherCollection={onDeleteTeacherCollection}
                        isExpanded={expandedTeacherId === teacher.id}
                        onToggleExpand={() => setExpandedTeacherId(prev => prev === teacher.id ? null : teacher.id)}
                    />
                ))}
                {activeTeachers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow">
                        <h2 className="text-2xl font-semibold text-gray-600">لا يوجد مدرسون</h2>
                        <p className="text-gray-400 mt-2">
                            لا يوجد مدرسون يطابقون الفلتر المحدد.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

interface TeacherFeeCardProps {
    teacher: Teacher;
    groups: Group[];
    students: Student[];
    teacherCollections: TeacherCollectionRecord[];
    selectedMonth: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onAddTeacherCollection: (collectionData: Omit<TeacherCollectionRecord, 'id' | 'date'>) => void;
    onDeleteTeacherCollection: (collectionId: string) => void;
}

const TeacherFeeCard: React.FC<TeacherFeeCardProps> = ({ teacher, groups, students, teacherCollections, selectedMonth, isExpanded, onToggleExpand, onAddTeacherCollection, onDeleteTeacherCollection }) => {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    const financialData = useMemo(() => {
        const teacherGroupIds = groups.filter(g => g.teacherId === teacher.id).map(g => g.id);
        const studentsInGroups = students.filter(s => teacherGroupIds.includes(s.groupId));

        const totalCollectedByTeacher = studentsInGroups
            .flatMap(s => s.fees)
            .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
            .reduce((sum, f) => sum + (f.amountPaid || 0), 0);

        const collectionsForMonth = teacherCollections.filter(c => c.teacherId === teacher.id && c.month === selectedMonth);

        const totalHandedOver = collectionsForMonth.reduce((sum, c) => sum + c.amount, 0);

        const remainingBalance = totalCollectedByTeacher - totalHandedOver;

        return { totalCollectedByTeacher, totalHandedOver, remainingBalance, collectionsForMonth };
    }, [teacher, groups, students, teacherCollections, selectedMonth]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (!parsedAmount || parsedAmount <= 0) {
            alert("يرجى إدخال مبلغ صحيح.");
            return;
        }

        onAddTeacherCollection({
            teacherId: teacher.id,
            month: selectedMonth,
            amount: parsedAmount,
            notes: notes.trim()
        });

        setAmount('');
        setNotes('');
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
            <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={onToggleExpand} role="button" aria-expanded={isExpanded}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <BriefcaseIcon className="h-6 w-6 text-cyan-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
                            <div className="flex gap-3 mt-1 text-xs sm:text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">المحصّل:</span>
                                    <span className="font-bold text-green-600">{financialData.totalCollectedByTeacher.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">المُسلَّم:</span>
                                    <span className="font-bold text-blue-600">{financialData.totalHandedOver.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">المتبقي:</span>
                                    <span className="font-bold text-red-600">{financialData.remainingBalance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <svg className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-200">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6 md:hidden">
                            <div className="bg-green-50 p-2 rounded-lg">
                                <p className="text-sm font-semibold text-green-700">إجمالي المحصّل</p>
                                <p className="text-xl font-bold text-green-600 mt-1">{financialData.totalCollectedByTeacher.toLocaleString()} EGP</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <p className="text-sm font-semibold text-blue-700">المبلغ المسلَّم</p>
                                <p className="text-xl font-bold text-blue-600 mt-1">{financialData.totalHandedOver.toLocaleString()} EGP</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded-lg">
                                <p className="text-sm font-semibold text-red-700">المبلغ المتبقي</p>
                                <p className="text-xl font-bold text-red-600 mt-1">{financialData.remainingBalance.toLocaleString()} EGP</p>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-3">تسجيل استلام مبلغ جديد</h4>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-2">
                                    <label htmlFor={`amount-${teacher.id}`} className="block text-sm text-gray-600 mb-1">المبلغ المستلم</label>
                                    <input
                                        type="number"
                                        id={`amount-${teacher.id}`}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="0.00"
                                        required
                                        onClick={e => e.stopPropagation()}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`notes-${teacher.id}`} className="block text-sm text-gray-600 mb-1">ملاحظات (اختياري)</label>
                                    <input
                                        type="text"
                                        id={`notes-${teacher.id}`}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="مثال: دفعة أولى"
                                        onClick={e => e.stopPropagation()}
                                    />
                                </div>
                                <button type="submit" className="bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors">
                                    تسجيل
                                </button>
                            </form>
                        </div>

                        {financialData.collectionsForMonth.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-700 mb-2">سجل التسليمات لهذا الشهر</h4>
                                <div className="space-y-2 border-t pt-3">
                                    {financialData.collectionsForMonth.map(collection => (
                                        <div key={collection.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm">
                                            <div>
                                                <span className="font-semibold">{collection.amount.toLocaleString()} EGP</span>
                                                {collection.notes && <span className="text-gray-500 mr-2">- {collection.notes}</span>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500">{new Date(collection.date).toLocaleDateString('ar-EG')}</span>
                                                <button
                                                    onClick={() => onDeleteTeacherCollection(collection.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="حذف هذا السجل"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FeeCollectionPage;