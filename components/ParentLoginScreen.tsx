import React, { useState } from 'react';
import type { Parent } from '../types';

interface ParentLoginScreenProps {
    onLogin: (phone: string, password: string) => void;
    parents: Parent[];
}

const ParentLoginScreen: React.FC<ParentLoginScreenProps> = ({ onLogin, parents }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (phone.length !== 11) {
            setError('رقم الهاتف يجب أن يكون 11 رقم');
            return;
        }

        if (password.length !== 6 || !/^\d+$/.test(password)) {
            setError('كلمة المرور يجب أن تكون 6 أرقام');
            return;
        }

        const fullPhone = '02' + phone;
        const parent = parents.find(p => p.phone === fullPhone);
        if (!parent) {
            setError('لا يوجد حساب مسجل بهذا الرقم. يرجى التواصل مع الإدارة');
            return;
        }

        if (parent.password !== password) {
            setError('كلمة المرور غير صحيحة');
            return;
        }

        onLogin(fullPhone, password);
    };

    const handlePhoneChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, '');
        setPhone(numbersOnly.slice(0, 11));
    };

    const handlePasswordChange = (value: string) => {
        const numbersOnly = value.replace(/\D/g, '');
        setPassword(numbersOnly.slice(0, 6));
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">تسجيل دخول ولي الأمر</h2>
                <p className="text-gray-500 text-sm">أهلاً بك في بوابة أولياء أمور مركز الشاطبي</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
                        <span>رقم الهاتف</span>
                        <span className={`text-xs ${phone.length === 11 ? 'text-green-500' : 'text-gray-400'}`}>{phone.length}/11</span>
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="01xxxxxxxxx"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center text-lg font-semibold tracking-wider outline-none"
                            dir="ltr"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
                        <span>كلمة المرور (6 أرقام)</span>
                        <span className={`text-xs ${password.length === 6 ? 'text-green-500' : 'text-gray-400'}`}>{password.length}/6</span>
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all text-center text-2xl font-bold tracking-[0.5em] outline-none"
                            dir="ltr"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm animate-shake">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 active:scale-[0.98] text-lg"
                >
                    دخول البوابة
                </button>
            </form>

            <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">نسيت بيانات الدخول؟</p>
                <p className="text-xs text-gray-500">يرجى مراجعة إدارة المركز للحصول على بيانات حسابك.</p>
            </div>
        </div>
    );
};


export default ParentLoginScreen;
