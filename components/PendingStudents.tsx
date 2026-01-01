import React, { useState } from 'react';
import type { Student, Group } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import EditIcon from './icons/EditIcon';
import UnarchiveIcon from './icons/UnarchiveIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface PendingStudentsProps {
    students: Student[];
    groups: Group[];
    onApprove: (studentId: string) => void;
    onReject: (studentId: string) => void;
    onEdit: (student: Student) => void;
}

const PendingStudents: React.FC<PendingStudentsProps> = ({ students, groups, onApprove, onReject, onEdit }) => {
    const [isNewStudentsExpanded, setIsNewStudentsExpanded] = useState(true);
    const [isUnarchivedStudentsExpanded, setIsUnarchivedStudentsExpanded] = useState(true);

    // Filter only pending students
    const pendingStudents = students.filter(s => s.isPending === true);

    // Separate new students from unarchived students
    // A student is "unarchived" if they have archiveDate field (even if currently not archived)
    const newStudents = pendingStudents.filter(s => !s.archiveDate);
    const unarchivedStudents = pendingStudents.filter(s => s.archiveDate);

    // Group students by group
    const groupStudentsByGroup = (studentList: Student[]) => {
        return studentList.reduce((acc, student) => {
            if (!acc[student.groupId]) {
                acc[student.groupId] = [];
            }
            acc[student.groupId].push(student);
            return acc;
        }, {} as Record<string, Student[]>);
    };

    const newStudentsByGroup = groupStudentsByGroup(newStudents);
    const unarchivedStudentsByGroup = groupStudentsByGroup(unarchivedStudents);

    const renderStudentCard = (student: Student, isUnarchived: boolean) => (
        <div
            key={student.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">{student.name}</p>
                    {isUnarchived && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            مستعاد من الأرشيف
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600">
                    الهاتف: {student.phone} • المصروفات: {student.monthlyFee} ريال
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    تاريخ الانضمام: {student.joiningDate}
                </p>
            </div>
            <div className="flex gap-2 mr-4 flex-wrap justify-end">
                <button
                    onClick={() => onEdit(student)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="تعديل بيانات الطالب"
                >
                    <EditIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">تعديل</span>
                </button>
                <button
                    onClick={() => onApprove(student.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="قبول الطالب"
                >
                    <CheckIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">قبول</span>
                </button>
                <button
                    onClick={() => onReject(student.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="رفض الطالب"
                >
                    <XIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">رفض</span>
                </button>
            </div>
        </div>
    );

    const renderGroupSection = (studentsByGroup: Record<string, Student[]>, isUnarchived: boolean) => {
        return Object.entries(studentsByGroup).map(([groupId, groupStudents]) => {
            const group = groups.find(g => g.id === groupId);
            return (
                <div key={groupId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-lg">
                        مجموعة: {group?.name || 'غير معروف'}
                    </h4>
                    <div className="space-y-2">
                        {groupStudents.map(student => renderStudentCard(student, isUnarchived))}
                    </div>
                </div>
            );
        });
    };

    if (pendingStudents.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6 mb-6">
            {/* New Students Section */}
            {newStudents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                        onClick={() => setIsNewStudentsExpanded(!isNewStudentsExpanded)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <UserPlusIcon className="w-6 h-6 text-green-600" />
                            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {newStudents.length}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800">
                                طلاب جدد بانتظار الموافقة
                            </h3>
                        </div>
                        <ChevronDownIcon
                            className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isNewStudentsExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {isNewStudentsExpanded && (
                        <div className="px-6 pb-6 space-y-4">
                            {renderGroupSection(newStudentsByGroup, false)}
                        </div>
                    )}
                </div>
            )}

            {/* Unarchived Students Section */}
            {unarchivedStudents.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                        onClick={() => setIsUnarchivedStudentsExpanded(!isUnarchivedStudentsExpanded)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <UnarchiveIcon className="w-6 h-6 text-blue-600" />
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {unarchivedStudents.length}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800">
                                طلاب مستعادين من الأرشيف بانتظار الموافقة
                            </h3>
                        </div>
                        <ChevronDownIcon
                            className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isUnarchivedStudentsExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {isUnarchivedStudentsExpanded && (
                        <div className="px-6 pb-6 space-y-4">
                            {renderGroupSection(unarchivedStudentsByGroup, true)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PendingStudents;
