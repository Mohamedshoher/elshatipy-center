import React from 'react';

interface HeaderProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ leftContent, centerContent, rightContent, showLogo }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 flex justify-start items-center gap-2 sm:gap-4">{leftContent}</div>
          <div className="flex-initial flex items-center justify-center gap-2 sm:gap-3">
            {showLogo && <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-md" />}
            <div className="text-center">{centerContent}</div>
          </div>
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">{rightContent}</div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
