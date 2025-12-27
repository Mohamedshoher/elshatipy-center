import React, { useMemo } from 'react';
import type { Teacher, TeacherAttendanceRecord } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PhoneIcon from './icons/PhoneIcon';

interface TeacherCardProps {
  teacher: Teacher;
  teacherAttendance: TeacherAttendanceRecord[];
  onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus) => void;
  onDeductionClick: (teacherId: string, status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY) => void;
  onClick: () => void;
}

const TeacherCard = React.memo(({
  teacher,
  teacherAttendance,
  onSetTeacherAttendance,
  onDeductionClick,
  onClick,
}: TeacherCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => {
    return teacherAttendance.find(a => a.teacherId === teacher.id && a.date === today);
  }, [teacherAttendance, teacher.id, today]);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-100 opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex flex-col gap-4">

          {/* Line 1: Teacher Name */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-200' : 'bg-teal-100'}`}>
              <BriefcaseIcon className={`h-5 w-5 ${teacher.status === TeacherStatus.INACTIVE ? 'text-gray-500' : 'text-teal-600'}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
          </div>

          {/* Line 2: Attendance Buttons + Phone + Status */}
          <div className="flex flex-wrap items-center justify-between gap-y-2" onClick={(e) => e.stopPropagation()}>

            {/* Attendance Buttons (Right) */}
            <div className="flex gap-2">
              <button
                onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.PRESENT)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-all border ${!todayAttendance || todayAttendance.status === TeacherAttendanceStatus.PRESENT
                  ? 'bg-green-600 text-white border-transparent shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                ✓ حاضر
              </button>
              <button
                onClick={() => onSetTeacherAttendance(teacher.id, today, TeacherAttendanceStatus.ABSENT)}
                className={`py-1 px-4 rounded-full font-semibold text-sm transition-all border ${todayAttendance?.status === TeacherAttendanceStatus.ABSENT
                  ? 'bg-red-600 text-white border-transparent shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                ✗ غائب
              </button>
            </div>

            {/* Phone & Status (Left) */}
            <div className="flex items-center gap-3">
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${teacher.status === TeacherStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {teacher.status === TeacherStatus.ACTIVE ? 'نشط' : 'غير نشط'}
              </span>
              <a href={`tel:${teacher.phone}`} onClick={(e) => e.stopPropagation()} className="p-2 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-colors" title="اتصال">
                <PhoneIcon className="w-5 h-5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

export default TeacherCard;