import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  X,
  UserCheck,
  ShieldCheck,
  Store,
  RotateCcw,
  CheckCircle2,
  Mail,
  Phone,
  User as UserIcon,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserUpdated: (user: User) => void;
  onDataReset: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onDataReset,
}) => {
  const [name, setName] = useState<string>(currentUser.name);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [phone, setPhone] = useState<string>(currentUser.phone || '');
  const [activeRole, setActiveRole] = useState<UserRole>(currentUser.role);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRoleSwitch = (newRole: UserRole) => {
    setActiveRole(newRole);
    const updated = JetOffStore.updateUserRole(newRole);
    setName(updated.name);
    setEmail(updated.email);
    onUserUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name,
      email,
      phone,
      role: activeRole,
    };
    JetOffStore.setUser(updated);
    onUserUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Account & Role Switcher</h3>
            <p className="text-xs text-slate-500 mt-0.5">Switch personas to inspect all system capabilities</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
            Switch Active Role Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSwitch('explorer')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                activeRole === 'explorer'
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Explorer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('provider')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                activeRole === 'provider'
                  ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Provider</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                activeRole === 'admin'
                  ? 'border-rose-700 bg-rose-700 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone (SMS / WhatsApp)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {savedSuccess && (
            <div className="text-emerald-700 text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Reset Demo Data */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need a clean slate?</span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all goals, wallet, bookings, and simulation data to defaults?')) {
                JetOffStore.resetAllData();
                onDataReset();
                onClose();
              }
            }}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
