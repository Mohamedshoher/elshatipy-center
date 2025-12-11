
import React from 'react';
import type { Student, AttendanceStatus } from '../types';
import { AttendanceStatus as AttendanceStatusEnum } from '../types';
import UserIcon from './icons/UserIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import EditIcon from './icons/EditIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import TrashIcon from './icons/TrashIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { TestType as TestTypeEnum, TestGrade as TestGradeEnum } from '../types';

interface StudentCardProps {
  student: Student;
  groupName?: string;
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onArchive: (studentId: string) => void;
  currentUserRole: 'director' | 'teacher' | 'supervisor';
  onViewDetails: (student: Student, tab?: 'fees' | 'tests' | 'attendanceLog') => void;
  onDeletePermanently?: (studentId: string) => void;
  onMarkWeeklyReportSent?: (studentId: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, groupName, onEdit, onToggleAttendance, onArchive, currentUserRole, onViewDetails, onDeletePermanently, onMarkWeeklyReportSent }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = student.attendance.find(a => a.date === today);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(student);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${student.isArchived ? 'bg-gray-100' : ''}`}>
      <div
        className="p-4"
        onClick={() => !student.isArchived && onViewDetails(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !student.isArchived && onViewDetails(student)}
      >
        <div className="flex flex-col gap-2">

          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <UserIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div className="flex items-baseline gap-3 min-w-0 flex-1">
                <h3 className={`${student.name.length > 25 ? 'text-base' : (student.name.length > 18 ? 'text-lg' : 'text-xl')} font-bold text-gray-800`}>{student.name}</h3>
                {groupName && (
                  <span className="text-xs text-gray-500 whitespace-nowrap mr-auto">{groupName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between flex-nowrap" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 flex-shrink-0">
              {!student.isArchived ? (
                <>
                  <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.PRESENT)} className={`py-1 px-3 rounded-full font-semibold text-sm transition-all border ${todayAttendance?.status === AttendanceStatusEnum.PRESENT ? 'bg-green-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل حضور لـ ${student.name}`}>
                    حاضر
                  </button>
                  <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.ABSENT)} className={`py-1 px-3 rounded-full font-semibold text-sm transition-all border ${todayAttendance?.status === AttendanceStatusEnum.ABSENT ? 'bg-red-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل غياب لـ ${student.name}`}>
                    غياب
                  </button>
                </>
              ) : (
                <>
                  <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="py-1 px-3 rounded-full font-semibold text-sm bg-green-600 text-white shadow hover:bg-green-700 transition-all" aria-label={`استعادة ${student.name}`}>
                    استعادة
                  </button>
                  {currentUserRole === 'director' && onDeletePermanently && (
                    <button onClick={(e) => { e.stopPropagation(); onDeletePermanently(student.id); }} className="p-2 rounded-full font-semibold text-sm bg-red-100 text-red-600 shadow hover:bg-red-200 transition-all" aria-label={`حذف نهائي لـ ${student.name}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
              {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                (() => {
                  const now = new Date();
                  const day = now.getDay();
                  const dayIndex = (day + 1) % 7;
                  const startOfWeek = new Date(now);
                  startOfWeek.setDate(now.getDate() - dayIndex);
                  startOfWeek.setHours(0, 0, 0, 0);

                  const isSent = student.lastWeeklyReportDate && new Date(student.lastWeeklyReportDate) >= startOfWeek;

                  const handleWhatsAppClick = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (isSent) return;

                    // Calculate Stats
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);

                    const filterFn = (dateStr: string) => {
                      const d = new Date(dateStr);
                      return d >= startOfWeek && d <= endOfWeek;
                    };

                    const attendanceRecords = (student.attendance || []).filter(a => filterFn(a.date));
                    const present = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.PRESENT).length;
                    const absent = attendanceRecords.filter(a => a.status === AttendanceStatusEnum.ABSENT).length;

                    const testsInPeriod = (student.tests || []).filter(test => filterFn(test.date));

                    // Construct Message
                    const gradeMap: Record<string, string> = {
                      [TestGradeEnum.EXCELLENT]: 'ممتاز',
                      [TestGradeEnum.VERY_GOOD]: 'جيد جداً',
                      [TestGradeEnum.GOOD]: 'جيد',
                      [TestGradeEnum.REPEAT]: 'إعادة',
                    };

                    let message = `مرحباً ولي أمر الطالب/ة: *${student.name}*\n`;
                    message += `هذا هو التقرير الأسبوعي من مركز الشاطبي:\n\n`;
                    message += `*📝 الحضور والغياب:*\n`;
                    message += `  - أيام الحضور: ${present}\n`;
                    message += `  - أيام الغياب: ${absent}\n\n`;

                    message += `*📖 الاختبارات:*\n`;
                    if (testsInPeriod.length > 0) {
                      const latestNew = testsInPeriod.find(t => t.type === TestTypeEnum.NEW);
                      const latestRecent = testsInPeriod.find(t => t.type === TestTypeEnum.RECENT_PAST);
                      const latestDistant = testsInPeriod.find(t => t.type === TestTypeEnum.DISTANT_PAST);

                      if (latestNew) message += `  - الجديد: ${latestNew.suraName} / ${gradeMap[latestNew.grade] || ''}\n`;
                      if (latestRecent) message += `  - الماضي القريب: ${latestRecent.suraName} / ${gradeMap[latestRecent.grade] || ''}\n`;
                      if (latestDistant) message += `  - الماضي البعيد: ${latestDistant.suraName} / ${gradeMap[latestDistant.grade] || ''}\n`;
                    } else {
                      message += `  - لم تسجل اختبارات هذا الأسبوع.\n`;
                    }


                    message += `\nمع تحيات إدارة المركز.`;

                    const phone = student.phone.replace(/[^0-9]/g, '');
                    const encodedMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

                    if (onMarkWeeklyReportSent) {
                      onMarkWeeklyReportSent(student.id);
                    }
                  };

                  return (
                    <button
                      onClick={handleWhatsAppClick}
                      className={`p-1 transition-colors ${isSent ? 'text-green-600 cursor-default' : 'text-green-500 hover:text-green-600'}`}
                      title={isSent ? "تم إرسال التقرير الأسبوعي" : "إرسال التقرير الأسبوعي"}
                      disabled={!!isSent}
                    >
                      {isSent ? <CheckCircleIcon className="w-5 h-5" /> : <WhatsAppIcon className="w-5 h-5" />}
                    </button>
                  );
                })()
              )}
              <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'fees'); }} className="p-1 text-gray-400 hover:text-yellow-500 transition-colors" aria-label={`مصروفات ${student.name}`}>
                <CurrencyDollarIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'tests'); }} className="p-1 text-gray-400 hover:text-indigo-500 transition-colors" aria-label={`اختبارات ${student.name}`}>
                <ClipboardListIcon className="w-5 h-5" />
              </button>
              {!student.isArchived ? (
                <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="p-1 text-gray-400 hover:text-orange-500 transition-colors" aria-label={`أرشفة ${student.name}`}>
                  <ArchiveIcon className="w-5 h-5" />
                </button>
              ) : null}
              {currentUserRole === 'director' && (
                <button onClick={handleEditClick} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" aria-label={`تعديل الطالب ${student.name}`}>
                  <EditIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
