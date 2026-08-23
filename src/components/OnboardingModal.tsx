import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  FileText,
  Sparkles,
  Briefcase,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Bot,
  ShieldCheck,
  Globe,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const { isOnboarded, completeOnboarding } = useAuth();
  const {
    profile,
    updateProfile,
    preferences,
    updatePreferences,
    appPreferences,
    updateAppPreferences,
    parseResumeWithAI,
    runBackgroundDiscovery,
  } = useCareerOS();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState('');

  if (isOnboarded) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    // Read text from file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
        setIsParsing(true);
        try {
          await parseResumeWithAI(text);
        } finally {
          setIsParsing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSampleResume = async () => {
    setFileName('Eshan_Saxena_Senior_Engineer_Resume.pdf');
    const sampleText = `Eshan Saxena
eshanbsaxena@gmail.com | +91 98765 43210 | Bengaluru, India
Senior Full-Stack & AI Systems Engineer

Summary:
5+ years experience building scalable React 19, TypeScript, Node.js, and PostgreSQL distributed systems. Creator of AgentPulse LLM observability platform.

Experience:
Senior Full-Stack Engineer, Aether Technologies (2022 - Present)
- Architected real-time WebSocket collaboration engine handling 40k+ users.
- Built microservices in Node.js & PostgreSQL, dropping latency by 42%.

Education:
B.Tech in Computer Science, National Institute of Technology (2016 - 2020)

Skills:
TypeScript, React, Node.js, Next.js, PostgreSQL, Redis, Python, Docker, GenAI & LLMs, Tailwind CSS`;

    setResumeText(sampleText);
    setIsParsing(true);
    try {
      await parseResumeWithAI(sampleText);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFinish = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
    runBackgroundDiscovery();
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#130b2e] border border-purple-600/40 shadow-2xl shadow-purple-950 p-6 sm:p-8">
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Progress header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-900/50">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Setup Your CareerOS Agent</h2>
              <p className="text-xs text-purple-300/70">Personalized Autonomous Job Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-purple-500' : step > s ? 'w-4 bg-emerald-500' : 'w-4 bg-purple-950'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Step 1: Upload Your Professional Resume
              </h3>
              <p className="text-xs text-purple-300/80">
                CareerOS AI analyzes your experience, projects, and technologies to construct your semantic candidate embedding.
              </p>
            </div>

            {/* Dropzone */}
            <div className="relative border-2 border-dashed border-purple-700/50 hover:border-purple-500/80 rounded-2xl p-6 text-center bg-purple-950/30 transition-all">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-900/50 flex items-center justify-center text-purple-300">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">
                  {fileName ? fileName : 'Drop your resume (PDF, DOCX, TXT) here or click to browse'}
                </p>
                <p className="text-xs text-purple-400/60">Supports ATS formatting, multi-page CVs, and portfolios</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleSampleResume}
                className="text-purple-300 hover:text-white underline underline-offset-4"
              >
                Use sample Senior Full-Stack Resume
              </button>

              {isParsing && (
                <div className="flex items-center gap-2 text-purple-300">
                  <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Gemini AI is parsing resume...</span>
                </div>
              )}
            </div>

            {/* Extracted preview */}
            {profile.skills.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#1a0f3d] border border-purple-700/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-200">
                    ✓ Parsed Candidate: {profile.fullName}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">100% Extracted</span>
                </div>
                <p className="text-purple-300/70 text-[11px] line-clamp-1">{profile.headline}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.skills.slice(0, 8).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 text-[10px] border border-purple-700/30"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 8 && (
                    <span className="text-[10px] text-purple-400 self-center">
                      +{profile.skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
              >
                <span>Continue to Career Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Career Preferences */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                Step 2: Career & Opportunity Preferences
              </h3>
              <p className="text-purple-300/80">
                Specify your desired job titles, remote preferences, target geographies, and compensation floor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              <div>
                <label className="block text-purple-300 font-medium mb-1">Target Job Titles (comma separated)</label>
                <input
                  type="text"
                  value={preferences.targetTitles.join(', ')}
                  onChange={(e) =>
                    updatePreferences({
                      targetTitles: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Remote Preference</label>
                <select
                  value={preferences.remotePreference}
                  onChange={(e) => updatePreferences({ remotePreference: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="remote">100% Remote (Global & Regional)</option>
                  <option value="hybrid">Hybrid (Flexible Office)</option>
                  <option value="onsite">On-Site Only</option>
                  <option value="any">Any / Open to All</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Minimum Annual Salary</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={preferences.minSalary}
                    onChange={(e) => updatePreferences({ minSalary: Number(e.target.value) })}
                    className="flex-1 px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                  />
                  <select
                    value={preferences.currency}
                    onChange={(e) => updatePreferences({ currency: e.target.value })}
                    className="w-20 px-2 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Experience Level</label>
                <select
                  value={preferences.experienceLevel}
                  onChange={(e) => updatePreferences({ experienceLevel: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-4 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                  <option value="lead">Lead / Staff / Principal</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-purple-300 font-medium mb-1">Target Countries & Hubs</label>
                <input
                  type="text"
                  value={preferences.targetCountries.join(', ')}
                  onChange={(e) =>
                    updatePreferences({
                      targetCountries: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-purple-300 font-medium mb-1">Dream / Preferred Companies</label>
                <input
                  type="text"
                  value={preferences.preferredCompanies.join(', ')}
                  onChange={(e) =>
                    updatePreferences({
                      preferredCompanies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-950/60 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-900/50"
              >
                <span>Application Mode & Safety</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Application Mode & Safety Limits */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in text-xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Step 3: Application Automation & Safety Rules
              </h3>
              <p className="text-purple-300/80">
                Configure your autonomy mode. Defaults to <strong>Human Approval (Assisted)</strong> until you explicitly authorize automation.
              </p>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => updateAppPreferences({ mode: 'manual' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  appPreferences.mode === 'manual'
                    ? 'bg-purple-900/40 border-purple-400 shadow-md shadow-purple-950'
                    : 'bg-purple-950/30 border-purple-800/40 hover:border-purple-700'
                }`}
              >
                <div className="font-bold text-white text-xs mb-1">Mode 1: Manual</div>
                <p className="text-[11px] text-purple-300/70">
                  CareerOS prepares links and official portals. You manually fill and submit.
                </p>
              </div>

              <div
                onClick={() => updateAppPreferences({ mode: 'assisted' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  appPreferences.mode === 'assisted'
                    ? 'bg-purple-900/40 border-purple-400 shadow-md shadow-purple-950 ring-1 ring-purple-400'
                    : 'bg-purple-950/30 border-purple-800/40 hover:border-purple-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">Mode 2: Assisted</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-600 text-white font-bold">RECOMMENDED</span>
                </div>
                <p className="text-[11px] text-purple-300/70">
                  AI drafts tailored resume, cover letter & answers. You do a 1-click review & submit.
                </p>
              </div>

              <div
                onClick={() => updateAppPreferences({ mode: 'authorized_auto' })}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  appPreferences.mode === 'authorized_auto'
                    ? 'bg-purple-900/40 border-purple-400 shadow-md shadow-purple-950'
                    : 'bg-purple-950/30 border-purple-800/40 hover:border-purple-700'
                }`}
              >
                <div className="font-bold text-white text-xs mb-1">Mode 3: Authorized Auto</div>
                <p className="text-[11px] text-purple-300/70">
                  Submits automatically only for matching ATS APIs (Lever/Greenhouse) where legally permitted.
                </p>
              </div>
            </div>

            {/* Safety limits */}
            <div className="p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety & Truthfulness Guardrails</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-purple-300/80 mb-1">
                    Minimum Match Score for Action ({appPreferences.minMatchScore}%)
                  </label>
                  <input
                    type="range"
                    min={60}
                    max={95}
                    value={appPreferences.minMatchScore}
                    onChange={(e) => updateAppPreferences({ minMatchScore: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-purple-300/80 mb-1">
                    Daily Application Limit ({appPreferences.dailyApplicationLimit} apps/day)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={appPreferences.dailyApplicationLimit}
                    onChange={(e) => updateAppPreferences({ dailyApplicationLimit: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] text-purple-300/80">
                  AI will NEVER invent degrees, certifications, companies, or fake work experience.
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-950/60 text-purple-300 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-purple-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-purple-950 transition-all hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Launch Autonomous Career Agent</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
