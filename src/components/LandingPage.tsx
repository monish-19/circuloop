import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  AnimatePresence
} from 'motion/react';
import { useCirculoop } from '../context/CirculoopContext';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Database,
  ArrowUpRight,
  Gauge,
  Sliders,
  CheckCircle2,
  Terminal,
  Layers,
  Zap,
  Pause
} from 'lucide-react';
import { MobilePreviewShell } from './mobile/MobilePreviewShell';

const HERO_IMAGE_PATH = '/src/assets/images/battery_module_industrial_1791989569170.jpg';

interface PillarData {
  id: string;
  index: string;
  title: string;
  summary: string;
  specA: { label: string; value: string };
  specB: { label: string; value: string };
  telemetryNote: string;
  codeSnippet: string;
}

const PILLARS: PillarData[] = [
  {
    id: 'p-epr',
    index: '01',
    title: 'EPR Quota Reconciliation',
    summary: 'Audited mass-balance tracking conforming to EU 2023/1542 Extended Producer Responsibility standards.',
    specA: { label: 'Mass Balance Precision', value: '98.4%' },
    specB: { label: 'Compliance Protocol', value: 'ISO 14040/44' },
    telemetryNote: 'Automated producer ledger with cryptographically verifiable raw mineral balances.',
    codeSnippet: 'EPR_RECOVERY_YIELD: 98.42% · AUDIT_HASH: 0x9F41C...B82',
  },
  {
    id: 'p-eis',
    index: '02',
    title: 'Electrochemical Impedance Diagnostics',
    summary: 'Non-destructive multi-frequency AC impedance spectroscopy mapping internal resistance and thermal degradation.',
    specA: { label: 'Internal Resistance Delta', value: '1.48 mΩ' },
    specB: { label: 'Inspection Velocity', value: '<12 min / pack' },
    telemetryNote: 'Empirical Nyquist spectrum evaluation without pack disassembly.',
    codeSnippet: 'EIS_FREQUENCY: 0.1Hz - 10kHz · SOH_TOLERANCE: ±0.3%',
  },
  {
    id: 'p-routing',
    index: '03',
    title: 'Algorithmic Second-Life Routing',
    summary: 'Automated disposition logic dispatching modules into Grid Storage (Grade A), Light Commercial ESS (Grade B), or Closed-Loop Hydrometallurgy (Recycled).',
    specA: { label: 'Secondary Life Span', value: '+6 to 8 Years' },
    specB: { label: 'Carbon Abatement', value: '3,420 kg CO₂e' },
    telemetryNote: 'Dynamic thresholding based on cell delta voltage and remaining cycle projection.',
    codeSnippet: 'DISPOSITION_POLICY: GRADE_A_GRID · STATUS: ROUTED',
  },
  {
    id: 'p-passport',
    index: '04',
    title: 'Digital Battery Passport Ledger',
    summary: 'Immutable serial registration recording chemistry (NMC, LFP, NCA), origin chassis, cumulative charge throughput, and certified grading history.',
    specA: { label: 'Ledger Latency', value: '0 ms (Client Sync)' },
    specB: { label: 'Traceability Index', value: 'DIN EN 50604-1' },
    telemetryNote: 'Real-time synchronization across producer, regulatory admin, and certified reviewer consoles.',
    codeSnippet: 'SERIAL_REGISTRY: ACTIVE · SYNC_STATE: REALTIME',
  },
];

const TICKER_ITEMS = [
  'EPR MASS BALANCE · 98.4% CERTIFIED',
  'EIS TEST DURATION · <12 MIN / PACK',
  'EU REGULATION 2023/1542 · LEVEL 4 HARMONIZED',
  'SECONDARY LIFE CYCLE · +6.4 YEARS EXTENSION',
  'HYDROMETALLURGICAL YIELD · 95.8% NI/CO/LI RECOVERY',
  'DIGITAL BATTERY PASSPORT · IMMUTABLE LEDGER',
  'ISO 14040/44 LCA · THIRD-PARTY VERIFIED',
  'STRICT ROLE ISOLATION · ZERO PROPERTY LEAKAGE',
];

// Interactive Kinetic Typography Word component
const KineticWord: React.FC<{
  word: string;
  className?: string;
  isAccent?: boolean;
}> = ({ word, className = '', isAccent = false }) => {
  return (
    <span
      className={`inline-block whitespace-nowrap select-none cursor-pointer ${className}`}
      data-cursor="headline"
    >
      {word.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block transition-colors duration-150"
          whileHover={{
            y: -12,
            scale: 1.08,
            color: isAccent ? '#60a5fa' : '#3b82f6',
            transition: { type: 'spring', damping: 14, stiffness: 450 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Velocity-reactive infinite scrolling marquee with easy readability and hover pause
const VelocityMarquee: React.FC<{ items: string[]; baseVelocity?: number }> = ({
  items,
  baseVelocity = 0.22, // Significantly reduced for high legibility
}) => {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 45, stiffness: 240 });
  const velocityFactor = useTransform(smoothVelocity, [-1500, 0, 1500], [-1.2, 0, 1.2]);

  useAnimationFrame((_, delta) => {
    // Explicit hover pause: when user hovers over marquee, smoothly pause movement
    if (isHovered) return;

    let moveBy = baseVelocity * (delta / 16);
    const speedMultiplier = velocityFactor.get();
    moveBy += Math.sign(moveBy || 1) * Math.min(Math.abs(speedMultiplier), 0.8) * 0.15;

    let newX = baseX.get() - moveBy;
    if (newX <= -50) {
      newX = 0;
    } else if (newX > 0) {
      newX = -50;
    }
    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-text="PAUSE"
      className="py-4 border-b border-neutral-900 bg-neutral-950 overflow-hidden select-none relative cursor-pointer group"
      title="Hover to pause ticker"
    >
      {/* Subtle indicator of pause capability */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-900/80 border border-neutral-800 text-[10px] font-mono text-zinc-500 opacity-60 group-hover:opacity-100 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all pointer-events-none">
        <Pause className="w-2.5 h-2.5" />
        <span>{isHovered ? 'PAUSED' : 'HOVER TO PAUSE'}</span>
      </div>

      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap items-center gap-8 text-xs font-mono text-zinc-400 uppercase tracking-widest"
      >
        {items.concat(items, items, items).map((item, idx) => (
          <span key={idx} className="flex items-center gap-8 shrink-0">
            <span className="hover:text-blue-400 transition-colors">{item}</span>
            <span aria-hidden="true" className="text-neutral-800 font-bold">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { navigateTo, loginAs } = useCirculoop();
  const [activePillar, setActivePillar] = useState<PillarData>(PILLARS[0]);
  const [imageError, setImageError] = useState(false);

  // =========================================================================
  // 1. HERO SECTION SCROLL PARALLAX & FLUID SPRING SCALE-DOWN
  // =========================================================================
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Raw transforms: scale 1 -> 0.92, opacity 1 -> 0.3, Y 0 -> 120px
  const rawHeroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const rawHeroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.3]);
  const rawHeroY = useTransform(heroProgress, [0, 1], [0, 120]);

  // Spring physics for ultra-fluid motion (stiffness: 100, damping: 20)
  const springConfig = { stiffness: 100, damping: 20 };
  const heroScale = useSpring(rawHeroScale, springConfig);
  const heroOpacity = useSpring(rawHeroOpacity, springConfig);
  const heroY = useSpring(rawHeroY, springConfig);

  // 3D perspective tilt on hero media
  const rawMediaTilt = useTransform(heroProgress, [0, 1], [0, 12]);
  const mediaTiltX = useSpring(rawMediaTilt, springConfig);

  // =========================================================================
  // 2. MORE PRONOUNCED & CINEMATIC STICKY SECTION STACKING
  // Slower, deeper cinematic spring (stiffness: 45, damping: 22)
  // Section scales down to 0.90 and blurs to 6px as next section pins over it
  // =========================================================================
  const cinematicSpringConfig = { stiffness: 45, damping: 22 };

  const sectionBRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sectionBProgress } = useScroll({
    target: sectionBRef,
    offset: ['start end', 'start start'],
  });

  const rawSectionAScale = useTransform(sectionBProgress, [0, 0.85], [1, 0.90]);
  const rawSectionABlur = useTransform(sectionBProgress, [0, 0.85], [0, 6]);
  const rawSectionAOpacity = useTransform(sectionBProgress, [0, 0.85], [1, 0.40]);

  const sectionAScale = useSpring(rawSectionAScale, cinematicSpringConfig);
  const sectionAOpacity = useSpring(rawSectionAOpacity, cinematicSpringConfig);
  const sectionABlur = useTransform(rawSectionABlur, (v) => `blur(${v}px)`);

  const sectionCRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sectionCProgress } = useScroll({
    target: sectionCRef,
    offset: ['start end', 'start start'],
  });

  const rawSectionBScale = useTransform(sectionCProgress, [0, 0.85], [1, 0.90]);
  const rawSectionBBlur = useTransform(sectionCProgress, [0, 0.85], [0, 6]);
  const rawSectionBOpacity = useTransform(sectionCProgress, [0, 0.85], [1, 0.40]);

  const sectionBScale = useSpring(rawSectionBScale, cinematicSpringConfig);
  const sectionBOpacity = useSpring(rawSectionBOpacity, cinematicSpringConfig);
  const sectionBBlur = useTransform(rawSectionBBlur, (v) => `blur(${v}px)`);

  // Interactive Simulator states
  const [simSoH, setSimSoH] = useState(82);
  const [simImpedance, setSimImpedance] = useState(1.6);

  const getSimOutcome = (soh: number, imp: number) => {
    if (soh >= 80 && imp <= 2.2) {
      return {
        grade: 'Grade A',
        destination: 'Stationary Grid ESS Storage',
        lifecycleExtension: '+6 to 8 Years',
        co2SavedKg: '3,420 kg CO₂e',
      };
    }
    if (soh >= 70 && imp <= 3.5) {
      return {
        grade: 'Grade B',
        destination: 'Light Mobility & Telecom Backup',
        lifecycleExtension: '+3 to 5 Years',
        co2SavedKg: '2,150 kg CO₂e',
      };
    }
    if (soh >= 45) {
      return {
        grade: 'Grade C',
        destination: 'Secondary Material Recovery',
        lifecycleExtension: '+1 to 2 Years Repair / Reconditioning',
        co2SavedKg: '1,450 kg CO₂e',
      };
    }
    return {
      grade: 'Recycled',
      destination: 'Closed-Loop Hydrometallurgy (Ni, Co, Li Recovery)',
      lifecycleExtension: 'Secondary Precursor Output',
      co2SavedKg: '1,280 kg CO₂e',
    };
  };

  const simResult = getSimOutcome(simSoH, simImpedance);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-x-hidden selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH KINETIC TYPOGRAPHY & PARALLAX                        */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col justify-between pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="mx-auto max-w-7xl w-full flex-1 flex flex-col justify-center"
        >
          {/* Eyebrow / Kicker */}
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6">
            <span className="text-blue-500 font-semibold">[00]</span>
            <span>BATTERY CIRCULAR ECONOMY PLATFORM</span>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <span>EU 2023/1542 HARMONIZED</span>
          </div>

          {/* Kinetic Typography Hero Headline Interactions */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-neutral-100 leading-[0.92] uppercase max-w-6xl">
            <div className="overflow-visible mb-1">
              <KineticWord word="CIRCULAR" />
            </div>
            <div className="overflow-visible mb-1">
              <KineticWord word="LIFECYCLE" className="text-zinc-500" isAccent />
            </div>
            <div className="overflow-visible">
              <KineticWord word="INFRASTRUCTURE." />
            </div>
          </h1>

          {/* Punchy minimal subtext */}
          <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-400 font-normal max-w-2xl leading-relaxed">
            Automated Extended Producer Responsibility (EPR) reconciliation, empirical electrochemical impedance grading, and certified secondary-life routing.
          </p>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigateTo('auth')}
              data-cursor-text="LAUNCH"
              className="inline-flex items-center gap-3 rounded-md bg-blue-600 px-6 py-3.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-950/40 cursor-pointer"
            >
              <span>Access Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#hover-preview"
              data-cursor-text="EXPLORE"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-zinc-900/40 px-5 py-3.5 text-sm font-medium text-zinc-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            >
              <span>Explore Diagnostics</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </a>
          </div>
        </motion.div>

        {/* Industrial Hero Asset Visual Frame with Dynamic Zoom-In Entrance */}
        <div className="mx-auto max-w-7xl w-full mt-12 pt-6 border-t border-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
            className="lg:col-span-8"
          >
            <motion.div
              style={{
                rotateX: mediaTiltX,
                transformStyle: 'preserve-3d',
              }}
              className="relative rounded border border-neutral-800/80 bg-zinc-900/40 overflow-hidden shadow-2xl transition-shadow duration-300"
            >
              {!imageError ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Engineered modular battery pack with laser-welded busbars and telemetry instrumentation"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <div className="w-full h-80 bg-neutral-900 flex flex-col items-center justify-center text-center p-6">
                  <Cpu className="w-10 h-10 text-zinc-600 mb-2" />
                  <span className="text-xs font-mono text-zinc-400">MODULAR BATTERY PACK TELEMETRY TERMINAL</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 inset-x-3 p-3 bg-neutral-950/85 backdrop-blur-sm border border-neutral-800 rounded flex flex-wrap items-center justify-between text-xs font-mono text-zinc-300">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 font-semibold">MOD-LFP-0223</span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span>102.8V / 240Ah</span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span>PRISMATIC ARCHITECTURE</span>
                </div>
                <span className="text-zinc-500">EIS PROBE READY</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Staggered Metric & Feature Cards with Scale/Zoom-in Reveal */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded border border-neutral-800/80 bg-zinc-900/40"
            >
              <div className="text-xs font-mono text-zinc-500 uppercase mb-1">PRODUCER OVERSIGHT</div>
              <div className="text-xl font-bold text-neutral-100 tracking-tight">Zero Property Leakage</div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Roles are strictly isolated. Producers manage registration and EPR balances. Admins authorize entities. Reviewers perform electrochemical evaluation.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded border border-neutral-800/80 bg-zinc-900/40"
              >
                <div className="text-2xl font-mono font-bold text-neutral-100 tabular-nums">98.4%</div>
                <div className="text-xs font-mono text-zinc-500 mt-1">EPR PRECISION</div>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded border border-neutral-800/80 bg-zinc-900/40"
              >
                <div className="text-2xl font-mono font-bold text-blue-400 tabular-nums">&lt;12 min</div>
                <div className="text-xs font-mono text-zinc-500 mt-1">EIS GRADING</div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VELOCITY-REACTIVE HORIZONTAL MARQUEE TICKER (CALM SPEED + HOVER PAUSE) */}
      {/* ========================================================================= */}
      <VelocityMarquee items={TICKER_ITEMS} baseVelocity={0.22} />

      {/* ========================================================================= */}
      {/* 3. STICKY STACKING SECTION A: PILLARS WITH ALTERNATING LATERAL SLIDES     */}
      {/* ========================================================================= */}
      <div className="relative">
        <motion.section
          id="hover-preview"
          style={{
            scale: sectionAScale,
            opacity: sectionAOpacity,
            filter: sectionABlur,
          }}
          className="sticky top-0 z-10 py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 shadow-2xl min-h-screen"
        >
          <div className="mx-auto max-w-7xl">
            
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-2"
              >
                [01] PLATFORM PILLARS
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-100 uppercase"
              >
                ENGINEERED FOR AUDITABLE CIRCULARITY.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed"
              >
                Hover over each architectural pillar to stream live diagnostic parameters, impedance criteria, and compliance protocols.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Alternating Lateral Entrance Cards (Odd from Left, Even from Right) */}
              <div className="lg:col-span-7 space-y-3">
                {PILLARS.map((pillar, idx) => {
                  const isActive = activePillar.id === pillar.id;
                  const isOdd = idx % 2 === 0; // Item 1, 3 (odd in 1-based) slide from Left; Item 2, 4 slide from Right
                  return (
                    <motion.div
                      key={pillar.id}
                      initial={{ x: isOdd ? -100 : 100, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setActivePillar(pillar)}
                      onClick={() => setActivePillar(pillar)}
                      data-cursor-text="INSPECT"
                      className={`p-6 rounded-md border transition-all cursor-pointer ${
                        isActive
                          ? 'border-blue-600 bg-zinc-900/80 shadow-md'
                          : 'border-neutral-800/80 bg-zinc-900/30 hover:border-neutral-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-xs ${isActive ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
                            [{pillar.index}]
                          </span>
                          <h3 className="text-lg font-semibold text-neutral-100 tracking-tight">
                            {pillar.title}
                          </h3>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'text-blue-400 translate-x-1' : 'text-zinc-600'}`} />
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-7">
                        {pillar.summary}
                      </p>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-neutral-800 pl-7 grid grid-cols-2 gap-4 text-xs font-mono"
                        >
                          <div>
                            <span className="text-zinc-500 block">{pillar.specA.label}</span>
                            <span className="text-neutral-200 font-semibold">{pillar.specA.value}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">{pillar.specB.label}</span>
                            <span className="text-neutral-200 font-semibold">{pillar.specB.value}</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Dynamic Telemetry Preview Card with Scale/Zoom Entrance */}
              <div className="lg:col-span-5 sticky top-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar.id}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-lg border border-neutral-800 bg-zinc-900/90 p-6 shadow-2xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs font-mono">
                      <span className="text-blue-400 uppercase font-semibold">
                        TELEMETRY CARD [{activePillar.index}]
                      </span>
                      <span className="text-zinc-500">REALTIME SNAPSHOT</span>
                    </div>

                    <div className="my-6">
                      <div className="text-xs font-mono text-zinc-500 uppercase">ACTIVE SUBSYSTEM</div>
                      <div className="text-xl font-bold text-neutral-100 tracking-tight mt-1">
                        {activePillar.title}
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {activePillar.telemetryNote}
                      </p>
                    </div>

                    <div className="space-y-3 p-4 rounded bg-neutral-950 border border-neutral-800/80 font-mono text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-zinc-500">{activePillar.specA.label}:</span>
                        <span className="text-blue-400 font-semibold tabular-nums">{activePillar.specA.value}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="text-zinc-500">{activePillar.specB.label}:</span>
                        <span className="text-neutral-200 tabular-nums">{activePillar.specB.value}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Security Gate:</span>
                        <span className="text-emerald-400">ISOLATED ROLE VERIFIED</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-zinc-400 truncate">
                      <span className="text-blue-500 mr-2">&gt;</span>
                      {activePillar.codeSnippet}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-mono">Test this workflow</span>
                      <button
                        onClick={() => navigateTo('auth')}
                        data-cursor-text="OPEN"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <span>Open Console</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </motion.section>

        {/* ========================================================================= */}
        {/* 4. STICKY STACKING SECTION B: SOH GRADING MATRIX (Lateral Left & Right)   */}
        {/* ========================================================================= */}
        <div ref={sectionBRef} className="relative">
          <motion.section
            id="epr-mechanism"
            style={{
              scale: sectionBScale,
              opacity: sectionBOpacity,
              filter: sectionBBlur,
            }}
            className="sticky top-0 z-20 py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 shadow-2xl min-h-screen"
          >
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Lateral Entrance: Evaluation Engine & Controls */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5"
                >
                  <div className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-2">
                    [02] EVALUATION ENGINE
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 uppercase">
                    CALCULATED SECOND-LIFE DISPOSITION.
                  </h2>
                  <p className="mt-3 text-zinc-400 text-sm leading-relaxed mb-8">
                    Adjust state-of-health and internal resistance to test the Reviewer console's deterministic decision tree.
                  </p>

                  {/* Scrubber Controls */}
                  <div className="space-y-6 border border-neutral-800/80 bg-zinc-900/40 p-6 rounded-md">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-zinc-300">Measured State of Health (SoH)</span>
                        <span className="text-blue-400 tabular-nums font-bold">{simSoH}%</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="98"
                        step="1"
                        value={simSoH}
                        onChange={(e) => setSimSoH(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1">
                        <span>35% (Recycled)</span>
                        <span>70% (Grade B)</span>
                        <span>85%+ (Grade A Grid)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-zinc-300">Internal Resistance (mΩ)</span>
                        <span className="text-blue-400 tabular-nums font-bold">{simImpedance.toFixed(1)} mΩ</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="5.5"
                        step="0.1"
                        value={simImpedance}
                        onChange={(e) => setSimImpedance(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1">
                        <span>0.8 mΩ (Nominal)</span>
                        <span>2.5 mΩ (Drift)</span>
                        <span>5.5 mΩ (Degraded)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Lateral Entrance: Readout Stage */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-7"
                >
                  <div className="border border-neutral-800 bg-zinc-900/60 rounded-lg p-6 sm:p-8">
                    <div className="flex items-center justify-between pb-6 border-b border-neutral-800 text-xs font-mono">
                      <span className="text-zinc-500 uppercase">CLASSIFICATION LOGIC</span>
                      <span className="text-blue-400">CERTAINTY 99.2%</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
                      <div>
                        <span className="text-xs font-mono text-zinc-500 block">Assigned Certification</span>
                        <div className="text-3xl font-mono font-bold text-neutral-100 mt-1">
                          {simResult.grade}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-zinc-500 block">Projected Life Extension</span>
                        <div className="text-2xl font-mono font-bold text-blue-400 mt-1">
                          {simResult.lifecycleExtension}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded border border-neutral-800 bg-neutral-950">
                      <div className="text-xs font-mono text-zinc-500 uppercase mb-1">
                        Target Circular Disposition Pathway
                      </div>
                      <div className="text-sm font-semibold text-neutral-200">
                        {simResult.destination}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono mt-2">
                        Avoided Carbon Offset: <span className="text-neutral-300 font-semibold">{simResult.co2SavedKg}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-mono">
                        Reviewers grade units live inside Reviewer Station.
                      </span>
                      <button
                        onClick={() => loginAs('reviewer')}
                        data-cursor-text="RIG"
                        className="inline-flex items-center gap-2 rounded bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        <span>Launch Reviewer Station</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.section>

          {/* ========================================================================= */}
          {/* 5. INTERACTIVE MOBILE NATIVE APP PREVIEW SHELL (Owner, Collector, Recycler) */}
          {/* ========================================================================= */}
          <section
            id="mobile-preview"
            className="relative z-25 py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950/95"
          >
            <div className="mx-auto max-w-7xl">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-2 flex items-center justify-center gap-2"
                >
                  <span>[03] FIELD LOGISTICS & RECOVERY APPS</span>
                  <span className="text-[10px] text-emerald-400 border border-emerald-800/80 bg-emerald-950/60 px-2 py-0.5 rounded font-mono">
                    INTERACTIVE DEMO
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-100 uppercase"
                >
                  MOBILE CIRCULAR SHELL.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
                >
                  Ultra-responsive native mobile interfaces for Fleet Operators, Field Handover Collectors, and Hydrometallurgical Recyclers. Test all three strictly isolated roles directly inside the titanium frame.
                </motion.p>
              </div>

              {/* Centered Mobile Device Frame Component */}
              <MobilePreviewShell />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 6. STICKY STACKING SECTION C: ROLE ISOLATION MATRIX (Left, Scale, Right)  */}
          {/* ========================================================================= */}
          <div ref={sectionCRef} className="relative">
            <section
              id="role-isolation"
              className="sticky top-0 z-30 py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950 shadow-2xl min-h-screen"
            >
              <div className="mx-auto max-w-7xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xs font-mono uppercase tracking-widest text-blue-500 mb-2"
                  >
                    [04] ROLE ISOLATION ARCHITECTURE
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 uppercase"
                  >
                    ZERO CROSS-ROLE PROPERTY LEAKAGE.
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-3 text-zinc-400 text-sm leading-relaxed"
                  >
                    Every workflow is strictly isolated to its designated persona. Real-time updates sync across roles without page reloads.
                  </motion.p>
                </div>

                {/* Lateral Entrances for Role Cards (Role 1 from Left, Role 2 Zoom-In, Role 3 from Right) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Role 1: Producer (Slide Left: x: -100) */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="border border-neutral-800/80 bg-zinc-900/40 p-6 rounded-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">ROLE 01</div>
                      <h3 className="text-xl font-bold text-neutral-100 mb-2">Battery Producer</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        Register battery units and manage cumulative EPR mass quotas. Unapproved accounts are locked behind an admin approval screen.
                      </p>
                      <div className="space-y-2 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>Battery Asset Registration Form</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>EPR Ledger & Mass Quota Monitor</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => loginAs('producer', 'prod-1')}
                      data-cursor-text="PROD"
                      className="mt-6 w-full rounded border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-mono uppercase text-neutral-200 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
                    >
                      Sign In: Producer (Active)
                    </button>
                  </motion.div>

                  {/* Role 2: Admin (Zoom In: scale: 0.9) */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="border border-neutral-800/80 bg-zinc-900/40 p-6 rounded-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">ROLE 02</div>
                      <h3 className="text-xl font-bold text-neutral-100 mb-2">Platform Admin</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        Strictly restricted to the Producer Authorization Queue. Review, approve, or revoke producer licenses with instant state reactivity.
                      </p>
                      <div className="space-y-2 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>Producer Authorization Queue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>Real-time Credential Grant & Revocation</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => loginAs('admin')}
                      data-cursor-text="ADMIN"
                      className="mt-6 w-full rounded border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-mono uppercase text-neutral-200 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
                    >
                      Sign In: Administrator
                    </button>
                  </motion.div>

                  {/* Role 3: Reviewer (Slide Right: x: 100) */}
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="border border-neutral-800/80 bg-zinc-900/40 p-6 rounded-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-2">ROLE 03</div>
                      <h3 className="text-xl font-bold text-neutral-100 mb-2">Diagnostic Reviewer</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        Strictly restricted to the Battery Grading Queue. Evaluate electrochemical metrics, record internal resistance, and issue certified grades.
                      </p>
                      <div className="space-y-2 text-xs font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>Battery Grading Queue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">·</span>
                          <span>Grade A, B, C & Recycled Assignment</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => loginAs('reviewer')}
                      data-cursor-text="GRADE"
                      className="mt-6 w-full rounded border border-neutral-800 bg-neutral-900 py-2.5 text-xs font-mono uppercase text-neutral-200 hover:bg-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
                    >
                      Sign In: Reviewer
                    </button>
                  </motion.div>

                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-40 py-12 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-xs font-mono text-zinc-500 border-t border-neutral-900">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-neutral-300">CIRCULOOP</span>
            <span aria-hidden="true" className="text-neutral-800">·</span>
            <span>BATTERY CIRCULAR ECONOMY PLATFORM</span>
          </div>

          <div className="flex items-center gap-6">
            <span>EU 2023/1542</span>
            <span>ISO 14040/44</span>
            <span>DIN EN 50604-1</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
