import React from 'react';
import { User } from '../../types';
import { Wallet, ShieldAlert, Store, UserCheck } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
  onOpenAuth: () => void;
  virtualBalance: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  user,
  onOpenAuth,
  virtualBalance,
}) => {
  const navItems = [
    { id: 'explore', label: 'Explore' },
    { id: 'goals', label: 'Goals' },
    { id: 'play', label: 'Play & Learn' },
    { id: 'coach', label: 'Readiness Coach' },
    { id: 'bookings', label: 'Bookings' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => onTabChange('explore')}
          className="text-xl font-extrabold tracking-tight text-slate-950 font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span>JET OFF</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === item.id
                  ? 'text-slate-950 border-slate-900 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          {/* Provider / Admin shortcut links if applicable */}
          {user.role === 'provider' && (
            <button
              onClick={() => onTabChange('provider_portal')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1 ${
                activeTab === 'provider_portal'
                  ? 'text-slate-950 border-slate-900 font-semibold'
                  : 'border-transparent text-amber-700 hover:text-amber-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Provider Portal</span>
            </button>
          )}
          {user.role === 'admin' && (
            <button
              onClick={() => onTabChange('admin_portal')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1 ${
                activeTab === 'admin_portal'
                  ? 'text-slate-950 border-slate-900 font-semibold'
                  : 'border-transparent text-rose-700 hover:text-rose-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action / account profile trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Virtual Balance Chip (interactive button to open play view) */}
          <button
            onClick={() => onTabChange('play')}
            title="Educational Virtual Simulation Currency (No Cash Value)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition-colors tabular-nums"
          >
            <Wallet className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-500 font-normal">Game:</span>
            <span>₦{virtualBalance.toLocaleString()}</span>
          </button>

          {/* User Profile / Role Trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider hidden lg:inline">
              ({user.role})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
