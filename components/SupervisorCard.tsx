
import React, { useMemo } from 'react';
import type { Supervisor, TeacherAttendanceRecord } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import UserIcon from './icons/UserIcon';

interface SupervisorCardProps {
  supervisor: Supervisor;
  teacherAttendance: TeacherAttendanceRecord[];
  onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus) => void;
  onDeductionClick: (teacherId: string, status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY) => void;
  onClick: () => void;
}

const SupervisorCard: React.FC<SupervisorCardProps> = ({
  supervisor,
  teacherAttendance,
  onSetTeacherAttendance,
  onDeductionClick,
  onClick,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => {
    return teacherAttendance.find(a => a.teacherId === supervisor.id && a.date === today);
  }, [teacherAttendance, supervisor.id, today]);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${supervisor.status === TeacherStatus.INACTIVE ? 'bg-gray-100 opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-4 cursor-pointer flex-grow"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${supervisor.status === TeacherStatus.INACTIVE ? 'bg-gray-200' : 'bg-blue-100'}`}>
              <UserIcon className={`h-6 w-6 ${supervisor.status === TeacherStatus.INACTIVE ? 'text-gray-500' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{supervisor.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(supervisor.section) ? supervisor.section : [supervisor.section]).map((sec, idx) => (
                  <span key={idx} className="inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSetTeacherAttendance(supervisor.id, today, TeacherAttendanceStatus.PRESENT)}
              className={`py-2 px-6 rounded-lg font-semibold text-sm transition-all flex-1 ${!todayAttendance || todayAttendance.status === TeacherAttendanceStatus.PRESENT
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                }`}
            >
              ✓ حاضر
            </button>
            <button
              onClick={() => onSetTeacherAttendance(supervisor.id, today, TeacherAttendanceStatus.ABSENT)}
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

export default SupervisorCard;
