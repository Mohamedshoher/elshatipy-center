
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
}

const StudentCard: React.FC<StudentCardProps> = ({ student, groupName, onEdit, onToggleAttendance, onArchive, currentUserRole, onViewDetails, onDeletePermanently }) => {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <UserIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 truncate">{student.name}</h3>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap items-center justify-start sm:justify-end gap-x-4 gap-y-2" onClick={(e) => e.stopPropagation()}>
            {groupName && <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md order-3 sm:order-1">{groupName}</span>}

            <div className="flex gap-2 order-1 sm:order-2">
              {!student.isArchived ? (
                <>
                  <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.PRESENT)} className={`py-1 px-4 rounded-full font-semibold text-sm transition-all border ${todayAttendance?.status === AttendanceStatusEnum.PRESENT ? 'bg-green-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل حضور لـ ${student.name}`}>
                    حاضر
                  </button>
                  <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.ABSENT)} className={`py-1 px-4 rounded-full font-semibold text-sm transition-all border ${todayAttendance?.status === AttendanceStatusEnum.ABSENT ? 'bg-red-600 text-white border-transparent shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} aria-label={`تسجيل غياب لـ ${student.name}`}>
                    غياب
                  </button>
                </>
              ) : (
                <>
                  <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="py-1 px-4 rounded-full font-semibold text-sm bg-green-600 text-white shadow hover:bg-green-700 transition-all" aria-label={`استعادة ${student.name}`}>
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

            <div className="flex items-center flex-shrink-0 gap-x-2 order-2 sm:order-3">
              <a href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 text-green-500 hover:text-green-600 transition-colors" aria-label={`واتساب ${student.name}`}>
                <WhatsAppIcon className="w-5 h-5" />
              </a>
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
