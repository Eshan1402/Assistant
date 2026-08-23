import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { JobApplication, ApplicationStatus } from '../types';
import {
  Layers,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  FileText,
  Trash2,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const KanbanView: React.FC = () => {
  const {
    applications,
    moveApplication,
    deleteApplication,
    setActiveView,
    addInterview,
  } = useCareerOS();

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [newNote, setNewNote] = useState('');

  const columns: { id: ApplicationStatus; title: string; color: string; badge: string }[] = [
    { id: 'saved', title: 'Saved / Bookmarked', color: 'border-purple-800/40 bg-purple-950/20', badge: 'bg-purple-900 text-purple-300' },
    { id: 'ready', title: 'Ready to Review', color: 'border-indigo-800/40 bg-indigo-950/20', badge: 'bg-indigo-900 text-indigo-300' },
    { id: 'applied', title: 'Applied / Sent', color: 'border-cyan-800/40 bg-cyan-950/20', badge: 'bg-cyan-900 text-cyan-300' },
    { id: 'screening', title: 'Screening Round', color: 'border-amber-800/40 bg-amber-950/20', badge: 'bg-amber-900 text-amber-300' },
    { id: 'interview', title: 'Interviews Scheduled', color: 'border-pink-800/40 bg-pink-950/20', badge: 'bg-pink-900 text-pink-300' },
    { id: 'offer', title: 'Offer Extended', color: 'border-emerald-800/40 bg-emerald-950/20', badge: 'bg-emerald-900 text-emerald-300' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('applicationId');
    if (appId) {
      moveApplication(appId, targetStatus);
    }
  };

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('applicationId', appId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Application Pipeline (Kanban)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-semibold">
              {applications.length} Tracked
            </span>
          </div>
          <p className="text-xs text-purple-300/80 mt-1">
            Real-time status tracking with automated event audit history for every candidate touchpoint.
          </p>
        </div>

        <button
          onClick={() => setActiveView('jobs')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Discover More Roles</span>
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-3xl p-4 border flex flex-col min-h-[550px] transition-colors ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-900/30">
                <h2 className="font-bold text-white text-xs truncate">{col.title}</h2>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${col.badge}`}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => setSelectedApp(app)}
                    className="cosmic-card-interactive rounded-2xl p-4 cursor-pointer space-y-2.5 border-purple-700/40 hover:border-purple-400/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-900/80 border border-purple-600/30 flex items-center justify-center text-white font-bold text-xs">
                          {app.job.company[0]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                            {app.job.company}
                          </p>
                          <h3 className="text-xs font-bold text-white line-clamp-1">
                            {app.job.role}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {app.matchScore}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-purple-300/70 pt-1 border-t border-purple-900/30">
                      <span className="capitalize">{app.submissionMode || 'Assisted'}</span>
                      <span>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Saved'}</span>
                    </div>

                    {/* Quick Move Trigger Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] text-purple-400/60">
                        {app.events.length} events logged
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatusMap: Record<ApplicationStatus, ApplicationStatus> = {
                            discovered: 'ready',
                            saved: 'ready',
                            ready: 'applied',
                            applied: 'screening',
                            screening: 'interview',
                            interview: 'offer',
                            offer: 'offer',
                            rejected: 'saved',
                            withdrawn: 'saved',
                          };
                          moveApplication(app.id, nextStatusMap[app.status]);
                        }}
                        className="p-1 rounded-md bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-[10px] flex items-center gap-1 border border-purple-700/30"
                        title="Move to next pipeline stage"
                      >
                        <span>Advance</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-purple-900/30 rounded-2xl flex items-center justify-center text-center p-3 text-[11px] text-purple-400/40">
                    Drag applications here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Detail Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#130b2e] border border-purple-600/40 shadow-2xl shadow-purple-950 p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-purple-400 hover:text-white hover:bg-purple-900/40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-800 border border-purple-500/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                {selectedApp.job.company[0]}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  {selectedApp.job.company}
                </span>
                <h2 className="text-xl font-bold text-white">{selectedApp.job.role}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80">
                  <span className="capitalize">Stage: <strong>{selectedApp.status.toUpperCase()}</strong></span>
                  <span>•</span>
                  <span>Match: <strong className="text-emerald-400">{selectedApp.matchScore}%</strong></span>
                  <span>•</span>
                  <span>{selectedApp.job.location}</span>
                </div>
              </div>
            </div>

            {/* Change Stage Selector */}
            <div className="p-4 rounded-2xl bg-[#1a0f3d] border border-purple-700/40 space-y-2 text-xs">
              <span className="font-semibold text-purple-200">Move Application Stage:</span>
              <div className="flex flex-wrap gap-2">
                {columns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      moveApplication(selectedApp.id, col.id);
                      setSelectedApp({ ...selectedApp, status: col.id });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedApp.status === col.id
                        ? 'bg-purple-600 text-white font-bold shadow-md'
                        : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/50 border border-purple-800/30'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Event Timeline */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                Audit Trail & Event History
              </h3>

              <div className="space-y-2.5 pl-2 border-l-2 border-purple-800/50">
                {selectedApp.events.map((evt) => (
                  <div key={evt.id} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400 border-2 border-[#130b2e]" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-100">{evt.title}</span>
                      <span className="text-[10px] text-purple-400/70 font-mono">
                        {new Date(evt.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-purple-300/80 text-[11px]">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Cover Letter preview if present */}
            {selectedApp.coverLetter && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-purple-200">Submitted Tailored Cover Letter:</h4>
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/30 text-purple-200/90 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-purple-800/30 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  deleteApplication(selectedApp.id);
                  setSelectedApp(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-950/40 text-red-400 hover:bg-red-900/40 border border-red-800/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Application</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
