
import React, { useState, useEffect } from 'react';
import type { Teacher, Supervisor, GroupType } from '../types';
import { TeacherStatus, PaymentType } from '../types';
import UserIcon from './icons/UserIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import PhoneIcon from './icons/PhoneIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';


interface TeacherManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveTeacher: (teacherData: Omit<Teacher, 'id'>, teacherId?: string) => void;
    onSaveSupervisor: (supervisorData: Omit<Supervisor, 'id'>, supervisorId?: string) => void;
    teacherToEdit: Teacher | null;
    supervisorToEdit: Supervisor | null;
}

type Role = 'teacher' | 'supervisor';

const TeacherManagerModal: React.FC<TeacherManagerModalProps> = ({
    isOpen,
    onClose,
    onSaveTeacher,
    onSaveSupervisor,
    teacherToEdit,
    supervisorToEdit
}) => {
    const [role, setRole] = useState<Role>('teacher');

    // Common Fields
    const [name, setName] = useState('');
    const [salary, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<TeacherStatus>(TeacherStatus.ACTIVE);

    // Teacher Payment Type
    const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.SALARY);
    const [partnershipPercentage, setPartnershipPercentage] = useState('');

    // Supervisor Specific
    const [selectedSections, setSelectedSections] = useState<GroupType[]>(['قرآن']);

    const sectionOptions: GroupType[] = ['قرآن', 'نور بيان', 'تلقين'];

    // Reset and populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (supervisorToEdit) {
                setRole('supervisor');
                setName(supervisorToEdit.name);
                setPhone(supervisorToEdit.phone || '');
                setSalary(supervisorToEdit.salary?.toString() || '');
                setStatus(supervisorToEdit.status || TeacherStatus.ACTIVE);
                setPassword(supervisorToEdit.password);
                const sections = Array.isArray(supervisorToEdit.section) ? supervisorToEdit.section : (supervisorToEdit.section ? [supervisorToEdit.section] : []);
                setSelectedSections(sections as GroupType[]);
            } else if (teacherToEdit) {
                setRole('teacher');
                setName(teacherToEdit.name);
                setPhone(teacherToEdit.phone);
                setSalary(teacherToEdit.salary?.toString() || '');
                setStatus(teacherToEdit.status);
                setPassword('');
                setPaymentType(teacherToEdit.paymentType || PaymentType.SALARY);
                setPartnershipPercentage(teacherToEdit.partnershipPercentage?.toString() || '');
            } else {
                // New Entry Defaults
                // Note: We don't reset role here to persist user selection if they closed and reopened, 
                // unless specific requirement to always default to teacher.
                setName('');
                setPhone('');
                setSalary('');
                setStatus(TeacherStatus.ACTIVE);
                setPassword('');
                setSelectedSections(['قرآن']);
                setPaymentType(PaymentType.SALARY);
                setPartnershipPercentage('');
            }
        }
    }, [isOpen, teacherToEdit, supervisorToEdit]);

    const handleSectionChange = (section: GroupType) => {
        setSelectedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (role === 'teacher') {
            if (name.trim() && phone.trim()) {
                // Validate payment type specific fields
                if (paymentType === PaymentType.PARTNERSHIP) {
                    const percentage = parseFloat(partnershipPercentage);
                    if (!partnershipPercentage || percentage <= 0 || percentage > 100) {
                        alert("يرجى إدخال نسبة شراكة صحيحة (من 1 إلى 100)");
                        return;
                    }
                }

                const dataToSave: Omit<Teacher, 'id'> & { password?: string } = {
                    name: name.trim(),
                    phone: phone.trim(),
                    status: status,
                    paymentType: paymentType,
                };

                // Add salary or partnership percentage based on payment type
                if (paymentType === PaymentType.SALARY) {
                    dataToSave.salary = parseFloat(salary) || 0;
                } else {
                    dataToSave.partnershipPercentage = parseFloat(partnershipPercentage);
                }

                if (password.trim()) {
                    dataToSave.password = password.trim();
                }
                onSaveTeacher(dataToSave, teacherToEdit?.id);
                onClose();
            } else {
                alert("يرجى إدخال الاسم ورقم الهاتف للمدرس");
            }
        } else {
            // Supervisor
            if (name.trim() && password.trim() && selectedSections.length > 0) {
                onSaveSupervisor({
                    name: name.trim(),
                    password: password.trim(),
                    section: selectedSections,
                    salary: parseFloat(salary) || 0,
                    phone: phone.trim(),
                    status: status,
                }, supervisorToEdit?.id);
                onClose();
            } else {
                alert("يرجى إدخال الاسم، كلمة المرور، واختيار قسم واحد على الأقل للمشرف");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {teacherToEdit ? 'تعديل بيانات المدرس' : (supervisorToEdit ? 'تعديل بيانات المشرف' : 'إضافة موظف جديد')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Role Switcher - Only visible when adding new */}
                    {!teacherToEdit && !supervisorToEdit && (
                        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all duration-200 ${role === 'teacher' ? 'bg-white text-teal-700 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                <BriefcaseIcon className="w-4 h-4" />
                                مدرس
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('supervisor')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all duration-200 ${role === 'supervisor' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                <UserIcon className="w-4 h-4" />
                                مشرف
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Basic Info Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">الاسم</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pr-10 pl-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="الاسم الكامل" required />
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">رقم الهاتف</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pr-10 pl-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="رقم الهاتف" required={role === 'teacher'} />
                                </div>
                            </div>
                        </div>

                        {/* Payment Type Selection - Only for Teachers */}
                        {role === 'teacher' && (
                            <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-xl border border-teal-100">
                                <label className="block text-sm font-bold text-teal-800 mb-3">نوع المحاسبة:</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType(PaymentType.SALARY)}
                                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border ${paymentType === PaymentType.SALARY
                                                ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-105'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                            }`}
                                    >
                                        💰 راتب ثابت
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType(PaymentType.PARTNERSHIP)}
                                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border ${paymentType === PaymentType.PARTNERSHIP
                                                ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                                            }`}
                                    >
                                        🤝 شراكة
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Financial & Auth Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Salary or Partnership Percentage based on payment type */}
                            {role === 'teacher' ? (
                                paymentType === PaymentType.SALARY ? (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">الراتب الأساسي</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={salary}
                                                onChange={(e) => setSalary(e.target.value)}
                                                className="w-full pr-10 pl-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">نسبة الشراكة (%)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-bold">%</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={partnershipPercentage}
                                                onChange={(e) => setPartnershipPercentage(e.target.value)}
                                                className="w-full pr-10 pl-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                                                placeholder="مثال: 30"
                                                min="1"
                                                max="100"
                                                step="0.1"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">أدخل النسبة المئوية من المحصل (من 1 إلى 100)</p>
                                    </div>
                                )
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">الراتب الأساسي</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full pr-10 pl-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="0.00" />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">كلمة المرور</label>
                                <input
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={teacherToEdit ? "اترك فارغاً لعدم التغيير" : "كلمة المرور"}
                                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    required={(!teacherToEdit && !supervisorToEdit) || role === 'supervisor'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">الحالة</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value as TeacherStatus)} className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                                <option value={TeacherStatus.ACTIVE}>نشط</option>
                                <option value={TeacherStatus.INACTIVE}>غير نشط</option>
                            </select>
                        </div>

                        {/* Supervisor Specific Sections */}
                        {role === 'supervisor' && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <label className="block text-sm font-bold text-blue-800 mb-3">الأقسام المسؤول عنها:</label>
                                <div className="flex flex-wrap gap-2">
                                    {sectionOptions.map(sec => {
                                        const isSelected = selectedSections.includes(sec);
                                        return (
                                            <button
                                                key={sec}
                                                type="button"
                                                onClick={() => handleSectionChange(sec)}
                                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                    }`}
                                            >
                                                {sec}
                                                {isSelected && <span className="mr-2 text-blue-200">✓</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedSections.length === 0 && <p className="text-xs text-red-500 mt-2">يجب اختيار قسم واحد على الأقل.</p>}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t mt-6">
                            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold transition-colors order-2 sm:order-1">إلغاء</button>
                            <button type="submit" className={`px-8 py-2.5 rounded-lg text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-all order-1 sm:order-2 ${role === 'teacher' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                                حفظ البيانات
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherManagerModal;
