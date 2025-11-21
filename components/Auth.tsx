
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Mail, ArrowRight, ShieldAlert, Globe } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyCode, setAgencyCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network authentication delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const handleDemoLogin = () => {
    setDemoLoading(true);
    // Faster entry for demo mode
    setTimeout(() => {
        setDemoLoading(false);
        onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl border border-slate-700 mb-4 shadow-lg shadow-cyan-900/20">
            <ShieldAlert className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wider mb-2">
            Prahari<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm">Digital Identity Integrity System</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {isLogin ? 'Secure Login' : 'Agent Registration'}
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full border border-slate-700">
              <div className={`w-2 h-2 rounded-full ${loading || demoLoading ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                {loading || demoLoading ? 'Verifying' : 'System Secure'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Agency Code (e.g. RAW-007)"
                    required
                    value={agencyCode}
                    onChange={(e) => setAgencyCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                placeholder="Official Email ID"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block pl-10 p-2.5 outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || demoLoading}
              className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300/50 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  {isLogin ? 'Access Dashboard' : 'Request Clearance'} 
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-800 text-slate-500">OR</span>
            </div>
          </div>

          <button 
            onClick={handleDemoLogin}
            disabled={loading || demoLoading}
            className="w-full flex items-center justify-center gap-2 text-slate-300 bg-slate-700 hover:bg-slate-600 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all disabled:opacity-50"
          >
            {demoLoading ? (
                <span className="animate-pulse">Initializing Demo Environment...</span>
            ) : (
                <>
                    <Globe className="w-4 h-4" />
                    Enter as Guest (Demo Mode)
                </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {isLogin ? "New to the agency? " : "Already have clearance? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
              >
                {isLogin ? 'Register Identity' : 'Login Here'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 font-mono">
          <p>RESTRICTED ACCESS SYSTEM</p>
          <p className="mt-1">Unauthorized access is a punishable offense under Cyber Law Sec 43.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

