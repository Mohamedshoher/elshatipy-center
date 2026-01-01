
import React from 'react';
import type { Student, AttendanceStatus, UserRole } from '../types';
import { AttendanceStatus as AttendanceStatusEnum } from '../types';
import UserIcon from './icons/UserIcon';
import PhoneIcon from './icons/PhoneIcon';
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
  currentUserRole: UserRole;
  onViewDetails: (student: Student, tab?: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports' | 'badges') => void;
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

  /* Optimistic UI state */
  const [optimisticStatus, setOptimisticStatus] = React.useState<AttendanceStatus | undefined>(todayAttendance?.status);

  React.useEffect(() => {
    setOptimisticStatus(todayAttendance?.status);
  }, [todayAttendance?.status]);

  const handleAttendanceClick = (status: AttendanceStatus) => {
    setOptimisticStatus(status);
    onToggleAttendance(student.id, today, status);
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
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`${student.name.length > 25 ? 'text-base' : (student.name.length > 18 ? 'text-lg' : 'text-xl')} font-bold text-gray-800 truncate`}>{student.name}</h3>
                  {student.badges && student.badges.length > 0 && (
                    <div className="flex -space-x-1 overflow-hidden" dir="ltr">
                      {student.badges.slice(0, 3).map((badge) => (
                        <span key={badge.id} title={badge.title} className="inline-block bg-yellow-50 rounded-full text-[10px] w-5 h-5 flex items-center justify-center border border-yellow-100 shadow-xs">
                          {badge.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
                  <button onClick={() => handleAttendanceClick(AttendanceStatusEnum.PRESENT)} className={`py-1 px-3 rounded-full font-semibold text-sm transition-all border ${optimisticStatus === AttendanceStatusEnum.PRESENT ? 'bg-green-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل حضور لـ ${student.name}`}>
                    حاضر
                  </button>
                  <button onClick={() => handleAttendanceClick(AttendanceStatusEnum.ABSENT)} className={`py-1 px-3 rounded-full font-semibold text-sm transition-all border ${optimisticStatus === AttendanceStatusEnum.ABSENT ? 'bg-red-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل غياب لـ ${student.name}`}>
                    غياب
                  </button>
                </>
              ) : (
                <>
                  {currentUserRole !== 'teacher' && (
                    <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="py-1 px-3 rounded-full font-semibold text-sm bg-green-600 text-white shadow hover:bg-green-700 transition-all" aria-label={`استعادة ${student.name}`}>
                      استعادة
                    </button>
                  )}
                  {currentUserRole === 'director' && onDeletePermanently && (
                    <button onClick={(e) => { e.stopPropagation(); onDeletePermanently(student.id); }} className="p-2 rounded-full font-semibold text-sm bg-red-100 text-red-600 shadow hover:bg-red-200 transition-all" aria-label={`حذف نهائي لـ ${student.name}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-x-1 sm:gap-x-2 flex-shrink-0">
              {currentUserRole === 'director' && (
                <a
                  href={`tel:${student.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title={`اتصال بـ ${student.name}`}
                >
                  <PhoneIcon className="w-5 h-5" />
                </a>
              )}
              {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    let phone = student.phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
                    if (phone.startsWith('1') && phone.length === 10) phone = '20' + phone;
                    window.open(`https://wa.me/${phone}`, '_blank');
                  }}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                  title={`دردشة واتساب مع ${student.name}`}
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </button>
              )}
              <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'fees'); }} className="p-1 text-gray-400 hover:text-yellow-500 transition-colors" aria-label={`مصروفات ${student.name}`}>
                <CurrencyDollarIcon className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'tests'); }} className="p-1 text-gray-400 hover:text-indigo-500 transition-colors" aria-label={`اختبارات ${student.name}`}>
                <ClipboardListIcon className="w-5 h-5" />
              </button>
              {!student.isArchived ? (
                currentUserRole !== 'teacher' && (
                  <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="p-1 text-gray-400 hover:text-orange-500 transition-colors" aria-label={`أرشفة ${student.name}`}>
                    <ArchiveIcon className="w-5 h-5" />
                  </button>
                )
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

export default React.memo(StudentCard);
