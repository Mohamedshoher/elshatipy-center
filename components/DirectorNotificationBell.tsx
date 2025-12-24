
import React, { useState, useEffect, useRef } from 'react';
import type { DirectorNotification } from '../types';
import BellIcon from './icons/BellIcon';
import TrashIcon from './icons/TrashIcon';

interface DirectorNotificationBellProps {
    notifications: DirectorNotification[];
    onMarkAsRead: (notificationIds: string[]) => void;
    onDelete: (notificationIds: string[]) => void;
}

const DirectorNotificationBell: React.FC<DirectorNotificationBellProps> = ({ notifications, onMarkAsRead, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadNotifications = notifications.filter(n => !n.isRead);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };
    
    useEffect(() => {
        if (isOpen && unreadNotifications.length > 0) {
            const idsToMark = unreadNotifications.map(n => n.id);
            // Delay marking as read slightly to allow dropdown to render
            const timer = setTimeout(() => onMarkAsRead(idsToMark), 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, unreadNotifications, onMarkAsRead]);

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

    const handleClearAll = () => {
        const allNotificationIds = notifications.map(n => n.id);
        if (allNotificationIds.length > 0) {
            onDelete(allNotificationIds);
        }
    };

    const renderContent = (notification: DirectorNotification) => {
        const prefix = 'المدرس ';
        const teacherName = notification.teacherName;

        if (notification.content.startsWith(`${prefix}${teacherName}`)) {
            const restOfMessage = notification.content.substring((`${prefix}${teacherName}`).length);
            return (
                <>
                    {prefix}
                    <span className="font-bold text-red-600">{teacherName}</span>
                    {restOfMessage}
                </>
            );
        }
        return notification.content;
    };


    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="relative p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                <BellIcon className="w-6 h-6" />
                {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white">
                         <span className="absolute -inset-1.5 animate-ping rounded-full bg-red-500 opacity-75"></span>
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-[90vw] max-w-sm bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
                   <div className="flex justify-between items-center py-3 px-4 border-b bg-gray-50">
                        <span className="font-bold text-gray-700">الإشعارات</span>
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleClearAll}
                                className="text-xs font-semibold text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                            >
                                مسح الكل
                            </button>
                        )}
                   </div>
                    <div className="overflow-y-auto flex-1">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b transition-colors duration-300 ${!n.isRead ? 'bg-blue-50' : 'bg-white'}`}>
                                    <div className="mb-2">
                                        <p className="text-gray-800 text-base break-words">{renderContent(n)}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-2">
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete([n.id]); }}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
                                            title="حذف الإشعار"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            <span className="text-xs">حذف</span>
                                        </button>
                                        
                                        <div className="text-xs text-gray-500 flex flex-col items-end">
                                            <span>{new Date(n.forDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            <span className="text-gray-400">{new Date(n.date).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-sm text-center text-gray-500">لا توجد إشعارات.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorNotificationBell;
