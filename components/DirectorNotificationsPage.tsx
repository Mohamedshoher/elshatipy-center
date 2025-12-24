
import React, { useState, useMemo } from 'react';
import type { Teacher, Group, Notification } from '../types';
import MessageIcon from './icons/MessageIcon';
import FilterIcon from './icons/FilterIcon';

interface DirectorNotificationsPageProps {
  onBack: () => void;
  teachers: Teacher[];
  groups: Group[];
  notifications: Notification[];
  onSendNotification: (target: { type: 'teacher'; id: string } | { type: 'group'; id: string; name: string }, content: string) => void;
}

const DirectorNotificationsPage: React.FC<DirectorNotificationsPageProps> = React.memo(({ onBack, teachers, groups, notifications, onSendNotification }) => {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [content, setContent] = useState('');

  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterTargetId, setFilterTargetId] = useState('all');
  const [displayLimit, setDisplayLimit] = useState(30);

  const teachersMap = useMemo(() => {
    return new Map(teachers.map(t => [t.id, t.name]));
  }, [teachers]);

  const sortedTeachers = useMemo(() => {
    return [...teachers].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [teachers]);

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [groups]);

  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleAllTeachers = () => {
    if (selectedTeachers.length === teachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(teachers.map(t => t.id));
    }
  };

  const toggleAllGroups = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map(g => g.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((selectedTeachers.length === 0 && selectedGroups.length === 0) || !content.trim()) {
      alert('يرجى اختيار مستلم واحد على الأقل وكتابة محتوى الرسالة.');
      return;
    }

    selectedTeachers.forEach(teacherId => {
      onSendNotification({ type: 'teacher', id: teacherId }, content.trim());
    });

    selectedGroups.forEach(groupId => {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        onSendNotification({ type: 'group', id: groupId, name: group.name }, content.trim());
      }
    });

    setContent('');
    setSelectedTeachers([]);
    setSelectedGroups([]);
    alert('تم إرسال الرسائل بنجاح.');
  };

  const filteredAndSortedNotifications = useMemo(() => {
    let result = notifications;

    if (filterDate || filterTargetId !== 'all') {
      result = notifications.filter(n => {
        // Filter by Date
        if (filterDate && !n.date.startsWith(filterDate)) return false;

        // Filter by Recipient
        if (filterTargetId !== 'all') {
          return n.target?.id === filterTargetId;
        }

        return true;
      });
    }

    // No need to sort if notifications are already sorted by date desc from Firestore
    // But if we want to be 100% sure with minimal cost:
    // return result.sort((a, b) => b.date.localeCompare(a.date)); // Lexicographical sort on ISO date is fast
    return result;
  }, [notifications, filterDate, filterTargetId]);

  const displayedNotifications = useMemo(() => {
    return filteredAndSortedNotifications.slice(0, displayLimit);
  }, [filteredAndSortedNotifications, displayLimit]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">إرسال رسالة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Teacher Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">إلى المدرسين:</label>
                  <button type="button" onClick={toggleAllTeachers} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                    {selectedTeachers.length === teachers.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1 bg-gray-50">
                  {sortedTeachers.map(teacher => (
                    <label key={teacher.id} className="flex items-center p-1 rounded hover:bg-indigo-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => handleTeacherSelection(teacher.id)}
                        className="ml-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-800">{teacher.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Group Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">إلى المجموعات:</label>
                  <button type="button" onClick={toggleAllGroups} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                    {selectedGroups.length === groups.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1 bg-gray-50">
                  {sortedGroups.map(group => (
                    <label key={group.id} className="flex items-center p-1 rounded hover:bg-indigo-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => handleGroupSelection(group.id)}
                        className="ml-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-800">{group.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">محتوى الرسالة:</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                إرسال للجميع
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-800">سجل الرسائل المرسلة</h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full sm:w-40 px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterTargetId}
                    onChange={(e) => setFilterTargetId(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">جميع المستلمين</option>
                    <optgroup label="المدرسين">
                      {sortedTeachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="المجموعات">
                      {sortedGroups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {displayedNotifications.length > 0 ? (
                <>
                  {displayedNotifications.map(n => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      teachersMap={teachersMap}
                    />
                  ))}
                  {filteredAndSortedNotifications.length > displayLimit && (
                    <button
                      onClick={() => setDisplayLimit(prev => prev + 50)}
                      className="w-full py-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg transition-colors mt-4"
                    >
                      عرض المزيد ({filteredAndSortedNotifications.length - displayLimit} متبقية)
                    </button>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  {notifications.length > 0 ? 'لا توجد رسائل تطابق الفلاتر المحددة.' : 'لم يتم إرسال أي رسائل بعد.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

interface NotificationItemProps {
  notification: Notification;
  teachersMap: Map<string, string>;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ notification, teachersMap }) => {
  const { targetName, targetType } = useMemo(() => {
    let name = 'غير محدد';
    let type = 'غير محدد';

    if (notification.target) {
      name = notification.target.type === 'teacher'
        ? (teachersMap.get(notification.target.id) || 'مدرس محذوف')
        : notification.target.name;
      type = notification.target.type === 'teacher' ? 'مدرس' : 'مجموعة';
    } else if ((notification as any).recipientId === 'all') {
      name = 'الجميع';
      type = 'عام';
    }
    return { targetName: name, targetType: type };
  }, [notification, teachersMap]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="text-gray-800 whitespace-pre-wrap">{notification.content}</p>
      <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
        <span>
          إلى: <span className="font-semibold">{targetName}</span> ({targetType})
        </span>
        <span>{new Date(notification.date).toLocaleString('ar-EG')}</span>
      </div>
    </div>
  );
});

export default DirectorNotificationsPage;
