import React, { useState, useEffect } from 'react';

interface BonusReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  teacherName: string;
}

const BonusReasonModal: React.FC<BonusReasonModalProps> = ({ isOpen, onClose, onConfirm, teacherName }) => {
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
      alert('يرجى إدخال سبب المكافأة.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">سبب المكافأة لـ {teacherName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="bonusReason" className="block text-gray-600 mb-2">الرجاء توضيح سبب منح المكافأة:</label>
            <textarea
              id="bonusReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors order-1 sm:order-2">تأكيد ومنح المكافأة</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BonusReasonModal;
