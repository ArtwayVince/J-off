import React, { useState } from 'react';
import { Goal, Milestone, SavingsContribution, User } from '../../types';
import { JetOffStore } from '../../services/storage';
import { ContributionModal } from '../common/ContributionModal';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Edit3,
  TrendingUp,
  History,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  goals: Goal[];
  currentUser: User;
  onRefreshGoals: () => void;
  onExploreExperiences: () => void;
}

export const GoalsView: React.FC<Props> = ({
  goals,
  currentUser,
  onRefreshGoals,
  onExploreExperiences,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    currentUser.currentGoalId || goals[0]?.id || ''
  );
  const [isContributionModalOpen, setIsContributionModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isReviseModalOpen, setIsReviseModalOpen] = useState<boolean>(false);
  const [showFullHistory, setShowFullHistory] = useState<boolean>(false);

  // Revise form state
  const [revisedTarget, setRevisedTarget] = useState<string>('');
  const [revisedDate, setRevisedDate] = useState<string>('');

  // Create Goal form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Goal['category']>('enterprise');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newTargetCost, setNewTargetCost] = useState<string>('1500000');
  const [newReviewDate, setNewReviewDate] = useState<string>('2027-12-31');
  const [newFrequency, setNewFrequency] = useState<Goal['preferredFrequency']>('monthly');

  const activeGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  if (!activeGoal) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
        <Target className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Ambitions Set Yet</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Begin your journey by selecting a long-term goal. Whether learning a craft, building a farm, or private aviation.
        </p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Create First Ambition
        </button>
      </div>
    );
  }

  const progressPct = Math.min(
    100,
    Math.round((activeGoal.currentSaved / activeGoal.targetCost) * 100)
  );
  const remaining = Math.max(0, activeGoal.targetCost - activeGoal.currentSaved);

  const handleToggleStatus = () => {
    const nextStatus = activeGoal.status === 'active' ? 'paused' : 'active';
    JetOffStore.updateGoalStatus(activeGoal.id, nextStatus);
    onRefreshGoals();
  };

  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(revisedTarget);
    if (isNaN(num) || num <= 0) return;
    JetOffStore.reviseGoalTarget(activeGoal.id, num, revisedDate || activeGoal.targetReviewDate);
    setIsReviseModalOpen(false);
    onRefreshGoals();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = Number(newTargetCost);
    if (!newTitle.trim() || isNaN(numTarget) || numTarget <= 0) return;

    const created = JetOffStore.addGoal({
      userId: currentUser.id,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      targetCost: numTarget,
      status: 'active',
      preferredFrequency: newFrequency,
      targetReviewDate: newReviewDate,
      imageUrl: '/src/assets/images/private_jet_ambition_1791922041488.jpg',
      nextRecommendedAction: 'Record your very first savings deposit (even ₦1,000) to start your timeline.',
      milestones: [
        {
          id: `ms_${Date.now()}_1`,
          title: 'First Milestone Seed & Study',
          targetAmount: Math.round(numTarget * 0.1),
          description: 'Establish foundation, research requirements, and verify realistic quotations.',
          isCompleted: false,
        },
        {
          id: `ms_${Date.now()}_2`,
          title: 'Midway Capital Consolidation',
          targetAmount: Math.round(numTarget * 0.5),
          description: 'Reach 50% target cost and complete relevant practical training.',
          isCompleted: false,
        },
        {
          id: `ms_${Date.now()}_3`,
          title: 'Final Ambition Realization',
          targetAmount: numTarget,
          description: 'Execute booking or project commencement.',
          isCompleted: false,
        },
      ],
    });

    setIsCreateModalOpen(false);
    setSelectedGoalId(created.id);
    onRefreshGoals();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Goal Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">Long-Term Ambition Engine</div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Your Personal Progress Roadmap
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            "Your dream. Your journey. We stand with you until the end." Celebrate consistency and small steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Propose New Ambition</span>
          </button>
        </div>
      </div>

      {/* Goal Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGoalId(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedGoalId === g.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{g.title}</span>
            <span className="text-[10px] opacity-75 tabular-nums">
              (₦{g.currentSaved.toLocaleString()})
            </span>
          </button>
        ))}
      </div>

      {/* Primary Goal Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Progress, KPIs, Milestones */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Goal Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="capitalize">{activeGoal.category} Ambition</span>
                  <span aria-hidden="true">·</span>
                  <span>Target Date: {activeGoal.targetReviewDate}</span>
                  <span aria-hidden="true">·</span>
                  <span className={`font-semibold ${activeGoal.status === 'paused' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {activeGoal.status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                  {activeGoal.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {activeGoal.description}
                </p>
              </div>

              {/* Goal Controls */}
              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={handleToggleStatus}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1"
                  title={activeGoal.status === 'paused' ? 'Resume Goal' : 'Pause Goal'}
                >
                  {activeGoal.status === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setRevisedTarget(String(activeGoal.targetCost));
                    setRevisedDate(activeGoal.targetReviewDate);
                    setIsReviseModalOpen(true);
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1"
                  title="Revise Target"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Revise</span>
                </button>
              </div>
            </div>

            {/* Financial Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                <span className="text-slate-500 font-medium">Self-Reported Progress</span>
                <span className="tabular-nums text-base">{progressPct}% of Goal</span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, progressPct)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Current Saved</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    ₦{activeGoal.currentSaved.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Target Cost</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    ₦{activeGoal.targetCost.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Remaining</span>
                  <span className="font-bold text-slate-700 text-sm tabular-nums">
                    ₦{remaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button: Record Savings Contribution */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ready to record another step?</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Whether ₦1,000 or ₦50,000, your contribution counts towards the next milestone.
                </p>
              </div>
              <button
                onClick={() => setIsContributionModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
              >
                Record Savings Contribution
              </button>
            </div>

            {/* Next Recommended Action */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-950">
              <TrendingUp className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong>Recommended Next Action:</strong>{' '}
                <span>{activeGoal.nextRecommendedAction}</span>
              </div>
            </div>
          </div>

          {/* Structured Milestones */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Roadmap Milestones & Preparation
                </h3>
                <p className="text-xs text-slate-500">
                  Each milestone pairs financial discipline with practical learning.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {activeGoal.milestones.filter((m) => m.isCompleted).length} /{' '}
                {activeGoal.milestones.length} Completed
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {activeGoal.milestones.map((ms, idx) => (
                <div
                  key={ms.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ms.isCompleted
                      ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {ms.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4
                          className={`text-sm font-bold ${
                            ms.isCompleted ? 'text-slate-900 line-through decoration-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {idx + 1}. {ms.title}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                          Target: ₦{ms.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{ms.description}</p>
                      {ms.completedAt && (
                        <div className="text-[11px] text-emerald-700 font-medium pt-1">
                          Completed on {ms.completedAt}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Savings Contribution History & Readiness */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contribution History Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">Savings Contribution History</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {activeGoal.contributions.length} entry(ies)
              </span>
            </div>

            <div className="space-y-3">
              {activeGoal.contributions.slice(0, showFullHistory ? undefined : 4).map((cnt) => (
                <div
                  key={cnt.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 tabular-nums">
                      +₦{cnt.amount.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400">{cnt.date}</span>
                  </div>
                  {cnt.note && (
                    <p className="text-slate-700 font-medium">"{cnt.note}"</p>
                  )}
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 leading-relaxed">
                    {cnt.encouragingMessage}
                  </p>
                </div>
              ))}

              {activeGoal.contributions.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No savings recorded yet. Record your first step today!
                </div>
              )}

              {activeGoal.contributions.length > 4 && (
                <button
                  onClick={() => setShowFullHistory(!showFullHistory)}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1"
                >
                  <span>{showFullHistory ? 'Show Less' : `View All (${activeGoal.contributions.length})`}</span>
                  {showFullHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Self-Governance & Persistence Guarantee Notice */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>The JET OFF Promise</span>
            </h4>
            <p>
              Your ambition remains permanently safely recorded. Whether you take a pause of months or years, your journey resumes whenever you return.
            </p>
            <p className="text-slate-500 text-[11px]">
              No penalty fees, no pressure, and no shaming. True progress is steady and personal.
            </p>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      {isContributionModalOpen && (
        <ContributionModal
          goal={activeGoal}
          isOpen={isContributionModalOpen}
          onClose={() => setIsContributionModalOpen(false)}
          onSuccess={() => {
            onRefreshGoals();
          }}
        />
      )}

      {/* Revise Target Modal */}
      {isReviseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Revise Ambition Target</h3>
            <p className="text-xs text-slate-500">
              Prices, circumstances, and plans change. Adjust your target without guilt.
            </p>

            <form onSubmit={handleReviseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adjusted Target Cost (₦)
                </label>
                <input
                  type="number"
                  value={revisedTarget}
                  onChange={(e) => setRevisedTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Target Review Date
                </label>
                <input
                  type="date"
                  value={revisedDate}
                  onChange={(e) => setRevisedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviseModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Ambition Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Propose a New Ambition</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define any meaningful milestone you wish to pursue.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ambition Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Tailoring & Commercial Garment Workshop"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="enterprise">Starting a Business</option>
                    <option value="agriculture">Agricultural Farm</option>
                    <option value="education">Pastoral & Education</option>
                    <option value="property">Home & Land</option>
                    <option value="aviation">Private Aviation Journey</option>
                    <option value="craft">Practical Craft Mastery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Cost (₦)</label>
                  <input
                    type="number"
                    value={newTargetCost}
                    onChange={(e) => setNewTargetCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Purpose</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain why this ambition matters to you and what preparation is required..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="flexible">Flexible (No pressure)</option>
                    <option value="weekly">Weekly discipline</option>
                    <option value="monthly">Monthly discipline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Review Date</label>
                  <input
                    type="date"
                    value={newReviewDate}
                    onChange={(e) => setNewReviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Establish Ambition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
