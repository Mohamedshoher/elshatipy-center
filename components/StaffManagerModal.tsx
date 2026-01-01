import React, { useState, useEffect } from 'react';
import type { Staff } from '../types';

interface StaffManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Omit<Staff, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Staff>) => void;
  onDelete: (id: string) => void;
  staffList: Staff[];
  staffToEdit: Staff | null;
  setStaffToEdit: (staff: Staff | null) => void;
}

const StaffManagerModal: React.FC<StaffManagerModalProps> = ({
  isOpen, onClose, onSave, onUpdate, onDelete, staffList, staffToEdit, setStaffToEdit
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setRole(staffToEdit.role);
      setSalary(staffToEdit.salary.toString());
    } else {
      setName('');
      setRole('');
      setSalary('');
    }
  }, [staffToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !salary) return;
    const staffData = { name, role, salary: parseFloat(salary) };
    if (staffToEdit) {
      onUpdate(staffToEdit.id, staffData);
    } else {
      onSave(staffData);
    }
    setStaffToEdit(null);
    setName('');
    setRole('');
    setSalary('');
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الموظف؟')) {
      onDelete(id);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">إدارة الموظفين</h2>
          <button onClick={() => { setStaffToEdit(null); onClose(); }} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-shrink-0 mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">{staffToEdit ? 'تعديل موظف' : 'إضافة موظف جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm">الاسم</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded mt-1" required />
            </div>
            <div>
              <label className="block text-sm">الوظيفة</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded mt-1" required />
            </div>
            <div>
              <label className="block text-sm">الراتب</label>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full p-2 border rounded mt-1" required />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                 {staffToEdit && <button type="button" onClick={() => setStaffToEdit(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">إلغاء التعديل</button>}
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{staffToEdit ? 'حفظ التعديلات' : 'إضافة موظف'}</button>
            </div>
          </div>
        </form>

        <div className="flex-grow overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">قائمة الموظفين</h3>
            <div className="space-y-2">
            {staffList.map(s => (
                <div key={s.id} className="bg-gray-100 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <p className="font-semibold">{s.name} <span className="text-sm text-gray-500">({s.role})</span></p>
                    <p className="text-sm text-gray-600">{s.salary.toLocaleString()} EGP</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
                    <button onClick={() => setStaffToEdit(s)} className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-800">تعديل</button>
                    <button onClick={() => handleDeleteClick(s.id)} className="text-sm px-3 py-1 rounded bg-red-100 text-red-800">حذف</button>
                </div>
                </div>
            ))}
            {staffList.length === 0 && <p className="text-center text-gray-400 py-4">لا يوجد موظفون مضافون.</p>}
            </div>
        </div>
        <div className="flex-shrink-0 mt-6 flex justify-end">
             <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default StaffManagerModal;