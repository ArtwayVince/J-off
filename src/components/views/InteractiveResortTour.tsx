import React, { useState } from 'react';
import { Destination, TourStop } from '../../types';
import {
  Compass,
  MapPin,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  BadgeCheck,
  CalendarCheck,
} from 'lucide-react';

interface Props {
  destination: Destination;
  onBookExperience: (experienceId: string) => void;
  onGoToCoach: () => void;
}

export const InteractiveResortTour: React.FC<Props> = ({
  destination,
  onBookExperience,
  onGoToCoach,
}) => {
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'walkthrough' | 'interactive_map'>('walkthrough');
  const [showReceptionModal, setShowReceptionModal] = useState<boolean>(false);

  const currentStop: TourStop = destination.tourStops[activeStopIndex] || destination.tourStops[0];

  const handleNext = () => {
    if (activeStopIndex < destination.tourStops.length - 1) {
      setActiveStopIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStopIndex > 0) {
      setActiveStopIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Pilot Demonstrator Transparency Notice */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-semibold">Demonstrator Status:</strong> {destination.statusDisclaimer}
          </span>
        </div>
        <span className="text-amber-800 font-medium shrink-0">
          State: {destination.state}
        </span>
      </div>

      {/* Tour Header & Navigation Mode Toggles */}
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Destination Pilot Tour</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">{destination.name}</span>
            <span aria-hidden="true">·</span>
            <span>{destination.location}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Virtual Pre-Arrival & Venue Orientation
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Learn the exact approach driveway, reception clearance steps, and confirmed facilities before arriving physically.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-center">
          <button
            onClick={() => setViewMode('walkthrough')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'walkthrough'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Step-by-Step Walkthrough
          </button>
          <button
            onClick={() => setViewMode('interactive_map')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === 'interactive_map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Venue Route Map
          </button>
        </div>
      </div>

      {/* Main Tour Body */}
      {viewMode === 'walkthrough' ? (
        <div className="p-6 md:p-8 space-y-6">
          {/* Progress Timeline Scroller */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {destination.tourStops.map((stop, idx) => (
                <button
                  key={stop.id}
                  onClick={() => setActiveStopIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    activeStopIndex === idx
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="truncate max-w-[140px]">{stop.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Stop Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Media with Scrim */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
              <img
                src={currentStop.photoUrl}
                alt={currentStop.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Information & Protocol Details */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Area Orientation & Purpose
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{currentStop.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentStop.description}
                </p>
              </div>

              {/* Mandatory Reception Clearance Callout if Stop 1, 2, or 3 */}
              {currentStop.receptionRequirement && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Access Restriction & Mandatory Clearance</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {currentStop.receptionRequirement}
                  </p>
                  <button
                    onClick={() => setShowReceptionModal(true)}
                    className="mt-1 text-xs font-bold text-amber-950 underline hover:text-black block"
                  >
                    View Step-by-Step Reception Check-in Protocol →
                  </button>
                </div>
              )}

              {/* Confirmed Facilities Checklist */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">
                  Confirmed Physical Facilities at this Stop
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentStop.confirmedFacilities.map((fac, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Etiquette & Safety Notice */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <BadgeCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Real-World Etiquette & Rules</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{currentStop.etiquetteNotes}</p>
                {currentStop.verifiedCostNote && (
                  <p className="text-slate-900 font-semibold pt-1 border-t border-slate-200/60">
                    Pricing Note: {currentStop.verifiedCostNote}
                  </p>
                )}
              </div>

              {/* Prev / Next Stop Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  disabled={activeStopIndex === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Stop</span>
                </button>
                
                <span className="text-xs text-slate-500 font-medium">
                  {activeStopIndex + 1} / {destination.tourStops.length}
                </span>

                <button
                  onClick={handleNext}
                  disabled={activeStopIndex === destination.tourStops.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next Stop</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Venue Map View */
        <div className="p-6 md:p-8 space-y-6">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] max-h-[500px]">
            <img
              src="/src/assets/images/hero_yuby_resort_1791922037790.jpg"
              alt="Yuby Resort Layout"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-slate-950/40" />

            {/* Simulated Interactive Route Map Markers */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white text-xs font-medium text-slate-900 self-start">
                Tap any numbered station to inspect pre-arrival rules and protocols:
              </div>

              {destination.tourStops.map((stop, idx) => (
                <button
                  key={stop.id}
                  onClick={() => {
                    setActiveStopIndex(idx);
                    setViewMode('walkthrough');
                  }}
                  style={{
                    position: 'absolute',
                    left: `${stop.coordinates.x}%`,
                    top: `${stop.coordinates.y}%`,
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 group flex items-center gap-2 p-1.5 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 ${
                    activeStopIndex === idx
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30'
                      : 'bg-white/95 text-slate-900 hover:bg-white'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold pr-2 whitespace-nowrap">
                    {stop.title.split(' ')[0]}
                  </span>
                </button>
              ))}

              <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-white/10 self-end max-w-sm">
                <strong>Protocol Reminder:</strong> All movement into the Pool and Equestrian areas is restricted until reception wristbands are verified.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facilities & Verified Rates Grid */}
      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Confirmed Resort Activities & Verified Pricing
            </h3>
            <p className="text-xs text-slate-500">
              Rates confirmed for pilot simulation. Actual real-world booking requires confirmed partner voucher.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{destination.openingHours}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {destination.facilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{fac.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {fac.pricing}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <strong>Ready to prepare?</strong> Test your pre-arrival readiness score or request a Day Pass booking.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onGoToCoach}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              Practice Reception Simulation
            </button>
            <button
              onClick={() => onBookExperience('exp_yuby_day_pass')}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 rounded-xl text-xs font-semibold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Day Pass (₦18,500)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Reception Check-In Procedures Modal */}
      {showReceptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {destination.receptionProtocol.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Official protocol enforced at the Main Concierge Pavilion
                </p>
              </div>
              <button
                onClick={() => setShowReceptionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              {destination.receptionProtocol.mandatorySteps.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p><strong>Required Documentation:</strong> {destination.receptionProtocol.documentationNeeded}</p>
              <p><strong>Dress Code Notice:</strong> {destination.receptionProtocol.dressCode}</p>
              <p><strong>Entry Restrictions:</strong> {destination.receptionProtocol.entryRestrictions}</p>
            </div>

            <button
              onClick={() => setShowReceptionModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              I Understand the Arrival Protocol
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
