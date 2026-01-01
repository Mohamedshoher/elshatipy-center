import React from 'react';

const CashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M6 12h.01"></path>
    <path d="M18 12h.01"></path>
  </svg>
);

export default CashIcon;
