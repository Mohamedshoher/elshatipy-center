import React, { useState, useMemo } from 'react';
import type { Group, Student, TestType, TestGrade } from '../types';
import { AttendanceStatus as AttendanceEnum, TestGrade as TestGradeEnum, TestType as TestTypeEnum } from '../types';
import CreditCardOffIcon from './icons/CreditCardOffIcon';
import UserIcon from './icons/UserIcon';
import ClipboardXIcon from './icons/ClipboardXIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import UsersIcon from './icons/UsersIcon';
import XIcon from './icons/XIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import EditIcon from './icons/EditIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { getCairoDateString, getCairoNow } from '../services/cairoTimeHelper';

interface DirectorReportsPageProps {
    groups: Group[];
    students: Student[];
    onBack: () => void;
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

const DirectorReportsPage: React.FC<DirectorReportsPageProps> = ({ groups, students, onBack }) => {
    const [activeTab, setActiveTab] = useState<'attendance' | 'fees' | 'unpaid' | 'untested' | 'tests'>('untested');
    const [selectedMonth, setSelectedMonth] = useState<string>(() => getCairoDateString().substring(0, 7)); // YYYY-MM
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [untestedFilterType, setUntestedFilterType] = useState<TestType>(TestTypeEnum.NEW);


    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        const now = getCairoNow();
        let minDate = getCairoNow();

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

    const attendanceReport = useMemo(() => {
        const groupData = [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
            const studentsInGroup = students.filter(s => s.groupId === group.id && !s.isArchived);
            let present = 0;
            let absent = 0;
            studentsInGroup.forEach(student => {
                const records = student.attendance.filter(a => a.date.startsWith(selectedMonth));
                present += records.filter(a => a.status === AttendanceEnum.PRESENT).length;
                absent += records.filter(a => a.status === AttendanceEnum.ABSENT).length;
            });
            const total = present + absent;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(0) : 0;
            return { groupId: group.id, groupName: group.name, present, absent, percentage };
        });

        const totalPresent = groupData.reduce((sum, g) => sum + g.present, 0);
        const totalAbsent = groupData.reduce((sum, g) => sum + g.absent, 0);
        const overallTotal = totalPresent + totalAbsent;
        const overallPercentage = overallTotal > 0 ? ((totalPresent / overallTotal) * 100).toFixed(0) : 0;

        return { details: groupData, summary: { totalPresent, totalAbsent, overallPercentage } };
    }, [students, groups, selectedMonth]);

    const feesReport = useMemo(() => {
        const groupData = [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
            const studentsInGroup = students.filter(s => s.groupId === group.id && !s.isArchived);
            let collected = 0;
            studentsInGroup.forEach(student => {
                const feeRecord = student.fees.find(f => f.month === selectedMonth);
                if (feeRecord?.paid) {
                    collected += feeRecord.amountPaid || 0;
                }
            });
            const pendingAmount = studentsInGroup
                .filter(s => new Date(selectedMonth) >= new Date(s.joiningDate.substring(0, 7)) && !s.fees.some(f => f.month === selectedMonth && f.paid))
                .reduce((sum, s) => sum + s.monthlyFee, 0);

            return { groupId: group.id, groupName: group.name, collected, pendingAmount };
        });

        const totalCollected = groupData.reduce((sum, g) => sum + g.collected, 0);
        const totalPending = groupData.reduce((sum, g) => sum + g.pendingAmount, 0);

        return { details: groupData, summary: { totalCollected, totalPending } };
    }, [students, groups, selectedMonth]);

    const testsReport = useMemo(() => {
        const allTests = students
            .filter(s => !s.isArchived)
            .flatMap(student => {
                const group = groups.find(g => g.id === student.groupId);
                return student.tests.map(test => ({
                    ...test,
                    studentName: student.name,
                    groupName: group?.name || 'غير محدد'
                }));
            });
        const filtered = allTests.filter(test => test.date.startsWith(selectedMonth));
        return filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [students, groups, selectedMonth, sortOrder]);

    const unpaidReport = useMemo(() => {
        const details = [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
            const unpaidStudentsList = students
                .filter(s => s.groupId === group.id && !s.isArchived)
                .filter(student => {
                    const feeRecord = student.fees.find(f => f.month === selectedMonth);
                    return new Date(selectedMonth) >= new Date(student.joiningDate.substring(0, 7)) && (!feeRecord || !feeRecord.paid);
                });
            return {
                groupId: group.id,
                groupName: group.name,
                unpaidStudents: unpaidStudentsList,
                count: unpaidStudentsList.length,
            };
        });

        const totalUnpaid = details.reduce((sum, group) => sum + group.count, 0);

        return { details, summary: { totalUnpaid } };
    }, [students, groups, selectedMonth]);

    const untestedReport = useMemo(() => {
        const details = [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
            const untestedStudentsList = students
                .filter(s => s.groupId === group.id && !s.isArchived)
                .filter(student => {
                    const hasTestInMonth = student.tests.some(
                        test => test.date.startsWith(selectedMonth) && test.type === untestedFilterType
                    );
                    return !hasTestInMonth;
                });
            return {
                groupId: group.id,
                groupName: group.name,
                untestedStudents: untestedStudentsList,
                count: untestedStudentsList.length,
            };
        });

        const totalUntested = details.reduce((sum, group) => sum + group.count, 0);

        return { details, summary: { totalUntested } };
    }, [students, groups, selectedMonth, untestedFilterType]);

    const getTabClass = (tabName: 'attendance' | 'fees' | 'unpaid' | 'untested' | 'tests') => {
        const baseClass = "py-3 px-4 font-semibold text-center flex-grow sm:flex-grow-0 transition-colors duration-200 focus:outline-none flex items-center justify-center gap-2 text-sm sm:text-base";
        if (activeTab === tabName) {
            if (tabName === 'unpaid') {
                return `${baseClass} border-b-2 border-red-600 text-red-600`;
            }
            if (tabName === 'untested') {
                return `${baseClass} border-b-2 border-orange-600 text-orange-600`;
            }
            return `${baseClass} border-b-2 border-purple-600 text-purple-600`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 flex flex-wrap">
                    <button onClick={() => setActiveTab('attendance')} className={getTabClass('attendance')} title="الحضور">
                        <CalendarCheckIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">الحضور</span>
                    </button>
                    <button onClick={() => setActiveTab('fees')} className={getTabClass('fees')} title="المصروفات">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">المصروفات</span>
                    </button>
                    <button onClick={() => setActiveTab('unpaid')} className={getTabClass('unpaid')} title="لم يسددوا">
                        <CreditCardOffIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">لم يسددوا</span>
                    </button>
                    <button onClick={() => setActiveTab('untested')} className={getTabClass('untested')} title="لم يختبروا">
                        <ClipboardXIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">لم يختبروا</span>
                    </button>
                    <button onClick={() => setActiveTab('tests')} className={getTabClass('tests')} title="الاختبارات">
                        <ClipboardListIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">الاختبارات</span>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 max-w-xs">
                        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير شهر</label>
                        <select
                            id="month-filter"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {availableMonths.map(month => (
                                <option key={month} value={month}>{new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'attendance' && (
                        <div>
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">إجمالي الحضور</p>
                                    <p className="text-3xl font-bold text-green-600">{attendanceReport.summary.totalPresent}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">إجمالي الغياب</p>
                                    <p className="text-3xl font-bold text-red-600">{attendanceReport.summary.totalAbsent}</p>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-sm text-gray-500">النسبة الإجمالية للحضور</p>
                                    <p className="text-3xl font-bold text-blue-600">{attendanceReport.summary.overallPercentage}%</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <Th icon={<UsersIcon className="w-5 h-5" />}>المجموعة</Th>
                                            <Th icon={<CalendarCheckIcon className="w-5 h-5" />}>أيام الحضور</Th>
                                            <Th icon={<XIcon className="w-5 h-5" />}>أيام الغياب</Th>
                                            <Th icon={<ChartBarIcon className="w-5 h-5" />}>نسبة الحضور</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {attendanceReport.details.map(item => (
                                            <tr key={item.groupId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.groupName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{item.present}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{item.absent}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fees' && (
                        <div>
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">الإجمالي المحصّل</p>
                                    <p className="text-3xl font-bold text-green-600">{feesReport.summary.totalCollected.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">الإجمالي المتبقي (تقريبي)</p>
                                    <p className="text-3xl font-bold text-red-600">{feesReport.summary.totalPending.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <Th icon={<UsersIcon className="w-5 h-5" />}>المجموعة</Th>
                                            <Th icon={<CurrencyDollarIcon className="w-5 h-5" />}>المبلغ المحصّل</Th>
                                            <Th icon={<CreditCardOffIcon className="w-5 h-5" />}>المبلغ المتبقي</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {feesReport.details.map(item => (
                                            <tr key={item.groupId}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.groupName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{item.collected.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{item.pendingAmount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'unpaid' && (
                        <div>
                            <div className="mb-6 p-4 bg-red-50 rounded-lg text-center">
                                <p className="text-sm text-red-700">إجمالي الطلاب غير المسددين</p>
                                <p className="text-3xl font-bold text-red-600">{unpaidReport.summary.totalUnpaid}</p>
                            </div>
                            {unpaidReport.summary.totalUnpaid > 0 ? (
                                <div className="space-y-6">
                                    {unpaidReport.details
                                        .filter(group => group.unpaidStudents.length > 0)
                                        .map(group => (
                                            <div key={group.groupId} className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-bold text-lg text-gray-700 mb-3">{group.groupName} ({group.count} طلاب)</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {group.unpaidStudents.sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(student => (
                                                        <div key={student.id} className="flex items-center bg-white p-2 rounded-md border border-red-200 shadow-sm">
                                                            <UserIcon className="w-5 h-5 ml-2 text-red-500" />
                                                            <span className="font-semibold text-sm text-gray-800">{student.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center bg-green-50 text-green-700 font-semibold p-6 rounded-lg border border-green-200">
                                    <p>✓ جميع الطلاب في المركز سددوا مصروفات هذا الشهر.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'untested' && (
                        <div>
                            <div className="mb-4 max-w-xs">
                                <label htmlFor="untested-type-filter" className="block text-sm font-medium text-gray-600 mb-1">تصفية حسب نوع الاختبار</label>
                                <select
                                    id="untested-type-filter"
                                    value={untestedFilterType}
                                    onChange={e => setUntestedFilterType(e.target.value as TestType)}
                                    className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value={TestTypeEnum.NEW}>{testTypeLabels[TestTypeEnum.NEW]}</option>
                                    <option value={TestTypeEnum.RECENT_PAST}>{testTypeLabels[TestTypeEnum.RECENT_PAST]}</option>
                                    <option value={TestTypeEnum.DISTANT_PAST}>{testTypeLabels[TestTypeEnum.DISTANT_PAST]}</option>
                                </select>
                            </div>

                            <div className="mb-6 p-4 bg-orange-50 rounded-lg text-center">
                                <p className="text-sm text-orange-700">إجمالي الطلاب غير المختبرين ({testTypeLabels[untestedFilterType]})</p>
                                <p className="text-3xl font-bold text-orange-600">{untestedReport.summary.totalUntested}</p>
                            </div>
                            {untestedReport.summary.totalUntested > 0 ? (
                                <div className="space-y-6">
                                    {untestedReport.details
                                        .filter(group => group.untestedStudents.length > 0)
                                        .map(group => (
                                            <div key={group.groupId} className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-bold text-lg text-gray-700 mb-3">{group.groupName} ({group.count} طلاب)</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {group.untestedStudents.sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(student => (
                                                        <div key={student.id} className="flex items-center bg-white p-2 rounded-md border border-orange-200 shadow-sm">
                                                            <UserIcon className="w-5 h-5 ml-2 text-orange-500" />
                                                            <span className="font-semibold text-sm text-gray-800">{student.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center bg-green-50 text-green-700 font-semibold p-6 rounded-lg border border-green-200">
                                    <p>✓ جميع الطلاب في المركز تم اختبارهم ({testTypeLabels[untestedFilterType]}) هذا الشهر.</p>
                                </div>
                            )}
                        </div>
                    )}


                    {activeTab === 'tests' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">ترتيب حسب التاريخ</label>
                                <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} className="w-full max-w-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white">
                                    <option value="desc">الأحدث أولاً</option>
                                    <option value="asc">الأقدم أولاً</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <Th icon={<CalendarCheckIcon className="w-5 h-5" />}>التاريخ</Th>
                                            <Th icon={<UserIcon className="w-5 h-5" />}>الطالب</Th>
                                            <Th icon={<UsersIcon className="w-5 h-5" />}>المجموعة</Th>
                                            <Th icon={<ClipboardListIcon className="w-5 h-5" />}>السورة</Th>
                                            <Th icon={<EditIcon className="w-5 h-5" />}>النوع</Th>
                                            <Th icon={<CheckCircleIcon className="w-5 h-5" />}>التقدير</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {testsReport.length > 0 ? testsReport.map(test => (
                                            <tr key={test.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(test.date).toLocaleDateString('ar-EG')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.studentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{test.groupName}</td>
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
                                                <td colSpan={6} className="text-center py-10 text-gray-500">لا توجد اختبارات مسجلة لهذا الشهر.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DirectorReportsPage;