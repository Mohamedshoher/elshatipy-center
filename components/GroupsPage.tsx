
import React, { useState, useMemo } from 'react';
import type { Student, Group, Teacher, Note, AttendanceStatus, WeeklySchedule, TestRecord, UserRole } from '../types';
import StudentCard from './StudentCard';
import ChartBarIcon from './icons/ChartBarIcon';

interface GroupsPageProps {
  students: Student[];
  groups: Group[];
  teachers: Teacher[];
  notes: Note[];
  searchTerm: string;
  onViewGroupReport: (groupId: string) => void;
  onViewStudents: (group: Group) => void;
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
  onDeleteTest: (studentId: string, testId: string) => void;
  onAddNote: (studentId: string, content: string) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onArchive: (studentId: string) => void;
  currentUserRole: UserRole;
  onViewDetails: (student: Student, tab?: 'fees' | 'tests' | 'attendanceLog') => void;
  onMarkWeeklyReportSent?: (studentId: string) => void;
}

type GroupType = 'all' | 'قرآن' | 'نور بيان' | 'تلقين' | 'إقراء';
import { getGroupTypeFromName } from '../services/dataService';

const GroupsPage: React.FC<GroupsPageProps> = (props) => {
  const { students, groups, teachers, searchTerm, onViewGroupReport, onViewStudents, onViewDetails } = props;
  const [typeFilter, setTypeFilter] = useState<GroupType>('all');

  const filteredGroups = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return groups
      .filter(group => {
        const nameMatch = !searchTerm || group.name.toLowerCase().includes(searchTermLower);
        const groupType = getGroupTypeFromName(group.name);
        const typeMatch = typeFilter === 'all' || groupType === typeFilter;
        return nameMatch && typeMatch;
      })
      .sort((a, b) => {
        if (searchTerm) {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const aStartsWith = aName.startsWith(searchTermLower);
          const bStartsWith = bName.startsWith(searchTermLower);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
        }
        return a.name.localeCompare(b.name, 'ar');
      });
  }, [groups, searchTerm, typeFilter]);

  // Pre-index students by group for performance O(S)
  const studentsByGroup = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach(s => {
      if (!s.isArchived) {
        map[s.groupId] = (map[s.groupId] || 0) + 1;
      }
    });
    return map;
  }, [students]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center sm:justify-start mb-6">
        <div className="relative inline-block w-full sm:w-64">
          <label htmlFor="group-type-filter" className="block text-sm font-medium text-gray-700 mb-1 mr-1">تصفية حسب النوع</label>
          <div className="relative">
            <select
              id="group-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as GroupType)}
              className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all duration-200 font-bold"
            >
              <option value="all">الكل</option>
              <option value="قرآن">قرآن</option>
              <option value="نور بيان">نور بيان</option>
              <option value="تلقين">تلقين</option>
              <option value="إقراء">إقراء</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => {
            const studentCount = studentsByGroup[group.id] || 0;
            const teacher = teachers.find(t => t.id === group.teacherId);

            return (
              <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 h-full"
                  onClick={() => onViewStudents(group)}
                  role="button"
                >
                  <div className="flex items-center min-w-0">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center truncate">
                        <span className="truncate">{group.name}</span>
                        <span className={`text-base font-normal rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ${studentCount < 30 ? 'bg-red-100 text-red-700' :
                            studentCount < 35 ? 'bg-blue-100 text-blue-700' :
                              studentCount < 40 ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                          }`}>{studentCount}</span>
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
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-xl shadow mx-auto w-full mt-8">
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

export default React.memo(GroupsPage);
