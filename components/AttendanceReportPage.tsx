
import React, { useState, useMemo } from 'react';
import type { Student, Group } from '../types';
import { AttendanceStatus } from '../types';
import UserIcon from './icons/UserIcon';
import AbsentStudentsModal from './AbsentStudentsModal';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface AttendanceReportPageProps {
  students: Student[];
  groups: Group[];
  onViewStudent: (studentId: string) => void;
  currentUserRole?: 'director' | 'teacher' | 'supervisor';
}

const AttendanceReportPage: React.FC<AttendanceReportPageProps> = ({ students, groups, onViewStudent, currentUserRole }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));
  const [isAbsentModalOpen, setIsAbsentModalOpen] = useState(false);
  const [selectedDailyDate, setSelectedDailyDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [absentDaysFilter, setAbsentDaysFilter] = useState(1);

  const setDateOffset = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setSelectedDailyDate(date.toISOString().split('T')[0]);
  };

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
      return { student, absentDays };
    });

    const mostAbsent = studentStats
      .filter(s => s.absentDays >= absentDaysFilter)
      .sort((a, b) => b.absentDays - a.absentDays);

    return { mostAbsent };
  }, [students, selectedMonth, absentDaysFilter]);

  const handleStudentClick = (studentId: string) => {
    setIsAbsentModalOpen(false);
    onViewStudent(studentId);
  };

  const handleWhatsAppWarning = (student: Student, absentDays: number) => {
    const message = `مرحباً ولي أمر الطالب/ة: *${student.name}*،\n\nنود إعلامكم بتجاوز الطالب/ة الحد المسموح به من الغياب خلال هذا الشهر، حيث بلغ عدد أيام غيابه/ا *${absentDays}* يوم.\n\nيرجى العلم بأنه في حال استمرار الغياب قد يؤدي ذلك إلى فصل الطالب/ة من المركز.\n\nمع تحيات إدارة المركز.`;
    const phone = student.phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
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
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{dailyReport.present}</p>
                <p className="text-sm text-green-800 font-semibold">حاضر</p>
              </div>
              <button
                onClick={() => dailyReport.absent > 0 && setIsAbsentModalOpen(true)}
                className={`bg-red-100 p-4 rounded-lg text-center transition-all ${dailyReport.absent > 0 ? 'cursor-pointer hover:bg-red-200' : 'cursor-default'}`}
                disabled={dailyReport.absent === 0}
              >
                <p className="text-3xl font-bold text-red-600">{dailyReport.absent}</p>
                <p className="text-sm text-red-800 font-semibold">غائب</p>
                {dailyReport.absent > 0 && <span className="text-xs text-red-700">(انقر لعرض التفاصيل)</span>}
              </button>
            </div>
          </div>

          <div className="w-full sm:w-auto max-w-xs ml-auto">
            <label htmlFor="month-filter" className="sr-only">اختر الشهر</label>
            <input
              type="month"
              id="month-filter"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Section 2: Most Absent */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-700">الطلاب الأكثر غيابًا - {selectedMonthName}</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="absent-filter" className="text-sm font-medium text-gray-600">عرض من تغيب</label>
                <input
                  id="absent-filter"
                  type="number"
                  min="1"
                  value={absentDaysFilter}
                  onChange={(e) => setAbsentDaysFilter(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-2 py-1 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">يوم فأكثر</span>
              </div>
            </div>

            <div className="space-y-2">
              {monthlyReport.mostAbsent.map((student, index) => (
                <div key={student.student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
                    <UserIcon className="w-5 h-5 mx-2 text-gray-400" />
                    <div className="flex flex-col">
                      <button onClick={() => onViewStudent(student.student.id)} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-right">
                        {student.student.name}
                      </button>
                      <span className="text-xs text-gray-400">{groups.find(g => g.id === student.student.groupId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                      <button onClick={() => handleWhatsAppWarning(student.student, student.absentDays)} className="text-green-500 hover:text-green-600 transition-colors p-1" title="إرسال تنبيه لولي الأمر">
                        <WhatsAppIcon className="w-5 h-5" />
                      </button>
                    )}
                    <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm">{student.absentDays} يوم</span>
                  </div>
                </div>
              ))}
              {monthlyReport.mostAbsent.length === 0 && <p className="text-center text-gray-400 py-4">{`لا يوجد طلاب لديهم غياب ${absentDaysFilter} يوم أو أكثر هذا الشهر.`}</p>}
            </div>
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
