
import React, { useState, useMemo } from 'react';
import type { Teacher, Group, TeacherAttendanceRecord, TeacherPayrollAdjustment, Expense, FinancialSettings, Student, Supervisor, TeacherCollectionRecord, TeacherManualBonus } from '../types';
import { TeacherStatus, ExpenseCategory, TeacherAttendanceStatus, PaymentType, roundToNearest5 } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import UsersIcon from './icons/UsersIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import XIcon from './icons/XIcon';
import BonusReasonModal from './BonusReasonModal';
import DeductionReasonModal from './DeductionReasonModal';
import UserIcon from './icons/UserIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface TeacherDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
    supervisor?: Supervisor | null;
    groups: Group[];
    students: Student[];
    teacherAttendance: TeacherAttendanceRecord[];
    teacherPayrollAdjustments: TeacherPayrollAdjustment[];
    financialSettings: FinancialSettings;
    onEditTeacherClick: (teacher: Teacher) => void;
    onEditSupervisorClick?: (supervisor: Supervisor) => void;
    onDeleteTeacher: (teacherId: string) => void;
    onDeleteSupervisor?: (supervisorId: string) => void;
    onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus, reason?: string) => void;
    onUpdatePayrollAdjustments: (adjustment: Partial<TeacherPayrollAdjustment> & Pick<TeacherPayrollAdjustment, 'teacherId' | 'month'> & { isPaid?: boolean }) => void;
    onLogExpense: (expense: Omit<Expense, 'id'>) => void;
    onViewTeacherReport: (teacherId: string) => void;
    onSendNotificationToAll: (content: string) => void;
    teacherCollections?: TeacherCollectionRecord[];
    teacherManualBonuses?: TeacherManualBonus[];
    currentUserRole?: 'director' | 'teacher' | 'supervisor';
    onAddTeacherCollection?: (collection: Omit<TeacherCollectionRecord, 'id'>) => void;
    onAddManualBonus?: (bonus: Omit<TeacherManualBonus, 'id'>) => void;
    onDeleteManualBonus?: (bonusId: string) => void;
    onResetPayment?: (employeeId: string, month: string, employeeName: string) => void;
}

const getAbsenceValue = (status: TeacherAttendanceStatus): number => {
    switch (status) {
        // Old system (backward compatibility)
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

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({
    isOpen,
    onClose,
    teacher,
    supervisor,
    groups,
    students,
    teacherAttendance,
    teacherPayrollAdjustments,
    financialSettings,
    onEditTeacherClick,
    onEditSupervisorClick,
    onDeleteTeacher,
    onDeleteSupervisor,
    onSetTeacherAttendance,
    onUpdatePayrollAdjustments,
    onLogExpense,
    onViewTeacherReport,
    onSendNotificationToAll,
    teacherCollections = [],
    teacherManualBonuses = [],
    currentUserRole,
    onAddTeacherCollection,
    onAddManualBonus,
    onDeleteManualBonus,
    onResetPayment,
}) => {
    const [activeTab, setActiveTab] = useState<'payroll' | 'attendance' | 'groups' | 'collections'>('collections');
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
    const [additionalBonus, setAdditionalBonus] = useState('');
    const [bonusReason, setBonusReason] = useState('');
    const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
    const [bonusTypeToGive, setBonusTypeToGive] = useState<TeacherAttendanceStatus | null>(null);
    const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
    const [deductionTypeToApply, setDeductionTypeToApply] = useState<TeacherAttendanceStatus | null>(null);
    const [newCollectionAmount, setNewCollectionAmount] = useState('');
    const [newCollectionNotes, setNewCollectionNotes] = useState('');

    const employee = teacher || supervisor;
    const isSupervisor = !!supervisor;
    const employeeId = employee?.id || '';
    const employeeName = employee?.name || '';
    const employeePhone = employee?.phone || '';
    const employeeSalary = employee?.salary || 0;

    const isTeacherInUse = useMemo(() => {
        if (!teacher) return false;
        return groups.some(g => g.teacherId === teacher.id);
    }, [groups, teacher]);

    const assignedGroups = useMemo(() => {
        if (!teacher) return [];
        return groups.filter(g => g.teacherId === teacher.id);
    }, [groups, teacher]);

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = useMemo(() => {
        if (!employeeId) return undefined;
        return teacherAttendance.find(a => a.teacherId === employeeId && a.date === today);
    }, [teacherAttendance, employeeId, today]);

    const handleBonusClick = (bonusStatus: TeacherAttendanceStatus) => {
        setBonusTypeToGive(bonusStatus);
        setIsBonusModalOpen(true);
    };

    const handleConfirmBonus = (reason: string) => {
        if (!employeeId || !bonusTypeToGive) return;

        // 1. Record the attendance
        onSetTeacherAttendance(employeeId, today, bonusTypeToGive, reason);

        // 2. Prepare and send notification
        let bonusAmountText = '';
        switch (bonusTypeToGive) {
            case TeacherAttendanceStatus.BONUS_DAY: bonusAmountText = 'يوم كامل'; break;
            case TeacherAttendanceStatus.BONUS_HALF_DAY: bonusAmountText = 'نصف يوم'; break;
            case TeacherAttendanceStatus.BONUS_QUARTER_DAY: bonusAmountText = 'ربع يوم'; break;
        }

        const roleTitle = isSupervisor ? 'المشرف/ة' : 'المدرس/ة';
        const notificationContent = `🎉 مكافأة! حصل ${roleTitle} ${employeeName} على مكافأة (${bonusAmountText}) وذلك لـ: "${reason}".`;
        onSendNotificationToAll(notificationContent);

        // 3. Close modal and reset state
        setIsBonusModalOpen(false);
        setBonusTypeToGive(null);
    };

    const handleDeductionClick = (deductionStatus: TeacherAttendanceStatus) => {
        setDeductionTypeToApply(deductionStatus);
        setIsDeductionModalOpen(true);
    };

    const handleConfirmDeduction = (reason: string) => {
        if (!employeeId || !deductionTypeToApply) return;

        // Record the deduction
        onSetTeacherAttendance(employeeId, today, deductionTypeToApply, reason);

        // Close modal and reset state
        setIsDeductionModalOpen(false);
        setDeductionTypeToApply(null);
    };


    const getTabClass = (tabName: 'payroll' | 'attendance' | 'groups' | 'collections') => {
        const baseClass = "py-3 px-2 font-semibold text-center transition-colors duration-200 focus:outline-none flex-shrink-0 flex items-center justify-center gap-2 flex-grow text-sm";
        if (activeTab === tabName) {
            return `${baseClass} border-b-2 border-teal-600 text-teal-600 bg-teal-50`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    const attendanceForMonth = useMemo(() => {
        if (!employeeId) return [];
        return teacherAttendance.filter(a => a.teacherId === employeeId && a.date.startsWith(selectedMonth));
    }, [employeeId, teacherAttendance, selectedMonth]);

    const payrollData = useMemo(() => {
        if (!employeeId) return { baseSalary: 0, adjustments: { bonus: 0, isPaid: false }, absenceDays: 0, bonusDays: 0, absenceDeduction: 0, attendanceBonus: 0, manualBonusTotal: 0, finalSalary: 0, isPaid: false, isPartnership: false, partnershipAmount: 0, collectedAmount: 0, totalHandedOver: 0, remainingBalance: 0 };

        // Calculate collected amount for this teacher (if teacher)
        let collectedAmount = 0;
        if (!isSupervisor && teacher) {
            const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
            const teacherStudents = students.filter(s => teacherGroups.some(g => g.id === s.groupId));
            collectedAmount = teacherStudents
                .flatMap(s => s.fees)
                .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
                .reduce((sum, f) => sum + (f.amountPaid || 0), 0);
        }

        const isPartnership = !isSupervisor && teacher?.paymentType === PaymentType.PARTNERSHIP;
        const baseSalary = isPartnership ? 0 : employeeSalary;
        const partnershipPercentage = isPartnership ? (teacher?.partnershipPercentage || 0) : 0;
        const partnershipAmount = isPartnership ? (collectedAmount * partnershipPercentage / 100) : 0;

        // Calculate handed over and remaining balance for partnership
        const collectionsForMonth = teacherCollections.filter(c => c.teacherId === employeeId && c.month === selectedMonth);
        const totalHandedOver = collectionsForMonth.reduce((sum, c) => sum + c.amount, 0);
        const remainingBalance = collectedAmount - totalHandedOver;

        // Calculate manual bonuses for this month
        const manualBonusesForMonth = teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth);
        const manualBonusTotal = manualBonusesForMonth.reduce((sum, b) => sum + b.amount, 0);

        const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === employeeId && p.month === selectedMonth) || { bonus: 0, isPaid: false };

        const absenceDays = attendanceForMonth.reduce((total, record) => total + getAbsenceValue(record.status), 0);
        const bonusDays = attendanceForMonth.reduce((total, record) => total + getBonusValue(record.status), 0);

        // Calculate effective salary for daily rate
        const effectiveSalary = isPartnership ? partnershipAmount : baseSalary;


        const dailyRate = effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? effectiveSalary / financialSettings.workingDaysPerMonth : 0;
        const absenceDeduction = roundToNearest5(dailyRate * absenceDays * (financialSettings.absenceDeductionPercentage / 100));
        const attendanceBonus = roundToNearest5(dailyRate * bonusDays);

        const finalSalary = roundToNearest5(isPartnership
            ? partnershipAmount + manualBonusTotal + attendanceBonus - absenceDeduction
            : baseSalary + manualBonusTotal + attendanceBonus - absenceDeduction);

        return {
            baseSalary,
            adjustments,
            absenceDays,
            bonusDays,
            absenceDeduction,
            attendanceBonus,
            manualBonusTotal,
            finalSalary,
            isPaid: adjustments.isPaid,
            isPartnership,
            partnershipAmount,
            collectedAmount,
            totalHandedOver,
            remainingBalance,
            partnershipPercentage
        };
    }, [employeeId, employeeSalary, selectedMonth, teacherPayrollAdjustments, attendanceForMonth, financialSettings, teacherCollections, teacherManualBonuses, teacher, isSupervisor, groups, students]);

    const bonusRecordsWithReason = useMemo(() =>
        attendanceForMonth.filter(r => getBonusValue(r.status) > 0 && r.reason),
        [attendanceForMonth]);

    const deductionRecordsWithReason = useMemo(() =>
        attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0 && r.status !== TeacherAttendanceStatus.ABSENT && r.reason),
        [attendanceForMonth]);

    const handlePayEmployee = (finalSalary: number) => {
        if (!employeeId || !finalSalary || finalSalary <= 0) return;
        const category = isSupervisor ? ExpenseCategory.SUPERVISOR_SALARY : ExpenseCategory.TEACHER_SALARY;
        const descRole = isSupervisor ? 'المشرف' : 'المدرس';

        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category: category,
            description: `راتب ${descRole}: ${employeeName} - شهر ${selectedMonth}`,
            amount: finalSalary,
        });
        onUpdatePayrollAdjustments({
            teacherId: employeeId,
            month: selectedMonth,
            isPaid: true
        });
    }

    const handlePayAdditionalBonus = () => {
        if (!employeeId || !onAddManualBonus) return;
        const amount = parseFloat(additionalBonus);

        // Check for valid number (not zero, not NaN)
        if (isNaN(amount) || amount === 0) {
            alert('يرجى إدخال مبلغ صحيح (موجب للمكافأة، سالب للخصم).');
            return;
        }

        const isDeduction = amount < 0;
        const absoluteAmount = Math.abs(amount);

        // Add to manual bonuses - build object without undefined values
        const manualBonusData: any = {
            teacherId: employeeId,
            month: selectedMonth,
            amount: amount, // Keep the sign (positive for bonus, negative for deduction)
            date: new Date().toISOString(),
            addedBy: currentUserRole || 'director'
        };

        // Only add reason if it has a value
        if (bonusReason && bonusReason.trim()) {
            manualBonusData.reason = bonusReason.trim();
        }

        onAddManualBonus(manualBonusData);

        // Also log as expense
        const descRole = isSupervisor ? 'مشرف' : 'مدرس';
        const actionType = isDeduction ? 'خصم يدوي' : 'مكافأة يدوية';
        const expenseCategory = isDeduction ? ExpenseCategory.OTHER : ExpenseCategory.TEACHER_BONUS;

        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category: expenseCategory,
            description: `${actionType} ${isDeduction ? 'من' : 'لـ'} ${descRole}: ${employeeName}${bonusReason ? ` - ${bonusReason}` : ''} - شهر ${selectedMonth}`,
            amount: absoluteAmount, // Expense is always positive
        });

        const actionText = isDeduction ? 'خصم' : 'مكافأة';
        alert(`تم تسجيل ${actionText} بقيمة ${absoluteAmount.toLocaleString()} EGP بنجاح.`);
        setAdditionalBonus('');
        setBonusReason('');
    };


    const handleAddCollection = () => {
        if (!onAddTeacherCollection || !employeeId) return;
        const amount = parseFloat(newCollectionAmount);
        if (!amount || amount <= 0) {
            alert('يرجى إدخال مبلغ صحيح.');
            return;
        }

        onAddTeacherCollection({
            teacherId: employeeId,
            date: new Date().toISOString(),
            amount: amount,
            month: selectedMonth,
            notes: newCollectionNotes
        });

        setNewCollectionAmount('');
        setNewCollectionNotes('');
        alert('تم تسجيل التحصيل بنجاح.');
    };


    const handleSendWhatsAppReport = () => {
        if (!employeeId) return;
        const monthName = new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
        const roleTitle = isSupervisor ? 'المشرف/ة' : 'المدرس/ة';

        let message = `*تقرير الراتب - ${monthName}*\\n`;
        message += `*${roleTitle}:* ${employeeName}\\n\\n`;
        message += `*--- تفاصيل الراتب ---*\\n`;

        if (payrollData.isPartnership) {
            message += `*نوع المحاسبة:* شراكة (${payrollData.partnershipPercentage}%)\\n`;
            message += `*المبلغ المحصّل:* ${payrollData.collectedAmount.toLocaleString()} EGP\\n`;
            message += `*المبلغ المسلّم للإدارة:* ${payrollData.totalHandedOver.toLocaleString()} EGP\\n`;
            if (payrollData.remainingBalance > 0) {
                message += `*المبلغ المتبقي (في ذمتك):* ${payrollData.remainingBalance.toLocaleString()} EGP\\n`;
            }
            message += `*نصيبك من المحصل:* ${payrollData.partnershipAmount.toFixed(2)} EGP\\n`;
        } else {
            message += `*الراتب الأساسي:* ${payrollData.baseSalary.toLocaleString()} EGP\\n`;
        }

        message += `*مكافأة حضور (${payrollData.bonusDays} يوم):* +${payrollData.attendanceBonus.toFixed(2)} EGP\\n`;

        if (bonusRecordsWithReason.length > 0) {
            message += `*تفاصيل المكافآت:*\\n`;
            bonusRecordsWithReason.forEach(r => {
                let bonusAmountText = '';
                switch (r.status) {
                    case TeacherAttendanceStatus.BONUS_DAY: bonusAmountText = 'يوم كامل'; break;
                    case TeacherAttendanceStatus.BONUS_HALF_DAY: bonusAmountText = 'نصف يوم'; break;
                    case TeacherAttendanceStatus.BONUS_QUARTER_DAY: bonusAmountText = 'ربع يوم'; break;
                }
                message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric' })}: ${r.reason} (${bonusAmountText})\\n`;
            });
        }

        // المكافآت اليدوية
        const manualBonusesForMonth = teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth);
        if (manualBonusesForMonth.length > 0) {
            message += `*مكافآت يدوية (${manualBonusesForMonth.length}):* +${payrollData.manualBonusTotal.toLocaleString()} EGP\\n`;
            manualBonusesForMonth.forEach(b => {
                message += `  - ${new Date(b.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric' })}: ${b.amount.toLocaleString()} EGP${b.reason ? ` - ${b.reason}` : ''}\\n`;
            });
        }

        message += `*خصم الغياب (${payrollData.absenceDays} يوم):* -${payrollData.absenceDeduction.toFixed(2)} EGP\\n`;

        if (deductionRecordsWithReason.length > 0) {
            message += `*تفاصيل الخصومات:*\\n`;
            deductionRecordsWithReason.forEach(r => {
                let deductionAmountText = '';
                switch (r.status) {
                    case TeacherAttendanceStatus.HALF_DAY: deductionAmountText = 'نصف يوم'; break;
                    case TeacherAttendanceStatus.QUARTER_DAY: deductionAmountText = 'ربع يوم'; break;
                }
                message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric' })}: ${r.reason} (${deductionAmountText})\\n`;
            });
        }

        message += `*الراتب النهائي:* *${payrollData.finalSalary.toFixed(2)} EGP*\\n\\n`;
        message += `مع تحيات إدارة مركز الشاطبي.`;

        const phone = employeePhone.replace(/[^0-9]/g, '');
        if (!phone) {
            alert('لا يوجد رقم هاتف مسجل.');
            return;
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    if (!isOpen || !employee) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-scale-up">
                    <div className="flex-shrink-0 p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${isSupervisor ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
                                {isSupervisor ? <UserIcon className="w-6 h-6" /> : <BriefcaseIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {employeeName}
                                </h2>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className={`font-medium ${isSupervisor ? 'text-blue-600' : 'text-teal-600'}`}>
                                        {isSupervisor ? 'مشرف' : 'مدرس'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-4">


                        <div className="border-t pt-3 flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                                    <a href={`https://wa.me/${employeePhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title={`واتساب ${employeeName}`}>
                                        <WhatsAppIcon className="w-5 h-5" />
                                    </a>
                                )}
                                <a href={`tel:${employeePhone.replace(/[^0-9]/g, '')}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title={`اتصال ${employeeName}`}>
                                    <PhoneIcon className="w-5 h-5" />
                                </a>
                                {!isSupervisor && (
                                    <button onClick={() => onViewTeacherReport(employeeId)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="عرض التقرير التفصيلي">
                                        <DocumentReportIcon className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => isSupervisor && supervisor && onEditSupervisorClick ? onEditSupervisorClick(supervisor) : (teacher && onEditTeacherClick(teacher))}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    title="تعديل"
                                >
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => isSupervisor && supervisor && onDeleteSupervisor ? onDeleteSupervisor(supervisor.id) : (teacher && onDeleteTeacher(teacher.id))}
                                    disabled={isSupervisor ? false : isTeacherInUse}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:text-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    title={isTeacherInUse ? "لا يمكن حذف مدرس مسؤول عن مجموعة" : "حذف"}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 border rounded-xl overflow-hidden">
                            <div className="flex border-b border-gray-200 overflow-x-auto bg-white">
                                <button onClick={() => setActiveTab('collections')} className={getTabClass('collections')}><CurrencyDollarIcon className="w-5 h-5" /> <span className="hidden sm:inline">سجل التحصيل</span></button>
                                <button onClick={() => setActiveTab('attendance')} className={getTabClass('attendance')}><CalendarCheckIcon className="w-5 h-5" /> <span className="hidden sm:inline">سجل الحضور</span></button>
                                <button onClick={() => setActiveTab('payroll')} className={getTabClass('payroll')}><CurrencyDollarIcon className="w-5 h-5" /> <span className="hidden sm:inline">الرواتب</span></button>
                                <button onClick={() => setActiveTab('groups')} className={getTabClass('groups')}><UsersIcon className="w-5 h-5" /> <span className="hidden sm:inline">{isSupervisor ? 'الأقسام' : 'المجموعات'}</span></button>
                            </div>

                            <div className="p-4">
                                {activeTab !== 'groups' && (
                                    <div className="mb-4 max-w-xs">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">عرض بيانات شهر</label>
                                        <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                )}
                                {activeTab === 'payroll' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                            {payrollData.isPartnership ? (
                                                <>
                                                    <div className="col-span-1 sm:col-span-2 bg-green-50 p-3 rounded-lg border border-green-100 mb-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm font-bold text-gray-700">نوع المحاسبة:</span>
                                                            <span className="text-sm font-bold text-green-700">شراكة ({payrollData.partnershipPercentage}%)</span>
                                                        </div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm text-gray-600">المبلغ المحصّل:</span>
                                                            <span className="font-bold">{payrollData.collectedAmount.toLocaleString()} EGP</span>
                                                        </div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm text-gray-600">المبلغ المسلّم للإدارة:</span>
                                                            <span className="font-bold text-blue-600">{payrollData.totalHandedOver.toLocaleString()} EGP</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-600">المتبقي (في ذمة المدرس):</span>
                                                            <span className={`font-bold ${payrollData.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>{payrollData.remainingBalance.toLocaleString()} EGP</span>
                                                        </div>
                                                    </div>
                                                    <div><label className="text-xs text-gray-500 font-bold uppercase">نصيب الشراكة</label><p className="font-bold text-lg text-gray-800">{payrollData.partnershipAmount.toFixed(2)} EGP</p></div>
                                                </>
                                            ) : (
                                                <div><label className="text-xs text-gray-500 font-bold uppercase">الراتب الأساسي</label><p className="font-bold text-lg text-gray-800">{payrollData.baseSalary.toLocaleString()} EGP</p></div>
                                            )}

                                            <div><label className="text-xs text-gray-500 font-bold uppercase">خصم الغياب ({payrollData.absenceDays} يوم)</label><p className="font-bold text-lg text-red-500">{payrollData.absenceDeduction.toFixed(2)}</p></div>
                                            <div><label className="text-xs text-gray-500 font-bold uppercase">مكافأة حضور ({payrollData.bonusDays} يوم)</label><p className="font-bold text-lg text-green-500">{payrollData.attendanceBonus.toFixed(2)}</p></div>
                                            <div><label className="text-xs text-gray-500 font-bold uppercase">المكافآت اليدوية</label><p className="font-bold text-lg text-purple-500">{payrollData.manualBonusTotal.toLocaleString()}</p></div>
                                            <div className="col-span-1 sm:col-span-2 pt-2 border-t"><label className="text-sm text-gray-500 font-bold">الراتب النهائي</label><p className="font-bold text-3xl text-blue-600">{payrollData.finalSalary.toFixed(2)} <span className="text-sm text-gray-500 font-normal">EGP</span></p></div>
                                        </div>

                                        {/* سجل المكافآت */}
                                        {attendanceForMonth.filter(r => getBonusValue(r.status) > 0).length > 0 && (
                                            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">سجل المكافآت</span>
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-green-50 border-b border-green-200">
                                                            <tr>
                                                                <th className="text-right p-2 font-bold text-green-700">التاريخ</th>
                                                                <th className="text-right p-2 font-bold text-green-700">النوع</th>
                                                                <th className="text-right p-2 font-bold text-green-700">السبب</th>
                                                                <th className="text-center p-2 font-bold text-green-700">القيمة</th>
                                                                <th className="text-center p-2 font-bold text-green-700">إجراء</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {attendanceForMonth.filter(r => getBonusValue(r.status) > 0).map(r => {
                                                                let bonusTypeText = '';
                                                                switch (r.status) {
                                                                    case TeacherAttendanceStatus.BONUS_DAY: bonusTypeText = 'يوم كامل'; break;
                                                                    case TeacherAttendanceStatus.BONUS_HALF_DAY: bonusTypeText = 'نصف يوم'; break;
                                                                    case TeacherAttendanceStatus.BONUS_QUARTER_DAY: bonusTypeText = 'ربع يوم'; break;
                                                                }
                                                                return (
                                                                    <tr key={r.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                                                        <td className="p-2 text-gray-700">{new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                                        <td className="p-2 text-gray-700">{bonusTypeText}</td>
                                                                        <td className="p-2 text-gray-600">{r.reason || '-'}</td>
                                                                        <td className="p-2 text-center font-bold text-green-600">{getBonusValue(r.status)}</td>
                                                                        <td className="p-2 text-center">
                                                                            <button
                                                                                onClick={() => onSetTeacherAttendance(employeeId, r.date, TeacherAttendanceStatus.PRESENT)}
                                                                                className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                                title="إلغاء المكافأة"
                                                                            >
                                                                                <TrashIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* سجل الخصومات */}
                                        {attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0).length > 0 && (
                                            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded">سجل الخصومات</span>
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-red-50 border-b border-red-200">
                                                            <tr>
                                                                <th className="text-right p-2 font-bold text-red-700">التاريخ</th>
                                                                <th className="text-right p-2 font-bold text-red-700">النوع</th>
                                                                <th className="text-right p-2 font-bold text-red-700">السبب</th>
                                                                <th className="text-center p-2 font-bold text-red-700">القيمة</th>
                                                                <th className="text-center p-2 font-bold text-red-700">إجراء</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0).map(r => {
                                                                let deductionTypeText = '';
                                                                switch (r.status) {
                                                                    case TeacherAttendanceStatus.ABSENT:
                                                                    case TeacherAttendanceStatus.DEDUCTION_FULL_DAY: deductionTypeText = 'يوم كامل'; break;
                                                                    case TeacherAttendanceStatus.HALF_DAY:
                                                                    case TeacherAttendanceStatus.DEDUCTION_HALF_DAY: deductionTypeText = 'نصف يوم'; break;
                                                                    case TeacherAttendanceStatus.QUARTER_DAY:
                                                                    case TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY: deductionTypeText = 'ربع يوم'; break;
                                                                    case TeacherAttendanceStatus.MISSING_REPORT: deductionTypeText = 'تقرير ناقص'; break;
                                                                }
                                                                return (
                                                                    <tr key={r.id} className="border-b border-gray-100 hover:bg-red-50 transition-colors">
                                                                        <td className="p-2 text-gray-700">{new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                                        <td className="p-2 text-gray-700">{deductionTypeText}</td>
                                                                        <td className="p-2 text-gray-600">{r.reason || '-'}</td>
                                                                        <td className="p-2 text-center font-bold text-red-600">{getAbsenceValue(r.status)}</td>
                                                                        <td className="p-2 text-center">
                                                                            <button
                                                                                onClick={() => onSetTeacherAttendance(employeeId, r.date, TeacherAttendanceStatus.PRESENT)}
                                                                                className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                                title="إلغاء الخصم"
                                                                            >
                                                                                <TrashIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* إضافة مكافأة/خصم يدوي - متاح دائماً */}
                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200">
                                            <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                                <span className="text-2xl">💰</span>
                                                <span>إضافة مكافأة أو خصم</span>
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-purple-700 mb-1">
                                                        المبلغ (EGP)
                                                        <span className="text-xs text-gray-500 mr-2">• موجب للمكافأة، سالب للخصم</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={additionalBonus}
                                                        onChange={(e) => setAdditionalBonus(e.target.value)}
                                                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                                        placeholder="500 أو -200"
                                                        step="0.01"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-purple-700 mb-1">السبب (اختياري)</label>
                                                    <input
                                                        type="text"
                                                        value={bonusReason}
                                                        onChange={(e) => setBonusReason(e.target.value)}
                                                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                                        placeholder="مثلاً: تميز في الأداء أو تأخير"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handlePayAdditionalBonus}
                                                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                                                    disabled={!additionalBonus || parseFloat(additionalBonus) === 0 || isNaN(parseFloat(additionalBonus))}
                                                >
                                                    ✨ تسجيل
                                                </button>
                                            </div>
                                            <p className="text-xs text-purple-600 mt-3 bg-white/50 p-2 rounded">
                                                💡 أدخل رقماً موجباً للمكافأة (+500) أو سالباً للخصم (-200). سيتم احتسابها في الراتب النهائي.
                                            </p>
                                        </div>


                                        {/* سجل المكافآت والخصومات اليدوية */}
                                        {teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth).length > 0 && (
                                            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">سجل المكافآت والخصومات</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${payrollData.manualBonusTotal >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                            {payrollData.manualBonusTotal >= 0 ? '+' : ''}{payrollData.manualBonusTotal.toLocaleString()} EGP
                                                        </span>
                                                    </span>
                                                </h4>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50 border-b border-gray-200">
                                                            <tr>
                                                                <th className="text-right p-2 font-bold text-gray-700">التاريخ</th>
                                                                <th className="text-right p-2 font-bold text-gray-700">النوع</th>
                                                                <th className="text-right p-2 font-bold text-gray-700">المبلغ</th>
                                                                <th className="text-right p-2 font-bold text-gray-700">السبب</th>
                                                                <th className="text-center p-2 font-bold text-gray-700">إجراء</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {teacherManualBonuses
                                                                .filter(b => b.teacherId === employeeId && b.month === selectedMonth)
                                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                                .map(bonus => {
                                                                    const isDeduction = bonus.amount < 0;
                                                                    const absoluteAmount = Math.abs(bonus.amount);
                                                                    return (
                                                                        <tr key={bonus.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                            <td className="p-2 text-gray-700">{new Date(bonus.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                                            <td className="p-2">
                                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isDeduction ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                                    {isDeduction ? '⬇️ خصم' : '⬆️ مكافأة'}
                                                                                </span>
                                                                            </td>
                                                                            <td className={`p-2 font-bold ${isDeduction ? 'text-red-600' : 'text-green-600'}`}>
                                                                                {isDeduction ? '-' : '+'}{absoluteAmount.toLocaleString()} EGP
                                                                            </td>
                                                                            <td className="p-2 text-gray-600">{bonus.reason || '-'}</td>
                                                                            <td className="p-2 text-center">
                                                                                {onDeleteManualBonus && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            const actionType = isDeduction ? 'الخصم' : 'المكافأة';
                                                                                            if (confirm(`هل أنت متأكد من حذف ${actionType} (${absoluteAmount.toLocaleString()} EGP)؟`)) {
                                                                                                onDeleteManualBonus(bonus.id);
                                                                                            }
                                                                                        }}
                                                                                        className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                                        title={`حذف ${isDeduction ? 'الخصم' : 'المكافأة'}`}
                                                                                    >
                                                                                        <TrashIcon className="w-4 h-4" />
                                                                                    </button>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end items-center gap-3">
                                            {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                                                <button onClick={handleSendWhatsAppReport} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-lg hover:bg-blue-200 transition-all text-sm" title="إرسال التقرير عبر واتساب">
                                                    <WhatsAppIcon className="w-5 h-5" />
                                                    <span className="hidden sm:inline">إرسال تقرير</span>
                                                </button>
                                            )}
                                            {payrollData.isPaid ? (
                                                <div className="flex gap-2 flex-grow">
                                                    <span className="flex-grow text-center py-3 px-4 rounded-lg bg-green-100 text-green-800 font-bold border border-green-200 flex items-center justify-center gap-2">
                                                        ✅ تم دفع الراتب
                                                    </span>
                                                    {onResetPayment && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('هل أنت متأكد من إلغاء دفع الراتب لهذا الشهر؟ سيتم حذف المصروف المسجل واسترجاع حالة الدفع.')) {
                                                                    onResetPayment(employeeId, selectedMonth, employeeName);
                                                                }
                                                            }}
                                                            className="py-3 px-4 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                                                            title="إلغاء الدفع"
                                                        >
                                                            إلغاء الدفع
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <button onClick={() => handlePayEmployee(payrollData.finalSalary)} className="flex-grow py-3 px-6 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                                                    دفع الراتب
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'attendance' && (
                                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-around mb-6 text-center">
                                            <div>
                                                <p className="text-2xl font-bold text-red-500">{payrollData.absenceDays}</p>
                                                <p className="text-xs text-gray-500 font-semibold">غياب (مكافئ)</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-green-500">{payrollData.bonusDays}</p>
                                                <p className="text-xs text-gray-500 font-semibold">إضافي</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded text-center">اضغط لتسجيل الغياب الكامل. للمكافآت والخصومات الجزئية استخدم الأزرار العلوية.</div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {Array.from({ length: new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate() }, (_, i) => i + 1).map(day => {
                                                const date = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                                                const record = teacherAttendance.find(a => a.teacherId === employeeId && a.date === date);
                                                const absenceValue = record ? getAbsenceValue(record.status) : 0;
                                                const bonusValue = record ? getBonusValue(record.status) : 0;

                                                let buttonClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                                                if (absenceValue === 1) buttonClass = 'bg-red-500 text-white font-bold shadow-red-500/50';
                                                else if (absenceValue > 0) buttonClass = 'bg-orange-400 text-white font-bold shadow-orange-400/50';
                                                else if (bonusValue > 0) buttonClass = 'bg-purple-500 text-white font-bold shadow-purple-500/50';
                                                else if (!record) buttonClass = 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200';


                                                return (
                                                    <button key={day} onClick={() => onSetTeacherAttendance(employeeId, date, record ? TeacherAttendanceStatus.PRESENT : TeacherAttendanceStatus.ABSENT)} className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all duration-200 shadow-sm ${buttonClass}`} title={new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' })}>
                                                        {day}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'groups' && (
                                    <div className="space-y-3">
                                        {isSupervisor ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {supervisor?.section.map((section, idx) => (
                                                    <div key={idx} className="flex items-center bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 ml-3 flex-shrink-0">
                                                            <UsersIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <span className="block text-xs text-gray-500 font-bold uppercase mb-1">قسم</span>
                                                            <span className="font-bold text-lg text-gray-800 bg-blue-100 px-2 py-1 rounded-md">{section}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {assignedGroups.length > 0 ? (
                                                    assignedGroups.map(group => (
                                                        <div key={group.id} className="flex items-center bg-white p-4 rounded-xl border border-teal-100 shadow-sm">
                                                            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 ml-3 flex-shrink-0">
                                                                <UsersIcon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <span className="block text-sm text-gray-500 font-bold uppercase">مجموعة</span>
                                                                <span className="font-bold text-lg text-gray-800">{group.name}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                        <p className="text-gray-500 font-medium">لم يتم إسناد أي مجموعات لهذا المدرس.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'collections' && (
                                    <div className="space-y-6">
                                        {/* Financial Summary */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <p className="text-sm text-blue-600 font-medium mb-1">إجمالي ما جمعه المدرس</p>
                                                <p className="text-2xl font-bold text-blue-700">{payrollData.collectedAmount.toLocaleString()} EGP</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <p className="text-sm text-green-600 font-medium mb-1">ما تم تسليمه للإدارة</p>
                                                <p className="text-2xl font-bold text-green-700">{payrollData.totalHandedOver.toLocaleString()} EGP</p>
                                            </div>
                                            <div className={`p-4 rounded-lg border ${payrollData.remainingBalance > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                                                <p className={`text-sm font-medium mb-1 ${payrollData.remainingBalance > 0 ? 'text-orange-600' : 'text-gray-600'}`}>المتبقي في ذمة المدرس</p>
                                                <p className={`text-2xl font-bold ${payrollData.remainingBalance > 0 ? 'text-orange-700' : 'text-gray-700'}`}>{payrollData.remainingBalance.toLocaleString()} EGP</p>
                                            </div>
                                        </div>

                                        {/* Add Collection Form */}
                                        {onAddTeacherCollection && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <h4 className="font-bold text-gray-700 mb-3 text-sm">تسجيل تحصيل جديد</h4>
                                                <div className="flex flex-col sm:flex-row gap-3 items-end">
                                                    <div className="flex-grow w-full sm:w-auto">
                                                        <label className="block text-xs text-gray-500 mb-1">المبلغ</label>
                                                        <input
                                                            type="number"
                                                            value={newCollectionAmount}
                                                            onChange={(e) => setNewCollectionAmount(e.target.value)}
                                                            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-[2] w-full sm:w-auto">
                                                        <label className="block text-xs text-gray-500 mb-1">ملاحظات</label>
                                                        <input
                                                            type="text"
                                                            value={newCollectionNotes}
                                                            onChange={(e) => setNewCollectionNotes(e.target.value)}
                                                            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                                            placeholder="ملاحظات إضافية..."
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleAddCollection}
                                                        disabled={!newCollectionAmount}
                                                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm h-[38px]"
                                                    >
                                                        تسجيل
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-bold text-gray-700 mb-3 text-sm">سجل التحصيلات السابق</h4>
                                            {teacherCollections.filter(c => c.teacherId === employeeId).length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-right">
                                                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                                                            <tr>
                                                                <th className="py-3 px-4">التاريخ</th>
                                                                <th className="py-3 px-4">الشهر</th>
                                                                <th className="py-3 px-4">المبلغ</th>
                                                                <th className="py-3 px-4">ملاحظات</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {teacherCollections
                                                                .filter(c => c.teacherId === employeeId)
                                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                                .map((collection) => (
                                                                    <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                                                                        <td className="py-3 px-4">{new Date(collection.date).toLocaleDateString('ar-EG')}</td>
                                                                        <td className="py-3 px-4">{collection.month}</td>
                                                                        <td className="py-3 px-4 font-bold text-green-600">{collection.amount.toLocaleString()} EGP</td>
                                                                        <td className="py-3 px-4 text-gray-500">{collection.notes || '-'}</td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-8">لا يوجد سجلات تحصيل لهذا المدرس.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isBonusModalOpen && (
                <BonusReasonModal
                    isOpen={isBonusModalOpen}
                    onClose={() => setIsBonusModalOpen(false)}
                    onConfirm={handleConfirmBonus}
                    teacherName={employeeName}
                />
            )}
            {isDeductionModalOpen && (
                <DeductionReasonModal
                    isOpen={isDeductionModalOpen}
                    onClose={() => setIsDeductionModalOpen(false)}
                    onConfirm={handleConfirmDeduction}
                    teacherName={employeeName}
                />
            )}
        </>
    );
};

export default TeacherDetailsModal;
