import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCirculoop } from '../../context/CirculoopContext';
import { MobileBatteryPack, ConfirmedDispositionGrade } from '../../types';
import {
  Factory,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const RecyclerView: React.FC = () => {
  const {
    mobilePacks,
    receiveAndVerifyPack,
    totalEprRecycledKg
  } = useCirculoop();

  // Intake queue: packs arriving in transit from collectors
  const intakeQueue = mobilePacks.filter((p) => p.status === 'collected');
  const processedPacks = mobilePacks.filter((p) => p.status === 'received');

  // Intake verification modal state
  const [activePackForIntake, setActivePackForIntake] = useState<MobileBatteryPack | null>(null);
  const [arrivalWeightKg, setArrivalWeightKg] = useState<number>(475);
  const [confirmedGrade, setConfirmedGrade] = useState<ConfirmedDispositionGrade>('Grade A Reuse');
  const [facilityNotes, setFacilityNotes] = useState('Intake ultrasound scan nominal. Cell casing integrity confirmed.');
  
  // Certificate view state
  const [viewingCertPack, setViewingCertPack] = useState<MobileBatteryPack | null>(null);

  const handleOpenIntake = (pack: MobileBatteryPack) => {
    setActivePackForIntake(pack);
    // Default to collector's reported weight or sensible calculation
    const baseWeight = pack.pickupWeightKg || Math.round(pack.capacityKwh * 5.8 + 20);
    setArrivalWeightKg(baseWeight);
    setConfirmedGrade(pack.aiRecommendation === 'Reuse' ? 'Grade A Reuse' : 'Recycle');
    setFacilityNotes('Intake ultrasound scan nominal. Cell casing integrity confirmed.');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackForIntake) return;
    receiveAndVerifyPack(
      activePackForIntake.id,
      arrivalWeightKg,
      confirmedGrade,
      facilityNotes
    );
    const completedPack = {
      ...activePackForIntake,
      status: 'received' as const,
      arrivalWeightKg,
      confirmedGrade,
      creditSettled: true,
      recyclerNotes: facilityNotes,
      receivedAt: new Date().toISOString()
    };
    setActivePackForIntake(null);
    setViewingCertPack(completedPack);
  };

  // Check if current weight input creates a mismatch
  const collectorWeight = activePackForIntake?.pickupWeightKg || 480;
  const weightDelta = Math.abs(arrivalWeightKg - collectorWeight);
  const isWeightMismatch = weightDelta > 5;

  return (
    <div className="space-y-4 pb-20">
      
      {/* 1. FACILITY FACILITY METRICS BANNER */}
      <div className="rounded-lg border border-neutral-800 bg-zinc-900/40 p-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Factory className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-wider">Recycler Facility Intake</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Hub: Bavaria Hydromet #2</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Cumulative Mass Recycled</span>
            <span className="text-xl font-mono font-bold text-neutral-100 tabular-nums">
              {(totalEprRecycledKg / 1000).toFixed(1)} <span className="text-xs text-zinc-400 font-sans">Tonnes</span>
            </span>
          </div>
          <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Inbound Gate Queue</span>
            <span className="text-xl font-mono font-bold text-cyan-400 tabular-nums">
              {intakeQueue.length} Staged
            </span>
          </div>
        </div>

        {/* Mass Balance Quota progress */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-zinc-500">EU 2023/1542 EPR Recovery Target</span>
            <span className="text-emerald-400 font-semibold tabular-nums">78.5% Reached</span>
          </div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
            <div className="h-full bg-blue-500 rounded-full w-[78.5%]" />
          </div>
        </div>
      </div>

      {/* 2. INTAKE VERIFICATION QUEUE */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Inbound Intake Dock ({intakeQueue.length})
          </div>
          <span className="text-[10px] font-mono text-blue-400">Weight Verification Gate</span>
        </div>

        {intakeQueue.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-zinc-900/20 p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <div className="text-xs font-mono text-zinc-400">No Inbound Shipments Awaiting Intake</div>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
              When a Field Collector collects a pack and dispatches it, it will arrive here for intake scale weighing and disposition grading.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {intakeQueue.map((pack) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-neutral-800/90 bg-zinc-900/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-neutral-100 flex items-center gap-2">
                      <span>{pack.serialNumber}</span>
                      <span className="text-[10px] text-zinc-500">[{pack.vehicleId}]</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {pack.chemistry} · {pack.capacityKwh} kWh · SoH {pack.currentSoH}%
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/60 bg-cyan-950/40 px-2 py-0.5 rounded">
                    At Intake Dock
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Collector Scale</span>
                    <span className="text-neutral-200 font-semibold">{pack.pickupWeightKg || 480} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">AI Recommended</span>
                    <span className="text-blue-400 font-semibold">{pack.aiRecommendation || 'Reuse'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenIntake(pack)}
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Verify Weight & Grade Disposition</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PROCESSED & SETTLED LEDGER */}
      {processedPacks.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 px-1">
            Settled & Processed Batches ({processedPacks.length})
          </div>
          <div className="space-y-2">
            {processedPacks.map((pack) => (
              <div
                key={pack.id}
                className="rounded border border-neutral-800/70 bg-zinc-900/30 p-3 text-xs font-mono space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-bold">{pack.serialNumber}</span>
                    <span className="text-[10px] text-zinc-500">[{pack.confirmedGrade || 'Recycle'}]</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    +{pack.creditReward} Credits Settled
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-neutral-800/50 pt-1.5">
                  <span>Intake Mass: {pack.arrivalWeightKg} kg</span>
                  <button
                    onClick={() => setViewingCertPack(pack)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODAL: INTAKE SCALE WEIGHING & DISPOSITION GRADING */}
      <AnimatePresence>
        {activePackForIntake && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                    Facility Intake Protocol
                  </div>
                  <div className="text-sm font-bold font-mono text-neutral-100">
                    {activePackForIntake.serialNumber}
                  </div>
                </div>
                <button
                  onClick={() => setActivePackForIntake(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                {/* Weight Verification Input */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    <span>Intake Scale Weight (kg)</span>
                    <span className="text-zinc-500">Collector: {collectorWeight} kg</span>
                  </div>
                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="50"
                      max="1500"
                      value={arrivalWeightKg}
                      onChange={(e) => setArrivalWeightKg(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Weight Mismatch Warning */}
                  {isWeightMismatch ? (
                    <div className="mt-2 p-2.5 rounded border border-amber-800/60 bg-amber-950/40 text-amber-300 text-[11px] font-mono flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-bold block">Weight Discrepancy Flagged!</span>
                        <span>
                          Delta is {weightDelta} kg (threshold &gt; 5 kg). Logged in compliance audit trail.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Weight matched with collector scale (delta ≤ 5 kg)</span>
                    </div>
                  )}
                </div>

                {/* Final Disposition Grading Selector */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Final Certified Disposition Grade
                  </label>
                  <select
                    value={confirmedGrade}
                    onChange={(e) => setConfirmedGrade(e.target.value as ConfirmedDispositionGrade)}
                    className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Grade A Reuse">Grade A Reuse (Grid Storage)</option>
                    <option value="Grade B Reuse">Grade B Reuse (Light Commercial ESS)</option>
                    <option value="Grade C Reuse">Grade C Reuse (Secondary Material)</option>
                    <option value="Recycle">Recycle (Hydrometallurgical Extraction)</option>
                  </select>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    Conforms with EU 2023/1542 Second-Life Disposition Rules.
                  </span>
                </div>

                {/* Facility Inspection Notes */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Intake Remarks & Diagnostics
                  </label>
                  <input
                    type="text"
                    value={facilityNotes}
                    onChange={(e) => setFacilityNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-200 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Reward Release Notice */}
                <div className="p-3 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-zinc-300 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Automated Reward Payout</span>
                    <span className="font-bold text-emerald-400">+{activePackForIntake.creditReward} Credits</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Transferred to Fleet Owner</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Receipt & Release Incentive</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MODAL: IMMUTABLE EPR SETTLEMENT CERTIFICATE */}
      <AnimatePresence>
        {viewingCertPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                      Settlement Certificate
                    </div>
                    <div className="text-xs font-bold font-mono text-neutral-100">
                      EPR-SETTLE-{viewingCertPack.serialNumber}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingCertPack(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pack Serial:</span>
                  <span className="text-neutral-200 font-bold">{viewingCertPack.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Chemistry:</span>
                  <span className="text-neutral-300">{viewingCertPack.chemistry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Intake Weight:</span>
                  <span className="text-neutral-200">{viewingCertPack.arrivalWeightKg || viewingCertPack.pickupWeightKg || 480} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Confirmed Disposition:</span>
                  <span className="text-blue-400 font-bold">{viewingCertPack.confirmedGrade || 'Recycle'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Credits Granted:</span>
                  <span className="text-emerald-400 font-bold">+{viewingCertPack.creditReward} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-emerald-400">Audited & Settled</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                Cryptographic signature anchored to CircuLoop EU 2023/1542 Circular Registry.
              </div>

              <button
                onClick={() => setViewingCertPack(null)}
                className="w-full py-2 rounded bg-neutral-800 text-neutral-200 text-xs font-mono hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Close Certificate
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
