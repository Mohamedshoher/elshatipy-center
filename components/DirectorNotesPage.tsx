import React, { useState, useMemo } from 'react';
import type { Note, Student, Group, Teacher } from '../types';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import WhatsAppIcon from './icons/WhatsAppIcon';
import UserIcon from './icons/UserIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';

interface DirectorNotesPageProps {
  notes: Note[];
  students: Student[];
  groups: Group[];
  teachers: Teacher[];
  onBack: () => void;
  onToggleAcknowledge: (noteId: string) => void;
  onOpenStudentDetails: (student: Student) => void;
}

const DirectorNotesPage: React.FC<DirectorNotesPageProps> = ({ notes, students, groups, onBack, onToggleAcknowledge, onOpenStudentDetails }) => {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [ackFilter, setAckFilter] = useState<'all' | 'acknowledged' | 'unacknowledged'>('all');

  const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const groupMap = useMemo(() => new Map(groups.map(g => [g.id, g])), [groups]);

  const filteredAndSortedNotes = useMemo(() => {
    let filteredNotes = notes;

    if (ackFilter === 'acknowledged') {
      filteredNotes = notes.filter(note => note.isAcknowledged);
    } else if (ackFilter === 'unacknowledged') {
      filteredNotes = notes.filter(note => !note.isAcknowledged);
    }

    return filteredNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notes, ackFilter]);


  const handleWhatsAppClick = (student: Student, noteContent: string) => {
    const phone = student.phone.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('لا يوجد رقم هاتف مسجل لهذا الطالب.');
      return;
    }

    const message = `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب/ة: ${student.name} المحترم،\n\nنود إفادتكم بملحوظة إدارية:\n"${noteContent}"\n\nنرجو منكم المتابعة والاهتمام.\nشاكرين لكم حسن تعاونكم.\n\nإدارة مركز الشاطبي`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };


  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Filter Controls */}
        <div className="flex justify-start items-center gap-3 mb-6 pb-4 border-b">
          <span className="text-sm font-semibold text-gray-600">تصفية حسب:</span>
          <button
            onClick={() => setAckFilter('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${ackFilter === 'all'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            عرض الكل
          </button>
          <button
            onClick={() => setAckFilter('acknowledged')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${ackFilter === 'acknowledged'
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            تمت المراجعة
          </button>
          <button
            onClick={() => setAckFilter('unacknowledged')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${ackFilter === 'unacknowledged'
              ? 'bg-yellow-500 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            لم تتم المراجعة
          </button>
        </div>

        {/* Notes Cards */}
        <div className="space-y-4">
          {filteredAndSortedNotes.length > 0 ? filteredAndSortedNotes.map(note => {
            const student = studentMap.get(note.studentId);
            const group = student ? groupMap.get(student.groupId) : undefined;
            const isExpanded = expandedNoteId === note.id;

            if (!student) return null;

            return (
              <div key={note.id} className={`rounded-lg border shadow-sm transition-all duration-300 ${note.isAcknowledged ? 'bg-green-50 border-green-200' : 'bg-white border-yellow-200 shadow-md'}`}>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onOpenStudentDetails(student)}
                        className="flex items-center gap-2 font-bold text-lg text-blue-700 hover:text-blue-900 transition-colors hover:underline"
                        title="فتح ملف الطالب"
                      >
                        <UserIcon className="w-5 h-5" />
                        {student.name}
                      </button>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{group?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleWhatsAppClick(student, note.content)}
                        className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                        title="إرسال الملحوظة عبر واتساب"
                      >
                        <WhatsAppIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onToggleAcknowledge(note.id)}
                        className={`p-2 rounded-full transition-colors ${note.isAcknowledged ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                        title={note.isAcknowledged ? 'إلغاء المراجعة' : 'تأكيد المراجعة'}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="text-gray-800 text-right leading-relaxed bg-white/50 p-3 rounded-md border border-gray-100 cursor-pointer"
                    onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                  >
                    <p className="font-medium text-gray-900">{note.content}</p>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                      <span>بواسطة: {note.authorName}</span>
                      <span>{new Date(note.date).toLocaleString('ar-EG')}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-10 text-gray-500">
              لا توجد ملحوظات تطابق الفلتر المحدد.
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DirectorNotesPage;