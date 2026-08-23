import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import {
  Activity,
  Cpu,
  RefreshCw,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const AgentStatusWidget: React.FC = () => {
  const {
    isDiscoveryRunning,
    runBackgroundDiscovery,
    isEmailScanning,
    triggerEmailScan,
    setActiveView,
    jobs,
    applications,
  } = useCareerOS();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 font-sans select-none">
      
      {/* Expanded Quick Telemetry Drawer */}
      {isExpanded && (
        <div className="w-72 sm:w-80 rounded-2xl bg-[#140a30]/95 backdrop-blur-2xl border border-purple-600/40 p-4 shadow-2xl shadow-purple-950/90 text-white animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="flex items-center justify-between pb-2.5 border-b border-purple-800/40">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-chakra font-bold text-xs uppercase tracking-wider text-purple-200">
                Agent Worker Telemetry
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40 font-mono font-bold">
              8/8 ONLINE
            </span>
          </div>

          <div className="py-2.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-purple-300/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ATS Auto-Scanner
              </span>
              <span className="text-[11px] font-mono text-purple-200">
                {isDiscoveryRunning ? 'Active Syncing...' : 'Idle (Listening)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-purple-300/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Recruiter Email AI Watchdog
              </span>
              <span className="text-[11px] font-mono text-purple-200">
                {isEmailScanning ? 'Parsing Inbox...' : 'Monitoring IMAP'}
              </span>
            </div>

            <div className="flex items-center justify-between text-purple-300/90">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Pipeline Matches
              </span>
              <span className="text-[11px] font-mono font-bold text-white">
                {jobs.length} roles indexed
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-purple-800/40 flex items-center gap-2">
            <button
              onClick={async () => {
                await runBackgroundDiscovery();
              }}
              disabled={isDiscoveryRunning}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-700/60 hover:bg-purple-600/80 border border-purple-500/40 text-white text-[11px] font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isDiscoveryRunning ? 'animate-spin' : ''}`} />
              <span>{isDiscoveryRunning ? 'Scanning...' : 'Force Sync'}</span>
            </button>

            <button
              onClick={() => {
                setActiveView('automation');
                setIsExpanded(false);
              }}
              className="py-1.5 px-3 rounded-xl bg-[#1b0d3d] hover:bg-[#251352] border border-purple-700/40 text-purple-200 hover:text-white text-[11px] font-semibold transition-all"
            >
              System Logs
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Status Pill on Right Bottom */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative flex items-center gap-2.5 pl-3 pr-3.5 py-2 rounded-full bg-[#12072b]/90 hover:bg-[#1b0c3d] border border-purple-600/50 hover:border-purple-400/80 backdrop-blur-xl shadow-2xl shadow-purple-950/90 transition-all hover:scale-105 active:scale-95 text-white"
        title="Click to view live agent status & worker telemetry"
      >
        {/* Animated Radar Pulse Rings */}
        <div className="relative flex items-center justify-center w-3 h-3">
          <span className="animate-radar-wave absolute inline-flex h-4 w-4 rounded-full bg-emerald-400/60 pointer-events-none" />
          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        </div>

        {/* Text Status with Cool Cyber / Chakra Font */}
        <div className="flex items-center gap-1.5">
          <span className="font-chakra font-bold text-xs sm:text-xs tracking-wider uppercase text-purple-100 group-hover:text-white transition-colors">
            Agent Active In Background
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-700/40">
            AUTO
          </span>
        </div>

        <ChevronUp
          className={`w-3.5 h-3.5 text-purple-400 group-hover:text-purple-200 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

    </div>
  );
};
