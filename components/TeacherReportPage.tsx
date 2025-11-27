import React, { useState, useMemo } from 'react';
import type { Teacher, Group, Student, TeacherAttendanceRecord, TeacherPayrollAdjustment, FinancialSettings } from '../types';
import { TeacherAttendanceStatus } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PhoneIcon from './icons/PhoneIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import UsersIcon from './icons/UsersIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface TeacherReportPageProps {
  teacher: Teacher;
  groups: Group[];
  students: Student[];
  teacherAttendance: TeacherAttendanceRecord[];
  teacherPayrollAdjustments: TeacherPayrollAdjustment[];
  financialSettings: FinancialSettings;
  onBack: () => void;
}

const getAbsenceValue = (status: TeacherAttendanceStatus): number => {
    switch (status) {
        case TeacherAttendanceStatus.ABSENT: return 1;
        case TeacherAttendanceStatus.HALF_DAY: return 0.5;
        case TeacherAttendanceStatus.QUARTER_DAY: return 0.25;
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

const TeacherReportPage: React.FC<TeacherReportPageProps> = ({ teacher, groups, students, teacherAttendance, teacherPayrollAdjustments, financialSettings, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));

  const assignedGroups = useMemo(() => {
    return groups.filter(g => g.teacherId === teacher.id);
  }, [groups, teacher.id]);

  const studentsInAssignedGroups = useMemo(() => {
    const groupIds = assignedGroups.map(g => g.id);
    return students.filter(s => groupIds.includes(s.groupId));
  }, [students, assignedGroups]);
  
  const collectedAmount = useMemo(() => {
    return studentsInAssignedGroups
        .flatMap(s => s.fees)
        .filter(f => f.month === selectedMonth && f.paid && f.amountPaid)
        .reduce((sum, f) => sum + (f.amountPaid || 0), 0);
  }, [studentsInAssignedGroups, selectedMonth]);

  const attendanceForMonth = useMemo(() => {
    return teacherAttendance.filter(a => a.teacherId === teacher.id && a.date.startsWith(selectedMonth));
  }, [teacher, teacherAttendance, selectedMonth]);


  const payrollData = useMemo(() => {
    const baseSalary = teacher.salary || 0;
    const adjustments = teacherPayrollAdjustments.find(p => p.teacherId === teacher.id && p.month === selectedMonth) || { bonus: 0, isPaid: false };
    const absenceDays = attendanceForMonth.reduce((total, record) => total + getAbsenceValue(record.status), 0);
    const bonusDays = attendanceForMonth.reduce((total, record) => total + getBonusValue(record.status), 0);
    
    const dailyRate = baseSalary > 0 && financialSettings.workingDaysPerMonth > 0 ? baseSalary / financialSettings.workingDaysPerMonth : 0;
    const absenceDeduction = dailyRate * absenceDays * (financialSettings.absenceDeductionPercentage / 100);
    const attendanceBonus = dailyRate * bonusDays;

    const finalSalary = baseSalary + adjustments.bonus + attendanceBonus - absenceDeduction;
    return { baseSalary, adjustments, absenceDays, bonusDays, absenceDeduction, attendanceBonus, finalSalary, isPaid: adjustments.isPaid };
  }, [teacher, selectedMonth, teacherPayrollAdjustments, attendanceForMonth, financialSettings]);

  const bonusRecordsWithReason = useMemo(() =>
      attendanceForMonth.filter(r => getBonusValue(r.status) > 0 && r.reason),
  [attendanceForMonth]);

  const deductionRecordsWithReason = useMemo(() =>
      attendanceForMonth.filter(r => getAbsenceValue(r.status) > 0 && r.status !== TeacherAttendanceStatus.ABSENT && r.reason),
  [attendanceForMonth]);

  const handleSendWhatsAppReport = () => {
    const monthName = new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
    let message = `*تقرير الأداء والراتب - ${monthName}*\n`;
    message += `*المدرس/ة:* ${teacher.name}\n\n`;
    message += `*--- ملخص الأداء ---*\n`;
    message += `*المبلغ المحصّل:* ${collectedAmount.toLocaleString()} EGP\n`;
    message += `*أيام الحضور (المكافئة):* ${financialSettings.workingDaysPerMonth - payrollData.absenceDays + payrollData.bonusDays}\n`;
    message += `*أيام الغياب (المكافئة):* ${payrollData.absenceDays}\n\n`;
    message += `*--- تفاصيل الراتب ---*\n`;
    message += `*الراتب الأساسي:* ${payrollData.baseSalary.toLocaleString()} EGP\n`;
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
            message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', {day:'numeric'})}: ${r.reason} (${bonusAmountText})\n`;
        });
    }

    if (payrollData.adjustments.bonus > 0) {
        message += `*مكافآت إضافية:* +${payrollData.adjustments.bonus.toLocaleString()} EGP\n`;
    }

    message += `*خصم الغياب (${payrollData.absenceDays} يوم):* -${payrollData.absenceDeduction.toFixed(2)} EGP\n`;
    
    if (deductionRecordsWithReason.length > 0) {
        message += `*تفاصيل الخصومات:*\n`;
        deductionRecordsWithReason.forEach(r => {
             let deductionAmountText = '';
            switch (r.status) {
              case TeacherAttendanceStatus.HALF_DAY: deductionAmountText = 'نصف يوم'; break;
              case TeacherAttendanceStatus.QUARTER_DAY: deductionAmountText = 'ربع يوم'; break;
            }
            message += `  - ${new Date(r.date).toLocaleDateString('ar-EG-u-nu-latn', {day:'numeric'})}: ${r.reason} (${deductionAmountText})\n`;
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
            <button onClick={handleSendWhatsAppReport} className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-all text-sm self-end sm:self-center" title="إرسال التقرير عبر واتساب">
                <WhatsAppIcon className="w-5 h-5"/>
                <span>إرسال تقرير للمدرس</span>
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
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">الراتب الأساسي:</span>
                  <span className="font-bold">{payrollData.baseSalary.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">مكافأة حضور ({payrollData.bonusDays} يوم):</span>
                  <span className="font-bold text-green-600">+ {payrollData.attendanceBonus.toFixed(2)} EGP</span>
                </div>
                 <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">المكافآت الإضافية:</span>
                  <span className="font-bold text-green-600">+ {payrollData.adjustments.bonus.toLocaleString()} EGP</span>
                </div>
                 <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">خصم الغياب ({payrollData.absenceDays} يوم):</span>
                  <span className="font-bold text-red-500">- {payrollData.absenceDeduction.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-base">الراتب النهائي:</span>
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
                                            {new Date(r.date).toLocaleDateString('ar-EG', {day: 'numeric', month: 'short'})}: {r.reason}
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
                                            {new Date(r.date).toLocaleDateString('ar-EG', {day: 'numeric', month: 'short'})}: {r.reason}
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
                const studentsInGroup = students.filter(s => s.groupId === group.id);
                return (
                  <div key={group.id} className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg text-gray-700 mb-3">{group.name} ({studentsInGroup.length} طالب)</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {studentsInGroup.sort((a,b) => a.name.localeCompare(b.name, 'ar')).map(student => (
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