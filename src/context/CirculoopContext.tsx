import React, { createContext, useContext, useState } from 'react';
import {
  BatteryRecord,
  Producer,
  UserRole,
  UserSession,
  MobilePersona,
  MobileBatteryPack,
  WalletTransaction,
  ConfirmedDispositionGrade
} from '../types';
import {
  INITIAL_BATTERIES,
  INITIAL_PRODUCERS,
  INITIAL_MOBILE_PACKS,
  INITIAL_WALLET_TRANSACTIONS
} from '../mockData/initialData';

interface CirculoopContextType {
  // Existing Web State (Preserved)
  producers: Producer[];
  batteries: BatteryRecord[];
  currentUser: UserSession | null;
  activeView: 'landing' | 'auth' | 'app';
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  clearNotification: () => void;
  navigateTo: (view: 'landing' | 'auth' | 'app') => void;
  loginAs: (role: UserRole, producerId?: string) => void;
  logout: () => void;
  approveProducer: (producerId: string) => void;
  revokeProducer: (producerId: string) => void;
  registerBattery: (batteryData: {
    serialNumber: string;
    chemistry: BatteryRecord['chemistry'];
    capacityKwh: number;
    weightKg: number;
    nominalVoltageV: number;
    manufacturingYear: number;
    originalApplication: BatteryRecord['originalApplication'];
    cycleCount: number;
    initialSoH: number;
  }) => boolean;
  gradeBattery: (
    batteryId: string,
    evaluation: {
      measuredSoH: number;
      internalResistanceMOhm: number;
      cellDeltaVoltageMv: number;
      thermalDegradationIndex: number;
      estimatedRemainingCycles: number;
      grade: BatteryRecord['grade'];
      inspectionNotes: string;
    }
  ) => void;
  getActiveProducer: () => Producer | undefined;

  // New Mobile Preview Shell & Persona Workflows
  displayMode: 'mobile' | 'desktop';
  setDisplayMode: (mode: 'mobile' | 'desktop') => void;
  activePersona: MobilePersona;
  setActivePersona: (persona: MobilePersona) => void;
  mobilePacks: MobileBatteryPack[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  totalEprRecycledKg: number;
  
  // Mobile Role Actions
  reportEol: (packId: string, declaredSoH: number) => { recommendation: 'Reuse' | 'Recycle'; reasoning: string };
  bookPickup: (packId: string, location: string, slot: string) => void;
  collectPack: (packId: string, weightKg: number, photoCaptured: boolean, notes?: string) => void;
  receiveAndVerifyPack: (
    packId: string,
    arrivalWeightKg: number,
    confirmedGrade: ConfirmedDispositionGrade,
    notes?: string
  ) => { mismatch: boolean; rewardGranted: number };
}

const CirculoopContext = createContext<CirculoopContextType | undefined>(undefined);

export const CirculoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Web Application State (100% Preserved)
  const [producers, setProducers] = useState<Producer[]>(INITIAL_PRODUCERS);
  const [batteries, setBatteries] = useState<BatteryRecord[]>(INITIAL_BATTERIES);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeView, setActiveView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Mobile App Shell State
  const [displayMode, setDisplayMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activePersona, setActivePersona] = useState<MobilePersona>('owner');
  const [mobilePacks, setMobilePacks] = useState<MobileBatteryPack[]>(INITIAL_MOBILE_PACKS);
  const [walletBalance, setWalletBalance] = useState<number>(1350);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [totalEprRecycledKg, setTotalEprRecycledKg] = useState<number>(18400);

  const clearNotification = () => setNotification(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const navigateTo = (view: 'landing' | 'auth' | 'app') => {
    setActiveView(view);
  };

  const loginAs = (role: UserRole, producerId?: string) => {
    if (role === 'producer') {
      const selectedId = producerId || 'prod-1';
      const prod = producers.find((p) => p.id === selectedId) || producers[0];
      setCurrentUser({
        id: `user-${prod.id}`,
        name: `${prod.name} Officer`,
        role: 'producer',
        email: prod.contactEmail,
        producerId: prod.id,
      });
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Regulatory Authority Director',
        role: 'admin',
        email: 'director@circuloop.regulatory.org',
      });
    } else if (role === 'reviewer') {
      setCurrentUser({
        id: 'rev-1',
        name: 'Dr. Elena Vance (Lead EIS Inspector)',
        role: 'reviewer',
        email: 'e.vance@diagnostics.circuloop.eu',
      });
    }
    setActiveView('app');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
    showNotification('Signed out from Circuloop Platform.', 'info');
  };

  const approveProducer = (producerId: string) => {
    setProducers((prev) =>
      prev.map((p) => {
        if (p.id === producerId) {
          return {
            ...p,
            status: 'authorized',
            complianceCertId: `EPR-EU-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          };
        }
        return p;
      })
    );
    showNotification(`Producer account approved. Access credentials active.`, 'success');
  };

  const revokeProducer = (producerId: string) => {
    setProducers((prev) =>
      prev.map((p) => {
        if (p.id === producerId) {
          return {
            ...p,
            status: 'revoked',
          };
        }
        return p;
      })
    );
    showNotification(`Producer account revoked. Access suspended.`, 'warning');
  };

  const registerBattery = (batteryData: {
    serialNumber: string;
    chemistry: BatteryRecord['chemistry'];
    capacityKwh: number;
    weightKg: number;
    nominalVoltageV: number;
    manufacturingYear: number;
    originalApplication: BatteryRecord['originalApplication'];
    cycleCount: number;
    initialSoH: number;
  }): boolean => {
    const activeProducer = getActiveProducer();
    if (!activeProducer || activeProducer.status !== 'authorized') {
      showNotification('Registration restricted: Producer authorization required.', 'warning');
      return false;
    }

    const newBattery: BatteryRecord = {
      id: `bat-${Date.now().toString(36)}`,
      serialNumber: batteryData.serialNumber.trim().toUpperCase(),
      producerId: activeProducer.id,
      producerName: activeProducer.name,
      chemistry: batteryData.chemistry,
      capacityKwh: Number(batteryData.capacityKwh),
      weightKg: Number(batteryData.weightKg),
      nominalVoltageV: Number(batteryData.nominalVoltageV),
      manufacturingYear: Number(batteryData.manufacturingYear),
      originalApplication: batteryData.originalApplication,
      cycleCount: Number(batteryData.cycleCount),
      initialSoH: Number(batteryData.initialSoH),
      status: 'awaiting_grading',
      registrationDate: new Date().toISOString().split('T')[0],
    };

    setBatteries((prev) => [newBattery, ...prev]);

    setProducers((prev) =>
      prev.map((p) => {
        if (p.id === activeProducer.id) {
          return {
            ...p,
            batteryCount: p.batteryCount + 1,
            eprCurrentRecycledKg: p.eprCurrentRecycledKg + newBattery.weightKg,
          };
        }
        return p;
      })
    );

    showNotification(
      `Battery ${newBattery.serialNumber} registered and queued for Reviewer grading.`,
      'success'
    );
    return true;
  };

  const gradeBattery = (
    batteryId: string,
    evaluation: {
      measuredSoH: number;
      internalResistanceMOhm: number;
      cellDeltaVoltageMv: number;
      thermalDegradationIndex: number;
      estimatedRemainingCycles: number;
      grade: BatteryRecord['grade'];
      inspectionNotes: string;
    }
  ) => {
    setBatteries((prev) =>
      prev.map((b) => {
        if (b.id === batteryId) {
          return {
            ...b,
            status: 'graded',
            measuredSoH: evaluation.measuredSoH,
            internalResistanceMOhm: evaluation.internalResistanceMOhm,
            cellDeltaVoltageMv: evaluation.cellDeltaVoltageMv,
            thermalDegradationIndex: evaluation.thermalDegradationIndex,
            estimatedRemainingCycles: evaluation.estimatedRemainingCycles,
            grade: evaluation.grade,
            inspectionNotes: evaluation.inspectionNotes,
            reviewedBy: currentUser?.name || 'Accredited Reviewer',
            reviewedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    showNotification(`Grading certificate finalized and appended to EPR ledger.`, 'success');
  };

  const getActiveProducer = (): Producer | undefined => {
    if (currentUser?.role === 'producer' && currentUser.producerId) {
      return producers.find((p) => p.id === currentUser.producerId);
    }
    return undefined;
  };

  // -------------------------------------------------------------
  // MOBILE WORKFLOW HANDLERS (OWNER, COLLECTOR, RECYCLER)
  // -------------------------------------------------------------

  // 1. Owner: Declare SoH & generate AI recommendation
  const reportEol = (packId: string, declaredSoH: number) => {
    const isReuse = declaredSoH >= 58;
    const recommendation: 'Reuse' | 'Recycle' = isReuse ? 'Reuse' : 'Recycle';
    const reasoning = isReuse
      ? `State of Health is ${declaredSoH.toFixed(1)}% (above the 58% threshold). Cathode chemistry demonstrates sufficient coulombic retention for stationary second-life BESS storage.`
      : `State of Health has degraded to ${declaredSoH.toFixed(1)}% (below secondary life threshold). Severe cathode impedance drift detected; direct hydrometallurgical closed-loop recycling recommended.`;

    setMobilePacks((prev) =>
      prev.map((p) => {
        if (p.id === packId) {
          return {
            ...p,
            currentSoH: declaredSoH,
            status: 'eol_reported',
            aiRecommendation: recommendation,
            aiReasoning: reasoning,
            eolReportedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    showNotification(`AI Grading complete: Classified for ${recommendation}.`, 'info');
    return { recommendation, reasoning };
  };

  // 2. Owner: Book Return Pickup
  const bookPickup = (packId: string, location: string, slot: string) => {
    setMobilePacks((prev) =>
      prev.map((p) => {
        if (p.id === packId) {
          return {
            ...p,
            status: 'booked',
            pickupLocation: location,
            pickupSlot: slot,
            bookedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    showNotification(`Return pickup booked. Assigned to Field Collector Route.`, 'success');
  };

  // 3. Collector: Scan & Pickup Handover
  const collectPack = (packId: string, weightKg: number, photoCaptured: boolean, notes?: string) => {
    setMobilePacks((prev) =>
      prev.map((p) => {
        if (p.id === packId) {
          return {
            ...p,
            status: 'collected',
            pickupWeightKg: weightKg,
            collectorPhotoCaptured: photoCaptured,
            collectorNotes: notes || 'Field physical handover verified.',
            collectedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    showNotification(`Pack collected and en route to Recycler Facility.`, 'success');
  };

  // 4. Recycler: Receipt Verification, Weight Check & Incentive Credit Release
  const receiveAndVerifyPack = (
    packId: string,
    arrivalWeightKg: number,
    confirmedGrade: ConfirmedDispositionGrade,
    notes?: string
  ) => {
    const pack = mobilePacks.find((p) => p.id === packId);
    const expectedWeight = pack?.pickupWeightKg || arrivalWeightKg;
    const isMismatch = Math.abs(arrivalWeightKg - expectedWeight) > 5;
    const rewardGranted = pack?.creditReward || 400;

    setMobilePacks((prev) =>
      prev.map((p) => {
        if (p.id === packId) {
          return {
            ...p,
            status: 'received',
            arrivalWeightKg,
            weightMismatch: isMismatch,
            confirmedGrade,
            creditSettled: true,
            recyclerNotes: notes || (isMismatch ? 'Weight discrepancy flagged during intake.' : 'Weight verified nominal.'),
            receivedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    // Release incentive credits to Fleet Owner Wallet
    setWalletBalance((prev) => prev + rewardGranted);
    setWalletTransactions((prev) => [
      {
        id: `tx-${Date.now().toString(36)}`,
        date: new Date().toISOString().split('T')[0],
        amount: rewardGranted,
        description: `EPR Incentive Reward: Pack ${pack?.serialNumber || 'Battery'} Settled`,
        type: 'credit',
        serialNumber: pack?.serialNumber,
      },
      ...prev,
    ]);

    // Update cumulative EPR mass recycled
    setTotalEprRecycledKg((prev) => prev + arrivalWeightKg);

    showNotification(
      `Shipment verified. ${rewardGranted} credits transferred to Owner wallet.`,
      isMismatch ? 'warning' : 'success'
    );

    return { mismatch: isMismatch, rewardGranted };
  };

  return (
    <CirculoopContext.Provider
      value={{
        producers,
        batteries,
        currentUser,
        activeView,
        notification,
        clearNotification,
        navigateTo,
        loginAs,
        logout,
        approveProducer,
        revokeProducer,
        registerBattery,
        gradeBattery,
        getActiveProducer,

        // Mobile
        displayMode,
        setDisplayMode,
        activePersona,
        setActivePersona,
        mobilePacks,
        walletBalance,
        walletTransactions,
        totalEprRecycledKg,
        reportEol,
        bookPickup,
        collectPack,
        receiveAndVerifyPack,
      }}
    >
      {children}
    </CirculoopContext.Provider>
  );
};

export const useCirculoop = () => {
  const context = useContext(CirculoopContext);
  if (!context) {
    throw new Error('useCirculoop must be used within a CirculoopProvider');
  }
  return context;
};
