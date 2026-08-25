import React from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  PieChart,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { jobs, applications, profile, matches } = useCareerOS();

  const totalDiscovered = jobs.length;
  const appliedCount = applications.filter((a) => a.status === 'applied').length;
  const screeningCount = applications.filter((a) => a.status === 'screening').length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const offerCount = applications.filter((a) => a.status === 'offer').length;

  const funnelStages = [
    { label: 'Discovered', count: totalDiscovered, pct: 100, color: 'bg-doraemon-blue' },
    { label: 'Applications Sent', count: appliedCount + screeningCount + interviewCount + offerCount, pct: 75, color: 'bg-blue-400' },
    { label: 'Screening Passed', count: screeningCount + interviewCount + offerCount, pct: 42, color: 'bg-doraemon-pink' },
    { label: 'Technical Interviews', count: interviewCount + offerCount, pct: 28, color: 'bg-doraemon-gold' },
    { label: 'Offers Received', count: offerCount, pct: 14, color: 'bg-emerald-500' },
  ];

  const candidateSkills = new Set(profile.skills.map((s) => s.toLowerCase()));

  // Collect market skills demand
  const skillCounts: Record<string, number> = {};
  jobs.forEach((j) => {
    j.skills.forEach((s) => {
      skillCounts[s] = (skillCounts[s] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Market Intelligence & Pipeline Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-doraemon-blue border border-blue-200 text-xs font-bold">
            Real-time Telemetry
          </span>
        </div>
        <p className="text-xs text-gray-600 font-medium mt-1">
          Deep telemetry across application conversion rates, compensation benchmarks, and market skill demands.
        </p>
      </div>

      {/* AI Market Insight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-doraemon-blue uppercase tracking-wider">High Impact Signal</span>
            <Sparkles className="w-4 h-4 text-doraemon-blue" />
          </div>
          <p className="text-sm font-bold text-gray-900 leading-snug">
            Full-Stack + AI SDK applications generate 2.4× higher recruiter response rates
          </p>
          <p className="text-xs text-gray-600 font-medium">
            Postings citing Gemini/LLM APIs and React 19 show 40% faster interview cycles.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Compensation Trend</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-gray-900 leading-snug">
            Senior Remote Global Roles Averaging $185,000 / ₹52 LPA
          </p>
          <p className="text-xs text-gray-600 font-medium">
            Your current minimum requirement filter is within top 15% market tier.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-yellow-50 border border-yellow-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-doraemon-gold uppercase tracking-wider">Conversion Velocity</span>
            <Zap className="w-4 h-4 text-doraemon-gold" />
          </div>
          <p className="text-sm font-bold text-gray-900 leading-snug">
            Average 4.2 Days from Application to Recruiter Call
          </p>
          <p className="text-xs text-gray-600 font-medium">
            Tailored applications perform 3.1× better than generic ATS submissions.
          </p>
        </div>
      </div>

      {/* Conversion Funnel & Skill Alignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-doraemon-blue" />
              Application Conversion Funnel
            </h3>
            <span className="text-xs font-bold text-emerald-600">14.2% Total Offer Conversion</span>
          </div>

          <div className="space-y-4 text-xs">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">{stage.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-gray-900">{stage.count}</span>
                    <span className="text-[10px] text-gray-500 font-bold">({stage.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(stage.pct, 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top In-Demand Skills vs Profile */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-doraemon-gold" />
              Market Skill Demand vs. Profile
            </h3>
            <span className="text-xs text-gray-500 font-bold font-mono">Target Job Frequency</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {topSkills.map(([skill, count], idx) => {
              const hasSkill = candidateSkills.has(skill.toLowerCase());
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                    hasSkill
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      {hasSkill ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="font-bold text-gray-900 truncate">{skill}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">
                      In {count} of {jobs.length} postings
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      hasSkill
                        ? 'bg-white text-emerald-700 border-emerald-200'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {hasSkill ? 'Mastered' : 'Growth Area'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 text-xs text-gray-800 flex items-start gap-2 shadow-sm">
            <Lightbulb className="w-4 h-4 text-doraemon-gold flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              Adding <strong className="font-bold">Distributed WebAssembly (Rust/Wasm)</strong> or <strong className="font-bold">gRPC microservices</strong> to your project portfolio would increase your top match score from 94% to 98% across Vercel & Postman roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
