

import React, { useState, useMemo, useEffect } from 'react';
import type { Student, Teacher, Staff, Expense, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings, Group, TeacherCollectionRecord, Supervisor, Notification } from '../types';
import { ExpenseCategory, TeacherAttendanceStatus, PaymentType, roundToNearest5 } from '../types';
import StaffManagerModal from './StaffManagerModal';
import CogIcon from './icons/CogIcon';
import TrashIcon from './icons/TrashIcon';
import FinanceIncomeModal from './FinanceIncomeModal';
import FinanceExpenseModal from './FinanceExpenseModal';
import FinanceCollectionsModal from './FinanceCollectionsModal';
import AttendanceCheckModal from './AttendanceCheckModal';

interface FinancePageProps {
    onBack: () => void;
    students: Student[];
    teachers: Teacher[];
    staff: Staff[];
    supervisors: Supervisor[];
    expenses: Expense[];
    teacherAttendance: TeacherAttendanceRecord[];
    teacherPayrollAdjustments: TeacherPayrollAdjustment[];
    financialSettings: FinancialSettings;
    teacherCollections: TeacherCollectionRecord[];
    onAddStaff: (staffMember: Omit<Staff, 'id'>) => void;
    onUpdateStaff: (staffId: string, updatedData: Partial<Staff>) => void;
    onDeleteStaff: (staffId: string) => void;
    onLogExpense: (expense: Omit<Expense, 'id'>) => void;
    onDeleteExpense: (expenseId: string) => void;
    onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus, reason?: string) => void;
    onUpdatePayrollAdjustments: (adjustment: Partial<TeacherPayrollAdjustment> & Pick<TeacherPayrollAdjustment, 'teacherId' | 'month'> & { isPaid?: boolean }) => void;
    onUpdateFinancialSettings: (settings: FinancialSettings) => void;
    groups: Group[];
    onResetTeacherPayment: (teacherId: string, month: string, teacherName: string) => void;
    onResetStaffPayment: (staffId: string, month: string, staffName: string) => void;
    onViewTeacherDetails: (teacher: Teacher) => void;
    onApplyDeductions: (records: TeacherAttendanceRecord[], notifications: Notification[]) => void;
}

const expenseCategoryLabels: Record<ExpenseCategory, string> = {
    [ExpenseCategory.RENT]: 'الإيجار',
    [ExpenseCategory.DEVELOPMENT]: 'تنمية وتطوير',
    [ExpenseCategory.UTILITIES]: 'فواتير ومرافق',
    [ExpenseCategory.TEACHER_SALARY]: 'راتب مدرس',
    [ExpenseCategory.STAFF_SALARY]: 'راتب موظف',
    [ExpenseCategory.SUPERVISOR_SALARY]: 'راتب مشرف',
    [ExpenseCategory.TEACHER_BONUS]: 'مكافأة مدرس',
    [ExpenseCategory.OTHER]: 'مصاريف أخرى',
};

const getAbsenceValue = (status: TeacherAttendanceStatus): number => {
    switch (status) {
        // Old system (for backward compatibility)
        case TeacherAttendanceStatus.ABSENT: return 1;
        case TeacherAttendanceStatus.HALF_DAY: return 0.5;
        case TeacherAttendanceStatus.QUARTER_DAY: return 0.25;

        // New deduction system
        case TeacherAttendanceStatus.DEDUCTION_FULL_DAY: return 1;
        case TeacherAttendanceStatus.DEDUCTION_HALF_DAY: return 0.5;
        case TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY: return 0.25;
        case TeacherAttendanceStatus.MISSING_REPORT: return 0.25;

        default: return 0;
    }
};

const getBonusValue = (status: TeacherAttendanceStatus): number => {
    switch (status) {
        case TeacherAttendanceStatus.BONUS_DAY: return 1;
        case TeacherAttendanceStatus.BONUS_HALF_DAY: return 0.5;
        case TeacherAttendanceStatus.BONUS_QUARTER_DAY: return 0.25;
        default: return 0;
    }
};

const FinancePage: React.FC<FinancePageProps> = (props) => {
    const { onBack, students, teachers, staff, supervisors, expenses, teacherAttendance, teacherPayrollAdjustments, financialSettings, onLogExpense, onDeleteExpense, onUpdatePayrollAdjustments, onSetTeacherAttendance, onAddStaff, onUpdateStaff, onDeleteStaff, onUpdateFinancialSettings, groups, onResetTeacherPayment, onResetStaffPayment, teacherCollections, onViewTeacherDetails, onApplyDeductions } = props;

    const [activeTab, setActiveTab] = useState<'overview' | 'teacher_payroll' | 'staff_expenses' | 'settings'>('overview');
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
    const [isAttendanceCheckModalOpen, setIsAttendanceCheckModalOpen] = useState(false);
    const [activePayrollTab, setActivePayrollTab] = useState<'all' | 'قرآن' | 'نور بيان' | 'تلقين'>('all');
    const [activeStatusFilter, setActiveStatusFilter] = useState<'active' | 'inactive'>('active');
    const [expandedPayrollTeacherId, setExpandedPayrollTeacherId] = useState<string | null>(null);


    const teacherCollectionsSummary = useMemo(() => {
        const collectionsThisMonth = teacherCollections.filter(c => c.month === selectedMonth);
        const totalReceived = collectionsThisMonth.reduce((sum, c) => sum + c.amount, 0);

        const teacherTotals: { [key: string]: number } = {};
        collectionsThisMonth.forEach(collection => {
            teacherTotals[collection.teacherId] = (teacherTotals[collection.teacherId] || 0) + collection.amount;
        });

        const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

        const details = Object.entries(teacherTotals).map(([teacherId, amount]) => ({
            teacherId,
            teacherName: teacherMap.get(teacherId) || 'مدرس غير معروف',
            amount,
        })).sort((a, b) => b.amount - a.amount);

        return { totalReceived, details };
    }, [teacherCollections, teachers, selectedMonth]);

    const financialOverview = useMemo(() => {
        const income = students.flatMap(s => s.fees)
            .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
            .reduce((sum, f) => sum + f.amountPaid!, 0);

        const totalExpenses = expenses
            .filter(e => {
                // Check if it's a salary expense
                const isSalary = [
                    ExpenseCategory.TEACHER_SALARY,
                    ExpenseCategory.SUPERVISOR_SALARY,
                    ExpenseCategory.STAFF_SALARY,
                    ExpenseCategory.TEACHER_BONUS
                ].includes(e.category);

                if (isSalary) {
                    // Try to extract month from description " - شهر YYYY-MM"
                    const match = e.description.match(/شهر (\d{4}-\d{2})/);
                    if (match && match[1]) {
                        return match[1] === selectedMonth;
                    }
                }

                // Fallback to date for non-salaries or if extraction fails
                return e.date.startsWith(selectedMonth);
            })
            .reduce((sum, e) => sum + e.amount, 0);

        const net = teacherCollectionsSummary.totalReceived - totalExpenses;
        return { income, totalExpenses, net };
    }, [students, expenses, selectedMonth, teacherCollectionsSummary.totalReceived]);


    const getTabClass = (tabName: string) => {
        const baseClass = "py-3 px-2 sm:px-6 font-semibold text-center flex-grow sm:w-1/4 transition-colors duration-200 focus:outline-none text-sm sm:text-base";
        if (activeTab === tabName) return `${baseClass} border-b-2 border-green-600 text-green-600`;
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    const handlePayEntity = (entity: { id: string, name: string, type: 'teacher' | 'supervisor' }, finalSalary: number) => {
        if (!finalSalary || finalSalary <= 0) return;

        const category = entity.type === 'teacher' ? ExpenseCategory.TEACHER_SALARY : ExpenseCategory.SUPERVISOR_SALARY;
        const descPrefix = entity.type === 'teacher' ? 'راتب المدرس' : 'راتب المشرف';

        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category: category,
            description: `${descPrefix}: ${entity.name} - شهر ${selectedMonth}`,
            amount: finalSalary,
        });
        onUpdatePayrollAdjustments({
            teacherId: entity.id,
            month: selectedMonth,
            bonus: teacherPayrollAdjustments.find(p => p.teacherId === entity.id && p.month === selectedMonth)?.bonus || 0,
            isPaid: true
        });
    }

    const handlePayStaff = (staffMember: Staff) => {
        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category: ExpenseCategory.STAFF_SALARY,
            description: `راتب الموظف: ${staffMember.name} (${staffMember.id}) - شهر ${selectedMonth}`,
            amount: staffMember.salary
        });
    }

    const isStaffPaid = (staffId: string) => {
        return expenses.some(e => {
            if (e.category !== ExpenseCategory.STAFF_SALARY || !e.description.includes(`(${staffId})`)) return false;

            const match = e.description.match(/شهر (\d{4}-\d{2})/);
            if (match && match[1]) {
                return match[1] === selectedMonth;
            }
            return e.date.startsWith(selectedMonth);
        });
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isStaffModalOpen) { setIsStaffModalOpen(false); return; }
                if (isIncomeModalOpen) { setIsIncomeModalOpen(false); return; }
                if (isExpenseModalOpen) { setIsExpenseModalOpen(false); return; }
                if (isCollectionsModalOpen) { setIsCollectionsModalOpen(false); return; }
                if (isAttendanceCheckModalOpen) { setIsAttendanceCheckModalOpen(false); return; }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isStaffModalOpen, isIncomeModalOpen, isExpenseModalOpen, isCollectionsModalOpen, isAttendanceCheckModalOpen]);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 flex flex-wrap">
                    <button onClick={() => setActiveTab('overview')} className={getTabClass('overview')}>نظرة عامة</button>
                    <button onClick={() => setActiveTab('teacher_payroll')} className={getTabClass('teacher_payroll')}>رواتب المدرسين والمشرفين</button>
                    <button onClick={() => setActiveTab('staff_expenses')} className={getTabClass('staff_expenses')}>الموظفون</button>
                    <button onClick={() => setActiveTab('settings')} className={getTabClass('settings')}>
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <CogIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">الإعدادات</span>
                        </div>
                    </button>
                </div>
                <div className="p-4 sm:p-6">
                    <div className="mb-6 max-w-xs">
                        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض بيانات شهر</label>
                        <input type="month" id="month-filter" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 text-center">الملخص المالي للشهر المحدد</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <button onClick={() => setIsIncomeModalOpen(true)} className="text-right bg-green-100 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
                                    <p className="text-lg text-green-800 font-semibold">إجمالي الدخل</p>
                                    <p className="text-4xl font-bold text-green-600 mt-2">{roundToNearest5(financialOverview.income).toLocaleString()} EGP</p>
                                    <span className="text-xs text-green-700 mt-2 block">مصروفات الطلاب المسددة</span>
                                </button>
                                <button onClick={() => setIsExpenseModalOpen(true)} className="text-right bg-red-100 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400">
                                    <p className="text-lg text-red-800 font-semibold">إجمالي المصروفات</p>
                                    <p className="text-4xl font-bold text-red-600 mt-2">{roundToNearest5(financialOverview.totalExpenses).toLocaleString()} EGP</p>
                                    <span className="text-xs text-red-700 mt-2 block">الرواتب والمصاريف العامة</span>
                                </button>
                                <button onClick={() => setIsCollectionsModalOpen(true)} className="text-right bg-cyan-100 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    <p className="text-lg text-cyan-800 font-semibold">المبلغ المستلم</p>
                                    <p className="text-4xl font-bold text-cyan-600 mt-2">{roundToNearest5(teacherCollectionsSummary.totalReceived).toLocaleString()} EGP</p>
                                    <span className="text-xs text-cyan-700 mt-2 block">من تحصيلات المدرسين</span>
                                </button>
                                <div className={`text-right p-6 rounded-lg ${financialOverview.net >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                                    <p className={`text-lg font-semibold ${financialOverview.net >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>صافي الربح / الخسارة</p>
                                    <p className={`text-4xl font-bold mt-2 ${financialOverview.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{roundToNearest5(financialOverview.net).toLocaleString()} EGP</p>
                                    <span className={`text-xs mt-2 block ${financialOverview.net >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>المبلغ المستلم - المصروفات</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'teacher_payroll' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto">
                                        {(['all', 'تلقين', 'نور بيان', 'قرآن'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActivePayrollTab(tab)}
                                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activePayrollTab === tab
                                                    ? 'bg-white text-green-700 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {tab === 'all' ? 'الكل' : tab}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto">
                                        {(['active', 'inactive'] as const).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setActiveStatusFilter(status)}
                                                className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeStatusFilter === status
                                                    ? 'bg-white text-blue-700 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {status === 'active' ? 'نشط' : 'غير نشط'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            {[
                                ...teachers.filter(t => t.status === activeStatusFilter).map(t => ({ ...t, type: 'teacher' as const })),
                                ...(activeStatusFilter === 'active' ? supervisors.map(s => ({ ...s, type: 'supervisor' as const, status: 'active' as const, phone: '' })) : [])
                            ]
                                .filter(entity => {
                                    if (activePayrollTab === 'all') return true;
                                    if (entity.type === 'teacher') {
                                        const teacherGroups = groups.filter(g => g.teacherId === entity.id);
                                        return teacherGroups.some(g => g.name.includes(activePayrollTab));
                                    } else {
                                        return (entity as Supervisor).section?.includes(activePayrollTab);
                                    }
                                })
                                .sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(entity => {

                                    // Calculate collected amount for this teacher (if teacher)
                                    let collectedAmount = 0;
                                    if (entity.type === 'teacher') {
                                        const teacherGroups = groups.filter(g => g.teacherId === entity.id);
                                        const teacherStudents = students.filter(s => teacherGroups.some(g => g.id === s.groupId));
                                        collectedAmount = teacherStudents
                                            .flatMap(s => s.fees)
                                            .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
                                            .reduce((sum, f) => sum + (f.amountPaid || 0), 0);
                                    }

                                    const isPartnership = entity.type === 'teacher' && (entity as Teacher).paymentType === PaymentType.PARTNERSHIP;
                                    const baseSalary = isPartnership ? 0 : (entity.salary || 0);
                                    const partnershipPercentage = isPartnership ? ((entity as Teacher).partnershipPercentage || 0) : 0;
                                    const partnershipAmount = isPartnership ? (collectedAmount * partnershipPercentage / 100) : 0;

                                    const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === entity.id && p.month === selectedMonth) || { bonus: 0, isPaid: false };

                                    const attendanceForMonth = teacherAttendance.filter(a => a.teacherId === entity.id && a.date.startsWith(selectedMonth));

                                    // Calculate effective salary for daily rate
                                    const effectiveSalary = isPartnership ? partnershipAmount : baseSalary;

                                    const deductionDetails = attendanceForMonth
                                        .filter(record => getAbsenceValue(record.status) > 0)
                                        .map(record => {
                                            const value = getAbsenceValue(record.status);
                                            const dailyRate = effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? effectiveSalary / financialSettings.workingDaysPerMonth : 0;
                                            const amount = roundToNearest5(dailyRate * value * (financialSettings.absenceDeductionPercentage / 100));

                                            let reason = 'خصم';
                                            // New system
                                            if (record.status === TeacherAttendanceStatus.DEDUCTION_FULL_DAY) reason = 'خصم يوم كامل';
                                            else if (record.status === TeacherAttendanceStatus.DEDUCTION_HALF_DAY) reason = 'خصم نصف يوم';
                                            else if (record.status === TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY) reason = 'خصم ربع يوم';
                                            else if (record.status === TeacherAttendanceStatus.MISSING_REPORT) reason = 'عدم تسليم تقرير';
                                            // Old system (backward compatibility)
                                            else if (record.status === TeacherAttendanceStatus.ABSENT) reason = 'غياب';
                                            else if (record.status === TeacherAttendanceStatus.HALF_DAY) reason = 'خصم نصف يوم';
                                            else if (record.status === TeacherAttendanceStatus.QUARTER_DAY) reason = 'خصم ربع يوم';

                                            if (record.reason) reason += ` (${record.reason})`;

                                            return { date: record.date, reason, amount };
                                        });

                                    const totalDeductionAmount = deductionDetails.reduce((sum, item) => sum + item.amount, 0);

                                    const bonusDetails = [];

                                    attendanceForMonth.filter(record => getBonusValue(record.status) > 0).forEach(record => {
                                        const value = getBonusValue(record.status);
                                        const dailyRate = effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? effectiveSalary / financialSettings.workingDaysPerMonth : 0;
                                        const amount = roundToNearest5(dailyRate * value);

                                        let reason = 'مكافأة';
                                        if (record.status === TeacherAttendanceStatus.BONUS_DAY) reason = 'مكافأة يوم كامل';
                                        else if (record.status === TeacherAttendanceStatus.BONUS_HALF_DAY) reason = 'مكافأة نصف يوم';
                                        else if (record.status === TeacherAttendanceStatus.BONUS_QUARTER_DAY) reason = 'مكافأة ربع يوم';

                                        if (record.reason) reason += ` (${record.reason})`;

                                        bonusDetails.push({ date: record.date, reason, amount });
                                    });

                                    if (adjustments.bonus > 0) {
                                        bonusDetails.push({ date: selectedMonth, reason: 'مكافأة إضافية', amount: adjustments.bonus, isManual: true });
                                    }

                                    const totalBonusAmount = bonusDetails.reduce((sum, item) => sum + item.amount, 0);

                                    const finalSalary = roundToNearest5(isPartnership
                                        ? partnershipAmount + totalBonusAmount - totalDeductionAmount
                                        : baseSalary + totalBonusAmount - totalDeductionAmount);

                                    const entityTypeLabel = entity.type === 'teacher' ? 'مدرس' : 'مشرف';
                                    const isExpanded = expandedPayrollTeacherId === entity.id;

                                    // Update WhatsApp message to include partnership details
                                    let whatsappMessage = `
السلام عليكم ورحمة الله وبركاته
تقرير الراتب لشهر: ${selectedMonth}
الاسم: ${entity.name} (${entityTypeLabel})
`;
                                    if (isPartnership) {
                                        whatsappMessage += `
نوع المحاسبة: شراكة (${partnershipPercentage}%)
المبلغ المحصّل: ${collectedAmount.toLocaleString()}
نصيبك من المحصل: ${partnershipAmount.toFixed(2)}
`;
                                    } else {
                                        whatsappMessage += `
الراتب الأساسي: ${baseSalary.toLocaleString()}
`;
                                    }

                                    whatsappMessage += `
🔴 الخصومات: ${totalDeductionAmount.toLocaleString()}
${deductionDetails.length > 0 ? deductionDetails.map(d => `- ${d.date}: ${d.reason} (${d.amount.toFixed(0)})`).join('\n') : 'لا يوجد خصومات'}

🟢 المكافآت: ${totalBonusAmount.toLocaleString()}
${bonusDetails.length > 0 ? bonusDetails.map(b => `- ${b.date}: ${b.reason} (${b.amount.toFixed(0)})`).join('\n') : 'لا يوجد مكافآت'}

💰 الراتب النهائي: ${finalSalary.toLocaleString()} جنيه

مع تحيات الإدارة المالية
`.trim();

                                    return (
                                        <div key={entity.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4 transition-all duration-300">
                                            <div
                                                className={`px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                                                onClick={() => setExpandedPayrollTeacherId(isExpanded ? null : entity.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {entity.name}
                                                        <span className="text-sm font-normal text-gray-500 mr-2">({entityTypeLabel})</span>
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-left hidden sm:block">
                                                        <p className="text-xs text-gray-500">الراتب النهائي</p>
                                                        <p className="text-lg font-bold text-blue-600">{finalSalary.toLocaleString()} EGP</p>
                                                    </div>
                                                    <svg className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <>
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-red-100">
                                                                <h4 className="font-bold text-red-600 flex items-center gap-2">
                                                                    <span>🔴</span> الخصومات
                                                                </h4>
                                                                <span className="font-bold text-red-600">{totalDeductionAmount.toFixed(2)}</span>
                                                            </div>
                                                            <div className="space-y-2 text-sm">
                                                                {deductionDetails.length > 0 ? (
                                                                    deductionDetails.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center text-gray-600 bg-red-50 p-2 rounded group">
                                                                            <span>{item.reason} <span className="text-xs text-gray-400">({item.date})</span></span>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-semibold">-{item.amount.toFixed(0)}</span>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        if (window.confirm('هل أنت متأكد من إلغاء هذا الخصم؟')) {
                                                                                            onSetTeacherAttendance(entity.id, item.date, TeacherAttendanceStatus.PRESENT);
                                                                                        }
                                                                                    }}
                                                                                    className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                                                                                    title="إلغاء الخصم"
                                                                                >
                                                                                    <TrashIcon className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-gray-400 text-center py-2">لا يوجد خصومات</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-green-100">
                                                                <h4 className="font-bold text-green-600 flex items-center gap-2">
                                                                    <span>🟢</span> المكافآت والإضافي
                                                                </h4>
                                                                <span className="font-bold text-green-600">{totalBonusAmount.toFixed(2)}</span>
                                                            </div>
                                                            <div className="space-y-2 text-sm">
                                                                {bonusDetails.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center text-gray-600 bg-green-50 p-2 rounded group">
                                                                        <span>{item.reason} <span className="text-xs text-gray-400">({item.date})</span></span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-semibold">+{item.amount.toFixed(0)}</span>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    if (window.confirm('هل أنت متأكد من إلغاء هذه المكافأة؟')) {
                                                                                        if ((item as any).isManual) {
                                                                                            onUpdatePayrollAdjustments({ ...adjustments, teacherId: entity.id, month: selectedMonth, bonus: 0 });
                                                                                        } else {
                                                                                            onSetTeacherAttendance(entity.id, item.date, TeacherAttendanceStatus.PRESENT);
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                                                                                title="إلغاء المكافأة"
                                                                            >
                                                                                <TrashIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                                                                    <span className="text-gray-600 whitespace-nowrap">مكافأة يدوية:</span>
                                                                    <input
                                                                        type="number"
                                                                        value={adjustments.bonus}
                                                                        onChange={(e) => onUpdatePayrollAdjustments({ ...adjustments, teacherId: entity.id, month: selectedMonth, bonus: parseFloat(e.target.value) || 0 })}
                                                                        className="w-24 p-1 text-sm border rounded focus:ring-1 focus:ring-green-500"
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-center sm:text-right">
                                                                {isPartnership ? (
                                                                    <>
                                                                        <p className="text-sm text-gray-500">نصيب الشراكة ({partnershipPercentage}%)</p>
                                                                        <p className="text-lg font-bold text-gray-800">{partnershipAmount.toFixed(2)} EGP</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <p className="text-sm text-gray-500">الراتب الأساسي</p>
                                                                        <p className="text-lg font-bold text-gray-800">{baseSalary.toLocaleString()} EGP</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="text-center sm:text-right border-r pr-4 mr-4 border-gray-300">
                                                                <p className="text-sm text-gray-500">الراتب النهائي المستحق</p>
                                                                <p className="text-2xl font-bold text-blue-600">{finalSalary.toLocaleString()} EGP</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                                            {adjustments.isPaid ? (
                                                                <button onClick={() => onResetTeacherPayment(entity.id, selectedMonth, entity.name)} className="flex-1 sm:flex-none py-2 px-6 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-colors shadow-sm">
                                                                    إلغاء الدفع
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handlePayEntity(entity, finalSalary)} className="flex-1 sm:flex-none py-2 px-6 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-sm">
                                                                    دفع الراتب
                                                                </button>
                                                            )}

                                                            <a
                                                                href={`https://wa.me/2${entity.phone?.startsWith('0') ? entity.phone.substring(1) : entity.phone}?text=${encodeURIComponent(whatsappMessage)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center"
                                                                title="إرسال تقرير الراتب عبر واتساب"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            {teachers.length === 0 && supervisors.length === 0 && (
                                <p className="text-center text-gray-500 py-8">لا يوجد مدرسون أو مشرفون في القائمة.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'staff_expenses' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <div className="mb-8 border-b pb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-xl text-gray-800">رواتب الموظفين</h3>
                                        <button onClick={() => { setStaffToEdit(null); setIsStaffModalOpen(true) }} className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 text-sm">إدارة الموظفين</button>
                                    </div>
                                    <div className="space-y-3">
                                        {staff.map(s => (
                                            <div key={s.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold">{s.name} <span className="text-sm text-gray-500">({s.role})</span></p>
                                                    <p className="text-sm text-gray-600">الراتب: {s.salary.toLocaleString()} EGP</p>
                                                </div>
                                                {isStaffPaid(s.id) ? (
                                                    <button onClick={() => onResetStaffPayment(s.id, selectedMonth, s.name)} className="py-2 px-4 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 text-sm">إلغاء الدفع</button>
                                                ) : (
                                                    <button onClick={() => handlePayStaff(s)} className="py-2 px-4 rounded bg-green-600 text-white font-bold hover:bg-green-700 text-sm">دفع</button>
                                                )}
                                            </div>
                                        ))}
                                        {staff.length === 0 && <p className="text-gray-400 text-center py-4">لا يوجد موظفون.</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-xl text-gray-800 mb-4">المصاريف العامة</h3>
                                <ExpenseForm onLogExpense={onLogExpense} />
                                <h4 className="font-bold text-lg text-gray-700 mt-6 mb-2">المصاريف المسجلة هذا الشهر</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {expenses.filter(e => {
                                        if (e.category === ExpenseCategory.STAFF_SALARY || e.category === ExpenseCategory.TEACHER_SALARY || e.category === ExpenseCategory.TEACHER_BONUS || e.category === ExpenseCategory.SUPERVISOR_SALARY) {
                                            return false; // Don't show salaries here, or filter them correctly if you want to show them
                                        }
                                        return e.date.startsWith(selectedMonth);
                                    }).map(e => (
                                        <div key={e.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center group">
                                            <div>
                                                <p className="font-semibold">{expenseCategoryLabels[e.category]}</p>
                                                <p className="text-sm text-gray-500">{e.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-red-500">{e.amount.toLocaleString()} EGP</p>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
                                                            onDeleteExpense(e.id);
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="حذف"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 mb-4">إعدادات الرواتب والخصومات</h3>
                            <div className="max-w-md space-y-6 bg-gray-50 p-6 rounded-lg">
                                <div>
                                    <label htmlFor="workingDays" className="block text-gray-600 mb-1 font-semibold">أيام العمل في الشهر</label>
                                    <input
                                        id="workingDays"
                                        type="number"
                                        value={financialSettings.workingDaysPerMonth}
                                        onChange={(e) => onUpdateFinancialSettings({ ...financialSettings, workingDaysPerMonth: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="مثال: 22"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">يستخدم هذا الرقم لحساب قيمة اليومية عند خصم الغياب.</p>
                                </div>
                                <div>
                                    <label htmlFor="deductionPercentage" className="block text-gray-600 mb-1 font-semibold">نسبة الخصم للغياب (%)</label>
                                    <input
                                        id="deductionPercentage"
                                        type="number"
                                        value={financialSettings.absenceDeductionPercentage}
                                        onChange={(e) => onUpdateFinancialSettings({ ...financialSettings, absenceDeductionPercentage: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="مثال: 100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">100% تعني خصم قيمة يوم كامل. 150% تعني خصم يوم ونصف (عقوبة).</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <StaffManagerModal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} onSave={onAddStaff} staffList={staff} onUpdate={onUpdateStaff} onDelete={onDeleteStaff} staffToEdit={staffToEdit} setStaffToEdit={setStaffToEdit} />
            <FinanceIncomeModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                month={selectedMonth}
                students={students}
                groups={groups}
            />
            <FinanceExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                month={selectedMonth}
                expenses={expenses}
                onDeleteExpense={onDeleteExpense}
            />
            <FinanceCollectionsModal
                isOpen={isCollectionsModalOpen}
                onClose={() => setIsCollectionsModalOpen(false)}
                month={selectedMonth}
                collectionsSummary={teacherCollectionsSummary}
            />
            <AttendanceCheckModal
                isOpen={isAttendanceCheckModalOpen}
                onClose={() => setIsAttendanceCheckModalOpen(false)}
                teachers={teachers}
                groups={groups}
                students={students}
                teacherAttendance={teacherAttendance}
                onApplyDeductions={onApplyDeductions}
            />
        </main >
    );
};


const ExpenseForm: React.FC<{ onLogExpense: (expense: Omit<Expense, 'id'>) => void }> = ({ onLogExpense }) => {
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.RENT);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;
        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category,
            description,
            amount: parseFloat(amount)
        });
        setDescription('');
        setAmount('');
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg space-y-3">
            <h4 className="font-bold text-lg text-gray-700">تسجيل مصروف جديد</h4>
            <div>
                <label className="text-sm">الفئة</label>
                <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full p-2 border rounded mt-1 bg-white">
                    <option value={ExpenseCategory.RENT}>الإيجار</option>
                    <option value={ExpenseCategory.DEVELOPMENT}>تنمية وتطوير</option>
                    <option value={ExpenseCategory.UTILITIES}>فواتير ومرافق</option>
                    <option value={ExpenseCategory.OTHER}>مصاريف أخرى</option>
                </select>
            </div>
            <div>
                <label className="text-sm">الوصف</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white" required />
            </div>
            <div>
                <label className="text-sm">المبلغ</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white" required />
            </div>
            <button type="submit" className="w-full py-2 px-4 rounded bg-blue-600 text-white font-bold hover:bg-blue-700">تسجيل المصروف</button>
        </form>
    )
}

export default FinancePage;
