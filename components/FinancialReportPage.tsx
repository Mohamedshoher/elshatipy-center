import React, { useState, useMemo } from 'react';
import type { Student, Group, UserRole } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import UserIcon from './icons/UserIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { getCairoDateString, parseCairoDateString, getCairoNow } from '../services/cairoTimeHelper';

interface FinancialReportPageProps {
  students: Student[];
  groups: Group[];
  onViewStudent: (studentId: string) => void;
  currentUserRole?: UserRole;
  currentUserId?: string; // Teacher ID when role is teacher
}

interface StudentWithFee extends Student {
  feeRecord: any;
  amountPaid: number;
  receiptNumber: string;
  isTransferred?: boolean; // Student moved to another group
}

const FinancialReportPage: React.FC<FinancialReportPageProps> = ({ students, groups, onViewStudent, currentUserRole, currentUserId }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => getCairoDateString().substring(0, 7));
  const [isPaidExpanded, setIsPaidExpanded] = useState(false);
  const [isUnpaidExpanded, setIsUnpaidExpanded] = useState(false);
  const [isLedgerExpanded, setIsLedgerExpanded] = useState(false);
  const [paidGroupFilter, setPaidGroupFilter] = useState('');
  const [unpaidGroupFilter, setUnpaidGroupFilter] = useState('');
  const [ledgerGroupFilter, setLedgerGroupFilter] = useState('');

  // Get teacher's current groups if viewing as teacher
  const teacherGroupIds = useMemo(() => {
    if (currentUserRole === 'teacher' && currentUserId) {
      return new Set(groups.filter(g => g.teacherId === currentUserId).map(g => g.id));
    }
    return null;
  }, [currentUserRole, currentUserId, groups]);

  const handlePrevMonth = () => {
    const date = new Date(selectedMonth + '-01');
    date.setMonth(date.getMonth() - 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${yyyy}-${mm}`);
  };

  const financialData = useMemo(() => {
    let totalCollected = 0;
    let totalDue = 0;
    const paidStudents: StudentWithFee[] = [];
    const unpaidStudents: Student[] = [];

    const now = getCairoNow();
    const [year, monthNum] = selectedMonth.split('-').map(Number);
    const lastDayDate = new Date(year, monthNum, 0);
    const checkDate = now < lastDayDate ? now : lastDayDate;
    checkDate.setHours(0, 0, 0, 0);

    students.forEach(student => {
      if (student.joiningDate.substring(0, 7) > selectedMonth) {
        return;
      }

      const feeRecord = student.fees.find(f => f.month === selectedMonth);
      const isPaid = !!feeRecord?.paid;

      if (isPaid) {
        const amountPaid = feeRecord?.amountPaid || student.monthlyFee;
        totalCollected += amountPaid;

        // Check if student is transferred (not in teacher's current groups but paid with them)
        const isTransferred = teacherGroupIds
          ? !student.isArchived && !teacherGroupIds.has(student.groupId)
          : false;

        paidStudents.push({
          ...student,
          feeRecord,
          amountPaid,
          receiptNumber: feeRecord?.receiptNumber || '',
          isTransferred
        });

        if (!student.isArchived) {
          totalDue += student.monthlyFee;
        }
        return;
      }

      if (student.isArchived) return;

      const joiningDate = parseCairoDateString(student.joiningDate);
      joiningDate.setHours(0, 0, 0, 0);

      const diffTime = checkDate.getTime() - joiningDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 15) {
        return;
      }

      const attendanceInMonth = student.attendance.filter(record => {
        return record.date.startsWith(selectedMonth) && record.status === 'present';
      }).length;

      const group = groups.find(g => g.id === student.groupId);
      const isIqraaGroup = group?.name.includes('إقراء') || group?.name.includes('اقراء');

      if (!isIqraaGroup && attendanceInMonth < 5) {
        return;
      }

      totalDue += student.monthlyFee;
      unpaidStudents.push(student);
    });

    // Sort paid students by receipt number
    paidStudents.sort((a, b) => {
      const receiptA = a.receiptNumber || '';
      const receiptB = b.receiptNumber || '';
      return receiptA.localeCompare(receiptB, 'ar', { numeric: true });
    });

    // The Ledger (الدفتر): Everything collected by this teacher, even for transferred or archived students
    const ledgerStudents = [...paidStudents];
    // Sort ledger by receipt number
    ledgerStudents.sort((a, b) => {
      const receiptA = a.receiptNumber || '';
      const receiptB = b.receiptNumber || '';
      return receiptA.localeCompare(receiptB, 'ar', { numeric: true });
    });

    const totalRemaining = totalDue - totalCollected;
    const totalLedger = ledgerStudents.reduce((sum, s) => sum + s.amountPaid, 0);

    return { totalCollected, totalRemaining, totalLedger, paidStudents, unpaidStudents, ledgerStudents };
  }, [students, selectedMonth, groups, teacherGroupIds, currentUserRole]);

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

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Month Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">تقرير المصروفات الشهري</h2>
            <div className="w-full sm:w-auto max-w-xs flex items-center gap-2">
              <label htmlFor="month-filter" className="sr-only">اختر الشهر</label>
              <input
                type="month"
                id="month-filter"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePrevMonth}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="الشهر السابق"
              >
                <ArrowRightIcon className="w-5 h-5 transform rotate-180" />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Total Collected Card - Clickable */}
            <button
              onClick={() => {
                setIsPaidExpanded(!isPaidExpanded);
                setIsUnpaidExpanded(false);
                setIsLedgerExpanded(false);
              }}
              className={`p-6 rounded-lg transition-all hover:shadow-md ${isPaidExpanded ? 'bg-green-200 ring-2 ring-green-500' : 'bg-green-100'
                }`}
            >
              <p className="text-lg text-green-800 font-semibold mb-1">المحصل</p>
              <p className="text-4xl font-black text-green-600">
                {financialData.totalCollected.toLocaleString()}
              </p>
              <p className="text-xs text-green-700 mt-2">ج.م</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-green-700 font-bold">
                  {financialData.paidStudents.length} طالب
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-green-700 transition-transform ${isPaidExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Total Remaining Card - Clickable */}
            <button
              onClick={() => {
                setIsUnpaidExpanded(!isUnpaidExpanded);
                setIsPaidExpanded(false);
                setIsLedgerExpanded(false);
              }}
              className={`p-6 rounded-lg transition-all hover:shadow-md ${isUnpaidExpanded ? 'bg-red-200 ring-2 ring-red-500' : 'bg-red-100'
                }`}
            >
              <p className="text-lg text-red-800 font-semibold mb-1">المتبقي</p>
              <p className="text-4xl font-black text-red-600">
                {financialData.totalRemaining.toLocaleString()}
              </p>
              <p className="text-xs text-red-700 mt-2">ج.م</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-red-700 font-bold">
                  {financialData.unpaidStudents.length} طالب
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-red-700 transition-transform ${isUnpaidExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Ledger Card (الدفتر) - Clickable */}
            <button
              onClick={() => {
                setIsLedgerExpanded(!isLedgerExpanded);
                setIsPaidExpanded(false);
                setIsUnpaidExpanded(false);
              }}
              className={`p-6 rounded-lg transition-all hover:shadow-md ${isLedgerExpanded ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-blue-100'
                }`}
            >
              <p className="text-lg text-blue-800 font-semibold mb-1">الدفتر</p>
              <p className="text-4xl font-black text-blue-600">
                {financialData.totalLedger.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-2">ج.م</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-xs text-blue-700 font-bold">
                  {financialData.ledgerStudents.length} وصولات
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-blue-700 transition-transform ${isLedgerExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Paid Students Details */}
        {isPaidExpanded && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b bg-green-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800">الطلاب الذين دفعوا ({financialData.paidStudents.length})</h3>
                <span className="text-xs text-gray-500">مرتب حسب رقم الوصل</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-gray-600 whitespace-nowrap">تصفية بالمجموعة:</label>
                <select
                  value={paidGroupFilter}
                  onChange={(e) => setPaidGroupFilter(e.target.value)}
                  className="flex-grow sm:w-48 px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                >
                  <option value="">جميع المجموعات</option>
                  {Array.from(new Set(financialData.paidStudents.map(s => groups.find(g => g.id === s.groupId)?.name || (s.isArchived ? s.archivedGroupName : '') || 'بدون مجموعة')))
                    .filter(Boolean)
                    .sort()
                    .map(name => <option key={name} value={name}>{name}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-100">
              {financialData.paidStudents
                .filter(s => !paidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === paidGroupFilter) || (s.isArchived && s.archivedGroupName === paidGroupFilter))
                .length > 0 ? (
                financialData.paidStudents
                  .filter(s => !paidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === paidGroupFilter) || (s.isArchived && s.archivedGroupName === paidGroupFilter))
                  .map(student => {
                    const group = groups.find(g => g.id === student.groupId);
                    return (
                      <div key={student.id} className="p-4 hover:bg-green-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <button
                            onClick={() => onViewStudent(student.id)}
                            className="flex-grow text-right"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <UserIcon className="w-5 h-5 text-gray-400" />
                              <span className="font-bold text-gray-800">{student.name}</span>
                              {student.isArchived && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">مؤرشف</span>}
                              {student.isTransferred && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">منقول</span>}
                            </div>
                            <p className="text-xs text-gray-500">{group?.name || 'مجموعة غير معروفة'}</p>
                          </button>
                          <div className="text-left flex flex-col items-end gap-1">
                            <p className="text-lg font-black text-green-600">{student.amountPaid.toLocaleString()} ج.م</p>
                            {student.receiptNumber && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                                #{student.receiptNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="px-6 py-10 text-center text-gray-400 italic">لا يوجد طلاب دفعوا هذا الشهر.</div>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">رقم الوصل</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">اسم الطالب</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">المجموعة</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">المبلغ</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">الحالة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {financialData.paidStudents
                    .filter(s => !paidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === paidGroupFilter) || (s.isArchived && s.archivedGroupName === paidGroupFilter))
                    .length > 0 ? (
                    financialData.paidStudents
                      .filter(s => !paidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === paidGroupFilter) || (s.isArchived && s.archivedGroupName === paidGroupFilter))
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId);
                        return (
                          <tr key={student.id} className="hover:bg-green-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {student.receiptNumber ? (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                  #{student.receiptNumber}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => onViewStudent(student.id)}
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                              >
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-gray-800">{student.name}</span>
                                {student.isArchived && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold">مؤرشف</span>}
                                {student.isTransferred && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">منقول</span>}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {group?.name || 'مجموعة غير معروفة'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-lg font-black text-green-600">{student.amountPaid.toLocaleString()} ج.م</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                تم الدفع ✓
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                        لا يوجد طلاب دفعوا هذا الشهر.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unpaid Students Details */}
        {isUnpaidExpanded && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b bg-red-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800">الطلاب الذين لم يدفعوا ({financialData.unpaidStudents.length})</h3>
                <span className="text-xs text-gray-500">مرتب أبجدياً</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-gray-600 whitespace-nowrap">تصفية بالمجموعة:</label>
                <select
                  value={unpaidGroupFilter}
                  onChange={(e) => setUnpaidGroupFilter(e.target.value)}
                  className="flex-grow sm:w-48 px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                >
                  <option value="">جميع المجموعات</option>
                  {Array.from(new Set(financialData.unpaidStudents.map(s => groups.find(g => g.id === s.groupId)?.name || 'بدون مجموعة')))
                    .filter(Boolean)
                    .sort()
                    .map(name => <option key={name} value={name}>{name}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-100">
              {financialData.unpaidStudents
                .filter(s => !unpaidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === unpaidGroupFilter))
                .length > 0 ? (
                financialData.unpaidStudents
                  .filter(s => !unpaidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === unpaidGroupFilter))
                  .map(student => {
                    const group = groups.find(g => g.id === student.groupId);
                    return (
                      <div key={student.id} className="p-4 hover:bg-red-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <button
                            onClick={() => onViewStudent(student.id)}
                            className="flex-grow text-right"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <UserIcon className="w-5 h-5 text-gray-400" />
                              <span className="font-bold text-gray-800">{student.name}</span>
                            </div>
                            <p className="text-xs text-gray-500">{group?.name || 'مجموعة غير معروفة'}</p>
                          </button>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-black text-red-600">{student.monthlyFee.toLocaleString()} ج.م</p>
                            {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIndividualWhatsAppReminder(student);
                                }}
                                className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors"
                                title={`إرسال تذكير واتساب لولي أمر ${student.name}`}
                              >
                                <WhatsAppIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="px-6 py-10 text-center text-gray-400 italic">جميع الطلاب دفعوا! 🎉</div>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">اسم الطالب</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">المجموعة</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">المبلغ المستحق</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {financialData.unpaidStudents
                    .filter(s => !unpaidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === unpaidGroupFilter))
                    .length > 0 ? (
                    financialData.unpaidStudents
                      .filter(s => !unpaidGroupFilter || (groups.find(g => g.id === s.groupId)?.name === unpaidGroupFilter))
                      .map(student => {
                        const group = groups.find(g => g.id === student.groupId);
                        return (
                          <tr key={student.id} className="hover:bg-red-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => onViewStudent(student.id)}
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                              >
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-gray-800">{student.name}</span>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {group?.name || 'مجموعة غير معروفة'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-lg font-black text-red-600">{student.monthlyFee.toLocaleString()} ج.م</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIndividualWhatsAppReminder(student);
                                  }}
                                  className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors inline-flex"
                                  title={`إرسال تذكير واتساب لولي أمر ${student.name}`}
                                >
                                  <WhatsAppIcon className="w-5 h-5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                        جميع الطلاب دفعوا! 🎉
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ledger Details (الدفتر) */}
        {isLedgerExpanded && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b bg-blue-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800">الدفتر - سجل التحصيلات ({financialData.ledgerStudents.length})</h3>
                <span className="text-xs text-gray-500">مرتب حسب رقم الوصل (يشمل المنقولين والمؤرشفين)</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-gray-600 whitespace-nowrap">تصفية بالمجموعة:</label>
                <select
                  value={ledgerGroupFilter}
                  onChange={(e) => setLedgerGroupFilter(e.target.value)}
                  className="flex-grow sm:w-48 px-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="">جميع المجموعات</option>
                  {Array.from(new Set(financialData.ledgerStudents.map(s => groups.find(g => g.id === s.groupId)?.name || (s.isArchived ? s.archivedGroupName : '') || 'بدون مجموعة')))
                    .filter(Boolean)
                    .sort()
                    .map(name => <option key={name} value={name}>{name}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">رقم الوصل</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">اسم الطالب</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-500 uppercase">المجموعة</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {financialData.ledgerStudents
                    .filter(s => !ledgerGroupFilter || (groups.find(g => g.id === s.groupId)?.name === ledgerGroupFilter) || (s.isArchived && s.archivedGroupName === ledgerGroupFilter))
                    .length > 0 ? (
                    financialData.ledgerStudents
                      .filter(s => !ledgerGroupFilter || (groups.find(g => g.id === s.groupId)?.name === ledgerGroupFilter) || (s.isArchived && s.archivedGroupName === ledgerGroupFilter))
                      .map(student => {
                        const groupName = groups.find(g => g.id === student.groupId)?.name || (student.isArchived ? student.archivedGroupName : '') || 'بدون مجموعة';
                        return (
                          <tr key={`${student.id}-${student.receiptNumber}`} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {student.receiptNumber ? (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                                  #{student.receiptNumber}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-gray-800">
                                  {student.name}
                                  {student.isArchived && <span className="text-red-500 mr-1 text-xs font-bold">(مؤرشف)</span>}
                                </span>
                                {student.isTransferred && <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-bold">منقول</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {groupName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="text-lg font-black text-blue-600">{student.amountPaid.toLocaleString()} ج.م</span>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                        لا يوجد بيانات في الدفتر حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default FinancialReportPage;