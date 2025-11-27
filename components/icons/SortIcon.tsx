import React from 'react';

const SortIcon: React.FC<{ className?: string, direction?: 'asc' | 'desc' }> = ({ className = '', direction }) => {
  return (
    <span className={`inline-flex flex-col items-center justify-center h-4 w-4 ${className}`}>
      <svg
        className={`w-3 h-3 -mb-[3px] ${direction === 'asc' ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 15l7-7 7 7"></path>
      </svg>
      <svg
        className={`w-3 h-3 -mt-[3px] ${direction === 'desc' ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 9l-7 7-7-7"></path>
      </svg>
    </span>
  );
};

export default SortIcon;
