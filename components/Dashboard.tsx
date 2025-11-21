import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, AlertTriangle, Users, Globe, ArrowUpRight } from 'lucide-react';

const dataThreats = [
  { name: 'Mon', threats: 12 },
  { name: 'Tue', threats: 19 },
  { name: 'Wed', threats: 32 },
  { name: 'Thu', threats: 24 },
  { name: 'Fri', threats: 45 },
  { name: 'Sat', threats: 38 },
  { name: 'Sun', threats: 52 },
];

const dataPlatform = [
  { name: 'Twitter', value: 400 },
  { name: 'Instagram', value: 300 },
  { name: 'Facebook', value: 300 },
  { name: 'Telegram', value: 200 },
];

const COLORS = ['#0ea5e9', '#ec4899', '#3b82f6', '#22d3ee'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Threats</p>
              <h3 className="text-3xl font-bold text-white mt-1">1,284</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-red-400">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+12% from last week</span>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Accounts Takedown</p>
              <h3 className="text-3xl font-bold text-white mt-1">843</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>98% Success Rate</span>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Identities Monitored</p>
              <h3 className="text-3xl font-bold text-white mt-1">45.2k</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span>Across 4 platforms</span>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Global Reach</p>
              <h3 className="text-3xl font-bold text-white mt-1">12</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span>Regions flagged</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Threat Detection Velocity</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataThreats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="threats" stroke="#0ea5e9" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Platform Distribution</h3>
          <div className="h-72 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPlatform}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPlatform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             {/* Legend */}
             <div className="absolute bottom-0 left-0 w-full flex justify-center space-x-4 text-xs text-slate-300">
                {dataPlatform.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[index]}}></span>
                    {item.name}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;