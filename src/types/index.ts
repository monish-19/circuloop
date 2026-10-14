export type UserRole = 'producer' | 'admin' | 'reviewer';

export type MobilePersona = 'owner' | 'collector' | 'recycler';

export type ProducerStatus = 'authorized' | 'pending' | 'revoked';

export type BatteryChemistry =
  | 'NMC 811'
  | 'NMC 622'
  | 'LFP (Lithium Iron)'
  | 'NCA'
  | 'Solid-State Li-Metal'
  | 'Sodium-Ion';

export type FirstLifeApplication =
  | 'Passenger Electric Vehicle'
  | 'Commercial Bus / Truck'
  | 'Stationary Grid Storage'
  | 'Industrial Material Handling';

export type BatteryStatus = 'awaiting_grading' | 'graded' | 'dispatched';

export type BatteryGrade =
  | 'Grade A (Grid Storage Repurpose)'
  | 'Grade B (Light ESS & Backup)'
  | 'Grade C (Secondary Material Recovery)'
  | 'Recycled (Closed-Loop Hydrometallurgy)';

export interface Producer {
  id: string;
  name: string;
  companyCode: string;
  jurisdiction: string;
  contactEmail: string;
  status: ProducerStatus;
  registeredDate: string;
  batteryCount: number;
  eprQuotaTargetKg: number;
  eprCurrentRecycledKg: number;
  complianceCertId: string;
}

export interface BatteryRecord {
  id: string;
  serialNumber: string;
  producerId: string;
  producerName: string;
  chemistry: BatteryChemistry;
  capacityKwh: number;
  weightKg: number;
  nominalVoltageV: number;
  manufacturingYear: number;
  originalApplication: FirstLifeApplication;
  cycleCount: number;
  initialSoH: number; // estimated %
  status: BatteryStatus;
  registrationDate: string;
  
  // Reviewer Diagnostic Evaluation fields (populated when graded)
  measuredSoH?: number;
  internalResistanceMOhm?: number;
  cellDeltaVoltageMv?: number;
  thermalDegradationIndex?: number;
  estimatedRemainingCycles?: number;
  grade?: BatteryGrade;
  reviewedBy?: string;
  reviewedAt?: string;
  inspectionNotes?: string;
}

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  producerId?: string; // If role is producer
}

// -------------------------------------------------------------
// MOBILE PREVIEW SHELL CIRCULAR ECONOMY MODELS
// -------------------------------------------------------------

export type MobilePackStatus =
  | 'active'
  | 'eol_reported'
  | 'booked'
  | 'collected'
  | 'received';

export type ConfirmedDispositionGrade =
  | 'Grade A Reuse'
  | 'Grade B Reuse'
  | 'Grade C Reuse'
  | 'Recycle';

export interface MobileBatteryPack {
  id: string;
  serialNumber: string;
  chemistry: BatteryChemistry;
  capacityKwh: number;
  nominalVoltageV: number;
  vehicleId: string; // e.g. "FLT-VAN-08"
  currentSoH: number; // e.g. 74.2%
  status: MobilePackStatus;
  creditReward: number; // e.g. 450 credits
  creditSettled: boolean;

  // EOL & AI Assessment
  aiRecommendation?: 'Reuse' | 'Recycle';
  aiReasoning?: string;
  eolReportedAt?: string;

  // Booked Pickup Info
  pickupLocation?: string;
  pickupSlot?: string;
  bookedAt?: string;

  // Collector Logistics Handover
  pickupWeightKg?: number;
  collectorPhotoCaptured?: boolean;
  collectedAt?: string;
  collectorNotes?: string;

  // Recycler Facility Verification
  arrivalWeightKg?: number;
  weightMismatch?: boolean;
  confirmedGrade?: ConfirmedDispositionGrade;
  receivedAt?: string;
  recyclerNotes?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
  serialNumber?: string;
}

export interface MobileAppState {
  activePersona: MobilePersona;
  walletBalance: number;
  transactions: WalletTransaction[];
  packs: MobileBatteryPack[];
  totalEprRecycledKg: number;
  totalEprTargetKg: number;
}
