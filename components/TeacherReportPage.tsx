import React, { useState, useMemo } from 'react';
import type { Teacher, Group, Student, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings, TeacherCollectionRecord, UserRole } from '../types';
import { TeacherAttendanceStatus, PaymentType } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PhoneIcon from './icons/PhoneIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import UsersIcon from './icons/UsersIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { getCairoDateString, getCairoNow, parseCairoDateString } from '../services/cairoTimeHelper';

interface TeacherReportPageProps {
  teacher: Teacher;
  groups: Group[];
  students: Student[];
  teacherAttendance: TeacherAttendanceRecord[];
  teacherPayrollAdjustments: TeacherPayrollAdjustment[];
  financialSettings: FinancialSettings;
  onBack: () => void;
  teacherCollections: TeacherCollectionRecord[];
  currentUserRole?: UserRole;
}

const getAbsenceValue = (status: TeacherAttendanceStatus): number => {
  switch (status) {
    // Old system
    case TeacherAttendanceStatus.ABSENT: return 1;
    case TeacherAttendanceStatus.HALF_DAY: return 0.5;
    case TeacherAttendanceStatus.QUARTER_DAY: return 0.25;

    // New system
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

const TeacherReportPage: React.FC<TeacherReportPageProps> = ({ teacher, groups, students, teacherAttendance, teacherPayrollAdjustments, financialSettings, onBack, teacherCollections, currentUserRole }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => getCairoDateString().substring(0, 7));
  const [isCollectedDetailsOpen, setIsCollectedDetailsOpen] = useState(false);

  const assignedGroups = useMemo(() => {
    return groups.filter(g => g.teacherId === teacher.id);
  }, [groups, teacher.id]);

  const studentsInAssignedGroups = useMemo(() => {
    const groupIds = assignedGroups.map(g => g.id);
    return students.filter(s => groupIds.includes(s.groupId) && !s.isArchived);
  }, [students, assignedGroups]);

  const { collectedByTeacher, collectedByDirector, totalCollectedRevenueLocal, totalExpectedRevenue, collectedStudents } = useMemo(() => {
    const teacherGroupIds = new Set(assignedGroups.map(g => g.id));
    let byTeacher = 0;
    let byDirector = 0;
    let collectedTotal = 0;
    let expectedTotal = 0;
    const collectedStudentsList: { name: string, amount: number, isArchived: boolean, isTransferred: boolean, groupName?: string, receiptNumber?: string }[] = [];

    const monthPrefix = selectedMonth;

    students.forEach(s => {
      const monthFee = s.fees?.find(f => f.month === monthPrefix && f.paid);

      // 1. Calculate Cash Held by Teacher (From ANY student, even if transferred/archived)
      if (monthFee) {
        const amount = monthFee.amountPaid || 0;
        const isCollectedByThisTeacher = monthFee.collectedBy === teacher.id;
        const isInGroupLegacy = !monthFee.collectedBy && teacherGroupIds.has(s.groupId);

        if (isCollectedByThisTeacher || isInGroupLegacy) {
          byTeacher += amount;

          const isTransferred = !teacherGroupIds.has(s.groupId) && !s.isArchived;
          const groupName = groups.find(g => g.id === s.groupId)?.name;

          collectedStudentsList.push({
            name: s.name,
            amount: amount,
            isArchived: s.isArchived,
            isTransferred: isTransferred,
            groupName: groupName,
            receiptNumber: monthFee.receiptNumber || ''
          });
        }
      }

      // 2. Only consider students in the teacher's groups for Revenue and Expected Expenses
      if (teacherGroupIds.has(s.groupId)) {
        if (monthFee) {
          collectedTotal += (monthFee.amountPaid || 0);
          if (monthFee.collectedBy === 'director') {
            byDirector += (monthFee.amountPaid || 0);
          }
        }

        const attendanceInMonth = s.attendance?.filter(record => {
          return record.date.startsWith(monthPrefix) && record.status === 'present';
        }).length || 0;

        const group = assignedGroups.find(g => g.id === s.groupId);
        const isIqraaGroup = group?.name.includes('إقراء') || group?.name.includes('اقراء');
        const meetsAttendanceRule = isIqraaGroup || attendanceInMonth >= 5;

        // 15-day grace period rule
        let isWithinGracePeriod = false;
        if (!monthFee) {
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

        if (monthFee || (!s.isArchived && meetsAttendanceRule && !isWithinGracePeriod)) {
          expectedTotal += (s.monthlyFee || 0);
        }
      }
    });

    // Sort by receipt number
    collectedStudentsList.sort((a, b) => {
      const numA = parseInt(a.receiptNumber?.replace(/\D/g, '') || '0');
      const numB = parseInt(b.receiptNumber?.replace(/\D/g, '') || '0');
      return numA - numB;
    });

    return {
      collectedByTeacher: byTeacher,
      collectedByDirector: byDirector,
      totalCollectedRevenueLocal: collectedTotal,
      totalExpectedRevenue: expectedTotal,
      collectedStudents: collectedStudentsList
    };
  }, [students, assignedGroups, selectedMonth, teacher.id, groups]);

  const collectedAmount = collectedByTeacher;

  const collectionData = useMemo(() => {
    const collectionsForMonth = teacherCollections.filter(c => c.teacherId === teacher.id && c.month === selectedMonth);
    const totalHandedOver = collectionsForMonth.reduce((sum, c) => sum + c.amount, 0);
    const remainingBalance = collectedAmount - totalHandedOver;
    return { totalHandedOver, remainingBalance, collectionsForMonth };
  }, [teacherCollections, teacher.id, selectedMonth, collectedAmount]);

  const attendanceForMonth = useMemo(() => {
    return teacherAttendance.filter(a => a.teacherId === teacher.id && a.date.startsWith(selectedMonth));
  }, [teacher, teacherAttendance, selectedMonth]);


  const payrollData = useMemo(() => {
    // If paymentType is not set, default to SALARY for backward compatibility
    const isPartnership = teacher.paymentType === PaymentType.PARTNERSHIP;
    const baseSalary = isPartnership ? 0 : (teacher.salary || 0);
    const partnershipAmount = isPartnership ? (totalExpectedRevenue * (teacher.partnershipPercentage || 0) / 100) : 0;

    const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === teacher.id && p.month === selectedMonth) || { bonus: 0, isPaid: false };
    const absenceDays = attendanceForMonth.reduce((total, record) => total + getAbsenceValue(record.status), 0);
    const bonusDays = attendanceForMonth.reduce((total, record) => total + getBonusValue(record.status), 0);

    // Calculate daily rate for deductions/bonuses
    const effectiveSalary = isPartnership ? partnershipAmount : baseSalary;

    const dailyRate = effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? effectiveSalary / financialSettings.workingDaysPerMonth : 0;
    const absenceDeduction = dailyRate * absenceDays * (financialSettings.absenceDeductionPercentage / 100);
    const attendanceBonus = dailyRate * bonusDays;

    const finalSalary = isPartnership
      ? partnershipAmount + (adjustments.bonus || 0) + attendanceBonus - absenceDeduction
      : baseSalary + (adjustments.bonus || 0) + attendanceBonus - absenceDeduction;

    return {
      baseSalary,
      partnershipAmount,
      isPartnership,
      adjustments,
      absenceDays,
      bonusDays,
      absenceDeduction,
      attendanceBonus,
      finalSalary,
      isPaid: adjustments.isPaid
    };
  }, [teacher, selectedMonth, teacherPayrollAdjustments, attendanceForMonth, financialSettings, totalExpectedRevenue]);

  const bonusRecordsWithReason = useMemo(() =>
    attendanceForMonth.filter(r => getBonusValue(r.status) > 0 && r.reason),
    [attendanceForMonth]);

  const deductionRecordsWithReason = useMemo(() =>
    attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0 && r.status !== TeacherAttendanceStatus.ABSENT && r.reason),
    [attendanceForMonth]);

  const handleSendWhatsAppReport = () => {
    const monthName = new Date(selectedMonth + '-02').toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    let message = `*تقرير الأداء والراتب - ${monthName}*\n`;
    message += `*المدرس/ة:* ${teacher.name}\n\n`;
    message += `*--- ملخص الأداء ---*\n`;
    message += `*إجمالي الدخل المتوقع:* ${totalExpectedRevenue.toLocaleString()} EGP\n`;
    message += `*إجمالي ما تم تحصيله:* ${totalCollectedRevenueLocal.toLocaleString()} EGP\n`;
    message += `*ما حصلته أنت:* ${collectedByTeacher.toLocaleString()} EGP\n`;
    if (collectedByDirector > 0) {
      message += `*حصلته الإدارة مباشرة:* ${collectedByDirector.toLocaleString()} EGP\n`;
    }

    if (payrollData.isPartnership) {
      message += `*المبلغ المسلّم للإدارة:* ${collectionData.totalHandedOver.toLocaleString()} EGP\n`;
      if (collectionData.remainingBalance > 0) {
        message += `*المبلغ المتبقي (عليك):* ${collectionData.remainingBalance.toLocaleString()} EGP\n`;
      }
    }

    message += `*أيام الحضور (المكافئة):* ${financialSettings.workingDaysPerMonth - payrollData.absenceDays + payrollData.bonusDays}\n`;
    message += `*أيام الغياب (المكافئة):* ${payrollData.absenceDays}\n\n`;

    message += `*--- تفاصيل الراتب ---*\n`;

    if (payrollData.isPartnership) {
      message += `*نوع المحاسبة:* شراكة (${teacher.partnershipPercentage}%)\n`;
      message += `*نصيبك من المحصل:* ${payrollData.partnershipAmount.toFixed(2)} EGP\n`;
    } else {
      message += `*الراتب الأساسي:* ${payrollData.baseSalary.toLocaleString()} EGP\n`;
    }

    message += `*مكافأة حضور (${payrollData.bonusDays} يوم):* +${payrollData.attendanceBonus.toFixed(2)} EGP\n`;

    if (bonusRecordsWithReason.length > 0) {
      message += `*تفاصيل المكافآت:*\n`;
      bonusRecordsWithReason.forEach(r => {
        let bonusAmountText = '';
        switch (r.status) {
          case TeacherAttendanceStatus.BONUS_DAY: bonusAmountText = 'يوم كامل'; break;
          case TeacherAttendanceStatus.BONUS_HALF_DAY: bonusAmountText = 'نصف يوم'; break;
          case TeacherAttendanceStatus.BONUS_QUARTER_DAY: bonusAmountText = 'ربع يوم'; break;
        }
        message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric' })}: ${r.reason} (${bonusAmountText})\n`;
      });
    }

    if ((payrollData.adjustments.bonus || 0) > 0) {
      message += `*مكافآت إضافية:* +${(payrollData.adjustments.bonus || 0).toLocaleString()} EGP\n`;
    }

    if (payrollData.absenceDeduction > 0) {
      message += `*خصم الغياب (${payrollData.absenceDays} يوم):* -${payrollData.absenceDeduction.toFixed(2)} EGP\n`;
    }

    if (deductionRecordsWithReason.length > 0) {
      message += `*تفاصيل الخصومات:*\n`;
      deductionRecordsWithReason.forEach(r => {
        let deductionAmountText = '';
        switch (r.status) {
          case TeacherAttendanceStatus.DEDUCTION_FULL_DAY:
          case TeacherAttendanceStatus.ABSENT: deductionAmountText = 'يوم كامل'; break;
          case TeacherAttendanceStatus.DEDUCTION_HALF_DAY:
          case TeacherAttendanceStatus.HALF_DAY: deductionAmountText = 'نصف يوم'; break;
          case TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY:
          case TeacherAttendanceStatus.QUARTER_DAY: deductionAmountText = 'ربع يوم'; break;
          case TeacherAttendanceStatus.MISSING_REPORT: deductionAmountText = 'تقرير ناقص (ربع يوم)'; break;
        }
        message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric' })}: ${r.reason} (${deductionAmountText})\n`;
      });
    }

    message += `*الراتب النهائي:* *${payrollData.finalSalary.toFixed(2)} EGP*\n\n`;
    message += `مع تحيات إدارة مركز الشاطبي.`;

    const phone = teacher.phone.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('لا يوجد رقم هاتف مسجل لهذا المدرس.');
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-lg w-full sm:w-64">
          <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير شهر</label>
          <div className="space-y-2">
            <input type="month" id="month-filter" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMonth(getCairoDateString().substring(0, 7))}
                className="flex-1 py-1 px-3 text-xs font-semibold rounded bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors border border-teal-200"
              >
                الشهر الحالي
              </button>
              <button
                onClick={() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const date = new Date(year, month - 2, 1);
                  setSelectedMonth(date.toISOString().substring(0, 7));
                }}
                className="flex-1 py-1 px-3 text-xs font-semibold rounded bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                الشهر السابق
              </button>
            </div>
          </div>
        </div>
        {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
          <button onClick={handleSendWhatsAppReport} className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-all text-sm self-end sm:self-center" title="إرسال التقرير عبر واتساب">
            <WhatsAppIcon className="w-5 h-5" />
            <span>إرسال تقرير للمدرس</span>
          </button>
        )}
        <button onClick={onBack} className="flex items-center gap-2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition-all text-sm self-end sm:self-center">
          <span>رجوع</span>
        </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Financial & Attendance */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
              <span>ملخص الراتب</span>
            </h2>
            <div className="space-y-3 text-sm">
              {payrollData.isPartnership ? (
                <>
                  <div className="flex justify-between items-center border-b pb-2 bg-green-50 p-2 rounded">
                    <span className="text-gray-600 font-semibold">نوع المحاسبة:</span>
                    <span className="font-bold text-green-700">🤝 شراكة ({teacher.partnershipPercentage}%)</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">إجمالي الدخل المتوقع:</span>
                    <span className="font-bold">{totalExpectedRevenue.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">إجمالي ما تم تحصيله:</span>
                    <span className="font-bold">{totalCollectedRevenueLocal.toLocaleString()} EGP</span>
                  </div>
                  <button
                    onClick={() => setIsCollectedDetailsOpen(true)}
                    className="w-full flex justify-between items-center border-b pb-2 hover:bg-blue-50 transition-colors p-1 rounded"
                  >
                    <span className="text-gray-600 flex items-center gap-1">
                      ما حصله المدرس:
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">عرض التفاصيل</span>
                    </span>
                    <span className="font-bold text-blue-600 underline decoration-dotted">{collectedByTeacher.toLocaleString()} EGP</span>
                  </button>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">محصل بواسطة المدير:</span>
                    <span className="font-bold text-indigo-600">{collectedByDirector.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">المبلغ المسلّم للإدارة:</span>
                    <span className="font-bold text-teal-600">{collectionData.totalHandedOver.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">المتبقي (عجز):</span>
                    <span className={`font-bold ${collectionData.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>{collectionData.remainingBalance.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2 mt-2 pt-2 border-t-2">
                    <span className="text-gray-600 font-bold">نصيبك ({teacher.partnershipPercentage}%):</span>
                    <span className="font-bold text-green-600 text-lg">{payrollData.partnershipAmount.toFixed(2)} EGP</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">الراتب الأساسي:</span>
                    <span className="font-bold">{payrollData.baseSalary.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">مكافأة حضور ({payrollData.bonusDays} يوم):</span>
                    <span className="font-bold text-green-600">+ {payrollData.attendanceBonus.toFixed(2)} EGP</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">المكافآت الإضافية:</span>
                <span className="font-bold text-green-600">+ {payrollData.adjustments.bonus.toLocaleString()} EGP</span>
              </div>
              {!payrollData.isPartnership && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">خصم الغياب ({payrollData.absenceDays} يوم):</span>
                  <span className="font-bold text-red-500">- {payrollData.absenceDeduction.toFixed(2)} EGP</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 bg-blue-50 p-2 rounded mt-2">
                <span className="font-bold text-base">الراتب النهائي المستحق:</span>
                <span className="font-bold text-xl text-blue-600">{payrollData.finalSalary.toFixed(2)} EGP</span>
              </div>
              <div className={`mt-4 p-2 text-center rounded-md font-semibold ${payrollData.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {payrollData.isPaid ? 'تم دفع راتب هذا الشهر' : 'راتب هذا الشهر لم يدفع بعد'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarCheckIcon className="w-6 h-6 text-blue-500" />
              <span>ملخص الحضور</span>
            </h2>
            <div className="flex justify-around items-center text-center">
              <div>
                <p className="text-4xl font-bold text-green-600">{financialSettings.workingDaysPerMonth - payrollData.absenceDays + payrollData.bonusDays}</p>
                <p className="text-sm text-gray-500 mt-1">يوم حضور (مكافئ)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-600">{payrollData.absenceDays}</p>
                <p className="text-sm text-gray-500 mt-1">يوم غياب (مكافئ)</p>
              </div>
            </div>
            {(bonusRecordsWithReason.length > 0 || deductionRecordsWithReason.length > 0) && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">تفاصيل المكافآت والخصومات</h4>
                {bonusRecordsWithReason.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-semibold text-green-600 mb-1">المكافآت:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {bonusRecordsWithReason.map(r => (
                        <li key={r.id} className="text-gray-600">
                          {new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}: {r.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {deductionRecordsWithReason.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-red-600 mb-1">الخصومات:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {deductionRecordsWithReason.map(r => (
                        <li key={r.id} className="text-gray-600">
                          {new Date(r.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}: {r.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Groups & Students */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-indigo-500" />
            <span>المجموعات والطلاب ({studentsInAssignedGroups.length} طالب)</span>
          </h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {assignedGroups.length > 0 ? assignedGroups.map(group => {
              const studentsInGroup = students.filter(s => s.groupId === group.id && !s.isArchived);
              return (
                <div key={group.id} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-lg text-gray-700 mb-3">{group.name} ({studentsInGroup.length} طالب)</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {studentsInGroup.sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(student => (
                      <li key={student.id} className="bg-white p-2 text-sm rounded border border-gray-200">{student.name}</li>
                    ))}
                  </ul>
                </div>
              );
            }) : (
              <p className="text-center text-gray-500 py-10">لم يتم إسناد أي مجموعات لهذا المدرس.</p>
            )}
          </div>
        </div>
      </div>

      {/* تفاصيل ما حصله المدرس Modal */}
      {isCollectedDetailsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 text-right">
              <h3 className="text-lg font-black text-gray-800">تفاصيل ما حصله المدرس ({collectedStudents.length})</h3>
              <button
                onClick={() => setIsCollectedDetailsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors order-first"
              >
                <span className="text-gray-500 text-xl font-bold">✕</span>
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto" dir="rtl">
              <div className="space-y-2">
                {collectedStudents.length > 0 ? (
                  collectedStudents.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="shrink-0 w-16">
                        {s.receiptNumber ? (
                          <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded py-1 px-1">
                            <span className="text-[8px] text-blue-600 font-bold leading-none mb-0.5">رقم الوصل</span>
                            <span className="text-xs font-black text-blue-800">{s.receiptNumber}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic text-center">بدون وصل</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-gray-800 text-sm truncate">{s.name}</span>
                          {s.isArchived && <span className="px-1 py-0.5 bg-gray-100 text-gray-500 rounded text-[8px] font-bold border border-gray-200 uppercase">مؤرشف</span>}
                          {s.isTransferred && <span className="px-1 py-0.5 bg-orange-100 text-orange-600 rounded text-[8px] font-bold border border-orange-200 uppercase">منقول</span>}
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium truncate">{s.groupName || 'بدون مجموعة'}</p>
                      </div>
                      <div className="shrink-0 text-left border-r pr-3 border-gray-50">
                        <span className="font-black text-teal-600 text-sm block">{s.amount.toLocaleString()} <small className="text-[8px]">ج.م</small></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic py-8">لم يتم استلام أي مبالغ من الطلاب خلال هذا الشهر.</p>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-right">
              <span className="font-bold text-gray-700">الإجمالي:</span>
              <span className="text-lg font-black text-blue-600">{collectedByTeacher.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TeacherReportPage;