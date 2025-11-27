
import React, { useState, useEffect } from 'react';
import type { Supervisor, GroupType } from '../types';
import { TeacherStatus } from '../types';
import UserIcon from './icons/UserIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface SupervisorManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supervisorData: Omit<Supervisor, 'id'>, supervisorId?: string) => void;
  onDelete: (id: string) => void;
  supervisors: Supervisor[];
}

const SupervisorManagerModal: React.FC<SupervisorManagerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  supervisors,
}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSections, setSelectedSections] = useState<GroupType[]>(['قرآن']);
  const [salary, setSalary] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<TeacherStatus>(TeacherStatus.ACTIVE);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sectionOptions: GroupType[] = ['قرآن', 'نور بيان', 'تلقين'];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setPassword('');
    setSelectedSections(['قرآن']);
    setSalary('');
    setPhone('');
    setStatus(TeacherStatus.ACTIVE);
    setEditingId(null);
  };

  const handleEditClick = (supervisor: Supervisor) => {
    setEditingId(supervisor.id);
    setName(supervisor.name);
    setPassword(supervisor.password);
    // Handle case where older data might be single string or missing
    const sections = Array.isArray(supervisor.section) ? supervisor.section : (supervisor.section ? [supervisor.section] : []);
    setSelectedSections(sections as GroupType[]);
    setSalary(supervisor.salary ? supervisor.salary.toString() : '');
    setPhone(supervisor.phone || '');
    setStatus(supervisor.status || TeacherStatus.ACTIVE);
  };

  const handleSectionChange = (section: GroupType) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim() && selectedSections.length > 0) {
      onSave({
        name: name.trim(),
        password: password.trim(),
        section: selectedSections,
        salary: parseFloat(salary) || 0,
        phone: phone.trim(),
        status: status,
      }, editingId || undefined);
      resetForm();
    } else if (selectedSections.length === 0) {
      alert('يرجى اختيار قسم واحد على الأقل.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">إدارة المشرفين</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-shrink-0 mb-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{editingId ? 'تعديل بيانات مشرف' : 'إضافة مشرف جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المشرف</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required placeholder="الاسم الكامل" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required placeholder="كلمة المرور للدخول" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الراتب الشهري</label>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="رقم الهاتف" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select value={status} onChange={e => setStatus(e.target.value as TeacherStatus)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value={TeacherStatus.ACTIVE}>نشط</option>
                <option value={TeacherStatus.INACTIVE}>غير نشط</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الأقسام المشرف عليها</label>
              <div className="flex flex-wrap gap-2">
                {sectionOptions.map(sec => (
                  <label key={sec} className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border transition-all ${selectedSections.includes(sec) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-600'}`}>
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(sec)}
                      onChange={() => handleSectionChange(sec)}
                      className="hidden"
                    />
                    <span className="text-sm font-semibold select-none">{sec}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              {editingId && <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">إلغاء</button>}
              <button type="submit" className="px-8 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md">{editingId ? 'حفظ التعديلات' : 'إضافة مشرف'}</button>
            </div>
          </div>
        </form>

        <div className="flex-grow overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4 px-1">قائمة المشرفين</h3>
          <div className="space-y-4">
            {supervisors.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{s.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(Array.isArray(s.section) ? s.section : [s.section]).map((sec, idx) => (
                        <span key={idx} className="inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                          {sec}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex gap-3">
                      <span>كلمة المرور: <span className="font-mono bg-gray-100 px-1 rounded">{s.password}</span></span>
                      <span>|</span>
                      <span>الراتب: <span className="font-semibold text-green-600">{s.salary ? s.salary.toLocaleString() : 0}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEditClick(s)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { if (window.confirm('هل أنت متأكد من حذف هذا المشرف؟')) onDelete(s.id); }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {supervisors.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">لا يوجد مشرفون مضافون حالياً.</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-6 flex justify-end border-t pt-4">
          <button type="button" onClick={onClose} className="px-8 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-semibold">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default SupervisorManagerModal;
