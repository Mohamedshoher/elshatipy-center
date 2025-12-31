
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
    allStudents: Student[],
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
    const filteredGroupNames = new Set(filteredGroups.map(g => g.name));

    // 2. Students in those groups (including archived)
    const allFilteredStudents = allStudents.filter(s =>
        filteredGroupIds.includes(s.groupId) ||
        (s.isArchived && s.archivedGroupName && filteredGroupNames.has(s.archivedGroupName))
    );
    const activeFilteredStudents = allFilteredStudents.filter(s => !s.isArchived && !s.isPending);

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
        students: activeFilteredStudents,
        allStudents: allFilteredStudents,
        teachers: filteredTeachers,
        expenses: filteredExpenses,
        collections: filteredCollections,
        teacherAttendance: filteredTeacherAttendance,
        teacherPayrollAdjustments: filteredPayroll
    };
};

export const filterTeacherStudents = (
    currentUser: CurrentUser | null,
    allStudents: Student[],
    groups: Group[]
) => {
    if (currentUser?.role !== 'teacher') return { students: [], allStudents: [] };
    const teacherGroups = groups.filter(g => g.teacherId === currentUser.id);
    const teacherGroupIds = teacherGroups.map(g => g.id);
    const teacherGroupNames = new Set(teacherGroups.map(g => g.name));

    const allFiltered = allStudents.filter(s =>
        teacherGroupIds.includes(s.groupId) ||
        (s.isArchived && s.archivedGroupName && teacherGroupNames.has(s.archivedGroupName))
    );
    const activeFiltered = allFiltered.filter(s => !s.isArchived && !s.isPending);

    return { students: activeFiltered, allStudents: allFiltered };
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
