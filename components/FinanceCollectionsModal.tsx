import React from 'react';
import type { Teacher } from '../types';
import XIcon from './icons/XIcon';

interface FinanceCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  collectionsSummary: {
    totalReceived: number;
    handedOverByTeachers: number;
    directorIncome: number;
    details: {
      teacherId: string;
      teacherName: string;
      amount: number;
    }[];
  };
}

const FinanceCollectionsModal: React.FC<FinanceCollectionsModalProps> = ({ isOpen, onClose, month, collectionsSummary }) => {
  if (!isOpen) return null;

  const monthName = new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-700">تفاصيل المبالغ المستلمة - {monthName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-sm font-bold text-blue-500 mb-1">تحصيلات المدرسين</p>
            <p className="text-2xl font-black text-blue-700">{collectionsSummary.handedOverByTeachers.toLocaleString()} ج.م</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <p className="text-sm font-bold text-purple-500 mb-1">تحصيلات المدير</p>
            <p className="text-2xl font-black text-purple-700">{collectionsSummary.directorIncome.toLocaleString()} ج.م</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
          <h3 className="font-bold text-gray-800 mb-4 border-r-4 border-blue-500 pr-3">تفصيل تحصيلات المدرسين:</h3>
          {collectionsSummary.details.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectionsSummary.details.map(item => (
                <div key={item.teacherId} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.teacherName}</h3>
                    <span className="text-xs text-gray-500">مدرس</span>
                  </div>
                  <div className="text-left">
                    <span className="block text-xl font-bold text-blue-600">{item.amount.toLocaleString()} EGP</span>
                    <span className="text-xs text-green-600">تم التسليم</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">لم يتم استلام أي مبالغ من المدرسين خلال هذا الشهر.</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t flex justify-between items-center bg-gray-50 -mx-6 px-6 -mb-6 pb-6">
          <h3 className="text-lg font-bold text-gray-800">إجمالي المبالغ المستلمة بالمركز:</h3>
          <span className="text-2xl font-bold text-blue-700">{collectionsSummary.totalReceived.toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceCollectionsModal;
