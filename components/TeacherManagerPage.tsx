






import React, { useMemo, useState } from 'react';
import type { Teacher, Group, TeacherAttendanceRecord, TeacherPayrollAdjustment, Expense, FinancialSettings, Student, Supervisor, GroupType } from '../types';
import { TeacherStatus, TeacherAttendanceStatus } from '../types';
import TeacherCard from './TeacherCard';
import SupervisorCard from './SupervisorCard';
import SearchIcon from './icons/SearchIcon';
import DeductionReasonModal from './DeductionReasonModal';
import UserIcon from './icons/UserIcon';
import CogIcon from './icons/CogIcon';
import TrashIcon from './icons/TrashIcon';

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
    onUpdateFinancialSettings: (settings: FinancialSettings) => void;
    onAddHoliday?: (dateStr: string) => void;
    isFilterVisible: boolean;
    onToggleFilter: () => void;
}

const TeacherManagerPage = React.memo((props: TeacherManagerPageProps) => {
    const { teachers, supervisors, groups, onViewTeacherDetails, onViewSupervisorDetails, isFilterVisible, searchTerm, financialSettings, onUpdateFinancialSettings, onAddHoliday } = props;

    const [activeTab, setActiveTab] = useState<GroupType | 'الإشراف' | 'all'>('all');
    const [activeStatusFilter, setActiveStatusFilter] = useState<'active' | 'inactive'>('active');
    const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
            {/* Controls Header: Dropdown Filters & Settings */}
            <div className="flex flex-col items-center justify-center mb-6 gap-4">
                <div className="flex flex-row gap-2 w-auto justify-center items-center flex-wrap">
                    {/* Settings Button */}
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                        title="إعدادات الرواتب والخصومات"
                    >
                        <CogIcon className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-semibold">الإعدادات</span>
                    </button>

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
                        <div className="pointer-events-none inset-y-0 left-0 flex items-center px-2 text-gray-500 absolute">
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
                        <div className="pointer-events-none inset-y-0 left-0 flex items-center px-2 text-gray-500 absolute">
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

            {/* Direct Financial Settings Modal */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                <CogIcon className="w-6 h-6 text-gray-600" />
                                إعدادات الرواتب والخصومات
                            </h3>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="workingDays" className="block text-gray-600 mb-1 font-semibold">أيام العمل في الشهر</label>
                                <input
                                    id="workingDays"
                                    type="number"
                                    value={financialSettings.workingDaysPerMonth}
                                    onChange={(e) => onUpdateFinancialSettings({ ...financialSettings, workingDaysPerMonth: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="مثال: 22"
                                />
                                <p className="text-xs text-gray-500 mt-1">يستخدم هذا الرقم لحساب قيمة اليومية عند خصم الغياب.</p>
                            </div>
                            <div>
                                <label htmlFor="deductionPercentage" className="block text-gray-600 mb-1 font-semibold">نسبة الخصم للغياب (%)</label>
                                <input
                                    id="deductionPercentage"
                                    type="number"
                                    value={financialSettings.absenceDeductionPercentage}
                                    onChange={(e) => onUpdateFinancialSettings({ ...financialSettings, absenceDeductionPercentage: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="مثال: 100"
                                />
                                <p className="text-xs text-gray-500 mt-1">100% تعني خصم قيمة يوم كامل. 150% تعني خصم يوم ونصف (عقوبة).</p>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <span>📅</span> إجازات المركز الرسمية
                                </h4>
                                <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-2 rounded">
                                    ℹ️ عند إضافة تاريخ هنا، سيتم <b>تلقائياً حذف جميع الخصومات والإشعارات</b> المتعلقة بهذا اليوم لجميع المدرسين.
                                </p>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="date"
                                        id="new-holiday-manager"
                                        className="flex-1 px-4 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('new-holiday-manager') as HTMLInputElement;
                                            const dateStr = input.value;
                                            if (dateStr && !financialSettings.publicHolidays?.includes(dateStr)) {
                                                if (onAddHoliday) {
                                                    // ✅ استخدام الدالة الجديدة الذكية
                                                    onAddHoliday(dateStr);
                                                } else {
                                                    onUpdateFinancialSettings({
                                                        ...financialSettings,
                                                        publicHolidays: [...(financialSettings.publicHolidays || []), dateStr]
                                                    });
                                                }
                                                input.value = '';
                                            }
                                        }}
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        إضافة إجازة
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {(financialSettings.publicHolidays || []).sort().map(date => (
                                        <div key={date} className="flex justify-between items-center bg-gray-50 p-2 rounded border group">
                                            <span className="text-xs text-gray-700 font-medium">
                                                {new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    onUpdateFinancialSettings({
                                                        ...financialSettings,
                                                        publicHolidays: financialSettings.publicHolidays?.filter(d => d !== date)
                                                    });
                                                }}
                                                className="text-red-400 hover:text-red-600 p-1"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!financialSettings.publicHolidays || financialSettings.publicHolidays.length === 0) && (
                                        <p className="text-gray-400 text-xs text-center py-2">لم يتم تسجيل إجازات بعد.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end items-center border-t mt-4">
                            <button
                                onClick={() => setIsSettingsModalOpen(false)}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main >
    );
});

export default TeacherManagerPage;
