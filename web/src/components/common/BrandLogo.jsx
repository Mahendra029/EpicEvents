import React from 'react';

/**
 * BrandLogo - Displays the "Epic Events" brand name.
 * Uses "Emilys Candy" Google Font for a premium, distinctive look.
 *
 * Props:
 *   light  - if true, renders in white (for dark backgrounds like sidebar/login header)
 *   size   - 'sm' | 'md' | 'lg' (default: 'md')
 */
const BrandLogo = ({ light = false, size = 'md' }) => {
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }[size] || 'text-3xl';

  return (
    <div
      className={`flex items-center gap-1 select-none leading-none ${sizeClass}`}
      style={{ fontFamily: '"Emilys Candy", serif' }}
    >
      <span className={light ? 'text-white' : 'text-brand-dark'}>Epic</span>
      <span className="text-brand"> Events</span>
    </div>
  );
};

export default BrandLogo;
