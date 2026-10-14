import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCirculoop } from '../../context/CirculoopContext';
import { MobilePersona } from '../../types';
import { OwnerFleetView } from './OwnerFleetView';
import { CollectorView } from './CollectorView';
import { RecyclerView } from './RecyclerView';
import {
  Smartphone,
  Truck,
  Factory,
  Car,
  Wifi,
  Battery,
  Signal,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Maximize2,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const MobilePreviewShell: React.FC = () => {
  const {
    activePersona,
    setActivePersona,
    walletBalance,
    mobilePacks,
    navigateTo,
    loginAs
  } = useCirculoop();

  const activePacksCount = mobilePacks.filter((p) => p.status === 'active' || p.status === 'eol_reported').length;
  const bookedPacksCount = mobilePacks.filter((p) => p.status === 'booked').length;
  const collectedPacksCount = mobilePacks.filter((p) => p.status === 'collected').length;

  return (
    <div className="w-full py-8 px-4 flex flex-col items-center justify-center relative">
      
      {/* Top Controller Bar above the Phone Frame */}
      <div className="w-full max-w-md mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-200">
              CircuLoop Mobile Native Shell
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
            iOS / Android Shell Preview
          </span>
        </div>

        {/* 3-Role Isolated Tabs Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
          <button
            onClick={() => setActivePersona('owner')}
            className={`py-2 px-1 text-center rounded text-xs font-mono transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
              activePersona === 'owner'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" />
              <span>Owner / Fleet</span>
            </div>
            <span className="text-[9px] opacity-80 font-normal">
              {walletBalance} Credits
            </span>
          </button>

          <button
            onClick={() => setActivePersona('collector')}
            className={`py-2 px-1 text-center rounded text-xs font-mono transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
              activePersona === 'collector'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Collector</span>
            </div>
            <span className="text-[9px] opacity-80 font-normal">
              {bookedPacksCount} Pending Pickup
            </span>
          </button>

          <button
            onClick={() => setActivePersona('recycler')}
            className={`py-2 px-1 text-center rounded text-xs font-mono transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
              activePersona === 'recycler'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Factory className="w-3.5 h-3.5" />
              <span>Recycler</span>
            </div>
            <span className="text-[9px] opacity-80 font-normal">
              {collectedPacksCount} In Transit
            </span>
          </button>
        </div>
      </div>

      {/* Titanium-Bezel Mobile Device Frame */}
      <div className="relative w-full max-w-[390px] rounded-[48px] p-3.5 bg-gradient-to-b from-neutral-800 via-zinc-900 to-neutral-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.12)] border-2 border-neutral-700/80">
        
        {/* Subtle Metallic Highlight Rim */}
        <div className="absolute inset-0 rounded-[48px] pointer-events-none border border-white/10" />

        {/* Screen Display Container */}
        <div className="relative w-full h-[760px] rounded-[38px] bg-neutral-950 overflow-hidden flex flex-col border border-neutral-800/90 text-neutral-100">
          
          {/* Status Bar / Dynamic Island Header */}
          <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs font-mono border-b border-neutral-900">
            {/* Clock */}
            <span className="font-bold text-[11px] text-neutral-300">09:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="w-24 h-4 bg-neutral-900 rounded-full border border-neutral-800/80 flex items-center justify-center gap-1.5 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] text-zinc-400 tracking-tight font-mono">CIRCULOOP</span>
            </div>

            {/* Signal & Battery Icons */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Persona Header Indicator */}
          <div className="px-4 py-2 bg-zinc-900/60 border-b border-neutral-800/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-bold text-neutral-200 uppercase tracking-wider text-[11px]">
                {activePersona === 'owner' && 'Fleet Operator Console'}
                {activePersona === 'collector' && 'Field Logistics Route'}
                {activePersona === 'recycler' && 'Intake & Recovery Rig'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">v2.4 Live</span>
          </div>

          {/* Scrollable Viewport inside the Phone */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activePersona === 'owner' && (
                <motion.div
                  key="owner"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  <OwnerFleetView />
                </motion.div>
              )}

              {activePersona === 'collector' && (
                <motion.div
                  key="collector"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollectorView />
                </motion.div>
              )}

              {activePersona === 'recycler' && (
                <motion.div
                  key="recycler"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                >
                  <RecyclerView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Swipe Bar for Mobile ergonomics */}
          <div className="sticky bottom-0 z-30 w-full py-2 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent flex justify-center pointer-events-none">
            <div className="w-32 h-1 bg-neutral-700/80 rounded-full" />
          </div>

        </div>
      </div>

      {/* Switch to Enterprise Desktop Console Helper */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500">
        <span className="text-zinc-400">Desktop Web Console:</span>
        <button
          onClick={() => loginAs('producer')}
          className="text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center gap-1"
        >
          <span>Producer Console</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <span className="text-neutral-800">·</span>
        <button
          onClick={() => loginAs('admin')}
          className="text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center gap-1"
        >
          <span>Admin Authorization</span>
          <ArrowRight className="w-3 h-3" />
        </button>
        <span className="text-neutral-800">·</span>
        <button
          onClick={() => loginAs('reviewer')}
          className="text-blue-400 hover:text-blue-300 underline cursor-pointer flex items-center gap-1"
        >
          <span>Reviewer Rig</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
