import React from 'react';
import { Compass, Target, Gamepad2, GraduationCap, CalendarCheck } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasPendingBookings?: boolean;
}

export const MobileTabBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  hasPendingBookings = false,
}) => {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'play', label: 'Play', icon: Gamepad2 },
    { id: 'coach', label: 'Coach', icon: GraduationCap },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: hasPendingBookings },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 focus:outline-none"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-slate-950 stroke-[2.2]' : 'text-slate-500'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                  isActive ? 'font-bold text-slate-950' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
