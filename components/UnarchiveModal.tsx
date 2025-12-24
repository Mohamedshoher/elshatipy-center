import React, { useState, useEffect } from 'react';
import type { Group } from '../types';

interface UnarchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newGroupId: string) => void;
  groups: Group[];
  studentName: string;
}

const UnarchiveModal: React.FC<UnarchiveModalProps> = ({ isOpen, onClose, onConfirm, groups, studentName }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  useEffect(() => {
    if (isOpen && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    } else {
      setSelectedGroupId('');
    }
  }, [isOpen, groups]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId) {
      alert("يرجى اختيار مجموعة لإعادة الطالب إليها.");
      return;
    }

    // Close modal immediately for faster UX
    onClose();

    // Then confirm unarchive in background
    onConfirm(selectedGroupId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-700">استعادة الطالب</h2>
        <p className="text-gray-500 mb-6">يرجى اختيار المجموعة التي سينتقل إليها الطالب: <span className="font-semibold">{studentName}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="group-select" className="block text-gray-600 mb-2">المجموعة الجديدة</label>
            <select
              id="group-select"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              {groups.length === 0 ? (
                <option disabled>لا توجد مجموعات متاحة</option>
              ) : (
                [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))
              )}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="submit" disabled={!selectedGroupId} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors order-1 sm:order-2 disabled:bg-gray-400">
              استعادة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnarchiveModal;
