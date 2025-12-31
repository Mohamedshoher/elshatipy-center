import React, { useState, useMemo } from 'react';
import type { Teacher, Group, Student, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings, TeacherCollectionRecord, UserRole } from '../types';
import { TeacherAttendanceStatus, PaymentType } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PhoneIcon from './icons/PhoneIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import UsersIcon from './icons/UsersIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { getCairoDateString, getCairoNow } from '../services/cairoTimeHelper';

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

  const assignedGroups = useMemo(() => {
    return groups.filter(g => g.teacherId === teacher.id);
  }, [groups, teacher.id]);

  const studentsInAssignedGroups = useMemo(() => {
    const groupIds = assignedGroups.map(g => g.id);
    return students.filter(s => groupIds.includes(s.groupId) && !s.isArchived);
  }, [students, assignedGroups]);

  const { collectedByTeacher, collectedByDirector, totalRevenue } = useMemo(() => {
    const groupIds = assignedGroups.map(g => g.id);
    let byTeacher = 0;
    let byDirector = 0;
    let total = 0;

    students.forEach(s => {
      s.fees.forEach(fee => {
        const isMatch = fee.month === selectedMonth && fee.paid && fee.amountPaid;
        if (!isMatch) return;

        const amount = fee.amountPaid || 0;
        const isCollectedByThisTeacher = fee.collectedBy === teacher.id;
        const isCollectedByDirector = fee.collectedBy === 'director';
        const isInTeacherGroup = groupIds.includes(s.groupId);

        // Logic matches TeacherDetailsPage for consistency
        if (isCollectedByThisTeacher) {
          byTeacher += amount;
          total += amount;
        } else if (isCollectedByDirector && isInTeacherGroup) {
          byDirector += amount;
          total += amount;
        } else if (!fee.collectedBy && isInTeacherGroup) {
          // Legacy support: assume teacher if in group and no collector is specified
          byTeacher += amount;
          total += amount;
        }
      });
    });

    return { collectedByTeacher: byTeacher, collectedByDirector: byDirector, totalRevenue: total };
  }, [students, assignedGroups, selectedMonth, teacher.id]);

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
    const partnershipAmount = isPartnership ? (totalRevenue * (teacher.partnershipPercentage || 0) / 100) : 0;

    const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === teacher.id && p.month === selectedMonth) || { bonus: 0, isPaid: false };
    const absenceDays = attendanceForMonth.reduce((total, record) => total + getAbsenceValue(record.status), 0);
    const bonusDays = attendanceForMonth.reduce((total, record) => total + getBonusValue(record.status), 0);

    // Calculate daily rate for deductions/bonuses
    // For partnership, we use the partnershipAmount as the "effective salary" for this month
    const effectiveSalary = isPartnership ? partnershipAmount : baseSalary;

    const dailyRate = effectiveSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? effectiveSalary / financialSettings.workingDaysPerMonth : 0;
    const absenceDeduction = dailyRate * absenceDays * (financialSettings.absenceDeductionPercentage / 100);
    const attendanceBonus = dailyRate * bonusDays;

    const finalSalary = isPartnership
      ? partnershipAmount + adjustments.bonus + attendanceBonus - absenceDeduction
      : baseSalary + adjustments.bonus + attendanceBonus - absenceDeduction;

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
  }, [teacher, selectedMonth, teacherPayrollAdjustments, attendanceForMonth, financialSettings, collectedAmount]);

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
    message += `*إجمالي دخل مجموعاتك:* ${totalRevenue.toLocaleString()} EGP\n`;
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

    if (payrollData.adjustments.bonus > 0) {
      message += `*مكافآت إضافية:* +${payrollData.adjustments.bonus.toLocaleString()} EGP\n`;
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
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <label htmlFor="month-filter" className="block text-sm font-medium text-gray-600 mb-1">عرض تقرير شهر</label>
          <input type="month" id="month-filter" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500" />
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
                    <span className="text-gray-600">إجمالي دخل المجموعات:</span>
                    <span className="font-bold">{totalRevenue.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">ما حصله المدرس:</span>
                    <span className="font-bold text-blue-600">{collectedByTeacher.toLocaleString()} EGP</span>
                  </div>
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
    </main>
  );
};

export default TeacherReportPage;