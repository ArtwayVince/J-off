import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface Props {
  className?: string;
}

export const DisclaimerBanner: React.FC<Props> = ({ className = '' }) => {
  return (
    <aside 
      aria-label="Platform Guidelines and Transparency" 
      className={`bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>
            <strong className="text-white font-medium">Core Principle:</strong> Three separate systems: (1) Virtual Game Currency has zero monetary value; (2) Goal Savings are self-reported personal milestones; (3) Experience Bookings are processed only via verified partners.
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <Info className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>Yuby Resort demonstrator is subject to official partner identity confirmation.</span>
        </div>
      </div>
    </aside>
  );
};
