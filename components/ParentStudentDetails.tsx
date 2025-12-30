import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student, Group, Teacher } from '../types';
import { TestType, TestGrade, AttendanceStatus } from '../types';
import ArrowRightIcon from './icons/ArrowRightIcon';
import XIcon from './icons/XIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CashIcon from './icons/CashIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import HomeIcon from './icons/HomeIcon';

interface ParentStudentDetailsProps {
    student: Student;
    group: Group | undefined;
    teacher: Teacher | undefined;
    onClose: () => void;
    onOpenChat?: () => void;
    unreadMessagesCount?: number;
}

type TabType = 'tests' | 'fees' | 'attendance' | 'progress';

const ParentStudentDetails: React.FC<ParentStudentDetailsProps> = ({ student, group, teacher, onClose, onOpenChat, unreadMessagesCount }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('tests');

    // Test Type Translation
    const getTestTypeLabel = (type: TestType): string => {
        switch (type) {
            case TestType.NEW: return 'جديد';
            case TestType.RECENT_PAST: return 'قريب ماضي';
            case TestType.DISTANT_PAST: return 'بعيد ماضي';
            case TestType.READING: return 'قراءة';
            default: return type;
        }
    };

    // Test Grade Translation
    const getTestGradeLabel = (grade: TestGrade): { label: string; color: string } => {
        switch (grade) {
            case TestGrade.EXCELLENT: return { label: 'ممتاز', color: 'text-green-600 bg-green-100' };
            case TestGrade.VERY_GOOD: return { label: 'جيد جداً', color: 'text-blue-600 bg-blue-100' };
            case TestGrade.GOOD: return { label: 'جيد', color: 'text-yellow-600 bg-yellow-100' };
            case TestGrade.REPEAT: return { label: 'يعاد', color: 'text-red-600 bg-red-100' };
            default: return { label: grade, color: 'text-gray-600 bg-gray-100' };
        }
    };

    // Format Date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Render Tests Tab
    const renderTestsTab = () => {
        const sortedTests = [...(student.tests || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-800">سجل الاختبارات</h3>
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{(student.tests || []).length} اختبار</span>
                </div>

                {sortedTests.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">لا توجد اختبارات مسجلة حتى الآن</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {sortedTests.map(test => {
                            const gradeInfo = getTestGradeLabel(test.grade);
                            return (
                                <div key={test.id} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-lg font-black text-gray-800 mb-1">{test.suraName}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{getTestTypeLabel(test.type)}</span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm ${gradeInfo.color}`}>
                                            {gradeInfo.label}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs font-bold">{formatDate(test.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Render Fees Tab
    const renderFeesTab = () => {
        const sortedFees = [...(student.fees || [])].sort((a, b) => b.month.localeCompare(a.month));

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-800">حالة المصروفات</h3>
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black">
                        الرسوم: {student.monthlyFee} جنيه
                    </div>
                </div>

                {sortedFees.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">لم يتم تسجيل أي مصروفات للسداد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {sortedFees.map(fee => {
                            const monthDate = new Date(fee.month + '-01');
                            const monthName = monthDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });

                            return (
                                <div key={fee.month} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-50 p-2.5 rounded-xl">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-black text-gray-800">{monthName}</h4>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${fee.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {fee.paid ? 'تم السداد ✓' : 'لم يسدد ✗'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-gray-400 text-[10px] font-black uppercase mb-1">المبلغ المطلوب</p>
                                            <p className="font-black text-gray-800">{fee.amount} ج.م</p>
                                        </div>
                                        {fee.paid && (
                                            <div className="bg-green-50/30 p-4 rounded-2xl border border-green-100/50">
                                                <p className="text-green-600/50 text-[10px] font-black uppercase mb-1">تم دفع</p>
                                                <p className="font-black text-green-700">{fee.amountPaid} ج.م</p>
                                            </div>
                                        )}
                                    </div>

                                    {fee.paid && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-2">
                                            {fee.paymentDate && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <span>تاريخ السداد:</span>
                                                    <span className="text-gray-600">{formatDate(fee.paymentDate)}</span>
                                                </div>
                                            )}
                                            {fee.receiptNumber && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <span>رقم الإيصال:</span>
                                                    <span className="text-gray-600 tracking-wider">#{fee.receiptNumber}</span>
                                                </div>
                                            )}
                                            {fee.collectedByName && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                    <span>المُحصّل:</span>
                                                    <span className="text-gray-600">{fee.collectedByName}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Render Attendance Tab
    const renderAttendanceTab = () => {
        const sortedAttendance = [...(student.attendance || [])].sort((a, b) => b.date.localeCompare(a.date));
        const presentCount = (student.attendance || []).filter(a => a.status === AttendanceStatus.PRESENT).length;
        const absentCount = (student.attendance || []).filter(a => a.status === AttendanceStatus.ABSENT).length;

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-gray-800">بيانات الحصص</h3>

                {/* Modern Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-[2rem] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-2 rounded-xl shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-xs font-black text-green-700 uppercase">حضور</p>
                        </div>
                        <p className="text-4xl font-black text-green-600">{presentCount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-[2rem] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-2 rounded-xl shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-xs font-black text-red-700 uppercase">غياب</p>
                        </div>
                        <p className="text-4xl font-black text-red-600">{absentCount}</p>
                    </div>
                </div>

                {sortedAttendance.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">لم يتم تسجيل حضور حتى الآن</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto px-1">
                        {sortedAttendance.map((record, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === AttendanceStatus.PRESENT ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={record.status === AttendanceStatus.PRESENT ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-gray-700">{formatDate(record.date)}</span>
                                </div>
                                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${record.status === AttendanceStatus.PRESENT ? 'text-green-600' : 'text-red-600'}`}>
                                    {record.status === AttendanceStatus.PRESENT ? 'حاضر' : 'غائب'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render Progress Plan Tab
    const renderProgressTab = () => {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-gray-800">خطة السير والمنهج</h3>

                {student.progressPlan && Object.values(student.progressPlan).some(v => v) ? (
                    <div className="grid grid-cols-1 gap-6">
                        {student.progressPlan[TestType.NEW] && (
                            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/30 rounded-[2rem] p-8 border border-teal-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-teal-500 text-white p-2 rounded-xl shadow-lg shadow-teal-500/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-black text-teal-900 tracking-tight">الجديد (المقرر الحفظ)</h4>
                                </div>
                                <p className="text-teal-900/70 font-bold leading-relaxed pr-2 text-lg">{student.progressPlan[TestType.NEW]}</p>
                            </div>
                        )}

                        {(student.progressPlan[TestType.RECENT_PAST] || student.progressPlan[TestType.DISTANT_PAST]) && (
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8">
                                {student.progressPlan[TestType.RECENT_PAST] && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                            <h4 className="font-black text-blue-900">القريب الماضي</h4>
                                        </div>
                                        <p className="text-gray-600 font-bold leading-relaxed pr-4">{student.progressPlan[TestType.RECENT_PAST]}</p>
                                    </div>
                                )}

                                {student.progressPlan[TestType.DISTANT_PAST] && (
                                    <div className="pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                                            <h4 className="font-black text-purple-900">البعيد الماضي</h4>
                                        </div>
                                        <p className="text-gray-600 font-bold leading-relaxed pr-4">{student.progressPlan[TestType.DISTANT_PAST]}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-bold">لم يتم تحديد خطة سير للمنهج بعد</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-teal-50/20 to-blue-50/20 z-[100] flex flex-col" dir="rtl">
            {/* Header Section */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 pt-6 pb-5 px-4 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full -mr-24 -mt-24"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full -ml-24 -mb-24"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Back Button and Home Button */}
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={onClose}
                            className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-xl transition-all duration-300 text-gray-600 hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-indigo-100 hover:bg-indigo-200 p-2.5 rounded-xl transition-all duration-300 text-indigo-600 hover:scale-105 active:scale-95 shadow-sm"
                            title="الذهاب إلى الصفحة الرئيسية"
                        >
                            <HomeIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Student Name - Direct */}
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">{student.name}</h1>

                    {/* Group and Teacher Info in One Line */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Group - Direct Name Only */}
                        <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            <span className="text-xs md:text-sm font-bold text-gray-700">{group?.name || 'غير محدد'}</span>
                        </div>

                        {/* Teacher with Chat Icon */}
                        {teacher && (
                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs md:text-sm font-bold text-gray-700">أ/ {teacher.name}</span>

                                {/* Small Chat Icon */}
                                {onOpenChat && (
                                    <button
                                        onClick={onOpenChat}
                                        className="bg-teal-500 hover:bg-teal-600 p-1.5 rounded-lg transition-all duration-300 text-white hover:scale-110 active:scale-95 shadow-md shadow-teal-500/30 relative"
                                        title="المحادثة مع المدرس"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {unreadMessagesCount !== undefined && unreadMessagesCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                                {unreadMessagesCount}
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area - with bottom padding for navigation */}
            <div className="flex-1 overflow-y-auto pb-24">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    {activeTab === 'tests' && renderTestsTab()}
                    {activeTab === 'fees' && renderFeesTab()}
                    {activeTab === 'attendance' && renderAttendanceTab()}
                    {activeTab === 'progress' && renderProgressTab()}
                </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-inset-bottom">
                <div className="max-w-4xl mx-auto px-2">
                    <div className="flex w-full justify-around items-center py-2">
                        {[
                            {
                                id: 'tests' as TabType,
                                label: 'الاختبارات',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                )
                            },
                            {
                                id: 'fees' as TabType,
                                label: 'المصروفات',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                )
                            },
                            {
                                id: 'attendance' as TabType,
                                label: 'الحضور',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )
                            },
                            {
                                id: 'progress' as TabType,
                                label: 'الخطة',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                )
                            },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-300 relative group min-w-[70px] ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {/* Icon Container */}
                                <div className={`p-2 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/40 scale-110'
                                    : 'bg-gray-50 group-hover:bg-gray-100 group-hover:scale-105'
                                    }`}>
                                    {tab.icon}
                                </div>

                                {/* Label */}
                                <span className={`text-[10px] font-black whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-500'
                                    }`}>
                                    {tab.label}
                                </span>

                                {/* Active Indicator */}
                                {activeTab === tab.id && (
                                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-full shadow-[0_2px_8px_rgba(20,184,166,0.4)] animate-in slide-in-from-top-2 duration-300"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default React.memo(ParentStudentDetails);
