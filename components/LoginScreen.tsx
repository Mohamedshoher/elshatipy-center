import React, { useState } from 'react';
import { CurrentUser, Teacher, Supervisor, TeacherStatus, GroupType } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserIcon from './icons/UserIcon';

interface LoginScreenProps {
    onLogin: (user: CurrentUser) => void;
    teachers: Teacher[];
    supervisors: Supervisor[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, teachers, supervisors }) => {
    const [loginType, setLoginType] = useState<'director' | 'supervisor' | 'teacher'>('director');
    const [directorPassword, setDirectorPassword] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [supervisorPassword, setSupervisorPassword] = useState('');

    const activeTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);
    const DIRECTOR_PASSWORD = 'admin123';

    const handleDirectorLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (directorPassword === DIRECTOR_PASSWORD) {
            onLogin({ role: 'director' });
        } else {
            alert('كلمة مرور المدير غير صحيحة.');
            setDirectorPassword('');
        }
    };
    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const teacher = teachers.find(t => t.id === selectedTeacherId);
        if (teacher && teacher.password === teacherPassword) {
            onLogin({ role: 'teacher', id: teacher.id, name: teacher.name });
        } else {
            alert('كلمة مرور المدرس غير صحيحة أو لم يتم اختيار مدرس.');
            setTeacherPassword('');
        }
    };

    const handleSupervisorLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const supervisor = supervisors.find(s => s.id === selectedSupervisorId);
        if (supervisor && supervisor.password === supervisorPassword) {
            const sections = Array.isArray(supervisor.section) ? supervisor.section : (supervisor.section ? [supervisor.section] : []);
            onLogin({ role: 'supervisor', id: supervisor.id, name: supervisor.name, section: sections as GroupType[] });
        } else {
            alert('كلمة مرور المشرف غير صحيحة أو لم يتم اختيار مشرف.');
            setSupervisorPassword('');
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sub-tabs for Role Selection */}
            <div className="flex justify-center mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setLoginType('director')}
                    className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${loginType === 'director' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                >
                    المدير
                </button>
                <button
                    onClick={() => setLoginType('supervisor')}
                    className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${loginType === 'supervisor' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                >
                    المشرف
                </button>
                <button
                    onClick={() => setLoginType('teacher')}
                    className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-300 ${loginType === 'teacher' ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                >
                    المدرس
                </button>
            </div>

            <div className="min-h-[320px]">
                {loginType === 'director' && (
                    <form onSubmit={handleDirectorLogin} className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                                <BriefcaseIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">دخول الإدارة</h3>
                            <p className="text-gray-500 text-sm mt-1">وصول كامل لجميع البيانات والصلاحيات</p>
                        </div>
                        <div>
                            <input
                                type="password"
                                value={directorPassword}
                                onChange={(e) => setDirectorPassword(e.target.value)}
                                placeholder="كلمة المرور"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-lg font-bold outline-none"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-lg">
                            دخول كمدير
                        </button>
                    </form>
                )}

                {loginType === 'supervisor' && (
                    <form onSubmit={handleSupervisorLogin} className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                                <UserIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">دخول المشرفين</h3>
                            <p className="text-gray-500 text-sm mt-1">إشراف علمي ومالي على الأقسام</p>
                        </div>
                        <div className="space-y-4">
                            <select
                                value={selectedSupervisorId}
                                onChange={(e) => setSelectedSupervisorId(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center font-bold outline-none appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled>-- اختر اسم المشرف --</option>
                                {supervisors.map(s => {
                                    const sectionDisplay = Array.isArray(s.section) ? s.section.join('، ') : s.section;
                                    return <option key={s.id} value={s.id}>{s.name} ({sectionDisplay})</option>
                                })}
                            </select>
                            <input
                                type="password"
                                value={supervisorPassword}
                                onChange={(e) => setSupervisorPassword(e.target.value)}
                                placeholder="كلمة المرور"
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-lg font-bold outline-none"
                                required
                                disabled={!selectedSupervisorId}
                            />
                        </div>
                        <button type="submit" disabled={!selectedSupervisorId} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] text-lg disabled:opacity-50">
                            دخول كمشرف
                        </button>
                    </form>
                )}

                {loginType === 'teacher' && (
                    <div className="animate-in slide-in-from-left-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
                                <UserIcon className="w-8 h-8 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">دخول المدرسين</h3>
                            <p className="text-gray-500 text-sm mt-1">المتابعة العلمية للطلاب والمجموعات</p>
                        </div>

                        {activeTeachers.length > 0 ? (
                            <form onSubmit={handleTeacherLogin} className="space-y-4">
                                <select
                                    value={selectedTeacherId}
                                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center font-bold outline-none appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>-- اختر اسم المدرس --</option>
                                    {activeTeachers.map(teacher => (<option key={teacher.id} value={teacher.id}>{teacher.name}</option>))}
                                </select>
                                <input
                                    type="password"
                                    value={teacherPassword}
                                    onChange={(e) => setTeacherPassword(e.target.value)}
                                    placeholder="كلمة المرور"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center text-lg font-bold outline-none"
                                    required
                                    disabled={!selectedTeacherId}
                                />
                                <button type="submit" disabled={!selectedTeacherId} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-teal-500/25 active:scale-[0.98] text-lg disabled:opacity-50">
                                    دخول كمدرس
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                <p className="text-gray-400 font-medium whitespace-pre-wrap">لا يوجد مدرسون نشطون حالياً</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;
