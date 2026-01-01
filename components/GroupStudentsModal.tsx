import React from 'react';
import type { Student, Group, TestRecord, AttendanceStatus } from '../types';
import StudentCard from './StudentCard';
import XIcon from './icons/XIcon';

interface GroupStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group | null;
    students: Student[];
    onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
    onAddTest: (studentId: string, testData: Omit<TestRecord, 'id' | 'date'>) => void;
    onDeleteTest: (studentId: string, testId: string) => void;
    onAddNote: (studentId: string, content: string) => void;
    onEdit: (student: Student) => void;
    onToggleAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
    onArchive: (studentId: string) => void;
    currentUserRole?: 'director' | 'teacher' | 'supervisor';
    onViewDetails: (student: Student) => void;
    onMarkWeeklyReportSent?: (studentId: string) => void;
}

const GroupStudentsModal: React.FC<GroupStudentsModalProps> = ({
    isOpen,
    onClose,
    group,
    students,
    onOpenFeeModal,
    onAddTest,
    onDeleteTest,
    onAddNote,
    onEdit,
    onToggleAttendance,
    onArchive,
    currentUserRole,
    onViewDetails,
    onMarkWeeklyReportSent
}) => {
    if (!isOpen || !group) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 pb-10 overflow-y-auto">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{group.name}</h2>
                        <p className="text-sm text-gray-500">عدد الطلاب: {students.length}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                    {students.length > 0 ? (
                        students.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                groupName={group.name}
                                onOpenFeeModal={onOpenFeeModal}
                                onEdit={onEdit}
                                onToggleAttendance={onToggleAttendance}
                                onArchive={onArchive}
                                currentUserRole={currentUserRole || 'teacher'} // Default to teacher if undefined to be safe, though it should be passed
                                onViewDetails={onViewDetails}
                                onMarkWeeklyReportSent={onMarkWeeklyReportSent}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">لا يوجد طلاب في هذه المجموعة.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupStudentsModal;
