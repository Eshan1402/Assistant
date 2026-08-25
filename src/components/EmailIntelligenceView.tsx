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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Inbound Email Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-doraemon-red border border-red-200 text-xs font-bold">
              {emails.filter((e) => !e.isRead).length} Unread
            </span>
          </div>
          <p className="text-xs text-gray-600 font-medium mt-1">
            Real-time monitoring of career communications with automated categorization, priority alerts, and response generation.
          </p>
        </div>

        <button
          onClick={triggerEmailScan}
          disabled={isEmailScanning}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-doraemon-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border-2 border-white/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isEmailScanning ? 'animate-spin' : ''}`} />
          <span>{isEmailScanning ? 'Scanning Inbox...' : 'Scan Connected Inbox Now'}</span>
        </button>
      </div>

      {/* Connected Account & Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-gray-200 shadow-sm text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-doraemon-red shadow-sm">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">Monitoring: eshanbsaxena@gmail.com</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                OAuth Active
              </span>
            </div>
            <p className="text-gray-500 font-medium text-[11px]">Filtered exclusively for recruiter domains and applicant portals.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'interview_invite', 'recruiter_inquiry', 'offer', 'status_update'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border-2 ${
                filterCategory === cat
                  ? 'bg-doraemon-blue text-white border-blue-500/20'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
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
                className={`rounded-2xl p-4 cursor-pointer space-y-2 border-2 transition-all shadow-sm ${
                  isSelected
                    ? 'bg-blue-50 border-doraemon-blue'
                    : !em.isRead
                    ? 'bg-white border-gray-200 hover:border-blue-300'
                    : 'bg-gray-50 border-gray-100 opacity-90 hover:opacity-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!em.isRead && (
                      <span className="w-2 h-2 rounded-full bg-doraemon-red animate-pulse" />
                    )}
                    <span className="font-bold text-xs text-gray-900">{em.company}</span>
                    <span className="text-[11px] text-gray-500 font-medium">({em.sender})</span>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono font-medium">{em.receivedAt}</span>
                </div>

                <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                  {em.subject}
                </h4>

                <p className="text-[11px] text-gray-600 font-medium line-clamp-2 leading-relaxed">
                  {em.snippet}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      em.priority === 'critical'
                        ? 'bg-pink-50 text-doraemon-pink border-pink-200'
                        : 'bg-blue-50 text-doraemon-blue border-blue-200'
                    }`}
                  >
                    {em.category.replace('_', ' ')}
                  </span>

                  {em.isActionRequired && (
                    <span className="text-[10px] font-bold text-doraemon-gold flex items-center gap-1">
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
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              {/* Reader Header */}
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {selectedEmail.company}
                  </span>
                  <span className="text-xs text-gray-400 font-mono font-medium">
                    Received: {selectedEmail.receivedAt}
                  </span>
                </div>

                <h2 className="text-lg font-black text-gray-900">{selectedEmail.subject}</h2>

                <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-1">
                  <div>
                    From: <strong className="text-gray-900">{selectedEmail.sender}</strong> ({selectedEmail.senderEmail})
                  </div>
                </div>
              </div>

              {/* Action notice */}
              {selectedEmail.suggestedAction && (
                <div className="p-3 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-between text-xs shadow-sm">
                  <div className="flex items-center gap-2 text-doraemon-gold font-medium">
                    <Sparkles className="w-4 h-4 text-doraemon-gold" />
                    <span><strong className="font-bold">AI Recommendation:</strong> {selectedEmail.suggestedAction}</span>
                  </div>
                  {selectedEmail.category === 'interview_invite' && (
                    <button
                      onClick={() => setActiveView('interviews')}
                      className="px-3 py-1.5 rounded-full bg-doraemon-pink hover:bg-pink-500 text-white text-[11px] font-bold shadow-sm transition-colors border-2 border-white/20"
                    >
                      Prep Interview
                    </button>
                  )}
                </div>
              )}

              {/* Email Body */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-800 font-medium whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {selectedEmail.fullText}
              </div>

              {/* AI Reply Generator Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Reply className="w-4 h-4 text-doraemon-blue" />
                    AI Response Assistant
                  </h3>

                  {!draftReply ? (
                    <button
                      onClick={handleGenerateReply}
                      disabled={isGeneratingReply}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-doraemon-blue hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all active:scale-95 border-2 border-white/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingReply ? 'Crafting Response...' : 'Draft AI Reply'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCopyReply}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold border-2 border-gray-200 shadow-sm transition-colors"
                    >
                      {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedReply ? 'Copied!' : 'Copy Reply'}</span>
                    </button>
                  )}
                </div>

                {draftReply && (
                  <textarea
                    rows={6}
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 text-xs font-medium leading-relaxed focus:outline-none focus:border-doraemon-blue shadow-sm transition-colors"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 text-xs text-gray-500 font-bold p-8 text-center">
              Select an email from the left pane to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

