import React, { useState } from 'react';
import { Goal, SavingsContribution } from '../../types';
import { JetOffStore } from '../../services/storage';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedGoal: Goal, contribution: SavingsContribution) => void;
}

export const ContributionModal: React.FC<Props> = ({ goal, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<string>('5000');
  const [note, setNote] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<SavingsContribution | null>(null);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid contribution amount greater than ₦0.');
      return;
    }
    setError('');

    try {
      const { goal: updatedGoal, contribution } = JetOffStore.recordSavingsContribution(
        goal.id,
        numAmount,
        note.trim() || undefined
      );
      setSubmittedFeedback(contribution);
      onSuccess(updatedGoal, contribution);
    } catch (err: any) {
      setError(err?.message || 'Failed to record contribution.');
    }
  };

  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Record Real-Life Savings Step</h3>
            <p className="text-xs text-slate-500 truncate max-w-sm">Towards: {goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedFeedback ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Step Recorded!</h4>
              <p className="text-sm font-semibold text-emerald-700 mt-1">
                +₦{submittedFeedback.amount.toLocaleString()} Added to Your Ambition Fund
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm text-slate-700 leading-relaxed">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>{submittedFeedback.encouragingMessage}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Note: JET OFF tracks self-reported savings for personal discipline. We do not hold your money or claim third-party bank verification.
            </p>
            <button
              onClick={() => {
                setSubmittedFeedback(null);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Back to Goal Journey
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                Amount Saved into Personal Account (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white tabular-nums"
                  placeholder="e.g. 1000"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Whether ₦1,000 or ₦100,000, every genuine contribution is celebrated.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Quick Select</label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(String(q))}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      amount === String(q)
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₦{q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                Personal Discipline Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Skipped takeout lunch, saved from side gig"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                maxLength={100}
              />
            </div>

            {error && <div className="text-xs text-rose-600 font-medium">{error}</div>}

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-snug">
              <strong className="font-semibold">Honesty Pledge:</strong> Self-reporting your savings cultivates true self-governance. JET OFF does not hold customer funds or issue credit.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
              >
                Confirm Step
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
