/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import AgentBuilder from './components/AgentBuilder';
import AgentView from './components/AgentView';
import Simulator from './components/Simulator';
import SettingsModal from './components/SettingsModal';
import { useAgentStore } from './store';
import { Toaster } from 'sonner';
import Lenis from 'lenis';
import { Settings } from 'lucide-react';

type View = 'builder' | 'agent' | 'simulator';

export default function App() {
  const [view, setView] = useState<View>('builder');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const currentAgent = useAgentStore((state) => state.currentAgent);

  useEffect(() => {
    const key = localStorage.getItem('groq_api_key');
    if (!key) {
      setIsFirstLoad(true);
      setIsSettingsOpen(true);
    }
  }, []);

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
    setIsFirstLoad(false);
  };

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#1A1C23] font-sans text-slate-900 dark:text-slate-50">
      <header className="bg-white dark:bg-[#252830] border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => setView('builder')}>
            <div className="bg-[#FF6B6B] w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-black dark:text-white font-black text-xl sm:text-2xl leading-none font-display pt-1">M</span>
            </div>
            <span className="font-black font-display text-lg sm:text-2xl tracking-tight inline-block">MerchantAgent</span>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => setView('builder')} 
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-bold transition-all border-2 ${view === 'builder' ? 'bg-[#FFE66D] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              Builder
            </button>
            {currentAgent && (
              <button 
                onClick={() => setView('agent')} 
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-bold transition-all border-2 ${view === 'agent' ? 'bg-[#FFE66D] border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'}`}
              >
                Current Agent
              </button>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 sm:p-2.5 rounded-lg border-2 border-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-2"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {view === 'builder' && (
          <AgentBuilder onGenerated={() => setView('agent')} />
        )}
        {view === 'agent' && (
          <AgentView onSimulate={() => setView('simulator')} />
        )}
        {view === 'simulator' && (
          <Simulator onBack={() => setView('agent')} />
        )}
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={handleSettingsClose} 
        isFirstLoad={isFirstLoad} 
      />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
