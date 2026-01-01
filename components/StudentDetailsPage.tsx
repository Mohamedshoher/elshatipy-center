
import React, { useState, useMemo, useEffect } from 'react';
import type { Student, TestRecord, TestType, TestGrade, AttendanceStatus, FeePayment, Note, WeeklySchedule, DayOfWeek, ProgressPlan, CurrentUser, ProgressPlanRecord } from '../types';
import { TestType as TestTypeEnum, TestGrade as TestGradeEnum, AttendanceStatus as AttendanceStatusEnum } from '../types';
import DocumentReportIcon from './icons/DocumentReportIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ClockIcon from './icons/ClockIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CheckIcon from './icons/CheckIcon';

interface StudentDetailsPageProps {
    student: Student;
    initialTab: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports';
    currentUser: CurrentUser | null;
    notes: Note[];
    onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
    onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
    onDeleteTest: (studentId: string, testId: string) => void;
    onAddNote: (studentId: string, content: string) => void;
    onSaveProgressPlan: (studentId: string, plan: ProgressPlan, authorName: string) => void;
    onUpdatePlanRecord: (studentId: string, updatedRecord: ProgressPlanRecord, modifierName: string) => void;
    onTogglePlanCompletion: (studentId: string, planId: string) => void;
    onDeletePlanRecord: (studentId: string, planId: string) => void;
    onCancelFeePayment: (studentId: string, month: string) => void;
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

const StudentDetailsPage: React.FC<StudentDetailsPageProps> = (props) => {
    const { student, initialTab, currentUser, notes, onOpenFeeModal, onAddTest, onDeleteTest, onAddNote, onSaveProgressPlan, onUpdatePlanRecord, onTogglePlanCompletion, onDeletePlanRecord, onCancelFeePayment, onBack } = props;

    const [activeTab, setActiveTab] = useState(initialTab);
    const [suraName, setSuraName] = useState('');
    const [testType, setTestType] = useState<TestType>(TestTypeEnum.NEW);
    const [testGrade, setTestGrade] = useState<TestGrade>(TestGradeEnum.EXCELLENT);
    const [newNote, setNewNote] = useState('');

    const [testMonthFilter, setTestMonthFilter] = useState('all');
    const [testTypeFilter, setTestTypeFilter] = useState<'all' | TestType>('all');
    const [testSortOrder, setTestSortOrder] = useState<'asc' | 'desc'>('desc');
    const [attendanceMonthFilter, setAttendanceMonthFilter] = useState('all');
    const [attendanceSortOrder, setAttendanceSortOrder] = useState<'asc' | 'desc'>('desc');
    const [reportPeriod, setReportPeriod] = useState<string>(() => new Date().toISOString().substring(0, 7));
    const [newPlan, setNewPlan] = useState<ProgressPlan>({});

    const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
    const [editingPlanData, setEditingPlanData] = useState<ProgressPlan>({});

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveTab(initialTab);
        setNewPlan({ [TestTypeEnum.NEW]: '', [TestTypeEnum.RECENT_PAST]: '', [TestTypeEnum.DISTANT_PAST]: '' });
        setEditingPlanId(null);
    }, [student.id, initialTab]);

    const monthsSinceJoining = useMemo(() => {
        const months: { month: string, name: string }[] = [];
        const joiningDate = new Date(student.joiningDate);
        const now = new Date();

        let currentDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);
        const endYear = now.getFullYear();
        const endMonth = now.getMonth();

        while (
            currentDate.getFullYear() < endYear ||
            (currentDate.getFullYear() === endYear && currentDate.getMonth() <= endMonth)
        ) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const monthKey = `${year}-${month}`;
            const monthName = currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
            months.push({ month: monthKey, name: monthName });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return months.reverse();
    }, [student.joiningDate]);

    const periodOptions = useMemo(() => {
        const months = new Set<string>();
        const now = new Date();
        let minDate = new Date(student.joiningDate);
        minDate.setDate(1);
        let currentDate = new Date(minDate);
        while (currentDate <= now) {
            months.add(currentDate.toISOString().substring(0, 7));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        const monthOptions = Array.from(months).sort().reverse().map(m => ({
            value: m,
            label: new Date(m + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })
        }));
        return [
            { value: 'current_week', label: 'الأسبوع الحالي' },
            { value: 'last_week', label: 'الأسبوع الماضي' },
            ...monthOptions,
            { value: 'last_3_months', label: 'آخر 3 أشهر' },
            { value: 'all_time', label: 'منذ البداية' },
        ];
    }, [student.joiningDate]);

    const reportMonths = useMemo(() => {
        if (reportPeriod === 'last_3_months') {
            const months = [];
            const now = new Date();
            for (let i = 0; i < 3; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push(d.toISOString().substring(0, 7));
            }
            return months;
        }
        if (reportPeriod === 'all_time') {
            return periodOptions
                .filter(opt => opt.value.match(/^\d{4}-\d{2}$/))
                .map(opt => opt.value)
                .sort();
        }
        return [reportPeriod];
    }, [reportPeriod, periodOptions]);

    const comprehensiveReportData = useMemo(() => {
        let filterFn: (date: string) => boolean;

        if (reportPeriod === 'current_week' || reportPeriod === 'last_week') {
            const now = new Date();
            const day = now.getDay();
            const dayIndex = (day + 1) % 7;

            const start = new Date(now);
            start.setDate(now.getDate() - dayIndex);
            start.setHours(0, 0, 0, 0);

            if (reportPeriod === 'last_week') {
                start.setDate(start.getDate() - 7);
            }

            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);

            filterFn = (dateStr: string) => {
                const d = new Date(dateStr);
                return d >= start && d <= end;
            };
        } else {
            filterFn = (dateStr: string) => reportMonths.some(m => dateStr.startsWith(m));
        }

        const attendanceRecords = student.attendance.filter(a => filterFn(a.date));
        const present = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.PRESENT).length;
        const absent = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.ABSENT).length;

        const relevantMonthsForFees = reportPeriod.includes('week')
            ? [new Date().toISOString().substring(0, 7)]
            : reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));

        const pendingFeeMonths = relevantMonthsForFees.filter(m => !student.fees.some(f => f.month === m && f.paid));

        const testsInPeriod = student.tests
            .filter(test => filterFn(test.date))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const latestTest = testsInPeriod[0] || null;

        const findLatestTestByType = (type: TestType): TestRecord | null => {
            return testsInPeriod.find(test => test.type === type) || null;
        };

        const latestNewTest = findLatestTestByType(TestTypeEnum.NEW);
        const latestRecentPastTest = findLatestTestByType(TestTypeEnum.RECENT_PAST);
        const latestDistantPastTest = findLatestTestByType(TestTypeEnum.DISTANT_PAST);

        return {
            present,
            absent,
            pendingMonthsCount: pendingFeeMonths.length,
            latestTest,
            latestNewTest,
            latestRecentPastTest,
            latestDistantPastTest
        };
    }, [student, reportMonths, reportPeriod]);

    const getUniqueMonths = (records: { date: string }[]) => {
        if (!records) return [];
        const months = new Set<string>();
        records.forEach(record => {
            months.add(record.date.substring(0, 7));
        });
        return Array.from(months).sort().reverse();
    };

    const testMonths = useMemo(() => getUniqueMonths(student.tests || []), [student.tests]);
    const attendanceMonths = useMemo(() => getUniqueMonths(student.attendance || []), [student.attendance]);

    const filteredAndSortedTests = useMemo(() => {
        let tests = [...student.tests];
        if (testMonthFilter !== 'all') {
            tests = tests.filter(test => test.date.startsWith(testMonthFilter));
        }
        if (testTypeFilter !== 'all') {
            tests = tests.filter(test => test.type === testTypeFilter);
        }
        tests.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return testSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return tests;
    }, [student.tests, testMonthFilter, testTypeFilter, testSortOrder]);

    const filteredAndSortedAttendance = useMemo(() => {
        const sorted = [...student.attendance].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return attendanceSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        if (attendanceMonthFilter === 'all') {
            return sorted;
        }
        return sorted.filter(record => record.date.startsWith(attendanceMonthFilter));
    }, [student.attendance, attendanceMonthFilter, attendanceSortOrder]);

    const handleAddTestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suraName) {
            alert('يرجى إدخال اسم السورة.');
            return;
        }
        onAddTest(student.id, { suraName, type: testType, grade: testGrade });
        setSuraName('');
        setTestType(TestTypeEnum.NEW);
        setTestGrade(TestGradeEnum.EXCELLENT);
    };

    const handleDeleteTestClick = (studentId: string, testId: string) => {
        if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا الاختبار؟ لا يمكن التراجع عن هذا الإجراء.")) {
            onDeleteTest(studentId, testId);
        }
    };

    const handleAddNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.trim() === '') return;
        onAddNote(student.id, newNote.trim());
        setNewNote('');
    };

    const getTabClass = (tabName: 'fees' | 'reports' | 'tests' | 'attendanceLog' | 'notes' | 'progressPlan') => {
        const baseClass = "py-3 px-2 font-semibold text-center transition-colors duration-200 focus:outline-none flex-shrink-0 flex items-center justify-center gap-2 flex-grow text-sm";
        if (activeTab === tabName) {
            return `${baseClass} border-b-2 border-blue-600 text-blue-600 bg-blue-50`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    const handleComprehensiveWhatsAppShare = () => {
        if (!comprehensiveReportData) return;
        const periodLabel = periodOptions.find(p => p.value === reportPeriod)?.label || reportPeriod;

        let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*\n`;
        message += `هذا هو تقرير الأداء من مركز الشاطبي عن فترة: *${periodLabel}*\n\n`;

        message += `*📝 الحضور والغياب:*\n`;
        message += `  - أيام الحضور: ${comprehensiveReportData.present}\n`;
        message += `  - أيام الغياب: ${comprehensiveReportData.absent}\n\n`;

        if (!reportPeriod.includes('week')) {
            const relevantMonthsForFees = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));
            const pendingFeeMonths = relevantMonthsForFees.filter(m => !student.fees.some(f => f.month === m && f.paid));

            message += `*💵 المصروفات:*\n`;
            if (pendingFeeMonths.length > 0) {
                const monthNames = pendingFeeMonths.map(m => new Date(m + '-02').toLocaleString('ar-EG', { month: 'long' })).join(', ');
                message += `  - يرجى ملاحظة أن مصروفات الشهور التالية لم تسدد بعد: *${monthNames}*.\n\n`;
            } else {
                message += `  - جميع مصروفات الفترة المحددة مسددة. شكراً لالتزامكم.\n\n`;
            }
        }

        message += `*📖 الاختبارات:*\n`;
        const testsSummary = [
            { label: 'آخر اختبار', test: comprehensiveReportData.latestTest },
            { label: 'الجديد', test: comprehensiveReportData.latestNewTest },
            { label: 'الماضي القريب', test: comprehensiveReportData.latestRecentPastTest },
            { label: 'الماضي البعيد', test: comprehensiveReportData.latestDistantPastTest }
        ];

        const hasTests = testsSummary.some(item => item.test);

        if (hasTests) {
            testsSummary.forEach(({ label, test }) => {
                if (test) {
                    message += `  - ${label}: ${test.suraName} - *${testGradeInfo[test.grade].label}*\n`;
                } else {
                    message += `  - ${label}: لم يسجل\n`;
                }
            });
            message += `\n`;
        } else {
            message += `  - لم تسجل اختبارات للطالب/ة خلال هذه الفترة.\n\n`;
        }

        message += `مع تحيات إدارة المركز.`;

        let phone = student.phone.replace(/[^0-9]/g, '');
        // حذف أي أصفار زائدة في البداية
        phone = phone.replace(/^0+/, '');

        // إذا كان الرقم يبدأ بـ 1 (موبايل مصري) نضيف له 20
        if (phone.startsWith('1') && phone.length === 10) {
            phone = '20' + phone;
        }

        const encodedMessage = encodeURIComponent(message);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // للموبايل: نستخدم api.whatsapp لفتح التطبيق مباشرة
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, '_blank');
        } else {
            // للكمبيوتر: نستخدم web.whatsapp في نافذة ثابتة لتجنب تعدد التبويبات
            window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, 'whatsapp_window');
        }
    };

    const handleWhatsAppSharePlan = (plan: ProgressPlan) => {
        const newGoal = plan[TestTypeEnum.NEW] || 'غير محدد';
        const recentGoal = plan[TestTypeEnum.RECENT_PAST] || 'غير محدد';
        const distantGoal = plan[TestTypeEnum.DISTANT_PAST] || 'غير محدد';

        let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*.\n`;
        message += `نرحب بكم في مركز الشاطبي ويسعدنا أن نشارككم خطة سير الطالب/ة:\n\n`;
        message += `- الجديد: ${newGoal}\n`;
        message += `- الماضي القريب: ${recentGoal}\n`;
        message += `- الماضي البعيد: ${distantGoal}\n\n`;
        message += `مع تحيات إدارة المركز.`;

        let phone = student.phone.replace(/[^0-9]/g, '');
        // حذف أي أصفار زائدة في البداية
        phone = phone.replace(/^0+/, '');

        // إذا كان الرقم يبدأ بـ 1 (موبايل مصري) نضيف له 20
        if (phone.startsWith('1') && phone.length === 10) {
            phone = '20' + phone;
        }

        if (!phone) {
            alert("لا يوجد رقم هاتف مسجل لهذا الطالب.");
            return;
        }
        const encodedMessage = encodeURIComponent(message);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // للموبايل: نستخدم api.whatsapp لفتح التطبيق مباشرة
            window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, '_blank');
        } else {
            // للكمبيوتر: نستخدم web.whatsapp في نافذة ثابتة لتجنب تعدد التبويبات
            window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, 'whatsapp_window');
        }
    };

    if (!comprehensiveReportData) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20 sm:pb-0">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{student.name}</h1>
                </div>
                {/* Tabs */}
                <div className="bg-white border-t border-gray-200 overflow-x-auto">
                    <div className="container mx-auto flex">
                        <button onClick={() => setActiveTab('attendanceLog')} className={getTabClass('attendanceLog')} title="سجل الحضور">
                            <CalendarCheckIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">سجل الحضور</span>
                        </button>
                        <button onClick={() => setActiveTab('progressPlan')} className={getTabClass('progressPlan')} title="خطة السير">
                            <ClockIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">خطة السير</span>
                        </button>
                        <button onClick={() => setActiveTab('tests')} className={getTabClass('tests')} title="الاختبارات">
                            <ClipboardListIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">الاختبارات</span>
                        </button>
                        <button onClick={() => setActiveTab('fees')} className={getTabClass('fees')} title="المصروفات">
                            <CurrencyDollarIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">المصروفات</span>
                        </button>
                        <button onClick={() => setActiveTab('notes')} className={getTabClass('notes')} title="الملاحظات">
                            <EditIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">الملاحظات</span>
                        </button>
                        <button onClick={() => setActiveTab('reports')} className={getTabClass('reports')} title="التقرير الشامل">
                            <DocumentReportIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">التقرير الشامل</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto p-4 flex-grow">
                {activeTab === 'attendanceLog' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-700">سجل الحضور والغياب</h4>
                            <div className="flex gap-2">
                                <select value={attendanceMonthFilter} onChange={e => setAttendanceMonthFilter(e.target.value)} className="text-sm px-2 py-1 border rounded-md bg-white">
                                    <option value="all">كل الشهور</option>
                                    {attendanceMonths.map(m => <option key={m} value={m}>{new Date(m + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>)}
                                </select>
                                <select value={attendanceSortOrder} onChange={e => setAttendanceSortOrder(e.target.value as 'asc' | 'desc')} className="text-sm px-2 py-1 border rounded-md bg-white">
                                    <option value="desc">الأحدث أولاً</option>
                                    <option value="asc">الأقدم أولاً</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredAndSortedAttendance.length > 0 ? filteredAndSortedAttendance.map(record => (
                                <div key={record.date} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <span className="font-medium text-gray-700">{new Date(record.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    {record.status === AttendanceStatusEnum.PRESENT ? (
                                        <span className="px-4 py-1.5 text-sm font-bold bg-green-100 text-green-700 rounded-full">حاضر</span>
                                    ) : (
                                        <span className="px-4 py-1.5 text-sm font-bold bg-red-100 text-red-700 rounded-full">غائب</span>
                                    )}
                                </div>
                            )) : <p className="text-gray-500 text-center py-20 bg-white rounded-xl">لا يوجد سجل حضور مسجل.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'progressPlan' && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm mb-8">
                            <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ClockIcon className="w-6 h-6 text-blue-600" />
                                إضافة خطة جديدة
                            </h4>
                            <div className="space-y-6">
                                {Object.values(TestTypeEnum).filter(v => v !== TestTypeEnum.READING).map(type => (
                                    <div key={type}>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{testTypeLabels[type]}</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                value={newPlan[type] || ''}
                                                onChange={(e) => setNewPlan(p => ({ ...p, [type]: e.target.value }))}
                                                rows={2}
                                                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                                                placeholder={`أدخل هدف ${testTypeLabels[type]}...`}
                                            />
                                            <button
                                                onClick={() => {
                                                    const authorName = currentUser?.role === 'director' ? 'المدير' : (currentUser?.name || 'مجهول');
                                                    onSaveProgressPlan(student.id, { [type]: newPlan[type] }, authorName);
                                                    setNewPlan(p => ({ ...p, [type]: '' }));
                                                }}
                                                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex-shrink-0 self-start shadow-md shadow-blue-100 transition-all active:scale-95"
                                                title={`حفظ ${testTypeLabels[type]} فقط`}
                                            >
                                                <CheckIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t pt-6">
                                {(currentUser?.role === 'director' || currentUser?.role === 'supervisor') && (
                                    <button onClick={() => handleWhatsAppSharePlan(newPlan)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-green-700 bg-green-50 hover:bg-green-100 transition-colors font-bold border border-green-200">
                                        <WhatsAppIcon className="w-6 h-6" />
                                        <span>مشاركة الخطة الحالية</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const authorName = currentUser?.role === 'director' ? 'المدير' : (currentUser?.name || 'مجهول');
                                        onSaveProgressPlan(student.id, newPlan, authorName);
                                        setNewPlan({ [TestTypeEnum.NEW]: '', [TestTypeEnum.RECENT_PAST]: '', [TestTypeEnum.DISTANT_PAST]: '' });
                                        alert('تمت إضافة الخطة بنجاح!');
                                    }}
                                    className="w-full sm:w-auto px-10 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    حفظ الكل للسجل
                                </button>
                            </div>
                        </div>

                        <h4 className="font-bold text-gray-800 mb-4 px-2">سجل الخطط السابقة</h4>
                        <div className="space-y-4">
                            {student.progressPlanHistory && student.progressPlanHistory.length > 0 ? (
                                [...student.progressPlanHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                                    <div key={record.id} className={`p-5 rounded-2xl border transition-all ${record.isCompleted ? 'bg-green-50/50 border-green-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className={`flex-grow ${record.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{new Date(record.date).toLocaleDateString('ar-EG')}</span>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">بواسطة: {record.authorName}</span>
                                                </div>
                                                <div className="mt-2 text-sm space-y-2">
                                                    {record.plan[TestTypeEnum.NEW] && <p className="bg-white/50 p-2 rounded-lg border border-gray-50"><span className="font-bold text-blue-700 mr-1">الجديد:</span> {record.plan[TestTypeEnum.NEW]}</p>}
                                                    {record.plan[TestTypeEnum.RECENT_PAST] && <p className="bg-white/50 p-2 rounded-lg border border-gray-50"><span className="font-bold text-indigo-700 mr-1">القريب:</span> {record.plan[TestTypeEnum.RECENT_PAST]}</p>}
                                                    {record.plan[TestTypeEnum.DISTANT_PAST] && <p className="bg-white/50 p-2 rounded-lg border border-gray-50"><span className="font-bold text-purple-700 mr-1">البعيد:</span> {record.plan[TestTypeEnum.DISTANT_PAST]}</p>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-3 flex-shrink-0 mr-4">
                                                <button onClick={() => onTogglePlanCompletion(student.id, record.id)} title={record.isCompleted ? 'إلغاء الإكمال' : 'وضع علامة كمكتمل'} className="active:scale-90 transition-transform">
                                                    <CheckCircleIcon className={`w-8 h-8 ${record.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`} />
                                                </button>
                                                {(currentUser?.role === 'director' || currentUser?.role === 'supervisor') && (
                                                    <button onClick={() => onDeletePlanRecord(student.id, record.id)} title="حذف الخطة" className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                                                        <TrashIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-dashed">لا يوجد سجل للخطط السابقة.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <section>
                            <h4 className="font-bold text-gray-700 mb-4 px-2">سرعة الدفع للشهر الحالي والماضي</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {monthsSinceJoining.slice(0, 6).map(({ month, name }) => {
                                    const feeStatus = student.fees.find(f => f.month === month);
                                    return (
                                        <div key={month} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
                                            <div>
                                                <h5 className="font-bold text-gray-800">{name}</h5>
                                                <p className="text-sm text-gray-500">{feeStatus?.paid ? 'تم السداد بنجاح' : 'لم يتم السداد بعد'}</p>
                                            </div>
                                            {feeStatus?.paid ? (
                                                <button onClick={() => onCancelFeePayment(student.id, month)} className="w-full py-2.5 text-sm font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors">
                                                    إلغاء السداد
                                                </button>
                                            ) : (
                                                <button onClick={() => onOpenFeeModal(student.id, month, student.monthlyFee)} className="w-full py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                                    تسجيل الدفع
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-gray-50/50 text-center">
                                <h3 className="text-lg font-bold text-gray-800">سجل المدفوعات التاريخي</h3>
                            </div>

                            {/* Table Header - Desktop Only */}
                            <div className="hidden sm:grid grid-cols-5 bg-gray-50/50 border-b text-xs font-bold text-gray-400 uppercase tracking-wider text-center py-4">
                                <div className="text-right px-6">الشهر</div>
                                <div>تاريخ الدفع</div>
                                <div>المبلغ</div>
                                <div>رقم الوصل</div>
                                <div>المحصل</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {student.fees.filter(f => f.paid).length > 0 ? (
                                    student.fees.filter(f => f.paid).sort((a, b) => (b.paymentDate || '').localeCompare(a.paymentDate || '')).map((fee, index) => (
                                        <div key={index} className="sm:grid sm:grid-cols-5 items-center py-4 hover:bg-gray-50/50 transition-colors px-4 sm:px-0">

                                            {/* Mobile View: Row with 2 columns (Month/Date on right, Amount/Collector on left due to RTL) */}
                                            <div className="flex sm:block justify-between items-center sm:px-6 w-full">
                                                <div className="flex flex-col text-right">
                                                    <span className="text-sm font-bold text-gray-900">
                                                        {new Date(fee.month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-xs text-gray-500 sm:hidden mt-0.5">
                                                        {fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString('ar-EG') : '-'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col items-start sm:hidden text-left">
                                                    <span className="text-sm font-bold text-green-600">
                                                        {fee.amountPaid || fee.amount} ج.م
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 mt-0.5">
                                                        {fee.collectedByName || '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop columns (Hidden on small screens) */}
                                            <div className="hidden sm:block text-sm text-gray-500 text-center">
                                                {fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString('ar-EG') : '-'}
                                            </div>
                                            <div className="hidden sm:block text-sm text-green-600 font-bold text-center">
                                                {fee.amountPaid || fee.amount} ج.م
                                            </div>
                                            <div className="hidden sm:block text-sm text-gray-500 text-center">
                                                {fee.receiptNumber || '-'}
                                            </div>
                                            <div className="hidden sm:block text-sm text-gray-500 text-center">
                                                {fee.collectedByName || '-'}
                                            </div>

                                            {/* Optional extra info for mobile if needed (like Receipt Number) */}
                                            <div className="sm:hidden mt-2 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400">
                                                <span>رقم الوصل: {fee.receiptNumber || '-'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-12 text-center text-gray-500 italic">
                                        لا توجد مدفوعات مسجلة بعد.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-6">إضافة اختبار جديد</h4>
                            <form onSubmit={handleAddTestSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-end">
                                <div className="sm:col-span-2 md:col-span-1">
                                    <label htmlFor={`suraName-${student.id}`} className="block text-sm font-bold text-gray-600 mb-2">اسم السورة</label>
                                    <input type="text" id={`suraName-${student.id}`} value={suraName} onChange={e => setSuraName(e.target.value)} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none transition-all" required />
                                </div>
                                <div>
                                    <label htmlFor={`testType-${student.id}`} className="block text-sm font-bold text-gray-600 mb-2">نوع الاختبار</label>
                                    <select id={`testType-${student.id}`} value={testType} onChange={e => setTestType(e.target.value as TestType)} className="w-full px-4 py-2 border rounded-xl bg-white outline-none">
                                        {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor={`testGrade-${student.id}`} className="block text-sm font-bold text-gray-600 mb-2">التقدير</label>
                                    <select id={`testGrade-${student.id}`} value={testGrade} onChange={e => setTestGrade(e.target.value as TestGrade)} className="w-full px-4 py-2 border rounded-xl bg-white outline-none">
                                        {Object.entries(testGradeInfo).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="px-8 py-2.5 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">إضافة الاختبار</button>
                            </form>
                        </section>

                        <section>
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h4 className="font-bold text-gray-800">سجل الاختبارات</h4>
                                <div className="flex flex-wrap justify-center items-center gap-2">
                                    <select value={testMonthFilter} onChange={e => setTestMonthFilter(e.target.value)} className="text-xs px-3 py-2 border rounded-xl bg-white outline-none shadow-sm">
                                        <option value="all">كل الشهور</option>
                                        {testMonths.map(m => <option key={m} value={m}>{new Date(m + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>)}
                                    </select>
                                    <select value={testTypeFilter} onChange={e => setTestTypeFilter(e.target.value as 'all' | TestType)} className="text-xs px-3 py-2 border rounded-xl bg-white outline-none shadow-sm">
                                        <option value="all">كل الأنواع</option>
                                        {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                    </select>
                                    <select value={testSortOrder} onChange={e => setTestSortOrder(e.target.value as 'asc' | 'desc')} className="text-xs px-3 py-2 border rounded-xl bg-white outline-none shadow-sm">
                                        <option value="desc">الأحدث أولاً</option>
                                        <option value="asc">الأقدم أولاً</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredAndSortedTests.length > 0 ? filteredAndSortedTests.map(test => (
                                    <div key={test.id} className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group">
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg">{test.suraName} <span className="text-sm font-normal text-gray-400">({testTypeLabels[test.type]})</span></p>
                                            <p className="text-xs font-bold text-blue-500 mt-1">{new Date(test.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${testGradeInfo[test.grade].className}`}>{testGradeInfo[test.grade].label}</span>
                                            <button
                                                onClick={() => handleDeleteTestClick(student.id, test.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="حذف الاختبار"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )) : <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed text-center text-gray-500">لا توجد اختبارات مسجلة تطابق التصفية.</div>}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <section className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-4">إضافة ملحوظة جديدة</h4>
                            <form onSubmit={handleAddNoteSubmit} className="space-y-4">
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    rows={4}
                                    placeholder="اكتب ملاحظاتك المهمة هنا عن مستوى الطالب أو سلوكه..."
                                    className="w-full px-5 py-4 border rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <div className="flex justify-end">
                                    <button type="submit" className="px-10 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all">حفظ الملحوظة</button>
                                </div>
                            </form>
                        </section>
                        <section>
                            <h4 className="font-bold text-gray-800 mb-4 px-2">سجل الملحوظات</h4>
                            <div className="space-y-4">
                                {notes.length > 0 ? notes.map(note => (
                                    <div key={note.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-gray-800 leading-relaxed">{note.content}</p>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-bold">
                                            <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">بواسطة: {note.authorName}</span>
                                            <span className="text-gray-400">{new Date(note.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                )) : <div className="py-20 bg-white rounded-2xl border border-dashed text-center text-gray-500 italic">لا توجد ملحوظات مسجلة حالياً.</div>}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                        <DocumentReportIcon className="w-8 h-8 text-blue-600" />
                                        التقرير الشامل للطالب
                                    </h3>
                                    <p className="text-gray-500 font-bold">ملخص الأداء والتقدم للمسار التعليمي</p>
                                </div>
                                <div className="w-full sm:w-64">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 mr-1">الفترة الزمنية</label>
                                    <select
                                        value={reportPeriod}
                                        onChange={(e) => setReportPeriod(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                                    >
                                        {periodOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-100 relative group overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-200/20 rounded-full blur-2xl group-hover:bg-green-300/30 transition-all" />
                                    <h4 className="font-black text-green-800 mb-4 flex items-center justify-between">
                                        <span>الحضور والغياب</span>
                                        <CalendarCheckIcon className="w-6 h-6 opacity-30" />
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-green-600/70">أيام الحضور</span>
                                            <span className="text-2xl font-black text-green-600">{comprehensiveReportData.present}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-t border-green-200/50 pt-2">
                                            <span className="text-sm font-bold text-red-600/70">أيام الغياب</span>
                                            <span className="text-2xl font-black text-red-600">{comprehensiveReportData.absent}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 relative group overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl group-hover:bg-blue-300/30 transition-all" />
                                    <h4 className="font-black text-blue-800 mb-4 flex items-center justify-between">
                                        <span>المصروفات</span>
                                        <CurrencyDollarIcon className="w-6 h-6 opacity-30" />
                                    </h4>
                                    <div className="h-full flex flex-col justify-center">
                                        {comprehensiveReportData.pendingMonthsCount > 0 ? (
                                            <div className="text-center">
                                                <p className="text-red-500 font-black text-3xl mb-1">{comprehensiveReportData.pendingMonthsCount}</p>
                                                <p className="text-xs font-bold text-red-400">شهور لم تسدد</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <CheckCircleIcon className="w-12 h-12 text-blue-500 mb-2 drop-shadow-sm" />
                                                <span className="text-sm font-black text-blue-600">جميع الشهور مسددة</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-6 rounded-3xl border border-purple-100 relative group overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl group-hover:bg-purple-300/30 transition-all" />
                                    <h4 className="font-black text-purple-800 mb-4 flex items-center justify-between">
                                        <span>آخر الاختبارات</span>
                                        <ClipboardListIcon className="w-6 h-6 opacity-30" />
                                    </h4>
                                    <div className="space-y-2 text-xs font-bold text-purple-600/80">
                                        <p className="flex justify-between border-b border-purple-200/30 pb-1">الجديد: <span className="text-purple-900 truncate max-w-[80px] text-left">{comprehensiveReportData.latestNewTest?.suraName || '-'}</span></p>
                                        <p className="flex justify-between border-b border-purple-200/30 pb-1">القريب: <span className="text-purple-900 truncate max-w-[80px] text-left">{comprehensiveReportData.latestRecentPastTest?.suraName || '-'}</span></p>
                                        <p className="flex justify-between">البعيد: <span className="text-purple-900 truncate max-w-[80px] text-left">{comprehensiveReportData.latestDistantPastTest?.suraName || '-'}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6 transition-transform hover:scale-[1.01]">
                                <div className="text-white text-center sm:text-right">
                                    <h4 className="text-xl font-black mb-1">إرسال التقرير لولي الأمر</h4>
                                    <p className="text-blue-100 font-bold opacity-80">سيتم إرسال النسخة الشاملة عبر الواتساب فوراً</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleComprehensiveWhatsAppShare(); }}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-blue-600 font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-gray-50 transition-all active:scale-95 group"
                                >
                                    <WhatsAppIcon className="w-7 h-7 text-green-500 group-hover:scale-110 transition-transform" />
                                    <span>إرسال الآن</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default React.memo(StudentDetailsPage);
