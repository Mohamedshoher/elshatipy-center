import React, { useState } from 'react';
import ParentDashboard from './ParentDashboard';
import ParentStudentDetails from './ParentStudentDetails';
import { CurrentUser, Student, Group, Teacher } from '../types';

interface ParentViewProps {
    currentUser: Extract<CurrentUser, { role: 'parent' }>;
    students: Student[];
    groups: Group[];
    teachers: Teacher[];
    unreadMessagesCount: number;
    setIsChatOpen: (isOpen: boolean) => void;
    setChatInitialUserId: (id: string) => void;
    onNavigateToHome?: () => void;
}

const ParentView: React.FC<ParentViewProps> = ({
    currentUser,
    students,
    groups,
    teachers,
    unreadMessagesCount,
    setIsChatOpen,
    setChatInitialUserId,
    onNavigateToHome
}) => {
    const [selectedParentStudent, setSelectedParentStudent] = useState<Student | null>(null);

    // جلب طلاب ولي الأمر
    const parentStudents = students.filter(s => currentUser.studentIds.includes(s.id));

    // إذا كان هناك طالب محدد، عرض تفاصيله
    if (selectedParentStudent) {
        const group = groups.find(g => g.id === selectedParentStudent.groupId);
        const teacher = teachers.find(t => t.id === group?.teacherId);

        return (
            <ParentStudentDetails
                student={selectedParentStudent}
                group={group}
                teacher={teacher}
                onClose={() => setSelectedParentStudent(null)}
                onOpenChat={() => {
                    if (teacher) {
                        setChatInitialUserId(teacher.id);
                    }
                    setSelectedParentStudent(null); // إغلاق صفحة التفاصيل
                    setIsChatOpen(true);
                }}
                unreadMessagesCount={unreadMessagesCount}
            />
        );
    }

    // عرض لوحة التحكم
    return (
        <ParentDashboard
            students={parentStudents}
            groups={groups}
            onViewStudent={setSelectedParentStudent}
        />
    );
};

export default ParentView;
