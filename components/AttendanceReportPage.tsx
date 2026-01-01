
import React, { useState, useMemo } from 'react';
import type { Student, Group, UserRole } from '../types';
import { AttendanceStatus } from '../types';
import UserIcon from './icons/UserIcon';
import AbsentStudentsModal from './AbsentStudentsModal';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { getCairoDateString, getCairoNow } from '../services/cairoTimeHelper';
import ClipboardListIcon from './icons/ClipboardListIcon';
import ArchiveIcon from './icons/ArchiveIcon';

interface AttendanceReportPageProps {
  students: Student[];
  groups: Group[];
  onViewStudent: (studentId: string) => void;
  onArchive: (studentId: string) => void;
  onViewDetails: (student: Student, tab?: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports') => void;
  currentUserRole?: UserRole;
}

const AttendanceReportPage: React.FC<AttendanceReportPageProps> = ({ students, groups, onViewStudent, onArchive, onViewDetails, currentUserRole }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => getCairoDateString().substring(0, 7));
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const [selectedDailyDate, setSelectedDailyDate] = useState(() => getCairoDateString());
  const [absentDaysFilter, setAbsentDaysFilter] = useState(1);
  const [consecutiveFilter, setConsecutiveFilter] = useState(0);

  const setDateOffset = (offset: number) => {
    const date = getCairoNow();
    date.setDate(date.getDate() + offset);
    setSelectedDailyDate(date.toISOString().split('T')[0]);
  };

  // Sync selectedMonth with selectedDailyDate
  React.useEffect(() => {
    if (selectedDailyDate) {
      setSelectedMonth(selectedDailyDate.substring(0, 7));
    }
  }, [selectedDailyDate]);

  const dailyReport = useMemo(() => {
    let present = 0;
    let absentStudents: Student[] = [];
    students.forEach(student => {
      const attendance = student.attendance.find(a => a.date === selectedDailyDate);
      if (attendance) {
        if (attendance.status === AttendanceStatus.PRESENT) {
          present++;
        } else {
          absentStudents.push(student);
        }
      } else {
        // Only consider them absent if the selected date is on or after their joining date
        if (new Date(selectedDailyDate) >= new Date(student.joiningDate)) {
          absentStudents.push(student);
        }
      }
    });
    return { present, absent: absentStudents.length, absentStudents };
  }, [students, selectedDailyDate]);

  const monthlyReport = useMemo(() => {
    const studentStats = students.map(student => {
      const attendanceInMonth = student.attendance.filter(a => a.date.startsWith(selectedMonth));
      const absentDays = attendanceInMonth.filter(a => a.status === AttendanceStatus.ABSENT).length;

      // حساب الغياب المتصل المستمر حتى التاريخ المختار (الحالة الحقيقية الآن)
      const sortedAttendance = [...student.attendance]
        .filter(a => a.date <= selectedDailyDate)
        .sort((a, b) => b.date.localeCompare(a.date)); // من الأحدث للأقدم

      let currentStreak = 0;
      for (const record of sortedAttendance) {
        if (record.status === AttendanceStatus.ABSENT) {
          currentStreak++;
        } else if (record.status === AttendanceStatus.PRESENT) {
          break; // انكسرت السلسلة بالحضور
        }
      }

      // التحقق مما إذا كان الطالب حاضراً اليوم المختار في التقرير اليومي
      const isPresentOnSelectedDate = student.attendance.find(a => a.date === selectedDailyDate)?.status === AttendanceStatus.PRESENT;

      return { student, absentDays, currentStreak, isPresentOnSelectedDate };
    });

    const mostAbsent = studentStats
      .filter(s => {
        // شرط إجمالي أيام الغياب
        const matchesTotal = s.absentDays >= absentDaysFilter;

        // شرط الغياب المتصل: يجب أن يكون غيابه مستمراً حتى اليوم المختار وألا يكون حاضراً اليوم
        let matchesConsecutive = true;
        if (consecutiveFilter > 0) {
          matchesConsecutive = s.currentStreak >= consecutiveFilter && !s.isPresentOnSelectedDate;
        }

        return matchesTotal && matchesConsecutive;
      })
      .sort((a, b) => b.absentDays - a.absentDays);

    return { mostAbsent };
  }, [students, selectedMonth, absentDaysFilter, consecutiveFilter, selectedDailyDate]);

  const handleStudentClick = (studentId: string) => {
    setIsAbsentModalOpen(false);
    onViewStudent(studentId);
  };

  const handleWhatsAppWarning = (student: Student, absentDays: number) => {
    const message = `مرحباً ولي أمر الطالب/ة: *${student.name}*،\n\nنود إعلامكم بتجاوز الطالب/ة الحد المسموح به من الغياب خلال هذا الشهر، حيث بلغ عدد أيام غيابه/ا *${absentDays}* يوم.\n\nيرجى العلم بأنه في حال استمرار الغياب قد يؤدي ذلك إلى فصل الطالب/ة من المركز.\n\nمع تحيات إدارة المركز.`;

    let phone = student.phone.replace(/[^0-9]/g, '');
    phone = phone.replace(/^0+/, ''); // حذف الأصفار البادئة

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

  const selectedMonthName = new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long' });

  return (
    <>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">

          {/* Section 1: Daily Report */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">التقرير اليومي</h2>

            {/* Date selection for daily report */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="date"
                value={selectedDailyDate}
                onChange={(e) => setSelectedDailyDate(e.target.value)}
                className="w-full sm:w-auto flex-grow px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button onClick={() => setDateOffset(0)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">اليوم</button>
                <button onClick={() => setDateOffset(-1)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">أمس</button>
                <button onClick={() => setDateOffset(-2)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">أول أمس</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{dailyReport.present}</p>
                <p className="text-sm text-green-800 font-semibold">حاضر</p>
              </div>
              <button
                onClick={() => dailyReport.absent > 0 && setIsAbsentModalOpen(true)}
                className={`bg-red-100 p-3 rounded-lg text-center transition-all ${dailyReport.absent > 0 ? 'cursor-pointer hover:bg-red-200' : 'cursor-default'}`}
                disabled={dailyReport.absent === 0}
              >
                <p className="text-2xl font-bold text-red-600">{dailyReport.absent}</p>
                <p className="text-sm text-red-800 font-semibold">غائب</p>
                {dailyReport.absent > 0 && <span className="text-xs text-red-700 block mt-1">(انقر لعرض التفاصيل)</span>}
              </button>
            </div>
          </div>



          {/* Section 2: Most Absent */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <h3 className="text-lg font-bold text-gray-800">الطلاب الأكثر غيابًا - {selectedMonthName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 w-full lg:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-2 bg-white p-2 rounded-lg border border-gray-100 lg:border-none lg:bg-transparent lg:p-0">
                  <label htmlFor="absent-filter" className="text-xs font-bold text-gray-500 whitespace-nowrap">إجمالي الغياب:</label>
                  <div className="flex items-center gap-1">
                    <input
                      id="absent-filter"
                      type="number"
                      min="1"
                      value={absentDaysFilter}
                      onChange={(e) => setAbsentDaysFilter(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 px-1 py-1 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center text-sm"
                    />
                    <span className="text-[10px] font-bold text-gray-400">يوم+</span>
                  </div>
                </div>
                <div className="hidden lg:block w-px h-6 bg-gray-200"></div>
                <div className="flex items-center justify-between sm:justify-start gap-2 bg-white p-2 rounded-lg border border-gray-100 lg:border-none lg:bg-transparent lg:p-0">
                  <label htmlFor="consecutive-filter" className="text-xs font-bold text-gray-500 whitespace-nowrap">غياب متصل:</label>
                  <div className="flex items-center gap-1">
                    <input
                      id="consecutive-filter"
                      type="number"
                      min="1"
                      value={consecutiveFilter}
                      onChange={(e) => setConsecutiveFilter(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-12 px-1 py-1 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-center text-sm"
                      placeholder="0"
                    />
                    <span className="text-[10px] font-bold text-gray-400">يوم+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monthlyReport.mostAbsent.map((student, index) => (
                <div key={student.student.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
                  <div className="flex items-center min-w-0">
                    <span className="font-bold text-gray-300 w-5 text-center text-xs shrink-0">{index + 1}</span>
                    <div className="bg-blue-50 p-2 rounded-lg mx-3 shrink-0">
                      <UserIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                      <button
                        onClick={() => onViewStudent(student.student.id)}
                        className="font-bold text-gray-800 hover:text-blue-600 transition-colors text-right truncate text-sm sm:text-base"
                      >
                        {student.student.name}
                      </button>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                          {groups.find(g => g.id === student.student.groupId)?.name}
                        </span>
                        {student.currentStreak >= 3 && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></span>
                            {student.currentStreak} متصل
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <div className="flex items-center gap-1">
                      {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                        <button onClick={() => handleWhatsAppWarning(student.student, student.absentDays)} className="text-green-500 hover:bg-green-50 p-2 rounded-lg transition-colors" title="إرسال تنبيه لولي الأمر">
                          <WhatsAppIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(student.student, 'attendanceLog'); }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="سجل الحضور"
                      >
                        <ClipboardListIcon className="w-5 h-5" />
                      </button>
                      {currentUserRole !== 'teacher' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onArchive(student.student.id); }}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="أرشفة الطالب"
                        >
                          <ArchiveIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="shrink-0">
                      <span className="font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-xs sm:text-sm border border-red-100 whitespace-nowrap">
                        {student.absentDays} غياب
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {monthlyReport.mostAbsent.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">{`لا يوجد طلاب ينطبق عليهم البحث في ${selectedMonthName}.`}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <AbsentStudentsModal
        isOpen={isAbsentModalOpen}
        onClose={() => setIsAbsentModalOpen(false)}
        absentStudents={dailyReport.absentStudents}
        groups={groups}
        onStudentClick={handleStudentClick}
        currentUserRole={currentUserRole}
      />
    </>
  );
};

export default AttendanceReportPage;
