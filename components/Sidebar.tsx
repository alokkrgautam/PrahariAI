import React from 'react';
import { ShieldAlert, LayoutDashboard, ScanEye, FileText, Settings, LogOut, Activity } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'scan', label: 'Threat Detection', icon: ScanEye },
    { id: 'evidence', label: 'Evidence Ledger', icon: FileText },
    { id: 'network', label: 'Botnet Graph', icon: Activity },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-700 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <ShieldAlert className="w-8 h-8 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider">Prahari<span className="text-cyan-400">AI</span></h1>
          <p className="text-xs text-slate-400">Identity Integrity Sys.</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-900' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;