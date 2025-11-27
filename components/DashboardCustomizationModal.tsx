import React, { useState, useEffect } from 'react';
// Fix: Import DashboardModule from the central types file.
import type { DashboardModule } from '../types';
import GripVerticalIcon from './icons/GripVerticalIcon';

interface DashboardCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: DashboardModule[];
  onSave: (modules: DashboardModule[]) => void;
}

const DashboardCustomizationModal: React.FC<DashboardCustomizationModalProps> = ({ isOpen, onClose, modules, onSave }) => {
  const [localModules, setLocalModules] = useState<DashboardModule[]>([]);
  const [draggedItem, setDraggedItem] = useState<DashboardModule | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalModules([...modules]);
    }
  }, [isOpen, modules]);

  if (!isOpen) return null;

  const handleVisibilityChange = (id: string) => {
    setLocalModules(prev =>
      prev.map(m => (m.id === id ? { ...m, visible: !m.visible } : m))
    );
  };

  const handleDragStart = (module: DashboardModule) => {
    setDraggedItem(module);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetModule: DashboardModule) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetModule.id) return;
    
    const currentIndex = localModules.findIndex(m => m.id === draggedItem.id);
    const targetIndex = localModules.findIndex(m => m.id === targetModule.id);
    
    if (currentIndex === -1 || targetIndex === -1) return;

    const newModules = [...localModules];
    const [removed] = newModules.splice(currentIndex, 1);
    newModules.splice(targetIndex, 0, removed);
    setLocalModules(newModules);
  };

  const handleSave = () => {
    onSave(localModules);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">تخصيص لوحة التحكم</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-3">الوحدات المعروضة وترتيبها</h3>
          <p className="text-sm text-gray-500 mb-4">يمكنك إظهار أو إخفاء الوحدات، واسحب وأفلت لترتيبها حسب الأهمية لك.</p>
          <div className="space-y-2">
            {localModules.map(module => (
              <div 
                  key={module.id} 
                  draggable
                  onDragStart={() => handleDragStart(module)}
                  onDragOver={(e) => handleDragOver(e, module)}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`flex items-center justify-between bg-gray-100 p-3 rounded-lg cursor-grab ${draggedItem?.id === module.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center">
                    <GripVerticalIcon className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="font-medium text-gray-800">{module.title}</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={module.visible} onChange={() => handleVisibilityChange(module.id)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors order-2 sm:order-1">إلغاء</button>
            <button type="button" onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors order-1 sm:order-2">حفظ التغييرات</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomizationModal;
