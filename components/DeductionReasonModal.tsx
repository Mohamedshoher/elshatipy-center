import React, { useState, useEffect } from 'react';
import XIcon from './icons/XIcon';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130] flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-lg transition-all animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-800">📉 سبب الخصم</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <p className="text-gray-500 font-bold mb-6 text-sm">أدخل سبب تطبيق الخصم على <span className="text-orange-600">"{teacherName}"</span>:</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              id="deductionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="مثلاً: غياب بدون عذر، تأخير متكرر، عدم إرسال التقرير اليومي..."
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50/50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold resize-none"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full py-4 rounded-2xl text-white bg-orange-600 hover:bg-orange-700 font-black text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98]">إعتماد وتطبيق الخصم</button>
            <button type="button" onClick={onClose} className="w-full py-3 rounded-2xl text-gray-500 bg-white hover:bg-gray-50 font-bold transition-colors">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeductionReasonModal;
