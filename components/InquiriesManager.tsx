import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { LandingPageInquiry } from '../types';
import XIcon from './icons/XIcon';
import TrashIcon from './icons/TrashIcon';

const InquiriesManager: React.FC = () => {
    const [inquiries, setInquiries] = useState<LandingPageInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(
            collection(db, 'landingPageInquiries'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LandingPageInquiry[];
            setInquiries(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا البيان؟')) {
            try {
                await deleteDoc(doc(db, 'landingPageInquiries', id));
            } catch (error) {
                console.error('Error deleting inquiry:', error);
            }
        }
    };

    const handleToggleStatus = async (inquiry: LandingPageInquiry) => {
        try {
            const newStatus = inquiry.status === 'new' ? 'viewed' : 'new';
            await updateDoc(doc(db, 'landingPageInquiries', inquiry.id), {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const dataString = JSON.stringify(inq.data).toLowerCase();
        return dataString.includes(searchTerm.toLowerCase()) ||
            inq.sectionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span>📩</span> البيانات المستلمة من النماذج
                </h2>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="بحث في البيانات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm text-sm"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {filteredInquiries.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold">لا توجد بيانات مستلمة حالياً</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredInquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`bg-white rounded-2xl shadow-sm border-r-4 p-5 transition-all hover:shadow-md ${inq.status === 'new' ? 'border-r-purple-600' : 'border-r-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase">
                                            {inq.sectionTitle}
                                        </span>
                                        {inq.status === 'new' && (
                                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                                                جديد
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">
                                        📅 {new Date(inq.createdAt).toLocaleString('ar-EG')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(inq)}
                                        className={`p-2 rounded-lg transition-colors ${inq.status === 'new'
                                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                            }`}
                                        title={inq.status === 'new' ? 'تحديد كمقروء' : 'تحديد كجديد'}
                                    >
                                        {inq.status === 'new' ? '👁️' : '📁'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inq.id)}
                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        title="حذف"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                {Object.entries(inq.data || {}).map(([key, value]) => {
                                    // Find field label if possible (not trivial here without full content)
                                    // For now just show key-value
                                    return (
                                        <div key={key} className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key}</p>
                                            <p className="text-sm text-gray-800 font-semibold break-words">
                                                {value?.toString() || '-'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InquiriesManager;
