import React, { useState, useMemo } from 'react';
import { parseCairoDateString, getCairoNow } from '../services/cairoTimeHelper';
import type { Group, Student, Teacher } from '../types';
import UserIcon from './icons/UserIcon';
import CreditCardOffIcon from './icons/CreditCardOffIcon';
interface UnpaidStudentsPageProps {
    groups: Group[];
    students: Student[];
    teachers: Teacher[];
    onBack: () => void;
}

const UnpaidStudentsPage: React.FC<UnpaidStudentsPageProps> = ({ groups, students, teachers, onBack }) => {
    const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().substring(0, 7));

    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        const now = new Date();
        let minDate = now;

        students.forEach(student => {
            const joiningDate = new Date(student.joiningDate);
            if (joiningDate < minDate) {
                minDate = joiningDate;
            }
        });

        let currentDate = new Date(minDate);
        currentDate.setDate(1);

        while (currentDate <= now) {
            months.add(currentDate.toISOString().substring(0, 7));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return Array.from(months).sort().reverse();
    }, [students]);

    const unpaidStudents = useMemo(() => {
        const now = getCairoNow();
        const [year, monthNum] = selectedMonth.split('-').map(Number);
        const lastDayDate = new Date(year, monthNum, 0); // Last day of selected month
        const checkDate = now < lastDayDate ? now : lastDayDate;
        checkDate.setHours(0, 0, 0, 0);

        return students.filter(student => {
            const isFeeDue = selectedMonth >= student.joiningDate.substring(0, 7);
            if (!isFeeDue) return false;

            // Count attendance days in the selected month
            const attendanceInMonth = student.attendance.filter(record => {
                return record.date.startsWith(selectedMonth) && record.status === 'present';
            }).length;

            // New rule: Student must attend 10+ sessions OR be in an 'Iqraa' group
            const group = groups.find(g => g.id === student.groupId);
            const isIqraaGroup = group?.name.includes('إقراء') || group?.name.includes('اقراء');

            if (!isIqraaGroup && attendanceInMonth < 10) return false;

            // New 15-day rule from joining date
            const joiningDate = parseCairoDateString(student.joiningDate);
            joiningDate.setHours(0, 0, 0, 0);
            const diffTime = checkDate.getTime() - joiningDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 15) {
                return false;
            }

            const feeRecord = student.fees.find(f => f.month === selectedMonth);
            return !feeRecord || !feeRecord.paid;
        });
    }, [students, selectedMonth]);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="max-w-xs">
                    <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير شهر</label>
                    <select
                        id="month-filter"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {availableMonths.map(month => (
                            <option key={month} value={month}>{new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-8">
                {[...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
                    const groupUnpaidStudents = unpaidStudents.filter(s => s.groupId === group.id);
                    const teacher = teachers.find(t => t.id === group.teacherId);

                    if (groupUnpaidStudents.length === 0) {
                        return null;
                    }

                    return (
                        <div key={group.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    {group.name}
                                    {teacher && <span className="text-sm text-gray-500 font-semibold mr-4">(المدرس: {teacher.name})</span>}
                                </h2>
                            </div>

                            <div className="p-4">
                                <ul className="space-y-3">
                                    {groupUnpaidStudents.map(student => (
                                        <li key={student.id} className="flex items-center bg-red-50 p-3 rounded-lg">
                                            <UserIcon className="w-6 h-6 ml-3 text-red-500" />
                                            <span className="font-semibold text-gray-700">{student.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
                {unpaidStudents.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center text-green-700 font-semibold">
                        <p>✓ جميع الطلاب في المركز سددوا مصروفات هذا الشهر.</p>
                    </div>
                )}
                {groups.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-600">لا توجد مجموعات لعرضها.</h2>
                    </div>
                )}
            </div>
        </main>
    );
};

export default UnpaidStudentsPage;