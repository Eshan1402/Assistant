import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import {
  Cpu,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Terminal,
  Server,
} from 'lucide-react';

export const AutomationControlView: React.FC = () => {
  const {
    workers,
    logs,
    runBackgroundDiscovery,
    triggerEmailScan,
    isDiscoveryRunning,
    isEmailScanning,
    appPreferences,
    updateAppPreferences,
  } = useCareerOS();

  const [filterWorker, setFilterWorker] = useState<string>('all');

  const filteredLogs = logs.filter((l) => {
    if (filterWorker === 'all') return true;
    return l.workerName.toLowerCase().includes(filterWorker.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Background Automation & Worker Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              8 Workers Healthy
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Autonomous distributed task execution engine handling market ingestion, Gemini semantic matching, and email telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={runBackgroundDiscovery}
            disabled={isDiscoveryRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-600/40 text-purple-200 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiscoveryRunning ? 'animate-spin' : ''}`} />
            <span>Discover Jobs</span>
          </button>

          <button
            onClick={triggerEmailScan}
            disabled={isEmailScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEmailScanning ? 'animate-spin' : ''}`} />
            <span>Sync Mailbox</span>
          </button>
        </div>
      </div>

      {/* Safety & Compliance Card */}
      <div className="p-5 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-sm">Anti-Bot & ATS Compliance Guardrails</h3>
            <p className="text-purple-200/80 leading-relaxed max-w-2xl">
              CareerOS never bypasses CAPTCHAs, never circumvents login protections, respects rate limits, and strictly restricts automated submissions to verified APIs where legally and technically authorized.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-emerald-400 self-end md:self-center">
          <span>STATUS: ENFORCED</span>
          <span>•</span>
          <span>MODE: {appPreferences.mode.toUpperCase()}</span>
        </div>
      </div>

      {/* Worker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="cosmic-card-interactive rounded-3xl p-5 border-purple-800/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">ACTIVE</span>
              </div>
              <span className="text-[10px] text-purple-400/80 font-mono">{worker.interval}</span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">{worker.name}</h4>
              <p className="text-xs text-purple-300/70 mt-1 line-clamp-2">{worker.description}</p>
            </div>

            <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between text-[10px] text-purple-400 font-mono">
              <span>Runs: {worker.totalRuns}</span>
              <span>Errors: {worker.errorCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live System Log Stream */}
      <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/30">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-sm">System Activity & Audit Log</h3>
            <span className="text-xs text-purple-400 font-mono">({filteredLogs.length} events)</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterWorker}
              onChange={(e) => setFilterWorker(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-purple-200 text-xs focus:outline-none"
            >
              <option value="all">All System Workers</option>
              <option value="discovery">Job Discovery</option>
              <option value="matching">AI Matching</option>
              <option value="application">Application Preparation</option>
              <option value="email">Email Monitoring</option>
            </select>
          </div>
        </div>

        {/* Log table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-900/40 text-purple-400 font-mono text-[11px]">
                <th className="pb-2">TASK ID</th>
                <th className="pb-2">TIME</th>
                <th className="pb-2">WORKER</th>
                <th className="pb-2">ACTION & DETAILS</th>
                <th className="pb-2">DURATION</th>
                <th className="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20 font-sans">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-purple-950/30 transition-colors">
                  <td className="py-2.5 font-mono text-purple-400 text-[11px]">{log.taskId}</td>
                  <td className="py-2.5 font-mono text-purple-300/80 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 font-semibold text-purple-200">{log.workerName}</td>
                  <td className="py-2.5 pr-4">
                    <span className="font-semibold text-white">{log.action}: </span>
                    <span className="text-purple-300/80">{log.details}</span>
                  </td>
                  <td className="py-2.5 font-mono text-purple-400/80 text-[11px] whitespace-nowrap">{log.durationMs}ms</td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : log.status === 'running'
                          ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
