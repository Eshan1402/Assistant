import React, { useState, useRef, useEffect } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Calendar,
  Briefcase,
  Layers,
  Mail,
  Zap,
} from 'lucide-react';

export const AssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    messages,
    sendAssistantMessage,
    profile,
    jobs,
    applications,
    interviews,
    setActiveView,
    setSelectedJobForDetail,
    runBackgroundDiscovery,
    appPreferences,
    updateAppPreferences,
  } = useCareerOS();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What jobs did you find today?',
    'Show me my best opportunities (90%+ match)',
    'Prepare me for tomorrow\'s interview with Vercel',
    'What applications are waiting for review?',
    'What skills am I missing most frequently in target jobs?',
    'Run background discovery for new roles',
  ];

  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAssistantOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setInput('');
    setIsTyping(true);
    try {
      await sendAssistantMessage(query);
    } finally {
      setIsTyping(false);
    }
  };

  // Web Speech API for voice recognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported on this browser. Try Chrome or Edge.');
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
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleActionClick = (actionType?: string, actionPayload?: any) => {
    if (!actionType) return;
    setIsAssistantOpen(false);

    if (actionType === 'view_job' && actionPayload?.jobId) {
      const j = jobs.find((item) => item.id === actionPayload.jobId);
      if (j) {
        setSelectedJobForDetail(j);
        setActiveView('jobs');
      }
    } else if (actionType === 'view_interview') {
      setActiveView('interviews');
    } else if (actionType === 'view_email') {
      setActiveView('emails');
    } else if (actionType === 'open_kanban') {
      setActiveView('kanban');
    } else if (actionType === 'run_discovery') {
      runBackgroundDiscovery();
      setActiveView('jobs');
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#11082b]/95 backdrop-blur-2xl border-l border-purple-800/40 shadow-2xl shadow-purple-950 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-purple-800/30 flex items-center justify-between bg-[#170c38]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-900/50 border border-purple-400/30">
              <Bot className="w-5 h-5 animate-pulse-glow" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#170c38]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-base">CareerOS Assistant</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-300 font-semibold border border-purple-700/40">
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-purple-300/70">Autonomous Career Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* TTS Audio toggle */}
          <button
            onClick={() =>
              updateAppPreferences({
                voiceAssistantEnabled: !appPreferences.voiceAssistantEnabled,
              })
            }
            title={appPreferences.voiceAssistantEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
          >
            {appPreferences.voiceAssistantEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-purple-500" />
            )}
          </button>

          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Agent Persona Greeting Card */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-700/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Agent Active Context</span>
          </div>
          <p className="text-purple-200/80 leading-relaxed">
            I am continuously evaluating <strong>{jobs.length} discovered jobs</strong> against your profile (
            <strong>{profile.fullName}</strong>), tracking <strong>{applications.length} pipeline applications</strong>,
            and monitoring your upcoming interview.
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none border border-purple-400/30'
                  : 'bg-[#1b103f] text-purple-100 rounded-bl-none border border-purple-700/30'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Action pill if assistant recommended one */}
              {msg.actionType && (
                <div className="mt-3 pt-2.5 border-t border-purple-700/30 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-purple-300/70 uppercase tracking-wider font-semibold">
                    Suggested Action
                  </span>
                  <button
                    onClick={() => handleActionClick(msg.actionType, msg.actionPayload)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-all"
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-purple-400/50 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#1b103f] border border-purple-700/30 w-28">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-5 py-2.5 bg-[#140b33] border-t border-purple-900/30">
        <p className="text-[10px] uppercase font-semibold text-purple-400/70 mb-2">Quick Commands</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 text-left px-3 py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900/60 border border-purple-700/40 text-[11px] text-purple-200 transition-all active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box with Speech-to-Text */}
      <div className="p-4 bg-[#170c38] border-t border-purple-800/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-2xl border transition-all ${
              isListening
                ? 'bg-pink-600 border-pink-400 text-white animate-pulse'
                : 'bg-purple-950/60 border-purple-700/40 text-purple-300 hover:text-white hover:bg-purple-900/50'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening to voice...' : 'Ask CareerOS assistant anything...'}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-purple-950/70 border border-purple-700/40 text-white text-xs placeholder:text-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
