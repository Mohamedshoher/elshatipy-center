import React, { useState, useMemo } from 'react';
import type { Student, Group, UserRole } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UserIcon from './icons/UserIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { getCairoDateString } from '../services/cairoTimeHelper';

interface FinancialReportPageProps {
  students: Student[]; // Should be pre-filtered for the current user
  groups: Group[];   // Should be pre-filtered for the current user
  onViewStudent: (studentId: string) => void;
  currentUserRole?: UserRole;
}

const FinancialReportPage: React.FC<FinancialReportPageProps> = ({ students, groups, onViewStudent, currentUserRole }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => getCairoDateString().substring(0, 7));
  const [expandedPaid, setExpandedPaid] = useState<Set<string>>(new Set());
  const [expandedUnpaid, setExpandedUnpaid] = useState<Set<string>>(new Set());

  const financialData = useMemo(() => {
    let totalCollected = 0;
    let totalDue = 0;
    const paidStudentsByGroup: Record<string, Student[]> = {};
    const unpaidStudentsByGroup: Record<string, Student[]> = {};

    students.forEach(student => {
      // Skip archived students
      if (student.isArchived) return;

      // Only consider students who have joined on or before the selected month
      if (student.joiningDate.substring(0, 7) > selectedMonth) {
        return;
      }

      totalDue += student.monthlyFee;
      const feeRecord = student.fees.find(f => f.month === selectedMonth);

      if (feeRecord?.paid) {
        totalCollected += feeRecord.amountPaid || student.monthlyFee;
        if (!paidStudentsByGroup[student.groupId]) {
          paidStudentsByGroup[student.groupId] = [];
        }
        paidStudentsByGroup[student.groupId].push(student);
      } else {
        if (!unpaidStudentsByGroup[student.groupId]) {
          unpaidStudentsByGroup[student.groupId] = [];
        }
        unpaidStudentsByGroup[student.groupId].push(student);
      }
    });

    const totalRemaining = totalDue - totalCollected;

    return { totalCollected, totalRemaining, paidStudentsByGroup, unpaidStudentsByGroup };
  }, [students, selectedMonth]);

  const handleIndividualWhatsAppReminder = (student: Student) => {
    const monthName = new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });
    const message = `تذكير من مركز الشاطبي،\nمرحباً ولي أمر الطالب/ة: *${student.name}*.\nنود تذكيركم بأن مصروفات شهر *${monthName}* لم تسدد بعد.\n\nيرجى سرعة السداد لتجنب الإجراءات الإدارية.\nإذا كنتم قد سددتم الرسوم بالفعل، يرجى مراجعة الإدارة مع إحضار وصل الدفع.\n\nشكراً لتعاونكم.`;

    const phone = student.phone.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('لا يوجد رقم هاتف مسجل لهذا الطالب.');
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const toggleExpansion = (groupId: string, type: 'paid' | 'unpaid') => {
    const setter = type === 'paid' ? setExpandedPaid : setExpandedUnpaid;
    setter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const GroupSection: React.FC<{
    title: string;
    studentsByGroup: Record<string, Student[]>;
    expandedSet: Set<string>;
    onToggle: (groupId: string) => void;
    isUnpaidSection?: boolean;
    onSendWhatsApp?: (student: Student) => void;
    currentUserRole?: 'director' | 'teacher' | 'supervisor';
  }> = ({ title, studentsByGroup, expandedSet, onToggle, isUnpaidSection, onSendWhatsApp, currentUserRole }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-3">
        {groups
          .filter(group => studentsByGroup[group.id] && studentsByGroup[group.id].length > 0)
          .sort((a, b) => a.name.localeCompare(b.name, 'ar'))
          .map(group => {
            const studentsInGroup = studentsByGroup[group.id] || [];
            const isExpanded = expandedSet.has(group.id);
            return (
              <div key={group.id} className="bg-gray-50 rounded-lg border">
                <div
                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => onToggle(group.id)}
                >
                  <h3 className="font-semibold text-gray-700">{group.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {studentsInGroup.length}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-200 p-3">
                    <ul className="space-y-2">
                      {studentsInGroup
                        .sort((a, b) => a.name.localeCompare(b.name, 'ar'))
                        .map(student => (
                          <li key={student.id} className="flex items-center justify-between bg-white p-2 rounded-md hover:bg-blue-50 transition-colors">
                            <button
                              onClick={() => onViewStudent(student.id)}
                              className="flex-grow text-right flex items-center"
                            >
                              <UserIcon className="w-5 h-5 ml-2 text-gray-400" />
                              {student.name}
                            </button>
                            {isUnpaidSection && onSendWhatsApp && (currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSendWhatsApp(student);
                                }}
                                className="p-1 text-green-500 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
                                title={`إرسال تذكير واتساب لولي أمر ${student.name}`}
                              >
                                <WhatsAppIcon className="w-5 h-5" />
                              </button>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Summary and Month Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">تقرير المصروفات الشهري</h2>
            <div className="w-full sm:w-auto max-w-xs">
              <label htmlFor="month-filter" className="sr-only">اختر الشهر</label>
              <input
                type="month"
                id="month-filter"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-lg text-green-800 font-semibold">الإجمالي المحصّل</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {financialData.totalCollected.toLocaleString()} EGP
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-lg text-red-800 font-semibold">الإجمالي المتبقي</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {financialData.totalRemaining.toLocaleString()} EGP
              </p>
            </div>
          </div>
        </div>

        {/* Paid Students Section */}
        <GroupSection
          title="الطلاب الذين دفعوا"
          studentsByGroup={financialData.paidStudentsByGroup}
          expandedSet={expandedPaid}
          onToggle={(groupId) => toggleExpansion(groupId, 'paid')}
        />

        {/* Unpaid Students Section */}
        <GroupSection
          title="الطلاب الذين لم يدفعوا"
          studentsByGroup={financialData.unpaidStudentsByGroup}
          expandedSet={expandedUnpaid}
          onToggle={(groupId) => toggleExpansion(groupId, 'unpaid')}
          isUnpaidSection={true}
          onSendWhatsApp={handleIndividualWhatsAppReminder}
          currentUserRole={currentUserRole}
        />
      </div>
    </main>
  );
};

export default FinancialReportPage;