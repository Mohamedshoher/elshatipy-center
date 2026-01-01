import React, { useState, useEffect } from 'react';
import type { Group, Student, Teacher } from '../types';
import { TeacherStatus } from '../types';

interface GroupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  students: Student[];
  teachers: Teacher[];
  onAddGroup: (name: string, teacherId?: string) => void;
  onUpdateGroup: (id: string, name: string, teacherId?: string) => void;
  onDeleteGroup: (id: string) => void;
}

const GroupManagerModal: React.FC<GroupManagerModalProps> = ({ isOpen, onClose, groups, students, teachers, onAddGroup, onUpdateGroup, onDeleteGroup }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTeacherId, setNewGroupTeacherId] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingGroupTeacherId, setEditingGroupTeacherId] = useState<string | undefined>('');

  const activeTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);

  useEffect(() => {
    if (!isOpen) {
      setNewGroupName('');
      setNewGroupTeacherId('');
      setEditingGroupId(null);
      setEditingGroupName('');
      setEditingGroupTeacherId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim(), newGroupTeacherId || undefined);
      setNewGroupName('');
      setNewGroupTeacherId('');
    }
  };

  const isGroupInUse = (groupId: string) => {
    return students.some(student => student.groupId === groupId && !student.isArchived);
  };

  const handleStartEdit = (group: Group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
    setEditingGroupTeacherId(group.teacherId);
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingGroupName('');
    setEditingGroupTeacherId('');
  };

  const handleSaveEdit = (groupId: string) => {
    if (editingGroupName.trim()) {
      onUpdateGroup(groupId, editingGroupName.trim(), editingGroupTeacherId || undefined);
      handleCancelEdit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700">إدارة المجموعات</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl" aria-label="إغلاق">&times;</button>
        </div>

        <form onSubmit={handleAddSubmit} className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
          <div className="md:col-span-2">
            <label htmlFor="newGroupName" className="block text-sm font-medium text-gray-600 mb-1">اسم المجموعة الجديدة</label>
            <input
              id="newGroupName"
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="اسم المجموعة"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="newGroupTeacher" className="block text-sm font-medium text-gray-600 mb-1">المدرس المسؤول</label>
            <select
              id="newGroupTeacher"
              value={newGroupTeacherId}
              onChange={(e) => setNewGroupTeacherId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">بلا مدرس</option>
              {activeTeachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="md:col-span-3 px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            إضافة مجموعة
          </button>
        </form>

        <div className="flex-grow space-y-3 overflow-y-auto pr-2">
          {groups.length > 0 ? (
            [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(group => {
              const isEditing = editingGroupId === group.id;
              const assignedTeacher = teachers.find(t => t.id === group.teacherId);

              return (
                <div key={group.id} className="bg-gray-100 p-3 rounded-lg">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        className="w-full px-2 py-1 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <select
                        value={editingGroupTeacherId}
                        onChange={(e) => setEditingGroupTeacherId(e.target.value)}
                        className="w-full px-2 py-1 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">بلا مدرس</option>
                        {activeTeachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleSaveEdit(group.id)} className="px-3 py-1 text-sm rounded-lg text-white bg-green-600 hover:bg-green-700">
                          حفظ
                        </button>
                        <button onClick={handleCancelEdit} className="px-3 py-1 text-sm rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-gray-800">{group.name}</span>
                        {assignedTeacher && <div className="text-xs text-gray-500">المدرس: {assignedTeacher.name}</div>}
                      </div>
                      <div className="flex gap-2 items-center self-end sm:self-center">
                        <button
                          onClick={() => handleStartEdit(group)}
                          className="px-3 py-1 text-sm rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => onDeleteGroup(group.id)}
                          className="px-3 py-1 text-sm rounded-lg text-red-700 bg-red-100 hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                          disabled={isGroupInUse(group.id)}
                          title={isGroupInUse(group.id) ? 'لا يمكن حذف مجموعة بها طلاب' : 'حذف المجموعة'}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-4">لا توجد مجموعات. قم بإضافة مجموعة جديدة.</p>
          )}
        </div>

        <div className="flex-shrink-0 mt-8 flex justify-end">
          <button type="button" onClick={onClose} className="px-8 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagerModal;