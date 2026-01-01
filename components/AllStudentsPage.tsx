import React, { useMemo } from 'react';
import type { Student, Group, AttendanceStatus, WeeklySchedule, TestRecord, GroupType, UserRole } from '../types';
import StudentCard from './StudentCard';

interface AllStudentsPageProps {
  students: Student[];
  groups: Group[];
  searchTerm: string;
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onArchive: (studentId: string) => void;
  currentUserRole: UserRole;
  onViewDetails: (student: Student, tab?: 'attendanceLog' | 'progressPlan' | 'tests' | 'fees' | 'notes' | 'reports') => void;
  typeFilter: GroupType;
  onTypeFilterChange: (filter: GroupType) => void;
  onMarkWeeklyReportSent?: (studentId: string) => void;
}

import { getGroupTypeFromName } from '../services/dataService';

const AllStudentsPage: React.FC<AllStudentsPageProps> = (props) => {
  const { students, searchTerm, groups, currentUserRole, onViewDetails, typeFilter, onTypeFilterChange } = props;

  const [visibleCount, setVisibleCount] = React.useState(20);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students
      .filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(s => {
        if (typeFilter === 'all') return true;
        if (typeFilter === 'orphans') return s.isOrphan === true;
        if (typeFilter === 'with_badges') return s.badges && s.badges.length > 0;
        if (typeFilter === 'invalid_phone') {
          const digits = s.phone ? s.phone.replace(/\D/g, '') : '';
          return !s.phone || digits.length < 12;
        }
        const group = groups.find(g => g.id === s.groupId);
        const groupType = getGroupTypeFromName(group?.name);
        return groupType === typeFilter;
      });

    // Sort by relevance to search term, then by name
    filtered.sort((a, b) => {
      // If filtering by badges, sort by badge count (most badges first)
      if (typeFilter === 'with_badges') {
        const aBadgeCount = a.badges?.length || 0;
        const bBadgeCount = b.badges?.length || 0;
        if (aBadgeCount !== bBadgeCount) {
          return bBadgeCount - aBadgeCount; // Descending order
        }
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aStartsWith = aName.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
      }
      return a.name.localeCompare(b.name, 'ar');
    });

    return filtered;
  }, [students, searchTerm, groups, typeFilter]);

  // Infinite Scroll logic
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 20, filteredAndSortedStudents.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredAndSortedStudents.length]);

  // Reset visibleCount when filters change
  React.useEffect(() => {
    setVisibleCount(20);
  }, [searchTerm, typeFilter]);

  const displayedStudents = useMemo(() => {
    return filteredAndSortedStudents.slice(0, visibleCount);
  }, [filteredAndSortedStudents, visibleCount]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentUserRole === 'director' && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative inline-block w-full sm:w-64">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1 mr-1">تصفية حسب النوع</label>
            <div className="relative">
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => { onTypeFilterChange(e.target.value as GroupType); }}
                className="block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all duration-200 font-bold"
              >
                <option value="all">الكل</option>
                <option value="قرآن">قرآن</option>
                <option value="نور بيان">نور بيان</option>
                <option value="تلقين">تلقين</option>
                <option value="إقراء">إقراء</option>
                <option value="orphans">أيتام</option>
                <option value="with_badges">🏆 طلاب الأوسمة</option>
                <option value="invalid_phone"> هواتف غير مكتملة</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>


        </div>
      )}

      {/* Show count for non-directors too if useful, or keep it consistent */}
      {currentUserRole !== 'director' && filteredAndSortedStudents.length > 0 && (
        <div className="mb-4 text-left">
          <span className="text-gray-500 text-sm ml-2">عدد الطلاب:</span>
          <span className="font-bold text-gray-800">{filteredAndSortedStudents.length}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedStudents.length > 0 ? (
          displayedStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              groupName={groups.find(g => g.id === student.groupId)?.name}
              onOpenFeeModal={props.onOpenFeeModal}
              onEdit={props.onEdit}
              onToggleAttendance={props.onToggleAttendance}
              onArchive={props.onArchive}
              currentUserRole={props.currentUserRole}
              onViewDetails={onViewDetails}
              onMarkWeeklyReportSent={props.onMarkWeeklyReportSent}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-gray-600">لا يوجد طلاب</h2>
            <p className="text-gray-400 mt-2">{searchTerm || typeFilter !== 'all' ? `لم يتم العثور على طلاب يطابقون معايير التصفية.` : "لا يوجد طلاب نشطون لعرضهم."}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default React.memo(AllStudentsPage);
