import React, { useMemo } from 'react';
import type { Student, Group, UserRole } from '../types';
import StudentCard from './StudentCard';

interface DebtorsPageProps {
    students: Student[];
    groups: Group[];
    onPayDebt: (studentId: string, month: string, amount: number) => void;
    onViewDetails: (student: Student) => void;
    currentUserRole: UserRole;
    searchTerm?: string;
}

const DebtorsPage: React.FC<DebtorsPageProps> = ({ students, groups, onPayDebt, onViewDetails, currentUserRole, searchTerm }) => {
    // Filter students who have debt
    const debtorStudents = useMemo(() => {
        return students
            .filter(s => {
                const isDebtor = s.isArchived && s.hasDebt && s.debtMonths && s.debtMonths.length > 0;
                const matchesSearch = !searchTerm || s.name.includes(searchTerm);
                return isDebtor && matchesSearch;
            })
            .sort((a, b) => {
                if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    const aName = a.name.toLowerCase();
                    const bName = b.name.toLowerCase();
                    const aStartsWith = aName.startsWith(searchLower);
                    const bStartsWith = bName.startsWith(searchLower);
                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;
                }
                return a.name.localeCompare(b.name, 'ar');
            });
    }, [students, searchTerm]);

    const getTotalDebt = (student: Student): number => {
        if (!student.debtMonths) return 0;
        return student.debtMonths.length * student.monthlyFee;
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">المدينون</h1>
                <p className="text-gray-600">الطلاب المؤرشفون الذين لديهم مصروفات مستحقة (حضروا 10 حصص أو أكثر ولم يدفعوا)</p>
            </div>

            <div className="space-y-6">
                {debtorStudents.length > 0 ? (
                    debtorStudents.map(student => {
                        const totalDebt = getTotalDebt(student);
                        const debtMonthsNames = student.debtMonths?.map(month =>
                            new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })
                        ).join('، ') || '';

                        return (
                            <div key={student.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {groups.find(g => g.id === student.groupId)?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-red-600">{totalDebt} ج.م</p>
                                            <p className="text-xs text-gray-500">إجمالي الدين</p>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                        <p className="text-sm font-semibold text-red-800 mb-1">الأشهر المستحقة:</p>
                                        <p className="text-sm text-red-700">{debtMonthsNames}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {student.debtMonths?.map(month => {
                                            const monthName = new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
                                            return (
                                                <button
                                                    key={month}
                                                    onClick={() => onPayDebt(student.id, month, student.monthlyFee)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                                >
                                                    دفع {monthName}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => onViewDetails(student)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                        >
                                            عرض التفاصيل
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow">
                        <h2 className="text-2xl font-semibold text-gray-600">لا يوجد مدينون</h2>
                        <p className="text-gray-400 mt-2">جميع الطلاب المؤرشفون قد سددوا مستحقاتهم</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default DebtorsPage;
