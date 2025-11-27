
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

  const getGroupShortcut = (name: string | undefined) => {
    if (!name) return '';
    if (name.includes('نور البيان')) {
      const match = name.match(/\d+/);
      return match ? `ن${match[0]}` : 'ن';
    }
    if (name.includes('قرآن')) {
      const match = name.match(/\d+/);
      return match ? `ق${match[0]}` : 'ق';
    }
    if (name.includes('تلقين') || name.includes('تقلين')) {
      const match = name.match(/\d+/);
      return match ? `ت${match[0]}` : 'ت';
    }
    return name.substring(0, 2);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md ${student.isArchived ? 'bg-gray-50' : ''}`}>
      <div
        className="p-3"
        onClick={() => !student.isArchived && onViewDetails(student)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !student.isArchived && onViewDetails(student)}
      >
        {/* Line 1: Name and Group Shortcut */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <h3 className="text-base font-bold text-gray-800 truncate">{student.name}</h3>
          </div>
          {groupName && (
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 rounded border border-blue-100 whitespace-nowrap">
              {getGroupShortcut(groupName)}
            </span>
          )}
        </div>

        {/* Line 2: Attendance and Actions */}
        <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Attendance Buttons */}
          <div className="flex gap-1 flex-shrink-0">
            {!student.isArchived ? (
              <>
                <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.PRESENT)} className={`px-3 py-1 rounded text-xs font-bold transition-all border ${todayAttendance?.status === AttendanceStatusEnum.PRESENT ? 'bg-green-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`} aria-label={`تسجيل حضور لـ ${student.name}`}>
                  حاضر
                </button>
                <button onClick={() => onToggleAttendance(student.id, today, AttendanceStatusEnum.ABSENT)} className={`px-3 py-1 rounded text-xs font-bold transition-all border ${todayAttendance?.status === AttendanceStatusEnum.ABSENT ? 'bg-red-600 text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`} aria-label={`تسجيل غياب لـ ${student.name}`}>
                  غائب
                </button>
              </>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="px-3 py-1 rounded text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-all" aria-label={`استعادة ${student.name}`}>
                استعادة
              </button>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors" aria-label={`واتساب ${student.name}`}>
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'fees'); }} className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors" aria-label={`مصروفات ${student.name}`}>
              <CurrencyDollarIcon className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onViewDetails(student, 'tests'); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" aria-label={`اختبارات ${student.name}`}>
              <ClipboardListIcon className="w-4 h-4" />
            </button>

            {!student.isArchived && (
              <button onClick={(e) => { e.stopPropagation(); onArchive(student.id); }} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors" aria-label={`أرشفة ${student.name}`}>
                <ArchiveIcon className="w-4 h-4" />
              </button>
            )}

            {currentUserRole === 'director' && (
              <>
                {!student.isArchived ? (
                  <button onClick={handleEditClick} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" aria-label={`تعديل الطالب ${student.name}`}>
                    <EditIcon className="w-4 h-4" />
                  </button>
                ) : (
                  onDeletePermanently && (
                    <button onClick={(e) => { e.stopPropagation(); onDeletePermanently(student.id); }} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label={`حذف نهائي لـ ${student.name}`}>
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
