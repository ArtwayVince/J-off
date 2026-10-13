import React from 'react';
import { BookingRequest, Experience, Goal, User } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  Users,
  Target,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

interface Props {
  currentUser: User;
  allExperiences: Experience[];
  allBookings: BookingRequest[];
  allGoals: Goal[];
  onRefreshData: () => void;
}

export const AdminPortalView: React.FC<Props> = ({
  currentUser,
  allExperiences,
  allBookings,
  allGoals,
  onRefreshData,
}) => {
  const pendingExperiences = allExperiences.filter((e) => e.status === 'pending_review');
  const approvedExperiences = allExperiences.filter((e) => e.status === 'approved');

  const handleApprove = (expId: string) => {
    JetOffStore.moderateExperience(expId, 'approved');
    onRefreshData();
  };

  const handleReject = (expId: string) => {
    JetOffStore.moderateExperience(expId, 'draft');
    onRefreshData();
  };

  const totalReportedSavings = allGoals.reduce((sum, g) => sum + g.currentSaved, 0);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider">
            Governance & Quality Control
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Administrator Console
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Audit partner credentials, moderate experience submissions, and ensure venue representations remain authentic.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Role: Admin ({currentUser.name})
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
            Active Ambitions
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {allGoals.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Goals in progress</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
            Self-Reported Savings
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-1">
            ₦{totalReportedSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Accumulated milestones</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
            Marketplace Inquiries
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {allBookings.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Reservation records</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
            Moderation Queue
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums mt-1">
            {pendingExperiences.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Pending approval</span>
        </div>
      </div>

      {/* Moderation Queue */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Provider Listing Moderation Queue
            </h2>
            <p className="text-xs text-slate-500">
              Rule enforcement: Unapproved listings are blocked from public discovery until verified.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
            {pendingExperiences.length} awaiting review
          </span>
        </div>

        <div className="space-y-4">
          {pendingExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      PENDING REVIEW
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Provider: <strong>{exp.providerName}</strong> · Price: <strong className="tabular-nums">₦{exp.price.toLocaleString()}</strong> · Location: {exp.location}
                  </div>
                  <p className="text-xs text-slate-700 pt-1 leading-relaxed">
                    {exp.whatYouWillLearnOrGain}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(exp.id)}
                    className="px-3 py-1.5 border border-slate-300 bg-white text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(exp.id)}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                  >
                    Approve for Marketplace
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingExperiences.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              All submitted listings have been reviewed and approved.
            </div>
          )}
        </div>
      </section>

      {/* Verified Partner Governance Guidelines */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3 text-xs text-slate-700 leading-relaxed">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>JET OFF Anti-Fabrication & Partner Truth Standards</span>
        </h3>
        <p>
          1. <strong>Venue Authenticity:</strong> Unverified facilities must always be labelled with the pilot demonstrator disclaimer. Never fabricate photos, prices, or policies.
        </p>
        <p>
          2. <strong>Provider Verification:</strong> Providers such as Kefiano Autos and craft studios must hold active registered business identities before handling real customer requests.
        </p>
        <p>
          3. <strong>Zero Misleading Solicitations:</strong> Never promise guaranteed riches, lottery returns, or celebrity access.
        </p>
      </section>
    </div>
  );
};
