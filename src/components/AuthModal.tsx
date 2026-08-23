import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { login, register, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('Eshan Saxena');
  const [email, setEmail] = useState('eshanbsaxena@gmail.com');
  const [password, setPassword] = useState('Eshan@123');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await login(email, password);
    } catch (err: any) {
      setMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080414] backdrop-blur-2xl">
      {/* Ambient glowing radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#130b2e]/95 border border-purple-600/40 shadow-2xl shadow-purple-950 p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-purple-900/60 border border-purple-400/30">
            <Bot className="w-7 h-7 animate-pulse-glow" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              CareerOS<span className="text-purple-400">.</span>
            </h1>
            <p className="text-xs text-purple-300/80 mt-1">
              Autonomous AI Career Agent & Job Intelligence
            </p>
          </div>
        </div>

        {/* Single User Access Only */}
        <div className="text-center pb-2 border-b border-purple-900/40">
          <p className="text-xs text-purple-300 font-medium">Personal Access Gateway</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-purple-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                readOnly
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-900/30 border border-purple-700/20 text-purple-300/70 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-purple-300 font-medium">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-purple-400 hover:text-purple-300 text-[11px]"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/70 border border-purple-700/40 text-white placeholder:text-purple-400/50 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-900/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            <span>Sign In to CareerOS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
