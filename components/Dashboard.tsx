import React, { useState } from 'react';
// Fix: Import DashboardModule and DashboardData from the central types file.
import type { DashboardModule, DashboardData } from '../types';
import CogIcon from './icons/CogIcon';
import CreditCardOffIcon from './icons/CreditCardOffIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import UsersIcon from './icons/UsersIcon';

interface DashboardProps {
  modules: DashboardModule[];
  data: DashboardData;
  onReorder: (reorderedModules: DashboardModule[]) => void;
  onCustomize: () => void;
  onOpenStudentForm: () => void;
  onOpenGroupManager: () => void;
}

const moduleIcons: Record<string, React.ReactNode> = {
  stats: <CalendarCheckIcon className="w-8 h-8 text-blue-500" />,
  unpaid: <CreditCardOffIcon className="w-8 h-8 text-red-500" />,
  notes: <ClipboardListIcon className="w-8 h-8 text-yellow-500" />,
  actions: <UserPlusIcon className="w-8 h-8 text-green-500" />,
};

const Dashboard: React.FC<DashboardProps> = ({ modules, data, onReorder, onCustomize, onOpenStudentForm, onOpenGroupManager }) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const visibleModules = modules.filter(m => m.visible);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, module: DashboardModule) => {
    setDraggedItemId(module.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetModule: DashboardModule) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetModule.id) {
      return;
    }

    const dragIndex = modules.findIndex(m => m.id === draggedItemId);
    const dropIndex = modules.findIndex(m => m.id === targetModule.id);

    if (dragIndex === -1 || dropIndex === -1) return;

    const reordered = [...modules];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    onReorder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };


  const renderModuleContent = (module: DashboardModule) => {
    switch (module.id) {
      case 'stats':
        return (
          <div className="flex justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-green-600">{data.dailyAttendance.present}</p>
              <p className="text-sm text-gray-500">حضور اليوم</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">{data.dailyAttendance.absent}</p>
              <p className="text-sm text-gray-500">غياب اليوم</p>
            </div>
          </div>
        );
      case 'unpaid':
        return (
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600">{data.unpaidStudentsCount}</p>
            <p className="text-sm text-gray-500 mt-1">طالب لم يسدد</p>
          </div>
        );
      case 'notes':
        return (
          <div className="text-center">
            <p className="text-4xl font-bold text-yellow-600">{data.unacknowledgedNotesCount}</p>
            <p className="text-sm text-gray-500 mt-1">ملحوظة للمراجعة</p>
          </div>
        );
      case 'actions':
        return (
          <div className="flex flex-col space-y-2">
            <button onClick={onOpenStudentForm} className="w-full flex items-center justify-center gap-2 text-center py-2 px-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              <UserPlusIcon className="w-5 h-5" />
              <span>إضافة طالب</span>
            </button>
            <button onClick={onOpenGroupManager} className="w-full flex items-center justify-center gap-2 text-center py-2 px-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
              <UsersIcon className="w-5 h-5" />
              <span>إدارة المجموعات</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (visibleModules.length === 0) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">لوحة التحكم</h2>
        <button onClick={onCustomize} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-semibold transition-colors">
          <CogIcon className="w-5 h-5" />
          <span>تخصيص</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleModules.map(module => (
          <div
            key={module.id}
            draggable
            onDragStart={(e) => handleDragStart(e, module)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, module)}
            onDragEnd={handleDragEnd}
            className={`bg-white rounded-xl shadow-md p-5 flex flex-col justify-between cursor-grab transition-all duration-300 ${draggedItemId === module.id ? 'opacity-40 scale-95 ring-2 ring-blue-500 ring-offset-2' : 'opacity-100'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-600">{module.title}</h3>
              {moduleIcons[module.id]}
            </div>
            <div>{renderModuleContent(module)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
