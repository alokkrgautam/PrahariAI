import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScanModule from './components/ScanModule';
import EvidenceLog from './components/EvidenceLog';
import BotnetGraph from './components/BotnetGraph';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'scan':
        return <ScanModule />;
      case 'evidence':
        return <EvidenceLog />;
      case 'network':
        return <BotnetGraph />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Sidebar activeView={activeView} setView={setActiveView} />
      <Header />
      
      <main className="ml-64 pt-20 p-6 min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="max-w-7xl mx-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
