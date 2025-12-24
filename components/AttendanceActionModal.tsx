import React from 'react';
import { TeacherAttendanceStatus } from '../types';

interface AttendanceActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    currentStatus?: TeacherAttendanceStatus;
    onSetStatus: (status: TeacherAttendanceStatus | null) => void;
}

const AttendanceActionModal: React.FC<AttendanceActionModalProps> = ({ isOpen, onClose, date, currentStatus, onSetStatus }) => {
    if (!isOpen) return null;

    const formattedDate = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg text-center mb-1 text-gray-800">تسجيل الحضور</h3>
                <p className="text-center text-gray-500 text-sm font-bold mb-6">{formattedDate}</p>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.PRESENT)} className={`p-4 rounded-xl border font-black text-sm transition-all ${currentStatus === TeacherAttendanceStatus.PRESENT ? 'ring-2 ring-green-500 bg-green-100 text-green-700' : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'}`}>حاضر ✅</button>
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.ABSENT)} className={`p-4 rounded-xl border font-black text-sm transition-all ${currentStatus === TeacherAttendanceStatus.ABSENT ? 'ring-2 ring-red-500 bg-red-100 text-red-700' : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'}`}>غائب ❌</button>
                    </div>

                    <div className="pt-2 border-t text-xs font-bold text-gray-400 text-center uppercase tracking-wider">خيارات إضافية</div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.BONUS_DAY)} className="p-3 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 border border-teal-100">مكافأة (يوم)</button>
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.DEDUCTION_FULL_DAY)} className="p-3 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 border border-orange-100">خصم (يوم)</button>

                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.BONUS_HALF_DAY)} className="p-3 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 border border-teal-100">مكافأة (نصف)</button>
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.DEDUCTION_HALF_DAY)} className="p-3 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 border border-orange-100">خصم (نصف)</button>

                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.BONUS_QUARTER_DAY)} className="p-3 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 border border-teal-100">مكافأة (ربع)</button>
                        <button onClick={() => onSetStatus(TeacherAttendanceStatus.DEDUCTION_QUARTER_DAY)} className="p-3 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 border border-orange-100">خصم (ربع)</button>
                    </div>

                    {currentStatus && (
                        <button onClick={() => onSetStatus(null)} className="w-full mt-2 p-3 rounded-xl border border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 flex items-center justify-center gap-2">
                            مسح السجل الحالي 🗑️
                        </button>
                    )}
                </div>

                <button onClick={onClose} className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">إلغاء</button>
            </div>
        </div>
    );
};

export default AttendanceActionModal;
