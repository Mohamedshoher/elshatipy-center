
import React, { useState, useMemo } from 'react';
import type { Student, Group, Teacher, Note, AttendanceStatus, WeeklySchedule, TestRecord } from '../types';
import StudentCard from './StudentCard';
import ChartBarIcon from './icons/ChartBarIcon';

interface GroupsPageProps {
  students: Student[];
  groups: Group[];
  teachers: Teacher[];
  notes: Note[];
  searchTerm: string;
  onViewGroupReport: (groupId: string) => void;
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
  onDeleteTest: (studentId: string, testId: string) => void;
  onAddNote: (studentId: string, content: string) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onArchive: (studentId: string) => void;
  currentUserRole: 'director' | 'teacher' | 'supervisor';
  onViewDetails: (student: Student, tab?: 'fees' | 'tests' | 'attendanceLog') => void;
}

type GroupType = 'all' | 'قرآن' | 'نور بيان' | 'تلقين';

const getGroupTypeFromName = (name: string): GroupType | null => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('قرآن')) return 'قرآن';
  if (lowerName.includes('نور بيان')) return 'نور بيان';
  if (lowerName.includes('تلقين') || lowerName.includes('تقلين')) return 'تلقين';
  return null;
};

const GroupsPage: React.FC<GroupsPageProps> = (props) => {
  const { students, groups, teachers, searchTerm, onViewGroupReport, onViewDetails } = props;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<GroupType>('all');

  const handleToggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const filteredGroups = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return groups
      .filter(group => {
        const nameMatch = !searchTerm || group.name.toLowerCase().includes(searchTermLower);
        const groupType = getGroupTypeFromName(group.name);
        const typeMatch = typeFilter === 'all' || groupType === typeFilter;
        return nameMatch && typeMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [groups, searchTerm, typeFilter]);

  const getFilterButtonClass = (filter: GroupType) => {
    const base = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex-grow sm:flex-grow-0";
    return typeFilter === filter ? `${base} bg-blue-600 text-white shadow` : `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-xl shadow-sm">
         <button onClick={() => setTypeFilter('all')} className={getFilterButtonClass('all')}>الكل</button>
         <button onClick={() => setTypeFilter('قرآن')} className={getFilterButtonClass('قرآن')}>قرآن</button>
         <button onClick={() => setTypeFilter('نور بيان')} className={getFilterButtonClass('نور بيان')}>نور بيان</button>
         <button onClick={() => setTypeFilter('تلقين')} className={getFilterButtonClass('تلقين')}>تلقين</button>
      </div>
      
      <div className="space-y-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => {
            const studentsInGroup = students.filter(s => s.groupId === group.id);
            const teacher = teachers.find(t => t.id === group.teacherId);
            const isExpanded = expandedGroups.has(group.id);

            return (
              <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleToggleGroupExpansion(group.id)}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center min-w-0">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center truncate">
                        <span className="truncate">{group.name}</span>
                        <span className="text-base font-normal bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">{studentsInGroup.length}</span>
                      </h2>
                      {teacher && <p className="text-sm text-gray-500 font-semibold mt-1">{`المدرس: ${teacher.name}`}</p>}
                    </div>
                  </div>
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
                          onOpenFeeModal={props.onOpenFeeModal}
                          onEdit={props.onEdit}
                          onToggleAttendance={props.onToggleAttendance}
                          onArchive={props.onArchive}
                          currentUserRole={props.currentUserRole}
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
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow mx-auto max-w-3xl mt-8">
            <h2 className="text-2xl font-semibold text-gray-600">
              {searchTerm || typeFilter !== 'all' ? "لا توجد مجموعات تطابق البحث" : "لا توجد مجموعات لعرضها"}
            </h2>
            <p className="text-gray-400 mt-2">
              {searchTerm || typeFilter !== 'all'
                ? "لم يتم العثور على مجموعات تطابق معايير البحث."
                : "يمكنك إضافة مجموعات جديدة من القائمة الجانبية."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default GroupsPage;
