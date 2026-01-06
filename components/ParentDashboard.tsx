import React, { useState } from 'react';
import type { Student, Group } from '../types';
import UserIcon from './icons/UserIcon';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import XIcon from './icons/XIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';

interface ParentDashboardProps {
    students: Student[];
    groups: Group[];
    onViewStudent: (student: Student) => void;
    parentPhone: string;
    parentName: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ students, groups, onViewStudent, parentPhone, parentName }) => {
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [selectedStudentForLeave, setSelectedStudentForLeave] = useState<Student | null>(null);
    const [leaveDays, setLeaveDays] = useState(1);
    const [leaveReason, setLeaveReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenLeaveModal = (e: React.MouseEvent, student: Student) => {
        e.stopPropagation();
        setSelectedStudentForLeave(student);
        setIsLeaveModalOpen(true);
    };

    const handleSubmitLeave = async () => {
        if (!selectedStudentForLeave || !leaveReason) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'leaveRequests'), {
                studentId: selectedStudentForLeave.id,
                studentName: selectedStudentForLeave.name,
                parentId: parentPhone,
                parentPhone: parentPhone,
                parentName: parentName,
                days: leaveDays,
                reason: leaveReason,
                date: new Date().toISOString(),
                status: 'pending'
            });
            alert('تم إرسال طلب الإجازة بنجاح');
            setIsLeaveModalOpen(false);
            setLeaveReason('');
            setLeaveDays(1);
        } catch (error) {
            console.error('Error submitting leave request:', error);
            alert('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setIsSubmitting(false);
        }
    };
    // حساب إحصائيات لكل طالب
    const getStudentStats = (student: Student) => {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.substring(0, 7);

        // الحضور
        const totalAttendance = (student.attendance || []).length;
        const presentCount = (student.attendance || []).filter(a => a.status === 'present').length;

        // الاختبارات
        const recentTests = (student.tests || []).slice(-5);

        // المصروفات
        const currentMonthFee = (student.fees || []).find(f => f.month === currentMonth);
        const isPaidThisMonth = currentMonthFee?.paid || false;

        return {
            totalAttendance,
            presentCount,
            recentTests,
            isPaidThisMonth,
            currentMonthFee
        };
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500" dir="rtl">
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-8 w-2 bg-teal-500 rounded-full"></div>
                    <h2 className="text-2xl font-black text-gray-800">أبنائي الطلاب ({students.length})</h2>
                </div>

                {students.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UserIcon className="w-12 h-12 text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-xl font-bold">لا يوجد طلاب مسجلون بهذا الرقم</p>
                        <p className="text-gray-400 mt-2">يرجى مراجعة الإدارة لتحديث بياناتك</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {students.map(student => {
                            const stats = getStudentStats(student);
                            const group = groups.find(g => g.id === student.groupId);

                            return (
                                <div
                                    key={student.id}
                                    onClick={() => onViewStudent(student)}
                                    className="group relative bg-white rounded-[2.5rem] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full active:scale-[0.98]"
                                >
                                    {/* Accent Decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                                    {/* Card Header */}
                                    <div className="p-8 pb-4 relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-teal-500/20 text-white transform group-hover:rotate-6 transition-transform duration-500">
                                                <UserIcon className="w-8 h-8" />
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${stats.isPaidThisMonth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {stats.isPaidThisMonth ? 'مدفوع' : 'مطلوب سداد'}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-800 mb-1 group-hover:text-teal-600 transition-colors">{student.name}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                                            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                                            <p className="text-sm">{group?.name || 'غير محدد'}</p>
                                        </div>
                                    </div>

                                    {/* Summary Stats */}
                                    <div className="px-8 pb-8 pt-4 flex-1">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100">
                                                <p className="text-gray-400 text-xs font-bold mb-1">نسبة الحضور</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-gray-800">{stats.presentCount}</span>
                                                    <span className="text-gray-400 text-sm">/ {stats.totalAttendance}</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100">
                                                <p className="text-gray-400 text-xs font-bold mb-1">عدد الاختبارات</p>
                                                <span className="text-xl font-black text-gray-800">{stats.recentTests.length}</span>
                                                <span className="text-gray-400 text-xs mr-1">اختبارات</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-4 px-2">
                                            <button
                                                onClick={() => onViewStudent(student)}
                                                className="flex items-center gap-2 text-teal-600 font-black text-sm hover:gap-3 transition-all"
                                            >
                                                <span>عرض التفاصيل</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={(e) => handleOpenLeaveModal(e, student)}
                                                className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all border border-amber-100/50"
                                            >
                                                <CalendarCheckIcon className="w-4 h-4" />
                                                <span>طلب إجازة</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Leave Request Modal */}
            {isLeaveModalOpen && selectedStudentForLeave && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLeaveModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black text-gray-800">طلب إجازة</h3>
                                <button onClick={() => setIsLeaveModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-gray-500 font-bold mb-6">
                                تقديم طلب إجازة لـ: <span className="text-teal-600">{selectedStudentForLeave.name}</span>
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">عدد أيام الإجازة</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setLeaveDays(Math.max(1, leaveDays - 1))}
                                            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-600 hover:bg-gray-200"
                                        >-</button>
                                        <div className="flex-1 bg-gray-50 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-gray-800 border border-gray-100">
                                            {leaveDays} {leaveDays === 1 ? 'يوم' : leaveDays === 2 ? 'يومين' : 'أيام'}
                                        </div>
                                        <button
                                            onClick={() => setLeaveDays(leaveDays + 1)}
                                            className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-600 hover:bg-gray-200"
                                        >+</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">سبب الإجازة</label>
                                    <textarea
                                        value={leaveReason}
                                        onChange={(e) => setLeaveReason(e.target.value)}
                                        className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold text-gray-700 min-h-[120px]"
                                        placeholder="اكتب سبب الإجازة هنا..."
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleSubmitLeave}
                                    disabled={isSubmitting || !leaveReason.trim()}
                                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ParentDashboard);

