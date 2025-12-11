






import React, { useMemo, useState } from 'react';
import type { Teacher, Group, TeacherAttendanceRecord, TeacherPayrollAdjustment, Expense, FinancialSettings, Student, Supervisor, GroupType } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import TeacherCard from './TeacherCard';
import SupervisorCard from './SupervisorCard';
import SearchIcon from './icons/SearchIcon';
import DeductionReasonModal from './DeductionReasonModal';
import UserIcon from './icons/UserIcon';

interface TeacherManagerPageProps {
    onBack: () => void;
    teachers: Teacher[];
    supervisors: Supervisor[];
    groups: Group[];
    students: Student[];
    teacherAttendance: TeacherAttendanceRecord[];
    teacherPayrollAdjustments: TeacherPayrollAdjustment[];
    financialSettings: FinancialSettings;
    onAddTeacherClick: () => void;
    onEditTeacherClick: (teacher: Teacher) => void;
    onEditSupervisorClick: (supervisor: Supervisor) => void;
    onDeleteTeacher: (teacherId: string) => void;
    onDeleteSupervisor: (supervisorId: string) => void;
    onSetTeacherAttendance: (teacherId: string, date: string, status: TeacherAttendanceStatus, reason?: string) => void;
    onUpdatePayrollAdjustments: (adjustment: Partial<TeacherPayrollAdjustment> & Pick<TeacherPayrollAdjustment, 'teacherId' | 'month'> & { isPaid?: boolean }) => void;
    onLogExpense: (expense: Omit<Expense, 'id'>) => void;
    onViewTeacherReport: (teacherId: string) => void;
    onSendNotificationToAll: (content: string) => void;
    onSendNotificationToTeacher: (teacherId: string, content: string) => void;
    onViewTeacherDetails: (teacher: Teacher) => void;
    onViewSupervisorDetails: (supervisor: Supervisor) => void;
    searchTerm: string;
    isFilterVisible: boolean;
    onToggleFilter: () => void;
}

const TeacherManagerPage: React.FC<TeacherManagerPageProps> = (props) => {
    const { teachers, supervisors, groups, onViewTeacherDetails, onViewSupervisorDetails, isFilterVisible, searchTerm } = props;

    const [activeTab, setActiveTab] = useState<GroupType | 'الإشراف' | 'all'>('all');
    const [activeStatusFilter, setActiveStatusFilter] = useState<'active' | 'inactive'>('active');
    const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
    const [deductionDetails, setDeductionDetails] = useState<{ teacherId: string; status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY; isSupervisor?: boolean } | null>(null);

    // Filter States
    const [filterStatus, setFilterStatus] = useState<TeacherStatus | 'all'>('all');

    // Get teachers for current tab
    const getTeachersForTab = (tab: GroupType | 'الإشراف' | 'all') => {
        const sortBySearchRelevance = (items: any[]) => {
            const searchLower = searchTerm ? searchTerm.toLowerCase().trim() : '';

            return items.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();

                if (searchTerm) {
                    // Check if name starts with search term (first word match)
                    const aStartsWith = aName.startsWith(searchLower);
                    const bStartsWith = bName.startsWith(searchLower);

                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;

                    // Check if first word starts with search term
                    const aFirstWord = aName.split(' ')[0];
                    const bFirstWord = bName.split(' ')[0];
                    const aFirstWordMatch = aFirstWord.startsWith(searchLower);
                    const bFirstWordMatch = bFirstWord.startsWith(searchLower);

                    if (aFirstWordMatch && !bFirstWordMatch) return -1;
                    if (!aFirstWordMatch && bFirstWordMatch) return 1;
                }

                // Otherwise or finally, alphabetical
                return aName.localeCompare(bName, 'ar');
            });
        };

        if (tab === 'الإشراف') {
            // الإشراف means supervisors
            const filtered = supervisors
                .filter(s => {
                    const matchesSearch = searchTerm ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                    // For supervisors, assume active if status matches filter or if no status property (backward compatibility)
                    const matchesStatus = activeStatusFilter === 'active' ? (s.status === 'active' || !s.status) : s.status === 'inactive';
                    return matchesSearch && matchesStatus;
                });
            return sortBySearchRelevance(filtered);
        } else if (tab === 'all') {
            // Show all teachers filtered by status
            const filtered = teachers
                .filter(teacher => {
                    const matchesSearch = searchTerm ? teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                    const matchesStatus = teacher.status === activeStatusFilter;
                    return matchesSearch && matchesStatus;
                });
            return sortBySearchRelevance(filtered);
        } else {
            // Filter teachers by section and status
            const filtered = teachers
                .filter(teacher => {
                    const matchesSearch = searchTerm ? teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                    const matchesStatus = teacher.status === activeStatusFilter;

                    // If searching, show all matching teachers regardless of section
                    if (searchTerm) {
                        return matchesSearch && matchesStatus;
                    }

                    // Otherwise, filter by section
                    const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
                    const matchesSection = teacherGroups.some(g => g.name.includes(tab));

                    return matchesSearch && matchesStatus && matchesSection;
                });
            return sortBySearchRelevance(filtered);
        }
    };

    // Get all items when searching
    const getAllItems = () => {
        const sortBySearchRelevance = (items: any[]) => {
            const searchLower = searchTerm.toLowerCase().trim();
            return items.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const aStartsWith = aName.startsWith(searchLower);
                const bStartsWith = bName.startsWith(searchLower);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return aName.localeCompare(bName, 'ar');
            });
        };

        const allTeachers = teachers.filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = teacher.status === activeStatusFilter;
            return matchesSearch && matchesStatus;
        });

        const allSupervisors = supervisors.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = activeStatusFilter === 'active' ? (s.status === 'active' || !s.status) : s.status === 'inactive';
            return matchesSearch && matchesStatus;
        });

        return {
            teachers: sortBySearchRelevance(allTeachers),
            supervisors: sortBySearchRelevance(allSupervisors)
        };
    };

    const filteredItems = useMemo(() => {
        if (searchTerm) {
            return getAllItems();
        }
        return getTeachersForTab(activeTab);
    }, [activeTab, teachers, supervisors, searchTerm, filterStatus, groups, activeStatusFilter]);

    const handleDeductionClick = (teacherId: string, status: TeacherAttendanceStatus.HALF_DAY | TeacherAttendanceStatus.QUARTER_DAY, isSupervisor = false) => {
        setDeductionDetails({ teacherId, status, isSupervisor });
        setIsDeductionModalOpen(true);
    };

    const handleConfirmDeduction = (reason: string) => {
        if (!deductionDetails) return;
        const { teacherId, status, isSupervisor } = deductionDetails;
        const name = isSupervisor
            ? supervisors.find(s => s.id === teacherId)?.name
            : teachers.find(t => t.id === teacherId)?.name;

        if (!name) return;

        props.onSetTeacherAttendance(teacherId, new Date().toISOString().split('T')[0], status, reason);

        let amountText = status === TeacherAttendanceStatus.HALF_DAY ? 'نصف يوم' : 'ربع يوم';
        const notificationContent = `⚠️ تم تسجيل خصم عليك (${amountText}) وذلك لـ: "${reason}".`;
        props.onSendNotificationToTeacher(teacherId, notificationContent);

        setIsDeductionModalOpen(false);
        setDeductionDetails(null);
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Controls Header: Dropdown Filters */}
            <div className="flex flex-col items-center justify-center mb-6 gap-4">
                <div className="flex flex-row gap-2 w-auto justify-center items-center">
                    {/* Type Filter - Dropdown */}
                    <div className="relative">
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as GroupType | 'الإشراف' | 'all')}
                            className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="all">الكل</option>
                            <option value="قرآن">قرآن</option>
                            <option value="نور بيان">نور بيان</option>
                            <option value="تلقين">تلقين</option>
                            <option value="إقراء">إقراء</option>
                            <option value="الإشراف">الإشراف</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Status Filter - Dropdown */}
                    <div className="relative">
                        <select
                            value={activeStatusFilter}
                            onChange={(e) => setActiveStatusFilter(e.target.value as 'active' | 'inactive')}
                            className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterVisible && (
                <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-8 animate-fade-in-down">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-3">الحالة</h4>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setFilterStatus('all')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>الكل</button>
                                <button onClick={() => setFilterStatus(TeacherStatus.ACTIVE)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === TeacherStatus.ACTIVE ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>نشط</button>
                                <button onClick={() => setFilterStatus(TeacherStatus.INACTIVE)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === TeacherStatus.INACTIVE ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}>غير نشط</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Teachers or Supervisors based on active tab */}
            <div className="space-y-4">
                {searchTerm ? (
                    <>
                        {(filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).teachers.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">المدرسين</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).teachers.map((teacher: Teacher) => (
                                        <TeacherCard
                                            key={teacher.id}
                                            teacher={teacher}
                                            teacherAttendance={props.teacherAttendance}
                                            onSetTeacherAttendance={props.onSetTeacherAttendance}
                                            onDeductionClick={(id, status) => handleDeductionClick(id, status, false)}
                                            onClick={() => onViewTeacherDetails(teacher)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        {(filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).supervisors.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold text-gray-700 mb-2 mt-6">المشرفين</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).supervisors.map((supervisor: Supervisor) => (
                                        <SupervisorCard
                                            key={supervisor.id}
                                            supervisor={supervisor}
                                            teacherAttendance={props.teacherAttendance}
                                            onSetTeacherAttendance={props.onSetTeacherAttendance}
                                            onDeductionClick={(id, status) => handleDeductionClick(id, status, true)}
                                            onClick={() => onViewSupervisorDetails(supervisor)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        {(filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).teachers.length === 0 &&
                            (filteredItems as { teachers: Teacher[]; supervisors: Supervisor[] }).supervisors.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-100">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SearchIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-700">لا توجد نتائج</h2>
                                    <p className="text-gray-500 mt-2">لا يوجد مدرسون أو مشرفون يطابقون البحث "{searchTerm}"</p>
                                </div>
                            )}
                    </>
                ) : (
                    <>
                        {activeTab === 'الإشراف' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(filteredItems as Supervisor[]).map((item: Supervisor) => (
                                        <SupervisorCard
                                            key={item.id}
                                            supervisor={item}
                                            teacherAttendance={props.teacherAttendance}
                                            onSetTeacherAttendance={props.onSetTeacherAttendance}
                                            onDeductionClick={(id, status) => handleDeductionClick(id, status, true)}
                                            onClick={() => onViewSupervisorDetails(item)}
                                        />
                                    ))}
                                </div>
                                {(filteredItems as Supervisor[]).length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-100">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-700">لا يوجد مشرفون</h2>
                                        <p className="text-gray-500 mt-2">{filterStatus !== 'all' ? "لا توجد نتائج تطابق معايير البحث." : "قم بإضافة مشرفين جدد."}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(filteredItems as Teacher[]).map((item: Teacher) => (
                                        <TeacherCard
                                            key={item.id}
                                            teacher={item}
                                            teacherAttendance={props.teacherAttendance}
                                            onSetTeacherAttendance={props.onSetTeacherAttendance}
                                            onDeductionClick={(id, status) => handleDeductionClick(id, status, false)}
                                            onClick={() => onViewTeacherDetails(item)}
                                        />
                                    ))}
                                </div>
                                {(filteredItems as Teacher[]).length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-xl shadow border border-gray-100">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <SearchIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-700">لا يوجد مدرسون</h2>
                                        <p className="text-gray-500 mt-2">{filterStatus !== 'all' ? "لا توجد نتائج تطابق معايير البحث." : "قم بإضافة مدرسين جدد للبدء."}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {deductionDetails && (
                <DeductionReasonModal
                    isOpen={isDeductionModalOpen}
                    onClose={() => setIsDeductionModalOpen(false)}
                    onConfirm={handleConfirmDeduction}
                    teacherName={deductionDetails.isSupervisor
                        ? (supervisors.find(s => s.id === deductionDetails.teacherId)?.name || '')
                        : (teachers.find(t => t.id === deductionDetails.teacherId)?.name || '')
                    }
                />
            )}
        </main>
    );
};

export default TeacherManagerPage;
