import React, { useState } from 'react';
import { Experience, User, BookingRequest } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface Props {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onBookingSubmitted: (booking: BookingRequest) => void;
}

export const ExperienceDetailModal: React.FC<Props> = ({
  experience,
  isOpen,
  onClose,
  currentUser,
  onBookingSubmitted,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    experience.availableDates[0] || '2026-10-25'
  );
  const [participants, setParticipants] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [phone, setPhone] = useState<string>(currentUser.phone || '+234 ');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  if (!isOpen) return null;

  const totalPrice = experience.price * participants;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newBooking = JetOffStore.createBookingRequest({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: phone,
        experienceId: experience.id,
        experienceTitle: experience.title,
        providerId: experience.providerId,
        providerName: experience.providerName,
        requestedDate: selectedDate,
        numberOfParticipants: participants,
        totalEstimatedPrice: totalPrice,
        userNotes: notes.trim() || undefined,
      });

      setConfirmedBooking(newBooking);
      onBookingSubmitted(newBooking);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header / Media */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-900">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
              <span>{experience.providerName}</span>
              {experience.providerVerified && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Partner</span>
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight">
              {experience.title}
            </h2>
          </div>
        </div>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Reservation Request Dispatched</h3>
              <p className="text-xs text-slate-500 mt-1">
                Request Reference: <strong className="font-mono text-slate-800">{confirmedBooking.id}</strong>
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Requested Date</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.requestedDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Participants</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.numberOfParticipants} Person(s)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Estimated Total</span>
                <span className="font-semibold text-slate-900 tabular-nums">₦{confirmedBooking.totalEstimatedPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Status</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Awaiting Provider Confirmation
                </span>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 text-left leading-relaxed">
              <strong>What Happens Next:</strong> The concierge at <strong>{experience.providerName}</strong> will review capacity for {confirmedBooking.requestedDate}. Once verified, your status changes to <em>Confirmed</em> with digital arrival instructions.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Done & View Bookings Dashboard
            </button>
          </div>
        ) : (
          /* Experience Information & Request Form */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{experience.location}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{experience.duration}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="font-bold text-slate-900 tabular-nums text-sm">
                ₦{experience.price.toLocaleString()} / person
              </div>
            </div>

            {/* What you will gain */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                What You Will Learn & Experience
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {experience.whatYouWillLearnOrGain}
              </p>
            </div>

            {/* Inclusions */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                What Is Included in this Price
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {experience.includes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites & Safety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-semibold mb-1">Requirements & Prerequisites:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {experience.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 font-semibold mb-1">Safety Measures:</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {experience.safetyConsiderations.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Request Form */}
            <form onSubmit={handleBookingSubmit} className="pt-4 border-t border-slate-200 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Submit Real Experience Reservation Request</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Available Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {experience.availableDates.map((date) => (
                      <option key={date} value={date}>
                        {date} (Available)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Number of Attendees
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-semibold text-xs text-slate-900 w-8 text-center tabular-nums">
                      {participants}
                    </span>
                    <button
                      type="button"
                      onClick={() => setParticipants(participants + 1)}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone for WhatsApp & SMS Confirmation
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Notes or Group Requests (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Dietary preferences or arrival timing"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Price Calculation */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Booking Value</span>
                  <span className="text-xl font-bold font-mono tabular-nums text-white">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-300">
                  <span>{participants} participant(s)</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Pay only upon confirmation</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Cancellation Policy: {experience.cancellationPolicy} Payments are processed securely with authorized partner providers.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
