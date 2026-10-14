/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CirculoopProvider, useCirculoop } from './context/CirculoopContext';
import { TopNav } from './components/TopNav';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { ProducerDashboard } from './components/ProducerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReviewerDashboard } from './components/ReviewerDashboard';
import { CustomCursor } from './components/CustomCursor';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, currentUser, notification, clearNotification } = useCirculoop();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Custom Spring Follower Cursor */}
      <CustomCursor />

      {/* Top Bar Contract (Single header for platform) */}
      <TopNav />

      {/* Global Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 max-w-md w-full px-4"
          >
            <div className="flex items-center justify-between gap-3 p-3.5 rounded border border-neutral-800 bg-neutral-900/95 backdrop-blur-md shadow-2xl text-xs font-mono">
              <div className="flex items-center gap-2.5">
                {notification.type === 'success' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {notification.type === 'warning' && (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                {notification.type === 'info' && (
                  <Info className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <span className="text-neutral-200">{notification.message}</span>
              </div>
              <button
                onClick={clearNotification}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viewport Stage with Strict Role Isolation */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage />
            </motion.div>
          )}

          {activeView === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AuthView />
            </motion.div>
          )}

          {activeView === 'app' && currentUser && (
            <motion.div
              key={`role-${currentUser.role}-${currentUser.producerId || 'root'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Strict Role Isolation: Zero Cross-Role Leakage */}
              {currentUser.role === 'producer' && <ProducerDashboard />}
              {currentUser.role === 'admin' && <AdminDashboard />}
              {currentUser.role === 'reviewer' && <ReviewerDashboard />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <CirculoopProvider>
      <AppContent />
    </CirculoopProvider>
  );
}
