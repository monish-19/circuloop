import React from 'react';
import { useCirculoop } from '../context/CirculoopContext';
import { ArrowRight, LogOut } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { currentUser, activeView, navigateTo, logout, loginAs, getActiveProducer } = useCirculoop();
  const activeProducer = getActiveProducer();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => navigateTo('landing')}
          className="text-left font-sans text-xl font-bold tracking-tighter text-neutral-100 hover:text-white transition-colors whitespace-nowrap shrink-0 focus:outline-none"
        >
          CIRCULOOP
        </button>

        {/* Zone 2: Navigation Links or Contextual Breadcrumbs */}
        {activeView === 'landing' || !currentUser ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#circular-pillars" className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0">
              Pillars
            </a>
            <a href="#hover-preview" className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0">
              Diagnostics
            </a>
            <a href="#epr-mechanism" className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0">
              EPR Standard
            </a>
            <a href="#mobile-preview" className="text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Mobile Shell</span>
            </a>
            <a href="#role-isolation" className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0">
              Role Matrix
            </a>
          </nav>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500 uppercase tracking-widest">CONSOLE</span>
            <span aria-hidden="true" className="text-neutral-700">/</span>
            <span className="font-semibold text-neutral-200 uppercase">
              {currentUser.role === 'producer' && (
                <>
                  Producer Ledger
                  {activeProducer && (
                    <span className="ml-2 text-zinc-500 font-mono">[{activeProducer.companyCode}]</span>
                  )}
                </>
              )}
              {currentUser.role === 'admin' && 'Producer Authorization Authority'}
              {currentUser.role === 'reviewer' && 'State-of-Health Diagnostic Rig'}
            </span>
          </div>
        )}

        {/* Zone 3: Primary Action & Quick Role Switcher for seamless testing */}
        <div className="flex items-center gap-4 shrink-0">
          {!currentUser ? (
            <button
              onClick={() => navigateTo('auth')}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Access Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* Quick Persona Switcher for evaluation */}
              <div className="hidden sm:flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900/60 p-1 text-xs font-mono">
                <button
                  onClick={() => loginAs('producer', 'prod-1')}
                  title="Switch to Approved Producer (Northvolt)"
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    currentUser.role === 'producer' && activeProducer?.id === 'prod-1'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Prod [Active]
                </button>
                <button
                  onClick={() => loginAs('producer', 'prod-3')}
                  title="Switch to Pending Producer (Veloce) to test State A gate"
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    currentUser.role === 'producer' && activeProducer?.id === 'prod-3'
                      ? 'bg-amber-950/80 text-amber-300 font-medium border border-amber-700/60'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Prod [Pending]
                </button>
                <button
                  onClick={() => loginAs('admin')}
                  title="Switch to Admin (Authorization Queue)"
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => loginAs('reviewer')}
                  title="Switch to Reviewer (Grading Queue)"
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    currentUser.role === 'reviewer'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-neutral-200'
                  }`}
                >
                  Reviewer
                </button>
              </div>

              {/* Sign out */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-neutral-900 hover:text-neutral-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Sign out to landing page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-mono">Exit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
