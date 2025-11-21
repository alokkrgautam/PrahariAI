import React, { useState } from 'react';
import { analyzeProfile, scanNetworkForThreats } from '../services/geminiService';
import { ScanResult, ThreatLevel, SuspectProfile } from '../types';
import { Search, RefreshCw, AlertOctagon, FileWarning, Terminal, Shield, ScanEye, Radio, Wifi, ArrowRight, Quote } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Sub-components ---

const TrustGauge = ({ score }: { score: number }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  
  let color = '#ef4444'; // Red (Low Trust / High Risk)
  if (score >= 80) color = '#22c55e'; // Green (High Trust)
  else if (score >= 50) color = '#eab308'; // Yellow (Medium Trust)

  return (
    <div className="relative h-48 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="75%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={color} />
            <Cell key="remaining" fill="#334155" /> 
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-12 flex flex-col items-center">
         <span className="text-4xl font-black text-white tracking-tight">{score}</span>
         <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Trust Score</span>
      </div>
    </div>
  );
};

const HighlightedAnalysis = ({ text, flags }: { text: string, flags: string[] }) => {
  if (!text) return null;

  // Combine flags with common risk keywords for broader highlighting
  const riskTerms = [
    ...flags, 
    "fake", "bot", "impersonation", "malicious", "suspicious", "high risk", 
    "critical", "misinformation", "propaganda", "scam", "fraud", "automated", 
    "unverified", "takedown", "threat", "urgent", "verify", "kyc", "link", "click"
  ];
  
  // Escape regex characters and filter empty strings
  const validTerms = riskTerms.filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  if (validTerms.length === 0) return <p className="text-sm text-slate-400 leading-relaxed">{text}</p>;

  // Create a regex to match any of the terms, case-insensitive
  const regex = new RegExp(`(${validTerms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <p className="text-sm text-slate-400 leading-relaxed">
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-red-500/10 text-red-400 px-1 rounded border border-red-500/20 font-medium mx-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};

// --- Main Component ---

const ScanModule: React.FC = () => {
  const [mode, setMode] = useState<'manual' | 'live'>('manual');
  
  // Manual Mode State
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState('');
  
  // Live Mode State
  const [scanTopic, setScanTopic] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [foundProfiles, setFoundProfiles] = useState<SuspectProfile[]>([]);
  const [scanLog, setScanLog] = useState<string[]>([]);

  // Common State
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  // Manual Analysis
  const handleManualScan = async () => {
    if (!username || !bio) return;
    setLoadingAnalysis(true);
    setResult(null);
    
    try {
      const data = await analyzeProfile(username, bio, posts);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Live Analysis Trigger
  const handleAnalyzeFoundProfile = async (profile: SuspectProfile) => {
    setLoadingAnalysis(true);
    setResult(null);
    // Switch to manual inputs visually so the user sees what is being analyzed
    setUsername(profile.username);
    setBio(profile.bio);
    setPosts(profile.recentPosts);
    setMode('manual'); // Switch view to show result

    try {
      const data = await analyzeProfile(profile.username, profile.bio, profile.recentPosts);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Live Scan Simulation
  const handleLiveScan = async () => {
    if (!scanTopic) return;
    setIsScanning(true);
    setFoundProfiles([]);
    setScanLog(['Initializing PrahariAI Network Node...', 'Connecting to secure gateway...']);

    // Simulate delay for effect
    setTimeout(() => setScanLog(prev => [...prev, `Monitoring traffic for keywords: "${scanTopic}"`]), 800);
    setTimeout(() => setScanLog(prev => [...prev, 'Intercepting packets from Twitter/X API...']), 1600);
    setTimeout(() => setScanLog(prev => [...prev, 'Analyzing metadata signatures...']), 2400);

    try {
      const profiles = await scanNetworkForThreats(scanTopic);
      setTimeout(() => {
        setFoundProfiles(profiles);
        setScanLog(prev => [...prev, `THREATS DETECTED: ${profiles.length} suspicious entities identified.`]);
        setIsScanning(false);
      }, 3500);
    } catch (e) {
      setScanLog(prev => [...prev, 'Error: Connection timed out.']);
      setIsScanning(false);
    }
  };

  const fillDemoData = () => {
    setUsername('@support_help_desk_official');
    setBio('Official Support Desk. DM for immediate assistance. We resolve all issues instantly.');
    setPosts('URGENT: Your account is flagged. Click here bit.ly/verify-now to avoid suspension immediately.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Control Panel */}
      <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'manual' ? 'bg-slate-700 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Search className="w-4 h-4" />
            Manual Inspection
          </button>
          <button 
            onClick={() => setMode('live')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'live' ? 'bg-slate-700 text-red-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Wifi className="w-4 h-4" />
            Live Monitor
          </button>
        </div>

        {/* Manual Mode Input */}
        {mode === 'manual' && (
          <div className="p-6 flex-1 overflow-y-auto flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ScanEye className="w-6 h-6 text-cyan-400" />
                Target Analysis
              </h2>
              <p className="text-sm text-slate-400 mt-2">Enter profile metadata to run AI-powered heuristic analysis.</p>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Target Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-4 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Profile Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none h-24 resize-none text-sm"
                  placeholder="Paste bio text here..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Recent Content (Context)</label>
                <textarea
                  value={posts}
                  onChange={(e) => setPosts(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none h-32 resize-none text-sm"
                  placeholder="Paste recent tweets or post captions..."
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleManualScan}
                disabled={loadingAnalysis || !username}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                  loadingAnalysis ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                }`}
              >
                {loadingAnalysis ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Initiate Scan
                  </>
                )}
              </button>
              
              <button onClick={fillDemoData} className="w-full py-2 bg-transparent border border-slate-600 text-slate-400 rounded-lg hover:text-white hover:border-slate-500 text-sm transition-colors">
                Load Demo Suspicious Data
              </button>
            </div>
          </div>
        )}

        {/* Live Mode Input */}
        {mode === 'live' && (
          <div className="p-6 flex-1 flex flex-col">
             <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="w-6 h-6 text-red-500 animate-pulse" />
                Live Network Monitor
              </h2>
              <p className="text-sm text-slate-400 mt-2">Real-time social graph crawler. Enter a topic to intercept potential threats.</p>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Monitoring Keywords</label>
                <input
                  type="text"
                  value={scanTopic}
                  onChange={(e) => setScanTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="e.g. Election, Crypto, Riot"
                />
               </div>
               <button
                onClick={handleLiveScan}
                disabled={isScanning || !scanTopic}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center transition-all ${
                  isScanning ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Scanning Network...
                  </>
                ) : (
                  <>
                    <Wifi className="w-5 h-5 mr-2" />
                    Start Monitoring
                  </>
                )}
              </button>
            </div>

            {/* Terminal Output */}
            <div className="mt-6 flex-1 bg-black/50 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto border border-slate-800 shadow-inner">
               {scanLog.length === 0 && <span className="text-slate-600">&gt;&gt; System Ready. Awaiting command.</span>}
               {scanLog.map((log, i) => (
                 <div key={i} className="mb-1">
                   <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log}
                 </div>
               ))}
               {isScanning && (
                 <div className="animate-pulse">_</div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto relative">
        
        {/* VIEW: Live Monitor Results */}
        {mode === 'live' && (
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white">Intercepted Profiles</h3>
                 {foundProfiles.length > 0 && (
                   <span className="text-xs font-bold px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/50">
                      {foundProfiles.length} THREATS FOUND
                   </span>
                 )}
              </div>

              {foundProfiles.length === 0 && !isScanning && (
                 <div className="h-64 flex flex-col items-center justify-center text-slate-500 opacity-50 border-2 border-dashed border-slate-700 rounded-lg">
                    <ScanEye className="w-12 h-12 mb-3" />
                    <p>No threats detected yet.</p>
                 </div>
              )}

              {isScanning && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none">
                    {[1,2].map(i => (
                      <div key={i} className="h-40 bg-slate-900 rounded-lg animate-pulse"></div>
                    ))}
                 </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {foundProfiles.map((profile, idx) => (
                   <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <h4 className="font-bold text-white">{profile.username}</h4>
                            <span className="text-xs text-slate-400">{profile.platform}</span>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2 italic">"{profile.bio}"</p>
                      <div className="bg-slate-800 p-2 rounded text-xs text-slate-400 mb-4 line-clamp-2 font-mono">
                        Last Post: {profile.recentPosts}
                      </div>
                      <button 
                        onClick={() => handleAnalyzeFoundProfile(profile)}
                        className="w-full py-2 bg-slate-800 hover:bg-cyan-900/30 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 rounded transition-all text-sm font-medium flex items-center justify-center gap-2"
                      >
                        Run Full Analysis <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* VIEW: Analysis Result (Manual or Clicked from Live) */}
        {mode === 'manual' && (
          <>
            {!result && !loadingAnalysis && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <Shield className="w-24 h-24 mb-4" />
                  <p className="text-lg">Ready to secure the perimeter.</p>
                  <p className="text-sm">Awaiting input data.</p>
              </div>
            )}

            {loadingAnalysis && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-cyan-400 font-mono animate-pulse">Decrypting metadata patterns...</p>
                <div className="mt-2 text-xs text-slate-500 font-mono space-y-1 text-center">
                  <p>Analyzing syntax...</p>
                  <p>Checking known botnet signatures...</p>
                  <p>Calculating trust vector...</p>
                </div>
              </div>
            )}

            {result && !loadingAnalysis && (
              <div className="animate-fade-in space-y-6">
                {/* Header Result */}
                <div className="flex items-center justify-between border-b border-slate-700 pb-6">
                  <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        Analysis Report
                        <span className={`px-3 py-1 text-sm rounded-full border ${
                          result.threatLevel === ThreatLevel.CRITICAL || result.threatLevel === ThreatLevel.HIGH
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : result.threatLevel === ThreatLevel.MEDIUM
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-green-500/20 text-green-400 border-green-500/50'
                        }`}>
                          {result.threatLevel.toUpperCase()} THREAT
                        </span>
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">Target: <span className="text-white font-mono">{username}</span></p>
                  </div>
                  <div className="w-32 md:w-40">
                      <TrustGauge score={result.trustScore} />
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Flags */}
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4 text-orange-500" />
                        Detected Indicators
                      </h4>
                      <ul className="space-y-2">
                        {result.flags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                  </div>

                  {/* AI Analysis Text */}
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-cyan-500" />
                        Gemini Analysis
                      </h4>
                      <HighlightedAnalysis text={result.analysis} flags={result.flags} />
                  </div>
                </div>

                {/* NEW: Analyzed Content Snippet */}
                {posts && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                     <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                        <Quote className="w-4 h-4 text-slate-500" />
                        Analyzed Content Snippet
                     </h4>
                     <div className="bg-black/20 p-3 rounded border border-slate-800 italic">
                       <HighlightedAnalysis text={posts} flags={result.flags} />
                     </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-md text-white">
                        <FileWarning className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Recommended Action</p>
                        <p className="text-white font-medium">{result.suggestedAction}</p>
                      </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm font-medium">
                        Log Evidence
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm font-medium shadow-lg shadow-red-900/20">
                        Report & Takedown
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScanModule;
