import React, { useMemo } from 'react';
import type { Teacher, TeacherAttendanceRecord } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface TeacherCardProps {
  teacher: Teacher;
  teacherAttendance: TeacherAttendanceRecord[];
  onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus) => void;
  onDeductionClick: (teacherId: string, status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY) => void;
  onClick: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  teacherAttendance,
  onSetTeacherAttendance,
  onDeductionClick,
  onClick,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => {
    return teacherAttendance.find(a => a.teacherId === teacher.id && a.date === today);
  }, [teacherAttendance, teacher.id, today]);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-100 opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-4 cursor-pointer flex-grow"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-200' : 'bg-teal-100'}`}>
              <BriefcaseIcon className={`h-6 w-6 ${teacher.status === TeacherStatus.INACTIVE ? 'text-gray-500' : 'text-teal-600'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${teacher.status === TeacherStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {teacher.status === TeacherStatus.ACTIVE ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.PRESENT)}
              className={`py-2 px-6 rounded-lg font-semibold text-sm transition-all flex-1 ${!todayAttendance || todayAttendance.status === TeacherAttendanceStatus.PRESENT
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
            >
              ✓ حاضر
            </button>
            <button
              onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.ABSENT)}
              className={`py-2 px-6 rounded-lg font-semibold text-sm transition-all flex-1 ${todayAttendance?.status === TeacherAttendanceStatus.ABSENT
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
            >
              ✗ غائب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;