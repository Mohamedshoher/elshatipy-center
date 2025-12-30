
import React from 'react';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import DocumentReportIcon from './icons/DocumentReportIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import LogoutIcon from './icons/LogoutIcon';
import XIcon from './icons/XIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import CashIcon from './icons/CashIcon';
import MessageIcon from './icons/MessageIcon';
import CreditCardOffIcon from './icons/CreditCardOffIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import UserIcon from './icons/UserIcon';
import EditIcon from './icons/EditIcon';
import HomeIcon from './icons/HomeIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onShowGeneralView: () => void;
  onShowFinance: () => void;
  onShowFeeCollection: () => void;
  onShowNotifications: () => void;
  onShowNotes: () => void;
  onShowTeacherManager: () => void;
  onShowArchive: () => void;
  onShowDebtors: () => void; // Add onShowDebtors
  onShowSupervisorManager?: () => void;
  onShowLandingPageContent?: () => void;
  onShowLandingPage?: () => void;
  onLogout: () => void;
  currentUserRole?: string;
  unreadMessagesCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onShowGeneralView, onShowFinance, onShowFeeCollection, onShowNotifications, onShowNotes, onShowTeacherManager, onShowArchive, onShowDebtors, onShowSupervisorManager, onShowLandingPageContent, onShowLandingPage, onLogout, currentUserRole, unreadMessagesCount }) => {

  const handleAction = (action: () => void) => {
    onClose();
    // Wrap action in double rAF to ensure sidebar starts closing before the heavy render
    requestAnimationFrame(() => {
      requestAnimationFrame(action);
    });
  };

  const isDirector = currentUserRole === 'director';
  const isSupervisor = currentUserRole === 'supervisor';

  const navContent = (
    <>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">القائمة الرئيسية</h2>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 lg:hidden">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {onShowLandingPage && (
            <li className="mb-4 pb-4 border-b">
              <button onClick={() => handleAction(onShowLandingPage)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors">
                <HomeIcon className="w-6 h-6 ml-4 text-indigo-600" />
                <span className="font-semibold">الصفحة الرئيسية</span>
              </button>
            </li>
          )}
          <li>
            <button onClick={() => handleAction(onShowTeacherManager)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-teal-100 hover:text-teal-800 transition-colors">
              <BriefcaseIcon className="w-6 h-6 ml-4 text-teal-600" />
              <span className="font-semibold">إدارة المدرسين</span>
            </button>
          </li>
          {isDirector && onShowSupervisorManager && (
            <li>
              <button onClick={() => handleAction(onShowSupervisorManager)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors">
                <UserIcon className="w-6 h-6 ml-4 text-blue-600" />
                <span className="font-semibold">إدارة المشرفين</span>
              </button>
            </li>
          )}
          {isDirector && onShowLandingPageContent && (
            <li>
              <button onClick={() => handleAction(onShowLandingPageContent)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors">
                <EditIcon className="w-6 h-6 ml-4 text-green-600" />
                <span className="font-semibold">إدارة الصفحة الرئيسية</span>
              </button>
            </li>
          )}
          {/* <li>
            <button onClick={() => handleAction(onShowFeeCollection)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-cyan-100 hover:text-cyan-800 transition-colors">
              <CashIcon className="w-6 h-6 ml-4 text-cyan-600" />
              <span className="font-semibold">تحصيل الرسوم</span>
            </button>
          </li> */}


          <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">التقارير والمتابعة</li>
          <li>
            <button onClick={() => handleAction(onShowGeneralView)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-800 transition-colors">
              <ChartBarIcon className="w-6 h-6 ml-4 text-purple-600" />
              <span className="font-semibold">نظرة عامة</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleAction(onShowNotes)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 transition-colors">
              <ClipboardListIcon className="w-6 h-6 ml-4 text-yellow-600" />
              <span className="font-semibold">سجل الملحوظات</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleAction(onShowNotifications)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors relative">
              <MessageIcon className="w-6 h-6 ml-4 text-indigo-600" />
              <span className="font-semibold flex-1">الرسائل والإشعارات</span>
              {unreadMessagesCount !== undefined && unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </li>

          {isDirector && (
            <li className="pt-2">
              <button onClick={() => handleAction(onShowArchive)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-orange-100 hover:text-orange-800 transition-colors">
                <ArchiveIcon className="w-6 h-6 ml-4 text-orange-600" />
                <span className="font-semibold">الأرشيف</span>
              </button>
            </li>
          )}

          {(isDirector || isSupervisor) && (
            <li>
              <button onClick={() => handleAction(onShowDebtors)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors">
                <CreditCardOffIcon className="w-6 h-6 ml-4 text-red-600" />
                <span className="font-semibold">المدينون</span>
              </button>
            </li>
          )}

          <li className="pt-4 border-t mt-4">
            <button onClick={() => handleAction(onLogout)} className="flex items-center w-full text-right p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors">
              <LogoutIcon className="w-6 h-6 ml-4 text-red-600" />
              <span className="font-semibold">تسجيل الخروج</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col
          lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shadow-none lg:translate-x-0 lg:border-l
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {navContent}
      </div>
    </>
  );
};

export default React.memo(Sidebar);
