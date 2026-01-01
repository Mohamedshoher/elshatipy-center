
import React from 'react';
import type { Teacher, TeacherAttendanceRecord } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CalendarUserIcon from './icons/CalendarUserIcon';
import { getCairoDateString, getCairoNow } from '../services/cairoTimeHelper';

interface TeacherAttendancePageProps {
    teachers: Teacher[];
    teacherAttendance: TeacherAttendanceRecord[];
    onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus) => void;
    onBack: () => void;
}

const TeacherAttendancePage: React.FC<TeacherAttendancePageProps> = ({ teachers, teacherAttendance, onSetTeacherAttendance, onBack }) => {
    const today = getCairoDateString();
    const todayFormatted = getCairoNow().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const activeTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <CalendarUserIcon className="w-8 h-8 text-cyan-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">تسجيل حضور وغياب المدرسين</h2>
                        <p className="text-gray-500">{todayFormatted}</p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-300 transition-all duration-300"
                >
                    العودة
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {activeTeachers.map(teacher => {
                        const todayAttendance = teacherAttendance.find(a => a.teacherId === teacher.id && a.date === today);
                        return (
                            <div key={teacher.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                                        <BriefcaseIcon className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <span className="font-semibold text-lg text-gray-700">{teacher.name}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.PRESENT)}
                                        className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${!todayAttendance || todayAttendance.status === TeacherAttendanceStatus.PRESENT
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                                            }`}
                                        aria-label={`تسجيل حضور لـ ${teacher.name}`}
                                    >
                                        حاضر
                                    </button>
                                    <button
                                        onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.ABSENT)}
                                        className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${todayAttendance?.status === TeacherAttendanceStatus.ABSENT
                                            ? 'bg-red-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                                            }`}
                                        aria-label={`تسجيل غياب لـ ${teacher.name}`}
                                    >
                                        غياب
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {activeTeachers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow">
                    <h2 className="text-2xl font-semibold text-gray-600">لا يوجد مدرسون نشطون.</h2>
                    <p className="text-gray-400 mt-2">قم بإضافة مدرس وتفعيله من قسم إدارة المدرسين.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendancePage;
