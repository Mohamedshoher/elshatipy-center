
import React, { useState, useMemo, useEffect } from 'react';
import type { Teacher, Group, TeacherAttendanceRecord, TeacherPayrollAdjustment, Expense, FinancialSettings, Student, Supervisor, TeacherCollectionRecord, TeacherManualBonus, CurrentUser, UserRole, SalaryPayment } from '../types';
import { TeacherStatus, ExpenseCategory, TeacherAttendanceStatus, PaymentType, roundToNearest5 } from '../types';
import PhoneIcon from './icons/PhoneIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import UsersIcon from './icons/UsersIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import UserIcon from './icons/UserIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import XIcon from './icons/XIcon';
import BonusReasonModal from './BonusReasonModal';
import DeductionReasonModal from './DeductionReasonModal';
import TeacherAttendanceCalendar from './TeacherAttendanceCalendar';
import AttendanceActionModal from './AttendanceActionModal';
import { getCairoNow, parseCairoDateString, getCairoDateString } from '../services/cairoTimeHelper';

interface TeacherDetailsPageProps {
    onBack: () => void;
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
    onDeleteExpense?: (expenseId: string) => void;
    onViewTeacherReport: (teacherId: string) => void;
    onSendNotificationToAll: (content: string) => void;
    teacherCollections?: TeacherCollectionRecord[];
    teacherManualBonuses?: TeacherManualBonus[];
    salaryPayments?: SalaryPayment[];
    currentUserRole?: UserRole;
    onAddTeacherCollection?: (collection: Omit<TeacherCollectionRecord, 'id'>) => void;
    onDeleteTeacherCollection?: (collectionId: string) => void;
    onAddManualBonus?: (bonus: Omit<TeacherManualBonus, 'id'>) => void;
    onDeleteManualBonus?: (bonusId: string) => void;
    onDeleteTeacherAttendance?: (recordId: string) => void;
    onResetPayment?: (employeeId: string, month: string, employeeName: string) => void;
    onDeleteDirectorCollection?: (collectionId: string) => void;
    onAddSalaryPayment?: (payment: Omit<SalaryPayment, 'id'>) => void;
    onDeleteSalaryPayment?: (paymentId: string) => void;
}

const getAbsenceValue = (status: TeacherAttendanceStatus): number => {
    switch (status) {
        case TeacherAttendanceStatus.ABSENT: return 1;
        case TeacherAttendanceStatus.HALF_DAY: return 0.5;
        case TeacherAttendanceStatus.QUARTER_DAY: return 0.25;
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

const TeacherDetailsPage: React.FC<TeacherDetailsPageProps> = ({
    onBack,
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
    onDeleteExpense,
    onViewTeacherReport,
    onSendNotificationToAll,
    teacherCollections = [],
    teacherManualBonuses = [],
    salaryPayments = [],
    currentUserRole,
    onAddTeacherCollection,
    onDeleteTeacherCollection,
    onAddManualBonus,
    onDeleteManualBonus,
    onDeleteTeacherAttendance,
    onResetPayment,
    onDeleteDirectorCollection,
    onAddSalaryPayment,
    onDeleteSalaryPayment,
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
    const [manualActionType, setManualActionType] = useState<'bonus' | 'deduction'>('bonus');
    const [manualAmountType, setManualAmountType] = useState<'quarter' | 'half' | 'full' | 'custom'>('custom');
    const [calendarSelectedDate, setCalendarSelectedDate] = useState<string | null>(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isDeficitDetailsOpen, setIsDeficitDetailsOpen] = useState(false);
    const [isCollectedDetailsOpen, setIsCollectedDetailsOpen] = useState(false);

    const employee = teacher || supervisor;
    const isSupervisor = !!supervisor;

    useEffect(() => {
        // Reset state when employee changes
        if (employee) {
            window.scrollTo(0, 0);
            setActiveTab('collections');
        }
    }, [employee?.id]);

    if (!employee) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">لم يتم اختيار موظف لعرض بياناته.</p>
                <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all font-bold">العودة</button>
            </div>
        );
    }

    const employeeId = employee.id;
    const employeeName = employee.name;
    const employeePhone = employee.phone;
    const employeeSalary = (employee as Teacher).salary || (employee as Supervisor).salary || 0;

    const isTeacherInUse = useMemo(() => {
        if (!teacher) return false;
        return groups.some(g => g.teacherId === teacher.id);
    }, [groups, teacher]);

    const assignedGroups = useMemo(() => {
        if (!teacher) return [];
        return groups.filter(g => g.teacherId === teacher.id);
    }, [groups, teacher]);

    const today = new Date().toISOString().split('T')[0];

    const handleBonusClick = (bonusStatus: TeacherAttendanceStatus) => {
        setBonusTypeToGive(bonusStatus);
        setIsBonusModalOpen(true);
    };

    const handleConfirmBonus = (reason: string) => {
        if (!employeeId || !bonusTypeToGive) return;
        const dateToUse = calendarSelectedDate || today;
        onSetTeacherAttendance(employeeId, dateToUse, bonusTypeToGive, reason);
        let bonusAmountText = '';
        switch (bonusTypeToGive) {
            case TeacherAttendanceStatus.BONUS_DAY: bonusAmountText = 'يوم كامل'; break;
            case TeacherAttendanceStatus.BONUS_HALF_DAY: bonusAmountText = 'نصف يوم'; break;
            case TeacherAttendanceStatus.BONUS_QUARTER_DAY: bonusAmountText = 'ربع يوم'; break;
        }
        const roleTitle = isSupervisor ? 'المشرف/ة' : 'المدرس/ة';
        const notificationContent = `🎉 مكافأة! حصل ${roleTitle} ${employeeName} على مكافأة (${bonusAmountText}) وذلك لـ: "${reason}".`;
        onSendNotificationToAll(notificationContent);
        setIsBonusModalOpen(false);
        setBonusTypeToGive(null);
        setCalendarSelectedDate(null);
    };

    const handleDeductionClick = (deductionStatus: TeacherAttendanceStatus) => {
        setDeductionTypeToApply(deductionStatus);
        setIsDeductionModalOpen(true);
    };

    const handleConfirmDeduction = (reason: string) => {
        if (!employeeId || !deductionTypeToApply) return;
        const dateToUse = calendarSelectedDate || today;
        onSetTeacherAttendance(employeeId, dateToUse, deductionTypeToApply, reason);
        setIsDeductionModalOpen(false);
        setDeductionTypeToApply(null);
        setCalendarSelectedDate(null);
    };

    const handleCalendarDateClick = (date: string) => {
        setCalendarSelectedDate(date);
        setIsActionModalOpen(true);
    };

    const handleActionSelect = (status: TeacherAttendanceStatus | null) => {
        if (!employeeId || !calendarSelectedDate) return;

        if (status === null) {
            const record = teacherAttendance.find(r => r.teacherId === employeeId && r.date === calendarSelectedDate);
            if (record && onDeleteTeacherAttendance) {
                onDeleteTeacherAttendance(record.id);
            }
            setIsActionModalOpen(false);
            setCalendarSelectedDate(null);
            return;
        }

        if (status === TeacherAttendanceStatus.PRESENT || status === TeacherAttendanceStatus.ABSENT) {
            onSetTeacherAttendance(employeeId, calendarSelectedDate, status);
            setIsActionModalOpen(false);
            setCalendarSelectedDate(null);
        } else if (getBonusValue(status) > 0) {
            setBonusTypeToGive(status);
            setIsActionModalOpen(false);
            setIsBonusModalOpen(true);
        } else if (getAbsenceValue(status) > 0) {
            setDeductionTypeToApply(status);
            setIsActionModalOpen(false);
            setIsDeductionModalOpen(true);
        }
    };

    const getTabClass = (tabName: 'payroll' | 'attendance' | 'groups' | 'collections') => {
        const baseClass = "py-3 px-2 font-bold text-center transition-all duration-200 focus:outline-none flex-shrink-0 flex items-center justify-center gap-2 flex-grow text-sm";
        if (activeTab === tabName) {
            return `${baseClass} border-b-2 border-teal-600 text-teal-600 bg-teal-50`;
        }
        return `${baseClass} text-gray-500 hover:bg-gray-100`;
    };

    const attendanceForMonth = useMemo(() => {
        if (!employeeId) return [];
        const monthPrefix = selectedMonth;
        return teacherAttendance.filter(a =>
            a.teacherId === employeeId && a.date.startsWith(monthPrefix) && a.status !== TeacherAttendanceStatus.EXCUSED
        );
    }, [employeeId, teacherAttendance, selectedMonth]);

    const payrollData = useMemo(() => {
        if (!employeeId) return { baseSalary: 0, adjustments: { bonus: 0, isPaid: false }, absenceDays: 0, bonusDays: 0, absenceDeduction: 0, attendanceBonus: 0, manualBonusTotal: 0, finalSalary: 0, isPaid: false, isPartnership: false, partnershipAmount: 0, collectedAmount: 0, totalHandedOver: 0, deliveryDeficit: 0, collectedByTeacher: 0, collectedByDirector: 0, totalCollectedRevenue: 0, groupExpensesAmount: 0, receivedFromDirectorAmount: 0, totalExpectedExpenses: 0, groupDeficit: 0, collectedStudents: [] };

        // Calculate collected amount - differentiate between teacher and director collection
        let collectedByTeacher = 0;
        let collectedByDirector = 0;
        let totalCollectedRevenue = 0;
        let totalExpectedExpenses = 0;
        let collectedStudents: { name: string, amount: number, isArchived: boolean, isTransferred: boolean, groupName?: string, receiptNumber?: string }[] = [];

        if (!isSupervisor && teacher) {
            const teacherGroupIds = new Set(
                groups.filter(g => g.teacherId === teacher.id).map(g => g.id)
            );

            const monthPrefix = selectedMonth;

            students.forEach(s => {
                const monthFee = s.fees?.find(f => f.month === monthPrefix && f.paid);

                // 1. Calculate Cash Held by Teacher (From ANY student, even if transferred/archived)
                if (monthFee) {
                    const isCollectedByThisTeacher = monthFee.collectedBy === teacher.id;
                    const isMissingCollectorButInGroup = !monthFee.collectedBy && teacherGroupIds.has(s.groupId);

                    if (isCollectedByThisTeacher || isMissingCollectorButInGroup) {
                        const amount = monthFee.amountPaid || 0;
                        collectedByTeacher += amount;

                        const isTransferred = !teacherGroupIds.has(s.groupId) && !s.isArchived;
                        const groupName = groups.find(g => g.id === s.groupId)?.name;

                        collectedStudents.push({
                            name: s.name,
                            amount: amount,
                            isArchived: s.isArchived,
                            isTransferred: isTransferred,
                            groupName: groupName,
                            receiptNumber: monthFee.receiptNumber || '' // Ensure it's never undefined
                        });
                    }
                }

                // 2. Only consider students in the teacher's groups for Revenue and Expected Expenses
                if (teacherGroupIds.has(s.groupId)) {
                    const hasPaidCurrentMonth = !!monthFee;

                    // Add to totalCollectedRevenue if a fee was paid for this month, regardless of who collected it
                    if (monthFee) {
                        totalCollectedRevenue += (monthFee.amountPaid || 0);

                        // If collected by director but student is in this teacher's group, count it (already added to revenue mainly)
                        if (monthFee.collectedBy === 'director') {
                            collectedByDirector += (monthFee.amountPaid || 0);
                        }
                    }

                    const attendanceInMonth = s.attendance.filter(record => {
                        return record.date.startsWith(monthPrefix) && record.status === 'present';
                    }).length;

                    const group = groups.find(g => g.id === s.groupId);
                    const isIqraaGroup = group?.name.includes('إقراء') || group?.name.includes('اقراء');
                    const meetsAttendanceRule = isIqraaGroup || attendanceInMonth >= 5;

                    // 15-day grace period rule
                    let isWithinGracePeriod = false;
                    if (!hasPaidCurrentMonth) {
                        const joiningDate = parseCairoDateString(s.joiningDate);
                        joiningDate.setHours(0, 0, 0, 0);
                        const [year, monthNum] = selectedMonth.split('-').map(Number);
                        const lastDayDate = new Date(year, monthNum, 0);
                        const checkDate = getCairoNow() < lastDayDate ? getCairoNow() : lastDayDate;
                        checkDate.setHours(0, 0, 0, 0);
                        const diffTime = checkDate.getTime() - joiningDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays < 15) isWithinGracePeriod = true;
                    }

                    if (hasPaidCurrentMonth || (!s.isArchived && meetsAttendanceRule && !isWithinGracePeriod)) {
                        totalExpectedExpenses += (s.monthlyFee || 0);
                    }
                }
            });

            // Sort by receipt number numerically
            collectedStudents.sort((a, b) => {
                const numA = parseInt(a.receiptNumber?.replace(/\D/g, '') || '999999');
                const numB = parseInt(b.receiptNumber?.replace(/\D/g, '') || '999999');
                return numA - numB;
            });
        }

        const collectedAmount = collectedByTeacher; // Legacy alias

        const isPartnership = !isSupervisor && teacher?.paymentType === PaymentType.PARTNERSHIP;
        const baseSalary = isPartnership ? 0 : employeeSalary;
        const partnershipPercentage = isPartnership ? (teacher?.partnershipPercentage || 0) : 0;
        const partnershipAmount = isPartnership ? (totalCollectedRevenue * partnershipPercentage / 100) : 0;

        // Calculate handed over and remaining balance for partnership
        const collectionsForMonth = teacherCollections.filter(c => c.teacherId === employeeId && c.month === selectedMonth);
        const totalHandedOver = collectionsForMonth.reduce((sum, c) => sum + c.amount, 0);

        // Delivery Deficit: What teacher collected - What teacher handed over
        const deliveryDeficit = collectedByTeacher - totalHandedOver;

        // Group Deficit: Total Expected - Total Collected (by anyone)
        const groupDeficit = totalExpectedExpenses - totalCollectedRevenue;

        // New Calculations for specific notes
        const groupExpensesAmount = collectionsForMonth
            .filter(c => c.notes && c.notes.includes('مصروفات المجموعة'))
            .reduce((sum, c) => sum + c.amount, 0);

        const receivedFromDirectorAmount = collectionsForMonth
            .filter(c => c.notes && (c.notes.includes('استلام من المدير') || c.notes.includes('من المدير')))
            .reduce((sum, c) => sum + c.amount, 0);

        // Calculate manual bonuses for this month
        const manualBonusesForMonth = teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth);
        const manualBonusTotal = manualBonusesForMonth.reduce((sum, b) => sum + b.amount, 0);

        const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === employeeId && p.month === selectedMonth) || { bonus: 0, isPaid: false };

        let totalAbsenceValue = 0;
        let totalBonusValue = 0;

        for (const record of attendanceForMonth) {
            totalAbsenceValue += getAbsenceValue(record.status);
            totalBonusValue += getBonusValue(record.status);
        }

        const absenceDays = totalAbsenceValue;
        const bonusDays = totalBonusValue;

        // Calculate effective salary for daily rate
        const effectiveSalary = isPartnership ? partnershipAmount : baseSalary;

        const workingDays = financialSettings.workingDaysPerMonth || 22; // Default to 22 if 0
        const dailyRate = effectiveSalary > 0 ? effectiveSalary / workingDays : 0;
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
            deliveryDeficit, // Formerly remainingBalance
            partnershipPercentage,
            collectedByTeacher,
            collectedByDirector,
            totalCollectedRevenue,
            groupExpensesAmount,
            receivedFromDirectorAmount,
            totalExpectedExpenses,
            groupDeficit,
            collectedStudents: collectedStudents.sort((a, b) => b.amount - a.amount)
        };
    }, [employeeId, employeeSalary, selectedMonth, teacherPayrollAdjustments, attendanceForMonth, financialSettings, teacherCollections, teacherManualBonuses, teacher, isSupervisor, groups, students]);

    const deficitBreakdown = useMemo(() => {
        if (!teacher || isSupervisor) return [];
        const teacherGroupIds = new Set(groups.filter(g => g.teacherId === teacher.id).map(g => g.id));
        const result: { studentName: string, expected: number, paid: number, diff: number, isFullDeficit: boolean }[] = [];
        const monthPrefix = selectedMonth;

        students.forEach(s => {
            if (teacherGroupIds.has(s.groupId)) {
                const monthFee = s.fees?.find(f => f.month === monthPrefix && f.paid);
                const hasPaidCurrentMonth = !!monthFee;

                const attendanceInMonth = s.attendance.filter(record => {
                    return record.date.startsWith(monthPrefix) && record.status === 'present';
                }).length;

                const group = groups.find(g => g.id === s.groupId);
                const isIqraaGroup = group?.name.includes('إقراء') || group?.name.includes('اقراء');
                const meetsAttendanceRule = isIqraaGroup || attendanceInMonth >= 5;

                // 15-day grace period rule
                let isWithinGracePeriod = false;
                if (!hasPaidCurrentMonth) {
                    const joiningDate = parseCairoDateString(s.joiningDate);
                    joiningDate.setHours(0, 0, 0, 0);
                    const [year, monthNum] = selectedMonth.split('-').map(Number);
                    const lastDayDate = new Date(year, monthNum, 0);
                    const checkDate = getCairoNow() < lastDayDate ? getCairoNow() : lastDayDate;
                    checkDate.setHours(0, 0, 0, 0);
                    const diffTime = checkDate.getTime() - joiningDate.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays < 15) isWithinGracePeriod = true;
                }

                if (hasPaidCurrentMonth || (!s.isArchived && meetsAttendanceRule && !isWithinGracePeriod)) {
                    const expected = s.monthlyFee || 0;
                    if (expected > 0) {
                        const paid = monthFee?.amountPaid || 0;
                        if (paid < expected) {
                            result.push({
                                studentName: s.name,
                                expected,
                                paid,
                                diff: expected - paid,
                                isFullDeficit: paid === 0
                            });
                        }
                    }
                }
            }
        });
        return result.sort((a, b) => b.diff - a.diff);
    }, [teacher, groups, students, selectedMonth, isSupervisor]);

    const bonusRecordsWithReason = useMemo(() =>
        attendanceForMonth.filter(r => getBonusValue(r.status) > 0 && r.reason),
        [attendanceForMonth]);

    const deductionRecordsWithReason = useMemo(() =>
        attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0 && r.status !== TeacherAttendanceStatus.ABSENT && r.reason),
        [attendanceForMonth]);

    const allCollections = useMemo(() => {
        if (!employeeId) return [];
        const teacherRecords = teacherCollections
            .filter(c => c.teacherId === employeeId && c.month === selectedMonth)
            .map(c => ({ ...c, type: 'handed_over' as const }));

        const directorRecords: any[] = [];
        if (!isSupervisor && teacher) {
            const teacherGroupIds = new Set(groups.filter(g => g.teacherId === teacher.id).map(g => g.id));
            const teacherStudents = students.filter(s => teacherGroupIds.has(s.groupId));
            teacherStudents.forEach(s => {
                const monthFee = s.fees?.find(f => f.month === selectedMonth && f.paid && f.collectedBy === 'director');
                if (monthFee) {
                    directorRecords.push({
                        id: `dir-${s.id}-${monthFee.month}`,
                        date: monthFee.paymentDate || `${monthFee.month}-01`,
                        amount: monthFee.amountPaid || 0,
                        notes: `تحصيل مباشر للطلاب: ${s.name}`,
                        type: 'director_collection' as const
                    });
                }
            });
        }
        return [...teacherRecords, ...directorRecords].sort((a, b) => b.date.localeCompare(a.date));
    }, [employeeId, teacherCollections, selectedMonth, isSupervisor, teacher, groups, students]);

    const filteredManualBonuses = useMemo(() => {
        return teacherManualBonuses
            .filter(b => b.teacherId === employeeId && b.month === selectedMonth)
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [teacherManualBonuses, employeeId, selectedMonth]);

    const totalPaidSalary = useMemo(() => {
        return salaryPayments
            .filter(p => p.teacherId === employeeId && p.month === selectedMonth)
            .reduce((sum, p) => sum + p.amount, 0);
    }, [salaryPayments, employeeId, selectedMonth]);

    const handleAddSalaryPaymentWrapper = () => {
        if (!onAddSalaryPayment || !employeeId) return;
        const amount = parseFloat(prompt('أدخل المبلغ المراد صرفه:') || '0');
        if (amount > 0) {
            onAddSalaryPayment({
                teacherId: employeeId,
                month: selectedMonth,
                amount: amount,
                date: new Date().toISOString().split('T')[0],
                addedBy: 'director', // In a real app, use currentUser ID
                notes: 'صرف يدوي'
            });

            // Automatically log as expense
            const roleTitle = isSupervisor ? 'مشرف' : 'مدرس';
            const category = isSupervisor ? ExpenseCategory.SUPERVISOR_SALARY : ExpenseCategory.TEACHER_SALARY;

            onLogExpense({
                date: new Date().toISOString().split('T')[0],
                category: category,
                description: `صرف راتب (جزئي) لـ ${roleTitle}: ${employeeName} - شهر ${selectedMonth}`,
                amount: amount,
            });

            alert(`تم إضافة دفعة بقيمة ${amount} ج.م وتسجيلها في المصروفات.`);
        }
    };

    const handleManualSalaryExpense = () => {
        const amount = parseFloat(prompt('أدخل مبلغ مصروف الراتب (للتسجيل اليدوي فقط - لن يظهر في سجل الدفعات):') || '0');
        if (amount > 0) {
            const roleTitle = isSupervisor ? 'مشرف' : 'مدرس';
            const category = isSupervisor ? ExpenseCategory.SUPERVISOR_SALARY : ExpenseCategory.TEACHER_SALARY;

            onLogExpense({
                date: new Date().toISOString().split('T')[0],
                category: category,
                description: `راتب (يدوي) لـ ${roleTitle}: ${employeeName} - شهر ${selectedMonth}`,
                amount: amount,
            });
            alert(`تم تسجيل مصروف راتب بقيمة ${amount} ج.م بنجاح.`);
        }
    };

    const handleCancelPayment = () => {
        if (!employeeId) return;
        if (window.confirm('هل أنت متأكد من إلغاء حالة "تم الصرف" لهذا الشهر؟\nملاحظة: السجلات المالية (الدفعات) لن تحذف تلقائياً وعليك حذفها يدوياً من الجدول إذا أردت استرداد المبلغ.')) {
            onUpdatePayrollAdjustments({
                teacherId: employeeId,
                month: selectedMonth,
                isPaid: false
            });
        }
    };

    const handlePayEmployee = (finalSalary: number) => {
        if (!employeeId || finalSalary <= 0) return;

        // If there are partial payments, we should probably warn or handle differently?
        // Actually, the "Pay" button usually implies "Mark as Fully Paid" or "Log Expense".
        // The user wants partial payments.
        // We can keep the "Mark as Paid" flag for the final check, but maybe disable "Full Pay" button if using partials, 
        // OR make "Full Pay" just add the remaining amount as a payment?
        // For now, let's keep the legacy "Pay" button but maybe rename it to "تسجيل صرف كامل الراتب" 
        // and allow it to log the *remaining* amount?

        const remainingToPay = Math.max(0, finalSalary - totalPaidSalary);

        if (remainingToPay <= 0) {
            alert('تم صرف الراتب بالكامل بالفعل.');
            return;
        }

        if (window.confirm(`سيتم صرف المبلغ المتبقي (${remainingToPay} ج.م). هل أنت متأكد؟`)) {
            const category = isSupervisor ? ExpenseCategory.SUPERVISOR_SALARY : ExpenseCategory.TEACHER_SALARY;
            const descRole = isSupervisor ? 'المشرف' : 'المدرس';

            // Support legacy behavior for now OR switch to new system entirely?
            // User asked for "Include ability to pay part of salary".
            // So we should probably use the new system for consistency.
            if (onAddSalaryPayment) {
                onAddSalaryPayment({
                    teacherId: employeeId,
                    month: selectedMonth,
                    amount: remainingToPay,
                    date: new Date().toISOString().split('T')[0],
                    addedBy: 'director',
                    notes: `صرف باقي الراتب للمدة ${selectedMonth}`
                });

                // Auto-log expense for the remaining part
                onLogExpense({
                    date: new Date().toISOString().split('T')[0],
                    category: category,
                    description: `راتب ${descRole}: ${employeeName} - شهر ${selectedMonth} (تكملة الراتب)`,
                    amount: remainingToPay,
                });
            } else {
                // Fallback to legacy expense logging if onAddSalaryPayment not available (should happen only if not updated in App)
                onLogExpense({
                    date: new Date().toISOString().split('T')[0],
                    category: category,
                    description: `راتب ${descRole}: ${employeeName} - شهر ${selectedMonth} (نهائي)`,
                    amount: remainingToPay,
                });
            }

            // Mark as paid in adjustments to close the month visually if needed
            // But with partial payments, "isPaid" boolean might be redundant or confusing?
            // We can keep it to mean "Closed/Settled".
            onUpdatePayrollAdjustments({
                teacherId: employeeId,
                month: selectedMonth,
                isPaid: true
            });
        }
    };

    const handlePayAdditionalBonus = () => {
        if (!employeeId || !onAddManualBonus) return;

        let amount = 0;
        if (manualAmountType === 'custom') {
            amount = parseFloat(additionalBonus);
        } else {
            const effectiveSalary = payrollData.isPartnership ? payrollData.partnershipAmount : payrollData.baseSalary;
            const dailyRate = (effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0)
                ? effectiveSalary / financialSettings.workingDaysPerMonth
                : 0;

            switch (manualAmountType) {
                case 'quarter': amount = dailyRate * 0.25; break;
                case 'half': amount = dailyRate * 0.5; break;
                case 'full': amount = dailyRate; break;
            }
            amount = roundToNearest5(amount);
        }

        if (isNaN(amount) || amount === 0) {
            alert('يرجى إدخال مبلغ صحيح (غير صفري).');
            return;
        }

        if (manualActionType === 'deduction') {
            amount = -Math.abs(amount);
        } else {
            amount = Math.abs(amount);
        }

        const isDeduction = amount < 0;
        const absoluteAmount = Math.abs(amount);

        const manualBonusData: any = {
            teacherId: employeeId,
            month: selectedMonth,
            amount: amount,
            date: new Date().toISOString(),
            addedBy: currentUserRole || 'director'
        };

        if (bonusReason && bonusReason.trim()) {
            manualBonusData.reason = bonusReason.trim();
        }

        onAddManualBonus(manualBonusData);

        const descRole = isSupervisor ? 'مشرف' : 'مدرس';
        const actionType = isDeduction ? 'خصم يدوي' : 'مكافأة يدوية';
        const expenseCategory = isDeduction ? ExpenseCategory.OTHER : ExpenseCategory.TEACHER_BONUS;

        onLogExpense({
            date: new Date().toISOString().split('T')[0],
            category: expenseCategory,
            description: `${actionType} ${isDeduction ? 'من' : 'لـ'} ${descRole}: ${employeeName}${bonusReason ? ` - ${bonusReason}` : ''} - شهر ${selectedMonth}`,
            amount: absoluteAmount,
        });

        const actionText = isDeduction ? 'خصم' : 'مكافأة';
        alert(`تم تسجيل ${actionText} بقيمة ${absoluteAmount.toLocaleString()} EGP بنجاح.`);
        setAdditionalBonus('');
        setBonusReason('');
        setManualAmountType('custom');
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
        const roleTitle = isSupervisor ? 'المشرف' : 'المدرس';

        let message = `👋 السلام عليكم ورحمة الله وبركاته\n`;
        message += `📊 *تقرير الراتب الشهري*\n`;
        message += `📅 *شهر:* ${monthName}\n`;
        message += `👤 *${roleTitle}:* ${employeeName}\n`;
        message += `━━━━━━━━━━━━\n\n`;

        if (payrollData.isPartnership) {
            message += `💰 *تفاصيل الشراكة (${payrollData.partnershipPercentage}%):*\n`;
            message += `   • إجمالي الدخل: ${payrollData.totalCollectedRevenue.toLocaleString()} ج.م\n`;
            message += `   • ما حصله المدرس: ${payrollData.collectedByTeacher.toLocaleString()} ج.م\n`;
            message += `   • المسلّم للإدارة: ${payrollData.totalHandedOver.toLocaleString()} ج.م\n`;
            if (payrollData.collectedByDirector > 0) {
                message += `   • المحصل بواسطة المدير: ${payrollData.collectedByDirector.toLocaleString()} ج.م\n`;
            }
            if (payrollData.deliveryDeficit !== 0) {
                const status = payrollData.deliveryDeficit > 0 ? '(عليك)' : '(لك)';
                message += `   • المتبقي ${status}: ${Math.abs(payrollData.deliveryDeficit).toLocaleString()} ج.م\n`;
            }
            message += `   • *نصيبك من الدخل:* ${payrollData.partnershipAmount.toFixed(2)} ج.م\n\n`;
        } else {
            message += `💰 *الراتب الأساسي:* ${payrollData.baseSalary.toLocaleString()} ج.م\n\n`;
        }

        const manualBonuses = teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth && b.amount > 0);
        const totalAdditions = payrollData.attendanceBonus + manualBonuses.reduce((sum, b) => sum + b.amount, 0);

        if (totalAdditions > 0) {
            message += `➕ *الإضافات والمكافآت:* (+${totalAdditions.toLocaleString()} ج.م)\n`;
            if (payrollData.attendanceBonus > 0) {
                message += `   • حافز حضور (${payrollData.bonusDays} يوم): +${payrollData.attendanceBonus.toLocaleString()} ج.م\n`;
                if (bonusRecordsWithReason.length > 0) {
                    bonusRecordsWithReason.forEach(r => {
                        let type = '';
                        switch (r.status) {
                            case TeacherAttendanceStatus.BONUS_DAY: type = 'يوم كامل'; break;
                            case TeacherAttendanceStatus.BONUS_HALF_DAY: type = 'نصف يوم'; break;
                            case TeacherAttendanceStatus.BONUS_QUARTER_DAY: type = 'ربع يوم'; break;
                        }
                        message += `     - ${new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric' })}: ${r.reason} (${type})\n`;
                    });
                }
            }
            if (manualBonuses.length > 0) {
                message += `   • مكافآت إضافية:\n`;
                manualBonuses.forEach(b => {
                    message += `     - ${new Date(b.date).toLocaleDateString('ar-EG', { day: 'numeric' })}: ${b.reason || 'بدون سبب'} (+${b.amount.toLocaleString()})\n`;
                });
            }
            message += `\n`;
        }

        const manualDeductions = teacherManualBonuses.filter(b => b.teacherId === employeeId && b.month === selectedMonth && b.amount < 0);
        const totalDeductions = payrollData.absenceDeduction + Math.abs(manualDeductions.reduce((sum, b) => sum + b.amount, 0));

        if (totalDeductions > 0) {
            message += `➖ *الخصومات والاستقطاعات:* (-${totalDeductions.toLocaleString()} ج.م)\n`;
            if (payrollData.absenceDeduction > 0) {
                message += `   • خصم غياب (${payrollData.absenceDays} يوم): -${payrollData.absenceDeduction.toLocaleString()} ج.م\n`;
                if (deductionRecordsWithReason.length > 0) {
                    deductionRecordsWithReason.forEach(r => {
                        let type = '';
                        switch (r.status) {
                            case TeacherAttendanceStatus.ABSENT: type = 'غياب'; break;
                            case TeacherAttendanceStatus.DEDUCTION_FULL_DAY: type = 'خصم يوم'; break;
                            case TeacherAttendanceStatus.DEDUCTION_HALF_DAY: type = 'خصم نصف'; break;
                            case TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY: type = 'خصم ربع'; break;
                            case TeacherAttendanceStatus.MISSING_REPORT: type = 'تقرير ناقص'; break;
                        }
                        message += `     - ${new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric' })}: ${r.reason} ${type ? `(${type})` : ''}\n`;
                    });
                }
            }
            if (manualDeductions.length > 0) {
                message += `   • خصومات إضافية:\n`;
                manualDeductions.forEach(b => {
                    message += `     - ${new Date(b.date).toLocaleDateString('ar-EG', { day: 'numeric' })}: ${b.reason || 'بدون سبب'} (${b.amount.toLocaleString()})\n`;
                });
            }
            message += `\n`;
        }

        message += `━━━━━━━━━━━━\n`;
        message += `💵 *صافي الراتب:* *${payrollData.finalSalary.toLocaleString()} ج.م*\n`;
        message += `━━━━━━━━━━━━\n`;
        message += `مع تحيات إدارة مركز الشاطبي 🌹`;

        const phone = employeePhone.replace(/[^0-9]/g, '');
        if (!phone) {
            alert('لا يوجد رقم هاتف مسجل.');
            return;
        }
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    const handlePrevMonth = () => {
        const date = new Date(selectedMonth + '-01');
        if (isNaN(date.getTime())) return;
        date.setMonth(date.getMonth() - 1);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        setSelectedMonth(`${yyyy}-${mm}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20 sm:pb-0">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 min-h-[4rem] flex flex-col md:flex-row items-center justify-between gap-3 py-3 md:py-0">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={onBack} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <ArrowRightIcon className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${isSupervisor ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
                                {isSupervisor ? <UserIcon className="w-5 h-5" /> : <BriefcaseIcon className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate leading-tight">{employeeName}</h1>
                                <p className={`text-xs font-bold ${isSupervisor ? 'text-blue-600' : 'text-teal-600'}`}>{isSupervisor ? 'مشرف' : 'مدرس'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0">
                        {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                            <a href={`https://wa.me/${employeePhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="واتساب">
                                <WhatsAppIcon className="w-5 h-5" />
                            </a>
                        )}
                        <a href={`tel:${employeePhone.replace(/[^0-9]/g, '')}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="اتصال">
                            <PhoneIcon className="w-5 h-5" />
                        </a>
                        {!isSupervisor && (
                            <button onClick={() => onViewTeacherReport(employeeId)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="تقرير شامل">
                                <DocumentReportIcon className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={() => isSupervisor ? onEditSupervisorClick?.(supervisor!) : onEditTeacherClick(teacher!)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="تعديل">
                            <EditIcon className="w-5 h-5" />
                        </button>
                        {(currentUserRole === 'director') && (
                            <button
                                onClick={() => isSupervisor ? onDeleteSupervisor?.(supervisor!.id) : onDeleteTeacher(teacher!.id)}
                                disabled={!isSupervisor && isTeacherInUse}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title={isTeacherInUse ? "لا يمكن حذف مدرس مسؤول عن مجموعة" : "حذف"}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border-t border-gray-200 overflow-x-auto">
                    <div className="container mx-auto flex">
                        <button onClick={() => setActiveTab('collections')} className={getTabClass('collections')}>
                            <CurrencyDollarIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">سجل التحصيل</span>
                        </button>
                        <button onClick={() => setActiveTab('attendance')} className={getTabClass('attendance')}>
                            <CalendarCheckIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">سجل الحضور</span>
                        </button>
                        <button onClick={() => setActiveTab('payroll')} className={getTabClass('payroll')}>
                            <CurrencyDollarIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">الراتب والمحاسبة</span>
                        </button>
                        <button onClick={() => setActiveTab('groups')} className={getTabClass('groups')}>
                            <UsersIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">{isSupervisor ? 'الأقسام' : 'المجموعات'}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto p-4 flex-grow">
                {/* Month Selector */}
                {activeTab !== 'groups' && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">عرض بيانات شهر:</label>
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="w-full sm:w-80 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-100 outline-none transition-all font-bold text-gray-800"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedMonth(getCairoDateString().substring(0, 7))}
                                    className="flex-1 py-1 px-3 text-sm font-bold rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors border border-teal-200"
                                >
                                    الشهر الحالي
                                </button>
                                <button
                                    onClick={handlePrevMonth}
                                    className="flex-1 py-1 px-3 text-sm font-bold rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    الشهر السابق
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'collections' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* New Collection Form */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-teal-500" />
                            <h4 className="font-bold text-teal-800 mb-4 flex items-center gap-2 text-lg">
                                <CurrencyDollarIcon className="w-6 h-6" />
                                تسجيل مبلغ محصل من المدرس
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">المبلغ (ج.م)</label>
                                    <input
                                        type="number"
                                        value={newCollectionAmount}
                                        onChange={e => setNewCollectionAmount(e.target.value)}
                                        className="w-full px-5 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-100 outline-none text-xl font-black text-teal-700"
                                        placeholder="مثلاً: 500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">ملاحظات (اختياري)</label>
                                    <input
                                        type="text"
                                        value={newCollectionNotes}
                                        onChange={e => setNewCollectionNotes(e.target.value)}
                                        className="w-full px-5 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-100 outline-none"
                                        placeholder="عن أي مجموعة أو طالب..."
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddCollection}
                                className="mt-4 w-full py-3 bg-teal-600 text-white rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all font-bold active:scale-[0.98]"
                            >
                                تسجيل التحصيل
                            </button>
                        </div>

                        {/* Current Status Highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* 1. المصروفات المتوقعة */}
                            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center flex flex-col justify-center">
                                <p className="text-xs font-bold text-purple-400 mb-1 uppercase tracking-wider">المصروفات المتوقعة</p>
                                <p className="text-xl font-black text-purple-700">{payrollData.totalExpectedExpenses.toLocaleString()} ج.م</p>
                                {/* Added as per request: Group Expenses (Total Collected) */}
                                <div className="mt-3 pt-3 border-t border-purple-200/50">
                                    <p className="text-[10px] font-bold text-gray-400 mb-0.5">إجمالي إيراد المجموعة (مدرس + مدير)</p>
                                    <p className="text-lg font-black text-gray-700">{payrollData.totalCollectedRevenue.toLocaleString()} ج.م</p>
                                </div>
                            </div>

                            {/* 2. ما حصله المدرس */}
                            <div
                                onClick={() => setIsCollectedDetailsOpen(true)}
                                className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center flex flex-col justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                            >
                                <p className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">ما حصله المدرس</p>
                                <p className="text-xl font-black text-blue-700">{payrollData.collectedByTeacher.toLocaleString()} ج.م</p>
                                <span className="text-[10px] text-blue-400 font-bold underline mt-1">عرض التفاصيل</span>
                            </div>

                            {/* 3. ما حصله المدير */}
                            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-center flex flex-col justify-center">
                                <p className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-wider">المحصل من المدير</p>
                                <p className="text-xl font-black text-indigo-700">{payrollData.collectedByDirector.toLocaleString()} ج.م</p>
                            </div>

                            {/* 4. ما سلمه المدرس للمدير */}
                            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 text-center flex flex-col justify-center">
                                <p className="text-xs font-bold text-teal-400 mb-1 uppercase tracking-wider">المسلم للمدير</p>
                                <p className="text-xl font-black text-teal-700">{payrollData.totalHandedOver.toLocaleString()} ج.م</p>
                            </div>

                            {/* 5. عجز التسليم (معه - سلم) */}
                            <div
                                onClick={() => (payrollData.deliveryDeficit > 0 || payrollData.groupDeficit > 0) && setIsDeficitDetailsOpen(true)}
                                className={`p-4 rounded-2xl border text-center flex flex-col justify-center cursor-pointer transition-all hover:scale-[1.02] ${payrollData.deliveryDeficit > 0 ? 'bg-red-50 border-red-100 shadow-sm' : 'bg-green-50 border-green-100'}`}
                            >
                                <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${payrollData.deliveryDeficit > 0 ? 'text-red-400' : 'text-green-400'}`}>عجز التسليم (معه)</p>
                                <p className={`text-xl font-black ${payrollData.deliveryDeficit > 0 ? 'text-red-700' : 'text-green-700'}`}>{payrollData.deliveryDeficit.toLocaleString()} ج.م</p>
                                {payrollData.deliveryDeficit > 0 && <span className="text-[10px] text-red-400 mt-1 font-bold underline">عرض التفاصيل</span>}
                            </div>

                            {/* 6. عجز المجموعة (المتوقع - المحصل) */}
                            <div
                                onClick={() => (payrollData.deliveryDeficit > 0 || payrollData.groupDeficit > 0) && setIsDeficitDetailsOpen(true)}
                                className={`p-4 rounded-2xl border text-center flex flex-col justify-center cursor-pointer transition-all hover:scale-[1.02] ${payrollData.groupDeficit > 0 ? 'bg-orange-50 border-orange-100 shadow-sm' : 'bg-green-50 border-green-100'}`}
                            >
                                <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${payrollData.groupDeficit > 0 ? 'text-orange-400' : 'text-green-400'}`}>عجز المجموعة (لم يحصل)</p>
                                <p className={`text-xl font-black ${payrollData.groupDeficit > 0 ? 'text-orange-700' : 'text-green-700'}`}>{payrollData.groupDeficit.toLocaleString()} ج.م</p>
                                {payrollData.groupDeficit > 0 && <span className="text-[10px] text-orange-400 mt-1 font-bold underline">عرض التفاصيل</span>}
                            </div>
                        </div>

                        {/* Deficit Reason Analysis (Collapsible) */}


                        {/* Collection History Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">تاريخ عمليات التسليم</h3>
                            </div>

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {allCollections.length > 0 ? (
                                    allCollections.map(r => (
                                        <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</p>
                                                    <div className="mt-1">
                                                        {r.type === 'handed_over' ? (
                                                            <span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-bold">تسليم يدوي</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">مدير مباشر</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-left flex flex-col items-end gap-2">
                                                    <p className="text-lg font-black text-teal-600">{r.amount.toLocaleString()} ج.م</p>
                                                    {r.type === 'handed_over' && onDeleteTeacherCollection && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التحصيل؟')) {
                                                                    onDeleteTeacherCollection(r.id);
                                                                }
                                                            }}
                                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="حذف"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {r.type === 'director_collection' && onDeleteDirectorCollection && (
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('هل أنت متأكد من حذف هذا السجل؟ سيتم إلغاء دفع الطالب.')) {
                                                                    onDeleteDirectorCollection(r.id);
                                                                }
                                                            }}
                                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="حذف"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {r.notes && (
                                                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200 mt-1">
                                                    {r.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-10 text-center text-gray-400 italic">لا توجد عمليات مسجلة لهذا الشهر.</div>
                                )}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden md:block overflow-x-auto text-center">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">التاريخ</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">المبلغ</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">ملاحظات</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">النوع</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {allCollections.length > 0 ? (
                                            allCollections.map(r => (
                                                <tr key={r.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-bold">{new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">{r.amount.toLocaleString()} ج.م</td>
                                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">{r.notes || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {r.type === 'handed_over' ? (
                                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-teal-100 text-teal-800">تسليم يدوي</span>
                                                        ) : (
                                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-indigo-100 text-indigo-800">مدير مباشر</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {r.type === 'handed_over' && onDeleteTeacherCollection && (
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('هل أنت متأكد من حذف هذا التحصيل؟')) {
                                                                        onDeleteTeacherCollection(r.id);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 mx-auto"
                                                                title="حذف"
                                                            >
                                                                <TrashIcon className="w-5 h-5 mx-auto" />
                                                            </button>
                                                        )}
                                                        {r.type === 'director_collection' && onDeleteDirectorCollection && (
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟ سيتم إلغاء دفع الطالب.')) {
                                                                        onDeleteDirectorCollection(r.id);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 mx-auto"
                                                                title="حذف"
                                                            >
                                                                <TrashIcon className="w-5 h-5 mx-auto" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">لا توجد عمليات مسجلة لهذا الشهر.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">صافي أيام الغياب</p>
                                    <p className="text-2xl font-black text-red-600">{payrollData.absenceDays} يـوم</p>
                                </div>
                                <CalendarCheckIcon className="w-10 h-10 text-red-100" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">إجمالي المكافآت</p>
                                    <p className="text-2xl font-black text-green-600">{payrollData.bonusDays} يـوم</p>
                                </div>
                                <CalendarCheckIcon className="w-10 h-10 text-green-100" />
                            </div>
                        </div>



                        {/* Calendar View */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">التقويم الشهري للحضور</h3>
                            <TeacherAttendanceCalendar
                                month={selectedMonth}
                                attendanceRecords={attendanceForMonth}
                                onDateClick={handleCalendarDateClick}
                            />
                        </div>

                        {/* History Table */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">سجل الانضباط والمكافآت (الشهر المختار)</h3>
                            </div>

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden">
                                {attendanceForMonth.length > 0 ? (
                                    attendanceForMonth.sort((a, b) => b.date.localeCompare(a.date)).map(record => {
                                        const isBonus = getBonusValue(record.status) > 0;
                                        const isDeduction = getAbsenceValue(record.status) > 0;
                                        return (
                                            <div key={record.id} className={`p-4 border-b last:border-b-0 ${isBonus ? 'bg-green-50/20' : isDeduction ? 'bg-red-50/20' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-sm font-bold text-gray-800">{new Date(record.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</p>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${record.status === TeacherAttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' :
                                                                isBonus ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {record.status === TeacherAttendanceStatus.PRESENT ? 'حاضر' :
                                                                    record.status === TeacherAttendanceStatus.ABSENT ? 'غائب' :
                                                                        record.status === TeacherAttendanceStatus.BONUS_DAY ? 'مكافأة كاملة' :
                                                                            record.status === TeacherAttendanceStatus.BONUS_HALF_DAY ? 'مكافأة نصف' :
                                                                                record.status === TeacherAttendanceStatus.DEDUCTION_HALF_DAY ? 'خصم نصف' : 'خصم/مكافأة'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-black text-sm dir-ltr ${isBonus ? 'text-green-600' : isDeduction ? 'text-red-600' : 'text-gray-400'}`}>
                                                            {isBonus ? `+${getBonusValue(record.status)}` : isDeduction ? `-${getAbsenceValue(record.status)}` : '-'}
                                                        </span>
                                                        <button
                                                            onClick={() => onDeleteTeacherAttendance?.(record.id)}
                                                            className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="حذف السجل"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {record.reason && (
                                                    <p className="text-xs text-gray-500 bg-white/60 p-2 rounded-lg border border-dashed border-gray-200">
                                                        {record.reason}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-gray-400 italic">لا يوجد سجل حضور مسجل لهذا الشهر.</div>
                                )}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden md:block overflow-x-auto text-center">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">التاريخ</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">الحالة</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">القيمة</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">التفاصيل</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {attendanceForMonth.length > 0 ? (
                                            attendanceForMonth.sort((a, b) => b.date.localeCompare(a.date)).map(record => {
                                                const isBonus = getBonusValue(record.status) > 0;
                                                const isDeduction = getAbsenceValue(record.status) > 0;
                                                return (
                                                    <tr key={record.id} className={isBonus ? 'bg-green-50/20' : isDeduction ? 'bg-red-50/20' : ''}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-bold">{new Date(record.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.status === TeacherAttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' :
                                                                isBonus ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {record.status === TeacherAttendanceStatus.PRESENT ? 'حاضر' :
                                                                    record.status === TeacherAttendanceStatus.ABSENT ? 'غائب' :
                                                                        record.status === TeacherAttendanceStatus.BONUS_DAY ? 'مكافأة كاملة' :
                                                                            record.status === TeacherAttendanceStatus.BONUS_HALF_DAY ? 'مكافأة نصف' :
                                                                                record.status === TeacherAttendanceStatus.DEDUCTION_HALF_DAY ? 'خصم نصف' : 'خصم/مكافأة'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black">
                                                            {isBonus ? `+${getBonusValue(record.status)}` : isDeduction ? `-${getAbsenceValue(record.status)}` : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{record.reason || '-'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                            <button
                                                                onClick={() => onDeleteTeacherAttendance?.(record.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="حذف السجل"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">لا يوجد سجل حضور مسجل لهذا الشهر.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payroll' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Main Salary Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-blue-500" />

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">حساب الراتب والمستحقات</h3>
                                    <p className="text-gray-500 font-bold">شهر {new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="flex gap-2">
                                    {payrollData.isPaid && (
                                        <button
                                            onClick={handleCancelPayment}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-black hover:bg-red-100 transition-colors"
                                        >
                                            إلغاء الصرف ↩
                                        </button>
                                    )}
                                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-500">حالة الصرف:</span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${payrollData.isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                            {payrollData.isPaid ? 'تم الصـرف ✅' : 'قيد الانتظار ⏳'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                                        <span className="font-bold text-gray-600">الراتب الأساسي/الشراكة:</span>
                                        <span className="text-xl font-black text-gray-900">{payrollData.isPartnership ? payrollData.partnershipAmount.toLocaleString() : payrollData.baseSalary.toLocaleString()} ج.م</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-green-50/50 p-4 rounded-2xl border border-green-100 transition-all hover:bg-white hover:shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-green-700">مكافآت وحوافز:</span>
                                            <span className="text-[10px] text-green-500 font-medium">+ (حضور {payrollData.bonusDays} يوم + يدوي)</span>
                                        </div>
                                        <span className="text-xl font-black text-green-700">+{(payrollData.attendanceBonus + payrollData.manualBonusTotal > 0 ? payrollData.attendanceBonus + payrollData.manualBonusTotal : 0).toLocaleString()} ج.م</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-red-50/50 p-4 rounded-2xl border border-red-100 transition-all hover:bg-white hover:shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-red-700">خصومات واستقطاعات:</span>
                                            <span className="text-[10px] text-red-500 font-medium">- (غياب {payrollData.absenceDays} يوم + يدوي)</span>
                                        </div>
                                        <span className="text-xl font-black text-red-700">-{(payrollData.absenceDeduction + (payrollData.manualBonusTotal < 0 ? Math.abs(payrollData.manualBonusTotal) : 0)).toLocaleString()} ج.م</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-purple-50/50 p-4 rounded-2xl border border-purple-100 transition-all hover:bg-white hover:shadow-sm">
                                        <span className="font-bold text-purple-700">تم صرفه للمدرس:</span>
                                        <span className="text-xl font-black text-purple-700">-{totalPaidSalary.toLocaleString()} ج.م</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="bg-gray-100 p-6 rounded-[1.5rem] flex flex-col justify-center items-center text-center">
                                        <p className="text-xs font-bold text-gray-500 mb-1">إجمالي الاستحقاق</p>
                                        <p className="text-3xl font-black text-gray-800">{payrollData.finalSalary.toLocaleString()}</p>
                                    </div>

                                    <div className="flex-1 bg-gradient-to-br from-teal-600 to-teal-700 p-6 rounded-[2rem] shadow-2xl shadow-teal-200 flex flex-col justify-center items-center text-white relative transition-transform hover:scale-[1.02]">
                                        <div className="absolute top-4 right-4 text-white/20"><CurrencyDollarIcon className="w-12 h-12" /></div>
                                        <p className="text-sm font-bold opacity-80 mb-2">المتبقي للصرف</p>
                                        <p className="text-5xl font-black mb-1">{(Math.max(0, payrollData.finalSalary - totalPaidSalary)).toLocaleString()}</p>
                                        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Egyptian Pound</p>
                                    </div>
                                </div>
                            </div>

                            {/* Salary Payment Records Section */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800 text-lg">سجل صرف الراتب</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleManualSalaryExpense}
                                            className="px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                                            title="تسجيل مصروف راتب يدوي (لتدارك الأخطاء أو التسجيل الخارجي)"
                                        >
                                            + مصروف راتب (يدوي)
                                        </button>
                                        <button
                                            onClick={handleAddSalaryPaymentWrapper}
                                            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                                        >
                                            + صرف جزء من الراتب
                                        </button>
                                    </div>
                                </div>

                                {salaryPayments && salaryPayments.filter(p => p.teacherId === employeeId && p.month === selectedMonth).length > 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-right font-bold text-gray-500">التاريخ</th>
                                                    <th className="px-4 py-3 text-right font-bold text-gray-500">المبلغ</th>
                                                    <th className="px-4 py-3 text-right font-bold text-gray-500">ملاحظات</th>
                                                    <th className="px-4 py-3 text-center font-bold text-gray-500">حذف</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {salaryPayments
                                                    .filter(p => p.teacherId === employeeId && p.month === selectedMonth)
                                                    .map(payment => (
                                                        <tr key={payment.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-gray-700 font-medium">{new Date(payment.date).toLocaleDateString('ar-EG')}</td>
                                                            <td className="px-4 py-3 text-gray-900 font-bold">{payment.amount.toLocaleString()} ج.م</td>
                                                            <td className="px-4 py-3 text-gray-500">{payment.notes || '-'}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
                                                                            onDeleteSalaryPayment?.(payment.id);
                                                                        }
                                                                    }}
                                                                    className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">لا توجد دفعات مسجلة لهذا الشهر.</p>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => handlePayEmployee(payrollData.finalSalary)}
                                    disabled={payrollData.isPaid || (Math.max(0, payrollData.finalSalary - totalPaidSalary) <= 0)}
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed group active:scale-95"
                                >
                                    {Math.max(0, payrollData.finalSalary - totalPaidSalary) <= 0 ? (payrollData.isPaid ? 'تم تسجيل الصرف مسبقاً' : 'تم صرف كامل المستحقات ✅') : `صرف المتبقي (${Math.max(0, payrollData.finalSalary - totalPaidSalary)} ج.م) نهائياً 💸`}
                                </button>
                                <button
                                    onClick={handleSendWhatsAppReport}
                                    className="flex items-center justify-center gap-3 py-4 px-10 bg-green-50 text-green-700 border-2 border-green-200 rounded-2xl shadow-lg hover:bg-green-100 transition-all font-black group active:scale-95"
                                >
                                    <WhatsAppIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span>إرسال التقرير للمدرس</span>
                                </button>
                            </div>
                        </div>

                        {/* Manual Bonus/Deduction Form */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500" />
                            <h4 className="font-bold text-indigo-900 mb-6 flex items-center gap-2 text-xl">
                                💰 إضافة مكافأة أو خصم يدوي (خارج الحساب التلقائي)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">نوع العملية</label>
                                    <select
                                        value={manualActionType}
                                        onChange={e => setManualActionType(e.target.value as 'bonus' | 'deduction')}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    >
                                        <option value="bonus">مكافأة (+)</option>
                                        <option value="deduction">خصم (-)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">المبلغ</label>
                                    <select
                                        value={manualAmountType}
                                        onChange={e => setManualAmountType(e.target.value as any)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    >
                                        <option value="quarter">ربع يوم</option>
                                        <option value="half">نصف يوم</option>
                                        <option value="full">يوم كامل</option>
                                        <option value="custom">مبلغ مخصص كاش</option>
                                    </select>
                                </div>
                                {manualAmountType === 'custom' && (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">المبلغ المخصص</label>
                                        <input
                                            type="number"
                                            value={additionalBonus}
                                            onChange={e => setAdditionalBonus(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                                            placeholder="ج.م"
                                        />
                                    </div>
                                )}
                                <div className={manualAmountType === 'custom' ? 'col-span-1' : 'col-span-2'}>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">السبب</label>
                                    <input
                                        type="text"
                                        value={bonusReason}
                                        onChange={e => setBonusReason(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                                        placeholder="مثلاً: تميز في تسميد الطلاب"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handlePayAdditionalBonus}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all font-black active:scale-[0.98]"
                            >
                                اعتماد العملية وحفظها
                            </button>
                        </div>

                        {/* List of Manual Adjustments */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">سجل المكافآت والخصومات اليدوية (الشهر المختار)</h3>
                            </div>

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {filteredManualBonuses.length > 0 ? (
                                    filteredManualBonuses.map(b => (
                                        <div key={b.id} className={`p-4 hover:bg-gray-50 transition-colors ${b.amount < 0 ? 'bg-red-50/10' : 'bg-green-50/10'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{new Date(b.date).toLocaleDateString('ar-EG')}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">بواسطة: {b.addedBy === 'director' ? 'المدير' : 'مشرف'}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <p className={`text-lg font-black ${b.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{b.amount.toLocaleString()} ج.م</p>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
                                                                onDeleteManualBonus?.(b.id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="حذف"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            {b.reason && (
                                                <p className="text-xs text-gray-500 bg-white/60 p-2 rounded-lg border border-dashed border-gray-200 mt-1">
                                                    {b.reason}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-10 text-center text-gray-400 italic">لا توجد عمليات يدوية مسجلة لهذا الشهر.</div>
                                )}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase text-center">التاريخ</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase text-center">المبلغ</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase text-center">السبب</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase text-center">بواسطة</th>
                                            <th className="px-6 py-3 text-sm font-bold text-gray-500 uppercase text-center">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100 italic text-center">
                                        {filteredManualBonuses.length > 0 ? (
                                            filteredManualBonuses.map(b => (
                                                <tr key={b.id} className={b.amount < 0 ? 'bg-red-50/10' : 'bg-green-50/10'}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-bold">{new Date(b.date).toLocaleDateString('ar-EG')}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-black ${b.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{b.amount.toLocaleString()} ج.م</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{b.reason || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{b.addedBy === 'director' ? 'المدير' : 'مشرف'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
                                                                    onDeleteManualBonus?.(b.id);
                                                                }
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="حذف"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">لا توجد عمليات يدوية مسجلة لهذا الشهر.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {
                    activeTab === 'groups' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(isSupervisor ? (supervisor?.section || []) : assignedGroups.map(g => g.name)).map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-teal-200 group">
                                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <UsersIcon className="w-8 h-8 text-teal-600" />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-800">{item}</h4>
                                        <p className="text-sm font-bold text-gray-400 mt-1">{isSupervisor ? 'قسم تحت الإشراف' : 'مجموعة تعليمية'}</p>
                                    </div>
                                ))}
                                {((isSupervisor ? (supervisor?.section || []) : assignedGroups).length === 0) && (
                                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                        <UsersIcon className="w-16 h-16 mb-4 opacity-20" />
                                        <p className="italic">لا توجد {isSupervisor ? 'أقسام إشراف' : 'مجموعات'} مسجلة لهذا الموظف حالياً.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Modals for Reason Input (Temporary as in original modal) */}
            < BonusReasonModal
                isOpen={isBonusModalOpen}
                onClose={() => setIsBonusModalOpen(false)}
                onConfirm={handleConfirmBonus}
                teacherName={employeeName}
            />
            <DeductionReasonModal
                isOpen={isDeductionModalOpen}
                onClose={() => setIsDeductionModalOpen(false)}
                onConfirm={handleConfirmDeduction}
                teacherName={employeeName}
            />

            <AttendanceActionModal
                isOpen={isActionModalOpen}
                onClose={() => {
                    setIsActionModalOpen(false);
                    setCalendarSelectedDate(null);
                }}
                date={calendarSelectedDate || ''}
                currentStatus={attendanceForMonth.find(r => r.date === calendarSelectedDate)?.status}
                onSetStatus={handleActionSelect}
            />

            {/* Collected Students Modal */}
            {isCollectedDetailsOpen && (
                <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 flex flex-col max-h-[92vh] sm:max-h-[85vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-800">تفاصيل المحصل ({payrollData.collectedStudents.length})</h3>
                            <button onClick={() => setIsCollectedDetailsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <span className="text-gray-400 text-2xl font-bold">✕</span>
                            </button>
                        </div>
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                            {payrollData.collectedStudents.length > 0 ? (
                                payrollData.collectedStudents.map((s, idx) => {
                                    // منطق اكتشاف الفجوات في الأرقام
                                    let isGap = false;
                                    if (idx > 0 && s.receiptNumber) {
                                        const prevNum = parseInt(payrollData.collectedStudents[idx - 1].receiptNumber?.replace(/\D/g, '') || '0');
                                        const currNum = parseInt(s.receiptNumber?.replace(/\D/g, '') || '0');
                                        if (prevNum > 0 && currNum > prevNum + 1) {
                                            isGap = true;
                                        }
                                    }

                                    return (
                                        <div key={idx} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border-2 shadow-sm transition-all hover:border-teal-200 ${isGap ? 'border-red-100 bg-red-50/20' : 'border-gray-50'}`}>
                                            {/* خانة رقم الوصل - جهة اليمين */}
                                            <div className="shrink-0">
                                                {s.receiptNumber ? (
                                                    <div className={`flex flex-col items-center border-2 rounded-xl py-1.5 px-3 min-w-[70px] shadow-sm ${isGap ? 'bg-red-600 border-red-700 text-white' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                                                        <span className={`text-[10px] font-black leading-none mb-1 ${isGap ? 'text-red-100' : 'text-blue-500'}`}>
                                                            {isGap ? 'فجوة' : 'وصل'}
                                                        </span>
                                                        <span className="text-sm font-black tracking-wider">{s.receiptNumber}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-3 rounded-xl border border-dashed border-gray-200 text-center min-w-[70px]">بدون وصل</div>
                                                )}
                                            </div>

                                            {/* بيانات الطالب */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="font-black text-gray-900 text-base truncate">{s.name}</span>
                                                    <div className="flex gap-1">
                                                        {s.isArchived && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black border border-gray-200">
                                                                مؤرشف
                                                            </span>
                                                        )}
                                                        {s.isTransferred && (
                                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black border border-orange-200">
                                                                منقول
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs text-gray-500 font-bold flex items-center gap-1">
                                                        <UsersIcon className="w-3 h-3" />
                                                        {s.groupName || 'بدون مجموعة'}
                                                    </p>
                                                    {isGap && <span className="text-[10px] text-red-600 font-black bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 self-start animate-pulse">فجوة في أرقام الإيصالات!</span>}
                                                </div>
                                            </div>

                                            {/* المبلغ */}
                                            <div className="shrink-0 text-left border-r-2 pl-2 border-gray-50">
                                                <span className="font-black text-teal-600 text-lg sm:text-xl block tabular-nums">{s.amount.toLocaleString()} <small className="text-[10px]">ج.م</small></span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                                    <CurrencyDollarIcon className="w-16 h-16 mb-4 opacity-10" />
                                    <p className="font-bold italic">لا توجد مبالغ محصلة مسجلة</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-gray-50 border-t shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-bold">إجمالي المبلغ المحصل:</span>
                                <span className="text-2xl font-black text-teal-700 tabular-nums">{payrollData.collectedByTeacher.toLocaleString()} <small className="text-sm">ج.م</small></span>
                            </div>
                            <button
                                onClick={() => setIsCollectedDetailsOpen(false)}
                                className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 active:scale-[0.98]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDeficitDetailsOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130] flex justify-center items-end sm:items-center p-0 sm:p-4">
                    <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6 border-b pb-4 shrink-0">
                            <h3 className="text-lg sm:text-2xl font-black text-gray-800 flex items-center gap-3">
                                <span className="bg-orange-100 p-2 rounded-xl text-xl">⚠️</span>
                                تفاصيل وأسباب العجز
                            </h3>
                            <button onClick={() => setIsDeficitDetailsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XIcon className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-6 pb-4">
                            {/* 1. Delivery Deficit Reason (On Teacher) */}
                            {payrollData.deliveryDeficit > 0 && (
                                <div className="bg-white p-5 rounded-2xl border-2 border-red-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500" />
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0">
                                            <BriefcaseIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-red-700 text-lg mb-2">1. عجز تسليم (في عهدة المدرس)</p>
                                            <p className="text-sm text-gray-700 leading-relaxed font-bold">
                                                هناك مبلغ <span className="text-xl font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg mx-1 inline-block">{payrollData.deliveryDeficit.toLocaleString()} ج.م</span>
                                                تم تحصيله بواسطة المدرس فعلياً، ولكن لم يتم تسليمه للإدارة بعد (دين على المدرس).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Group Deficit Reason (On Students) */}
                            {payrollData.groupDeficit > 0 && (
                                <div className="bg-white p-5 rounded-2xl border-2 border-orange-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500" />
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 shrink-0">
                                            <UsersIcon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-black text-orange-700 text-lg mb-2">2. عجز تحصيل من الطلاب</p>
                                            <p className="text-sm text-gray-600 font-bold">
                                                الطلاب التالية أسماؤهم لم يدفعوا المصاريف كاملة للمنشأة:
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                                        {deficitBreakdown.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-orange-50/50 p-4 rounded-xl border border-orange-100 gap-3 group hover:bg-orange-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-xl bg-orange-200 text-orange-800 flex items-center justify-center text-sm font-black shrink-0 shadow-sm">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-black text-gray-800 text-base">{item.studentName}</span>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pl-2 sm:pl-0 border-t sm:border-t-0 border-orange-100 pt-3 sm:pt-0">
                                                    {item.isFullDeficit ? (
                                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[11px] font-black uppercase tracking-wider">لم يدفع (عليه {item.expected})</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[11px] font-black uppercase tracking-wider">دفع {item.paid} (باقي {item.diff})</span>
                                                    )}
                                                    <span className="font-black text-red-600 text-lg tabular-nums">-{item.diff} <small className="text-[10px] font-bold">ج.م</small></span>
                                                </div>
                                            </div>
                                        ))}
                                        {deficitBreakdown.length === 0 && (
                                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                                <UsersIcon className="w-12 h-12 mb-2 opacity-20" />
                                                <p className="text-sm italic font-bold">لا توجد تفاصيل دقيقة متاحة للطلاب.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-gray-50 border-t mt-auto shrink-0 flex gap-3">
                            <button
                                onClick={() => setIsDeficitDetailsOpen(false)}
                                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-black text-lg hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default TeacherDetailsPage;
