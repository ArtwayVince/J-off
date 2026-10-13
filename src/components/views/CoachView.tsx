import React, { useState } from 'react';
import { ReadinessCheckItem, ScenarioSimulation } from '../../types';
import { SCENARIO_SIMULATIONS } from '../../data/seedData';
import { JetOffStore } from '../../services/storage';
import {
  GraduationCap,
  CheckSquare,
  Square,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface Props {
  readinessItems: ReadinessCheckItem[];
  onToggleItem: (id: string) => void;
}

export const CoachView: React.FC<Props> = ({ readinessItems, onToggleItem }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [userSelectedOptionId, setUserSelectedOptionId] = useState<string | null>(null);

  const activeScenario: ScenarioSimulation =
    SCENARIO_SIMULATIONS[selectedScenarioIndex] || SCENARIO_SIMULATIONS[0];

  const completedCount = readinessItems.filter((i) => i.isCompleted).length;
  const overallScore = Math.round((completedCount / Math.max(1, readinessItems.length)) * 100);

  const dimensions = [
    { name: 'Knowledge', desc: 'Route, venue layout & rules', items: readinessItems.filter(i => i.category === 'Knowledge') },
    { name: 'Practical Preparation', desc: 'Attire, packing & gear', items: readinessItems.filter(i => i.category === 'Practical Preparation') },
    { name: 'Budget Awareness', desc: 'Menu costs & optional fees', items: readinessItems.filter(i => i.category === 'Budget Awareness') },
    { name: 'Requirements', desc: 'Government photo ID & waivers', items: readinessItems.filter(i => i.category === 'Requirements') },
    { name: 'Confirmed Access', desc: 'Verified booking vouchers', items: readinessItems.filter(i => i.category === 'Confirmed Access') },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Personal Competence & Experience Readiness</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              The JET OFF Readiness Coach
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Real confidence comes from preparation. Walk through realistic arrival roleplays and track your five readiness dimensions.
            </p>
          </div>

          {/* Readiness Scoreboard */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 self-start md:self-auto">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wide block font-semibold">
                Readiness Score
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {overallScore}%
              </div>
            </div>
            <div className="text-xs text-slate-500 leading-snug">
              <span className="font-semibold text-slate-800">{completedCount} of {readinessItems.length}</span>{' '}
              safeties verified
            </div>
          </div>
        </div>
      </section>

      {/* Scenario Roleplay Simulator */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">Interactive Practice</div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Venue Scenario Roleplay
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {SCENARIO_SIMULATIONS.map((sim, idx) => (
              <button
                key={sim.id}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setUserSelectedOptionId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedScenarioIndex === idx
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Roleplay #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Scenario Card */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">{activeScenario.title}</h3>
            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
              <strong>Situation:</strong> {activeScenario.context}
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              What do you do?
            </span>

            {activeScenario.options.map((opt) => {
              const isSelected = userSelectedOptionId === opt.id;
              return (
                <div key={opt.id} className="space-y-2">
                  <button
                    onClick={() => setUserSelectedOptionId(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${
                      isSelected
                        ? opt.isOptimal
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      {isSelected ? (opt.isOptimal ? '✓' : '✗') : '•'}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>

                  {/* Immediate Feedback */}
                  {isSelected && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        opt.isOptimal
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50/70 border-amber-200 text-amber-900'
                      }`}
                    >
                      <strong>Coach Feedback:</strong> {opt.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5-Dimension Readiness Checklist */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <div className="text-xs text-slate-500 font-medium">Pre-Flight Audit</div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            The Five Dimensions of Experience Readiness
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Check off each prerequisite to ensure you arrive confident, compliant, and prepared.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions.map((dim, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{dim.name}</h3>
                  <span className="text-[11px] text-slate-500">{dim.desc}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-semibold tabular-nums">
                  {dim.items.filter((i) => i.isCompleted).length} / {dim.items.length}
                </span>
              </div>

              <div className="space-y-2">
                {dim.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className="cursor-pointer bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="mt-0.5 text-slate-400">
                      {item.isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="text-xs">
                      <p
                        className={`font-semibold ${
                          item.isCompleted ? 'text-slate-800 line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.question}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
