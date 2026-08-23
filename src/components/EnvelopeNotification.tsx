import React from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { Mail, X, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const EnvelopeNotification: React.FC = () => {
  const { activeEnvelope, dismissEnvelope, openEnvelope } = useCareerOS();

  if (!activeEnvelope) return null;

  const isCritical = activeEnvelope.priority === 'critical' || activeEnvelope.category === 'interview_invite' || activeEnvelope.category === 'offer';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-8 duration-300">
      <div
        className={`relative overflow-hidden rounded-3xl p-5 shadow-2xl backdrop-blur-2xl border ${
          isCritical
            ? 'bg-[#1e103f]/95 border-purple-500/50 shadow-purple-900/60'
            : 'bg-[#140b2e]/95 border-purple-800/40 shadow-black/60'
        }`}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={dismissEnvelope}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated envelope icon banner */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 animate-envelope border border-purple-400/40">
              <Mail className="w-6 h-6" />
            </div>
            {isCritical && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500 border-2 border-[#1e103f]"></span>
              </span>
            )}
          </div>

          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  activeEnvelope.category === 'offer'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : activeEnvelope.category === 'interview_invite'
                    ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                }`}
              >
                {activeEnvelope.category === 'interview_invite'
                  ? '⚡ Interview Invitation'
                  : activeEnvelope.category === 'offer'
                  ? '🎉 Job Offer Letter'
                  : '✉ Recruiter Email'}
              </span>
              <span className="text-[11px] text-purple-300/60 font-medium">
                {activeEnvelope.receivedAt}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white leading-snug line-clamp-1">
              {activeEnvelope.company}: {activeEnvelope.sender}
            </h4>

            <p className="text-xs text-purple-200/80 mt-1 line-clamp-2 leading-relaxed">
              "{activeEnvelope.snippet}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-purple-800/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI matched to pipeline</span>
          </div>

          <button
            onClick={() => openEnvelope(activeEnvelope)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 border border-purple-400/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>View Email</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
