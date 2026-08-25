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
      <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-doraemon-blue text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-doraemon-blue" />
              <span>CareerOS Autonomous Agent Working 24/7</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Good morning, {firstName} <span className="inline-block animate-bounce">👋</span>
            </h1>

            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              Your AI career agent has been continuously scouting jobs, evaluating hybrid semantic matches, and monitoring your email inbox. You have <span className="text-gray-900 font-semibold">{topMatches.length} high-match roles</span> and <span className="text-gray-900 font-semibold">1 technical interview tomorrow</span>.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runBackgroundDiscovery}
              disabled={isDiscoveryRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-doraemon-blue ${isDiscoveryRunning ? 'animate-spin' : ''}`} />
              <span>{isDiscoveryRunning ? 'Scouting Market...' : 'Scout New Jobs'}</span>
            </button>

            <button
              onClick={() => setIsAssistantOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-doraemon-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 border-2 border-white/20"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Ask Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => setActiveView('jobs')}
          className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-doraemon-blue transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discovered Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-doraemon-blue group-hover:bg-doraemon-blue group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{jobs.length}</span>
            <span className="text-[11px] font-bold text-emerald-500">+4 new today</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Across Greenhouse, Lever & ATS</p>
        </div>

        <div
          onClick={() => setActiveView('kanban')}
          className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-doraemon-pink transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Apps</span>
            <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-doraemon-pink group-hover:bg-doraemon-pink group-hover:text-white transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{activeApps.length}</span>
            <span className="text-[11px] font-bold text-doraemon-pink">in tracking</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">1 ready for review</p>
        </div>

        <div
          onClick={() => setActiveView('interviews')}
          className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-doraemon-red transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-doraemon-red group-hover:bg-doraemon-red group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{upcomingInterviewsCount}</span>
            <span className="text-[11px] font-bold text-doraemon-red">Tomorrow 11 AM</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Vercel AI SDK Deep Dive</p>
        </div>

        <div
          onClick={() => setActiveView('kanban')}
          className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:border-doraemon-gold transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offers</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-doraemon-gold group-hover:bg-doraemon-gold group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">{offersCount}</span>
            <span className="text-[11px] font-bold text-emerald-500">Supabase ($175k)</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Reviewing contract</p>
        </div>
      </div>

      {/* 3. Main Split Section: AI Attention Radar & Upcoming Interview Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Recommendations Spotlight */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-doraemon-gold" />
              <h2 className="text-base font-bold text-gray-900">AI Recommendations: High Impact Opportunities</h2>
            </div>
            <button
              onClick={() => setActiveView('jobs')}
              className="text-xs font-bold text-doraemon-blue hover:text-blue-600 flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map(({ job, match }) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-doraemon-blue hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-black text-xl shadow-sm flex-shrink-0">
                    {job.company[0]}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm hover:text-doraemon-blue transition-colors">
                        {job.role}
                      </h3>
                      <span className="text-xs font-bold text-gray-500">@ {job.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 font-medium">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.remoteType.toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">
                        {job.currency === 'INR' ? `₹${(job.salaryMin || 0) / 100000}L - ₹${(job.salaryMax || 0) / 100000}L` : `$${(job.salaryMin || 0) / 1000}k - $${(job.salaryMax || 0) / 1000}k`}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-1 max-w-lg pt-0.5">
                      💡 {match.whyMatches?.[0] || 'Direct overlap with your TypeScript & distributed systems skills.'}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold shadow-sm">
                    <span className="text-emerald-500">★</span>
                    <span>{match.overallScore}% MATCH</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJobForDetail(job);
                        setActiveView('jobs');
                      }}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border-2 border-gray-200 shadow-sm transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedJobForApplication(job);
                      }}
                      className="px-4 py-1.5 rounded-full bg-doraemon-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 border-2 border-white/20"
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
              <Calendar className="w-4 h-4 text-doraemon-red" />
              <h2 className="text-base font-bold text-gray-900">Interview Spotlight</h2>
            </div>
            <button
              onClick={() => setActiveView('interviews')}
              className="text-xs font-bold text-doraemon-blue hover:text-blue-600"
            >
              Prep Room
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-doraemon-red border border-red-200">
                  TOMORROW 11:00 AM IST
                </span>
                <h3 className="font-bold text-gray-900 text-base mt-2">Vercel: AI SDK Team</h3>
                <p className="text-xs text-gray-500 font-medium">Senior Full-Stack Engineer</p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-black border border-gray-200 flex items-center justify-center text-white font-bold shadow-sm">
                ▲
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold text-doraemon-blue">Round & Interviewers:</span>
                <p className="text-gray-900 text-xs font-semibold">Technical Architecture Deep Dive</p>
                <p className="text-[11px] text-gray-600 font-medium">Guillermo Rauch & Sarah Chen</p>
              </div>

              <div className="p-3 rounded-2xl bg-yellow-50 border border-yellow-200 space-y-1">
                <span className="text-[11px] font-bold text-doraemon-gold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-doraemon-gold" />
                  Key AI Talking Point:
                </span>
                <p className="text-[11px] text-gray-800 italic font-medium">
                  "Highlight sub-50ms streaming token buffers in AgentPulse and React 19 server actions."
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('interviews')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-doraemon-pink hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-500/30 transition-all hover:scale-[1.02] active:scale-95 border-2 border-white/20"
            >
              <span>Open AI Interview Briefing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Live Agent Activity Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-700" />
            <h2 className="text-base font-bold text-gray-900">Live System Activity Timeline</h2>
          </div>
          <button
            onClick={() => setActiveView('automation')}
            className="text-xs font-bold text-doraemon-blue hover:text-blue-600 flex items-center gap-1"
          >
            <span>Worker Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm divide-y divide-gray-100">
          {logs.slice(0, 5).map((log, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-medium">
                      {log.workerName}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

