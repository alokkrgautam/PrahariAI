import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, User, Zap, Activity } from 'lucide-react';

interface Node {
  id: number;
  x: number;
  y: number;
  type: 'target' | 'bot' | 'safe' | 'hub';
  connections: number[];
}

const BotnetGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    // Generate a static consistent graph for demo purposes
    const newNodes: Node[] = [];
    
    // Central Target Node
    const centerX = 50;
    const centerY = 50;
    newNodes.push({ id: 0, x: centerX, y: centerY, type: 'target', connections: [] });

    // Create 3 Bot Hubs
    const hubs = [
      { id: 1, x: 30, y: 30 },
      { id: 2, x: 70, y: 60 },
      { id: 3, x: 40, y: 70 },
    ];

    hubs.forEach(h => {
      newNodes.push({ ...h, type: 'hub', connections: [0] });
    });

    // Create scattered bots connected to hubs
    let idCounter = 4;
    hubs.forEach(hub => {
      const botCount = Math.floor(Math.random() * 4) + 3;
      for (let i = 0; i < botCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 10 + 5;
        newNodes.push({
          id: idCounter++,
          x: hub.x + Math.cos(angle) * distance,
          y: hub.y + Math.sin(angle) * distance,
          type: 'bot',
          connections: [hub.id]
        });
      }
    });

    // Add some safe nodes unconnected or loosely connected
    for (let i = 0; i < 5; i++) {
       newNodes.push({
         id: idCounter++,
         x: Math.random() * 80 + 10,
         y: Math.random() * 80 + 10,
         type: 'safe',
         connections: [0] // Connected to target (e.g. real followers)
       });
    }

    setNodes(newNodes);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-fade-in">
      
      {/* Header Info */}
      <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Botnet Interaction Graph
          </h2>
          <p className="text-slate-400 text-sm mt-1">Visualizing engagement patterns and coordinated inauthentic behavior.</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
              <span className="text-slate-300">Bot/Malicious</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
              <span className="text-slate-300">Bot Hub</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></span>
              <span className="text-slate-300">Target Account</span>
           </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* The Graph SVG */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           {/* Lines */}
           {nodes.map(node => 
             node.connections.map(targetId => {
               const target = nodes.find(n => n.id === targetId);
               if (!target) return null;
               return (
                 <line 
                   key={`${node.id}-${targetId}`}
                   x1={node.x} 
                   y1={node.y} 
                   x2={target.x} 
                   y2={target.y} 
                   stroke={node.type === 'bot' ? '#ef4444' : '#334155'} 
                   strokeWidth="0.2"
                   className="opacity-40"
                 />
               );
             })
           )}

           {/* Nodes */}
           {nodes.map(node => (
             <g 
                key={node.id} 
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
             >
                {node.type === 'target' && (
                  <>
                    <circle cx={node.x} cy={node.y} r="3" fill="#06b6d4" className="animate-pulse" />
                    <circle cx={node.x} cy={node.y} r="6" stroke="#06b6d4" strokeWidth="0.5" fill="none" className="animate-ping opacity-20" />
                  </>
                )}
                
                {node.type === 'hub' && (
                  <circle cx={node.x} cy={node.y} r="2" fill="#f97316" />
                )}

                {node.type === 'bot' && (
                  <circle cx={node.x} cy={node.y} r="1" fill="#ef4444" />
                )}

                {node.type === 'safe' && (
                  <circle cx={node.x} cy={node.y} r="1" fill="#3b82f6" />
                )}
             </g>
           ))}
        </svg>

        {/* Node Details Overlay */}
        {selectedNode && (
           <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur border border-slate-600 p-4 rounded-lg w-64 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="font-bold text-white">Node #{selectedNode.id}</h3>
                 <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">×</button>
              </div>
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className={`font-mono uppercase ${
                       selectedNode.type === 'bot' ? 'text-red-400' : 
                       selectedNode.type === 'target' ? 'text-cyan-400' : 'text-slate-200'
                    }`}>{selectedNode.type}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="font-mono text-slate-300">{selectedNode.x.toFixed(0)}, {selectedNode.y.toFixed(0)}</span>
                 </div>
                 {selectedNode.type === 'bot' && (
                   <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-red-400 text-xs flex items-center gap-1">
                         <AlertTriangle className="w-3 h-3" />
                         High correlation with known bot farm signatures.
                      </p>
                   </div>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default BotnetGraph;
