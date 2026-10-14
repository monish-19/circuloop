import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCirculoop } from '../context/CirculoopContext';
import { BatteryRecord } from '../types';
import { BatteryGradingModal } from './BatteryGradingModal';
import { BatteryDetailsModal } from './BatteryDetailsModal';
import { Search, Clock, CheckCircle2, Gauge } from 'lucide-react';

export const ReviewerDashboard: React.FC = () => {
  const { batteries } = useCirculoop();

  const [activeQueueTab, setActiveQueueTab] = useState<'pending' | 'certified'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [chemistryFilter, setChemistryFilter] = useState('all');

  const [gradingBattery, setGradingBattery] = useState<BatteryRecord | null>(null);
  const [viewingBattery, setViewingBattery] = useState<BatteryRecord | null>(null);

  const pendingBatteries = batteries.filter((b) => b.status === 'awaiting_grading');
  const certifiedBatteries = batteries.filter((b) => b.status === 'graded');

  const displayedList = (activeQueueTab === 'pending' ? pendingBatteries : certifiedBatteries).filter(
    (b) => {
      const matchesSearch =
        b.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.producerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChemistry = chemistryFilter === 'all' || b.chemistry === chemistryFilter;
      return matchesSearch && matchesChemistry;
    }
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24 selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Reviewer Header */}
      <div className="border-b border-neutral-900 bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-500 mb-1">
                <span>ACCREDITED DIAGNOSTIC STATION</span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span>EIS HARDWARE TERMINAL 04</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-100 uppercase">
                Battery Grading Queue
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Sole reviewer workflow: evaluate state-of-health, record internal resistance, and certify circular grades.
              </p>
            </div>

            {/* Queue Counter Cards */}
            <div className="flex items-center gap-6 font-mono text-xs">
              <div className="text-left">
                <span className="text-zinc-500 block">AWAITING TESTING</span>
                <span className="text-amber-400 font-bold text-lg tabular-nums">
                  {pendingBatteries.length} Units
                </span>
              </div>
              <div className="text-left">
                <span className="text-zinc-500 block">CERTIFIED ARCHIVE</span>
                <span className="text-blue-400 font-bold text-lg tabular-nums">
                  {certifiedBatteries.length} Units
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Queue Viewport */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border border-neutral-800/80 bg-neutral-900/60 rounded-md overflow-hidden"
        >
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Queue Switcher */}
            <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded border border-neutral-800 text-xs font-mono">
              <button
                onClick={() => setActiveQueueTab('pending')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                  activeQueueTab === 'pending'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-neutral-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Inspection ({pendingBatteries.length})</span>
              </button>
              <button
                onClick={() => setActiveQueueTab('certified')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-all cursor-pointer ${
                  activeQueueTab === 'certified'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-neutral-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certified Archive ({certifiedBatteries.length})</span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search serial or producer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 w-44 sm:w-60"
                />
              </div>

              <select
                value={chemistryFilter}
                onChange={(e) => setChemistryFilter(e.target.value)}
                className="px-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="all">All Chemistries</option>
                <option value="NMC 811">NMC 811</option>
                <option value="NMC 622">NMC 622</option>
                <option value="LFP (Lithium Iron)">LFP</option>
                <option value="NCA">NCA</option>
                <option value="Solid-State Li-Metal">Solid-State</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-zinc-500 font-mono">
                  <th className="py-3.5 px-4 font-normal">BATTERY SERIAL</th>
                  <th className="py-3.5 px-4 font-normal">PRODUCER</th>
                  <th className="py-3.5 px-4 font-normal">CHEMISTRY</th>
                  <th className="py-3.5 px-4 font-normal text-right">CAPACITY / MASS</th>
                  <th className="py-3.5 px-4 font-normal text-right">CYCLES</th>
                  <th className="py-3.5 px-4 font-normal text-right">
                    {activeQueueTab === 'pending' ? 'INITIAL EST SOH' : 'MEASURED SOH'}
                  </th>
                  <th className="py-3.5 px-4 font-normal">
                    {activeQueueTab === 'pending' ? 'QUEUE STAGE' : 'CERTIFIED GRADE'}
                  </th>
                  <th className="py-3.5 px-4 font-normal text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {displayedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      {activeQueueTab === 'pending'
                        ? 'Inspection queue clear. No battery units awaiting evaluation.'
                        : 'No certified records found.'}
                    </td>
                  </tr>
                ) : (
                  displayedList.map((bat) => (
                    <tr key={bat.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-200 whitespace-nowrap">
                        {bat.serialNumber}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                        {bat.producerName}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                        {bat.chemistry}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-zinc-300 whitespace-nowrap">
                        {bat.capacityKwh} kWh <span className="text-zinc-500">({bat.weightKg} kg)</span>
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-zinc-400 whitespace-nowrap">
                        {bat.cycleCount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                        {activeQueueTab === 'pending' ? (
                          <span className="text-zinc-400">Est. {bat.initialSoH}%</span>
                        ) : (
                          <span className="text-blue-400 font-bold">{bat.measuredSoH}%</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {activeQueueTab === 'pending' ? (
                          <span className="text-amber-400">QUEUED FOR RIG</span>
                        ) : (
                          <span className="text-neutral-200 font-medium">{bat.grade}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {activeQueueTab === 'pending' ? (
                          <button
                            onClick={() => setGradingBattery(bat)}
                            className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-mono font-medium text-white hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                          >
                            <Gauge className="w-3.5 h-3.5" />
                            <span>Inspect & Grade</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setViewingBattery(bat)}
                            className="inline-flex items-center gap-1 rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs font-mono text-zinc-400 hover:text-neutral-200 transition-colors cursor-pointer"
                          >
                            <span>View Passport</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-xs text-zinc-500 font-mono flex items-center justify-between">
            <span>CALIBRATION: ACTIVE (OFFSET: ±0.02 mΩ)</span>
            <span>SUBMISSIONS SYNC DIRECTLY TO PRODUCER EPR LEDGER</span>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <BatteryGradingModal
        battery={gradingBattery}
        onClose={() => setGradingBattery(null)}
      />

      <BatteryDetailsModal
        battery={viewingBattery}
        onClose={() => setViewingBattery(null)}
      />

    </div>
  );
};
