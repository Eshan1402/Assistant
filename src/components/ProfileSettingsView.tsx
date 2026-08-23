import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  FileText,
  Briefcase,
  Sliders,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Save,
  Mic,
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    preferences,
    updatePreferences,
    appPreferences,
    updateAppPreferences,
    parseResumeWithAI,
  } = useCareerOS();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'career_prefs' | 'automation_prefs'>('profile');
  const [newSkill, setNewSkill] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      updateProfile({ skills: [...profile.skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skillToRemove) });
  };

  const handleResumeReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
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

  const handleSaveAll = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Profile & Agent Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-semibold">
              Verified Dossier
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Manage your verified professional skills, career filters, and automation autonomy guardrails.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-105 active:scale-95"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-purple-900/30 overflow-x-auto no-scrollbar">
        {[
          { id: 'profile', label: 'Candidate Profile & Experience', icon: User },
          { id: 'career_prefs', label: 'Career Preferences & Targeting', icon: Briefcase },
          { id: 'automation_prefs', label: 'Automation & Safety Rules', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-purple-400 text-white bg-purple-900/30'
                  : 'border-transparent text-purple-300/70 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Resume */}
      {activeTab === 'profile' && (
        <div className="space-y-6 text-xs">
          {/* Resume re-upload banner */}
          <div className="p-5 rounded-3xl bg-[#190e3a] border border-purple-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/70 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Resume Parser & Semantic Embedding</h3>
                <p className="text-purple-300/80 text-xs mt-0.5">
                  Upload an updated CV to trigger instant Gemini AI structured re-parsing.
                </p>
              </div>
            </div>

            <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-950/80 hover:bg-purple-900 border border-purple-600/40 text-purple-200 font-semibold transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>{isParsing ? 'AI Parsing...' : 'Re-Upload Resume (PDF/TXT)'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleResumeReupload}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic Info */}
          <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-4">
            <h3 className="text-base font-bold text-white">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => updateProfile({ fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Primary Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => updateProfile({ phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Location & Country</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-purple-300 font-medium mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => updateProfile({ headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-purple-300 font-medium mb-1">Executive Summary / Bio</label>
                <textarea
                  rows={3}
                  value={profile.summary}
                  onChange={(e) => updateProfile({ summary: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Verified Skills & Tech Stack */}
          <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Verified Technical Skills ({profile.skills.length})</h3>
              <span className="text-purple-400 text-[11px]">Used for ATS match evaluation</span>
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add skill (e.g. Next.js, Redis, Rust)..."
                className="flex-1 px-4 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-200 border border-purple-700/40 text-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience List */}
          <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-4">
            <h3 className="text-base font-bold text-white">Work History & Experience</h3>
            <div className="space-y-3">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                      <p className="text-purple-300/80 font-medium">{exp.company} • {exp.location}</p>
                    </div>
                    <span className="text-[11px] text-purple-400 font-mono">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="space-y-1 text-purple-200/90 list-disc list-inside text-xs">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Career Preferences */}
      {activeTab === 'career_prefs' && (
        <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-5 text-xs">
          <h3 className="text-base font-bold text-white">Job Discovery & Targeting Criteria</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-300 font-medium mb-1">Target Roles / Job Titles</label>
              <input
                type="text"
                value={preferences.targetTitles.join(', ')}
                onChange={(e) =>
                  updatePreferences({
                    targetTitles: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-purple-300 font-medium mb-1">Remote Working Preference</label>
              <select
                value={preferences.remotePreference}
                onChange={(e) => updatePreferences({ remotePreference: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none"
              >
                <option value="remote">100% Remote (Global & Regional)</option>
                <option value="hybrid">Hybrid (Flexible Office)</option>
                <option value="onsite">On-Site</option>
                <option value="any">Open to All</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300 font-medium mb-1">Minimum Base Salary Requirement</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={preferences.minSalary}
                  onChange={(e) => updatePreferences({ minSalary: Number(e.target.value) })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none"
                />
                <select
                  value={preferences.currency}
                  onChange={(e) => updatePreferences({ currency: e.target.value })}
                  className="w-24 px-2 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-300 font-medium mb-1">Target Geographies & Cities</label>
              <input
                type="text"
                value={preferences.targetCountries.join(', ')}
                onChange={(e) =>
                  updatePreferences({
                    targetCountries: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-purple-300 font-medium mb-1">Dream / Preferred Target Companies</label>
              <input
                type="text"
                value={preferences.preferredCompanies.join(', ')}
                onChange={(e) =>
                  updatePreferences({
                    preferredCompanies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Automation Preferences */}
      {activeTab === 'automation_prefs' && (
        <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-6 text-xs">
          <h3 className="text-base font-bold text-white">Application Autonomy & Safety Parameters</h3>

          {/* Autonomy mode picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => updateAppPreferences({ mode: 'manual' })}
              className={`p-4 rounded-2xl border cursor-pointer ${
                appPreferences.mode === 'manual'
                  ? 'bg-purple-900/40 border-purple-400'
                  : 'bg-purple-950/30 border-purple-800/40'
              }`}
            >
              <div className="font-bold text-white text-xs mb-1">Mode 1: Manual Only</div>
              <p className="text-[11px] text-purple-300/70">
                You receive links and tailored assets, but manually click submit on every external ATS portal.
              </p>
            </div>

            <div
              onClick={() => updateAppPreferences({ mode: 'assisted' })}
              className={`p-4 rounded-2xl border cursor-pointer ${
                appPreferences.mode === 'assisted'
                  ? 'bg-purple-900/40 border-purple-400 ring-1 ring-purple-400'
                  : 'bg-purple-950/30 border-purple-800/40'
              }`}
            >
              <div className="font-bold text-white text-xs mb-1">Mode 2: Assisted (Recommended)</div>
              <p className="text-[11px] text-purple-300/70">
                AI prepares the tailored package; you click 1 review button before submission is recorded.
              </p>
            </div>

            <div
              onClick={() => updateAppPreferences({ mode: 'authorized_auto' })}
              className={`p-4 rounded-2xl border cursor-pointer ${
                appPreferences.mode === 'authorized_auto'
                  ? 'bg-purple-900/40 border-purple-400'
                  : 'bg-purple-950/30 border-purple-800/40'
              }`}
            >
              <div className="font-bold text-white text-xs mb-1">Mode 3: Authorized Auto</div>
              <p className="text-[11px] text-purple-300/70">
                Automated submission strictly restricted to authorized API endpoints matching your minimum match threshold.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-purple-300 font-medium mb-1">
                Minimum Match Score for Action: {appPreferences.minMatchScore}%
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
              <label className="block text-purple-300 font-medium mb-1">
                Daily Submissions Ceiling: {appPreferences.dailyApplicationLimit} apps/day
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

          {/* Voice Assistant Toggle */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-bold text-white">Interactive Voice AI Assistant</h4>
                <p className="text-[11px] text-purple-300/70">
                  Allow natural voice speech recognition and audio speech synthesis responses.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                updateAppPreferences({
                  voiceAssistantEnabled: !appPreferences.voiceAssistantEnabled,
                })
              }
              className={`px-4 py-1.5 rounded-full font-bold transition-colors ${
                appPreferences.voiceAssistantEnabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-950 text-purple-400 border border-purple-800'
              }`}
            >
              {appPreferences.voiceAssistantEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
