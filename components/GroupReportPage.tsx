
import React, { useState, useMemo } from 'react';
import type { Group, Student, Teacher, TestType, TestGrade, UserRole } from '../types';
import { AttendanceStatus as AttendanceEnum, TestGrade as TestGradeEnum, TestType as TestTypeEnum } from '../types';
import UserIcon from './icons/UserIcon';
import ClipboardXIcon from './icons/ClipboardXIcon';
import CreditCardOffIcon from './icons/CreditCardOffIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import XIcon from './icons/XIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import EditIcon from './icons/EditIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';


interface GroupReportPageProps {
    group: Group;
    students: Student[];
    teacher?: Teacher;
    onBack: () => void;
    currentUserRole?: UserRole;
}

const testTypeLabels: Record<TestType, string> = {
    [TestTypeEnum.NEW]: 'جديد',
    [TestTypeEnum.RECENT_PAST]: 'ماضي قريب',
    [TestTypeEnum.DISTANT_PAST]: 'بعيد',
    [TestTypeEnum.READING]: 'قراءة',
};

const testGradeInfo: Record<TestGrade, { label: string; className: string }> = {
    [TestGradeEnum.EXCELLENT]: { label: 'ممتاز', className: 'bg-green-100 text-green-800' },
    [TestGradeEnum.VERY_GOOD]: { label: 'جيد جداً', className: 'bg-blue-100 text-blue-800' },
    [TestGradeEnum.GOOD]: { label: 'جيد', className: 'bg-yellow-100 text-yellow-800' },
    [TestGradeEnum.REPEAT]: { label: 'يعاد', className: 'bg-red-100 text-red-800' },
};

const Th: React.FC<{ children: React.ReactNode, icon: React.ReactNode, title?: string }> = ({ children, icon, title }) => (
    <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="flex items-center gap-1" title={title || String(children)}>
            <div className="sm:hidden">{icon}</div>
            <span className="hidden sm:inline">{children}</span>
        </div>
    </th>
);

const GroupReportPage: React.FC<GroupReportPageProps> = ({ group, students, teacher, onBack, currentUserRole }) => {
    const [activeTab, setActiveTab] = useState<'summary' | 'attendance' | 'fees' | 'tests' | 'untested' | 'unpaid'>('summary');
    const [selectedPeriod, setSelectedPeriod] = useState<string>(() => new Date().toISOString().substring(0, 7)); // 'YYYY-MM' or 'last_3_months' etc
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const periodOptions = useMemo(() => {
        const months = new Set<string>();
        const now = new Date();
        let minDate = now;
        students.forEach(student => {
            const joiningDate = new Date(student.joiningDate);
            if (joiningDate < minDate) minDate = joiningDate;
        });
        let currentDate = new Date(minDate);
        currentDate.setDate(1);
        while (currentDate <= now) {
            months.add(currentDate.toISOString().substring(0, 7));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        const monthOptions = Array.from(months).sort().reverse().map(m => ({
            value: m,
            label: new Date(m + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })
        }));
        return [
            ...monthOptions,
            { value: 'last_3_months', label: 'آخر 3 أشهر' },
            { value: 'all_time', label: 'منذ البداية' },
        ];
    }, [students]);

    const reportMonths = useMemo(() => {
        if (selectedPeriod === 'last_3_months') {
            const months = [];
            const now = new Date();
            for (let i = 0; i < 3; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push(d.toISOString().substring(0, 7));
            }
            return months;
        }
        if (selectedPeriod === 'all_time') {
            return periodOptions
                .filter(opt => opt.value.match(/^\d{4}-\d{2}$/))
                .map(opt => opt.value)
                .sort();
        }
        return [selectedPeriod];
    }, [selectedPeriod, periodOptions]);

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    }, [students]);

    const attendanceReport = useMemo(() => {
        return sortedStudents.map(student => {
            const records = student.attendance.filter(a => reportMonths.some(m => a.date.startsWith(m)));
            const present = records.filter(a => a.status === AttendanceEnum.PRESENT).length;
            const absent = records.filter(a => a.status === AttendanceEnum.ABSENT).length;
            return { student, present, absent };
        });
    }, [sortedStudents, reportMonths]);

    const feesReport = useMemo(() => {
        const report = sortedStudents.map(student => {
            const paidAmount = student.fees
                .filter(f => reportMonths.includes(f.month) && f.paid)
                .reduce((sum, f) => sum + (f.amountPaid || 0), 0);

            const relevantMonths = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));

            const pendingMonths = relevantMonths.filter(m => !student.fees.some(f => f.month === m && f.paid));
            const pendingAmount = pendingMonths.reduce((sum, month) => sum + student.monthlyFee, 0);

            return { student, paidAmount, pendingAmount, pendingMonthsCount: pendingMonths.length };
        });
        const totalCollected = report.reduce((sum, record) => sum + record.paidAmount, 0);
        const totalPending = report.reduce((sum, r) => sum + r.pendingAmount, 0);
        return { details: report, summary: { totalCollected, totalPending } };
    }, [sortedStudents, reportMonths]);

    const testsReport = useMemo(() => {
        const allTests = sortedStudents.flatMap(student =>
            student.tests
                .filter(test => reportMonths.some(m => test.date.startsWith(m)))
                .map(test => ({ ...test, studentName: student.name, studentId: student.id }))
        );
        return allTests.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [sortedStudents, reportMonths, sortOrder]);

    const untestedStudents = useMemo(() => {
        return sortedStudents.filter(student =>
            !student.tests.some(test => reportMonths.some(m => test.date.startsWith(m)))
        );
    }, [sortedStudents, reportMonths]);

    const unpaidStudents = useMemo(() => {
        return sortedStudents.filter(student => {
            const relevantMonths = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));
            return relevantMonths.some(m => !student.fees.some(f => f.month === m && f.paid));
        });
    }, [sortedStudents, reportMonths]);

    const getTabClass = (tabName: 'summary' | 'attendance' | 'fees' | 'tests' | 'untested' | 'unpaid') => {
        const baseClass = "py-3 px-3 sm:px-6 font-semibold text-center transition-colors duration-200 focus:outline-none flex items-center justify-center gap-2 flex-grow sm:flex-grow-0";
        if (activeTab === tabName) {
            if (tabName === 'unpaid') return `${baseClass} border-b-2 border-red-600 text-red-600`;
            if (tabName === 'summary') return `${baseClass} border-b-2 border-blue-600 text-blue-600`;
            return `${baseClass} border-b-2 border-indigo-600 text-indigo-600`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    const handleComprehensiveWhatsAppShare = (student: Student) => {
        const periodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod;

        let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*\n`;
        message += `هذا هو تقرير الأداء من مركز الشاطبي عن فترة: *${periodLabel}*\n\n`;

        // Attendance
        const attendance = attendanceReport.find(r => r.student.id === student.id);
        if (attendance) {
            message += `*📝 الحضور والغياب:*\n`;
            message += `  - أيام الحضور: ${attendance.present}\n`;
            message += `  - أيام الغياب: ${attendance.absent}\n\n`;
        }

        // Fees
        const relevantMonths = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));
        const pendingFeeMonths = relevantMonths.filter(m => !student.fees.some(f => f.month === m && f.paid));

        message += `*💵 المصروفات:*\n`;
        if (pendingFeeMonths.length > 0) {
            const monthNames = pendingFeeMonths.map(m => new Date(m + '-02').toLocaleString('ar-EG', { month: 'long' })).join(', ');
            message += `  - يرجى ملاحظة أن مصروفات الشهور التالية لم تسدد بعد: *${monthNames}*.\n\n`;
        } else {
            message += `  - جميع مصروفات الفترة المحددة مسددة. شكراً لالتزامكم.\n\n`;
        }

        // Tests
        const tests = testsReport.filter(t => t.studentId === student.id);
        message += `*📖 الاختبارات:*\n`;
        if (tests.length > 0) {
            tests.forEach(test => {
                message += `  - ${new Date(test.date).toLocaleDateString('ar-EG')}: ${test.suraName} (${testTypeLabels[test.type]}) - التقدير: *${testGradeInfo[test.grade].label}*\n`;
            });
            message += `\n`;
        } else {
            message += `  - لم تسجل اختبارات للطالب/ة خلال هذه الفترة.\n\n`;
        }

        message += `مع تحيات إدارة المركز.`;

        const phone = student.phone.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 flex flex-wrap text-sm sm:text-base">
                    <button onClick={() => setActiveTab('summary')} className={getTabClass('summary')} title="التقرير الشامل">
                        <DocumentReportIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">التقرير الشامل</span>
                    </button>
                    <button onClick={() => setActiveTab('attendance')} className={getTabClass('attendance')} title="الحضور">
                        <CalendarCheckIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">الحضور</span>
                    </button>
                    <button onClick={() => setActiveTab('fees')} className={getTabClass('fees')} title="المصروفات">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">المصروفات</span>
                    </button>
                    <button onClick={() => setActiveTab('unpaid')} className={getTabClass('unpaid')} title="غير مسدد">
                        <CreditCardOffIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">غير مسدد</span>
                    </button>
                    <button onClick={() => setActiveTab('tests')} className={getTabClass('tests')} title="الاختبارات">
                        <ClipboardListIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">الاختبارات</span>
                    </button>
                    <button onClick={() => setActiveTab('untested')} className={getTabClass('untested')} title="غير مختبر">
                        <ClipboardXIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">غير مختبر</span>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 max-w-xs">
                        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير</label>
                        <select
                            id="month-filter"
                            value={selectedPeriod}
                            onChange={e => setSelectedPeriod(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {periodOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'summary' && (
                        <div className="space-y-4">
                            {sortedStudents.map(student => {
                                const attendance = attendanceReport.find(r => r.student.id === student.id);
                                const fees = feesReport.details.find(r => r.student.id === student.id);
                                const tests = testsReport.filter(t => t.studentId === student.id);
                                const periodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || selectedPeriod;

                                return (
                                    <div key={student.id} className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <UserIcon className="w-6 h-6 text-blue-600" />
                                                <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                                            </div>
                                            {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                                                <button
                                                    onClick={() => handleComprehensiveWhatsAppShare(student)}
                                                    className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-all text-sm"
                                                    title="إرسال التقرير الشامل عبر واتساب"
                                                >
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    <span className="hidden sm:inline">إرسال لولي الأمر</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-500 mb-3">ملخص الأداء عن فترة: <span className="font-semibold">{periodLabel}</span></p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white p-3 rounded-md">
                                                    <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">الحضور والغياب</h4>
                                                    <p>أيام الحضور: <span className="font-bold text-green-600">{attendance?.present || 0}</span></p>
                                                    <p>أيام الغياب: <span className="font-bold text-red-600">{attendance?.absent || 0}</span></p>
                                                </div>
                                                <div className="bg-white p-3 rounded-md">
                                                    <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">المصروفات</h4>
                                                    {fees && fees.pendingMonthsCount > 0 ? (
                                                        <p className="text-red-600">
                                                            لم تسدد مصروفات <span className="font-bold">{fees.pendingMonthsCount}</span> شهر
                                                        </p>
                                                    ) : (
                                                        <p className="text-green-600 font-semibold">✓ جميع المصروفات مسددة</p>
                                                    )}
                                                </div>
                                                <div className="bg-white p-3 rounded-md">
                                                    <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">الاختبارات</h4>
                                                    <p>إجمالي الاختبارات: <span className="font-bold text-blue-600">{tests.length}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <Th icon={<UserIcon className="w-5 h-5" />} title="اسم الطالب">اسم الطالب</Th>
                                        <Th icon={<CalendarCheckIcon className="w-5 h-5" />} title="إجمالي الحضور">إجمالي الحضور</Th>
                                        <Th icon={<XIcon className="w-5 h-5" />} title="إجمالي الغياب">إجمالي الغياب</Th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceReport.map(item => (
                                        <tr key={item.student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{item.present}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{item.absent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'fees' && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <Th icon={<UserIcon className="w-5 h-5" />} title="اسم الطالب">اسم الطالب</Th>
                                            <Th icon={<CurrencyDollarIcon className="w-5 h-5" />} title="إجمالي المدفوع">إجمالي المدفوع</Th>
                                            <Th icon={<CreditCardOffIcon className="w-5 h-5" />} title="إجمالي المتبقي">إجمالي المتبقي</Th>
                                            <Th icon={<ChartBarIcon className="w-5 h-5" />} title="شهور غير مسددة">شهور غير مسددة</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {feesReport.details.map(item => (
                                            <tr key={item.student.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{item.paidAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{item.pendingAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{item.pendingMonthsCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-6 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">الإجمالي المحصّل في الفترة</p>
                                    <p className="text-2xl font-bold text-green-600">{feesReport.summary.totalCollected.toLocaleString()} EGP</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">الإجمالي المتبقي في الفترة</p>
                                    <p className="text-2xl font-bold text-red-600">{feesReport.summary.totalPending.toLocaleString()} EGP</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'unpaid' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">الطلاب غير المسددين خلال الفترة</h3>
                            {unpaidStudents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {unpaidStudents.map(student => (
                                        <div key={student.id} className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                                            <div className="flex items-center">
                                                <UserIcon className="w-6 h-6 ml-3 text-red-500" />
                                                <span className="font-semibold text-gray-700">{student.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center bg-green-50 text-green-700 font-semibold p-6 rounded-lg border border-green-200">
                                    <p>✓ جميع الطلاب في هذه المجموعة سددوا مصروفات هذه الفترة.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'tests' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">ترتيب حسب التاريخ</label>
                                <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} className="w-full max-w-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                                    <option value="desc">الأحدث أولاً</option>
                                    <option value="asc">الأقدم أولاً</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <Th icon={<CalendarCheckIcon className="w-5 h-5" />} title="التاريخ">التاريخ</Th>
                                            <Th icon={<UserIcon className="w-5 h-5" />} title="الطالب">الطالب</Th>
                                            <Th icon={<ClipboardListIcon className="w-5 h-5" />} title="السورة">السورة</Th>
                                            <Th icon={<EditIcon className="w-5 h-5" />} title="النوع">النوع</Th>
                                            <Th icon={<CheckCircleIcon className="w-5 h-5" />} title="التقدير">التقدير</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {testsReport.length > 0 ? testsReport.map(test => (
                                            <tr key={test.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(test.date).toLocaleDateString('ar-EG')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.studentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{test.suraName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{testTypeLabels[test.type]}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full text-center ${testGradeInfo[test.grade].className}`}>
                                                        {testGradeInfo[test.grade].label}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-10 text-gray-500">لا توجد اختبارات مسجلة لهذه الفترة.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'untested' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">الطلاب غير المختبرين خلال الفترة</h3>
                            {untestedStudents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {untestedStudents.map(student => (
                                        <div key={student.id} className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-200">
                                            <div className="flex items-center">
                                                <UserIcon className="w-6 h-6 ml-3 text-orange-500" />
                                                <span className="font-semibold text-gray-700">{student.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center bg-green-50 text-green-700 font-semibold p-6 rounded-lg border border-green-200">
                                    <p>✓ جميع الطلاب في هذه المجموعة تم اختبارهم خلال هذه الفترة.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
};

export default GroupReportPage;
