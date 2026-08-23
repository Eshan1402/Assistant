import React from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Briefcase,
  Layers,
  Calendar,
  Award,
  ArrowRight,
  TrendingUp,
  Mail,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    jobs,
    matches,
    applications,
    emails,
    interviews,
    logs,
    setActiveView,
    setSelectedJobForDetail,
    setSelectedJobForApplication,
    runBackgroundDiscovery,
    isDiscoveryRunning,
    setIsAssistantOpen,
  } = useCareerOS();

  const { user } = useAuth();

  const firstName = (user?.name || profile.fullName || 'Eshan').split(' ')[0];

  // Top high match jobs (>90%)
  const topMatches = jobs
    .map((j) => ({ job: j, match: matches[j.id] || { overallScore: 85 } }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore)
    .slice(0, 3);

  const activeApps = applications.filter((a) => a.status !== 'rejected' && a.status !== 'withdrawn');
  const offersCount = applications.filter((a) => a.status === 'offer').length;
  const upcomingInterviewsCount = interviews.filter((i) => i.status === 'upcoming').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Autonomous Agent Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b103f] via-[#160d33] to-[#12082b] border border-purple-700/40 p-6 sm:p-8 shadow-2xl shadow-purple-950">
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>CareerOS Autonomous Agent Working 24/7</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Good morning, {firstName} <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              Your AI career agent has been continuously scouting jobs, evaluating hybrid semantic matches, and monitoring your email inbox. You have <span className="text-white font-semibold">{topMatches.length} high-match roles</span> and <span className="text-white font-semibold">1 technical interview tomorrow</span>.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runBackgroundDiscovery}
              disabled={isDiscoveryRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-950/70 hover:bg-purple-900/80 border border-purple-600/40 text-purple-200 text-xs font-semibold shadow-md shadow-purple-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isDiscoveryRunning ? 'animate-spin' : ''}`} />
              <span>{isDiscoveryRunning ? 'Scouting Market...' : 'Scout New Jobs'}</span>
            </button>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 border border-purple-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>Ask Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => setActiveView('jobs')}
          className="cosmic-card-interactive rounded-3xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300/80">Discovered Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-purple-300 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{jobs.length}</span>
            <span className="text-[11px] font-semibold text-emerald-400">+4 new today</span>
          </div>
          <p className="text-[11px] text-purple-400/60 mt-1">Across Greenhouse, Lever & ATS</p>
        </div>

        <div
          onClick={() => setActiveView('kanban')}
          className="cosmic-card-interactive rounded-3xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300/80">Active Applications</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center text-indigo-300 group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{activeApps.length}</span>
            <span className="text-[11px] font-semibold text-purple-300">in tracking</span>
          </div>
          <p className="text-[11px] text-purple-400/60 mt-1">1 ready for review</p>
        </div>

        <div
          onClick={() => setActiveView('interviews')}
          className="cosmic-card-interactive rounded-3xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300/80">Upcoming Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-pink-900/50 border border-pink-700/40 flex items-center justify-center text-pink-300 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{upcomingInterviewsCount}</span>
            <span className="text-[11px] font-semibold text-pink-300">Tomorrow 11 AM</span>
          </div>
          <p className="text-[11px] text-purple-400/60 mt-1">Vercel AI SDK Deep Dive</p>
        </div>

        <div
          onClick={() => setActiveView('kanban')}
          className="cosmic-card-interactive rounded-3xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300/80">Offers Received</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-900/50 border border-emerald-700/40 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{offersCount}</span>
            <span className="text-[11px] font-semibold text-emerald-400">Supabase ($175k)</span>
          </div>
          <p className="text-[11px] text-purple-400/60 mt-1">Reviewing contract</p>
        </div>
      </div>

      {/* 3. Main Split Section: AI Attention Radar & Upcoming Interview Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations Spotlight */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white">AI Recommendations: High Impact Opportunities</h2>
            </div>
            <button
              onClick={() => setActiveView('jobs')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map(({ job, match }) => (
              <div
                key={job.id}
                className="cosmic-card-interactive rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-900 border border-purple-500/30 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                    {job.company[0]}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white text-sm hover:text-purple-300 transition-colors">
                        {job.role}
                      </h3>
                      <span className="text-xs font-semibold text-purple-300">@ {job.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/70">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.remoteType.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        {job.currency === 'INR' ? `₹${(job.salaryMin || 0) / 100000}L - ₹${(job.salaryMax || 0) / 100000}L` : `$${(job.salaryMin || 0) / 1000}k - $${(job.salaryMax || 0) / 1000}k`}
                      </span>
                    </div>

                    <p className="text-xs text-purple-200/80 line-clamp-1 max-w-lg pt-0.5">
                      💡 {match.whyMatches?.[0] || 'Direct overlap with your TypeScript & distributed systems skills.'}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-purple-900/30">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/70 border border-purple-500/40 text-purple-200 text-xs font-extrabold shadow-sm">
                    <span className="text-emerald-400">★</span>
                    <span>{match.overallScore}% MATCH</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobForDetail(job);
                        setActiveView('jobs');
                      }}
                      className="px-3 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-medium border border-purple-800/40"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobForApplication(job);
                      }}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Tomorrow's Interview Spotlight */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-400" />
              <h2 className="text-base font-bold text-white">Interview Spotlight</h2>
            </div>
            <button
              onClick={() => setActiveView('interviews')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Prep Room
            </button>
          </div>

          <div className="cosmic-card rounded-3xl p-5 border-purple-500/40 bg-gradient-to-b from-[#1c0e3d] to-[#140a2c] space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/40">
                  TOMORROW 11:00 AM IST
                </span>
                <h3 className="font-bold text-white text-base mt-2">Vercel: AI SDK Team</h3>
                <p className="text-xs text-purple-300/80">Senior Full-Stack Engineer</p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center justify-center text-white font-bold">
                ▲
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-700/30 space-y-1">
                <span className="text-[11px] font-semibold text-purple-300">Round & Interviewers:</span>
                <p className="text-purple-100 text-xs">Technical Architecture Deep Dive</p>
                <p className="text-[11px] text-purple-400">Guillermo Rauch & Sarah Chen</p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-700/30 space-y-1">
                <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Key AI Talking Point:
                </span>
                <p className="text-[11px] text-purple-200/90 italic">
                  "Highlight sub-50ms streaming token buffers in AgentPulse and React 19 server actions."
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('interviews')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Open AI Interview Briefing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Live Agent Activity Timeline (Section 21 & Section 18) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h2 className="text-base font-bold text-white">Live System Activity Timeline</h2>
          </div>
          <button
            onClick={() => setActiveView('automation')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Worker Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="cosmic-card rounded-3xl p-5 border-purple-800/30 divide-y divide-purple-900/30">
          {logs.slice(0, 5).map((log, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-purple-950/80 border border-purple-700/40 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/30">
                      {log.workerName}
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-400/60 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-purple-300/70 mt-0.5">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
