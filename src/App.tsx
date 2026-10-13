import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/layout/Navbar';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { ExploreView } from './components/views/ExploreView';
import { GoalsView } from './components/views/GoalsView';
import { PlayGameView } from './components/views/PlayGameView';
import { CoachView } from './components/views/CoachView';
import { BookingsView } from './components/views/BookingsView';
import { ProviderPortalView } from './components/views/ProviderPortalView';
import { AdminPortalView } from './components/views/AdminPortalView';
import { AuthModal } from './components/views/AuthModal';
import { JetOffStore } from './services/storage';
import { PILOT_RESORT } from './data/seedData';
import {
  BookingRequest,
  Experience,
  Goal,
  Mission,
  ReadinessCheckItem,
  User,
  VirtualWallet,
} from './types';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [currentUser, setCurrentUser] = useState<User>(() => JetOffStore.getUser());
  const [virtualWallet, setVirtualWallet] = useState<VirtualWallet>(() => JetOffStore.getWallet());
  const [goals, setGoals] = useState<Goal[]>(() => JetOffStore.getGoals());
  const [experiences, setExperiences] = useState<Experience[]>(() => JetOffStore.getExperiences(false));
  const [allExperiences, setAllExperiences] = useState<Experience[]>(() => JetOffStore.getExperiences(true));
  const [bookings, setBookings] = useState<BookingRequest[]>(() => JetOffStore.getBookings());
  const [missions, setMissions] = useState<Mission[]>(() => JetOffStore.getMissions());
  const [readinessItems, setReadinessItems] = useState<ReadinessCheckItem[]>(() =>
    JetOffStore.getReadinessItems()
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync state helpers
  const refreshAll = () => {
    setCurrentUser(JetOffStore.getUser());
    setVirtualWallet(JetOffStore.getWallet());
    setGoals(JetOffStore.getGoals());
    setExperiences(JetOffStore.getExperiences(false));
    setAllExperiences(JetOffStore.getExperiences(true));
    setBookings(JetOffStore.getBookings());
    setMissions(JetOffStore.getMissions());
    setReadinessItems(JetOffStore.getReadinessItems());
  };

  const handleToggleReadinessItem = (id: string) => {
    const updated = JetOffStore.toggleReadinessItem(id);
    setReadinessItems(updated);
  };

  const hasPendingBookings = bookings.some(
    (b) => b.userId === currentUser.id && b.status === 'awaiting_provider_confirmation'
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Global Transparency Banner */}
      <DisclaimerBanner />

      {/* Top Bar Contract Compliant Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        virtualBalance={virtualWallet.balance}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeTab === 'explore' && (
          <ExploreView
            pilotDestination={PILOT_RESORT}
            experiences={experiences}
            currentUser={currentUser}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onSelectExperienceToBook={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            currentUser={currentUser}
            onRefreshGoals={refreshAll}
            onExploreExperiences={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'play' && (
          <PlayGameView
            wallet={virtualWallet}
            missions={missions}
            onWalletUpdated={refreshAll}
            onMissionsUpdated={refreshAll}
          />
        )}

        {activeTab === 'coach' && (
          <CoachView
            readinessItems={readinessItems}
            onToggleItem={handleToggleReadinessItem}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            currentUser={currentUser}
            onRefreshBookings={refreshAll}
            onExploreExperiences={() => setActiveTab('explore')}
          />
        )}

        {activeTab === 'provider_portal' && (
          <ProviderPortalView
            currentUser={currentUser}
            experiences={allExperiences}
            bookings={bookings}
            onRefreshData={refreshAll}
          />
        )}

        {activeTab === 'admin_portal' && (
          <AdminPortalView
            currentUser={currentUser}
            allExperiences={allExperiences}
            allBookings={bookings}
            allGoals={goals}
            onRefreshData={refreshAll}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 font-display text-sm">JET OFF</span>
            <p className="text-slate-500 max-w-md">
              "Your dream. Your journey. We stand with you until the end." Building real-world readiness, practical competence, and financial discipline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span>© 2026 JET OFF Technologies</span>
            <span aria-hidden="true">·</span>
            <span>Nigerian Pilot Edition</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-slate-900 underline font-medium"
            >
              Role Switcher ({currentUser.role})
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Tab Bar */}
      <MobileTabBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        hasPendingBookings={hasPendingBookings}
      />

      {/* Account & Role Switcher Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={currentUser}
          onUserUpdated={(updated) => {
            setCurrentUser(updated);
            refreshAll();
          }}
          onDataReset={refreshAll}
        />
      )}
    </div>
  );
}
