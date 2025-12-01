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
import XIcon from './icons/XIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface StudentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null;
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
}

const testTypeLabels: Record<TestType, string> = {
    [TestTypeEnum.NEW]: 'جديد',
    [TestTypeEnum.RECENT_PAST]: 'ماضي قريب',
    [TestTypeEnum.DISTANT_PAST]: 'بعيد',
    [TestTypeEnum.READING]: 'قراءة',
};

const testGradeInfo: Record<TestGrade, { label: string; className: string }> = {
    [TestGradeEnum.EXCELLENT]: { label: 'ممتاز', className: 'bg-green-100 text-green-800' },
    // Fix: Use TestGradeEnum instead of TestTypeEnum
    [TestGradeEnum.VERY_GOOD]: { label: 'جيد جداً', className: 'bg-blue-100 text-blue-800' },
    // Fix: Use TestGradeEnum instead of TestTypeEnum
    [TestGradeEnum.GOOD]: { label: 'جيد', className: 'bg-yellow-100 text-yellow-800' },
    // Fix: Use TestGradeEnum instead of TestTypeEnum
    [TestGradeEnum.REPEAT]: { label: 'يعاد', className: 'bg-red-100 text-red-800' },
};

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = (props) => {
    const { isOpen, onClose, student, initialTab, currentUser, notes, onOpenFeeModal, onAddTest, onDeleteTest, onAddNote, onSaveProgressPlan, onUpdatePlanRecord, onTogglePlanCompletion, onDeletePlanRecord, onCancelFeePayment } = props;

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
        if (isOpen && student) {
            setActiveTab(initialTab);
            setNewPlan({ [TestTypeEnum.NEW]: '', [TestTypeEnum.RECENT_PAST]: '', [TestTypeEnum.DISTANT_PAST]: '' });
            setEditingPlanId(null);
        }
    }, [isOpen, student, initialTab]);

    const monthsSinceJoining = useMemo(() => {
        if (!student) return [];
        const months: { month: string, name: string }[] = [];
        const joiningDate = new Date(student.joiningDate);
        const now = new Date();

        // Start from the first day of the joining month
        let currentDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);

        // End at the current month (compare year and month only)
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
    }, [student?.joiningDate]);

    const periodOptions = useMemo(() => {
        if (!student) return [];
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
            ...monthOptions,
            { value: 'last_3_months', label: 'آخر 3 أشهر' },
            { value: 'all_time', label: 'منذ البداية' },
        ];
    }, [student?.joiningDate]);

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
        if (!student) return null;
        const attendanceRecords = student.attendance.filter(a => reportMonths.some(m => a.date.startsWith(m)));
        const present = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.PRESENT).length;
        const absent = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.ABSENT).length;

        const relevantMonthsForFees = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));
        const pendingFeeMonths = relevantMonthsForFees.filter(m => !student.fees.some(f => f.month === m && f.paid));

        const testsInPeriod = student.tests
            .filter(test => reportMonths.some(m => test.date.startsWith(m)))
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
    }, [student, reportMonths]);

    const getUniqueMonths = (records: { date: string }[]) => {
        if (!records) return [];
        const months = new Set<string>();
        records.forEach(record => {
            months.add(record.date.substring(0, 7)); // YYYY-MM
        });
        return Array.from(months).sort().reverse();
    };

    const testMonths = useMemo(() => getUniqueMonths(student?.tests || []), [student?.tests]);
    const attendanceMonths = useMemo(() => getUniqueMonths(student?.attendance || []), [student?.attendance]);

    const filteredAndSortedTests = useMemo(() => {
        if (!student) return [];
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
    }, [student?.tests, testMonthFilter, testTypeFilter, testSortOrder]);

    const filteredAndSortedAttendance = useMemo(() => {
        if (!student) return [];
        const sorted = [...student.attendance].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return attendanceSortOrder === 'asc' ? dateA - dateB : dateA - dateB;
        });
        if (attendanceMonthFilter === 'all') {
            return sorted;
        }
        return sorted.filter(record => record.date.startsWith(attendanceMonthFilter));
    }, [student?.attendance, attendanceMonthFilter, attendanceSortOrder]);

    const handleAddTestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suraName || !student) {
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
        if (newNote.trim() === '' || !student) return;
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
        if (!student || !comprehensiveReportData) return;
        const periodLabel = periodOptions.find(p => p.value === reportPeriod)?.label || reportPeriod;

        let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*\n`;
        message += `هذا هو تقرير الأداء من مركز الشاطبي عن فترة: *${periodLabel}*\n\n`;

        message += `*📝 الحضور والغياب:*\n`;
        message += `  - أيام الحضور: ${comprehensiveReportData.present}\n`;
        message += `  - أيام الغياب: ${comprehensiveReportData.absent}\n\n`;

        const relevantMonthsForFees = reportMonths.filter(m => new Date(m) >= new Date(student.joiningDate.substring(0, 7)));
        const pendingFeeMonths = relevantMonthsForFees.filter(m => !student.fees.some(f => f.month === m && f.paid));

        message += `*💵 المصروفات:*\n`;
        if (pendingFeeMonths.length > 0) {
            const monthNames = pendingFeeMonths.map(m => new Date(m + '-02').toLocaleString('ar-EG', { month: 'long' })).join(', ');
            message += `  - يرجى ملاحظة أن مصروفات الشهور التالية لم تسدد بعد: *${monthNames}*.\n\n`;
        } else {
            message += `  - جميع مصروفات الفترة المحددة مسددة. شكراً لالتزامكم.\n\n`;
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

        const phone = student.phone.replace(/[^0-9]/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    const handleAddNewPlan = () => {
        if (!student || !currentUser) return;
        const authorName = currentUser.role === 'director' ? 'المدير' : currentUser.name;
        onSaveProgressPlan(student.id, newPlan, authorName);
        setNewPlan({ [TestTypeEnum.NEW]: '', [TestTypeEnum.RECENT_PAST]: '', [TestTypeEnum.DISTANT_PAST]: '' });
        alert('تمت إضافة الخطة الجديدة للسجل بنجاح!');
    };

    const handleWhatsAppSharePlan = (plan: ProgressPlan) => {
        if (!student) return;
        const newGoal = plan[TestTypeEnum.NEW] || 'غير محدد';
        const recentGoal = plan[TestTypeEnum.RECENT_PAST] || 'غير محدد';
        const distantGoal = plan[TestTypeEnum.DISTANT_PAST] || 'غير محدد';

        let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*.\n`;
        message += `نرحب بكم في مركز الشاطبي ويسعدنا أن نشارككم خطة سير الطالب/ة:\n\n`;
        message += `- الجديد: ${newGoal}\n`;
        message += `- الماضي القريب: ${recentGoal}\n`;
        message += `- الماضي البعيد: ${distantGoal}\n\n`;
        message += `مع تحيات إدارة المركز.`;

        const phone = student.phone.replace(/[^0-9]/g, '');
        if (!phone) {
            alert("لا يوجد رقم هاتف مسجل لهذا الطالب.");
            return;
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    const handleStartEditPlan = (record: ProgressPlanRecord) => {
        setEditingPlanId(record.id);
        setEditingPlanData(record.plan);
    };

    const handleCancelEditPlan = () => {
        setEditingPlanId(null);
        setEditingPlanData({});
    };

    const handleSavePlanUpdate = (record: ProgressPlanRecord) => {
        if (!student || !currentUser) return;
        const modifierName = currentUser.role === 'director' ? 'المدير' : currentUser.name;
        const updatedRecord = { ...record, plan: editingPlanData };
        onUpdatePlanRecord(student.id, updatedRecord, modifierName);
        handleCancelEditPlan();
    };


    if (!isOpen || !student || !comprehensiveReportData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto bg-gray-50">
                    <div className="flex border-b border-gray-200 overflow-x-auto bg-white">
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
                        <button onClick={() => setActiveTab('notes')} className={getTabClass('notes')} title="الملحوظات">
                            <EditIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">الملحوظات</span>
                        </button>
                        <button onClick={() => setActiveTab('reports')} className={getTabClass('reports')} title="التقرير الشامل">
                            <DocumentReportIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">التقرير الشامل</span>
                        </button>
                    </div>
                    <div className="p-4">
                        {activeTab === 'attendanceLog' && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
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
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {filteredAndSortedAttendance.length > 0 ? filteredAndSortedAttendance.map(record => (
                                        <div key={record.date} className="flex justify-between items-center bg-white p-2 rounded-lg">
                                            <span>{new Date(record.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            {record.status === AttendanceStatusEnum.PRESENT ? (
                                                <span className="px-3 py-1 text-sm font-bold bg-green-200 text-green-800 rounded-full">حاضر</span>
                                            ) : (
                                                <span className="px-3 py-1 text-sm font-bold bg-red-200 text-red-800 rounded-full">غائب</span>
                                            )}
                                        </div>
                                    )) : <p className="text-gray-500 text-center py-4">لا يوجد سجل حضور مسجل.</p>}
                                </div>
                            </div>
                        )}
                        {activeTab === 'progressPlan' && (
                            <div>
                                <div className="bg-white p-4 rounded-lg border mb-6 shadow-sm">
                                    <h4 className="font-bold text-gray-700 mb-4">إضافة خطة جديدة</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">الجديد</label>
                                            <textarea value={newPlan[TestTypeEnum.NEW] || ''} onChange={(e) => setNewPlan(p => ({ ...p, [TestTypeEnum.NEW]: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="مثال: سورة البقرة من آية 1 إلى 20" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">الماضي القريب</label>
                                            <textarea value={newPlan[TestTypeEnum.RECENT_PAST] || ''} onChange={(e) => setNewPlan(p => ({ ...p, [TestTypeEnum.RECENT_PAST]: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="مثال: مراجعة آخر 5 أوجه" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">الماضي البعيد</label>
                                            <textarea value={newPlan[TestTypeEnum.DISTANT_PAST] || ''} onChange={(e) => setNewPlan(p => ({ ...p, [TestTypeEnum.DISTANT_PAST]: e.target.value }))} rows={2} className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="مثال: مراجعة من سورة الناس إلى النبأ" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <button onClick={() => handleWhatsAppSharePlan(newPlan)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-green-700 bg-green-100 hover:bg-green-200 transition-colors font-semibold">
                                            <WhatsAppIcon className="w-5 h-5" />
                                            <span>مشاركة الخطة</span>
                                        </button>
                                        <button onClick={handleAddNewPlan} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-semibold">إضافة للسجل</button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-bold text-gray-700 mb-4">سجل الخطط</h4>
                                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                        {student.progressPlanHistory && student.progressPlanHistory.length > 0 ? (
                                            [...student.progressPlanHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                                                <div key={record.id} className={`p-3 rounded-lg border ${record.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div className={`flex-grow ${record.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                            <p className="text-xs text-gray-500 mb-2">
                                                                {new Date(record.date).toLocaleDateString('ar-EG')} - بواسطة: <span className="font-semibold">{record.authorName}</span>
                                                            </p>
                                                            <div className="mt-2 text-sm space-y-1">
                                                                <p><span className="font-semibold">الجديد:</span> {record.plan[TestTypeEnum.NEW] || 'لم يحدد'}</p>
                                                                <p><span className="font-semibold">القريب:</span> {record.plan[TestTypeEnum.RECENT_PAST] || 'لم يحدد'}</p>
                                                                <p><span className="font-semibold">البعيد:</span> {record.plan[TestTypeEnum.DISTANT_PAST] || 'لم يحدد'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2 flex-shrink-0 ml-2">
                                                            <button onClick={() => onTogglePlanCompletion(student.id, record.id)} title={record.isCompleted ? 'إلغاء الإكمال' : 'وضع علامة كمكتمل'}>
                                                                <CheckCircleIcon className={`w-6 h-6 ${record.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`} />
                                                            </button>
                                                            <button onClick={() => onDeletePlanRecord(student.id, record.id)} title="حذف الخطة من السجل">
                                                                <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">لا يوجد سجل للخطط السابقة.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'fees' && (
                            <div>
                                <h4 className="font-bold text-gray-700 mb-2">سجل المصروفات الشهرية</h4>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {monthsSinceJoining.map(({ month, name }) => {
                                        const feeStatus = student.fees.find(f => f.month === month);
                                        return (
                                            <div key={month} className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                <span>{name}</span>
                                                {feeStatus?.paid ? (
                                                    <button onClick={() => onCancelFeePayment(student.id, month)} className="px-4 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                                                        إلغاء الدفع
                                                    </button>
                                                ) : (
                                                    <button onClick={() => onOpenFeeModal(student.id, month, student.monthlyFee)} className="px-4 py-1 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                        دفع الآن
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {activeTab === 'tests' && (
                            <div>
                                <h4 className="font-bold text-gray-700 mb-4">إضافة اختبار جديد</h4>
                                <form onSubmit={handleAddTestSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-white p-4 rounded-lg">
                                    <div className="sm:col-span-2 md:col-span-1">
                                        <label htmlFor={`suraName-${student.id}`} className="block text-sm text-gray-600 mb-1">اسم السورة</label>
                                        <input type="text" id={`suraName-${student.id}`} value={suraName} onChange={e => setSuraName(e.target.value)} className="w-full px-2 py-1 border rounded-md bg-gray-50" required />
                                    </div>
                                    <div>
                                        <label htmlFor={`testType-${student.id}`} className="block text-sm text-gray-600 mb-1">نوع الاختبار</label>
                                        <select id={`testType-${student.id}`} value={testType} onChange={e => setTestType(e.target.value as TestType)} className="w-full px-2 py-1 border rounded-md bg-white">
                                            {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`testGrade-${student.id}`} className="block text-sm text-gray-600 mb-1">التقدير</label>
                                        <select id={`testGrade-${student.id}`} value={testGrade} onChange={e => setTestGrade(e.target.value as TestGrade)} className="w-full px-2 py-1 border rounded-md bg-white">
                                            {Object.entries(testGradeInfo).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">إضافة</button>
                                </form>
                                <div className="mt-6">
                                    <h4 className="font-bold text-gray-700 text-center mb-3">سجل الاختبارات</h4>
                                    <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                                        <select value={testMonthFilter} onChange={e => setTestMonthFilter(e.target.value)} className="text-xs px-2 py-1 border rounded-md bg-white">
                                            <option value="all">كل الشهور</option>
                                            {testMonths.map(m => <option key={m} value={m}>{new Date(m + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</option>)}
                                        </select>
                                        <select value={testTypeFilter} onChange={e => setTestTypeFilter(e.target.value as 'all' | TestType)} className="text-xs px-2 py-1 border rounded-md bg-white">
                                            <option value="all">كل الأنواع</option>
                                            {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                                        </select>
                                        <select value={testSortOrder} onChange={e => setTestSortOrder(e.target.value as 'asc' | 'desc')} className="text-xs px-2 py-1 border rounded-md bg-white">
                                            <option value="desc">الأحدث أولاً</option>
                                            <option value="asc">الأقدم أولاً</option>
                                        </select>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                        {filteredAndSortedTests.length > 0 ? filteredAndSortedTests.map(test => (
                                            <div key={test.id} className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                <div>
                                                    <p className="font-semibold">{test.suraName} <span className="text-sm text-gray-500">({testTypeLabels[test.type]})</span></p>
                                                    <p className="text-xs text-gray-500">{new Date(test.date).toLocaleDateString('ar-EG')}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${testGradeInfo[test.grade].className}`}>{testGradeInfo[test.grade].label}</span>
                                                    <button
                                                        onClick={() => handleDeleteTestClick(student.id, test.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="حذف الاختبار"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : <p className="text-gray-500 text-center py-4">لا توجد اختبارات مسجلة.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'notes' && (
                            <div>
                                <h4 className="font-bold text-gray-700 mb-4">إضافة ملحوظة جديدة</h4>
                                <form onSubmit={handleAddNoteSubmit} className="flex items-start gap-2 bg-white p-4 rounded-lg">
                                    <textarea
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                        rows={2}
                                        placeholder="اكتب ملحوظتك هنا..."
                                        className="flex-grow px-2 py-1 border rounded-md bg-gray-50"
                                    />
                                    <button type="submit" className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">إضافة</button>
                                </form>
                                <div className="mt-6">
                                    <h4 className="font-bold text-gray-700 mb-2">سجل الملحوظات</h4>
                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                        {notes.length > 0 ? notes.map(note => (
                                            <div key={note.id} className="bg-white p-3 rounded-lg">
                                                <p className="text-gray-800">{note.content}</p>
                                                <p className="text-xs text-gray-400 mt-1 text-left">{note.authorName} - {new Date(note.date).toLocaleDateString('ar-EG')}</p>
                                            </div>
                                        )) : <p className="text-gray-500 text-center py-4">لا توجد ملحوظات مسجلة.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'reports' && (
                            <div className="p-4 bg-white rounded-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                    <div className="w-full sm:w-auto">
                                        <label htmlFor={`report-period-${student.id}`} className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير</label>
                                        <select
                                            id={`report-period-${student.id}`}
                                            value={reportPeriod}
                                            onChange={(e) => setReportPeriod(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {periodOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">التقرير الشامل</h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleComprehensiveWhatsAppShare(); }}
                                            className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-3 rounded-lg shadow hover:bg-green-600 transition-all text-sm"
                                            title="إرسال التقرير الشامل عبر واتساب"
                                        >
                                            <WhatsAppIcon className="w-5 h-5" />
                                            <span className="hidden sm:inline">إرسال لولي الأمر</span>
                                        </button>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-500 mb-3">ملخص الأداء عن فترة: <span className="font-semibold">{periodOptions.find(p => p.value === reportPeriod)?.label || reportPeriod}</span></p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-md">
                                                <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">الحضور والغياب</h4>
                                                <p>أيام الحضور: <span className="font-bold text-green-600">{comprehensiveReportData.present}</span></p>
                                                <p>أيام الغياب: <span className="font-bold text-red-600">{comprehensiveReportData.absent}</span></p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md">
                                                <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">المصروفات</h4>
                                                {comprehensiveReportData.pendingMonthsCount > 0 ? (
                                                    <p className="text-red-600">
                                                        لم تسدد مصروفات <span className="font-bold">{comprehensiveReportData.pendingMonthsCount}</span> شهر
                                                    </p>
                                                ) : (
                                                    <p className="text-green-600 font-semibold">✓ جميع المصروفات مسددة</p>
                                                )}
                                            </div>
                                            <div className="bg-white p-3 rounded-md">
                                                <h4 className="font-semibold text-gray-600 border-b pb-2 mb-2">الاختبارات</h4>
                                                <div className="text-xs space-y-1">
                                                    <p>آخر اختبار: <span className="font-semibold">{comprehensiveReportData.latestTest ? `${comprehensiveReportData.latestTest.suraName} (${testGradeInfo[comprehensiveReportData.latestTest.grade].label})` : 'لم يسجل'}</span></p>
                                                    <p>الجديد: <span className="font-semibold">{comprehensiveReportData.latestNewTest ? `${comprehensiveReportData.latestNewTest.suraName} (${testGradeInfo[comprehensiveReportData.latestNewTest.grade].label})` : 'لم يسجل'}</span></p>
                                                    <p>الماضي القريب: <span className="font-semibold">{comprehensiveReportData.latestRecentPastTest ? `${comprehensiveReportData.latestRecentPastTest.suraName} (${testGradeInfo[comprehensiveReportData.latestRecentPastTest.grade].label})` : 'لم يسجل'}</span></p>
                                                    <p>الماضي البعيد: <span className="font-semibold">{comprehensiveReportData.latestDistantPastTest ? `${comprehensiveReportData.latestDistantPastTest.suraName} (${testGradeInfo[comprehensiveReportData.latestDistantPastTest.grade].label})` : 'لم يسجل'}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
