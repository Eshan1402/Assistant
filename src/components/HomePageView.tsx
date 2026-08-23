import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { ThreeAssistantAvatar } from './ThreeAssistantAvatar';
import {
  Briefcase,
  Layers,
  ArrowRight,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Calendar,
  Mail,
  Compass,
} from 'lucide-react';

export const HomePageView: React.FC = () => {
  const {
    jobs,
    matches,
    applications,
    emails,
    interviews,
    setActiveView,
    sendAssistantMessage,
    runBackgroundDiscovery,
  } = useCareerOS();

  const userName = 'Eshan';

  // Assistant State
  const [assistantMood, setAssistantMood] = useState<'idle' | 'speaking' | 'thinking' | 'alert'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState<string>(
    `Welcome back, ${userName}. Your pipeline is fully synchronized and running autonomously.`
  );
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Font Style Theme Pairings for the Hero Text
  const [fontTheme, setFontTheme] = useState<'chakra-glitch' | 'editorial-syne' | 'italiana-orbitron' | 'outfit-space'>('chakra-glitch');

  // Trigger speech
  const speakText = (text: string) => {
    setSpeechText(text);
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 260));
      utterance.rate = 1.05;
      utterance.pitch = 1.02;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setAssistantMood('speaking');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setAssistantMood('idle');
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setAssistantMood('idle');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setAssistantMood('speaking');
      setTimeout(() => {
        setIsSpeaking(false);
        setAssistantMood('idle');
      }, 3000);
    }
  };

  // Assistant Chat submit
  const handleAssistantSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    setInputText('');
    setAssistantMood('thinking');
    setIsSpeaking(false);

    try {
      await sendAssistantMessage(query);
      if (query.toLowerCase().includes('job') || query.toLowerCase().includes('match')) {
        speakText(`You currently have ${jobs.length} curated opportunities in your pipeline, with 3 roles matching above 90%.`);
      } else if (query.toLowerCase().includes('interview') || query.toLowerCase().includes('prep')) {
        speakText(`Your next technical interview with Vercel is ready with custom architecture briefing questions.`);
      } else if (query.toLowerCase().includes('email') || query.toLowerCase().includes('linear')) {
        speakText(`Elena from Linear reached out. Your drafted reply is ready in the inbox.`);
      } else {
        speakText(`Understood, ${userName}. Executed command for "${query}".`);
      }
    } catch {
      speakText(`Synchronizing your pipeline now, ${userName}.`);
    }
  };

  // Voice recognition mic toggle
  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speakText('Microphone speech recognition is not supported in this browser. Please type your command.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setAssistantMood('thinking');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        setSpeechText(`Heard: "${transcript}"`);
        setTimeout(() => {
          sendAssistantMessage(transcript);
          speakText(`Command received. Processing "${transcript}".`);
        }, 500);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setAssistantMood('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Metric summaries for clean display
  const activeAppsCount = applications.filter((a) => a.status !== 'rejected' && a.status !== 'withdrawn').length;
  const unreadEmailsCount = emails.filter((e) => !e.isRead).length;
  const topMatchCount = jobs.filter((j) => (matches[j.id]?.overallScore || 0) >= 90).length;

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 space-y-10 animate-in fade-in duration-500">
      
      {/* ================= HERO SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: HERO WELCOME TYPOGRAPHY & CLEAN OVERVIEW */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Top subtle style selector */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1 p-0.5 rounded-full bg-[#14082e]/80 border border-purple-800/30 text-[11px]">
              <button
                onClick={() => setFontTheme('chakra-glitch')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontTheme === 'chakra-glitch'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-purple-400 hover:text-purple-200'
                }`}
              >
                Cyber & Glitch
              </button>
              <button
                onClick={() => setFontTheme('editorial-syne')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontTheme === 'editorial-syne'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-purple-400 hover:text-purple-200'
                }`}
              >
                Serif & Syne
              </button>
              <button
                onClick={() => setFontTheme('italiana-orbitron')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontTheme === 'italiana-orbitron'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-purple-400 hover:text-purple-200'
                }`}
              >
                Italiana & Orbitron
              </button>
              <button
                onClick={() => setFontTheme('outfit-space')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontTheme === 'outfit-space'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-purple-400 hover:text-purple-200'
                }`}
              >
                Outfit & Space
              </button>
            </div>
          </div>

          {/* ================= HERO TYPOGRAPHY: WELCOME BACK, ESHAN ================= */}
          <div className="space-y-2 select-none">
            {fontTheme === 'chakra-glitch' && (
              <>
                <h1 className="font-chakra font-bold italic text-3xl sm:text-4xl md:text-5xl tracking-widest uppercase">
                  <span className="text-stroke-pink tracking-wider">
                    Welcome
                  </span>{' '}
                  <span className="text-purple-200/90">back,</span>
                </h1>
                <h2 className="font-chakra font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none half-stroke-cyber flex items-baseline">
                  <span className="part-fill">Esh</span>
                  <span className="part-stroke">an</span>
                </h2>
              </>
            )}

            {fontTheme === 'editorial-syne' && (
              <>
                <h1 className="font-display-serif italic font-normal text-3xl sm:text-5xl md:text-6xl tracking-wide">
                  <span className="text-stroke-purple font-semibold">
                    Welcome
                  </span>{' '}
                  <span className="text-purple-200/80">back,</span>
                </h1>
                <h2 className="font-display-syne font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none half-stroke-cyber flex items-baseline">
                  <span className="part-fill">Esh</span>
                  <span className="part-stroke">an</span>
                </h2>
              </>
            )}

            {fontTheme === 'italiana-orbitron' && (
              <>
                <h1 className="font-display-italiana font-normal text-4xl sm:text-5xl md:text-6xl tracking-widest uppercase">
                  <span className="text-stroke-cyan font-bold">
                    Welcome
                  </span>{' '}
                  <span className="text-amber-200/80">back,</span>
                </h1>
                <h2 className="font-display-orbitron font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-tight half-stroke-neon flex items-baseline">
                  <span className="part-fill">ESH</span>
                  <span className="part-stroke">AN</span>
                </h2>
              </>
            )}

            {fontTheme === 'outfit-space' && (
              <>
                <h1 className="font-display-outfit font-light text-3xl sm:text-4xl md:text-5xl tracking-tight">
                  <span className="text-stroke-white font-extrabold">
                    Welcome
                  </span>{' '}
                  <span className="text-purple-300/80">back,</span>
                </h1>
                <h2 className="font-display-space font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none half-stroke-gold flex items-baseline">
                  <span className="part-fill">Esh</span>
                  <span className="part-stroke">an</span>
                </h2>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-purple-300/80 max-w-xl leading-relaxed font-sans font-normal">
            Your career operating system is running autonomously in the background — monitoring matched roles, preparing interview briefings, and scanning recruiter conversations.
          </p>

          {/* Auto Apply Status Indicator */}
          <div className="flex items-center gap-2 pt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Agent Monitoring & Auto-Applying Active</span>
          </div>

          {/* Minimal Clean Metric Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg pt-2">
            <div
              onClick={() => setActiveView('kanban')}
              className="cosmic-card-interactive p-4 rounded-2xl cursor-pointer border border-purple-700/30 bg-[#150a30]/80 group"
            >
              <div className="flex items-center justify-between text-purple-400 group-hover:text-purple-200">
                <Layers className="w-4 h-4" />
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2">
                <span className="font-display-syne font-black text-2xl sm:text-3xl text-white block">
                  {activeAppsCount}
                </span>
                <span className="text-[11px] text-purple-300/80 font-medium">
                  Active Pipeline
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveView('jobs')}
              className="cosmic-card-interactive p-4 rounded-2xl cursor-pointer border border-purple-700/30 bg-[#150a30]/80 group"
            >
              <div className="flex items-center justify-between text-pink-400 group-hover:text-pink-200">
                <Briefcase className="w-4 h-4" />
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2">
                <span className="font-display-syne font-black text-2xl sm:text-3xl text-white block">
                  {topMatchCount}
                </span>
                <span className="text-[11px] text-purple-300/80 font-medium">
                  90%+ Matches
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveView('interviews')}
              className="cosmic-card-interactive p-4 rounded-2xl cursor-pointer border border-purple-700/30 bg-[#150a30]/80 group"
            >
              <div className="flex items-center justify-between text-indigo-400 group-hover:text-indigo-200">
                <Calendar className="w-4 h-4" />
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-2">
                <span className="font-display-syne font-black text-2xl sm:text-3xl text-white block">
                  {interviews.length}
                </span>
                <span className="text-[11px] text-purple-300/80 font-medium">
                  Interviews
                </span>
              </div>
            </div>
          </div>

          {/* Clean Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('kanban')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/60 transition-all hover:scale-105 active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Open Pipeline Board</span>
            </button>

            <button
              onClick={() => setActiveView('jobs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#180d38] hover:bg-[#22124d] border border-purple-700/40 text-purple-200 hover:text-white text-xs font-semibold transition-all"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Explore Jobs</span>
            </button>

            <button
              onClick={() => setActiveView('emails')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#180d38] hover:bg-[#22124d] border border-purple-700/40 text-purple-200 hover:text-white text-xs font-semibold transition-all"
            >
              <Mail className="w-4 h-4 text-pink-400" />
              <span>Inbound Emails ({unreadEmailsCount})</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: 3D CHARACTER SEAMLESS FLOATING IN BACKGROUND (NO BOX / NO ASSISTANT LABELS) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Subtle Ambient Radial Glow Behind the 3D Character */}
          <div className="absolute inset-0 bg-radial from-purple-600/20 via-pink-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Seamless 3D Character Avatar (No Outer Box, No Border) */}
          <div className="w-full flex justify-center items-center relative">
            <ThreeAssistantAvatar
              mood={assistantMood}
              isSpeaking={isSpeaking}
              onAvatarClick={() => {
                speakText(`Hello ${userName}! I'm tracking your applications and interviews in real time.`);
              }}
              className="w-full max-w-md"
            />

            {/* Audio Toggle Floating Pill */}
            <div className="absolute top-2 right-4">
              <button
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                title={isVoiceEnabled ? 'Voice sound enabled' : 'Voice sound muted'}
                className={`p-2 rounded-full border backdrop-blur-md transition-all ${
                  isVoiceEnabled
                    ? 'bg-purple-900/40 text-purple-300 border-purple-600/40 hover:bg-purple-800/60'
                    : 'bg-purple-950/40 text-purple-500 border-purple-900/30 hover:bg-purple-900/40'
                }`}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Minimalist Command & Interaction Input (Floating Seamless Bar) */}
          <div className="w-full max-w-md mt-2 space-y-3">
            
            <form onSubmit={handleAssistantSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a command or ask a question..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[#140a30]/80 border border-purple-700/40 text-white placeholder:text-purple-400/50 text-xs backdrop-blur-md focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-pink-600 text-white animate-pulse'
                      : 'text-purple-400 hover:text-white hover:bg-purple-900/50'
                  }`}
                  title="Voice command"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="submit"
                className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-950 transition-all hover:scale-105 active:scale-95"
                title="Send command"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {[
                { label: '📊 Status Briefing', action: () => speakText(`You have ${activeAppsCount} active applications and 1 upcoming interview tomorrow.`) },
                { label: '🎯 Interview Dossier', action: () => { speakText('Opening Vercel Technical System Design dossier.'); setTimeout(() => setActiveView('interviews'), 600); } },
                { label: '✉️ Inbound Email', action: () => { speakText('Opening Inbound Email Intelligence.'); setTimeout(() => setActiveView('emails'), 600); } },
                { label: '🔍 Discover Roles', action: async () => { speakText('Initiating real-time ATS job discovery.'); await runBackgroundDiscovery(); speakText('Discovery complete. High match roles added.'); } },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={chip.action}
                  className="px-2.5 py-1 rounded-xl bg-[#150a30]/70 hover:bg-[#201048] border border-purple-800/30 text-purple-300 hover:text-white text-[11px] font-medium transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
