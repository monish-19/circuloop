import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCirculoop } from '../context/CirculoopContext';
import { UserRole } from '../types';
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { loginAs, navigateTo } = useCirculoop();
  const [selectedRole, setSelectedRole] = useState<UserRole>('producer');
  const [selectedProducerId, setSelectedProducerId] = useState<string>('prod-1');

  const handleRoleSelect = (role: UserRole, prodId?: string) => {
    setSelectedRole(role);
    if (prodId) {
      setSelectedProducerId(prodId);
    }
  };

  const handleExecuteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'producer') {
      loginAs('producer', selectedProducerId);
    } else {
      loginAs(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Return back button */}
      <div className="absolute top-6 left-6 sm:left-8">
        <button
          onClick={() => navigateTo('landing')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-1">[AUTHENTICATION]</div>
          <div className="text-2xl font-bold tracking-tight text-neutral-100 uppercase">CIRCULOOP ACCESS</div>
          <p className="mt-2 text-xs text-zinc-400">
            Select a verified persona to launch its isolated workspace.
          </p>
        </div>

        <div className="border border-neutral-800/80 bg-neutral-900/60 rounded-lg p-6 sm:p-8 shadow-2xl">
          
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
            VERIFIED DEMO PERSONAS
          </div>

          <div className="space-y-2.5 mb-6">
            {/* Option 1: Authorized Producer */}
            <button
              type="button"
              onClick={() => handleRoleSelect('producer', 'prod-1')}
              className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                selectedRole === 'producer' && selectedProducerId === 'prod-1'
                  ? 'border-blue-600 bg-blue-950/20 text-neutral-100 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/60 text-zinc-400 hover:border-neutral-700'
              }`}
            >
              <div className="mt-0.5 p-1 rounded bg-neutral-900 text-blue-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">Producer [Authorized]</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">State B Active</span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">Northvolt Energy Storage AB</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Register Battery & EPR Ledger</div>
              </div>
            </button>

            {/* Option 2: Pending Producer (Tests State A Gate) */}
            <button
              type="button"
              onClick={() => handleRoleSelect('producer', 'prod-3')}
              className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                selectedRole === 'producer' && selectedProducerId === 'prod-3'
                  ? 'border-amber-600 bg-amber-950/20 text-neutral-100 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/60 text-zinc-400 hover:border-neutral-700'
              }`}
            >
              <div className="mt-0.5 p-1 rounded bg-neutral-900 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">Producer [Pending Approval]</span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">State A Gate</span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">Veloce Dynamics Ltd</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Tests minimal locked screen gate</div>
              </div>
            </button>

            {/* Option 3: Administrator */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                selectedRole === 'admin'
                  ? 'border-blue-600 bg-blue-950/20 text-neutral-100 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/60 text-zinc-400 hover:border-neutral-700'
              }`}
            >
              <div className="mt-0.5 p-1 rounded bg-neutral-900 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">Platform Administrator</span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">Auth Queue</span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">Producer Authorization Authority</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Approve / Revoke producer licenses</div>
              </div>
            </button>

            {/* Option 4: Reviewer */}
            <button
              type="button"
              onClick={() => handleRoleSelect('reviewer')}
              className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                selectedRole === 'reviewer'
                  ? 'border-blue-600 bg-blue-950/20 text-neutral-100 shadow-sm'
                  : 'border-neutral-800 bg-neutral-950/60 text-zinc-400 hover:border-neutral-700'
              }`}
            >
              <div className="mt-0.5 p-1 rounded bg-neutral-900 text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200">Diagnostic Reviewer</span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">Grading Queue</span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">Battery Grading Station</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Evaluate SoH & assign Grade A/B/C/Recycled</div>
              </div>
            </button>
          </div>

          <form onSubmit={handleExecuteLogin}>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 py-3 px-4 text-xs font-medium text-white hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <span className="text-[11px] text-zinc-500 font-mono">
              STRICT ROLE ISOLATION · ZERO PROPERTY LEAKAGE
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
