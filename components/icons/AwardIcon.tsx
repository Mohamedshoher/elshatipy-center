import React from 'react';

const AwardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13l-3-3m3 3l3-3m-6 0a9 9 0 1112 0 9 9 0 01-12 0z" />
    </svg>
);

export default AwardIcon;
