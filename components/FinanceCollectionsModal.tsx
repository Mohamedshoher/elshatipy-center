import React from 'react';
import type { Teacher } from '../types';
import XIcon from './icons/XIcon';

interface FinanceCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  collectionsSummary: {
    totalReceived: number;
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
        <div className="flex-grow overflow-y-auto pr-2">
          {collectionsSummary.details.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المدرس</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المبلغ المسلَّم</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collectionsSummary.details.map(item => (
                  <tr key={item.teacherId}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.teacherName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-blue-600">{item.amount.toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">لم يتم استلام أي مبالغ من المدرسين خلال هذا الشهر.</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">الإجمالي:</h3>
          <span className="text-2xl font-bold text-blue-700">{collectionsSummary.totalReceived.toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceCollectionsModal;
