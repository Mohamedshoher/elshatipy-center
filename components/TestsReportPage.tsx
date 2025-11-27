
import React, { useState, useMemo } from 'react';
import type { Student, Group, TestType } from '../types';
import { TestType as TestTypeEnum } from '../types';
import UserIcon from './icons/UserIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

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
}

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerContent?: React.ReactNode;
}> = ({ title, children, defaultOpen = false, headerContent }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-right"
      >
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {headerContent && <div onClick={e => e.stopPropagation()}>{headerContent}</div>}
        </div>
        <ChevronDownIcon
          className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

const TestsReportPage: React.FC<TestsReportPageProps> = ({ students, groups, onViewStudent }) => {
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
      <div className="space-y-8">

        {/* Month Selector */}
        <div className="w-full sm:w-auto max-w-xs ml-auto">
          <label htmlFor="month-filter" className="sr-only">اختر الشهر</label>
          <input
            type="month"
            id="month-filter"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Section 1: Daily Report */}
        <CollapsibleSection title="تقرير الاختبارات اليومي" defaultOpen={true}>
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
        </CollapsibleSection>

        {/* Section 2: Most Tested */}
        <CollapsibleSection title={`الطلاب الأكثر اختبارًا - ${selectedMonthName}`} defaultOpen={false}>
          {/* Filters for Most Tested */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-4 bg-gray-50 p-3 rounded-lg">
            <div>
              <label className="block text-xs text-gray-500 mb-1">حسب المجموعة</label>
              <select value={mostTestedGroupFilter} onChange={(e) => setMostTestedGroupFilter(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white">
                <option value="all">كل المجموعات</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">حسب نوع الاختبار</label>
              <select value={mostTestedTypeFilter} onChange={(e) => setMostTestedTypeFilter(e.target.value as TestType | 'all')} className="w-full p-2 border rounded-md text-sm bg-white">
                <option value="all">كل الأنواع</option>
                {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">أجرى على الأقل</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" value={mostTestedTestsFilter} onChange={(e) => setMostTestedTestsFilter(Math.max(1, parseInt(e.target.value) || 1))} className="w-full p-2 border rounded-md text-sm" />
                <span className="text-sm flex-shrink-0">اختبار</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                    href={`https://wa.me/2${student.phone.startsWith('0') ? student.phone.substring(1) : student.phone}?text=${encodeURIComponent(
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
        </CollapsibleSection>

        {/* Section 3: Not Tested */}
        <CollapsibleSection title={`الطلاب الذين لم يتم اختبارهم - ${selectedMonthName}`} defaultOpen={false}>
          {/* Filters for Not Tested */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-4 bg-gray-50 p-3 rounded-lg">
            <div>
              <label className="block text-xs text-gray-500 mb-1">حسب المجموعة</label>
              <select value={notTestedGroupFilter} onChange={(e) => setNotTestedGroupFilter(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white">
                <option value="all">كل المجموعات</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">نوع الاختبار</label>
              <select value={notTestedTypeFilter} onChange={(e) => setNotTestedTypeFilter(e.target.value as TestType)} className="w-full p-2 border rounded-md text-sm bg-white">
                {Object.entries(testTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                    href={`https://wa.me/2${student.phone.startsWith('0') ? student.phone.substring(1) : student.phone}?text=${encodeURIComponent(
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
        </CollapsibleSection>

        {/* Section 4: Group Comparison Chart */}
        <CollapsibleSection title={`مقارنة أداء المجموعات - ${selectedMonthName}`} defaultOpen={false}>
          <GroupComparisonChart students={students} groups={groups} selectedMonth={selectedMonth} />
        </CollapsibleSection>
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
    <div className="space-y-6 overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
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
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-left text-sm font-semibold text-gray-700 truncate" title={item.groupName}>
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
              <div className="w-12 text-right text-sm font-bold text-gray-600">
                {item.stats.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestsReportPage;
