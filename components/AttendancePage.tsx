
import React from 'react';
import type { Student, AttendanceStatus } from '../types';
import { AttendanceStatus as AttendanceEnum } from '../types';
import UserIcon from './icons/UserIcon';

interface AttendancePageProps {
  students: Student[];
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onBack: () => void;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ students, onToggleAttendance, onBack }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">تسجيل الحضور والغياب</h2>
                <p className="text-gray-500">{todayFormatted}</p>
            </div>
            <button
                onClick={onBack}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-300 transition-all duration-300"
            >
                العودة للطلاب
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {students.map(student => {
                    const todayAttendance = student.attendance.find(a => a.date === today);
                    return (
                        <li key={student.id} className="p-4 flex items-center justify-between transition-colors hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <UserIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="font-semibold text-lg text-gray-700">{student.name}</span>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onToggleAttendance(student.id, today, AttendanceEnum.PRESENT)}
                                    className={`py-2 px-5 rounded-lg font-semibold text-sm transition-all ${
                                        todayAttendance?.status === AttendanceEnum.PRESENT 
                                        ? 'bg-green-600 text-white shadow-md' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                                    }`}
                                    aria-label={`تسجيل حضور لـ ${student.name}`}
                                >
                                    حضور
                                </button>
                                <button
                                    onClick={() => onToggleAttendance(student.id, today, AttendanceEnum.ABSENT)}
                                    className={`py-2 px-5 rounded-lg font-semibold text-sm transition-all ${
                                        todayAttendance?.status === AttendanceEnum.ABSENT 
                                        ? 'bg-red-600 text-white shadow-md' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-red-200'
                                    }`}
                                    aria-label={`تسجيل غياب لـ ${student.name}`}
                                >
                                    غياب
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
        {students.length === 0 && (
             <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-600">لا يوجد طلاب لإظهارهم</h2>
                <p className="text-gray-400 mt-2">قم بإضافة طالب أولاً من الشاشة الرئيسية.</p>
            </div>
        )}
    </div>
  );
};

export default AttendancePage;
