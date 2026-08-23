import React, { useState, useRef, useEffect } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Briefcase,
  Layers,
  Mail,
  Calendar,
  BarChart3,
  Cpu,
  User,
  Sparkles,
  Bot,
  LogOut,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    emails,
    applications,
    isAssistantOpen,
    setIsAssistantOpen,
    isDiscoveryRunning,
    runBackgroundDiscovery,
  } = useCareerOS();

  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showViewSelector, setShowViewSelector] = useState(false);
  const [brandStyle, setBrandStyle] = useState<'unbounded' | 'glitch' | 'bruno' | 'syne'>('unbounded');

  const viewSelectorRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadEmailsCount = emails.filter((e) => !e.isRead).length;
  const activeAppsCount = applications.filter((a) => a.status !== 'rejected' && a.status !== 'withdrawn').length;

  const navItems = [
    { id: 'home', label: 'Home', description: 'Overview & 3D Assistant Pod', icon: Home },
    { id: 'dashboard', label: 'Dashboard', description: 'Real-time Career Intelligence', icon: Sparkles },
    { id: 'jobs', label: 'Jobs', description: 'AI Matched Opportunities', icon: Briefcase },
    { id: 'kanban', label: 'Pipeline', description: 'Application Kanban Board', icon: Layers, badge: activeAppsCount },
    { id: 'emails', label: 'Inbox', description: 'Recruiter Communications', icon: Mail, badge: unreadEmailsCount, badgeColor: 'bg-pink-500' },
    { id: 'interviews', label: 'Interviews', description: 'Prep Dossiers & Mock Prep', icon: Calendar },
    { id: 'analytics', label: 'Analytics', description: 'Funnel & Market Insights', icon: BarChart3 },
    { id: 'automation', label: 'Workers', description: 'Autonomous Background Tasks', icon: Cpu },
  ];

  const currentNav = navItems.find((item) => item.id === activeView) || navItems[0];
  const CurrentIcon = currentNav.icon;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewSelectorRef.current && !viewSelectorRef.current.contains(event.target as Node)) {
        setShowViewSelector(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 backdrop-blur-2xl bg-[#090416]/80 border-b border-purple-900/25 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand with Modern Futuristic Typography & Interactive Style Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-left group transition-all transform active:scale-95 select-none focus:outline-none"
            title="CareerOS Home"
          >
            {brandStyle === 'unbounded' && (
              <div className="flex items-baseline gap-1.5">
                <span className="font-unbounded font-black text-xl sm:text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-200 group-hover:from-pink-200 group-hover:to-cyan-200 transition-all">
                  CAREER
                </span>
                <span className="font-syncopate font-black text-[11px] sm:text-xs px-2 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-lg shadow-purple-950/80 tracking-widest uppercase border border-purple-400/30">
                  OS
                </span>
              </div>
            )}

            {brandStyle === 'glitch' && (
              <div className="flex items-baseline gap-1">
                <span className="font-chakra font-black text-2xl sm:text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300 group-hover:text-pink-400 transition-all glitch-brand uppercase">
                  CAREER
                </span>
                <span className="font-glitch text-2xl sm:text-3xl text-pink-400 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_12px_#ec4899]">
                  OS
                </span>
              </div>
            )}

            {brandStyle === 'bruno' && (
              <div className="flex items-baseline gap-2">
                <span className="font-bruno text-xl sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 uppercase">
                  CAREER
                </span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  [OS]
                </span>
              </div>
            )}

            {brandStyle === 'syne' && (
              <div className="flex items-baseline gap-1.5">
                <span className="font-display-syne font-black text-2xl sm:text-3xl tracking-tight text-white">
                  Career
                </span>
                <span className="font-display-italiana italic text-2xl sm:text-3xl text-pink-400 font-bold">
                  OS
                </span>
              </div>
            )}
          </button>

          {/* Quick cycle button for brand typography styles */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const styles: Array<'unbounded' | 'glitch' | 'bruno' | 'syne'> = ['unbounded', 'glitch', 'bruno', 'syne'];
              const next = styles[(styles.indexOf(brandStyle) + 1) % styles.length];
              setBrandStyle(next);
            }}
            title="Cycle brand font style"
            className="hidden sm:inline-flex p-1 rounded-md bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/30 text-[9px] font-mono text-purple-400 hover:text-purple-200 transition-colors"
          >
            FONT
          </button>
        </div>

        {/* Clean Center: Dropdown Selective Mode for Navigation */}
        <div className="relative" ref={viewSelectorRef}>
          <button
            onClick={() => setShowViewSelector(!showViewSelector)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#140a2e]/90 hover:bg-[#1d0e42] border border-purple-700/40 hover:border-purple-500/80 backdrop-blur-xl shadow-lg shadow-purple-950/40 transition-all active:scale-95 group select-none"
            title="Select View"
          >
            <div className="p-1 rounded-lg bg-purple-600/30 text-purple-300 group-hover:text-white transition-colors">
              <CurrentIcon className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 text-left">
              <span className="font-sans font-semibold text-xs sm:text-sm text-white tracking-wide">
                {currentNav.label}
              </span>
              {currentNav.badge !== undefined && currentNav.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full text-white ${
                    currentNav.badgeColor || 'bg-purple-600'
                  }`}
                >
                  {currentNav.badge}
                </span>
              )}
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-purple-400 group-hover:text-purple-200 transition-transform duration-200 ml-1 ${
                showViewSelector ? 'rotate-180 text-pink-400' : ''
              }`}
            />
          </button>

          {/* Down Selective Menu Dropdown */}
          {showViewSelector && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-72 sm:w-80 rounded-2xl bg-[#120729]/95 border border-purple-600/40 shadow-2xl shadow-purple-950/90 py-2 z-50 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-1.5 border-b border-purple-900/40 flex items-center justify-between text-[11px] font-chakra uppercase tracking-wider text-purple-300/80 font-bold">
                <span>Select Workspace View</span>
                <span className="font-mono text-[10px] text-purple-400/60">8 Sections</span>
              </div>

              <div className="p-1.5 space-y-0.5 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id as any);
                        setShowViewSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-700/80 to-indigo-700/80 text-white font-semibold border border-purple-500/50 shadow-md'
                          : 'text-purple-200/90 hover:bg-purple-900/40 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-950/60 text-purple-400 border border-purple-800/30'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white truncate">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span
                                className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                                  isActive
                                    ? 'bg-white text-purple-900'
                                    : item.badgeColor || 'bg-purple-700 text-purple-100'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-purple-300/60 truncate">{item.description}</p>
                        </div>
                      </div>

                      {isActive && <Check className="w-4 h-4 text-purple-200 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Controls: Assistant Trigger & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Quick Scan */}
          <button
            onClick={runBackgroundDiscovery}
            disabled={isDiscoveryRunning}
            title="Scan Job Boards & ATS"
            className="p-2 rounded-xl bg-[#140a2e]/80 hover:bg-[#1f0e44] border border-purple-700/40 text-purple-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDiscoveryRunning ? 'animate-spin text-pink-400' : ''}`} />
          </button>

          {/* Assistant Modal Trigger Button */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 border border-purple-400/30 transition-all hover:scale-105 active:scale-95"
            title="Open Assistant Console"
          >
            <Bot className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline-block font-semibold">Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-[#140a2e]/80 hover:bg-[#1f0e44] border border-purple-700/40 transition-all hover:border-purple-500"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-6 h-6 rounded-full object-cover border border-purple-400/50"
              />
              <ChevronDown className={`w-3 h-3 text-purple-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#14082e] border border-purple-700/50 shadow-2xl shadow-purple-950/90 py-2 z-50 animate-in fade-in zoom-in-95 backdrop-blur-2xl"
              >
                <div className="px-4 py-2 border-b border-purple-900/50">
                  <p className="text-xs font-bold text-white">{user?.name || 'Eshan Saxena'}</p>
                  <p className="text-[11px] text-purple-400/80 truncate">{user?.email || 'eshanbsaxena@gmail.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-purple-200 hover:bg-purple-900/50 hover:text-white transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>Candidate Profile & Resume</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('automation');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-purple-200 hover:bg-purple-900/50 hover:text-white transition-colors text-left"
                  >
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Worker System & Logs</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-purple-200 hover:bg-purple-900/50 hover:text-white transition-colors text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Automation Safety Rules</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-purple-900/50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
