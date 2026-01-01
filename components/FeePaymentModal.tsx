import React, { useState, useEffect } from 'react';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: { studentId: string; month: string; amountPaid: number; receiptNumber: string; }) => void;
  paymentDetails: { studentId: string; month: string; amount: number; } | null;
}

const FeePaymentModal: React.FC<FeePaymentModalProps> = ({ isOpen, onClose, onSave, paymentDetails }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  useEffect(() => {
    if (isOpen && paymentDetails) {
      setAmountPaid(paymentDetails.amount.toString());
      setReceiptNumber('');
    }
  }, [isOpen, paymentDetails]);

  if (!isOpen || !paymentDetails) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountPaid || isNaN(parseFloat(amountPaid)) || parseFloat(amountPaid) < 0) {
      alert("يرجى إدخال مبلغ صحيح.");
      return;
    }

    // Close modal immediately for faster UX
    const paymentData = {
      studentId: paymentDetails.studentId,
      month: paymentDetails.month,
      amountPaid: parseFloat(amountPaid),
      receiptNumber: receiptNumber.trim(),
    };

    // Close modal first
    onClose();

    // Then save in background
    onSave(paymentData);
  };

  const monthName = new Date(paymentDetails.month + '-02').toLocaleString('ar-EG', { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-700">تسجيل دفعة</h2>
        <p className="text-gray-500 mb-6">شهر: {monthName}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amountPaid" className="block text-gray-600 mb-2">المبلغ المدفوع</label>
            <input
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              step="any"
              min="0"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label htmlFor="receiptNumber" className="block text-gray-600 mb-2">رقم الوصل (اختياري)</label>
            <input
              type="text"
              id="receiptNumber"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors order-1 sm:order-2">حفظ الدفعة</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeePaymentModal;