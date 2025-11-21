
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScanModule from './components/ScanModule';
import EvidenceLog from './components/EvidenceLog';
import BotnetGraph from './components/BotnetGraph';
import Auth from './components/Auth';

const App: React.FC = () => {
  // Initialize state from localStorage to persist login across refreshes
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('prahari_auth') === 'true';
  });
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = () => {
    localStorage.setItem('prahari_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('prahari_auth');
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

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

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Sidebar activeView={activeView} setView={setActiveView} onLogout={handleLogout} />
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


