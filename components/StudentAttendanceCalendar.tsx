import React, { useMemo } from 'react';
import { AttendanceStatus } from '../types';

interface StudentAttendanceRecord {
    date: string;
    status: AttendanceStatus | string;
}

interface StudentAttendanceCalendarProps {
    month: string; // YYYY-MM
    attendanceRecords: StudentAttendanceRecord[];
}

const StudentAttendanceCalendar: React.FC<StudentAttendanceCalendarProps> = ({ month, attendanceRecords }) => {
    const calendarDays = useMemo(() => {
        const [yearStr, monthStr] = month.split('-');
        const year = parseInt(yearStr);
        const monthIndex = parseInt(monthStr) - 1;

        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Start day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) based on JS Date.
        // We want to render a grid starting from Saturday.
        // JS Day: 0(Sun), 1(Mon), 2(Tue), 3(Wed), 4(Thu), 5(Fri), 6(Sat)
        // Target: 0(Sat), 1(Sun), 2(Mon), 3(Tue), 4(Wed), 5(Thu), 6(Fri)
        // Formula: (day + 1) % 7

        const startDayOfWeek = firstDayOfMonth.getDay();
        const offset = (startDayOfWeek + 1) % 7;

        const days = [];
        // Empty cells for offset
        for (let i = 0; i < offset; i++) {
            days.push(null);
        }
        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, [month]);

    const getStatusColor = (date: string) => {
        const record = attendanceRecords.find(r => r.date === date);
        if (!record) return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-100';

        switch (record.status) {
            case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
            case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const dayNames = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 w-full">
            <div className="grid grid-cols-7 gap-2 mb-4 border-b pb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} className="aspect-square"></div>;

                    const dateStr = `${month}-${String(day).padStart(2, '0')}`;
                    const colorClass = getStatusColor(dateStr);
                    const record = attendanceRecords.find(r => r.date === dateStr);

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all relative ${colorClass}`}
                        >
                            <span className="font-bold text-sm sm:text-lg">{day}</span>
                            {record && (
                                <div className={`mt-1 w-2 h-2 rounded-full ${record.status === AttendanceStatus.PRESENT ? 'bg-green-500' : 'bg-red-500'} opacity-60 sm:hidden`}></div>
                            )}
                            {record && (
                                <span className="hidden sm:block text-[10px] mt-1 font-bold">
                                    {record.status === AttendanceStatus.PRESENT ? 'حاضر' : 'غائب'}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentAttendanceCalendar;
