import React, { useState } from 'react';
import { EvidenceRecord, Agency, Platform } from '../types';
import { ExternalLink, Shield, Copy, CheckCircle2, Filter } from 'lucide-react';

const mockEvidence: EvidenceRecord[] = [
  {
    id: 'EV-2024-001',
    timestamp: '2024-05-15 14:23:12',
    targetUser: '@fake_news_bot_99',
    platform: Platform.TWITTER,
    actionTaken: 'Takedown Request Sent',
    hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    agency: Agency.TEAM_ALPHA,
    status: 'Verified'
  },
  {
    id: 'EV-2024-002',
    timestamp: '2024-05-15 10:10:45',
    targetUser: 'instagram.com/impersonator_official',
    platform: Platform.INSTAGRAM,
    actionTaken: 'Profile Flagged',
    hash: '0x3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z',
    agency: Agency.TEAM_BETA,
    status: 'Pending'
  },
  {
    id: 'EV-2024-003',
    timestamp: '2024-05-14 22:05:01',
    targetUser: '@scam_alert_support',
    platform: Platform.TELEGRAM,
    actionTaken: 'Channel Reported',
    hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    agency: Agency.TEAM_GAMMA,
    status: 'Escalated'
  }
];

const EvidenceLog: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [agencyFilter, setAgencyFilter] = useState<string>('All');

  const filteredEvidence = mockEvidence.filter(record => {
    const matchPlatform = platformFilter === 'All' || record.platform === platformFilter;
    const matchStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchAgency = agencyFilter === 'All' || record.agency === agencyFilter;
    return matchPlatform && matchStatus && matchAgency;
  });

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Shield className="w-6 h-6 text-cyan-400" />
             Immutable Evidence Ledger
           </h2>
           <p className="text-slate-400 text-sm mt-1">Blockchain-verified log of all detection and enforcement actions.</p>
         </div>
         <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded-full flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Node Sync: Active
            </span>
         </div>
       </div>

       {/* Filters */}
       <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mr-2">
             <Filter className="w-4 h-4" />
             Filters:
          </div>
          
          <select 
             value={platformFilter}
             onChange={(e) => setPlatformFilter(e.target.value)}
             className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none"
          >
             <option value="All">All Platforms</option>
             {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none"
          >
             <option value="All">All Statuses</option>
             <option value="Pending">Pending</option>
             <option value="Verified">Verified</option>
             <option value="Escalated">Escalated</option>
          </select>

          <select 
             value={agencyFilter}
             onChange={(e) => setAgencyFilter(e.target.value)}
             className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none"
          >
             <option value="All">All Agencies</option>
             {Object.values(Agency).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
       </div>

       <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
         <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
               <tr>
                 <th className="p-4">Log ID</th>
                 <th className="p-4">Target</th>
                 <th className="p-4">Platform</th>
                 <th className="p-4">Action</th>
                 <th className="p-4">Hash (SHA-256)</th>
                 <th className="p-4">Status</th>
                 <th className="p-4 text-right">Details</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-700">
               {filteredEvidence.length > 0 ? (
                 filteredEvidence.map((record) => (
                   <tr key={record.id} className="hover:bg-slate-700/30 transition-colors">
                     <td className="p-4 font-mono text-cyan-400">{record.id}</td>
                     <td className="p-4 text-white font-medium">{record.targetUser}</td>
                     <td className="p-4 text-slate-300">
                        <span className={`px-2 py-1 rounded text-xs border ${
                          record.platform === Platform.TWITTER ? 'bg-sky-900/30 border-sky-800 text-sky-400' :
                          record.platform === Platform.INSTAGRAM ? 'bg-pink-900/30 border-pink-800 text-pink-400' :
                          'bg-blue-900/30 border-blue-800 text-blue-400'
                        }`}>
                          {record.platform}
                        </span>
                     </td>
                     <td className="p-4 text-slate-300">{record.actionTaken}</td>
                     <td className="p-4">
                       <div className="flex items-center gap-2 group cursor-pointer" title={record.hash}>
                          <span className="font-mono text-slate-500 text-xs max-w-[120px] truncate">
                            {record.hash}
                          </span>
                          <Copy className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {record.status === 'Verified' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                           record.status === 'Escalated' ? <ExternalLink className="w-4 h-4 text-red-500" /> :
                           <div className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin"></div>}
                          <span className={`${
                            record.status === 'Verified' ? 'text-green-400' : 
                            record.status === 'Escalated' ? 'text-red-400' : 
                            'text-yellow-400'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                     </td>
                     <td className="p-4 text-right">
                       <button className="text-cyan-400 hover:text-cyan-300 text-xs font-medium">
                         VIEW BLOCK
                       </button>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                      No evidence records found matching the selected filters.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};

export default EvidenceLog;