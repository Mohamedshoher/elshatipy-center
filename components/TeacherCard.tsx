import React, { useMemo } from 'react';
import type { Teacher, TeacherAttendanceRecord, Student, Group, TeacherCollectionRecord } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';

interface TeacherCardProps {
  teacher: Teacher;
  teacherAttendance: TeacherAttendanceRecord[];
  students: Student[];
  groups: Group[];
  teacherCollections: TeacherCollectionRecord[];
  onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus) => void;
  onDeductionClick: (teacherId: string, status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY) => void;
  onClick: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  teacherAttendance,
  students,
  groups,
  teacherCollections,
  onSetTeacherAttendance,
  onDeductionClick,
  onClick,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().substring(0, 7);

  const todayAttendance = useMemo(() => {
    return teacherAttendance.find(a => a.teacherId === teacher.id && a.date === today);
  }, [teacherAttendance, teacher.id, today]);

  const financialData = useMemo(() => {
    const teacherGroupIds = groups.filter(g => g.teacherId === teacher.id).map(g => g.id);
    const studentsInGroups = students.filter(s => teacherGroupIds.includes(s.groupId));

    const totalCollectedByTeacher = studentsInGroups
      .flatMap(s => s.fees)
      .filter(f => f.month === currentMonth && f.paid && f.amountPaid)
      .reduce((sum, f) => sum + (f.amountPaid || 0), 0);

    const collectionsForMonth = teacherCollections.filter(c => c.teacherId === teacher.id && c.month === currentMonth);
    const totalHandedOver = collectionsForMonth.reduce((sum, c) => sum + c.amount, 0);
    const remainingBalance = totalCollectedByTeacher - totalHandedOver;

    return { totalCollectedByTeacher, totalHandedOver, remainingBalance };
  }, [teacher.id, groups, students, teacherCollections, currentMonth]);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-100 opacity-70' : ''}`}>
      <div className="p-4">
        <div className="flex flex-col gap-4">

          {/* Line 1: Teacher Name + Financial Summary */}
          <div
            className="cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${teacher.status === TeacherStatus.INACTIVE ? 'bg-gray-200' : 'bg-teal-100'}`}>
                <BriefcaseIcon className={`h-5 w-5 ${teacher.status === TeacherStatus.INACTIVE ? 'text-gray-500' : 'text-teal-600'}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
            </div>

            {/* Financial Summary */}
            <div className="flex gap-4 text-xs mr-13">
              <div>
                <span className="text-gray-500">المحصل: </span>
                <span className="font-bold text-green-600">{financialData.totalCollectedByTeacher.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">المسلم: </span>
                <span className="font-bold text-blue-600">{financialData.totalHandedOver.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">المتبقي: </span>
                <span className="font-bold text-orange-600">{financialData.remainingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Line 2: Attendance Buttons + Status */}
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

            {/* Status (Left) */}
            <div className="flex items-center gap-3">
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${teacher.status === TeacherStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {teacher.status === TeacherStatus.ACTIVE ? 'نشط' : 'غير نشط'}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;