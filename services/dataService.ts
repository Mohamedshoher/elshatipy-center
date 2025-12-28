
import type { Student, Group, Teacher, Expense, TeacherCollectionRecord, TeacherAttendanceRecord, TeacherPayrollAdjustment, GroupType, CurrentUser } from '../types';
import { ExpenseCategory } from '../types';

export const getGroupTypeFromName = (name: string | undefined): GroupType | null => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('قرآن')) return 'قرآن';
    if (lowerName.includes('نور بيان')) return 'نور بيان';
    if (lowerName.includes('تلقين') || lowerName.includes('تقلين')) return 'تلقين';
    if (lowerName.includes('إقراء') || lowerName.includes('اقراء')) return 'إقراء';
    return null;
};

export const filterSupervisorData = (
    currentUser: CurrentUser | null,
    activeStudents: Student[],
    groups: Group[],
    teachers: Teacher[],
    expenses: Expense[],
    teacherCollections: TeacherCollectionRecord[],
    teacherAttendance: TeacherAttendanceRecord[],
    teacherPayrollAdjustments: TeacherPayrollAdjustment[]
) => {
    if (currentUser?.role !== 'supervisor') return null;

    const sections = currentUser.section;

    // 1. Groups in these sections
    const filteredGroups = groups.filter(g => {
        const groupType = getGroupTypeFromName(g.name);
        return groupType && sections.includes(groupType);
    });
    const filteredGroupIds = filteredGroups.map(g => g.id);

    // 2. Students in those groups
    const filteredStudents = activeStudents.filter(s => filteredGroupIds.includes(s.groupId));

    // 3. Teachers who teach those groups
    const filteredTeacherIds = filteredGroups.map(g => g.teacherId).filter(id => id);
    const filteredTeachers = teachers.filter(t => filteredTeacherIds.includes(t.id));

    // 4. Expenses (Salaries of these teachers + Bonus)
    const filteredExpenses = expenses.filter(e => {
        if (e.category === ExpenseCategory.TEACHER_SALARY || e.category === ExpenseCategory.TEACHER_BONUS) {
            return filteredTeachers.some(t => e.description.includes(t.name));
        }
        return false;
    });

    // 5. Collections from these teachers
    const filteredCollections = teacherCollections.filter(c => filteredTeacherIds.includes(c.teacherId));

    // 6. Attendance/Payroll
    const filteredTeacherAttendance = teacherAttendance.filter(a => filteredTeacherIds.includes(a.teacherId));
    const filteredPayroll = teacherPayrollAdjustments.filter(p => filteredTeacherIds.includes(p.teacherId));

    return {
        groups: filteredGroups,
        students: filteredStudents,
        teachers: filteredTeachers,
        expenses: filteredExpenses,
        collections: filteredCollections,
        teacherAttendance: filteredTeacherAttendance,
        teacherPayrollAdjustments: filteredPayroll
    };
};

export const filterTeacherStudents = (
    currentUser: CurrentUser | null,
    activeStudents: Student[],
    groups: Group[]
) => {
    if (currentUser?.role !== 'teacher') return [];
    const teacherGroupIds = groups.filter(g => g.teacherId === currentUser.id).map(g => g.id);
    return activeStudents.filter(s => teacherGroupIds.includes(s.groupId));
};

export const getVisibleGroups = (
    currentUser: CurrentUser | null,
    groups: Group[],
    supervisorGroups: Group[] | undefined
) => {
    if (!currentUser) return [];
    if (currentUser.role === 'director') return groups;
    if (currentUser.role === 'supervisor') return supervisorGroups || [];
    return groups.filter(g => g.teacherId === currentUser.id);
};

export const getFilteredStudents = (
    currentUser: CurrentUser | null,
    activeStudents: Student[],
    teacherStudents: Student[],
    supervisorStudents: Student[] | undefined,
    studentTypeFilter: GroupType,
    groups: Group[]
) => {
    if (!currentUser) return [];

    let targetStudents: Student[] = [];
    if (currentUser.role === 'director') {
        targetStudents = activeStudents;
    } else if (currentUser.role === 'teacher') {
        targetStudents = teacherStudents;
    } else if (currentUser.role === 'supervisor') {
        targetStudents = supervisorStudents || [];
    }

    if (studentTypeFilter !== 'all') {
        targetStudents = targetStudents.filter(s => {
            if (studentTypeFilter === 'orphans') return s.isOrphan === true;
            if (studentTypeFilter === 'invalid_phone') {
                const digits = s.phone ? s.phone.replace(/\D/g, '') : '';
                return !s.phone || digits.length < 12;
            }

            const group = groups.find(g => g.id === s.groupId);
            if (!group) return false;
            return getGroupTypeFromName(group.name) === studentTypeFilter;
        });
    }
    return targetStudents;
};
