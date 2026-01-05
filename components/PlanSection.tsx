import React, { useState } from 'react';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { Student, ProgressPlan, TestType, ProgressPlanRecord, CurrentUser } from '../types';

interface PlanSectionProps {
    title: string;
    type: TestType;
    student: Student;
    currentUser: CurrentUser | null;
    onUpdate: (studentId: string, updatedRecord: ProgressPlanRecord, modifierName: string) => void;
    onDelete: (studentId: string, planId: string) => void;
    onToggleCompletion: (studentId: string, planId: string) => void;
    colorClass: 'blue' | 'indigo' | 'purple';
    icon: React.ReactNode;
}

const PlanSection: React.FC<PlanSectionProps> = ({
    title,
    type,
    student,
    currentUser,
    onUpdate,
    onDelete,
    onToggleCompletion,
    colorClass,
    icon
}) => {
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const getColor = (shade: number) => {
        const colors = {
            blue: { 50: 'bg-blue-50', 100: 'bg-blue-100', 600: 'text-blue-600', 700: 'text-blue-700', border: 'border-blue-200' },
            indigo: { 50: 'bg-indigo-50', 100: 'bg-indigo-100', 600: 'text-indigo-600', 700: 'text-indigo-700', border: 'border-indigo-200' },
            purple: { 50: 'bg-purple-50', 100: 'bg-purple-100', 600: 'text-purple-600', 700: 'text-purple-700', border: 'border-purple-200' }
        };
        // @ts-ignore
        return colors[colorClass][shade] || '';
    };

    const handleEditStart = (record: ProgressPlanRecord) => {
        setEditingRecordId(record.id);
        setEditValue(record.plan[type] || '');
    };

    const handleEditSave = (record: ProgressPlanRecord) => {
        const modifierName = currentUser?.role === 'director' ? 'المدير' : (currentUser?.name || 'مجهول');
        const updatedRecord: ProgressPlanRecord = {
            ...record,
            plan: {
                ...record.plan,
                [type]: editValue
            },
            modifiedBy: modifierName,
            modifiedDate: new Date().toISOString()
        };
        onUpdate(student.id, updatedRecord, modifierName);
        setEditingRecordId(null);
        setEditValue('');
    };

    // Filter history to show only records that contain this specific plan type
    const history = (student.progressPlanHistory || [])
        .filter(record => record.plan[type] && record.plan[type]!.trim() !== '')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const canEdit = currentUser?.role === 'director' || currentUser?.role === 'supervisor';

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className={`p-4 border-b flex items-center gap-3 ${getColor(50)}`}>
                <div className={`p-2 rounded-lg bg-white shadow-sm ${getColor(600)}`}>
                    {icon}
                </div>
                <h3 className={`text-lg font-bold ${getColor(700)}`}>{title}</h3>
            </div>

            {/* History List */}
            <div className={`border-t border-gray-100 p-6 ${getColor(50)}`}>
                <h4 className="font-bold text-gray-600 mb-4 text-sm px-1">سجل {title} السابق</h4>
                <div className="space-y-3">
                    {history.length > 0 ? (
                        history.map(record => (
                            <div key={record.id} className={`p-4 rounded-xl border bg-white shadow-sm transition-all group hover:border-${colorClass}-200`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                                {new Date(record.date).toLocaleDateString('ar-EG')}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getColor(100)} ${getColor(700)}`}>
                                                بواسطة: {record.authorName}
                                            </span>
                                            {record.modifiedBy && (
                                                <span className="text-[10px] text-gray-300">
                                                    (عدل بواسطة {record.modifiedBy})
                                                </span>
                                            )}
                                        </div>

                                        {editingRecordId === record.id ? (
                                            <div className="flex gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-grow px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleEditSave(record)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setEditingRecordId(null)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                                                    <span className="text-xs font-bold">إلغاء</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <p className={`text-gray-800 text-sm leading-relaxed ${record.isCompleted ? 'line-through text-gray-400' : ''}`}>
                                                {record.plan[type]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0">
                                        {/* Mark Complete */}
                                        <button
                                            onClick={() => onToggleCompletion(student.id, record.id)}
                                            className={`transition-colors ${record.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                                            title={record.isCompleted ? 'غير مكتمل' : 'مكتمل'}
                                        >
                                            <CheckCircleIcon className="w-6 h-6" />
                                        </button>

                                        {/* Edit/Delete Actions (Director/Supervisor only) */}
                                        {canEdit && (
                                            <>
                                                <button
                                                    onClick={() => handleEditStart(record)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <EditIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
                                                            onDelete(student.id, record.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 px-4 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                            لا يوجد سجل سابق
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanSection;
