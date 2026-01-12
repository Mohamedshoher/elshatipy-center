import React from 'react';
import { AttendanceStatus } from '../types';

interface StudentAttendanceActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: string;
    currentStatus?: AttendanceStatus;
    onSetStatus: (status: AttendanceStatus | null) => void;
}

const StudentAttendanceActionModal: React.FC<StudentAttendanceActionModalProps> = ({ isOpen, onClose, date, currentStatus, onSetStatus }) => {
    if (!isOpen) return null;

    const formattedDate = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex justify-center items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
            <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-6 w-full max-w-sm flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <h3 className="font-black text-xl text-center mb-1 text-gray-800">تسجيل الحضور</h3>
                <p className="text-center text-gray-500 text-sm font-bold mb-8 bg-gray-50 py-2 rounded-xl mx-auto px-4 inline-block">{formattedDate}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={() => onSetStatus(AttendanceStatus.PRESENT)}
                        className={`p-6 rounded-2xl border-2 font-black text-base flex flex-col items-center gap-2 transition-all active:scale-95 ${currentStatus === AttendanceStatus.PRESENT ? 'ring-4 ring-green-500/20 border-green-500 bg-green-50 text-green-700' : 'bg-white text-gray-700 border-gray-100 hover:border-green-200 hover:bg-green-50/50'}`}
                    >
                        <span className="text-3xl">✅</span>
                        <span>حاضر</span>
                    </button>
                    <button
                        onClick={() => onSetStatus(AttendanceStatus.ABSENT)}
                        className={`p-6 rounded-2xl border-2 font-black text-base flex flex-col items-center gap-2 transition-all active:scale-95 ${currentStatus === AttendanceStatus.ABSENT ? 'ring-4 ring-red-500/20 border-red-500 bg-red-50 text-red-700' : 'bg-white text-gray-700 border-gray-100 hover:border-red-200 hover:bg-red-50/50'}`}
                    >
                        <span className="text-3xl">❌</span>
                        <span>غائب</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Optional: Add excuse button if needed later */}

                    {currentStatus && (
                        <button
                            onClick={() => onSetStatus(null)}
                            className="w-full py-4 rounded-xl text-red-600 font-bold bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="text-xl">🗑️</span>
                            مسح السجل
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceActionModal;
