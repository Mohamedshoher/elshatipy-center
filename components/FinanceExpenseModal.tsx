

import React, { useMemo } from 'react';
import type { Expense } from '../types';
import { ExpenseCategory } from '../types';
import XIcon from './icons/XIcon';

interface FinanceExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  expenses: Expense[];
}

const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.RENT]: 'الإيجار',
  [ExpenseCategory.DEVELOPMENT]: 'تنمية وتطوير',
  [ExpenseCategory.UTILITIES]: 'فواتير ومرافق',
  [ExpenseCategory.TEACHER_SALARY]: 'رواتب المدرسين',
  [ExpenseCategory.STAFF_SALARY]: 'رواتب الموظفين',
  [ExpenseCategory.SUPERVISOR_SALARY]: 'رواتب المشرفين',
  [ExpenseCategory.TEACHER_BONUS]: 'مكافآت المدرسين',
  [ExpenseCategory.OTHER]: 'مصاريف أخرى',
};


const FinanceExpenseModal: React.FC<FinanceExpenseModalProps> = ({ isOpen, onClose, month, expenses }) => {

  const expenseDetails = useMemo(() => {
    const expensesForMonth = expenses.filter(e => e.date.startsWith(month));

    const salaries = expensesForMonth.filter(e => 
        e.category === ExpenseCategory.TEACHER_SALARY || 
        e.category === ExpenseCategory.STAFF_SALARY ||
        e.category === ExpenseCategory.SUPERVISOR_SALARY ||
        e.category === ExpenseCategory.TEACHER_BONUS
    );
    
    const generalExpensesByCategory: { [key in ExpenseCategory]?: { total: number, items: Expense[] } } = {};

    expensesForMonth
      .filter(e => 
          e.category !== ExpenseCategory.TEACHER_SALARY && 
          e.category !== ExpenseCategory.STAFF_SALARY && 
          e.category !== ExpenseCategory.SUPERVISOR_SALARY &&
          e.category !== ExpenseCategory.TEACHER_BONUS
      )
      .forEach(expense => {
        if (!generalExpensesByCategory[expense.category]) {
          generalExpensesByCategory[expense.category] = { total: 0, items: [] };
        }
        generalExpensesByCategory[expense.category]!.total += expense.amount;
        generalExpensesByCategory[expense.category]!.items.push(expense);
      });
      
    const totalSalaries = salaries.reduce((sum, s) => sum + s.amount, 0);
    const totalGeneral = Object.values(generalExpensesByCategory).reduce((sum, category) => sum + (category?.total || 0), 0);
    const grandTotal = totalSalaries + totalGeneral;

    return {
      salaries: salaries.sort((a,b) => a.description.localeCompare(b.description, 'ar')),
      generalExpenses: Object.entries(generalExpensesByCategory),
      totalSalaries,
      totalGeneral,
      grandTotal,
    };
  }, [expenses, month]);

  if (!isOpen) return null;
  const monthName = new Date(month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-700">تفاصيل المصروفات لشهر {monthName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salaries Section */}
            <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">الرواتب والمكافآت ({expenseDetails.totalSalaries.toLocaleString()} EGP)</h3>
                <div className="space-y-2">
                    {expenseDetails.salaries.length > 0 ? expenseDetails.salaries.map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{s.description}</span>
                            <span className="font-semibold text-red-600">{s.amount.toLocaleString()} EGP</span>
                        </div>
                    )) : <p className="text-sm text-gray-400">لا توجد رواتب مسجلة.</p>}
                </div>
            </div>
            {/* General Expenses Section */}
            <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">المصروفات العامة ({expenseDetails.totalGeneral.toLocaleString()} EGP)</h3>
                <div className="space-y-2">
                    {expenseDetails.generalExpenses.length > 0 ? expenseDetails.generalExpenses.map(([category, data]) => (
                         <div key={category} className="bg-gray-50 p-2 rounded">
                             <div className="flex justify-between items-center font-semibold">
                                 <span className="text-gray-700">{expenseCategoryLabels[category as ExpenseCategory]}</span>
                                 <span className="text-red-600">{data?.total.toLocaleString()} EGP</span>
                             </div>
                             <ul className="text-xs text-gray-500 mt-1 pr-4">
                                {data?.items.map(item => <li key={item.id}>- {item.description}</li>)}
                             </ul>
                         </div>
                    )) : <p className="text-sm text-gray-400">لا توجد مصروفات عامة مسجلة.</p>}
                </div>
            </div>
        </div>
        <div className="flex-shrink-0 mt-4 pt-4 border-t flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">الإجمالي:</h3>
            <span className="text-2xl font-bold text-red-700">{expenseDetails.grandTotal.toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceExpenseModal;