export type UserRole = 'explorer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  registeredAt: string;
  currentGoalId?: string;
}

export interface VirtualTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  category: 'mission_reward' | 'experience_spend' | 'learning_investment' | 'starting_grant';
  timestamp: string;
  consequenceNote: string;
}

export interface VirtualWallet {
  balance: number; // starts at 100,000
  initialGrant: number;
  totalSpent: number;
  totalSavedToFund: number;
  transactions: VirtualTransaction[];
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number; // in NGN
  date: string;
  note?: string;
  encouragingMessage: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetAmount: number;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  learningActivity?: string;
  recommendedNextStep?: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: 'aviation' | 'property' | 'education' | 'agriculture' | 'enterprise' | 'craft';
  description: string;
  targetCost: number; // in NGN
  currentSaved: number; // self-reported
  status: 'active' | 'paused' | 'revised' | 'achieved';
  preferredFrequency: 'flexible' | 'weekly' | 'monthly';
  targetReviewDate: string;
  readinessScore: number; // 0-100
  imageUrl: string;
  nextRecommendedAction: string;
  milestones: Milestone[];
  contributions: SavingsContribution[];
  createdAt: string;
  updatedAt: string;
}

export interface TourStop {
  id: string;
  title: string;
  area: string;
  photoUrl: string;
  coordinates: { x: number; y: number }; // Percentage position on map
  description: string;
  receptionRequirement?: string;
  confirmedFacilities: string[];
  etiquetteNotes: string;
  verifiedCostNote?: string;
  safetyRule?: string;
}

export interface Destination {
  id: string;
  name: string;
  pilotStatus: 'pilot_demonstrator' | 'verified_partner';
  statusDisclaimer: string;
  location: string;
  state: string;
  description: string;
  imageUrl: string;
  verifiedIdentity: boolean;
  openingHours: string;
  entranceGuide: {
    gateDescription: string;
    approachDriveway: string;
    parkingNotes: string;
    securityCheck: string;
  };
  receptionProtocol: {
    title: string;
    mandatorySteps: string[];
    documentationNeeded: string;
    dressCode: string;
    entryRestrictions: string;
  };
  facilities: Array<{
    name: string;
    description: string;
    pricing: string;
    available: boolean;
  }>;
  tourStops: TourStop[];
  safetyAndPolicies: string[];
}

export type ExperienceCategory =
  | 'experience_enjoyment'
  | 'learn_discover'
  | 'create_build'
  | 'grow_achieve';

export interface Experience {
  id: string;
  title: string;
  category: ExperienceCategory;
  providerId: string;
  providerName: string;
  providerVerified: boolean;
  venueId?: string;
  venueName?: string;
  location: string;
  duration: string;
  price: number; // NGN
  includes: string[];
  whatYouWillLearnOrGain: string;
  prerequisites: string[];
  safetyConsiderations: string[];
  imageUrl: string;
  availableDates: string[];
  cancellationPolicy: string;
  status: 'approved' | 'pending_review' | 'draft';
  isSponsored?: boolean;
}

export interface MissionChoice {
  id: string;
  title: string;
  virtualCost: number;
  immediateBenefit: string;
  consequenceAnalysis: string;
  readinessImpact: number;
  futureFlexibility: 'High' | 'Moderate' | 'Constrained';
  financialDisciplineLesson: string;
}

export interface Mission {
  id: string;
  title: string;
  category: 'budget_tradeoff' | 'discipline' | 'career_pivot' | 'resilience';
  scenario: string;
  context: string;
  choices: MissionChoice[];
  completed: boolean;
  userChoiceId?: string;
}

export interface BookingRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  experienceId: string;
  experienceTitle: string;
  providerId: string;
  providerName: string;
  requestedDate: string;
  numberOfParticipants: number;
  totalEstimatedPrice: number;
  status: 'requested' | 'awaiting_provider_confirmation' | 'confirmed' | 'attended' | 'cancelled';
  userNotes?: string;
  providerResponseNotes?: string;
  createdAt: string;
}

export interface ReadinessCheckItem {
  id: string;
  category: 'Knowledge' | 'Practical Preparation' | 'Budget Awareness' | 'Requirements' | 'Confirmed Access';
  question: string;
  explanation: string;
  isCompleted: boolean;
}

export interface ScenarioSimulation {
  id: string;
  title: string;
  context: string;
  options: Array<{
    id: string;
    text: string;
    isOptimal: boolean;
    feedback: string;
  }>;
}
