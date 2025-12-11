
import React, { useState, useMemo } from 'react';
import type { Student, Group, TestType } from '../types';
import { TestType as TestTypeEnum } from '../types';
import UserIcon from './icons/UserIcon';


const testTypeLabels: Record<TestType, string> = {
  [TestTypeEnum.NEW]: 'جديد',
  [TestTypeEnum.RECENT_PAST]: 'ماضي قريب',
  [TestTypeEnum.DISTANT_PAST]: 'بعيد',
  [TestTypeEnum.READING]: 'قراءة',
};

interface TestsReportPageProps {
  students: Student[];
  groups: Group[];
  onViewStudent: (studentId: string) => void;
  onBack?: () => void;
}

const ModalSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  headerContent?: React.ReactNode;
}> = ({ title, children, isOpen, onOpen, onClose, headerContent }) => {
  return (
    <>
      <div
        onClick={onOpen}
        className="bg-white rounded-xl shadow p-6 flex items-center justify-between cursor-pointer hover:shadow-md transition-all border border-gray-100 group h-full"
      >
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h2>
          {headerContent && <div onClick={e => e.stopPropagation()}>{headerContent}</div>}
        </div>
        <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
          <div className="p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm" onClick={onClose}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between z-10 flex-shrink-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 bg-gray-50 flex-grow overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TestsReportPage: React.FC<TestsReportPageProps> = ({ students, groups, onViewStudent, onBack }) => {
  // Modal State
  const [activeModal, setActiveModal] = useState<'daily' | 'mostTested' | 'notTested' | 'comparison' | null>(null);

  // Daily report state
  const [selectedDailyDate, setSelectedDailyDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Monthly report state
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7));

  // Filters for "Most Tested"
  const [mostTestedGroupFilter, setMostTestedGroupFilter] = useState('all');
  const [mostTestedTypeFilter, setMostTestedTypeFilter] = useState<TestType | 'all'>('all');
  const [mostTestedTestsFilter, setMostTestedTestsFilter] = useState(1);

  // Filters for "Not Tested"
  const [notTestedGroupFilter, setNotTestedGroupFilter] = useState('all');
  const [notTestedTypeFilter, setNotTestedTypeFilter] = useState<TestType>(TestTypeEnum.NEW);

  // Key Listeners
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) setActiveModal(null);
      } else if (e.key === 'Backspace') {
        // Prevent default backspace navigation if it's meant to go back in history inside inputs usually, 
        // but here we want it as a navigation action if NO modal is open.
        // Also check if focus is NOT on an input element to avoid accidental navigation while typing.
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        if (!activeModal && !isInput && onBack) {
          e.preventDefault(); // Prevent browser back
          onBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onBack]);

  const setDateOffset = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setSelectedDailyDate(date.toISOString().split('T')[0]);
  };

  const dailyReport = useMemo(() => {
    const totalTests = students.flatMap(s => s.tests).filter(t => t.date === selectedDailyDate).length;
    return { totalTests };
  }, [students, selectedDailyDate]);

  const mostTestedReport = useMemo(() => {
    let filteredStudents = students;
    if (mostTestedGroupFilter !== 'all') {
      filteredStudents = students.filter(s => s.groupId === mostTestedGroupFilter);
    }

    const studentStats = filteredStudents.map(student => {
      const testsInMonth = student.tests.filter(t => {
        const typeMatch = mostTestedTypeFilter === 'all' || t.type === mostTestedTypeFilter;
        const monthMatch = t.date.startsWith(selectedMonth);
        return typeMatch && monthMatch;
      });
      return { student, count: testsInMonth.length };
    });

    return studentStats
      .filter(s => s.count >= mostTestedTestsFilter)
      .sort((a, b) => b.count - a.count);
  }, [students, selectedMonth, mostTestedGroupFilter, mostTestedTypeFilter, mostTestedTestsFilter]);

  const notTestedReport = useMemo(() => {
    let filteredStudents = students;
    if (notTestedGroupFilter !== 'all') {
      filteredStudents = students.filter(s => s.groupId === notTestedGroupFilter);
    }

    return filteredStudents.filter(student => {
      // Check if student was active for the whole month to avoid flagging new students
      const studentJoiningMonth = student.joiningDate.substring(0, 7);
      if (studentJoiningMonth > selectedMonth) return false;

      const hasTest = student.tests.some(t => t.date.startsWith(selectedMonth) && t.type === notTestedTypeFilter);
      return !hasTest;
    });
  }, [students, selectedMonth, notTestedGroupFilter, notTestedTypeFilter]);

  const selectedMonthName = new Date(selectedMonth + '-02').toLocaleString('ar-EG', { month: 'long' });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6">

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Add Back Button manually if needed, or rely on Key listener. 
               The user asked for Backspace key, but having a visual button is also good UX. 
               But sticking to the request, let's just ensure the layout is clean.
           */}
          <div className="w-full sm:w-auto max-w-xs sm:mr-auto">
            <label htmlFor="month-filter" className="sr-only">اختر الشهر</label>
            <input
              type="month"
              id="month-filter"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Daily Report */}
          <ModalSection
            title="الاختبار اليومي"
            isOpen={activeModal === 'daily'}
            onOpen={() => setActiveModal('daily')}
            onClose={() => setActiveModal(null)}
          >
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="date"
                value={selectedDailyDate}
                onChange={(e) => setSelectedDailyDate(e.target.value)}
                className="w-full sm:w-auto flex-grow px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button onClick={() => setDateOffset(0)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">اليوم</button>
                <button onClick={() => setDateOffset(-1)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">أمس</button>
                <button onClick={() => setDateOffset(-2)} className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300">أول أمس</button>
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{dailyReport.totalTests}</p>
              <p className="text-sm text-blue-800 font-semibold">إجمالي الاختبارات</p>
            </div>
          </ModalSection>

          {/* Section 2: Most Tested */}
          <ModalSection
            title={`الأكثر اختبارًا - ${selectedMonthName}`}
            isOpen={activeModal === 'mostTested'}
            onOpen={() => setActiveModal('mostTested')}
            onClose={() => setActiveModal(null)}
          >
            {/* Filters for Most Tested */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <select
                value={mostTestedGroupFilter}
                onChange={(e) => setMostTestedGroupFilter(e.target.value)}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">كل المجموعات</option>
                {[...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>

              <select
                value={mostTestedTypeFilter}
                onChange={(e) => setMostTestedTypeFilter(e.target.value as TestType | 'all')}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">كل الأنواع</option>
                {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
                <span className="text-sm text-gray-500 whitespace-nowrap">على الأقل:</span>
                <input
                  type="number"
                  min="1"
                  value={mostTestedTestsFilter}
                  onChange={(e) => setMostTestedTestsFilter(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-sm text-center focus:outline-none"
                />
                <span className="text-sm text-gray-500">اختبار</span>
              </div>
            </div>
            <div className="space-y-2">
              {mostTestedReport.map(({ student, count }, index) => (
                <div key={student.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
                    <UserIcon className="w-5 h-5 mx-2 text-gray-400" />
                    <div className="flex flex-col">
                      <button onClick={() => onViewStudent(student.id)} className="text-gray-800 hover:text-blue-600 transition-colors text-right font-semibold">
                        {student.name}
                      </button>
                      <span className="text-xs text-gray-400">{groups.find(g => g.id === student.groupId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-sm">{count} اختبار</span>
                    <a
                      href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب/ة: ${student.name}\n\nيسرنا إبلاغكم بأن ابنكم/ابنتكم قد أتم ${count} اختبارات خلال هذا الشهر بتفوق وتميز.\nنقدر حرصكم ومتابعتكم، ونشجعكم على الاستمرار في هذا المستوى الرائع.\n\nحفظه الله ورعاه وجعله من أهل القرآن.\n\nإدارة المركز`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
                      title="إرسال تهنئة عبر واتساب"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
              {mostTestedReport.length === 0 && <p className="text-center text-gray-400 py-4">لا يوجد طلاب يطابقون هذه المعايير.</p>}
            </div>
          </ModalSection>

          {/* Section 3: Not Tested */}
          <ModalSection
            title={`لم يختبروا - ${selectedMonthName}`}
            isOpen={activeModal === 'notTested'}
            onOpen={() => setActiveModal('notTested')}
            onClose={() => setActiveModal(null)}
          >
            {/* Filters for Not Tested */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <select
                value={notTestedGroupFilter}
                onChange={(e) => setNotTestedGroupFilter(e.target.value)}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">كل المجموعات</option>
                {[...groups].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>

              <select
                value={notTestedTypeFilter}
                onChange={(e) => setNotTestedTypeFilter(e.target.value as TestType)}
                className="py-1.5 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {notTestedReport.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-500 w-6 text-center">{index + 1}.</span>
                    <UserIcon className="w-5 h-5 mx-2 text-gray-400" />
                    <div className="flex flex-col">
                      <button onClick={() => onViewStudent(student.id)} className="text-gray-800 hover:text-blue-600 transition-colors text-right font-semibold">
                        {student.name}
                      </button>
                      <span className="text-xs text-gray-400">{groups.find(g => g.id === student.groupId)?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `السلام عليكم ورحمة الله وبركاته\nولي أمر الطالب/ة: ${student.name}\n\nنود إفادتكم بأن الطالب لم يقم بإجراء اختبار (${testTypeLabels[notTestedTypeFilter]}) خلال هذا الشهر.\nنرجو منكم مزيداً من العناية والاهتمام، والتفضل بمراجعة المركز لمتابعة مستوى الطالب.\n\nشاكرين حسن تعاونكم.\n\nإدارة المركز`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors shadow-sm"
                      title="إرسال تنبيه عبر واتساب"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
              {notTestedReport.length === 0 && <p className="text-center text-gray-400 py-4">جميع الطلاب في المجموعة المحددة تم اختبارهم.</p>}
            </div>
          </ModalSection>

          {/* Section 4: Group Comparison Chart */}
          <ModalSection
            title={`مقارنة الأداء - ${selectedMonthName}`}
            isOpen={activeModal === 'comparison'}
            onOpen={() => setActiveModal('comparison')}
            onClose={() => setActiveModal(null)}
          >
            <GroupComparisonChart students={students} groups={groups} selectedMonth={selectedMonth} />
          </ModalSection>
        </div>
      </div>
    </main>
  );
};

// Sub-component for the chart to keep the main component clean
const GroupComparisonChart: React.FC<{ students: Student[], groups: Group[], selectedMonth: string }> = ({ students, groups, selectedMonth }) => {
  const data = useMemo(() => {
    return groups.map(group => {
      const groupStudents = students.filter(s => s.groupId === group.id);
      const stats = {
        [TestTypeEnum.NEW]: 0,
        [TestTypeEnum.RECENT_PAST]: 0,
        [TestTypeEnum.DISTANT_PAST]: 0,
        total: 0
      };

      groupStudents.forEach(student => {
        student.tests.forEach(test => {
          if (test.date.startsWith(selectedMonth)) {
            if (stats[test.type] !== undefined) {
              stats[test.type]++;
              stats.total++;
            }
          }
        });
      });

      return { groupName: group.name, stats };
    }).sort((a, b) => b.stats.total - a.stats.total); // Sort by total tests
  }, [students, groups, selectedMonth]);

  const maxVal = Math.max(...data.map(d => d.stats.total), 1);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex justify-center gap-4 sm:gap-6 mb-6 text-xs sm:text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>جديد</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>ماضي قريب</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
          <span>بعيد</span>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 sm:gap-4">
            <div className="w-20 sm:w-32 text-left text-xs sm:text-sm font-semibold text-gray-700 truncate" title={item.groupName}>
              {item.groupName}
            </div>
            <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden flex relative">
              {item.stats.total > 0 ? (
                <>
                  {/* New Tests Bar */}
                  <div
                    className="h-full bg-green-500 hover:bg-green-600 transition-all relative group"
                    style={{ width: `${(item.stats[TestTypeEnum.NEW] / maxVal) * 100}%` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.stats[TestTypeEnum.NEW]}
                    </span>
                  </div>
                  {/* Recent Past Bar */}
                  <div
                    className="h-full bg-blue-500 hover:bg-blue-600 transition-all relative group"
                    style={{ width: `${(item.stats[TestTypeEnum.RECENT_PAST] / maxVal) * 100}%` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.stats[TestTypeEnum.RECENT_PAST]}
                    </span>
                  </div>
                  {/* Distant Past Bar */}
                  <div
                    className="h-full bg-purple-500 hover:bg-purple-600 transition-all relative group"
                    style={{ width: `${(item.stats[TestTypeEnum.DISTANT_PAST] / maxVal) * 100}%` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.stats[TestTypeEnum.DISTANT_PAST]}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا توجد اختبارات</div>
              )}
            </div>
            <div className="w-8 sm:w-12 text-right text-xs sm:text-sm font-bold text-gray-600">
              {item.stats.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestsReportPage;
