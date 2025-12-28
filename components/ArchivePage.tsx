
import React from 'react';
import StudentCard from './StudentCard';
import { Student, Group, CurrentUser, UserRole } from '../types';

interface ArchivePageProps {
    students: Student[];
    groups: Group[];
    searchTerm: string;
    currentUser: CurrentUser;
    onOpenFeeModal: (studentId: string, month: string, amount: number) => void;
    onEditStudent: (student: Student) => void;
    onToggleAttendance: (studentId: string, date: string, status: any) => void;
    onArchiveStudent: (studentId: string) => void;
    onOpenStudentDetails: (student: Student, initialTab?: any) => void;
    onDeleteStudentPermanently: (studentId: string) => void;
    supervisorFilteredData?: any;
}

const ArchivePage: React.FC<ArchivePageProps> = ({
    students,
    groups,
    searchTerm,
    currentUser,
    onOpenFeeModal,
    onEditStudent,
    onToggleAttendance,
    onArchiveStudent,
    onOpenStudentDetails,
    onDeleteStudentPermanently,
    supervisorFilteredData
}) => {
    let studentsToDisplay = students.filter(s => s.isArchived);
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        studentsToDisplay = studentsToDisplay.filter(s => s.name.toLowerCase().includes(searchLower));
    }

    studentsToDisplay = studentsToDisplay.filter(s => {
        if (currentUser?.role === 'director') return true;
        if (currentUser?.role === 'supervisor') {
            return supervisorFilteredData?.students.some((sf: any) => sf.id === s.id) || false;
        }
        if (currentUser?.role === 'teacher') {
            return s.archivedBy === (currentUser as any).id;
        }
        return false;
    }).sort((a, b) => {
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                {studentsToDisplay.length > 0 ? (
                    studentsToDisplay.map(student => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            groupName={student.archivedGroupName || groups.find(g => g.id === student.groupId)?.name}
                            onOpenFeeModal={onOpenFeeModal}
                            onEdit={onEditStudent}
                            onToggleAttendance={onToggleAttendance}
                            onArchive={onArchiveStudent}
                            currentUserRole={currentUser!.role as UserRole}
                            onViewDetails={onOpenStudentDetails}
                            onDeletePermanently={onDeleteStudentPermanently}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow">
                        <h2 className="text-2xl font-semibold text-gray-600">الأرشيف فارغ</h2>
                        <p className="text-gray-400 mt-2">لا يوجد طلاب مؤرشفون لعرضهم.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivePage;
