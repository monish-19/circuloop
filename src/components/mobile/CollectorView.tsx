import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCirculoop } from '../../context/CirculoopContext';
import { MobileBatteryPack } from '../../types';
import {
  QrCode,
  Camera,
  Scale,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Truck,
  Scan,
  RefreshCw
} from 'lucide-react';

export const CollectorView: React.FC = () => {
  const { mobilePacks, collectPack } = useCirculoop();

  // Active packs assigned for pickup
  const assignedPacks = mobilePacks.filter((p) => p.status === 'booked');
  const inTransitPacks = mobilePacks.filter((p) => p.status === 'collected');

  // Scanner modal state
  const [activePackForScan, setActivePackForScan] = useState<MobileBatteryPack | null>(null);
  const [scannedSerial, setScannedSerial] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(true);
  const [physicalWeightKg, setPhysicalWeightKg] = useState<number>(475);
  const [collectorNotes, setCollectorNotes] = useState('Enclosure seals intact. Terminal connectors isolated.');

  const handleOpenScanner = (pack: MobileBatteryPack) => {
    setActivePackForScan(pack);
    setScannedSerial('');
    setIsScanning(true);
    setPhotoCaptured(false);
    // Suggest expected weight based on capacity (e.g. 75kWh ~ 460kg)
    setPhysicalWeightKg(Math.round(pack.capacityKwh * 5.8 + 20));
  };

  const handleSimulateScanSuccess = () => {
    if (!activePackForScan) return;
    setIsScanning(false);
    setScannedSerial(activePackForScan.serialNumber);
    setPhotoCaptured(true);
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackForScan) return;
    collectPack(activePackForScan.id, physicalWeightKg, photoCaptured, collectorNotes);
    setActivePackForScan(null);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Route Status Summary */}
      <div className="rounded-lg border border-neutral-800 bg-zinc-900/40 p-4">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-wider">Field Route Manifest</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px]">GPS Active · Truck #07</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">Pending Pickups</span>
            <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
              {assignedPacks.length} Stops
            </span>
          </div>
          <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">In Transit to Facility</span>
            <span className="text-xl font-mono font-bold text-blue-400 tabular-nums">
              {inTransitPacks.length} Packs
            </span>
          </div>
        </div>
      </div>

      {/* 1. ASSIGNED PICKUP ROUTE QUEUE */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Assigned Pickup Route ({assignedPacks.length})
          </div>
          <span className="text-[10px] font-mono text-amber-400">Action Required</span>
        </div>

        {assignedPacks.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-zinc-900/20 p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <div className="text-xs font-mono text-zinc-400">Route Queue Clear</div>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
              No pending fleet pickup bookings assigned. When an Owner books a return, it appears here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {assignedPacks.map((pack) => (
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
                  <span className="text-[10px] font-mono text-amber-400 border border-amber-800/60 bg-amber-950/40 px-2 py-0.5 rounded">
                    Staged for Pickup
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{pack.pickupLocation || 'Main Hub Depot'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>Slot: {pack.pickupSlot || 'Immediate Window'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenScanner(pack)}
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Scan & Pickup Handover</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 2. IN-TRANSIT TO FACILITY LEDGER */}
      {inTransitPacks.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 px-1">
            Cargo Manifest in Transit ({inTransitPacks.length})
          </div>
          <div className="space-y-2">
            {inTransitPacks.map((pack) => (
              <div
                key={pack.id}
                className="rounded border border-neutral-800/60 bg-neutral-900/30 p-3 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="text-neutral-200 font-semibold block">{pack.serialNumber}</span>
                  <span className="text-[10px] text-zinc-500">Weight Verified: {pack.pickupWeightKg} kg</span>
                </div>
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <span>●</span> En Route Recycler
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MODAL: SCAN & PICKUP HANDOVER INTERFACE */}
      <AnimatePresence>
        {activePackForScan && (
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
                    Field Handover Protocol
                  </div>
                  <div className="text-sm font-bold font-mono text-neutral-100">
                    Scan Battery Pack
                  </div>
                </div>
                <button
                  onClick={() => setActivePackForScan(null)}
                  className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated QR Camera Overlay with Scan-Line Laser Animation */}
              <div className="relative rounded border border-neutral-800 bg-neutral-950 h-48 overflow-hidden flex flex-col items-center justify-center">
                {isScanning ? (
                  <>
                    {/* Viewfinder Target */}
                    <div className="w-32 h-32 border-2 border-blue-500/80 rounded-lg relative flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-zinc-700 opacity-40" />

                      {/* Laser animated scan-line */}
                      <motion.div
                        animate={{ top: ['5%', '95%', '5%'] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-2 h-0.5 bg-blue-400 shadow-[0_0_8px_#3b82f6]"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 mt-2">
                      Align Pack DataMatrix QR Inside Reticle
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulateScanSuccess}
                      className="mt-2 text-[11px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      [Simulate QR Read: {activePackForScan.serialNumber}]
                    </button>
                  </>
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <div className="text-xs font-mono font-bold text-neutral-100">
                      QR Verified: {scannedSerial}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 block">
                      Cryptographic Ledger Hash Confirmed
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleHandoverSubmit} className="space-y-3.5">
                {/* Photo Capture Preview Toggle */}
                <div className="p-3 rounded border border-neutral-800 bg-neutral-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-xs font-mono text-neutral-200 block">Pack Condition Photo</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {photoCaptured ? 'Photo Verified' : 'Tap to take photo'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoCaptured(!photoCaptured)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                      photoCaptured
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-neutral-800 text-zinc-300 hover:bg-neutral-700'
                    }`}
                  >
                    {photoCaptured ? 'Retake' : 'Capture'}
                  </button>
                </div>

                {/* Physical Weight Entry */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Physical Scale Weight Entry (kg)
                  </label>
                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min="50"
                      max="1500"
                      value={physicalWeightKg}
                      onChange={(e) => setPhysicalWeightKg(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    Recorded weight will be cross-checked at Recycler intake scale.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                    Field Integrity Remarks
                  </label>
                  <input
                    type="text"
                    value={collectorNotes}
                    onChange={(e) => setCollectorNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-200 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full py-2.5 rounded bg-blue-600 text-white text-xs font-mono font-medium hover:bg-blue-500 transition-colors shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Pickup & Transfer to Collected
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
