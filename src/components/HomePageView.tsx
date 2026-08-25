import React, { useState } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { ThreeAssistantAvatar } from './ThreeAssistantAvatar';
import {
  Play,
  Mic,
  Volume2,
  VolumeX,
  Send,
  Mail,
  PieChart,
  Layout,
  Briefcase,
  Layers,
  ChevronLeft,
  ChevronRight,
  Star
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
    `Hello ${userName}! Ready for some 4D career magic?`
  );
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // (Removed yellow widget card state)

  // Trigger speech
  const speakText = (text: string) => {
    setSpeechText(text);
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 260));
      utterance.rate = 1.1; // Slightly faster for cartoon effect
      utterance.pitch = 1.2; // Slightly higher pitch for Doraemon
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
        speakText(`I found ${jobs.length} jobs in my 4D pocket!`);
      } else if (query.toLowerCase().includes('interview')) {
        speakText(`Using the Translation Gummy to prep you for the interview!`);
      } else {
        speakText(`Understood, ${userName}. Executing command!`);
      }
    } catch {
      speakText(`Oops, my pocket is tangled. Synchronizing now!`);
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
          speakText(`Got it! processing "${transcript}".`);
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

  const activeAppsCount = applications.filter((a) => a.status !== 'rejected' && a.status !== 'withdrawn').length;
  const unreadEmailsCount = emails.filter((e) => !e.isRead).length;

  return (
    <div className="relative w-full min-h-[85vh] py-4 sm:py-8 flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-visible">
      
      {/* Bottom Floating Dock Orbs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 z-20 w-full px-4 pointer-events-auto">
        <button
          onClick={() => setActiveView('emails')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-doraemon-red text-white font-bold shadow-[0_8px_20px_-6px_rgba(255,56,56,0.6)] hover:-translate-y-2 transition-transform border-2 border-white/20 group animate-[bounce_4s_infinite]"
          title="Recruiter Mail"
        >
          <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Mail</span>
          <span className="ml-1 bg-white text-doraemon-red text-xs px-2 py-0.5 rounded-full">{unreadEmailsCount}</span>
        </button>

        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-doraemon-blue text-white font-bold shadow-[0_8px_20px_-6px_rgba(0,139,227,0.6)] hover:-translate-y-2 transition-transform border-2 border-white/20 group animate-[bounce_5s_infinite_0.5s]"
          title="Career AI Dashboard"
        >
          <Layout className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">AI Dash</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-doraemon-gold text-black font-bold shadow-[0_8px_20px_-6px_rgba(255,204,0,0.6)] hover:-translate-y-2 transition-transform border-2 border-white/50 group animate-[bounce_4.5s_infinite_1s]"
          title="Analytics & Market Radar"
        >
          <PieChart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Radar</span>
        </button>

        <button
          onClick={() => setActiveView('kanban')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-doraemon-pink text-white font-bold shadow-[0_8px_20px_-6px_rgba(255,94,168,0.6)] hover:-translate-y-2 transition-transform border-2 border-white/20 group animate-[bounce_5.5s_infinite_1.5s]"
          title="Anywhere Door Pipeline"
        >
          <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Pipeline</span>
          <span className="ml-1 bg-white text-doraemon-pink text-xs px-2 py-0.5 rounded-full">{activeAppsCount}</span>
        </button>

        <button
          onClick={() => setActiveView('jobs')}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-doraemon-green text-white font-bold shadow-[0_8px_20px_-6px_rgba(16,185,129,0.6)] hover:-translate-y-2 transition-transform border-2 border-white/20 group animate-[bounce_4.2s_infinite_0.2s]"
          title="Take-Copter Jobs"
        >
          <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Jobs</span>
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 px-4">
        
        {/* LEFT COLUMN: HERO TEXT & INPUT */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-8">
          
          {/* Typography */}
          <div className="space-y-4">
            <h1 className="font-display-syne font-black text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none text-black">
              Hi {userName}, <br />
              <span className="text-doraemon-blue">Welcome back</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-sans font-medium">
              Your career operating system is running autonomously with the help of future gadgets.
            </p>
          </div>

          {/* Minimalist Command & Interaction Input */}
          <div className="w-full max-w-md space-y-4">
            
            <form onSubmit={handleAssistantSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Doraemon a question..."
                  className="w-full pl-6 pr-12 py-4 rounded-full bg-white border-2 border-gray-200 text-gray-800 placeholder:text-gray-400 font-bold text-sm shadow-md focus:outline-none focus:border-doraemon-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                    isListening
                      ? 'bg-doraemon-red text-white animate-pulse shadow-md'
                      : 'text-gray-400 hover:text-doraemon-blue hover:bg-blue-50'
                  }`}
                  title="Voice command"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                className="p-4 rounded-full bg-doraemon-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 border-2 border-white/20"
                title="Send command"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-start gap-2 pt-2">
              {[
                { label: '📊 Status', action: () => speakText(`You have ${activeAppsCount} active applications!`) },
                { label: '🎯 Interview Prep', action: () => { speakText('Opening interview dosser.'); setTimeout(() => setActiveView('interviews'), 600); } },
                { label: '✉️ Inbound Email', action: () => { speakText('Checking recruiter emails.'); setTimeout(() => setActiveView('emails'), 600); } },
                { label: '🔍 Discover Roles', action: async () => { speakText('Using Job Finder Radar!'); await runBackgroundDiscovery(); speakText('Discovery complete.'); } },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={chip.action}
                  className="px-4 py-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-doraemon-blue text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: 3D CHARACTER (BIG) */}
        <div className="lg:col-span-7 xl:col-span-7 flex justify-center items-center relative translate-x-12 -translate-y-16 lg:translate-x-24 lg:-translate-y-24">
          
          <div className="absolute inset-0 bg-radial from-white/60 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

          <ThreeAssistantAvatar
            mood={assistantMood}
            isSpeaking={isSpeaking}
            onAvatarClick={() => {
              speakText(`Hello ${userName}! Need a gadget from the 22nd century?`);
            }}
            className="w-full max-w-full h-[450px] sm:h-[600px] drop-shadow-2xl"
          />

          {/* Audio Toggle Floating Pill */}
          <div className="absolute top-2 right-4">
            <button
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              title={isVoiceEnabled ? 'Voice sound enabled' : 'Voice sound muted'}
              className={`p-2 rounded-full border shadow-sm backdrop-blur-md transition-all ${
                isVoiceEnabled
                  ? 'bg-white/80 text-doraemon-blue border-blue-200 hover:bg-white'
                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-white'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
