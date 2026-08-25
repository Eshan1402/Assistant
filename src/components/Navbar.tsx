import React, { useState, useRef, useEffect } from 'react';
import { useCareerOS } from '../context/CareerOSContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  User,
  Cpu,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setActiveView } = useCareerOS();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 backdrop-blur-2xl bg-white/60 border-b border-gray-200 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Doraemon Brand Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-left group transition-all transform active:scale-95 select-none focus:outline-none"
            title="Home"
          >
            <div className="flex items-baseline gap-1.5 bg-doraemon-blue px-3 py-1.5 rounded-full shadow-md border-2 border-white">
              <span className="font-display-outfit font-black text-xl tracking-tight text-white">
                Dora
              </span>
              <span className="font-display-syne font-black text-xl text-doraemon-gold drop-shadow-sm">
                OS
              </span>
            </div>
          </button>
        </div>

        {/* Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => setActiveView('home')} className="text-sm font-bold text-gray-700 hover:text-doraemon-blue transition-colors">Episodes</button>
          <button onClick={() => setActiveView('dashboard')} className="text-sm font-bold text-gray-700 hover:text-doraemon-blue transition-colors">Dashboard</button>
          <button className="text-sm font-bold text-gray-700 hover:text-doraemon-blue transition-colors">Store</button>
          <button className="text-sm font-bold text-gray-700 hover:text-doraemon-blue transition-colors">Toys</button>
          <button className="text-sm font-bold text-gray-700 hover:text-doraemon-blue transition-colors">3D videos</button>
        </nav>

        {/* Right Action Controls: Search & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Circular Royal Blue Search Button */}
          <button
            className="w-10 h-10 rounded-full bg-doraemon-blue text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors transform hover:scale-105 active:scale-95"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full bg-white border border-gray-200 shadow-sm transition-all hover:border-doraemon-blue hover:shadow-md"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''} pr-1`} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800">{user?.name || 'Eshan Saxena'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'eshanbsaxena@gmail.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-doraemon-blue transition-colors text-left"
                  >
                    <User className="w-4 h-4" />
                    <span>Candidate Profile & Resume</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('automation');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-doraemon-blue transition-colors text-left"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Worker System & Logs</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-doraemon-blue transition-colors text-left"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Automation Safety Rules</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
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
