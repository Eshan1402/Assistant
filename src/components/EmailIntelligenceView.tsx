import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { CareerEmail } from '../types';
import {
  Mail,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  AlertCircle,
  Send,
  MessageSquare,
  Reply,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const EmailIntelligenceView: React.FC = () => {
  const {
    emails,
    isEmailScanning,
    triggerEmailScan,
    markEmailAsRead,
    profile,
    setActiveView,
  } = useCareerOS();

  const [selectedEmail, setSelectedEmail] = useState<CareerEmail | null>(emails[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [draftReply, setDraftReply] = useState<string>('');
  const [isGeneratingReply, setIsGeneratingReply] = useState<boolean>(false);
  const [copiedReply, setCopiedReply] = useState<boolean>(false);

  const filteredEmails = emails.filter((em) => {
    if (filterCategory === 'all') return true;
    return em.category === filterCategory;
  });

  const handleSelectEmail = (em: CareerEmail) => {
    setSelectedEmail(em);
    markEmailAsRead(em.id);
    setDraftReply('');
  };

  const handleGenerateReply = () => {
    if (!selectedEmail) return;
    setIsGeneratingReply(true);
    setTimeout(() => {
      if (selectedEmail.category === 'interview_invite') {
        setDraftReply(
          `Hi ${selectedEmail.sender},\n\nThank you for reaching out and for your interest in my profile for the ${selectedEmail.company} team!\n\nI would be delighted to connect. I confirm my availability for the proposed session. You can also reach me directly at ${profile.phone || '+91 98765 43210'}.\n\nLooking forward to speaking soon.\n\nBest regards,\n${profile.fullName}`
        );
      } else if (selectedEmail.category === 'offer') {
        setDraftReply(
          `Hi ${selectedEmail.sender},\n\nThank you so much for extending this offer to join ${selectedEmail.company}! I am thrilled and will carefully review the detailed package over the next 24 hours.\n\nBest regards,\n${profile.fullName}`
        );
      } else {
        setDraftReply(
          `Hi ${selectedEmail.sender},\n\nThank you for following up on my application with ${selectedEmail.company}. I remain very enthusiastic about the role and look forward to the next steps!\n\nBest,\n${profile.fullName}`
        );
      }
      setIsGeneratingReply(false);
    }, 600);
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(draftReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inbound Email Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-semibold">
              {emails.filter((e) => !e.isRead).length} Unread
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Real-time monitoring of career communications with automated categorization, priority alerts, and response generation.
          </p>
        </div>

        <button
          onClick={triggerEmailScan}
          disabled={isEmailScanning}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isEmailScanning ? 'animate-spin' : ''}`} />
          <span>{isEmailScanning ? 'Scanning Inbox...' : 'Scan Connected Inbox Now'}</span>
        </button>
      </div>

      {/* Connected Account & Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#150c33] border border-purple-800/30 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-600/30 flex items-center justify-center text-purple-300">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Monitoring: eshanbsaxena@gmail.com</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                OAuth Active
              </span>
            </div>
            <p className="text-purple-300/70 text-[11px]">Filtered exclusively for recruiter domains and applicant portals.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'interview_invite', 'recruiter_inquiry', 'offer', 'status_update'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-purple-950/60 text-purple-300/80 hover:text-white border border-purple-800/30'
              }`}
            >
              {cat === 'all'
                ? 'All'
                : cat === 'interview_invite'
                ? 'Interviews'
                : cat === 'recruiter_inquiry'
                ? 'Inquiries'
                : cat === 'offer'
                ? 'Offers'
                : 'Updates'}
            </button>
          ))}
        </div>
      </div>

      {/* Split Inbox View: Left List, Right Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Email list */}
        <div className="lg:col-span-5 space-y-3">
          {filteredEmails.map((em) => {
            const isSelected = selectedEmail?.id === em.id;
            return (
              <div
                key={em.id}
                onClick={() => handleSelectEmail(em)}
                className={`cosmic-card-interactive rounded-2xl p-4 cursor-pointer space-y-2 border transition-all ${
                  isSelected
                    ? 'bg-[#1e1042] border-purple-400 shadow-md shadow-purple-950'
                    : !em.isRead
                    ? 'bg-[#180d38] border-purple-600/40'
                    : 'bg-[#12082b] border-purple-900/30 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!em.isRead && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    )}
                    <span className="font-bold text-xs text-white">{em.company}</span>
                    <span className="text-[11px] text-purple-300/80">({em.sender})</span>
                  </div>

                  <span className="text-[10px] text-purple-400/70 font-mono">{em.receivedAt}</span>
                </div>

                <h4 className="text-xs font-semibold text-purple-100 line-clamp-1">
                  {em.subject}
                </h4>

                <p className="text-[11px] text-purple-300/70 line-clamp-2 leading-relaxed">
                  {em.snippet}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      em.priority === 'critical'
                        ? 'bg-pink-950 text-pink-300 border border-pink-500/40'
                        : 'bg-purple-950 text-purple-300 border border-purple-700/30'
                    }`}
                  >
                    {em.category.replace('_', ' ')}
                  </span>

                  {em.isActionRequired && (
                    <span className="text-[10px] font-semibold text-amber-300 flex items-center gap-1">
                      ⚡ Action Required
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Email Content Reader & AI Reply Generator */}
        <div className="lg:col-span-7">
          {selectedEmail ? (
            <div className="cosmic-card rounded-3xl p-6 border-purple-700/40 space-y-5">
              {/* Reader Header */}
              <div className="space-y-2 pb-4 border-b border-purple-800/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    {selectedEmail.company}
                  </span>
                  <span className="text-xs text-purple-400 font-mono">
                    Received: {selectedEmail.receivedAt}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">{selectedEmail.subject}</h2>

                <div className="flex items-center justify-between text-xs text-purple-300/80 pt-1">
                  <div>
                    From: <strong className="text-purple-100">{selectedEmail.sender}</strong> ({selectedEmail.senderEmail})
                  </div>
                </div>
              </div>

              {/* Action notice */}
              {selectedEmail.suggestedAction && (
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span><strong>AI Recommendation:</strong> {selectedEmail.suggestedAction}</span>
                  </div>
                  {selectedEmail.category === 'interview_invite' && (
                    <button
                      onClick={() => setActiveView('interviews')}
                      className="px-3 py-1 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-bold"
                    >
                      Prep Interview
                    </button>
                  )}
                </div>
              )}

              {/* Email Body */}
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-100/90 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {selectedEmail.fullText}
              </div>

              {/* AI Reply Generator Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Reply className="w-4 h-4 text-purple-400" />
                    AI Response Assistant
                  </h3>

                  {!draftReply ? (
                    <button
                      onClick={handleGenerateReply}
                      disabled={isGeneratingReply}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-950"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingReply ? 'Crafting Response...' : 'Draft AI Reply'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCopyReply}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs border border-purple-700/40"
                    >
                      {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReply ? 'Copied!' : 'Copy Reply'}</span>
                    </button>
                  )}
                </div>

                {draftReply && (
                  <textarea
                    rows={6}
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-[#180e38] border border-purple-700/40 text-purple-100 text-xs leading-relaxed focus:outline-none focus:border-purple-400"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl bg-purple-950/20 border border-purple-800/30 p-8 text-xs text-purple-400">
              Select an email from the left pane to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
