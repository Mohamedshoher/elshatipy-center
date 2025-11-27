import React, { useState, useMemo } from 'react';
import type { Note, Student, Group, Teacher } from '../types';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface DirectorNotesPageProps {
  notes: Note[];
  students: Student[];
  groups: Group[];
  teachers: Teacher[];
  onBack: () => void;
  onToggleAcknowledge: (noteId: string) => void;
}

const DirectorNotesPage: React.FC<DirectorNotesPageProps> = ({ notes, students, groups, onBack, onToggleAcknowledge }) => {
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


  return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Filter Controls */}
          <div className="flex justify-start items-center gap-3 mb-6 pb-4 border-b">
             <span className="text-sm font-semibold text-gray-600">تصفية حسب:</span>
             <button
                onClick={() => setAckFilter('all')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    ackFilter === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                >
                عرض الكل
            </button>
            <button
                onClick={() => setAckFilter('acknowledged')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    ackFilter === 'acknowledged'
                    ? 'bg-green-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                >
                تمت المراجعة
            </button>
            <button
                onClick={() => setAckFilter('unacknowledged')}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    ackFilter === 'unacknowledged'
                    ? 'bg-yellow-500 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                >
                لم تتم المراجعة
            </button>
          </div>

          {/* Notes Cards */}
          <div className="space-y-3">
            {filteredAndSortedNotes.length > 0 ? filteredAndSortedNotes.map(note => {
              const student = studentMap.get(note.studentId);
              const group = student ? groupMap.get(student.groupId) : undefined;
              const isExpanded = expandedNoteId === note.id;
              return (
                 <div key={note.id} className={`rounded-lg transition-all duration-300 ${note.isAcknowledged ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <div 
                        className="p-4 flex justify-between items-start gap-4 cursor-pointer"
                        onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        role="button"
                        aria-expanded={isExpanded}
                    >
                        <p className="flex-grow text-gray-800 break-words">{note.content}</p>
                        <div className="flex-shrink-0 pl-2" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => onToggleAcknowledge(note.id)}
                                className="p-1 rounded-full transition-colors"
                                title={note.isAcknowledged ? 'إلغاء المراجعة' : 'تأكيد المراجعة'}
                            >
                                <CheckCircleIcon className={`w-7 h-7 ${note.isAcknowledged ? 'text-green-500' : 'text-gray-300 hover:text-gray-500'}`} />
                            </button>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-48' : 'max-h-0'}`}>
                        <div className="px-4 pb-4 border-t pt-3 border-gray-300/50">
                            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                <div>
                                    <dt className="font-semibold text-gray-500">الطالب</dt>
                                    <dd className="text-gray-800">{student?.name || 'طالب محذوف'}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-500">المجموعة</dt>
                                    <dd className="text-gray-800">{group?.name || 'غير محدد'}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-500">الكاتب</dt>
                                    <dd className="text-gray-800">{note.authorName}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-gray-500">التاريخ</dt>
                                    <dd className="text-gray-800">{new Date(note.date).toLocaleString('ar-EG')}</dd>
                                </div>
                            </dl>
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