import React, { useState } from 'react';
import { Destination, Experience, ExperienceCategory, User } from '../../types';
import { InteractiveResortTour } from './InteractiveResortTour';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building,
  Target,
  GraduationCap,
} from 'lucide-react';

interface Props {
  pilotDestination: Destination;
  experiences: Experience[];
  currentUser: User;
  onNavigateToTab: (tab: string) => void;
  onSelectExperienceToBook: (expId: string) => void;
}

export const ExploreView: React.FC<Props> = ({
  pilotDestination,
  experiences,
  currentUser,
  onNavigateToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalExp, setActiveModalExp] = useState<Experience | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'experience_enjoyment', label: 'Experience & Enjoyment' },
    { id: 'learn_discover', label: 'Learn & Discover' },
    { id: 'create_build', label: 'Create & Build' },
    { id: 'grow_achieve', label: 'Grow & Achieve' },
  ];

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory =
      selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesSearch =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-sm">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/private_jet_ambition_1791922041488.jpg"
            alt="JET OFF Vision"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl p-6 sm:p-10 md:p-14 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>The Aspirational Progress Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Your dream. Your journey.{' '}
            <span className="text-slate-300 font-normal block sm:inline">
              We stand with you until the end.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            JET OFF exists to help you access worthwhile experiences and pursue ambitions you may have considered beyond reach. You do not need wealth to begin — a ₦1,000 contribution towards a milestone is a valid and celebrated step.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToTab('goals')}
              className="px-5 py-3 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Target className="w-4 h-4 text-slate-900" />
              <span>Pursue a Long-Term Ambition</span>
            </button>
            <button
              onClick={() => onNavigateToTab('play')}
              className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <span>Explore Virtual Game (₦100,000)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pilot Demonstrator: Yuby Resort Interactive Tour */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              Featured Partner Pilot
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              01. Yuby Resort Pre-Arrival Experience
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Prepare before you visit: inspect the entrance gate, approach driveway, mandatory reception protocols, and verified activities.
          </p>
        </div>

        <InteractiveResortTour
          destination={pilotDestination}
          onBookExperience={(expId) => {
            const exp = experiences.find((e) => e.id === expId);
            if (exp) setActiveModalExp(exp);
          }}
          onGoToCoach={() => onNavigateToTab('coach')}
        />
      </section>

      {/* Curated Experience Marketplace */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              Curated Opportunities
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              02. Explore Real-World Experiences & Workshops
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Every listing delivers tangible enjoyment, practical skills, or personal exposure through verified partners.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences, workshops, autos..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
            />
          </div>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              {/* Media */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                <img
                  src={exp.imageUrl}
                  alt={exp.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-xs font-bold tabular-nums border border-white/10">
                  ₦{exp.price.toLocaleString()}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                    <span>{exp.providerName}</span>
                    {exp.providerVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{exp.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-slate-700 transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {exp.whatYouWillLearnOrGain}
                  </p>
                </div>

                {/* Footer / CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {exp.availableDates.length} upcoming slots
                  </span>
                  <button
                    onClick={() => setActiveModalExp(exp)}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    View Details & Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No experiences match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search or switching categories.</p>
          </div>
        )}
      </section>

      {/* Booking / Details Modal */}
      {activeModalExp && (
        <ExperienceDetailModal
          experience={activeModalExp}
          isOpen={!!activeModalExp}
          onClose={() => setActiveModalExp(null)}
          currentUser={currentUser}
          onBookingSubmitted={() => {
            // Stay in modal confirmation view, handled internally
          }}
        />
      )}
    </div>
  );
};
