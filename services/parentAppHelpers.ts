/**
 * دوال مساعدة خاصة بأولياء الأمور لاستخدامها في App.tsx
 * يمكن نسخ هذه الدوال ولصقها مباشرة في App.tsx
 */

import type { Parent, Student, Group, Teacher, CurrentUser } from '../types';

// ============================================
// 1. دالة تسجيل دخول ولي الأمر
// ============================================
// المكان: بجوار handleLogin في App.tsx
export const createHandleParentLogin = (
    parents: Parent[],
    setCurrentUser: (user: CurrentUser) => void
) => {
    return (phone: string, password: string) => {
        const parent = parents.find(p => p.phone === phone && p.password === password);
        if (parent) {
            setCurrentUser({
                role: 'parent',
                id: parent.id,
                name: parent.name,
                phone: parent.phone,
                studentIds: parent.studentIds
            });
        } else {
            alert('رقم الهاتف أو كلمة المرور غير صحيحة');
        }
    };
};

// ============================================
// 2. دالة عرض محتوى ولي الأمر
// ============================================
// المكان: بجوار renderDirectorContent في App.tsx
export const createRenderParentContent = (
    currentUser: CurrentUser | null,
    students: Student[],
    groups: Group[],
    teachers: Teacher[],
    selectedParentStudent: Student | null,
    setSelectedParentStudent: (student: Student | null) => void,
    ParentDashboard: any,
    ParentStudentDetails: any
) => {
    return () => {
        if (currentUser?.role !== 'parent') return null;

        // جلب طلاب ولي الأمر
        const parentStudents = students.filter(s => currentUser.studentIds.includes(s.id));

        // إذا كان هناك طالب محدد، عرض تفاصيله
        if (selectedParentStudent) {
            const group = groups.find(g => g.id === selectedParentStudent.groupId);
            const teacher = teachers.find(t => t.id === group?.teacherId);

            return (
                <ParentStudentDetails
                    student= { selectedParentStudent }
            group = { group }
            teacher = { teacher }
            onClose = {() => setSelectedParentStudent(null)}
                />
            );
        }

// عرض لوحة التحكم
return (
    <ParentDashboard
                students= { parentStudents }
groups = { groups }
onViewStudent = { setSelectedParentStudent }
parentPhone = { currentUser.phone }
    />
        );
    };
};

// ============================================
// JSX للاستخدام المباشر في App.tsx
// ============================================

/*
// 1. في App.tsx، بعد handleLogin مباشرة، أضف:

const handleParentLogin = (phone: string, password: string) => {
    const parent = parents.find(p => p.phone === phone && p.password === password);
    if (parent) {
        setCurrentUser({
            role: 'parent',
            id: parent.id,
            name: parent.name,
            phone: parent.phone,
            studentIds: parent.studentIds
        });
    } else {
        alert('رقم الهاتف أو كلمة المرور غير صحيحة');
    }
};

// 2. في App.tsx، بجوار renderDirectorContent، أضف:

const renderParentContent = () => {
    if (currentUser?.role !== 'parent') return null;
    
    const parentStudents = students.filter(s => currentUser.studentIds.includes(s.id));
    
    if (selectedParentStudent) {
        const group = groups.find(g => g.id === selectedParentStudent.groupId);
        const teacher = teachers.find(t => t.id === group?.teacherId);
        
        return (
            <ParentStudentDetails
                student={selectedParentStudent}
                group={group}
                teacher={teacher}
                onClose={() => setSelectedParentStudent(null)}
            />
        );
    }
    
    return (
        <ParentDashboard
            students={parentStudents}
            groups={groups}
            onViewStudent={setSelectedParentStudent}
            parentPhone={currentUser.phone}
        />
    );
};
*/
