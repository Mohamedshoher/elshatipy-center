import React, { useState, useEffect, useRef } from 'react';
import type { Student, Group } from '../types';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, 'id' | 'attendance' | 'fees' | 'tests'>, studentId?: string) => void;
  studentToEdit?: Student | null;
  groups: Group[];
}

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const StudentForm: React.FC<StudentFormProps> = ({ isOpen, onClose, onSave, studentToEdit, groups }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [joiningDate, setJoiningDate] = useState(getTodayDateString());
  const [groupId, setGroupId] = useState('');
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [isOrphan, setIsOrphan] = useState(false);

  // DEBUG: Check if new code is loaded
  useEffect(() => {
    if (isOpen) {
      console.log("StudentForm mounted - Version with Orphan Checkbox Moved");
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        setName(studentToEdit.name);
        setPhone(studentToEdit.phone);
        setMonthlyFee(studentToEdit.monthlyFee.toString());
        setJoiningDate(studentToEdit.joiningDate);
        setGroupId(studentToEdit.groupId);
        setIsOrphan(studentToEdit.isOrphan || false);
      } else {
        setName('');
        setPhone('');
        setMonthlyFee('');
        setJoiningDate(getTodayDateString());
        setGroupId(groups[0]?.id || '');
        setIsOrphan(false);
      }
    }
  }, [studentToEdit, isOpen, groups]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !monthlyFee || !joiningDate || !groupId) {
      alert("يرجى ملء جميع الحقول، بما في ذلك اختيار مجموعة.");
      return;
    }
    if (groups.length === 0) {
      alert("يرجى إنشاء مجموعة أولاً قبل إضافة طالب.");
      return;
    }

    onSave({
      name,
      phone,
      monthlyFee: parseFloat(monthlyFee),
      joiningDate,
      groupId,
      isArchived: studentToEdit?.isArchived ?? false,
      isOrphan,
    }, studentToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div ref={scrollableRef} className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">{studentToEdit ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 mb-2">اسم الطالب</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-600 mb-2">رقم الهاتف (مع رمز الدولة)</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثال: 966501234567" className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          <div className="mb-4">
            <label htmlFor="monthlyFee" className="block text-gray-600 mb-2">المصروفات الشهرية</label>
            <input type="number" id="monthlyFee" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="group" className="block text-gray-600 mb-2">المجموعة</label>
            <select id="group" value={groupId} onChange={(e) => setGroupId(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required disabled={groups.length === 0}>
              {groups.length === 0 ? (
                <option>يرجى إنشاء مجموعة أولاً</option>
              ) : (
                [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => <option key={group.id} value={group.id}>{group.name}</option>)
              )}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="joiningDate" className="block text-gray-600 mb-2">تاريخ الانضمام (تاريخ الدخول)</label>
            <input type="date" id="joiningDate" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>

          {/* ORPHAN CHECKBOX SECTION - MOVED HERE */}
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <label className="flex items-center gap-3 cursor-pointer w-full">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isOrphan}
                  onChange={(e) => setIsOrphan(e.target.checked)}
                  className="w-6 h-6 text-red-600 rounded border-gray-300 focus:ring-red-500 focus:ring-2"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-red-800 text-lg">حالة الطالب: يتيم</span>
                <span className="text-red-600 text-xs text-right">يرجى تحديد هذا الخيار إذا كان الطالب يتيماً</span>
              </div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors order-1 sm:order-2">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;