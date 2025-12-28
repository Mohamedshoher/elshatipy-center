import React, { useState, useRef, useEffect } from 'react';
import { Teacher, Group, Student, TeacherAttendanceRecord, TeacherAttendanceStatus, Notification, DayOfWeek } from '../types';
import { getCairoNow, getCairoDateString, getCairoDayOfWeek, isCairoWorkday, getYesterdayDateString } from '../services/cairoTimeHelper';

interface AttendanceCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    teachers: Teacher[];
    groups: Group[];
    students: Student[];
    teacherAttendance: TeacherAttendanceRecord[];
    onApplyDeductions: (records: TeacherAttendanceRecord[], notifications: Notification[]) => void;
}

const AttendanceCheckModal: React.FC<AttendanceCheckModalProps> = ({
    isOpen,
    onClose,
    teachers,
    groups,
    students,
    teacherAttendance,
    onApplyDeductions
}) => {
    const [checkDate, setCheckDate] = useState(() => {
        return getYesterdayDateString();
    });

    const [missingTeachers, setMissingTeachers] = useState<{ teacher: Teacher, reason: string }[]>([]);
    const [hasChecked, setHasChecked] = useState(false);
    const scrollableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && scrollableRef.current) {
            scrollableRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    const getDayOfWeek = (dateString: string): DayOfWeek => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const days = [
            DayOfWeek.SUNDAY,
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY
        ];
        return days[date.getDay()];
    };

    const handleCheck = () => {
        const dayOfWeek = getDayOfWeek(checkDate);

        // Check if it's a weekend (Thursday or Friday)
        if (dayOfWeek === DayOfWeek.THURSDAY || dayOfWeek === DayOfWeek.FRIDAY) {
            alert('يومي الخميس والجمعة عطلة رسمية ولا يتطلبان تقارير يومية.');
            setMissingTeachers([]);
            setHasChecked(true); // Show empty results
            return;
        }

        const missing: { teacher: Teacher, reason: string }[] = [];

        teachers.filter(t => t.status === 'active').forEach(teacher => {
            // 1. Check if teacher already has an attendance record for this day (e.g. absent, or already penalized)
            const existingRecord = teacherAttendance.find(r => r.teacherId === teacher.id && r.date === checkDate);
            if (existingRecord) {
                // If already recorded (absent, present, or penalized), skip
                return;
            }

            // 2. Check if teacher should have worked today
            const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
            let shouldHaveWorked = false;
            let hasRecordedAttendance = false;

            // Check all students in teacher's groups
            for (const group of teacherGroups) {
                const groupStudents = students.filter(s => s.groupId === group.id && !s.isArchived);

                // Check if any student had a scheduled class today
                const hasScheduledStudents = groupStudents.some(s =>
                    s.schedule?.some(sch => sch.day === dayOfWeek && sch.isEnabled)
                );

                if (hasScheduledStudents) {
                    shouldHaveWorked = true;
                }

                // Check if attendance was recorded for any student in this group
                const attendanceRecorded = groupStudents.some(s =>
                    s.attendance.some(a => a.date === checkDate)
                );

                if (attendanceRecorded) {
                    hasRecordedAttendance = true;
                }
            }

            if (shouldHaveWorked && !hasRecordedAttendance) {
                missing.push({
                    teacher,
                    reason: 'لم يتم تسجيل حضور لأي مجموعة في هذا اليوم'
                });
            }
        });

        setMissingTeachers(missing);
        setHasChecked(true);
    };

    const handleApply = () => {
        const newRecords: TeacherAttendanceRecord[] = [];
        const newNotifications: Notification[] = [];

        missingTeachers.forEach(({ teacher }) => {
            // Use a deterministic ID: auto-missed-teacherId-date
            const recordId = `auto-missed-${teacher.id}-${checkDate}`;

            // Create Deduction Record
            newRecords.push({
                id: recordId,
                teacherId: teacher.id,
                date: checkDate,
                status: TeacherAttendanceStatus.MISSING_REPORT,
                reason: 'لم يسلم التقرير اليومي'
            });

            // Create Notification with deterministic ID to prevent duplicates
            newNotifications.push({
                id: `notif-missed-${teacher.id}-${checkDate}`,
                date: getCairoNow().toISOString(),
                content: `تم خصم ربع يوم من راتبك لعدم تسليم تقرير الحضور والغياب ليوم ${checkDate}.`,
                senderName: 'الإدارة',
                target: { type: 'teacher', id: teacher.id },
                readBy: [],
                deletedBy: [] // Initialize deletedBy
            });
        });

        onApplyDeductions(newRecords, newNotifications);
        onClose();
        setHasChecked(false);
        setMissingTeachers([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={scrollableRef} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-gray-800">التحقق من تسليم التقارير اليومية</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Date Selection */}
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التحقق</label>
                            <input
                                type="date"
                                value={checkDate}
                                onChange={(e) => { setCheckDate(e.target.value); setHasChecked(false); }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleCheck}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            فحص السجلات
                        </button>
                    </div>

                    {/* Results */}
                    {hasChecked && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                                النتائج ({missingTeachers.length} مدرس مخالف)
                            </h3>

                            {missingTeachers.length > 0 ? (
                                <div className="bg-red-50 border border-red-100 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-right">
                                        <thead className="bg-red-100 text-red-800">
                                            <tr>
                                                <th className="p-3">المدرس</th>
                                                <th className="p-3">السبب</th>
                                                <th className="p-3">الإجراء المقترح</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-red-100">
                                            {missingTeachers.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-medium text-gray-800">{item.teacher.name}</td>
                                                    <td className="p-3 text-gray-600">{item.reason}</td>
                                                    <td className="p-3 text-red-600 font-bold">خصم ربع يوم</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-green-700 font-bold text-lg">ممتاز! جميع المدرسين قاموا بتسليم التقارير لهذا اليوم.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium"
                    >
                        إلغاء
                    </button>
                    {hasChecked && missingTeachers.length > 0 && (
                        <button
                            onClick={handleApply}
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-md transition-all transform hover:scale-105"
                        >
                            تطبيق الخصومات وإرسال الإشعارات
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceCheckModal;
