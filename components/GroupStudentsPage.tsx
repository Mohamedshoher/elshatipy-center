
import React, { useMemo } from 'react';
import type { Student, Group, TestRecord, AttendanceStatus, Teacher, UserRole } from '../types';
import StudentCard from './StudentCard';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface GroupStudentsPageProps {
    group: Group;
    students: Student[];
    teachers: Teacher[];
    onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
    onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
    onDeleteTest: (studentId: string, testId: string) => void;
    onAddNote: (studentId: string, content: string) => void;
    onEdit: (student: Student) => void;
    onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
    onArchive: (studentId: string) => void;
    currentUserRole?: UserRole;
    onViewDetails: (student: Student) => void;
    onMarkWeeklyReportSent?: (studentId: string) => void;
    onBack: () => void;
}

const GroupStudentsPage = React.memo(({
    group,
    students,
    teachers,
    onOpenFeeModal,
    onAddTest,
    onDeleteTest,
    onAddNote,
    onEdit,
    onToggleAttendance,
    onArchive,
    currentUserRole,
    onViewDetails,
    onMarkWeeklyReportSent,
    onBack
}: GroupStudentsPageProps) => {
    const teacher = teachers.find(t => t.id === group.teacherId);

    // Sort students alphabetically by name
    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    }, [students]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        aria-label="Back"
                    >
                        <ArrowRightIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{group.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                {students.length} طالب
                            </span>
                            {teacher && (
                                <span className="text-sm text-gray-500 font-semibold">
                                    المدرس: {teacher.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="container mx-auto px-4 py-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {sortedStudents.length > 0 ? (
                        sortedStudents.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                groupName={group.name}
                                onOpenFeeModal={onOpenFeeModal}
                                onEdit={onEdit}
                                onToggleAttendance={onToggleAttendance}
                                onArchive={onArchive}
                                currentUserRole={currentUserRole || 'teacher'}
                                onViewDetails={onViewDetails}
                                onMarkWeeklyReportSent={onMarkWeeklyReportSent}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500 text-lg">لا يوجد طلاب في هذه المجموعة.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
});

export default GroupStudentsPage;
