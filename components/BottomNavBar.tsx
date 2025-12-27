import React from 'react';
import UserIcon from './icons/UserIcon';
import UsersIcon from './icons/UsersIcon';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';

type ActiveView = 'students' | 'groups' | 'attendance_report' | 'tests_report' | 'financial_report';

interface BottomNavBarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClass = 'text-blue-600';
  const inactiveClass = 'text-gray-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass
        }`}
    >
      {icon}
      <span className={`text-xs font-semibold mt-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onSelectView }) => {
  return (
    <>
      {/* Bottom Bar - visible on all screens */}
      <nav className="fixed bottom-0 right-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around z-40 border-t lg:pr-56">
        <NavItem
          label="الطلاب"
          icon={<UserIcon className="w-6 h-6" />}
          isActive={activeView === 'students'}
          onClick={() => onSelectView('students')}
        />
        <NavItem
          label="المجموعات"
          icon={<UsersIcon className="w-6 h-6" />}
          isActive={activeView === 'groups'}
          onClick={() => onSelectView('groups')}
        />
        <NavItem
          label="المصروفات"
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          isActive={activeView === 'financial_report'}
          onClick={() => onSelectView('financial_report')}
        />
        <NavItem
          label="تقرير الحضور"
          icon={<CalendarCheckIcon className="w-6 h-6" />}
          isActive={activeView === 'attendance_report'}
          onClick={() => onSelectView('attendance_report')}
        />
        <NavItem
          label="تقرير الاختبارات"
          icon={<ClipboardListIcon className="w-6 h-6" />}
          isActive={activeView === 'tests_report'}
          onClick={() => onSelectView('tests_report')}
        />
      </nav>
    </>
  );
};

export default React.memo(BottomNavBar);