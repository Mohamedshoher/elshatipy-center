import React, { useMemo, useState } from 'react';
import type { Student, Group, Donation } from '../types';
import XIcon from './icons/XIcon';

interface FinanceIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  students: Student[];
  groups: Group[];
  donations: Donation[];
  onAddDonation: (donation: Omit<Donation, 'id'>) => void;
  onDeleteDonation: (donationId: string) => void;
}

const FinanceIncomeModal: React.FC<FinanceIncomeModalProps> = ({ isOpen, onClose, month, students, groups, donations, onAddDonation, onDeleteDonation }) => {
  // ...
  // (We just need to make sure the delete button is added in the view part, which is further down.
  // Since I can't easily skip lines in a single replace without context, I will do two replaces or one big one.)
  // I'll do two separate replacements for safety. One for props, one for rendering.

  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationNotes, setDonationNotes] = useState('');

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

  const donationsForMonth = useMemo(() => {
    return (donations || []).filter(d => d.month === month);
  }, [donations, month]);

  const totalDonations = useMemo(() => {
    return donationsForMonth.reduce((sum, d) => sum + d.amount, 0);
  }, [donationsForMonth]);

  const totalIncome = useMemo(() => {
    return incomeByGroup.reduce((sum, item) => sum + item.total, 0);
  }, [incomeByGroup]);

  const handleAddDonation = () => {
    if (!donorName.trim() || !donationAmount || parseFloat(donationAmount) <= 0) {
      alert('يرجى إدخال اسم المتبرع والمبلغ');
      return;
    }

    try {
      onAddDonation({
        donorName: donorName.trim(),
        amount: parseFloat(donationAmount),
        date: new Date().toISOString().split('T')[0],
        month: month,
        notes: donationNotes.trim(),
        addedBy: 'director', // This should be the current user
      });

      // Reset form
      setDonorName('');
      setDonationAmount('');
      setDonationNotes('');
      setShowDonationForm(false);
    } catch (error) {
      console.error("Failed to add donation:", error);
      alert("حدث خطأ غير متوقع أثناء الحفظ.");
    }
  };

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Fees Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">مصروفات الطلاب ({totalIncome.toLocaleString()} EGP)</h3>
              {incomeByGroup.length > 0 ? (
                <div className="space-y-3">
                  {incomeByGroup.map(item => (
                    <div key={item.groupName} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                        <h4 className="font-bold text-gray-800">{item.groupName}</h4>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{item.count} طلاب</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">المحصل:</span>
                        <span className="text-lg font-bold text-green-600">{item.total.toLocaleString()} EGP</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl">لم يتم تحصيل أي مصروفات</p>
              )}
            </div>

            {/* Donations Section */}
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-800">التبرعات ({totalDonations.toLocaleString()} EGP)</h3>
                <button
                  onClick={() => setShowDonationForm(!showDonationForm)}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
                  title="إضافة تبرع"
                >
                  <span className="text-xl font-bold">{showDonationForm ? '−' : '+'}</span>
                </button>
              </div>

              {showDonationForm && (
                <div className="bg-purple-50 rounded-xl p-4 mb-3 border border-purple-200">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">اسم المتبرع</label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="أدخل اسم المتبرع"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">المبلغ</label>
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="أدخل المبلغ"
                        min="0"
                        step="any"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات (اختياري)</label>
                      <input
                        type="text"
                        value={donationNotes}
                        onChange={(e) => setDonationNotes(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="ملاحظات إضافية"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddDonation}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                      >
                        حفظ
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDonationForm(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {donationsForMonth.length > 0 ? (
                <div className="space-y-3">
                  {donationsForMonth.map(donation => (
                    <div key={donation.id} className="bg-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">{donation.donorName}</h4>
                          <span className="text-gray-400 text-xs">|</span>
                          <span className="text-sm font-bold text-purple-600 dir-ltr">{donation.amount.toLocaleString()} EGP</span>
                        </div>
                        <button
                          onClick={() => onDeleteDonation(donation.id)}
                          className="text-red-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="حذف التبرع"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {donation.notes && (
                        <p className="text-xs text-gray-500 mt-1">{donation.notes}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{new Date(donation.date).toLocaleDateString('ar-EG')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8 bg-gray-50 rounded-xl">لا توجد تبرعات مسجلة</p>
              )}
            </div>
          </div>
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
