import React from 'react';
import { BookingRequest, User } from '../../types';
import { JetOffStore } from '../../services/storage';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  XCircle,
} from 'lucide-react';

interface Props {
  bookings: BookingRequest[];
  currentUser: User;
  onRefreshBookings: () => void;
  onExploreExperiences: () => void;
}

export const BookingsView: React.FC<Props> = ({
  bookings,
  currentUser,
  onRefreshBookings,
  onExploreExperiences,
}) => {
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      JetOffStore.updateBookingStatus(bookingId, 'cancelled', 'Cancelled by user request.');
      onRefreshBookings();
    }
  };

  const getStatusBadge = (status: BookingRequest['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Confirmed Partner Booking</span>
          </span>
        );
      case 'awaiting_provider_confirmation':
      case 'requested':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Awaiting Provider Confirmation</span>
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-sky-600" />
            <span>Attended & Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-slate-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium">Activity Records</div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Your Bookings & Attendance History
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Track submitted experience inquiries, confirmed partner vouchers, and completed learning attendance.
          </p>
        </div>

        <button
          onClick={onExploreExperiences}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors self-start sm:self-auto shadow-sm"
        >
          Explore New Opportunities
        </button>
      </div>

      {/* Critical Verification Notice */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block mb-0.5 font-bold">Booking Request Transparency:</strong>
          Inquiries are verified directly by registered providers (such as Yuby Resort concierge or Kefiano Autos dispatch). You will never be asked to make real-money payments before a partner officially verifies time-slot capacity.
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {userBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">#{b.id}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">
                  Requested: {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>{getStatusBadge(b.status)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-8 space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{b.experienceTitle}</h3>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span>Provider: <strong className="text-slate-800">{b.providerName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Date: <strong className="text-slate-800">{b.requestedDate}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Party: <strong className="text-slate-800">{b.numberOfParticipants} guest(s)</strong></span>
                </div>

                {b.userNotes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Your Note:</strong> "{b.userNotes}"
                  </p>
                )}

                {b.providerResponseNotes && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-semibold">
                      Provider Concierge Response:
                    </strong>
                    <p className="leading-relaxed">{b.providerResponseNotes}</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between self-stretch">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                    Total Estimated Amount
                  </span>
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
                    ₦{b.totalEstimatedPrice.toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  {b.status !== 'cancelled' && b.status !== 'attended' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Cancel Request
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">
                    Verified through JET OFF
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {userBookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Booking Inquiries Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you submit a reservation request for a resort day pass, limousine cruise, or workshop, it will appear here.
            </p>
            <button
              onClick={onExploreExperiences}
              className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Discover Experiences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
