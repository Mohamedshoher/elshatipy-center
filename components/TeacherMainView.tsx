
import React, { useState, useMemo } from 'react';
import type { Student, Group, Note, AttendanceStatus, WeeklySchedule, TestRecord } from '../types';
import StudentCard from './StudentCard';
import ChartBarIcon from './icons/ChartBarIcon';

interface TeacherMainViewProps {
  visibleGroups: Group[];
  activeStudents: Student[];
  notes: Note[];
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
  onAddNote: (studentId: string, content: string) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onUpdateStudentSchedule: (studentId: string, schedule: WeeklySchedule[]) => void;
  onArchive: (studentId: string) => void;
  onViewGroupReport: (groupId: string) => void;
  currentUserRole: 'teacher';
  onViewDetails: (student: Student, tab?: 'fees' | 'tests' | 'attendanceLog') => void;
}

const TeacherMainView: React.FC<TeacherMainViewProps> = (props) => {
  const { visibleGroups, activeStudents, notes, onOpenFeeModal, onAddTest, onAddNote, onEdit, onToggleAttendance, onUpdateStudentSchedule, onArchive, onViewGroupReport, currentUserRole, onViewDetails } = props;

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const sortedGroups = useMemo(() =>
    [...visibleGroups].sort((a, b) => a.name.localeCompare(b.name, 'ar')),
    [visibleGroups]);

  const handleToggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      newSet.has(groupId) ? newSet.delete(groupId) : newSet.add(groupId);
      return newSet;
    });
  };

  if (visibleGroups.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow mx-auto max-w-3xl mt-8">
        <h2 className="text-2xl font-semibold text-gray-600">لا توجد مجموعات لعرضها.</h2>
        <p className="text-gray-400 mt-2">لم يتم تعيينك لأي مجموعة حتى الآن.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-row-reverse gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-2 bg-white p-4 rounded-xl shadow-md">
            <h3 className="font-bold text-lg text-gray-800 px-2 pb-2 border-b">مجموعاتي</h3>
            <nav className="max-h-[70vh] overflow-y-auto">
              <ul>
                {sortedGroups.map(group => (
                  <li key={group.id}>
                    <a
                      href={`#group-${group.id}`}
                      className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
                    >
                      {group.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">
            {sortedGroups.map(group => {
              const studentsInGroup = activeStudents.filter(s => s.groupId === group.id && !s.isArchived);
              const isExpanded = expandedGroups.has(group.id);
              return (
                <div
                  key={group.id}
                  id={`group-${group.id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg scroll-mt-24"
                >
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handleToggleGroupExpansion(group.id)}
                  >
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center truncate">
                      <span className="truncate">{group.name}</span>
                      <span className="text-base font-normal bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">{studentsInGroup.length}</span>
                    </h2>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewGroupReport(group.id); }}
                        className="flex items-center gap-2 bg-indigo-100 text-indigo-700 font-bold py-2 px-3 rounded-lg shadow-sm hover:bg-indigo-200 transition-all duration-200"
                        title="عرض تقرير المجموعة"
                      >
                        <ChartBarIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">تقرير</span>
                      </button>
                      <svg className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[3000px]' : 'max-h-0'}`}>
                    <div className="p-4 pt-0">
                      <div className="border-t border-gray-200 pt-4 space-y-6">
                        {studentsInGroup.length > 0 ? studentsInGroup.sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(student => (
                          <StudentCard
                            key={student.id}
                            student={student}
                            groupName={group.name}
                            onOpenFeeModal={onOpenFeeModal}
                            onEdit={onEdit}
                            onToggleAttendance={onToggleAttendance}
                            onArchive={onArchive}
                            currentUserRole={currentUserRole}
                            onViewDetails={onViewDetails}
                          />
                        )) : (
                          <p className="text-gray-500 py-4 px-2 text-center">لا يوجد طلاب في هذه المجموعة بعد.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherMainView;
