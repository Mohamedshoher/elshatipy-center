import React, { useState } from 'react';
import { CurrentUser, Teacher, Supervisor, TeacherStatus, GroupType, Parent } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserIcon from './icons/UserIcon';

interface LoginScreenProps {
    onLogin: (user: CurrentUser) => void;
    teachers: Teacher[];
    supervisors: Supervisor[];
    parents: Parent[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, teachers, supervisors, parents }) => {
    const [loginType, setLoginType] = useState<'director' | 'supervisor' | 'teacher' | 'parent'>('parent');
    const [directorPassword, setDirectorPassword] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [supervisorPassword, setSupervisorPassword] = useState('');

    // Parent Login State
    const [parentPhone, setParentPhone] = useState('');
    const [parentPassword, setParentPassword] = useState('');
    const [parentError, setParentError] = useState('');

    const activeTeachers = teachers.filter(t => t.status === TeacherStatus.ACTIVE);
    const DIRECTOR_PASSWORD = '446699';

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

    const handleParentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setParentError('');

        if (parentPhone.length !== 11) {
            setParentError('رقم الهاتف يجب أن يكون 11 رقم');
            return;
        }

        if (parentPassword.length !== 6 || !/^\d+$/.test(parentPassword)) {
            setParentError('كلمة المرور يجب أن تكون 6 أرقام');
            return;
        }

        const fullPhone = '02' + parentPhone;
        const parent = parents.find(p => p.phone === fullPhone);

        if (!parent) {
            setParentError('لا يوجد حساب مسجل بهذا الرقم. يرجى التواصل مع الإدارة');
            return;
        }

        if (parent.password !== parentPassword) {
            setParentError('كلمة المرور غير صحيحة');
            return;
        }

        onLogin({
            role: 'parent',
            id: parent.id,
            name: parent.name,
            phone: parent.phone,
            studentIds: parent.studentIds
        });
    };

    const onParentPhoneChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, '');
        setParentPhone(numbersOnly.slice(0, 11));
    };

    const onParentPasswordChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, '');
        setParentPassword(numbersOnly.slice(0, 6));
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Tabs Selection */}
            <div className="flex justify-center mb-6 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200">
                <button
                    onClick={() => setLoginType('parent')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-base transition-all duration-300 ${loginType === 'parent' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                >
                    ولي الأمر
                </button>
                <button
                    onClick={() => { if (loginType === 'parent') setLoginType('teacher'); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-base transition-all duration-300 ${loginType !== 'parent' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
                >
                    الإدارة
                </button>
            </div>

            {/* Sub-tabs for Role Selection (Only for Staff) */}
            {loginType !== 'parent' && (
                <div className="flex justify-center mb-8 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar scroll-smooth animate-in slide-in-from-top-2 duration-300">
                    <button
                        onClick={() => setLoginType('director')}
                        className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg font-bold text-xs transition-all duration-300 whitespace-nowrap ${loginType === 'director' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        المدير
                    </button>
                    <button
                        onClick={() => setLoginType('supervisor')}
                        className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg font-bold text-xs transition-all duration-300 whitespace-nowrap ${loginType === 'supervisor' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        المشرف
                    </button>
                    <button
                        onClick={() => setLoginType('teacher')}
                        className={`flex-1 min-w-[70px] py-2 px-2 rounded-lg font-bold text-xs transition-all duration-300 whitespace-nowrap ${loginType === 'teacher' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        المدرس
                    </button>
                </div>
            )}

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                            <input
                                type="password"
                                value={directorPassword}
                                onChange={(e) => setDirectorPassword(e.target.value)}
                                placeholder="••••••••"
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المشرف</label>
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                                <input
                                    type="password"
                                    value={supervisorPassword}
                                    onChange={(e) => setSupervisorPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-center text-lg font-bold outline-none"
                                    required
                                    disabled={!selectedSupervisorId}
                                />
                            </div>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدرس</label>
                                    <select
                                        value={selectedTeacherId}
                                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center font-bold outline-none appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>-- اختر اسم المدرس --</option>
                                        {activeTeachers.map(teacher => (<option key={teacher.id} value={teacher.id}>{teacher.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                                    <input
                                        type="password"
                                        value={teacherPassword}
                                        onChange={(e) => setTeacherPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center text-lg font-bold outline-none"
                                        required
                                        disabled={!selectedTeacherId}
                                    />
                                </div>
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

                {loginType === 'parent' && (
                    <form onSubmit={handleParentLogin} className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">دخول ولي الأمر</h3>
                            <p className="text-gray-500 text-sm mt-1">متابعة الأبناء والتواصل مع المركز</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                    <span>رقم الهاتف</span>
                                    <span className={`text-xs ${parentPhone.length === 11 ? 'text-green-500' : 'text-gray-400'}`}>{parentPhone.length}/11</span>
                                </label>
                                <input
                                    type="tel"
                                    value={parentPhone}
                                    onChange={(e) => onParentPhoneChange(e.target.value)}
                                    placeholder="01xxxxxxxxx"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-center text-lg font-bold outline-none tracking-widest"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                                    <span>كلمة المرور (6 أرقام)</span>
                                    <span className={`text-xs ${parentPassword.length === 6 ? 'text-green-500' : 'text-gray-400'}`}>{parentPassword.length}/6</span>
                                </label>
                                <input
                                    type="password"
                                    value={parentPassword}
                                    onChange={(e) => onParentPasswordChange(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-center text-lg font-bold outline-none tracking-[0.5em]"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {parentError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>{parentError}</p>
                            </div>
                        )}

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] text-lg">
                            دخول كولي أمر
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginScreen;

