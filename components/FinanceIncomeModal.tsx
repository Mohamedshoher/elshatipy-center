import React, { useMemo } from 'react';
import type { Student, Group } from '../types';
import XIcon from './icons/XIcon';

interface FinanceIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  students: Student[];
  groups: Group[];
}

const FinanceIncomeModal: React.FC<FinanceIncomeModalProps> = ({ isOpen, onClose, month, students, groups }) => {
  const incomeByGroup = useMemo(() => {
    const groupMap = new Map(groups.map(g => [g.id, g.name]));
    const grouped: { [groupName: string]: { total: number, count: number } } = {};

    students.forEach(student => {
      student.fees
        .filter(fee => fee.month === month && fee.paid && fee.amountPaid)
        .forEach(fee => {
          const groupName = groupMap.get(student.groupId) || 'بدون مجموعة';
          if (!grouped[groupName]) {
            grouped[groupName] = { total: 0, count: 0 };
          }
          grouped[groupName].total += (fee.amountPaid || 0);
          grouped[groupName].count += 1;
        });
    });

    return Object.entries(grouped)
      .map(([groupName, data]) => ({ groupName, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [students, month, groups]);

  const totalIncome = useMemo(() => {
    return incomeByGroup.reduce((sum, item) => sum + item.total, 0);
  }, [incomeByGroup]);

  if (!isOpen) return null;
  const monthName = new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-700">تفاصيل الدخل لشهر {monthName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          {incomeByGroup.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المجموعة</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">عدد الطلاب</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">إجمالي المحصل</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomeByGroup.map(item => (
                  <tr key={item.groupName} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800">{item.groupName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{item.count}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-left text-green-600">{item.total.toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-8">لم يتم تحصيل أي مصروفات خلال هذا الشهر.</p>
          )}
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">الإجمالي:</h3>
          <span className="text-2xl font-bold text-green-700">{totalIncome.toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceIncomeModal;
