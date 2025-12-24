
import React, { useState, useMemo } from 'react';
import type { Group, Student, Teacher } from '../types';
import UserIcon from './icons/UserIcon';
import ClipboardXIcon from './icons/ClipboardXIcon';


interface UntestedStudentsPageProps {
  groups: Group[];
  students: Student[];
  teachers: Teacher[];
  onBack: () => void;
}

const UntestedStudentsPage: React.FC<UntestedStudentsPageProps> = ({ groups, students, teachers, onBack }) => {
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

  const untestedStudents = useMemo(() => {
    return students.filter(student =>
      !student.isArchived && !student.tests.some(test => test.date.startsWith(selectedMonth))
    );
  }, [students, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <ClipboardXIcon className="w-8 h-8 text-orange-600"/>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">تقرير الطلاب غير المختبرين</h1>
                    <p className="text-gray-500">عرض الطلاب الذين لم يتم اختبارهم في الشهر المحدد</p>
                </div>
            </div>
            <button
                onClick={onBack}
                className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-700 transition-all"
            >
                العودة
            </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="max-w-xs">
                <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير شهر</label>
                <select 
                    id="month-filter"
                    value={selectedMonth} 
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    {availableMonths.map(month => (
                         <option key={month} value={month}>{new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="space-y-8">
            {groups.map(group => {
                const groupUntestedStudents = untestedStudents.filter(s => s.groupId === group.id);
                const teacher = teachers.find(t => t.id === group.teacherId);
                
                return (
                    <div key={group.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                             <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                {group.name}
                                {teacher && <span className="text-sm text-gray-500 font-semibold mr-4">(المدرس: {teacher.name})</span>}
                            </h2>
                        </div>
                       
                        <div className="p-4">
                            {groupUntestedStudents.length > 0 ? (
                                <ul className="space-y-3">
                                    {groupUntestedStudents.map(student => (
                                        <li key={student.id} className="flex items-center bg-orange-50 p-3 rounded-lg">
                                            <UserIcon className="w-6 h-6 ml-3 text-orange-500"/>
                                            <span className="font-semibold text-gray-700">{student.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-green-600 font-semibold p-4">
                                    ✓ جميع الطلاب في هذه المجموعة تم اختبارهم هذا الشهر.
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
             {groups.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-600">لا توجد مجموعات لعرضها.</h2>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default UntestedStudentsPage;
