import React from 'react';
import { Calendar } from 'lucide-react';

const BrandLogo = ({ light = false }) => {
  return (
    <div className={`flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-dark'}`}>
      <Calendar size={36} className="text-brand" />
      Epic<span className="text-brand">Events</span>
    </div>
  );
};

export default BrandLogo;
