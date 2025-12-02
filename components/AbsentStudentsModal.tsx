import React, { useState, useMemo } from 'react';
import type { Student, Group } from '../types';
import UserIcon from './icons/UserIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface AbsentStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  absentStudents: Student[];
  groups: Group[];
  onStudentClick: (studentId: string) => void;
  currentUserRole?: 'director' | 'teacher' | 'supervisor';
}

const AbsentStudentsModal: React.FC<AbsentStudentsModalProps> = ({ isOpen, onClose, absentStudents, groups, onStudentClick, currentUserRole }) => {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleSendWhatsAppMessage = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation(); // منع فتح تفاصيل الطالب عند الضغط على زر واتساب

    const today = new Date().toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `*السلام عليكم ورحمة الله وبركاته*\n\n` +
      `عزيزي ولي أمر الطالب/ة: *${student.name}*\n\n` +
      `نود إعلامكم بأن الطالب/ة *غاب/ت اليوم* (${today}) عن حضور الحلقة.\n\n` +
      `⚠️ *تحذير هام:*\n` +
      `الغياب المتكرر يؤثر سلباً على مستوى الطالب/ة الدراسي والحفظ، ` +
      `لذا نرجو منكم الاهتمام بمتابعة حضور الطالب/ة بانتظام للحفاظ على تقدمه/ها في الحفظ والمراجعة.\n\n` +
      `نشكر لكم تعاونكم ونسأل الله أن يوفق الجميع.\n\n` +
      `*مع تحيات إدارة مركز الشاطبي لتحفيظ القرآن الكريم* 🌙`;

    const phone = student.phone.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('لا يوجد رقم هاتف مسجل لولي أمر هذا الطالب.');
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const studentsByGroup = useMemo(() => {
    const grouped: Record<string, Student[]> = {};
    absentStudents.forEach(student => {
      if (!grouped[student.groupId]) {
        grouped[student.groupId] = [];
      }
      grouped[student.groupId].push(student);
    });
    return Object.entries(grouped).map(([groupId, students]) => ({
      groupId,
      groupName: groups.find(g => g.id === groupId)?.name || 'مجموعة غير محددة',
      students,
      count: students.length
    })).sort((a, b) => b.count - a.count);
  }, [absentStudents, groups]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">الطلاب الغائبون اليوم</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {studentsByGroup.length > 0 ? studentsByGroup.map(({ groupId, groupName, students, count }) => (
            <div key={groupId} className="bg-gray-100 rounded-lg">
              <div
                className="p-3 flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedGroupId(prev => prev === groupId ? null : groupId)}
              >
                <h3 className="font-semibold text-gray-800">{groupName}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm">{count} غائب</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedGroupId === groupId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {expandedGroupId === groupId && (
                <div className="border-t border-gray-200 p-3">
                  <ul className="space-y-2">
                    {students.sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(student => (
                      <li key={student.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-blue-50 transition-colors">
                        <button
                          onClick={() => onStudentClick(student.id)}
                          className="flex-1 text-right flex items-center text-gray-700 hover:text-blue-700"
                        >
                          <UserIcon className="w-5 h-5 ml-2" />
                          {student.name}
                        </button>
                        {(currentUserRole === 'director' || currentUserRole === 'supervisor') && (
                          <button
                            onClick={(e) => handleSendWhatsAppMessage(student, e)}
                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-sm transition-all"
                            title="إرسال رسالة لولي الأمر"
                          >
                            <WhatsAppIcon className="w-5 h-5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )) : <p className="text-center text-gray-500 py-8">لا يوجد طلاب غائبون اليوم.</p>}
        </div>

        <div className="flex-shrink-0 mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default AbsentStudentsModal;
