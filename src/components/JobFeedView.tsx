import React, { useState, useMemo } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { Job, JobMatch } from '../types';
import { JobMatchDetailModal } from './JobMatchDetailModal';
import { ApplicationGeneratorModal } from './ApplicationGeneratorModal';
import {
  Search,
  Filter,
  Briefcase,
  Sparkles,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Send,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const JobFeedView: React.FC = () => {
  const {
    jobs,
    matches,
    applications,
    saveJob,
    unsaveJob,
    isDiscoveryRunning,
    runBackgroundDiscovery,
    selectedJobForDetail,
    setSelectedJobForDetail,
    selectedJobForApplication,
    setSelectedJobForApplication,
  } = useCareerOS();

  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'new_today' | 'high_match' | 'remote' | 'india' | 'saved'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteFilter, setRemoteFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'salary'>('match');

  const savedJobIds = useMemo(() => {
    return new Set(applications.filter((a) => a.status === 'saved').map((a) => a.jobId));
  }, [applications]);

  const appliedJobIds = useMemo(() => {
    return new Set(applications.filter((a) => a.status !== 'saved').map((a) => a.jobId));
  }, [applications]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const match = matches[job.id] || { overallScore: 80 };

        // Tab filters
        if (activeTab === 'recommended' && match.overallScore < 85) return false;
        if (activeTab === 'high_match' && match.overallScore < 90) return false;
        if (activeTab === 'new_today' && !job.postedAt.includes('hour') && !job.postedAt.includes('now') && !job.postedAt.includes('day')) return false;
        if (activeTab === 'remote' && job.remoteType !== 'remote') return false;
        if (activeTab === 'india' && !job.location.toLowerCase().includes('india') && !job.country.toLowerCase().includes('india')) return false;
        if (activeTab === 'saved' && !savedJobIds.has(job.id)) return false;

        // Remote dropdown filter
        if (remoteFilter !== 'all' && job.remoteType !== remoteFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchRole = job.role.toLowerCase().includes(q);
          const matchLocation = job.location.toLowerCase().includes(q);
          const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchCompany && !matchRole && !matchLocation && !matchSkills) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const matchA = (matches[a.id] || { overallScore: 80 }).overallScore;
        const matchB = (matches[b.id] || { overallScore: 80 }).overallScore;

        if (sortBy === 'match') return matchB - matchA;
        if (sortBy === 'salary') return (b.salaryMax || 0) - (a.salaryMax || 0);
        return 0; // Default order
      });
  }, [jobs, matches, activeTab, remoteFilter, searchQuery, sortBy, savedJobIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Quick Discovery Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalized Job Feed
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-semibold">
              {filteredJobs.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Autonomous agent continuously ingests from Greenhouse, Lever, Workable, and remote platforms.
          </p>
        </div>

        <button
          onClick={runBackgroundDiscovery}
          disabled={isDiscoveryRunning}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isDiscoveryRunning ? 'animate-spin' : ''}`} />
          <span>{isDiscoveryRunning ? 'Scouting Global ATS...' : 'Trigger Live Discovery Cycle'}</span>
        </button>
      </div>

      {/* 2. Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-purple-900/30">
        {[
          { id: 'recommended', label: '⭐ Recommended for You' },
          { id: 'all', label: 'All Jobs' },
          { id: 'high_match', label: '⚡ High Match (90%+)' },
          { id: 'new_today', label: '🔥 New Today' },
          { id: 'remote', label: '🌐 Remote Global' },
          { id: 'india', label: '🇮🇳 India Tech Hubs' },
          { id: 'saved', label: '🔖 Bookmarks' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950'
                  : 'bg-purple-950/40 text-purple-300/80 hover:text-white hover:bg-purple-900/40 border border-purple-800/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-2xl bg-[#140b30] border border-purple-800/30">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, skills (e.g. React 19, TypeScript, Stripe)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white text-xs placeholder:text-purple-400/50 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={remoteFilter}
            onChange={(e) => setRemoteFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-purple-200 text-xs focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Workplaces (Remote & Hybrid)</option>
            <option value="remote">100% Remote Only</option>
            <option value="hybrid">Hybrid Only</option>
            <option value="onsite">On-Site Only</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-purple-200 text-xs focus:outline-none focus:border-purple-400"
          >
            <option value="match">Sort by: AI Match Score</option>
            <option value="salary">Sort by: Highest Compensation</option>
            <option value="newest">Sort by: Most Recently Posted</option>
          </select>
        </div>
      </div>

      {/* 4. Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-purple-950/20 border border-purple-800/30 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-purple-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No job openings found matching your filter</h3>
          <p className="text-xs text-purple-300/70 max-w-md mx-auto">
            Try adjusting your search keywords, switching categories, or triggering a live background discovery cycle.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setRemoteFilter('all');
            }}
            className="px-4 py-2 rounded-full bg-purple-900/60 text-purple-200 text-xs font-semibold hover:bg-purple-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const match: JobMatch = matches[job.id] || {
              overallScore: 84,
              breakdown: { semanticScore: 85, skillsScore: 85, experienceScore: 85, locationScore: 85, educationScore: 85, preferenceScore: 85 },
              whyMatches: [`Skills match: ${job.skills.slice(0, 2).join(', ')}`],
              missingRequirements: ['None blocking'],
              recommendation: 'Apply',
              analysisSummary: '',
            };

            const isSaved = savedJobIds.has(job.id);
            const isApplied = appliedJobIds.has(job.id);

            const scoreColor =
              match.overallScore >= 90
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60'
                : match.overallScore >= 80
                ? 'text-purple-200 border-purple-500/40 bg-purple-900/60'
                : 'text-amber-300 border-amber-500/40 bg-amber-950/60';

            return (
              <div
                key={job.id}
                className="cosmic-card-interactive rounded-3xl p-5 sm:p-6 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-800 via-indigo-900 to-purple-950 border border-purple-500/30 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-950 flex-shrink-0">
                      {job.company[0]}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                            {job.company}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-700/30 font-medium">
                            {job.source}
                          </span>
                          {isApplied && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                              ✓ IN PIPELINE
                            </span>
                          )}
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 hover:text-purple-300 transition-colors">
                          {job.role}
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium">{job.remoteType}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">
                          {job.currency === 'INR'
                            ? `₹${(job.salaryMin || 0) / 100000}L - ₹${(job.salaryMax || 0) / 100000}L/yr`
                            : `$${(job.salaryMin || 0) / 1000}k - $${(job.salaryMax || 0) / 1000}k/yr`}
                        </span>
                        <span>•</span>
                        <span className="text-purple-400/60">{job.postedAt}</span>
                      </div>

                      {/* Why it matches snippet */}
                      {match.whyMatches && match.whyMatches.length > 0 && (
                        <p className="text-xs text-purple-200/90 line-clamp-1 max-w-2xl bg-purple-950/40 px-3 py-1 rounded-xl border border-purple-800/30">
                          💡 <span className="font-semibold text-purple-200">AI Match Signal:</span> {match.whyMatches[0]}
                        </p>
                      )}

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-200 text-[10px] border border-purple-700/30 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Score & Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-purple-900/30">
                    <button
                      onClick={() => setSelectedJobForDetail(job)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-extrabold shadow-sm transition-transform hover:scale-105 ${scoreColor}`}
                      title="Click to view full 6-factor hybrid match breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>{match.overallScore}% MATCH</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => (isSaved ? unsaveJob(job.id) : saveJob(job.id))}
                        className={`p-2 rounded-full border transition-all ${
                          isSaved
                            ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                            : 'bg-purple-950/60 border-purple-700/40 text-purple-400 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-purple-300" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setSelectedJobForDetail(job)}
                        className="px-3 py-2 rounded-full bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-medium border border-purple-700/40"
                      >
                        Breakdown
                      </button>

                      <button
                        onClick={() => setSelectedJobForApplication(job)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match Breakdown Modal */}
      {selectedJobForDetail && (
        <JobMatchDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          onApply={(j) => {
            setSelectedJobForDetail(null);
            setSelectedJobForApplication(j);
          }}
        />
      )}

      {/* Application Generator Modal */}
      {selectedJobForApplication && (
        <ApplicationGeneratorModal
          job={selectedJobForApplication}
          onClose={() => setSelectedJobForApplication(null)}
        />
      )}
    </div>
  );
};
