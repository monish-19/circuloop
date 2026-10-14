import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCirculoop } from '../context/CirculoopContext';
import { BatteryChemistry, BatteryRecord, FirstLifeApplication } from '../types';
import { BatteryDetailsModal } from './BatteryDetailsModal';
import {
  PlusCircle,
  FileText,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ProducerDashboard: React.FC = () => {
  const { getActiveProducer, batteries, registerBattery, loginAs } = useCirculoop();
  const producer = getActiveProducer();

  // Sub-navigation for State B: strictly 2 functional features
  const [activeTab, setActiveTab] = useState<'register' | 'epr'>('epr');

  // Registration Form State
  const [serialNumber, setSerialNumber] = useState('');
  const [chemistry, setChemistry] = useState<BatteryChemistry>('NMC 811');
  const [capacityKwh, setCapacityKwh] = useState<number>(75);
  const [weightKg, setWeightKg] = useState<number>(450);
  const [nominalVoltageV, setNominalVoltageV] = useState<number>(400);
  const [manufacturingYear, setManufacturingYear] = useState<number>(2022);
  const [originalApplication, setOriginalApplication] = useState<FirstLifeApplication>('Passenger Electric Vehicle');
  const [cycleCount, setCycleCount] = useState<number>(1200);
  const [initialSoH, setInitialSoH] = useState<number>(85.0);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [chemistryFilter, setChemistryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected battery for passport modal
  const [selectedBattery, setSelectedBattery] = useState<BatteryRecord | null>(null);

  // -------------------------------------------------------------
  // STATE A: UNAPPROVED / PENDING PRODUCER
  // Display ONLY a minimal, centered screen stating
  // "Account Pending Admin Approval" with an active status badge.
  // ALL producer features and navigation MUST be completely hidden!
  // -------------------------------------------------------------
  if (!producer || producer.status !== 'authorized') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-neutral-950 selection:bg-blue-600/30 selection:text-blue-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full border border-neutral-800/80 bg-neutral-900/60 rounded-lg p-8 text-center shadow-2xl"
        >
          {/* Active Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 font-mono text-xs uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>PENDING REGULATORY APPROVAL</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 uppercase mb-3">
            Account Pending Admin Approval
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
            Application credentials for <span className="text-neutral-200 font-medium">{producer?.name || 'Your Company'}</span> have been queued for compliance validation. All battery registration and EPR ledger functions remain restricted until approved by an administrator.
          </p>

          <div className="p-3.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-zinc-400 text-left mb-6 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-500">ORGANIZATION:</span>
              <span className="text-neutral-200 font-medium truncate max-w-[200px]">{producer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">COMPANY CODE:</span>
              <span className="text-neutral-200">{producer?.companyCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">JURISDICTION:</span>
              <span className="text-neutral-200">{producer?.jurisdiction}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">STATUS:</span>
              <span className="text-amber-400 uppercase font-bold">{producer?.status || 'PENDING'}</span>
            </div>
          </div>

          {/* Quick tester switcher */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => loginAs('admin')}
              className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 py-2.5 px-4 text-xs font-mono uppercase text-white hover:bg-blue-500 transition-colors shadow cursor-pointer"
            >
              <span>Switch to Admin (Authorize Account)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => loginAs('producer', 'prod-1')}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Switch to Active Producer (Northvolt)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE B: AUTHORIZED PRODUCER
  // Show ONLY two functional features:
  // a) Register a Battery
  // b) EPR Dashboard
  // -------------------------------------------------------------
  const producerBatteries = batteries.filter((b) => b.producerId === producer.id);

  const filteredBatteries = producerBatteries.filter((b) => {
    const matchesSearch =
      b.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.chemistry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChemistry = chemistryFilter === 'all' || b.chemistry === chemistryFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesChemistry && matchesStatus;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;

    const success = registerBattery({
      serialNumber,
      chemistry,
      capacityKwh,
      weightKg,
      nominalVoltageV,
      manufacturingYear,
      originalApplication,
      cycleCount,
      initialSoH,
    });

    if (success) {
      setSerialNumber('');
      setActiveTab('epr');
    }
  };

  const quotaPercent = Math.min(
    100,
    Math.round((producer.eprCurrentRecycledKg / producer.eprQuotaTargetKg) * 100)
  );

  const gradedCount = producerBatteries.filter((b) => b.status === 'graded').length;
  const pendingGradingCount = producerBatteries.filter((b) => b.status === 'awaiting_grading').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24 selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Producer Workspace Header */}
      <div className="border-b border-neutral-900 bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-500 mb-1">
                <span>AUTHORIZED PRODUCER CONSOLE</span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span className="text-zinc-400">{producer.jurisdiction}</span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span className="text-zinc-500">{producer.complianceCertId}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-100 uppercase">
                {producer.name}
              </h1>
            </div>

            {/* Feature Selector: Strictly Two Functional Features */}
            <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-900/60 p-1 text-xs font-mono self-start md:self-auto">
              <button
                onClick={() => setActiveTab('epr')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer ${
                  activeTab === 'epr'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-neutral-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>EPR Dashboard & Ledger</span>
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-neutral-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register a Battery</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* FEATURE B: EPR DASHBOARD & LEDGER                        */}
          {/* ========================================================= */}
          {activeTab === 'epr' && (
            <motion.div
              key="epr-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* EPR Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-neutral-800/80 bg-neutral-900/40 p-5 rounded-md">
                  <div className="text-xs font-mono text-zinc-500 uppercase mb-1">EPR Mass Quota</div>
                  <div className="text-3xl font-mono font-bold text-neutral-100 tabular-nums">
                    {quotaPercent}%
                  </div>
                  <div className="mt-3 w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-2 flex justify-between">
                    <span>{producer.eprCurrentRecycledKg.toLocaleString()} kg</span>
                    <span>/ {producer.eprQuotaTargetKg.toLocaleString()} kg</span>
                  </div>
                </div>

                <div className="border border-neutral-800/80 bg-neutral-900/40 p-5 rounded-md">
                  <div className="text-xs font-mono text-zinc-500 uppercase mb-1">Registered Units</div>
                  <div className="text-3xl font-mono font-bold text-neutral-100 tabular-nums">
                    {producerBatteries.length}
                  </div>
                  <div className="text-xs text-zinc-400 mt-2 flex items-center gap-2 font-mono">
                    <span className="text-neutral-200">{gradedCount} Graded</span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="text-amber-400">{pendingGradingCount} Pending Rig</span>
                  </div>
                </div>

                <div className="border border-neutral-800/80 bg-neutral-900/40 p-5 rounded-md">
                  <div className="text-xs font-mono text-zinc-500 uppercase mb-1">Total Mass Tracked</div>
                  <div className="text-3xl font-mono font-bold text-neutral-100 tabular-nums">
                    {producerBatteries.reduce((sum, b) => sum + b.weightKg, 0).toLocaleString()} <span className="text-xs text-zinc-500 font-normal">kg</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mt-2">
                    Capacity: {producerBatteries.reduce((sum, b) => sum + b.capacityKwh, 0).toFixed(1)} kWh
                  </div>
                </div>

                <div className="border border-neutral-800/80 bg-neutral-900/40 p-5 rounded-md">
                  <div className="text-xs font-mono text-zinc-500 uppercase mb-1">Compliance Status</div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-2 mt-1 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>EU 2023/1542 ACTIVE</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-3 truncate">
                    Audit Token: {producer.complianceCertId}
                  </div>
                </div>
              </div>

              {/* Registered Battery Ledger Table */}
              <div className="border border-neutral-800/80 bg-neutral-900/60 rounded-md overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-tight">Registered Battery Ledger</h3>
                    <p className="text-xs text-zinc-400">
                      Immutable record of registered battery modules, testing queue status, and accredited grades.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search serial number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 w-44 sm:w-56"
                      />
                    </div>

                    {/* Filter by Chemistry */}
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

                    {/* Filter by Status */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="graded">Graded</option>
                      <option value="awaiting_grading">Awaiting Review</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950 text-zinc-500 font-mono">
                        <th className="py-3 px-4 font-normal">SERIAL NUMBER</th>
                        <th className="py-3 px-4 font-normal">CHEMISTRY</th>
                        <th className="py-3 px-4 font-normal text-right">CAPACITY</th>
                        <th className="py-3 px-4 font-normal text-right">CYCLES</th>
                        <th className="py-3 px-4 font-normal text-right">MEASURED SOH</th>
                        <th className="py-3 px-4 font-normal">GRADE</th>
                        <th className="py-3 px-4 font-normal">STATUS</th>
                        <th className="py-3 px-4 font-normal text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono">
                      {filteredBatteries.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-zinc-500">
                            No batteries match the selected query. Click "Register a Battery" to submit your first unit.
                          </td>
                        </tr>
                      ) : (
                        filteredBatteries.map((bat) => (
                          <tr key={bat.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-neutral-200 whitespace-nowrap">
                              {bat.serialNumber}
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                              {bat.chemistry}
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums text-zinc-300 whitespace-nowrap">
                              {bat.capacityKwh} kWh
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums text-zinc-400 whitespace-nowrap">
                              {bat.cycleCount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right tabular-nums whitespace-nowrap">
                              {bat.measuredSoH ? (
                                <span className="text-blue-400 font-bold">{bat.measuredSoH}%</span>
                              ) : (
                                <span className="text-zinc-500">Est. {bat.initialSoH}%</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {bat.grade ? (
                                <span className="text-neutral-200 font-medium">{bat.grade}</span>
                              ) : (
                                <span className="text-zinc-500 text-[11px]">PENDING REVIEW</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {bat.status === 'graded' ? (
                                <span className="text-emerald-400 text-xs">CERTIFIED</span>
                              ) : (
                                <span className="text-amber-400 text-xs">IN DIAGNOSTIC RIG</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedBattery(bat)}
                                className="text-blue-400 hover:text-blue-300 text-xs underline cursor-pointer"
                              >
                                View Passport
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-xs text-zinc-500 font-mono flex items-center justify-between">
                  <span>Showing {filteredBatteries.length} of {producerBatteries.length} units</span>
                  <span>EPR Ledger synchronized in real time</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* FEATURE A: REGISTER A BATTERY FORM                       */}
          {/* ========================================================= */}
          {activeTab === 'register' && (
            <motion.div
              key="register-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="border border-neutral-800/80 bg-neutral-900/60 rounded-md p-6 sm:p-8">
                <div className="pb-6 border-b border-neutral-800 mb-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-1">
                    [BATTERY ONBOARDING]
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-100 uppercase">
                    Register a Battery Unit
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Submit serial data, chemistry, and lifecycle parameters. The unit is instantly entered into your EPR mass balance and pushed to the Reviewer's Grading Queue.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                        Serial Number (Pack / Module ID)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. NV-NMC-2026-904"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 placeholder-zinc-600 focus:outline-none focus:border-blue-600 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                        Cell Chemistry
                      </label>
                      <select
                        value={chemistry}
                        onChange={(e) => setChemistry(e.target.value as BatteryChemistry)}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                      >
                        <option value="NMC 811">NMC 811 (Nickel Manganese Cobalt)</option>
                        <option value="NMC 622">NMC 622 (Balanced Cathode)</option>
                        <option value="LFP (Lithium Iron)">LFP (Lithium Iron Phosphate)</option>
                        <option value="NCA">NCA (Nickel Cobalt Aluminum)</option>
                        <option value="Solid-State Li-Metal">Solid-State Li-Metal</option>
                        <option value="Sodium-Ion">Sodium-Ion (Na-Ion)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                        Rated Capacity (kWh)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="500"
                        step="0.5"
                        required
                        value={capacityKwh}
                        onChange={(e) => setCapacityKwh(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                        Module Mass (kg)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="2000"
                        step="1"
                        required
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                        Nominal Voltage (V)
                      </label>
                      <input
                        type="number"
                        min="48"
                        max="1000"
                        step="1"
                        required
                        value={nominalVoltageV}
                        onChange={(e) => setNominalVoltageV(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  {/* Lifecycle History */}
                  <div className="pt-4 border-t border-neutral-800">
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
                      FIRST-LIFE OPERATIONAL HISTORY
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                          Manufacturing Year
                        </label>
                        <input
                          type="number"
                          min="2015"
                          max="2026"
                          required
                          value={manufacturingYear}
                          onChange={(e) => setManufacturingYear(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                          Chassis Application
                        </label>
                        <select
                          value={originalApplication}
                          onChange={(e) => setOriginalApplication(e.target.value as FirstLifeApplication)}
                          className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Passenger Electric Vehicle">Passenger Electric Vehicle</option>
                          <option value="Commercial Bus / Truck">Commercial Bus / Truck</option>
                          <option value="Stationary Grid Storage">Stationary Grid Storage</option>
                          <option value="Industrial Material Handling">Industrial Material Handling</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                          Discharge Cycle Count
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="15000"
                          step="10"
                          required
                          value={cycleCount}
                          onChange={(e) => setCycleCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                          Initial Estimated SoH (%)
                        </label>
                        <input
                          type="number"
                          min="30"
                          max="100"
                          step="0.1"
                          required
                          value={initialSoH}
                          onChange={(e) => setInitialSoH(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 tabular-nums focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('epr')}
                      className="px-4 py-2 rounded border border-neutral-800 text-xs font-mono text-zinc-400 hover:text-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded bg-blue-600 px-5 py-2.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Submit to EPR & Diagnostics Queue</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Battery Details Modal */}
      <BatteryDetailsModal
        battery={selectedBattery}
        onClose={() => setSelectedBattery(null)}
      />

    </div>
  );
};
