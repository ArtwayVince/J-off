import React, { useState } from 'react';
import { Mission, MissionChoice, VirtualWallet } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  Gamepad2,
  Wallet,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Brain,
  Scale,
} from 'lucide-react';

interface Props {
  wallet: VirtualWallet;
  missions: Mission[];
  onWalletUpdated: () => void;
  onMissionsUpdated: () => void;
}

export const PlayGameView: React.FC<Props> = ({
  wallet,
  missions,
  onWalletUpdated,
  onMissionsUpdated,
}) => {
  const [activeMissionId, setActiveMissionId] = useState<string>(missions[0]?.id || '');
  const [selectedChoice, setSelectedChoice] = useState<MissionChoice | null>(null);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const handleExecuteChoice = (choice: MissionChoice) => {
    if (!activeMission) return;
    const res = JetOffStore.chooseMissionOption(activeMission.id, choice.id);
    if (res.success) {
      setExecutionResult(res.message);
      onWalletUpdated();
      onMissionsUpdated();
    } else {
      alert(res.message);
    }
  };

  const handleResetSimulation = () => {
    if (window.confirm('Reset virtual simulation balance back to ₦100,000 and clear mission trials?')) {
      JetOffStore.resetVirtualWallet();
      missions.forEach((m) => {
        m.completed = false;
        m.userChoiceId = undefined;
      });
      JetOffStore.saveMissions(missions);
      setExecutionResult(null);
      setSelectedChoice(null);
      onWalletUpdated();
      onMissionsUpdated();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Simulation Currency Warning & Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>Simulated Resource Environment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              The Trade-Off & Consequence Simulator
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Make decisions that test spending, saving, postponing, and prioritizing in a zero-risk educational sandbox.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleResetSimulation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
          </div>
        </div>

        {/* Currency Card & Legal Notice */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Virtual Game Balance
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-1">
                ₦{wallet.balance.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Starting Grant: ₦{wallet.initialGrant.toLocaleString()}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="md:col-span-7 bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5 font-semibold">
                Crucial Boundary: Virtual Currency Has No Cash Value
              </strong>
              This ₦100,000 is strictly a gameplay token provided to explore opportunity costs. It cannot be converted to actual money, withdrawn, or used for real purchases.
            </div>
          </div>
        </div>
      </section>

      {/* Decision Challenges & Missions */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-slate-500 font-medium">Interactive Scenarios</div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Active Resource-Allocation Dilemmas
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {missions.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMissionId(m.id);
                  setExecutionResult(null);
                  setSelectedChoice(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeMissionId === m.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Dilemma #{idx + 1}: {m.title}
              </button>
            ))}
          </div>
        </div>

        {activeMission && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Dilemma Scenario Premise */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-900">{activeMission.title}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{activeMission.category.replace('_', ' ')}</span>
                {activeMission.completed && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Decided</span>
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {activeMission.scenario}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <strong>Context:</strong> {activeMission.context}
              </p>
            </div>

            {/* Execution Result Banner if just selected */}
            {executionResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Consequence Logged:</strong>
                  <p className="mt-0.5 leading-relaxed">{executionResult}</p>
                </div>
              </div>
            )}

            {/* Choices Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Compare Your Action Options
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {activeMission.choices.map((choice) => {
                  const isSelected = activeMission.userChoiceId === choice.id;
                  const canAfford = wallet.balance >= choice.virtualCost;

                  return (
                    <div
                      key={choice.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-sm font-bold text-slate-900">{choice.title}</h5>
                          <span className="text-xs font-mono font-bold text-slate-900 tabular-nums bg-slate-100 px-2 py-0.5 rounded shrink-0">
                            ₦{choice.virtualCost.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs space-y-2">
                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                            <strong className="block text-slate-900 font-semibold mb-0.5">
                              Immediate Outcome:
                            </strong>
                            <p>{choice.immediateBenefit}</p>
                          </div>

                          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                            <strong className="block text-slate-900 font-semibold mb-0.5">
                              Long-Term Consequence:
                            </strong>
                            <p>{choice.consequenceAnalysis}</p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>Future Flexibility:</span>
                            <span className="font-semibold text-slate-800">{choice.futureFlexibility}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        {isSelected ? (
                          <div className="w-full py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Your Chosen Path</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleExecuteChoice(choice)}
                            disabled={!canAfford || activeMission.completed}
                            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                              canAfford
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {!canAfford
                              ? 'Insufficient Virtual Balance'
                              : activeMission.completed
                              ? 'Dilemma Already Decided'
                              : `Commit Choice (₦${choice.virtualCost.toLocaleString()})`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Virtual Ledger / Consequence History */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Virtual Simulation Ledger</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {wallet.transactions.length} record(s)
          </span>
        </div>

        <div className="space-y-3">
          {wallet.transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{tx.description}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{tx.consequenceNote}</p>
              </div>

              <div
                className={`font-mono font-bold text-sm tabular-nums shrink-0 ${
                  tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                }`}
              >
                {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
