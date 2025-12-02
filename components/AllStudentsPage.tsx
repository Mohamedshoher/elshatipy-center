
import React, { useMemo, useState } from 'react';
import type { Student, Note, Group, AttendanceStatus, WeeklySchedule, TestRecord, GroupType } from '../types';
import StudentCard from './StudentCard';

interface AllStudentsPageProps {
  students: Student[];
  notes: Note[];
  groups: Group[];
  searchTerm: string;
  onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
  onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
  onDeleteTest: (studentId: string, testId: string) => void;
  onAddNote: (studentId: string, content: string) => void;
  onEdit: (student: Student) => void;
  onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
  onArchive: (studentId: string) => void;
  currentUserRole: 'director' | 'teacher' | 'supervisor';
  onViewDetails: (student: Student, tab?: 'fees' | 'tests' | 'attendanceLog') => void;
  typeFilter: GroupType;
  onTypeFilterChange: (filter: GroupType) => void;
}

const getGroupTypeFromName = (name: string | undefined): GroupType | null => {
  if (!name) return null;
  const lowerName = name.toLowerCase();
  if (lowerName.includes('قرآن')) return 'قرآن';
  if (lowerName.includes('نور بيان')) return 'نور بيان';
  if (lowerName.includes('تلقين') || lowerName.includes('تقلين')) return 'تلقين';
  return null;
};

const AllStudentsPage: React.FC<AllStudentsPageProps> = (props) => {
  const { students, searchTerm, groups, currentUserRole, onViewDetails, typeFilter, onTypeFilterChange } = props;

  const [groupFilter, setGroupFilter] = useState('all');

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students
      .filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(s => {
        if (groupFilter === 'all') return true;
        return s.groupId === groupFilter;
      })
      .filter(s => {
        if (typeFilter === 'all') return true;
        const group = groups.find(g => g.id === s.groupId);
        const groupType = getGroupTypeFromName(group?.name);
        return groupType === typeFilter;
      });

    // Sort by relevance to search term, then by name
    filtered.sort((a, b) => {
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
  }, [students, searchTerm, groups, groupFilter, typeFilter]);

  const getFilterButtonClass = (filter: GroupType) => {
    const base = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex-grow sm:flex-grow-0";
    return typeFilter === filter ? `${base} bg-blue-600 text-white shadow` : `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentUserRole === 'director' && (
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-xl shadow-sm">
          <button onClick={() => { onTypeFilterChange('all'); setGroupFilter('all'); }} className={getFilterButtonClass('all')}>الكل</button>
          <button onClick={() => { onTypeFilterChange('قرآن'); setGroupFilter('all'); }} className={getFilterButtonClass('قرآن')}>قرآن</button>
          <button onClick={() => { onTypeFilterChange('نور بيان'); setGroupFilter('all'); }} className={getFilterButtonClass('نور بيان')}>نور بيان</button>
          <button onClick={() => { onTypeFilterChange('تلقين'); setGroupFilter('all'); }} className={getFilterButtonClass('تلقين')}>تلقين</button>
        </div>
      )}

      <div className="space-y-6">
        {filteredAndSortedStudents.length > 0 ? (
          filteredAndSortedStudents.map(student => (
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
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-gray-600">لا يوجد طلاب</h2>
            <p className="text-gray-400 mt-2">{searchTerm || groupFilter !== 'all' || typeFilter !== 'all' ? `لم يتم العثور على طلاب يطابقون معايير التصفية.` : "لا يوجد طلاب نشطون لعرضهم."}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AllStudentsPage;
