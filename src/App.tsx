/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from './services/dataService';
import UserApp from './components/UserApp';
import AdminDashboard from './components/AdminDashboard';
import { Lock, User, KeyRound, ArrowLeft, ShieldAlert, AlertCircle, Building2 } from 'lucide-react';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('seenu_admin_auth') === 'true';
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Bootstrap database storage with realistic patient seeds
    dbService.init();
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Static production-ready credentials set specifically by the business owner
    const STATIC_USER = 'admin';
    const STATIC_PASS = 'seenu@guesthouse';

    if (usernameInput.trim().toLowerCase() === STATIC_USER && passwordInput === STATIC_PASS) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('seenu_admin_auth', 'true');
      setLoginError('');
      // Clear inputs
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid User ID or Security Password. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('seenu_admin_auth');
    setIsAdminMode(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Direct rendering based on selected mode and authentication state */}
      <div className="flex-1 flex flex-col">
        {isAdminMode ? (
          isAdminAuthenticated ? (
            <AdminDashboard onBackToWebsite={handleLogout} />
          ) : (
            /* Beautiful Secure Multi-device responsive Admin login page */
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-slate-950 min-h-screen text-slate-100">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
                
                <div className="text-center relative z-10 mb-8">
                  <div className="inline-flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20 p-3.5 rounded-2xl mb-4">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white font-sans">Office Operations Login</h2>
                  <p className="text-xs text-slate-400 mt-1.5 px-4">
                    Enter static credentials to safely configure rooms, view airport pickups, and process doctor companion queues.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5 relative z-10">
                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Username Fields */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-1.5">
                      Admin User ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Enter admin ID"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-blue-500 focus:outline-none pl-9 pr-4 py-2.5 rounded-xl text-sm transition"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400">
                        Operational Password
                      </label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-950 text-slate-100 border border-slate-800 focus:border-blue-500 focus:outline-none pl-9 pr-4 py-2.5 rounded-xl text-sm transition"
                      />
                    </div>
                  </div>

                  {/* Help notice with transparent guidance */}
                  <div className="bg-blue-500/5 border border-blue-400/20 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                    <p className="font-semibold text-blue-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Static Credentials Required
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      Primary User ID: <span className="font-mono bg-slate-950/80 text-white border border-slate-800/80 px-1 py-0.5 rounded font-black">admin</span>
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      Standard Code: <span className="font-mono bg-slate-950/80 text-white border border-slate-800/80 px-1 py-0.5 rounded font-black">seenu@guesthouse</span>
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAdminMode(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Return Website
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl text-xs font-black tracking-wide transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      Verify Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        ) : (
          <UserApp onOpenAdmin={() => setIsAdminMode(true)} />
        )}
      </div>
    </div>
  );
}

