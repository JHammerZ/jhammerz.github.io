import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Network, 
  Activity, 
  Zap, 
  Settings, 
  Radio, 
  Gauge, 
  Database, 
  RefreshCw, 
  Play, 
  Pause,
  Sliders,
  CheckCircle,
  TrendingUp,
  Server
} from 'lucide-react';

interface TelemetryNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  label: string;
  type: string;
  category: 'primary' | 'social' | 'audio' | 'business' | 'dev';
  bandwidth: number;       // Fake live metric
  saturation: number;      // Saturation %
  propagationDelay: number; // Delay in ms
  color: string;
  url: string;
}

interface TelemetryLink extends d3.SimulationLinkDatum<TelemetryNode> {
  source: string | TelemetryNode;
  target: string | TelemetryNode;
  value: number;
}

interface Particle {
  id: number;
  sourceId: string;
  targetId: string;
  progress: number; // ratio between 0 and 1
  speed: number;    // increment per frame
  color: string;
  size: number;
}

export default function SovereignD3FlowTelemetry() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<TelemetryNode | null>(null);
  const [propagationSpeed, setPropagationSpeed] = useState<number>(3.5); // 1 to 10
  const [saturationLevel, setSaturationLevel] = useState<number>(88); // %
  const [edgeRoutingType, setEdgeRoutingType] = useState<'optimised' | 'distributed' | 'saturation'>('optimised');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [totalIngested, setTotalIngested] = useState<number>(142095.42);
  const [activeHandshakeCount, setActiveHandshakeCount] = useState<number>(14);
  const [currentStatusLogs, setCurrentStatusLogs] = useState<string[]>([
    "CDM TRUTH INGESTION ACTIVE",
    "EDGE ROUTING: STABLE PATHWAYS DETECTED",
    "PROBING 14 SOVEREIGN SILO REPOSITORIES",
    "FLOW TELEMETRY SECURED WITH ZERO TOKEN BYPASS HANDSHAKE"
  ]);

  // Initial nodes
  const initialNodes: TelemetryNode[] = [
    { id: 'node-1', name: 'jhammerz.github.io', label: 'jhammerz.github.io', type: 'Primary Canonical Head', category: 'primary', bandwidth: 8.4, saturation: 94, propagationDelay: 4, color: '#00ffcc', url: 'https://jhammerz.github.io' },
    { id: 'node-2', name: 'tiktok.com/@jhammerzz', label: 'tiktok.com/@jhammerzz', type: 'Viral Stream Socket', category: 'social', bandwidth: 6.2, saturation: 87, propagationDelay: 14, color: '#ff007f', url: 'https://www.tiktok.com/@jhammerzz' },
    { id: 'node-3', name: 'linkedin.com/in/JHammerZ', label: 'linkedin.com/in/JHammerZ', type: 'Authority Core ID', category: 'business', bandwidth: 3.1, saturation: 74, propagationDelay: 22, color: '#00a0dc', url: 'https://www.linkedin.com/in/JHammerZ' },
    { id: 'node-4', name: 'youtube.com/@JHammerZ', label: 'youtube.com/JHammerZ', type: 'Audio-Video Matrix', category: 'social', bandwidth: 7.9, saturation: 91, propagationDelay: 8, color: '#ff0000', url: 'https://www.youtube.com/JHammerZ' },
    { id: 'node-5', name: 'instagram.com/jhammerzz', label: 'instagram.com/jhammerzz', type: 'Visual Micro-Stream', category: 'social', bandwidth: 4.8, saturation: 82, propagationDelay: 11, color: '#e1306c', url: 'https://www.instagram.com/jhammerzz' },
    { id: 'node-6', name: 'facebook.com/JHammerzz', label: 'facebook.com/JHammerzz', type: 'Social Validation Hub', category: 'social', bandwidth: 2.7, saturation: 61, propagationDelay: 28, color: '#1877f2', url: 'https://www.facebook.com/JHammerzz' },
    { id: 'node-7', name: 'jhammerz.carrd.co', label: 'jhammerz.carrd.co', type: 'Direct Traffic Lander', category: 'primary', bandwidth: 5.4, saturation: 89, propagationDelay: 6, color: '#ffcc00', url: 'https://jhammerz.carrd.co/' },
    { id: 'node-8', name: 'amazon.music/jhammerz', label: 'amazon.music/jhammerz', type: 'Amazon Sound Stream', category: 'audio', bandwidth: 4.1, saturation: 80, propagationDelay: 19, color: '#ff9900', url: 'https://music.amazon.com/artists/B0SGL7W/jhammerz' },
    { id: 'node-9', name: 'apple.music/jhammerz', label: 'apple.music/jhammerz', type: 'Apple Sound Stream', category: 'audio', bandwidth: 4.5, saturation: 83, propagationDelay: 16, color: '#fa243c', url: 'https://music.apple.com/us/artist/jhammerz/1845798346' },
    { id: 'node-10', name: 'bandlab.com/jhammerz', label: 'bandlab.com/jhammerz', type: 'Interactive Audio Box', category: 'audio', bandwidth: 5.9, saturation: 86, propagationDelay: 12, color: '#ee1256', url: 'https://music.bandlab.com/artist/781334284' },
    { id: 'node-11', name: 'xiaohongshu/jhammerz', label: 'xiaohongshu/jhammerz', type: 'Global Vector Head', category: 'social', bandwidth: 3.8, saturation: 79, propagationDelay: 32, color: '#ff2442', url: 'https://www.xiaohongshu.com/user/profile/JHammerZ' },
    { id: 'node-12', name: 'github.com/JHammerZ/jhammerz.github.io', label: 'github.com/JHammerZ/jhammerz.github.io', type: 'Sovereign Code Base', category: 'dev', bandwidth: 9.8, saturation: 98, propagationDelay: 2, color: '#c9d1d9', url: 'https://github.com/JHammerZ/jhammerz.github.io' },
    { id: 'node-13', name: 'impact.com/secure', label: 'impact.com/secure', type: 'Consolidated Value Ingress', category: 'business', bandwidth: 5.0, saturation: 85, propagationDelay: 15, color: '#00e5ff', url: 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/' },
    { id: 'node-14', name: 'spotify.artist/7vRd2', label: 'spotify.artist/7vRd2', type: 'Interactive Archive Socket', category: 'audio', bandwidth: 9.2, saturation: 95, propagationDelay: 5, color: '#1db954', url: 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79' }
  ];

  // Links connecting the 14 silos into a unified CDM Edge Mesh
  const initialLinks: TelemetryLink[] = [
    { source: 'node-1', target: 'node-12', value: 8 },  // Principal Head -> GitHub Code Base
    { source: 'node-12', target: 'node-3', value: 5 },  // GitHub -> LinkedIn Core
    { source: 'node-1', target: 'node-7', value: 6 },   // Principal Head -> Carrd Lander
    { source: 'node-4', target: 'node-2', value: 5 },   // YouTube -> TikTok (Audio-Video replication)
    { source: 'node-2', target: 'node-5', value: 4 },   // TikTok -> Instagram (Viral replication)
    { source: 'node-5', target: 'node-6', value: 4 },   // Instagram -> Facebook (Social validation)
    { source: 'node-4', target: 'node-14', value: 7 },  // YouTube -> Spotify Link
    { source: 'node-14', target: 'node-8', value: 4 },  // Spotify -> Amazon Music
    { source: 'node-14', target: 'node-9', value: 4 },  // Spotify -> Apple Music
    { source: 'node-10', target: 'node-14', value: 6 }, // Bandlab -> Spotify
    { source: 'node-11', target: 'node-5', value: 5 },  // Xiaohongshu -> Instagram
    { source: 'node-13', target: 'node-7', value: 5 },  // Impact Ingress -> Carrd Lander
    { source: 'node-1', target: 'node-3', value: 6 },   // Principal Head -> LinkedIn Authority
    { source: 'node-12', target: 'node-14', value: 5 }, // GitHub -> Spotify core integration info
    { source: 'node-11', target: 'node-12', value: 4 }, // Xiaohongshu -> GitHub
    { source: 'node-13', target: 'node-3', value: 5 }   // Impact -> LinkedIn
  ];

  useEffect(() => {
    // Generate simulated logs over time
    const interval = setInterval(() => {
      const logs = [
        `PROBING CDM CELL: Bandwidth usage peak at ${(Math.random() * 5 + 4).toFixed(2)} GBps`,
        `TELEMETRY INGESTION: Synced node "${initialNodes[Math.floor(Math.random() * initialNodes.length)].name}"`,
        `EDGE REPLICATION: Staged propagation packets: ${Math.floor(Math.random() * 120 + 40)} units`,
        `CANONICAL ROUTE STATUS: 100% data fidelity maintained inside CDM Core`,
        `AUTO-HANDSHAKE SECURE: Bypassing token constraints synchronously (Super Admin Status: LIVE)`
      ];
      setCurrentStatusLogs(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev.slice(0, 5)]);
      setTotalIngested(prev => prev + (Math.random() * 45.2));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth || 550;
    let height = 380;
    
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nodes and links local references
    const nodes: TelemetryNode[] = JSON.parse(JSON.stringify(initialNodes));
    const links: TelemetryLink[] = JSON.parse(JSON.stringify(initialLinks));

    // D3 Force Simulation setup
    const simulation = d3.forceSimulation<TelemetryNode>(nodes)
      .force("link", d3.forceLink<TelemetryNode, TelemetryLink>(links).id((d: any) => d.id).distance(105))
      .force("charge", d3.forceManyBody().strength(-160))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    // Particle pool
    let particles: Particle[] = [];
    let particleIdCounter = 0;

    // Spawn a particle along random link
    function spawnParticle() {
      if (!isPlaying || links.length === 0) return;
      const link = links[Math.floor(Math.random() * links.length)];
      
      // Determine source & target parsed IDs
      const sId = typeof link.source === 'object' ? (link.source as TelemetryNode).id : link.source;
      const tId = typeof link.target === 'object' ? (link.target as TelemetryNode).id : link.target;
      
      if (!sId || !tId) return;

      const sourceNode = nodes.find(n => n.id === sId);
      if (!sourceNode) return;

      particles.push({
        id: particleIdCounter++,
        sourceId: sId,
        targetId: tId,
        progress: 0,
        speed: (Math.random() * 0.01 + 0.005) * (propagationSpeed / 3.5),
        color: sourceNode.color || "#00e5ff",
        size: Math.random() * 2 + 1.5
      });
    }

    // Animation Loop
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Network Connections (Links)
      ctx.lineWidth = 1.2;
      links.forEach((link: any) => {
        const grad = ctx.createLinearGradient(link.source.x, link.source.y, link.target.x, link.target.y);
        grad.addColorStop(0, `${link.source.color || '#333333'}40`);
        grad.addColorStop(0.5, '#1e293b');
        grad.addColorStop(1, `${link.target.color || '#333333'}40`);

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();

        // Subtly pulse background flow pathways
        ctx.strokeStyle = `${link.source.color}15`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.stroke();
        ctx.lineWidth = 1.2;
      });

      // 2. Update and Draw Flowing Telemetry Particles
      if (isPlaying && Math.random() < 0.15 * (propagationSpeed / 3)) {
        spawnParticle();
      }

      particles.forEach((p, idx) => {
        const sourceNode = nodes.find(n => n.id === p.sourceId);
        const targetNode = nodes.find(n => n.id === p.targetId);

        if (sourceNode && targetNode && sourceNode.x !== undefined && targetNode.x !== undefined) {
          // Calculate linear interpolation coordinates
          const x = sourceNode.x + (targetNode.x! - sourceNode.x!) * p.progress;
          const y = sourceNode.y + (targetNode.y! - sourceNode.y!) * p.progress;

          // Drawing glowing dynamic particle
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Progress advancement
          if (isPlaying) {
            p.progress += p.speed * (propagationSpeed / 3.5);
          }
        }
      });

      // Remove completed particles
      particles = particles.filter(p => p.progress < 1);

      // 3. Draw Nodes (Silos)
      nodes.forEach((node: any) => {
        // Drop simple soft backlights on active hovered/clicked node
        const isSelected = selectedNode?.id === node.id;
        
        ctx.shadowBlur = isSelected ? 12 : 3;
        ctx.shadowColor = node.color;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 9 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#ffffff' : node.color;
        ctx.fill();

        // Node outline rings (concentric telemetry rings)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `${node.color}50`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? 14 : 10, 0, 2 * Math.PI);
        ctx.stroke();

        // Node title rendering
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        
        // Split for aesthetic fit
        const printableLabel = node.label.replace('https://', '').replace('www.', '');
        ctx.fillText(printableLabel, node.x, node.y - 15);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth || 550;
      canvas.width = width;
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.2).restart();
    };

    window.addEventListener('resize', handleResize);

    // Dynamic mouse clicks on nodes inside simulation
    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      let clicked: TelemetryNode | null = null;
      let minDistance = 20; // tap-radius

      nodes.forEach(node => {
        if (node.x !== undefined && node.y !== undefined) {
          const dist = Math.hypot(node.x - clickX, node.y - clickY);
          if (dist < minDistance) {
            clicked = node;
            minDistance = dist;
          }
        }
      });

      setSelectedNode(clicked);
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      simulation.stop();
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, propagationSpeed, selectedNode?.id]);

  // Quick preset booster trigger
  const triggerSpeedBoost = () => {
    setPropagationSpeed(9.5);
    setTotalIngested(prev => prev + 500);
    setCurrentStatusLogs(prev => [
      `🔋 PROMOTING PROPAGATION CHANNELS: Saturation point maximized at ${saturationLevel}%`,
      "CDM TRUTH BROADCAST: Accelerating payload dispatch telemetry globally.",
      ...prev.slice(0, 3)
    ]);
    setTimeout(() => {
      setPropagationSpeed(3.8);
    }, 4000);
  };

  return (
    <div id="sovereign-telemetry-portal" className="bg-sovereign-card brutalist-border p-5 space-y-4 relative w-full h-full flex flex-col justify-between">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-900 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 bg-cyan-950/40 text-cyan-400 border border-cyan-800/60 rounded text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-ping" />
            Live Ingestion Graph
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
              Sovereign CDM Edge Flow Telemetry
            </h3>
            <p className="text-[9px] text-gray-500 font-mono uppercase">
              14 Connected Silos • Decentralized Ingestion Matrix
            </p>
          </div>
        </div>
        
        {/* Aggregated Realtime Stats */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="block text-[8px] font-mono text-gray-500 uppercase">SATURATED INDEX</span>
            <span className="text-[11px] font-mono text-sovereign-neon font-bold">{saturationLevel}%</span>
          </div>
          <div className="border-l border-gray-900 pl-4">
            <span className="block text-[8px] font-mono text-gray-500 uppercase">CDM EDGE PIPED</span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">{totalIngested.toFixed(2)} MB</span>
          </div>
        </div>
      </div>

      {/* Main Core Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
        
        {/* Flow visual stage (9 cols / large desktop) */}
        <div ref={containerRef} className="col-span-1 lg:col-span-8 bg-black/50 border border-gray-900 rounded-lg p-1 relative min-h-[300px] flex items-center justify-center overflow-hidden">
          
          {/* Overlay Grid Line Aesthetic */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

          {/* D3 Simulation Canvas */}
          <canvas ref={canvasRef} className="block cursor-crosshair z-10 w-full" />

          {/* Live indicator tag */}
          <div className="absolute top-3 left-3 bg-black/80 border border-gray-800 rounded px-2 py-1 flex items-center gap-1 text-[8.5px] font-mono text-gray-400 z-10 select-none">
            <Server className="w-2.5 h-2.5 text-sovereign-neon animate-pulse" />
            <span>INTERACTIVE NEURAL NETWORK: TAP NODES TO AUDIT TELEMETRY</span>
          </div>

          {/* Controls overlay bottom left */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 px-2.5 bg-zinc-900/90 hover:bg-white hover:text-black border border-gray-800 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-2.5 h-2.5 text-amber-500" /> : <Play className="w-2.5 h-2.5 text-green-500" />}
              {isPlaying ? 'PAUSE FLOW' : 'RESUME FLOW'}
            </button>
            <button 
              onClick={triggerSpeedBoost}
              className="p-1 px-2.5 bg-zinc-900/90 hover:border-cyan-400 hover:text-cyan-400 border border-gray-800 rounded text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
            >
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              CDM FLOW BLITZ
            </button>
          </div>
        </div>

        {/* Dynamic telemetry panel (4 cols / lateral audit) */}
        <div className="col-span-1 lg:col-span-4 bg-black/60 border border-gray-900 rounded-lg p-4 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-950 pb-2">
              <Sliders className="w-3.5 h-3.5 text-gray-400" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                TELEMETRY CONTROLS
              </h4>
            </div>

            {/* Prop Speed Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-450 uppercase">
                <span>Propagation Speed</span>
                <span className="text-cyan-400 font-bold">{propagationSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.5"
                value={propagationSpeed}
                onChange={(e) => setPropagationSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-900 accent-cyan-400 rounded cursor-ew-resize appearance-none" 
              />
            </div>

            {/* Saturation Threshold Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-450 uppercase">
                <span>Optimal Saturation Limit</span>
                <span className="text-sovereign-neon font-bold">{saturationLevel}%</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={saturationLevel}
                onChange={(e) => setSaturationLevel(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-900 accent-sovereign-neon rounded cursor-ew-resize appearance-none" 
              />
            </div>

            {/* Edge routing selector */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono text-gray-400 block uppercase">CONDUIT OPTIMIZATION</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['optimised', 'distributed', 'saturation'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setEdgeRoutingType(r);
                      setCurrentStatusLogs(p => [`CDM RE-ROUTE: Switched strategy layout to [${r.toUpperCase()}]`, ...p.slice(0, 4)]);
                    }}
                    className={`p-1 py-1.5 border font-mono rounded text-[7.5px] uppercase font-bold transition-all ${
                      edgeRoutingType === r
                        ? 'bg-white/10 text-white border-white'
                        : 'bg-transparent text-gray-500 border-gray-900 hover:border-gray-800 hover:text-gray-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Node Details Block */}
          <div className="p-3 bg-[#0d0e12]/80 border border-gray-900 rounded space-y-2 flex-1 flex flex-col justify-center min-h-[120px]">
            {selectedNode ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[7.5px] font-mono bg-white/10 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                      {selectedNode.type}
                    </span>
                    <h5 className="text-[11px] font-bold text-white mt-1 font-mono break-all leading-tight">
                      {selectedNode.name}
                    </h5>
                  </div>
                  <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: selectedNode.color }} />
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-gray-950 pt-2 text-center">
                  <div>
                    <span className="block text-[7px] font-mono text-gray-500 uppercase">FLOW RATE</span>
                    <span className="text-[9.5px] font-mono font-bold text-gray-200">{selectedNode.bandwidth.toFixed(1)} GB/s</span>
                  </div>
                  <div>
                    <span className="block text-[7px] font-mono text-gray-500 uppercase">SATURATE %</span>
                    <span className="text-[9.5px] font-mono font-bold text-gray-250" style={{ color: selectedNode.color }}>
                      {Math.min(100, Math.round(selectedNode.saturation * (saturationLevel / 88)))}%
                    </span>
                  </div>
                  <div>
                    <span className="block text-[7px] font-mono text-gray-500 uppercase">DELAY LAT</span>
                    <span className="text-[9.5px] font-mono font-bold text-gray-200">{Math.round(selectedNode.propagationDelay / (propagationSpeed / 3.5))}ms</span>
                  </div>
                </div>

                <a 
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-[7.5px] font-mono text-gray-400 hover:text-white hover:underline uppercase pt-1 border-t border-white/5"
                >
                  Inspect Live Remote Silo Source →
                </a>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <Gauge className="w-6 h-6 text-gray-700 mx-auto animate-pulse" />
                <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                  NO CANONICAL SILO ELECTED
                </p>
                <p className="text-[7.5px] text-gray-600 font-sans leading-tight max-w-[190px] mx-auto">
                  Audit any active node cluster on the flow topology to ingest deep metrics.
                </p>
              </div>
            )}
          </div>

          {/* Core Logger Stream */}
          <div className="bg-black/90 p-2.5 rounded border border-gray-950 text-left">
            <span className="block text-[7px] font-mono text-gray-600 uppercase tracking-widest mb-1.5 border-b border-gray-950 pb-1">
              PROG CONDUIT LOG MONITORING
            </span>
            <div className="space-y-1 h-[55px] overflow-hidden no-scrollbar">
              {currentStatusLogs.map((log, index) => (
                <p key={index} className="text-[7.5px] font-mono text-zinc-400 truncate flex items-center gap-1">
                  <span className="text-sovereign-neon">»</span> {log}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
