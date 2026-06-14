/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from './services/dataService';
import UserApp from './components/UserApp';
import AdminDashboard from './components/AdminDashboard';
import { Settings, Eye, Info, HelpCircle } from 'lucide-react';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  useEffect(() => {
    // Bootstrap database storage with realistic patient seeds
    dbService.init();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Floating Interactive Workspace Switcher Badge */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 border border-slate-700/60 text-white px-4 py-3 rounded-2xl shadow-2xl hover:bg-slate-950 transition-all group duration-300">
        <div className="flex flex-col text-right">
          <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest leading-none">Testing Workspace</p>
          <p className="text-xs font-semibold text-white group-hover:text-emerald-300 mt-1">
            {isAdminMode ? "Viewing back office" : "Viewing guest brand"}
          </p>
        </div>
        
        <div className="h-6 w-px bg-slate-700 mx-1" />

        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow transition duration-150 cursor-pointer flex items-center gap-1.5"
          id="simulation-view-toggle"
        >
          {isAdminMode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Go to Website</span>
            </>
          ) : (
            <>
              <Settings className="w-3.5 h-3.5" />
              <span>Go to Admin Hub</span>
            </>
          )}
        </button>
      </div>

      {/* Render selected view */}
      <div className="flex-1">
        {isAdminMode ? (
          <AdminDashboard onBackToWebsite={() => setIsAdminMode(false)} />
        ) : (
          <UserApp onOpenAdmin={() => setIsAdminMode(true)} />
        )}
      </div>
    </div>
  );
}

