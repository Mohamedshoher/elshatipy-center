
import React from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: string | null;
  isLoading: boolean;
  studentName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, report, isLoading, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">التقرير الشهري لـ {studentName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg min-h-[200px] text-lg leading-relaxed whitespace-pre-wrap">
          {isLoading ? (
             <div className="flex flex-col justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">جاري إنشاء التقرير...</p>
            </div>
          ) : (
            report
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition-colors">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
