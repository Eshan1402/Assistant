import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { Interview } from '../types';
import {
  Calendar,
  Clock,
  Video,
  Sparkles,
  UserCheck,
  HelpCircle,
  MessageSquare,
  Building,
  Plus,
  X,
  ExternalLink,
  Bot,
  Zap,
} from 'lucide-react';

export const InterviewsView: React.FC = () => {
  const {
    interviews,
    addInterview,
    generateInterviewBriefingWithAI,
    profile,
  } = useCareerOS();

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(interviews[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isGeneratingDossier, setIsGeneratingDossier] = useState(false);

  // New interview form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Senior Full-Stack Engineer');
  const [newRound, setNewRound] = useState('Technical Architecture');
  const [newDate, setNewDate] = useState('2026-08-28');
  const [newTime, setNewTime] = useState('14:00');
  const [newMeetingLink, setNewMeetingLink] = useState('https://meet.google.com/xyz-careeros');

  const handleAddInterview = () => {
    if (!newCompany) return;
    addInterview({
      company: newCompany,
      role: newRole,
      round: newRound,
      date: newDate,
      time: newTime + ' IST',
      timezone: 'IST',
      meetingLink: newMeetingLink,
      interviewers: ['Engineering Team Lead'],
      status: 'upcoming',
      prepDossier: {
        companyOverview: `${newCompany} is focused on high-scale developer infrastructure.`,
        predictedQuestions: ['Explain state management in real-time collaboration apps.', 'How do you design zero-downtime database migrations?'],
        tailoredTalkingPoints: ['Discuss AgentPulse architecture', 'Highlight TypeScript strict typing'],
        questionsToAsk: ['What is the current technical debt challenge your team is tackling?'],
        interviewerTips: ['Be structured and start with high-level architecture before drilling down.'],
      },
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interview Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-700/40 text-xs font-semibold">
              {interviews.filter((i) => i.status === 'upcoming').length} Upcoming
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Automated interview detection, calendar synchronization, and custom AI preparation briefings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Grid: Left Upcoming List, Right AI Prep Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interview list */}
        <div className="lg:col-span-4 space-y-3">
          {interviews.map((int) => {
            const isSelected = selectedInterview?.id === int.id;
            return (
              <div
                key={int.id}
                onClick={() => setSelectedInterview(int)}
                className={`cosmic-card-interactive rounded-3xl p-5 cursor-pointer space-y-3 border transition-all ${
                  isSelected
                    ? 'bg-[#201042] border-pink-500/60 shadow-lg shadow-pink-950/40'
                    : 'bg-[#140b2e] border-purple-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-700 to-purple-800 border border-pink-400/30 flex items-center justify-center text-white font-bold text-sm">
                      {int.company[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{int.company}</h3>
                      <p className="text-[11px] text-purple-300/80">{int.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/40">
                    {int.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-purple-200/80 pt-1 border-t border-purple-900/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>{int.date} at {int.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300/70">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    <span>{int.round}</span>
                  </div>
                </div>

                {int.meetingLink && (
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 text-xs font-semibold border border-purple-700/40"
                  >
                    <Video className="w-3.5 h-3.5 text-pink-400" />
                    <span>Join Video Room</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Prep Dossier for selected interview */}
        <div className="lg:col-span-8">
          {selectedInterview ? (
            <div className="cosmic-card rounded-3xl p-6 sm:p-8 border-purple-700/40 space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-800/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-6 h-6 animate-pulse-glow" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 border border-purple-700/40">
                      AI Interview Briefing Dossier
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-1">
                      {selectedInterview.company}: {selectedInterview.round}
                    </h2>
                  </div>
                </div>

                {selectedInterview.meetingLink && (
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md shadow-pink-950"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Google Meet</span>
                  </a>
                )}
              </div>

              {/* Dossier Sections */}
              <div className="space-y-4 text-xs">
                {/* 1. Company Overview */}
                <div className="p-4 rounded-2xl bg-[#190e38] border border-purple-700/40 space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-purple-400" />
                    Company & Engineering Focus
                  </h4>
                  <p className="text-purple-200/90 leading-relaxed">
                    {selectedInterview.prepDossier?.companyOverview}
                  </p>
                </div>

                {/* 2. Predicted Technical Architecture Questions */}
                <div className="p-4 rounded-2xl bg-[#190e38] border border-purple-700/40 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    Predicted Technical Architecture Questions
                  </h4>
                  <ul className="space-y-2 text-purple-200/90">
                    {selectedInterview.prepDossier?.predictedQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-purple-400 font-mono">Q{idx + 1}:</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Tailored Talking Points (Grounded in Candidate Projects) */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Tailored Candidate Talking Points (From Your Profile)
                  </h4>
                  <ul className="space-y-2 text-purple-200/90">
                    {selectedInterview.prepDossier?.tailoredTalkingPoints.map((tp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span className="leading-relaxed">{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Questions to Ask the Interviewer */}
                <div className="p-4 rounded-2xl bg-[#190e38] border border-purple-700/40 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                    High-Signal Questions to Ask Your Interviewers
                  </h4>
                  <ul className="space-y-2 text-purple-200/90">
                    {selectedInterview.prepDossier?.questionsToAsk.map((qa, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-pink-400">?</span>
                        <span>{qa}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Behavioral & Delivery Tips */}
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/30 text-purple-300 text-[11px]">
                  💡 <strong>Interviewer Tips:</strong> {selectedInterview.prepDossier?.interviewerTips?.[0]}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl bg-purple-950/20 border border-purple-800/30 p-8 text-xs text-purple-400">
              No interview selected.
            </div>
          )}
        </div>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#130b2e] border border-purple-600/40 shadow-2xl shadow-purple-950 p-6 space-y-4 text-xs">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-purple-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white">Add Scheduled Interview</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-purple-300 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, Linear, Razorpay"
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Role Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Interview Round</label>
                <input
                  type="text"
                  value={newRound}
                  onChange={(e) => setNewRound(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-purple-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-medium mb-1">Google Meet / Video Link</label>
                <input
                  type="text"
                  value={newMeetingLink}
                  onChange={(e) => setNewMeetingLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-full bg-purple-950 text-purple-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInterview}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
              >
                Schedule & Generate AI Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
