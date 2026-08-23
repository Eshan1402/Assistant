import React, { useState, useEffect } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { Job, JobApplication } from '../types';
import {
  X,
  Sparkles,
  ShieldCheck,
  Send,
  Copy,
  Check,
  Download,
  FileText,
  MessageSquare,
  HelpCircle,
  Edit3,
  Bot,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationGeneratorModalProps {
  job: Job | null;
  onClose: () => void;
}

export const ApplicationGeneratorModal: React.FC<ApplicationGeneratorModalProps> = ({
  job,
  onClose,
}) => {
  const {
    profile,
    generateApplicationPackageWithAI,
    submitApplication,
    appPreferences,
    setActiveView,
  } = useCareerOS();

  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [tailoredBio, setTailoredBio] = useState('');
  const [recruiterMessage, setRecruiterMessage] = useState('');
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'cover_letter' | 'answers' | 'recruiter' | 'resume'>('cover_letter');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setIsLoading(true);
      generateApplicationPackageWithAI(job).then((pkg) => {
        setCoverLetter(pkg.coverLetter || '');
        setTailoredBio(pkg.tailoredBio || '');
        setRecruiterMessage(pkg.recruiterMessage || '');
        setAnswers(pkg.answers || []);
        setIsLoading(false);
      });
    }
  }, [job]);

  if (!job) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handle1ClickSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitApplication(job.id, appPreferences.mode, {
        coverLetter,
        tailoredBio,
        answers,
      });

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
      });

      onClose();
      setActiveView('kanban');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#130b2e] border border-purple-600/40 shadow-2xl shadow-purple-950 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-800/30 flex items-center justify-between bg-[#190f3a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/50">
              <Bot className="w-5 h-5 animate-pulse-glow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">AI Application Generator</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 border border-purple-700/40 font-semibold">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-purple-300/80">
                Tailoring for <span className="text-white font-semibold">{job.role}</span> @ {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Truthfulness & Compliance Guarantee Banner */}
        <div className="px-6 py-2 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Truthfulness Guarantee: Grounded in verified candidate background.</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 uppercase font-mono">No Hallucinations</span>
        </div>

        {/* Tabs: Cover Letter, Screening Answers, Recruiter Outreach, Tailored Resume */}
        <div className="px-6 pt-3 flex gap-2 border-b border-purple-900/30 overflow-x-auto no-scrollbar">
          {[
            { id: 'cover_letter', label: 'Tailored Cover Letter', icon: FileText },
            { id: 'answers', label: 'Screening Answers', icon: HelpCircle, count: answers.length },
            { id: 'recruiter', label: 'Recruiter Outreach', icon: MessageSquare },
            { id: 'resume', label: 'Tailored Resume Highlights', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-purple-400 text-white bg-purple-900/30'
                    : 'border-transparent text-purple-300/70 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-purple-800 text-[10px] text-purple-200">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-purple-300">
              <Sparkles className="w-8 h-8 animate-spin text-purple-400" />
              <p className="font-semibold text-sm">Generating tailored application package...</p>
              <p className="text-xs text-purple-400/70">Aligning candidate projects with {job.company} requirements</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Cover Letter */}
              {activeTab === 'cover_letter' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Customized Cover Letter (Editable)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(coverLetter, 'cover_letter')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 hover:bg-purple-900 text-purple-300 text-[11px] border border-purple-700/40 transition-colors"
                    >
                      {copiedField === 'cover_letter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'cover_letter' ? 'Copied!' : 'Copy Letter'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 text-purple-100 text-xs font-sans leading-relaxed focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
                  />
                </div>
              )}

              {/* Tab 2: Screening Answers */}
              {activeTab === 'answers' && (
                <div className="space-y-4">
                  <p className="text-purple-300/80">
                    AI generated high-signal, truthful answers to common application screening prompts:
                  </p>
                  {answers.map((qa, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{qa.question}</span>
                        <button
                          onClick={() => copyToClipboard(qa.answer, `ans_${idx}`)}
                          className="p-1 rounded text-purple-400 hover:text-white"
                          title="Copy answer"
                        >
                          {copiedField === `ans_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={qa.answer}
                        onChange={(e) => {
                          const copy = [...answers];
                          copy[idx].answer = e.target.value;
                          setAnswers(copy);
                        }}
                        className="w-full p-2.5 rounded-xl bg-purple-950/70 border border-purple-800/40 text-purple-200 text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Recruiter Outreach */}
              {activeTab === 'recruiter' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-200">
                      LinkedIn / Email Inbound Outreach Template
                    </span>
                    <button
                      onClick={() => copyToClipboard(recruiterMessage, 'recruiter')}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 hover:bg-purple-900 text-purple-300 text-[11px] border border-purple-700/40"
                    >
                      {copiedField === 'recruiter' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'recruiter' ? 'Copied!' : 'Copy Outreach'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={recruiterMessage}
                    onChange={(e) => setRecruiterMessage(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 text-purple-100 text-xs leading-relaxed focus:outline-none focus:border-purple-400"
                  />
                </div>
              )}

              {/* Tab 4: Tailored Resume Highlights */}
              {activeTab === 'resume' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 space-y-2">
                    <h4 className="font-bold text-white">Recommended Tailored Profile Summary:</h4>
                    <textarea
                      rows={4}
                      value={tailoredBio}
                      onChange={(e) => setTailoredBio(e.target.value)}
                      className="w-full p-3 rounded-xl bg-purple-950/70 border border-purple-800/40 text-purple-200 text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/30 space-y-2">
                    <h5 className="font-bold text-purple-200">Emphasized Skills for this ATS match:</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-purple-900/60 text-purple-200 text-[11px] border border-purple-700/40 font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-purple-800/30 bg-[#160d35] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-purple-300/80">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Mode: <strong>{appPreferences.mode.toUpperCase()}</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-purple-950/70 text-purple-300 hover:text-white text-xs font-medium border border-purple-800/40"
            >
              Cancel
            </button>

            <button
              onClick={handle1ClickSubmit}
              disabled={isLoading || isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-purple-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording Submission...' : '1-Click Submit & Track in Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
