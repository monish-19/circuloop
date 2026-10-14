import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCirculoop } from '../context/CirculoopContext';
import { ProducerStatus } from '../types';
import { UserCheck, UserX, Search, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { producers, approveProducer, revokeProducer, loginAs } = useCirculoop();
  const [statusFilter, setStatusFilter] = useState<'all' | ProducerStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducers = producers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = producers.filter((p) => p.status === 'pending').length;
  const authorizedCount = producers.filter((p) => p.status === 'authorized').length;
  const revokedCount = producers.filter((p) => p.status === 'revoked').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24 selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Admin Workspace Header */}
      <div className="border-b border-neutral-900 bg-neutral-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-500 mb-1">
                <span>REGULATORY OVERSIGHT CONSOLE</span>
                <span aria-hidden="true" className="text-neutral-700">·</span>
                <span>TIER 1 ADMINISTRATIVE CLEARANCE</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-100 uppercase">
                Producer Authorization Queue
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Sole administrative workflow: authenticate, verify compliance tokens, and govern OEM licenses.
              </p>
            </div>

            {/* Queue Counter Cards */}
            <div className="flex items-center gap-6 font-mono text-xs">
              <div className="text-left">
                <span className="text-zinc-500 block">PENDING</span>
                <span className="text-amber-400 font-bold text-lg tabular-nums">{pendingCount}</span>
              </div>
              <div className="text-left">
                <span className="text-zinc-500 block">AUTHORIZED</span>
                <span className="text-blue-400 font-bold text-lg tabular-nums">{authorizedCount}</span>
              </div>
              <div className="text-left">
                <span className="text-zinc-500 block">SUSPENDED</span>
                <span className="text-rose-400 font-bold text-lg tabular-nums">{revokedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border border-neutral-800/80 bg-neutral-900/60 rounded-md overflow-hidden"
        >
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="text-zinc-500 uppercase">REGISTRY</span>
              <span aria-hidden="true" className="text-neutral-700">·</span>
              <span>Changes commit instantly across active sessions</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search organization or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-200 placeholder-zinc-500 focus:outline-none focus:border-blue-600 w-48 sm:w-64"
                />
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded border border-neutral-800 text-xs font-mono">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  All ({producers.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    statusFilter === 'pending'
                      ? 'bg-amber-950/80 text-amber-300 font-medium'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setStatusFilter('authorized')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    statusFilter === 'authorized'
                      ? 'bg-emerald-950/80 text-emerald-300 font-medium'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Active ({authorizedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('revoked')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    statusFilter === 'revoked'
                      ? 'bg-rose-950/80 text-rose-300 font-medium'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Revoked ({revokedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-zinc-500 font-mono">
                  <th className="py-3.5 px-4 font-normal">ORGANIZATION</th>
                  <th className="py-3.5 px-4 font-normal">CODE</th>
                  <th className="py-3.5 px-4 font-normal">JURISDICTION</th>
                  <th className="py-3.5 px-4 font-normal">COMPLIANCE TOKEN</th>
                  <th className="py-3.5 px-4 font-normal">REGISTERED</th>
                  <th className="py-3.5 px-4 font-normal">STATUS</th>
                  <th className="py-3.5 px-4 font-normal text-right">ADMIN ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {filteredProducers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      No producer records found matching current query.
                    </td>
                  </tr>
                ) : (
                  filteredProducers.map((producer) => (
                    <tr key={producer.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-200">{producer.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{producer.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                        {producer.companyCode}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                        {producer.jurisdiction}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                        {producer.complianceCertId}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                        {producer.registeredDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {producer.status === 'authorized' && (
                          <span className="text-emerald-400">● AUTHORIZED</span>
                        )}
                        {producer.status === 'pending' && (
                          <span className="text-amber-400">▲ PENDING VERIFICATION</span>
                        )}
                        {producer.status === 'revoked' && (
                          <span className="text-rose-400">✖ SUSPENDED</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {producer.status !== 'authorized' && (
                            <button
                              onClick={() => approveProducer(producer.id)}
                              className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-xs font-mono font-medium text-white hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
                              title="Authorize this producer immediately"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Authorize</span>
                            </button>
                          )}

                          {producer.status === 'authorized' && (
                            <button
                              onClick={() => revokeProducer(producer.id)}
                              className="inline-flex items-center gap-1.5 rounded border border-rose-800/80 bg-rose-950/40 px-3 py-1.5 text-xs font-mono font-medium text-rose-300 hover:bg-rose-900/50 transition-colors cursor-pointer"
                              title="Revoke active authorization"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Revoke</span>
                            </button>
                          )}

                          <button
                            onClick={() => loginAs('producer', producer.id)}
                            className="inline-flex items-center rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-neutral-200 transition-colors cursor-pointer"
                            title="Inspect this producer's view"
                          >
                            <span>Inspect View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-950 text-xs text-zinc-500 font-mono flex items-center justify-between">
            <span>REGULATORY OVERSIGHT: SYNCHRONIZED</span>
            <span>FRAMEWORK: EU DIRECTIVE 2023/1542</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
};
