import React from 'react';
import { Bell, Search, User, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center bg-slate-800 rounded-full px-4 py-1.5 border border-slate-700">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search database..." 
          className="bg-transparent border-none focus:outline-none text-sm text-white w-64 placeholder-slate-500"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
           <span className="px-2 py-0.5 text-xs font-bold bg-cyan-900/50 text-cyan-400 border border-cyan-800 rounded uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Protection Active
           </span>
           <span className="text-xs text-slate-500">|</span>
           <span className="text-xs text-green-500 font-mono flex items-center">
             <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
             ONLINE
           </span>
        </div>

        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-700 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">Security Analyst</p>
            <p className="text-xs text-slate-400">Admin Access</p>
          </div>
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 border border-slate-600">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;