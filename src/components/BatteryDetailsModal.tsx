import React from 'react';
import { BatteryRecord } from '../types';
import { X, Clock } from 'lucide-react';

interface Props {
  battery: BatteryRecord | null;
  onClose: () => void;
}

export const BatteryDetailsModal: React.FC<Props> = ({ battery, onClose }) => {
  if (!battery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-sm selection:bg-blue-600/30 selection:text-blue-200">
      <div className="relative w-full max-w-2xl border border-neutral-800 bg-neutral-900 rounded-lg p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-1">
              DIGITAL BATTERY PASSPORT & LIFECYCLE LEDGER
            </div>
            <h3 className="text-2xl font-bold text-neutral-100 font-mono">{battery.serialNumber}</h3>
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2 font-mono">
              <span>{battery.producerName}</span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span>Registered {battery.registrationDate}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manufacturing & Hardware Specifications */}
        <div className="py-6 border-b border-neutral-800">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            HARDWARE & FIRST-LIFE SPECIFICATIONS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block">CHEMISTRY</span>
              <span className="text-neutral-200 font-semibold">{battery.chemistry}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">CAPACITY</span>
              <span className="text-neutral-200 tabular-nums">{battery.capacityKwh} kWh</span>
            </div>
            <div>
              <span className="text-zinc-500 block">MASS WEIGHT</span>
              <span className="text-neutral-200 tabular-nums">{battery.weightKg} kg</span>
            </div>
            <div>
              <span className="text-zinc-500 block">NOMINAL VOLTAGE</span>
              <span className="text-neutral-200 tabular-nums">{battery.nominalVoltageV} V</span>
            </div>
            <div>
              <span className="text-zinc-500 block">MANUFACTURING YEAR</span>
              <span className="text-neutral-200 tabular-nums">{battery.manufacturingYear}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">CHASSIS APPLICATION</span>
              <span className="text-neutral-200 truncate">{battery.originalApplication}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">CYCLE COUNT</span>
              <span className="text-neutral-200 tabular-nums">{battery.cycleCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">INITIAL EST SOH</span>
              <span className="text-neutral-200 tabular-nums">{battery.initialSoH}%</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Grading Certificate Section */}
        <div className="pt-6">
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center justify-between">
            <span>REVIEWER DIAGNOSTIC EVALUATION</span>
            {battery.status === 'graded' ? (
              <span className="text-blue-400 font-mono text-[11px]">CERTIFIED BY ACCREDITED LABORATORY</span>
            ) : (
              <span className="text-amber-400 font-mono text-[11px]">AWAITING TESTING RIG</span>
            )}
          </div>

          {battery.status === 'graded' ? (
            <div className="space-y-4">
              <div className="p-4 rounded border border-neutral-800 bg-neutral-950">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-900">
                  <div>
                    <span className="text-xs text-zinc-500 block font-mono">Assigned Grade</span>
                    <span className="text-lg font-bold text-neutral-100 font-mono">{battery.grade}</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 sm:text-right">
                    <div>{battery.reviewedBy}</div>
                    <div className="text-[11px] text-zinc-500">
                      {battery.reviewedAt ? new Date(battery.reviewedAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block">Measured SoH</span>
                    <span className="text-blue-400 font-bold tabular-nums text-sm">
                      {battery.measuredSoH}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Internal Resistance</span>
                    <span className="text-neutral-200 tabular-nums">
                      {battery.internalResistanceMOhm} mΩ
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Cell Delta Voltage</span>
                    <span className="text-neutral-200 tabular-nums">
                      {battery.cellDeltaVoltageMv} mV
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Remaining Cycles</span>
                    <span className="text-neutral-200 tabular-nums">
                      {battery.estimatedRemainingCycles?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {battery.inspectionNotes && (
                  <div className="mt-3 pt-3 border-t border-neutral-900 text-xs text-zinc-300 font-mono">
                    <span className="text-zinc-500 block mb-1">Inspector Engineering Note:</span>
                    <p className="italic text-zinc-300 font-sans">{battery.inspectionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded border border-neutral-800 bg-neutral-950 text-center">
              <Clock className="w-8 h-8 text-amber-500/80 mx-auto mb-2" />
              <div className="text-sm font-semibold text-neutral-200 uppercase font-mono">Pending Diagnostic Review</div>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 font-mono">
                This unit is queued into the Reviewer Diagnostic Station for EIS testing and second-life classification.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-mono uppercase text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
