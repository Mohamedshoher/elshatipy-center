import React, { useState, useEffect } from 'react';

interface DeductionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  teacherName: string;
}

const DeductionReasonModal: React.FC<DeductionReasonModalProps> = ({ isOpen, onClose, onConfirm, teacherName }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
        setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
    } else {
      alert('يرجى إدخال سبب الخصم.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">سبب الخصم لـ {teacherName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="deductionReason" className="block text-gray-600 mb-2">الرجاء توضيح سبب تطبيق الخصم:</label>
            <textarea
              id="deductionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors order-1 sm:order-2">تأكيد وتطبيق الخصم</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeductionReasonModal;
