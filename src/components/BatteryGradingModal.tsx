import React, { useState } from 'react';
import { BatteryGrade, BatteryRecord } from '../types';
import { useCirculoop } from '../context/CirculoopContext';
import { X, CheckCircle2, Gauge, Cpu } from 'lucide-react';

interface Props {
  battery: BatteryRecord | null;
  onClose: () => void;
}

export const BatteryGradingModal: React.FC<Props> = ({ battery, onClose }) => {
  const { gradeBattery } = useCirculoop();

  if (!battery) return null;

  const [measuredSoH, setMeasuredSoH] = useState<number>(battery.initialSoH || 82.0);
  const [internalResistanceMOhm, setInternalResistanceMOhm] = useState<number>(1.85);
  const [cellDeltaVoltageMv, setCellDeltaVoltageMv] = useState<number>(14);
  const [thermalDegradationIndex, setThermalDegradationIndex] = useState<number>(1.12);
  const [estimatedRemainingCycles, setEstimatedRemainingCycles] = useState<number>(2200);

  const calculateRecommendedGrade = (soh: number, ir: number, deltaV: number): BatteryGrade => {
    if (soh >= 80 && ir <= 2.2 && deltaV <= 20) {
      return 'Grade A (Grid Storage Repurpose)';
    }
    if (soh >= 70 && ir <= 3.5 && deltaV <= 35) {
      return 'Grade B (Light ESS & Backup)';
    }
    if (soh >= 45) {
      return 'Grade C (Secondary Material Recovery)';
    }
    return 'Recycled (Closed-Loop Hydrometallurgy)';
  };

  const [selectedGrade, setSelectedGrade] = useState<BatteryGrade>(
    calculateRecommendedGrade(measuredSoH, internalResistanceMOhm, cellDeltaVoltageMv)
  );

  const [inspectionNotes, setInspectionNotes] = useState<string>(
    `EIS spectrum nominal. Electrochemical impedance within tolerance. Verified for secondary life disposition.`
  );

  const handleMeasuredSoHChange = (val: number) => {
    setMeasuredSoH(val);
    const rec = calculateRecommendedGrade(val, internalResistanceMOhm, cellDeltaVoltageMv);
    setSelectedGrade(rec);
  };

  const handleResistanceChange = (val: number) => {
    setInternalResistanceMOhm(val);
    const rec = calculateRecommendedGrade(measuredSoH, val, cellDeltaVoltageMv);
    setSelectedGrade(rec);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gradeBattery(battery.id, {
      measuredSoH,
      internalResistanceMOhm,
      cellDeltaVoltageMv,
      thermalDegradationIndex,
      estimatedRemainingCycles,
      grade: selectedGrade,
      inspectionNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-sm overflow-y-auto selection:bg-blue-600/30 selection:text-blue-200">
      <div className="relative w-full max-w-2xl border border-neutral-800 bg-neutral-900 rounded-lg p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-1">
              DIAGNOSTIC INSPECTION STATION
            </div>
            <h3 className="text-2xl font-bold text-neutral-100 font-mono">{battery.serialNumber}</h3>
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2 font-mono">
              <span>{battery.producerName}</span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span>{battery.chemistry}</span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span>{battery.capacityKwh} kWh</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Specs */}
        <div className="py-4 border-b border-neutral-800 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-400">
          <div>
            <span className="text-zinc-500 block">ORIGIN:</span>
            <span className="text-neutral-200 truncate">{battery.originalApplication}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">CYCLES:</span>
            <span className="text-neutral-200 tabular-nums">{battery.cycleCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">MFG YEAR:</span>
            <span className="text-neutral-200 tabular-nums">{battery.manufacturingYear}</span>
          </div>
          <div>
            <span className="text-zinc-500 block">EST INITIAL SOH:</span>
            <span className="text-neutral-200 tabular-nums">{battery.initialSoH}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 flex items-center justify-between">
              <span>ELECTROCHEMICAL IMPEDANCE & HEALTH INPUTS</span>
              <span className="text-blue-400">DIN EN 50604-1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Measured SoH */}
              <div className="border border-neutral-800 bg-neutral-950 p-4 rounded">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400 uppercase">Measured SoH (%)</span>
                  <span className="text-blue-400 font-bold tabular-nums text-sm">{measuredSoH.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="0.1"
                  value={measuredSoH}
                  onChange={(e) => handleMeasuredSoHChange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Internal Resistance */}
              <div className="border border-neutral-800 bg-neutral-950 p-4 rounded">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400 uppercase">Internal Resistance</span>
                  <span className="text-neutral-200 font-bold tabular-nums text-sm">{internalResistanceMOhm.toFixed(2)} mΩ</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.05"
                  value={internalResistanceMOhm}
                  onChange={(e) => handleResistanceChange(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Max Cell Delta Voltage (mV)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  required
                  value={cellDeltaVoltageMv}
                  onChange={(e) => setCellDeltaVoltageMv(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                  Projected Remaining Cycles
                </label>
                <input
                  type="number"
                  min="0"
                  max="8000"
                  step="50"
                  required
                  value={estimatedRemainingCycles}
                  onChange={(e) => setEstimatedRemainingCycles(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Assigned Circular Grade (Grade A, B, C, Recycled) */}
          <div className="pt-4 border-t border-neutral-800">
            <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              ASSIGNED CIRCULAR GRADE & DISPOSITION
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as BatteryGrade)}
              className="w-full px-3 py-2.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="Grade A (Grid Storage Repurpose)">Grade A (Grid Storage Repurpose - SoH &gt;= 80%)</option>
              <option value="Grade B (Light ESS & Backup)">Grade B (Light ESS & Backup - SoH 70-79%)</option>
              <option value="Grade C (Secondary Material Recovery)">Grade C (Secondary Material Recovery - SoH 45-69%)</option>
              <option value="Recycled (Closed-Loop Hydrometallurgy)">Recycled (Closed-Loop Hydrometallurgy - Raw Mineral Recovery)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Reviewer Engineering Assessment
            </label>
            <textarea
              rows={2}
              required
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 placeholder-zinc-600 focus:outline-none focus:border-blue-600"
              placeholder="Record diagnostic observations or impedance notes..."
            />
          </div>

          <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-neutral-800 text-xs font-mono text-zinc-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Certify & Submit Grading</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
