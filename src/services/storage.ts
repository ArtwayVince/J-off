import {
  BookingRequest,
  Experience,
  Goal,
  Mission,
  ReadinessCheckItem,
  SavingsContribution,
  User,
  VirtualTransaction,
  VirtualWallet,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_WALLET,
  PILOT_RESORT,
  SEED_EXPERIENCES,
  SEED_GOALS,
  SEED_MISSIONS,
  SEED_READINESS_ITEMS,
} from '../data/seedData';

const STORAGE_KEYS = {
  USER: 'jetoff_user_v1',
  WALLET: 'jetoff_wallet_v1',
  GOALS: 'jetoff_goals_v1',
  EXPERIENCES: 'jetoff_experiences_v1',
  MISSIONS: 'jetoff_missions_v1',
  BOOKINGS: 'jetoff_bookings_v1',
  READINESS: 'jetoff_readiness_v1',
};

// Safe JSON parse with fallback
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Storage load error for ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Storage save error for ${key}:`, err);
  }
}

// Initial seed bookings for realism
const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk_req_101',
    userId: INITIAL_USER.id,
    userName: INITIAL_USER.name,
    userEmail: INITIAL_USER.email,
    userPhone: INITIAL_USER.phone || '+234 803 219 8841',
    experienceId: 'exp_soap_workshop',
    experienceTitle: 'Artisan Shea Butter & Botanical Soap Formulation Workshop',
    providerId: 'prov_craft_guild',
    providerName: 'Lagos Craft & Cosmetics Guild',
    requestedDate: '2026-10-19',
    numberOfParticipants: 1,
    totalEstimatedPrice: 32000,
    status: 'confirmed',
    userNotes: 'Attending to prepare for cosmetics studio ambition.',
    providerResponseNotes: 'Confirmed! Safety goggles and mould reserved. Please wear long sleeves.',
    createdAt: '2026-02-18T14:00:00Z',
  },
  {
    id: 'bk_req_102',
    userId: INITIAL_USER.id,
    userName: INITIAL_USER.name,
    userEmail: INITIAL_USER.email,
    userPhone: INITIAL_USER.phone || '+234 803 219 8841',
    experienceId: 'exp_yuby_day_pass',
    experienceTitle: 'Yuby Resort Day Leisure & Swim Experience',
    providerId: 'prov_yuby',
    providerName: 'Yuby Resort Hospitality',
    requestedDate: '2026-10-25',
    numberOfParticipants: 2,
    totalEstimatedPrice: 37000,
    status: 'awaiting_provider_confirmation',
    userNotes: 'Celebration afternoon with my spouse.',
    providerResponseNotes: 'Your reservation request has been received. Our concierge is reviewing date slot availability.',
    createdAt: '2026-03-02T10:15:00Z',
  },
];

export const JetOffStore = {
  // User Management & Roles
  getUser(): User {
    return loadFromStorage<User>(STORAGE_KEYS.USER, INITIAL_USER);
  },

  setUser(user: User): void {
    saveToStorage(STORAGE_KEYS.USER, user);
  },

  updateUserRole(role: User['role']): User {
    const user = this.getUser();
    const updated: User = {
      ...user,
      role,
      name:
        role === 'admin'
          ? 'JET OFF Compliance Admin'
          : role === 'provider'
          ? 'Yuby Resort Operations Partner'
          : 'Chidi Okafor (Explorer)',
    };
    this.setUser(updated);
    return updated;
  },

  // Virtual Wallet
  getWallet(): VirtualWallet {
    return loadFromStorage<VirtualWallet>(STORAGE_KEYS.WALLET, INITIAL_WALLET);
  },

  updateWallet(wallet: VirtualWallet): void {
    saveToStorage(STORAGE_KEYS.WALLET, wallet);
  },

  deductVirtualCurrency(amount: number, description: string, consequenceNote: string): { success: boolean; error?: string } {
    const wallet = this.getWallet();
    if (wallet.balance < amount) {
      return { success: false, error: 'Insufficient virtual game currency for this decision.' };
    }
    const newTx: VirtualTransaction = {
      id: `tx_${Date.now()}`,
      amount,
      type: 'debit',
      description,
      category: 'experience_spend',
      timestamp: new Date().toISOString(),
      consequenceNote,
    };
    const updated: VirtualWallet = {
      ...wallet,
      balance: wallet.balance - amount,
      totalSpent: wallet.totalSpent + amount,
      transactions: [newTx, ...wallet.transactions],
    };
    this.updateWallet(updated);
    return { success: true };
  },

  rewardVirtualCurrency(amount: number, description: string, consequenceNote: string): void {
    const wallet = this.getWallet();
    const newTx: VirtualTransaction = {
      id: `tx_${Date.now()}`,
      amount,
      type: 'credit',
      description,
      category: 'mission_reward',
      timestamp: new Date().toISOString(),
      consequenceNote,
    };
    const updated: VirtualWallet = {
      ...wallet,
      balance: wallet.balance + amount,
      transactions: [newTx, ...wallet.transactions],
    };
    this.updateWallet(updated);
  },

  resetVirtualWallet(): VirtualWallet {
    this.updateWallet(INITIAL_WALLET);
    return INITIAL_WALLET;
  },

  // Goals Engine
  getGoals(): Goal[] {
    return loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, SEED_GOALS);
  },

  saveGoals(goals: Goal[]): void {
    saveToStorage(STORAGE_KEYS.GOALS, goals);
  },

  getGoalById(goalId: string): Goal | undefined {
    return this.getGoals().find((g) => g.id === goalId);
  },

  addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'contributions' | 'currentSaved' | 'readinessScore'>): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      currentSaved: 0,
      readinessScore: 10,
      contributions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newGoal, ...goals];
    this.saveGoals(updated);
    return newGoal;
  },

  recordSavingsContribution(goalId: string, amount: number, note?: string): { goal: Goal; contribution: SavingsContribution } {
    const goals = this.getGoals();
    const goalIndex = goals.findIndex((g) => g.id === goalId);
    if (goalIndex === -1) throw new Error('Goal not found');

    const targetGoal = goals[goalIndex];
    const newSaved = targetGoal.currentSaved + amount;

    // Encouraging realistic feedback message
    let encouragedMessage = '';
    if (amount <= 5000) {
      encouragedMessage = `You have taken another genuine step towards your ambition. The destination may still be far away, but your journey has begun. Every ₦${amount.toLocaleString()} is proof of your discipline. Let's make this contribution count by helping you prepare for the next milestone.`;
    } else if (amount <= 50000) {
      encouragedMessage = `Solid momentum! Adding ₦${amount.toLocaleString()} strengthens your foundation. Consistency in saving protects your ambition from everyday distractions.`;
    } else {
      encouragedMessage = `Substantial step forward! ₦${amount.toLocaleString()} added to your ambition fund. Remember to maintain an emergency cushion so you never have to liquidate your long-term dream prematurely.`;
    }

    const contribution: SavingsContribution = {
      id: `cnt_${Date.now()}`,
      goalId,
      amount,
      date: new Date().toISOString().split('T')[0],
      note,
      encouragingMessage: encouragedMessage,
    };

    // Check milestones
    const updatedMilestones = targetGoal.milestones.map((m) => {
      if (!m.isCompleted && newSaved >= m.targetAmount) {
        return {
          ...m,
          isCompleted: true,
          completedAt: new Date().toISOString().split('T')[0],
        };
      }
      return m;
    });

    const newReadiness = Math.min(
      95,
      Math.round((newSaved / targetGoal.targetCost) * 60 + (updatedMilestones.filter((m) => m.isCompleted).length / Math.max(1, updatedMilestones.length)) * 40)
    );

    const updatedGoal: Goal = {
      ...targetGoal,
      currentSaved: newSaved,
      readinessScore: newReadiness,
      milestones: updatedMilestones,
      contributions: [contribution, ...targetGoal.contributions],
      updatedAt: new Date().toISOString(),
    };

    goals[goalIndex] = updatedGoal;
    this.saveGoals(goals);
    return { goal: updatedGoal, contribution };
  },

  updateGoalStatus(goalId: string, status: Goal['status']): Goal | undefined {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index === -1) return undefined;
    goals[index] = { ...goals[index], status, updatedAt: new Date().toISOString() };
    this.saveGoals(goals);
    return goals[index];
  },

  reviseGoalTarget(goalId: string, newTargetCost: number, newReviewDate: string): Goal | undefined {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index === -1) return undefined;
    goals[index] = {
      ...goals[index],
      targetCost: newTargetCost,
      targetReviewDate: newReviewDate,
      status: 'revised',
      updatedAt: new Date().toISOString(),
    };
    this.saveGoals(goals);
    return goals[index];
  },

  // Experiences & Marketplace
  getExperiences(includePending = false): Experience[] {
    const all = loadFromStorage<Experience[]>(STORAGE_KEYS.EXPERIENCES, SEED_EXPERIENCES);
    if (includePending) return all;
    return all.filter((exp) => exp.status === 'approved');
  },

  saveExperiences(experiences: Experience[]): void {
    saveToStorage(STORAGE_KEYS.EXPERIENCES, experiences);
  },

  createExperience(expData: Omit<Experience, 'id' | 'status'>): Experience {
    const all = this.getExperiences(true);
    const newExp: Experience = {
      ...expData,
      id: `exp_${Date.now()}`,
      status: 'pending_review', // unapproved by default, requires admin review!
    };
    this.saveExperiences([newExp, ...all]);
    return newExp;
  },

  moderateExperience(id: string, status: 'approved' | 'pending_review' | 'draft'): void {
    const all = this.getExperiences(true);
    const updated = all.map((exp) => (exp.id === id ? { ...exp, status } : exp));
    this.saveExperiences(updated);
  },

  // Bookings
  getBookings(): BookingRequest[] {
    return loadFromStorage<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },

  saveBookings(bookings: BookingRequest[]): void {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  },

  createBookingRequest(data: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): BookingRequest {
    const bookings = this.getBookings();
    const newBooking: BookingRequest = {
      ...data,
      id: `bk_req_${Date.now()}`,
      status: 'requested', // Explicitly requested, awaiting confirmation
      createdAt: new Date().toISOString(),
      providerResponseNotes: 'Booking request sent to partner concierge. You will receive slot verification within 24 business hours.',
    };
    this.saveBookings([newBooking, ...bookings]);
    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingRequest['status'], responseNotes?: string): void {
    const bookings = this.getBookings();
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status, providerResponseNotes: responseNotes || b.providerResponseNotes } : b
    );
    this.saveBookings(updated);
  },

  // Missions & Game
  getMissions(): Mission[] {
    return loadFromStorage<Mission[]>(STORAGE_KEYS.MISSIONS, SEED_MISSIONS);
  },

  saveMissions(missions: Mission[]): void {
    saveToStorage(STORAGE_KEYS.MISSIONS, missions);
  },

  chooseMissionOption(missionId: string, choiceId: string): { success: boolean; message: string } {
    const missions = this.getMissions();
    const mIndex = missions.findIndex((m) => m.id === missionId);
    if (mIndex === -1) return { success: false, message: 'Mission not found' };

    const mission = missions[mIndex];
    const choice = mission.choices.find((c) => c.id === choiceId);
    if (!choice) return { success: false, message: 'Choice not found' };

    // Deduct virtual currency
    const deduction = this.deductVirtualCurrency(
      choice.virtualCost,
      `Mission Decision: ${choice.title}`,
      choice.consequenceAnalysis
    );

    if (!deduction.success) {
      return { success: false, message: deduction.error || 'Failed to execute choice.' };
    }

    missions[mIndex] = {
      ...mission,
      completed: true,
      userChoiceId: choiceId,
    };
    this.saveMissions(missions);

    return {
      success: true,
      message: `Decision committed. ${choice.consequenceAnalysis}`,
    };
  },

  // Readiness Checklist
  getReadinessItems(): ReadinessCheckItem[] {
    return loadFromStorage<ReadinessCheckItem[]>(STORAGE_KEYS.READINESS, SEED_READINESS_ITEMS);
  },

  toggleReadinessItem(id: string): ReadinessCheckItem[] {
    const items = this.getReadinessItems();
    const updated = items.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
    saveToStorage(STORAGE_KEYS.READINESS, updated);
    return updated;
  },

  // Reset to seed data
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.WALLET);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.READINESS);
  },
};
