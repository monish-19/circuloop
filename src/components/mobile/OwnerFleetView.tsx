import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCirculoop } from '../../context/CirculoopContext';
import { MobileBatteryPack } from '../../types';
import {
  Wallet,
  Zap,
  ArrowUpRight,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';

export const OwnerFleetView: React.FC = () => {
  const { mobilePacks, walletBalance, walletTransactions, reportEol, bookPickup } = useCirculoop();

  // Modal states
  const [selectedPackForEol, setSelectedPackForEol] = useState<MobileBatteryPack | null>(null);
  const [declaredSoH, setDeclaredSoH] = useState<number>(65.0);
  const [aiResult, setAiResult] = useState<{ recommendation: 'Reuse' | 'Recycle'; reasoning: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [selectedPackForBooking, setSelectedPackForBooking] = useState<MobileBatteryPack | null>(null);
  const [pickupLocation, setPickupLocation] = useState('Depot 4 - Munich Industrial Center, Gate 3');
  const [pickupSlot, setPickupSlot] = useState('Tomorrow, 10:00 - 12:00');

  const [showTransactions, setShowTransactions] = useState(false);

  // EOL AI Evaluation handler
  const handleRunAiGrading = () => {
    if (!selectedPackForEol) return;
    setIsAiLoading(true);
    setTimeout(() => {
      const res = reportEol(selectedPackForEol.id, declaredSoH);
      setAiResult(res);
      setIsAiLoading(false);
    }, 450);
  };

  // Booking submit handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackForBooking) return;
    bookPickup(selectedPackForBooking.id, pickupLocation, pickupSlot);
    setSelectedPackForBooking(null);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* 1. WALLET BALANCE BANNER (Incentive Credits) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-neutral-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-4 shadow-lg relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-wider">EPR Incentive Wallet</span>
          </div>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-mono transition-colors cursor-pointer"
          >
            {showTransactions ? 'Hide History' : 'Ledger History'}
          </button>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-mono font-bold text-neutral-100 tabular-nums">
              {walletBalance.toLocaleString()} <span className="text-xs font-sans font-medium text-zinc-400">CREDITS</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <span>●</span>
              <span>1 Credit = €1.00 Circular Incentive</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Active Fleet</span>
            <span className="text-sm font-mono font-bold text-neutral-200">{mobilePacks.length} Packs</span>
          </div>
        </div>

        {/* Transaction History Drawer */}
        <AnimatePresence>
          {showTransactions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-neutral-800 space-y-2 overflow-hidden"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Recent Automatic Payouts
              </div>
              {walletTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center text-xs font-mono">
                  <div className="truncate pr-2">
                    <span className="text-neutral-300 block truncate">{tx.description}</span>
                    <span className="text-[10px] text-zinc-500">{tx.date}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold tabular-nums shrink-0">
                    +{tx.amount}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. REGISTERED BATTERY FLEET LIST */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Registered Battery Fleet ({mobilePacks.length})
          </div>
          <span className="text-[10px] font-mono text-blue-400">Fleet Operations</span>
        </div>

        <div className="space-y-2.5">
          {mobilePacks.map((pack, idx) => {
            const isOdd = idx % 2 === 0;
            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, x: isOdd ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="rounded-lg border border-neutral-800/80 bg-zinc-900/40 p-3.5 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-100">{pack.serialNumber}</span>
                      <span className="text-[10px] font-mono text-zinc-500">[{pack.vehicleId}]</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {pack.chemistry} · {pack.capacityKwh} kWh
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-right">
                    {pack.status === 'active' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <span>●</span> Active
                      </span>
                    )}
                    {pack.status === 'eol_reported' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-400">
                        <span>●</span> EOL Classified
                      </span>
                    )}
                    {pack.status === 'booked' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400">
                        <span>●</span> Pickup Booked
                      </span>
                    )}
                    {pack.status === 'collected' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                        <span>●</span> In Transit
                      </span>
                    )}
                    {pack.status === 'received' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300">
                        <span>✓</span> Settled (+{pack.creditReward})
                      </span>
                    )}
                  </div>
                </div>

                {/* State of Health Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-zinc-500">Current Health (SoH)</span>
                    <span className={`font-semibold tabular-nums ${pack.currentSoH >= 70 ? 'text-emerald-400' : pack.currentSoH >= 55 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {pack.currentSoH.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${pack.currentSoH >= 70 ? 'bg-emerald-500' : pack.currentSoH >= 55 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${pack.currentSoH}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons based on pack state */}
                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">
                    Reward: <span className="text-neutral-300 font-semibold">{pack.creditReward} Credits</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* EOL AI Grading Trigger */}
                    {pack.status === 'active' && (
                      <button
                        onClick={() => {
                          setSelectedPackForEol(pack);
                          setDeclaredSoH(pack.currentSoH);
                          setAiResult(null);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-mono font-medium hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Grade EOL</span>
                      </button>
                    )}

                    {/* Book Return Pickup Trigger */}
                    {pack.status === 'eol_reported' && (
                      <button
                        onClick={() => setSelectedPackForBooking(pack)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-mono font-medium hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book Return</span>
                      </button>
                    )}

                    {pack.status === 'booked' && (
                      <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Awaiting Pickup</span>
                      </span>
                    )}

                    {pack.status === 'collected' && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>Collector En Route</span>
                      </span>
                    )}

                    {pack.status === 'received' && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Credited to Wallet</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL: EOL REPORTING & AI GRADING */}
      <AnimatePresence>
        {selectedPackForEol && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                    End-of-Life AI Diagnostics
                  </div>
                  <div className="text-sm font-bold font-mono text-neutral-100">
                    {selectedPackForEol.serialNumber}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPackForEol(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-400">Declare Measured SoH (%)</span>
                  <span className="text-blue-400 font-bold tabular-nums">{declaredSoH.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="85"
                  step="0.5"
                  value={declaredSoH}
                  onChange={(e) => setDeclaredSoH(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>&lt; 58% (Recycle)</span>
                  <span>&ge; 58% (BESS Reuse)</span>
                </div>
              </div>

              {/* Instant Gemini AI Assessment Card */}
              {aiResult ? (
                <div className="p-3 rounded border border-neutral-800 bg-neutral-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">Gemini Recommendation</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${aiResult.recommendation === 'Reuse' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
                      {aiResult.recommendation}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    {aiResult.reasoning}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRunAiGrading}
                  disabled={isAiLoading}
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Evaluating Electrochemical Data...' : 'Run Gemini AI Assessment'}</span>
                </button>
              )}

              {aiResult && (
                <button
                  onClick={() => {
                    const packToBook = selectedPackForEol;
                    setSelectedPackForEol(null);
                    setSelectedPackForBooking(packToBook);
                  }}
                  className="w-full py-2.5 rounded bg-white text-neutral-950 text-xs font-mono font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Proceed to Book Pickup
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MODAL: BOOK RETURN PICKUP */}
      <AnimatePresence>
        {selectedPackForBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                    Logistics Dispatch
                  </div>
                  <div className="text-sm font-bold font-mono text-neutral-100">
                    Book Pickup: {selectedPackForBooking.serialNumber}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPackForBooking(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Pickup Location / Fleet Depot
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Pickup Time Window
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Today, 14:00 - 16:00">Today, 14:00 - 16:00</option>
                      <option value="Tomorrow, 09:00 - 11:00">Tomorrow, 09:00 - 11:00</option>
                      <option value="Tomorrow, 14:00 - 16:00">Tomorrow, 14:00 - 16:00</option>
                      <option value="Friday, 10:00 - 12:00">Friday, 10:00 - 12:00</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded border border-neutral-800 bg-neutral-950 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>Guaranteed EPR Reward:</span>
                  <span className="text-emerald-400 font-bold">+{selectedPackForBooking.creditReward} Credits</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors shadow cursor-pointer"
                >
                  Confirm & Dispatch to Field Collector
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
