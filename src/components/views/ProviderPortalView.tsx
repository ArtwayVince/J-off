import React, { useState } from 'react';
import { BookingRequest, Experience, User } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  Store,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  FileCheck,
} from 'lucide-react';

interface Props {
  currentUser: User;
  experiences: Experience[];
  bookings: BookingRequest[];
  onRefreshData: () => void;
}

export const ProviderPortalView: React.FC<Props> = ({
  currentUser,
  experiences,
  bookings,
  onRefreshData,
}) => {
  const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false);
  const [responseNotes, setResponseNotes] = useState<{ [key: string]: string }>({});

  // New Listing Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Experience['category']>('experience_enjoyment');
  const [location, setLocation] = useState<string>('Lagos, Nigeria');
  const [duration, setDuration] = useState<string>('3 Hours');
  const [price, setPrice] = useState<string>('25000');
  const [whatYouLearn, setWhatYouLearn] = useState<string>('');
  const [inclusions, setInclusions] = useState<string>('Guided tour, safety gear, refreshment');

  const providerBookings = bookings.filter(
    (b) => b.providerName.toLowerCase().includes('yuby') || b.providerId === 'prov_yuby'
  );

  const handleConfirmBooking = (bookingId: string) => {
    const note =
      responseNotes[bookingId] ||
      'Confirmed! Your time slot has been secured. Concierge will welcome you at Main Reception.';
    JetOffStore.updateBookingStatus(bookingId, 'confirmed', note);
    onRefreshData();
  };

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!title.trim() || isNaN(numPrice) || numPrice <= 0) return;

    JetOffStore.createExperience({
      title: title.trim(),
      category,
      providerId: 'prov_yuby',
      providerName: 'Yuby Resort Hospitality Partner',
      providerVerified: true,
      location,
      duration,
      price: numPrice,
      includes: inclusions.split(',').map((s) => s.trim()).filter(Boolean),
      whatYouWillLearnOrGain: whatYouLearn.trim(),
      prerequisites: ['Valid government identification', 'Advance check-in clearance'],
      safetyConsiderations: ['Standard venue liability briefing'],
      imageUrl: '/src/assets/images/resort_pool_activities_1791922040280.jpg',
      availableDates: ['2026-11-05', '2026-11-12'],
      cancellationPolicy: '48 hours advance notice required.',
    });

    setIsCreatingListing(false);
    setTitle('');
    setWhatYouLearn('');
    onRefreshData();
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">Partner Concierge Hub</div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Provider Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage verified venue offerings, availability, and customer reservation requests.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingListing(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Experience Listing</span>
        </button>
      </div>

      {/* Partner Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Yuby Resort Hospitality Operations</h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Entity</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Account: operations@yubyresort.ng · Epe / Lagos Corridor
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-snug max-w-sm">
          <strong>Listing Governance:</strong> All newly submitted packages require compliance review by JET OFF platform administrators before public marketplace exposure.
        </div>
      </div>

      {/* Booking Enquiries Management */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Incoming Reservation Enquiries</h3>
            <p className="text-xs text-slate-500">
              Review and confirm guest slots to finalize booking status.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 tabular-nums">
            {providerBookings.length} inquiry(ies)
          </span>
        </div>

        <div className="space-y-4">
          {providerBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.experienceTitle}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Guest: <strong className="text-slate-800">{b.userName}</strong> ({b.userPhone})</span>
                    <span aria-hidden="true">·</span>
                    <span>Date: <strong className="text-slate-800">{b.requestedDate}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Guests: <strong className="text-slate-800">{b.numberOfParticipants}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums block">
                    ₦{b.totalEstimatedPrice.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {b.userNotes && (
                <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  <strong>Guest Note:</strong> "{b.userNotes}"
                </p>
              )}

              {b.status !== 'confirmed' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter confirmation instructions or reception protocol notes..."
                    value={responseNotes[b.id] || ''}
                    onChange={(e) =>
                      setResponseNotes({ ...responseNotes, [b.id]: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <button
                    onClick={() => handleConfirmBooking(b.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 whitespace-nowrap"
                  >
                    Confirm Guest Slot
                  </button>
                </div>
              )}
            </div>
          ))}

          {providerBookings.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No reservation requests currently assigned to this provider.
            </div>
          )}
        </div>
      </section>

      {/* Create Listing Modal */}
      {isCreatingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Create New Experience Listing
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted listings remain in 'Pending Review' until approved by Platform Admin.
              </p>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Experience Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset Barbecue & Acoustic Music Night"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="experience_enjoyment">Experience & Enjoyment</option>
                    <option value="learn_discover">Learn & Discover</option>
                    <option value="create_build">Create & Build</option>
                    <option value="grow_achieve">Grow & Achieve</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₦ / Person)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">What You Learn or Experience</label>
                <textarea
                  rows={2}
                  value={whatYouLearn}
                  onChange={(e) => setWhatYouLearn(e.target.value)}
                  placeholder="Explain what practical experience or enjoyment the participant will gain..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inclusions (comma separated)</label>
                <input
                  type="text"
                  value={inclusions}
                  onChange={(e) => setInclusions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
