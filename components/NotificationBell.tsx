

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { CurrentUser, Notification, Group } from '../types';
import BellIcon from './icons/BellIcon';
import TrashIcon from './icons/TrashIcon';

interface NotificationBellProps {
    currentUser: Extract<CurrentUser, { role: 'teacher' }>;
    notifications: Notification[];
    groups: Group[];
    onMarkAsRead: (notificationIds: string[], teacherId: string) => void;
    onDelete: (notificationIds: string[], teacherId: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ currentUser, notifications, groups, onMarkAsRead, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const teacherGroups = useMemo(() => {
        return groups.filter(g => g.teacherId === currentUser.id).map(g => g.id);
    }, [groups, currentUser.id]);

    const relevantNotifications = useMemo(() => {
        return notifications
            .filter(n => {
                let isTarget = false;
                // 1. Check if targeted by type/id
                if (n.target) {
                    if (n.target.type === 'teacher') {
                        isTarget = n.target.id === currentUser.id;
                    } else if (n.target.type === 'group') {
                        isTarget = teacherGroups.includes(n.target.id);
                    }
                }
                // 2. Check if public notification
                else if ((n as any).recipientId === 'all') {
                    isTarget = true;
                }

                // 3. Check if NOT deleted by current user
                const isDeleted = n.deletedBy?.includes(currentUser.id);

                return isTarget && !isDeleted;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [notifications, currentUser.id, teacherGroups]);

    const unreadNotifications = useMemo(() => {
        return relevantNotifications.filter(n => !n.readBy?.includes(currentUser.id));
    }, [relevantNotifications, currentUser.id]);


    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        if (isOpen && unreadNotifications.length > 0) {
            const idsToMark = unreadNotifications.map(n => n.id);
            // Delay marking as read slightly to allow dropdown to render
            setTimeout(() => onMarkAsRead(idsToMark, currentUser.id), 500);
        }
    }, [isOpen, unreadNotifications, onMarkAsRead, currentUser.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClearRead = () => {
        const readNotificationIds = relevantNotifications
            .filter(n => n.readBy?.includes(currentUser.id))
            .map(n => n.id);

        if (readNotificationIds.length > 0) {
            onDelete(readNotificationIds, currentUser.id);
        }
    };

    const handleClearAll = () => {
        const allNotificationIds = relevantNotifications.map(n => n.id);
        if (allNotificationIds.length > 0) {
            if (window.confirm("هل أنت متأكد من مسح جميع الإشعارات؟")) {
                onDelete(allNotificationIds, currentUser.id);
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                <BellIcon className="w-6 h-6" />
                {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-[90vw] max-w-sm bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
                    <div className="flex justify-between items-center py-3 px-4 border-b bg-gray-50">
                        <span className="font-bold text-gray-700">الإشعارات</span>
                        {relevantNotifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs font-semibold text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                            >
                                مسح الكل
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {relevantNotifications.length > 0 ? (
                            relevantNotifications.map(n => {
                                let targetLabel = 'إشعار عام';
                                if (n.target) {
                                    targetLabel = n.target.type === 'group' ? `موجه إلى: ${n.target.name}` : `رسالة خاصة`;
                                } else if ((n as any).recipientId === 'all') {
                                    targetLabel = 'إشعار عام للجميع';
                                }

                                return (
                                    <div key={n.id} className={`p-4 border-b text-sm ${!n.readBy?.includes(currentUser.id) ? 'bg-blue-50' : 'bg-white'}`}>
                                        <div className="mb-2">
                                            <p className="text-gray-800">{n.content}</p>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete([n.id], currentUser.id); }}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
                                                title="حذف الإشعار"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                <span className="text-xs">حذف</span>
                                            </button>

                                            <div className="text-xs text-gray-500 flex flex-col items-end">
                                                <span>
                                                    {targetLabel}
                                                </span>
                                                <span>{new Date(n.date).toLocaleString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="p-8 text-sm text-center text-gray-500">لا توجد إشعارات.</p>
                        )}
                    </div>
                    {relevantNotifications.length > 0 && relevantNotifications.some(n => n.readBy?.includes(currentUser.id)) && (
                        <div className="p-2 bg-gray-50 border-t">
                            <button
                                onClick={handleClearRead}
                                className="w-full py-2 text-sm text-gray-600 font-semibold hover:bg-gray-100 rounded transition-colors"
                            >
                                مسح المقروء فقط
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(NotificationBell);