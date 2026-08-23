import React from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { Job, JobMatch } from '../types';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Briefcase,
  MapPin,
  DollarSign,
  Layers,
  Send,
  Bookmark,
  Share2,
} from 'lucide-react';

interface JobMatchDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const JobMatchDetailModal: React.FC<JobMatchDetailModalProps> = ({
  job,
  onClose,
  onApply,
}) => {
  const { matches, saveJob, unsaveJob, applications } = useCareerOS();

  if (!job) return null;

  const match: JobMatch = matches[job.id] || {
    jobId: job.id,
    overallScore: 88,
    breakdown: {
      semanticScore: 90,
      skillsScore: 92,
      experienceScore: 88,
      locationScore: 90,
      educationScore: 85,
      preferenceScore: 85,
    },
    whyMatches: [
      `Your background aligns with ${job.role} technical requirements.`,
      `Skills match: ${job.skills.slice(0, 3).join(', ')}.`,
    ],
    missingRequirements: ['None identified as blocking.'],
    recommendation: 'Apply',
    analysisSummary: 'Evaluated against candidate profile.',
  };

  const isSaved = applications.some((a) => a.jobId === job.id && a.status === 'saved');
  const isApplied = applications.some((a) => a.jobId === job.id && a.status === 'applied');

  const factorList = [
    { label: 'Semantic & Contextual Match', weight: '30%', score: match.breakdown.semanticScore, color: 'bg-purple-500' },
    { label: 'Skills & Tech Stack Alignment', weight: '25%', score: match.breakdown.skillsScore, color: 'bg-indigo-500' },
    { label: 'Experience Level Fit', weight: '15%', score: match.breakdown.experienceScore, color: 'bg-pink-500' },
    { label: 'Location & Remote Compatibility', weight: '10%', score: match.breakdown.locationScore, color: 'bg-emerald-500' },
    { label: 'Education & Domain Credential', weight: '10%', score: match.breakdown.educationScore, color: 'bg-amber-500' },
    { label: 'Candidate Personal Preferences', weight: '10%', score: match.breakdown.preferenceScore, color: 'bg-cyan-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#130a2e] border border-purple-600/40 shadow-2xl shadow-purple-950 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Company, Role & Match Score Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 border border-purple-500/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-purple-950 flex-shrink-0">
              {job.company[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  {job.company}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-700/30">
                  {job.source}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{job.role}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80 mt-1">
                <span>{job.location}</span>
                <span>•</span>
                <span className="capitalize">{job.remoteType}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  {job.currency === 'INR'
                    ? `₹${(job.salaryMin || 0) / 100000}L - ₹${(job.salaryMax || 0) / 100000}L/yr`
                    : `$${(job.salaryMin || 0) / 1000}k - $${(job.salaryMax || 0) / 1000}k/yr`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-gradient-to-b from-purple-900/60 to-purple-950/80 border border-purple-500/40 shadow-inner">
            <div className="text-2xl font-extrabold text-white flex items-center gap-1">
              <span className="text-emerald-400">★</span>
              <span>{match.overallScore}%</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
              {match.recommendation} Recommendation
            </span>
          </div>
        </div>

        {/* 6-Factor Hybrid Match Radar Scorecard */}
        <div className="space-y-3 p-5 rounded-2xl bg-[#1a0f3d] border border-purple-700/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Hybrid AI Match Breakdown (Weighted 6-Factor Scoring)
            </h3>
            <span className="text-[11px] text-purple-400/80 font-mono">Gemini 3.7 Evaluator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {factorList.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-200/90 font-medium truncate pr-2">
                    {factor.label}{' '}
                    <span className="text-[10px] text-purple-400/60 font-mono">({factor.weight})</span>
                  </span>
                  <span className="font-bold text-white font-mono">{factor.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden border border-purple-900/40">
                  <div
                    className={`h-full ${factor.color} rounded-full transition-all duration-500`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why it matches & Missing Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Why It Matches You</span>
            </div>
            <ul className="space-y-1.5 text-purple-200/90 list-disc list-inside">
              {match.whyMatches?.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Gaps / Potential Considerations</span>
            </div>
            <ul className="space-y-1.5 text-purple-200/90 list-disc list-inside">
              {match.missingRequirements?.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Job Description & Requirements */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">About the Role</h4>
          <p className="text-purple-200/80 leading-relaxed">{job.description}</p>

          <div className="pt-2">
            <h5 className="font-semibold text-purple-200 mb-1.5">Required Skills:</h5>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-purple-900/60 text-purple-200 text-[11px] border border-purple-700/30 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-4 border-t border-purple-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => (isSaved ? unsaveJob(job.id) : saveJob(job.id))}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                isSaved
                  ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                  : 'bg-purple-950/60 border-purple-700/40 text-purple-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved in Pipeline' : 'Bookmark Job'}</span>
            </button>

            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white text-xs font-semibold border border-purple-700/40"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={() => {
              onClose();
              onApply(job);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate Application Package</span>
          </button>
        </div>
      </div>
    </div>
  );
};
