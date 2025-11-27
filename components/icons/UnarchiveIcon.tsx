import React from 'react';

const UnarchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="12" y1="17" x2="12" y2="10"></line>
    <polyline points="15 13 12 10 9 13"></polyline>
  </svg>
);

export default UnarchiveIcon;
