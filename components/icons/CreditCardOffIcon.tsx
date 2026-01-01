import React from 'react';

const CreditCardOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2l20 20"/>
    <path d="M2 8.3V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.3"/>
    <path d="M20.7 6H4a2 2 0 0 0-2 2v.3"/>
    <path d="M2 6h10"/>
    <path d="M18 6h2"/>
  </svg>
);

export default CreditCardOffIcon;
