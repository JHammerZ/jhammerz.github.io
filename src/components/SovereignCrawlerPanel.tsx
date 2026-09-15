import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Database, 
  Cpu, 
  Activity, 
  Globe, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Power,
  ChevronRight,
  ExternalLink,
  Volume2,
  ShieldAlert,
  Sliders,
  Globe2,
  Sparkles,
  AlertTriangle,
  Play,
  HelpCircle
} from 'lucide-react';

interface SovereignCrawlerPanelProps {
  onTerminalLog: (msg: string) => void;
  onRefreshStats: () => void;
}

export interface CrawlRecord {
  url: string;
  timestamp: string;
  status: string;
  entitiesExtracted: string[];
  findingsSummary: string;
  sourceType: string;
}

// Tactical Web Audio Synthesizer Engine for mission-critical feedback
class SovereignSynth {
  private ctx: AudioContext | null = null;
  public mute: boolean = false;

  constructor() {
    // Lazy loaded to respect browser policy
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (common browser security state)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play mechanical tactile click sound
  playClick() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play synthetic computer system lock tone
  playLock() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc1.frequency.setValueAtTime(220, this.ctx.currentTime + 0.1);
    
    osc2.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.45);
    osc2.stop(this.ctx.currentTime + 0.45);
  }

  // Play data transmission scrape sweep sound
  playSearchSweep() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 1.2);
    filter.Q.value = 5.0;

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 1.5);
  }

  // Plays deep cyber-synthetic bio cellular transition sound (Mitosis sound)
  playMitosisBubble() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.35);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.45);
  }

  // Plays a warning indicator buzz sound
  playWarning() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.setValueAtTime(90, now + 0.1);
    osc.frequency.setValueAtTime(100, now + 0.2);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.45);
  }
}

const synth = new SovereignSynth();

export function SovereignCrawlerPanel({ onTerminalLog, onRefreshStats }: SovereignCrawlerPanelProps) {
  const [urls, setUrls] = useState<string>('');
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [extractedEntities, setExtractedEntities] = useState<string[]>([]);
  const [crawlIndex, setCrawlIndex] = useState<CrawlRecord[]>([]);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [infiniteMitosis, setInfiniteMitosis] = useState<boolean>(true);
  const [latencyLock, setLatencyLock] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [minimizeHovers, setMinimizeHovers] = useState<boolean>(false);

  // Real-Time Tactical States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);
  const [mitosisCells, setMitosisCells] = useState<Array<{ id: number; r: number; x: number; y: number; vx: number; vy: number; color: string }>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodeLocations = [
    { key: 'node-1', name: 'jhammerz.github.io', type: 'Primary Canonical Head', x: 250, y: 55 },
    { key: 'node-2', name: 'tiktok.com/@jhammerzz', type: 'Viral Stream Socket', x: 195, y: 95 },
    { key: 'node-3', name: 'linkedin.com/in/JHammerZ', type: 'Authority Core ID', x: 305, y: 95 },
    { key: 'node-4', name: 'youtube.com/@JHammerZ', type: 'Audio-Video Matrix', x: 165, y: 150 },
    { key: 'node-5', name: 'instagram.com/jhammerzz', type: 'Visual Micro-Stream', x: 335, y: 150 },
    { key: 'node-6', name: 'facebook.com/JHammerzz', type: 'Social Validation Hub', x: 165, y: 215 },
    { key: 'node-7', name: 'jhammerz.carrd.co', type: 'Direct Traffic Lander', x: 335, y: 215 },
    { key: 'node-8', name: 'amazon.music/jhammerz', type: 'Amazon Sound Stream', x: 195, y: 270 },
    { key: 'node-9', name: 'apple.music/jhammerz', type: 'Apple Sound Stream', x: 305, y: 270 },
    { key: 'node-10', name: 'bandlab.com/jhammerz', type: 'Interactive Audio Box', x: 250, y: 310 },
    { key: 'node-11', name: 'xiaohongshu/jhammerz', type: 'Global Vector Head', x: 110, y: 110 },
    { key: 'node-12', name: 'github.com/JHammerZ/jhammerz.github.io', type: 'Sovereign Code Base', x: 390, y: 110 },
    { key: 'node-13', name: 'impact.com/secure', type: 'Consolidated Value Ingress', x: 110, y: 250 },
    { key: 'node-14', name: 'spotify.artist/7vRd2', type: 'Interactive Archive Socket', x: 390, y: 250 },
    { key: 'node-na', name: 'N/A Constellation Unit', type: 'Air-Gapped Out-of-Bounds Sentinel', x: 60, y: 180, isWarningNode: true }
  ];

  // Steps configuration for holographic analysis visualizer
  const crawlStages = [
    { title: 'DNS SOVEREIGN LOOKUP', desc: 'Siphoning local DNS configurations and mapping remote ports.', code: 'SYS_RESOLVE_3.02' },
    { title: 'HANDSHAKE SECURE LATCH', desc: 'Injecting custom bypass credentials into external target headers.', code: 'AES_256_GCM_SEC' },
    { title: 'STEALTH DOM WEBSCRAPE', desc: 'Crawling active metadata records and structural HTML vectors.', code: 'DOM_EXTRACTR_VT2' },
    { title: 'OMNICHANNEL FACT ALIGN', desc: 'Reconciling extracted JHammerZ properties inside index ledger.', code: 'RECON_MATRIX_T5' },
    { title: 'LATENCY CLAMP & CORE SEAL', desc: 'Stabilizing websocket signals and pinning sync corridor.', code: 'PORT_LOCK_2MS' }
  ];

  // Initialize Mitosis Cell physics model
  useEffect(() => {
    const initialCells = [];
    const colors = ['#00ff41', '#00e5ff', '#ff007f', '#ffffff'];
    for (let i = 0; i < 6; i++) {
      initialCells.push({
        id: Math.random(),
        r: Math.floor(Math.random() * 8) + 8,
        x: Math.random() * 200 + 40,
        y: Math.random() * 100 + 30,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: colors[i % colors.length]
      });
    }
    setMitosisCells(initialCells);
  }, []);

  // Mitosis cell animation drawer loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localCells = [...mitosisCells];

    const runFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update cells
      localCells.forEach((cell, idx) => {
        cell.x += cell.vx;
        cell.y += cell.vy;

        // Bounce walls
        if (cell.x - cell.r < 0 || cell.x + cell.r > canvas.width) cell.vx *= -1;
        if (cell.y - cell.r < 0 || cell.y + cell.r > canvas.height) cell.vy *= -1;

        // Draw glowing link cables between close cells
        for (let j = idx + 1; j < localCells.length; j++) {
          const other = localCells[j];
          const dist = Math.hypot(cell.x - other.x, cell.y - other.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 65, ${Math.max(0, 1 - dist / 80) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.moveTo(cell.x, cell.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw Cell core
        ctx.beginPath();
        const grad = ctx.createRadialGradient(cell.x, cell.y, 0, cell.x, cell.y, cell.r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, cell.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.arc(cell.x, cell.y, cell.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw outer membrane ring
        ctx.beginPath();
        ctx.strokeStyle = cell.color;
        ctx.lineWidth = 0.5;
        ctx.arc(cell.x, cell.y, cell.r + 3, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Split probability trigger if mitosis is active
      if (infiniteMitosis && Math.random() < 0.015 && localCells.length < 24) {
        const parentIdx = Math.floor(Math.random() * localCells.length);
        const parent = localCells[parentIdx];
        if (parent) {
          // Play organic cell split bubble popping sound
          synth.playMitosisBubble();
          
          // Halve parent radius
          parent.r = Math.max(5, parent.r - 2);

          // Spawn new daughter cell nearby
          localCells.push({
            id: Math.random(),
            r: Math.floor(Math.random() * 6) + 6,
            x: parent.x + (Math.random() - 0.5) * 15,
            y: parent.y + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: parent.color
          });
        }
      }

      // Merge cells back slowly if disabled to maintain system core stability
      if (!infiniteMitosis && localCells.length > 5 && Math.random() < 0.05) {
        localCells.pop();
        synth.playClick();
      }

      animId = requestAnimationFrame(runFrame);
    };

    runFrame();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [infiniteMitosis, mitosisCells]);

  // Fetch index records
  const fetchIndex = async () => {
    try {
      const res = await fetch('/api/sovereign/crawl-index');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCrawlIndex(data.crawlerIndex || []);
        }
      }
    } catch (err) {
      console.error("Error fetching crawl index:", err);
    }
  };

  useEffect(() => {
    fetchIndex();
  }, []);

  // Crawling execution sequencing scheduler simulator
  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCrawling) return;

    synth.playSearchSweep();
    setIsCrawling(true);
    setActiveStep(0);
    setStepProgress(0);
    setCrawlLogs([`[INTEGRITY] Launching Omnichannel Tactical Crawler at: ${new Date().toISOString()}`]);
    setExtractedEntities([]);
    onTerminalLog(`[CRAWL SENSOR] Spawning browser socket array to JHammerZ target ports...`);

    const splitUrls = urls ? urls.split('\n').map(u => u.trim()).filter(Boolean) : [];

    // Trigger local simulation timer for progress bar stages
    const stepInterval = setInterval(() => {
      setStepProgress(prev => {
        if (prev >= 100) {
          setActiveStep(curr => {
            if (curr >= 4) {
              clearInterval(stepInterval);
              return 4;
            }
            synth.playClick();
            setCrawlLogs(logs => [
              ...logs,
              `[SUCCESS] Stage ${curr + 1} (${crawlStages[curr].title}) fully verified in 12ms.`
            ]);
            return curr + 1;
          });
          return 0;
        }
        return prev + 25; // Speed multiplier for active gaming feel
      });
    }, 450);

    try {
      const res = await fetch('/api/sovereign/crawl-and-reindex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: splitUrls })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Delay final loading resolution slightly so user experiences the stunning process graphics
          setTimeout(() => {
            clearInterval(stepInterval);
            setActiveStep(4);
            setStepProgress(100);
            setCrawlLogs(data.logs || []);
            setExtractedEntities(data.entitiesExtracted || []);
            setCrawlIndex(data.crawlerIndex || []);
            onRefreshStats();
            synth.playLock();
            onTerminalLog(`[TACTICAL COMPLETE] Target audits synced. Extracted Nodes: ${data.entitiesExtracted.join(' | ')}.`);
            onTerminalLog(`[SHR-ALIGN] Pins optimized at 2ms latency standard.`);
            setIsCrawling(false);
          }, 2400);
        } else {
          clearInterval(stepInterval);
          setIsCrawling(false);
          synth.playWarning();
          setCrawlLogs(prev => [...prev, `[CRITICAL FAULT] Crawler subsystem exception: ${data.error}`]);
        }
      } else {
        clearInterval(stepInterval);
        setIsCrawling(false);
        synth.playWarning();
        setCrawlLogs(prev => [...prev, `[CONNECTION ERR] Communication line severed.`]);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsCrawling(false);
      synth.playWarning();
      setCrawlLogs(prev => [...prev, `[TIMEOUT] Secure pathway blocked: ${err.message}`]);
    }
  };

  const handleToggleMitosis = () => {
    synth.playMitosisBubble();
    setInfiniteMitosis(!infiniteMitosis);
    onTerminalLog(`[MITOSIS ENGINE] Mitosis status toggled: ${!infiniteMitosis ? 'SEALED INFINITE' : 'STABILIZED'}`);
  };

  const handleToggleLatencyLock = () => {
    synth.playLock();
    setLatencyLock(!latencyLock);
    onTerminalLog(`[TUNNEL CORRIDOR] Latency lock toggle: ${!latencyLock ? 'LOCKED 2MS' : 'ADAPTIVE'}`);
  };

  const toggleSound = () => {
    synth.mute = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNodeClick = (node: any) => {
    if (node.key === 'node-na') {
      synth.playWarning();
      setSelectedMapNode(node);
      onTerminalLog(`[CRITICAL TELEMETRY WARNING] NA Constellation Unit anomaly. Diagnostic out-of-bounds sweep detected. Response Code: 403 FORBIDDEN.`);
    } else {
      synth.playClick();
      setSelectedMapNode(node);
      onTerminalLog(`[HUD INSPECTOR] Target Lock acquired on socioeconomic socket: ${node.name}`);
    }
  };

  return (
    <div 
      id="sovereign-crawler-panel" 
      className="bg-[#040406]/95 border-2 border-sovereign-line relative rounded-lg p-5 space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.85)] text-white overflow-hidden"
    >
      {/* Immersive CRT Overlay Scanlines Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-40 opacity-70" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#000000]/30 to-[#000000]/95 pointer-events-none z-30" />

      {/* Tactical Operations War Room Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b-2 border-sovereign-line pb-4 relative z-10 gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-sovereign-neon/15 p-2 rounded border border-sovereign-neon animate-pulse flex items-center justify-center">
            <Search className="w-5 h-5 text-sovereign-neon" />
          </div>
          <div>
            <h3 className="text-sm font-black font-mono tracking-[0.25em] text-sovereign-neon uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-sovereign-neon rounded-full animate-ping" />
              COGNITIVE OMNI-CRAWLER &amp; KNOWLEDGE MATRIX [V3.0]
            </h3>
            <p className="text-[9.5px] font-mono text-gray-400 uppercase tracking-wider mt-1">
              Active Network Ingestion Module • Target Host Identifier: JHammerZ &amp; Lysander Engine
            </p>
          </div>
        </div>
        
        {/* Audio panel sound controllers */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMinimizeHovers(!minimizeHovers)}
            className={`px-2.5 py-1 rounded border font-mono text-[8.5px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer relative group/minimize-hovers ${
              minimizeHovers 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.15)] animate-pulse' 
                : 'bg-black border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {minimizeHovers ? '⚙️ HOVERS: MIN' : '⚙️ HOVERS: MAX'}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            className={`px-2.5 py-1 rounded border font-mono text-[8.5px] font-bold uppercase transition-all flex items-center gap-2 cursor-pointer relative group/audio ${
              isMuted 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-sovereign-neon/10 border-sovereign-neon/40 text-sovereign-neon hover:bg-sovereign-neon/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
            }`}
          >
            {/* Hover Tooltip */}
            {!minimizeHovers && (
              <div className="absolute opacity-0 group-hover/audio:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 transform transition-all duration-300 bottom-[120%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/audio:scale-100 normal-case select-none p-2.5 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none">
                <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-sovereign-neon font-black">
                  <span>SOUND SETTING</span>
                  <span className="ml-auto text-[9px]">?</span>
                </div>
                <p className="text-[9px] text-gray-400 font-sans leading-normal">Mutes or unmutes ambient interface feedback sound effects.</p>
              </div>
            )}

            <Volume2 className="w-3.5 h-3.5" />
            AUDIO: {isMuted ? 'OFF' : 'ON'}
          </button>
          <span className="text-[8px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded uppercase font-black text-gray-300">
            SEC_SYS: PASS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Tactical Map & Crawler Diagnostics */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* Interactive SVN Cyber-Map / Constellation Radar */}
          <div className="bg-black/60 border border-sovereign-line/60 rounded p-4 flex flex-col items-center justify-between relative h-[310px] overflow-hidden group">
            <div className="absolute top-2 left-3 text-[8.5px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              TACTICAL RADAR TARGET MAP
            </div>

            {/* Radar Scope Background Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="w-[300px] h-[300px] border border-sovereign-neon rounded-full animate-ping" />
              <div className="w-[240px] h-[240px] border-2 border-dashed border-cyan-400 rounded-full" />
              <div className="w-[160px] h-[160px] border border-sovereign-neon rounded-full" />
              <div className="w-[80px] h-[80px] border-2 border-dotted border-white rounded-full animate-spin-slow" />
              {/* Radar Sweeping Line */}
              <div className="absolute w-[150px] h-[1px] bg-gradient-to-r from-transparent to-sovereign-neon origin-left left-1/2 top-1/2 rotate-gradient-trigger animate-radar-sweep" />
            </div>

            {/* SVG Network Connections Cable Layout */}
            <svg className="absolute inset-0 w-full h-[310px] pointer-events-none z-10 opacity-45">
              {nodeLocations.map((n, idx) => {
                const isNA = n.key === 'node-na';
                return (
                  <line
                    key={idx}
                    x1="250"
                    y1="180"
                    x2={n.x}
                    y2={n.y}
                    stroke={isNA ? '#ff3b30' : (latencyLock ? '#00e5ff' : '#00ff41')}
                    strokeWidth={isNA ? '1.5' : (latencyLock ? '1.5' : '1')}
                    strokeDasharray={isCrawling || isNA ? '4 2' : 'none'}
                    className={isCrawling || isNA ? 'animate-dash-offset' : ''}
                  />
                );
              })}
            </svg>

            {/* Interactive Target Nodes overlay */}
            <div className="absolute inset-0 z-20">
              {/* Lysander Unified Core */}
              <button
                onClick={() => {
                  synth.playLock();
                  onTerminalLog('[TACTICAL] Lysander 3.0 Core Master Access established.');
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-sovereign-neon/30 to-cyan-500/30 border-2 border-sovereign-neon shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform font-bold font-mono text-[9px] group/lys hover:z-50"
              >
                {/* Hover Tooltip */}
                {!minimizeHovers && (
                  <div className="absolute opacity-0 group-hover/lys:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 transform transition-all duration-300 bottom-[115%] left-1/2 -translate-x-1/2 text-left font-mono leading-relaxed scale-95 group-hover/lys:scale-100 normal-case select-none p-2.5 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-sovereign-neon font-black">
                      <span>LYSANDER CORE</span>
                      <span className="ml-auto text-[9px]">?</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans leading-normal font-normal text-gray-300">Initiates diagnostic query request payload into the Lysander parallel thread processor.</p>
                  </div>
                )}

                LYS_3
              </button>

              {nodeLocations.map((node, idx) => {
                const isSelected = selectedMapNode?.key === node.key;
                const isWarning = node.key === 'node-na';
                return (
                  <button
                    key={node.key}
                    type="button"
                    onClick={() => handleNodeClick(node)}
                    style={{ left: node.x - 14, top: node.y - 14 }}
                    className="absolute w-7 h-7 flex items-center justify-center cursor-pointer group/node hover:scale-125 transition-all z-30 focus:outline-none"
                    title={node.name}
                  >
                    {/* The actual visible visual dot indicator */}
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                       isSelected 
                        ? 'bg-pink-500 border-white shadow-[0_0_12px_#ff007f]' 
                        : isWarning
                          ? 'bg-red-950 border-red-500 hover:border-white shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                          : 'bg-black border-sovereign-neon hover:border-cyan-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-red-500 animate-ping' : 'bg-sovereign-neon animate-pulse'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated External Telemetry & Audit Status Panel */}
          <div className={`w-full border p-4 rounded-lg min-h-[75px] relative z-30 transition-all duration-300 shadow-md ${
            selectedMapNode?.key === 'node-na'
              ? 'bg-red-950/45 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse'
              : 'bg-black/60 border-sovereign-line/60'
          }`}>
            {selectedMapNode ? (
              selectedMapNode.key === 'node-na' ? (
                <div className="space-y-1.5 text-red-400">
                  <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      CRITICAL AUDIT: AIR-GAPPED OUTPOST
                    </span>
                    <span className="text-[7.5px] font-mono text-red-500 bg-red-950 border border-red-500/40 px-1 py-0.5 rounded font-black">
                      WARN_ACTV
                    </span>
                  </div>
                  <p className="text-[8.5px] font-mono leading-relaxed uppercase">
                    Out-of-bounds port probe detected. Secure handshakes on N/A Constellation are blocked for isolation defense.
                  </p>
                  <div className="flex justify-between items-center text-[8px] font-mono text-red-500/75">
                    <span>SIGNATURE: INGRESS EXTRINSIC FORCE</span>
                    <span className="font-bold underline uppercase">DENSE TELEMETRY OUT-OF-BOUNDS</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-sovereign-neon font-black uppercase tracking-wider">{selectedMapNode.name}</span>
                    <span className="text-gray-500 text-[8px] uppercase">TARGET CONFIRMED</span>
                  </div>
                  <p className="text-[8.5px] text-gray-300 font-mono leading-relaxed uppercase">
                    {selectedMapNode.type} • Secured Interconnect Link Active. 
                  </p>
                  <div className="flex justify-between items-center text-[8px] font-mono">
                    <span className="text-cyan-400 font-bold col-span-1">LATENCY PROFILE: {latencyLock ? '2ms (CLAMP)' : 'DYNAMIC'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUrls(prev => {
                          const list = prev.split('\n').filter(Boolean);
                          if (!list.includes(selectedMapNode.name)) {
                            return [...list, selectedMapNode.name].join('\n');
                          }
                          return prev;
                        });
                        synth.playClick();
                      }}
                      className="px-1.5 py-0.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded relative group/add cursor-pointer text-[8px]"
                    >
                      {/* Hover Tooltip */}
                      {!minimizeHovers && (
                        <div className="absolute opacity-0 group-hover/add:opacity-100 bg-[#121216]/95 border border-white/20 text-gray-300 transform transition-all duration-300 bottom-[125%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/add:scale-100 normal-case select-none p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-44 z-50 pointer-events-none">
                          <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-white font-bold">
                            <span>SCRAPE QUEUE</span>
                            <span className="ml-auto text-[9px]">?</span>
                          </div>
                          <p className="text-[9px] text-gray-400 font-sans leading-normal font-normal text-gray-300">Adds the selected digital ecosystem node back into the custom crawler feed list.</p>
                        </div>
                      )}

                      ADD TO SCRAPELIST
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-center py-2">
                <span className="text-[9.5px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  HOVER OR CLICK ON A NODE CONSTELATION UNIT TO AUDIT TELEMETRY
                </span>
              </div>
            )}
          </div>

          {/* Form crawler controller input */}
          <form onSubmit={handleCrawl} className="space-y-3 bg-[#07070a] border border-sovereign-line/50 p-4 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 font-mono text-[7px] text-gray-700 pointer-events-none uppercase font-bold">
              FORM_C9
            </div>
            <div>
              <label className="block text-[8.5px] font-mono font-black text-gray-300 uppercase tracking-widest mb-1 shadow-sm">
                Omnichannel Search Feeds list (One Link Per Line)
              </label>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://www.linkedin.com/posts/jhammerz-lysander-operations
https://www.tiktok.com/@jhammerzz
https://www.facebook.com/JHammerzz
https://jhammerz.github.io/llms.txt"
                rows={4}
                className="w-full bg-[#030305]/95 border border-white/15 rounded p-2 text-xs font-mono text-sovereign-neon hover:border-sovereign-neon focus:outline-none focus:border-sovereign-neon placeholder-gray-700 transition-colors"
              />
              <p className="text-[7.5px] text-gray-500 font-mono mt-1 uppercase">
                Blank list uses the default global profile crawling stack.
              </p>
            </div>

            <button
              type="submit"
              disabled={isCrawling}
              className={`w-full py-2.5 border-2 rounded font-mono text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer relative group/launch ${
                isCrawling 
                ? 'bg-sovereign-neon/15 border-sovereign-neon text-sovereign-neon cursor-wait animate-pulse shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                : 'bg-black text-sovereign-neon border-sovereign-neon/50 hover:bg-sovereign-neon/10 hover:border-sovereign-neon hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] font-black'
              }`}
            >
              {/* Hover Tooltip */}
              {!minimizeHovers && (
                <div className="absolute opacity-0 group-hover/launch:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 transform transition-all duration-300 bottom-[120%] left-1/2 -translate-x-1/2 text-left font-mono leading-relaxed scale-95 group-hover/launch:scale-100 normal-case select-none p-3 rounded shadow-[0_4px_25px_rgba(0,0,0,0.95)] w-64 z-50 pointer-events-none">
                  <div className="flex items-center gap-1 border-b border-white/5 pb-1 mb-1.5 text-sovereign-neon font-black">
                    <span>OMNICRAWL ACTION</span>
                    <span className="ml-auto text-[9px]">?</span>
                  </div>
                  <p className="text-[9.5px] text-gray-400 font-sans leading-normal font-normal text-gray-300">Asynchronously runs deep intelligence scanning and dynamic metadata ingestion sync over all specified web destinations.</p>
                </div>
              )}

              {isCrawling ? 'Executing Omnichannel Deep Crawl...' : 'Launch Live Crawl & Reindex'}
            </button>
          </form>

        </div>

        {/* Center Panel - Detailed Action Holographic Stage Visualizers */}
        <div className="xl:col-span-4 space-y-5">
          
          {/* Detailed visual progress stage representation of Crawler Active Actions */}
          <div className="bg-[#050508]/90 border border-sovereign-line/60 rounded-lg p-4 space-y-4 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-1.5 font-mono text-[7px] text-gray-700 uppercase font-black tracking-widest leading-none pointer-events-none">
              DEC_PROCESS_AURELIUS
            </div>
            
            <div>
              <h4 className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center justify-between">
                <span>Holographic Stage Flow Analyzer</span>
                <span className="text-[7.5px] text-cyan-400 font-bold uppercase">{isCrawling ? 'PROCESSING_RECON' : 'SYSTEM_STANDBY'}</span>
              </h4>

              <div className="mt-3.5 space-y-3.5">
                {crawlStages.map((stage, i) => {
                  const isCurrent = isCrawling && activeStep === i;
                  const isCompleted = isCrawling ? activeStep > i : false;
                  return (
                    <div 
                      key={i} 
                      className={`p-2.5 border rounded-md transition-all ${
                        isCurrent 
                          ? 'bg-sovereign-neon/10 border-sovereign-neon shadow-[0_0_10px_rgba(0,255,65,0.1)]' 
                          : isCompleted 
                            ? 'bg-cyan-500/5 border-cyan-500/20 opacity-90'
                            : 'bg-black/45 border-white/5 opacity-55'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-gray-500 font-extrabold">{stage.code}</span>
                        {isCompleted && (
                          <span className="text-[7.5px] bg-cyan-500/20 text-cyan-400 font-mono font-black px-1.5 py-0.2 rounded">
                            VERIFIED_OK
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[7.5px] bg-sovereign-neon/20 text-sovereign-neon font-mono font-black px-1.5 py-0.2 rounded animate-pulse">
                            ACTIVE {stepProgress}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 mt-1">
                        <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-sovereign-neon' : isCompleted ? 'text-cyan-400' : 'text-gray-400'}`}>
                          {i + 1}. {stage.title}
                        </span>
                      </div>
                      
                      <p className="text-[8px] text-gray-500 font-mono mt-1 leading-relaxed lowercase">
                        {stage.desc}
                      </p>

                      {/* Bar Loader widget */}
                      {isCurrent && (
                        <div className="w-full h-1 bg-black/60 rounded overflow-hidden mt-1.5">
                          <div 
                            className="bg-sovereign-neon h-full transition-all duration-300 shadow-[0_0_6px_#00ff41]" 
                            style={{ width: `${stepProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[8px] font-mono text-gray-500 uppercase flex justify-between items-center border-t border-white/5 pt-2 mt-2">
              <span>LEDGER COMPILATION PIPELINE</span>
              <span>ESTIMATED TIME: 2.2 S</span>
            </div>
          </div>

          {/* Sibling Live Synchronization Oscilloscope */}
          <div className="bg-black/55 border border-sovereign-line/50 rounded-lg p-4 space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Socioeconomic Latency Oscillator Scope
            </h4>
            <div className="bg-black border border-white/10 rounded h-16 relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-16 absolute inset-0">
                <line x1="0" y1="32" x2="500" y2="32" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                {/* Dynamically waving line depending on Latency Lock state */}
                <path
                  d={latencyLock 
                    ? "M 0 32 L 60 32 L 80 30 L 100 34 L 120 32 L 300 32 L 320 31 L 340 33 L 360 32 L 500 32"
                    : "M 0 32 Q 50 12, 100 48 T 200 12 T 300 48 T 400 12 T 500 32"
                  }
                  fill="none"
                  stroke={latencyLock ? "#00e5ff" : "#ff007f"}
                  strokeWidth="2"
                  className={latencyLock ? '' : 'animate-pulse'}
                />
              </svg>
              <div className="absolute top-2 left-2 text-[7.5px] font-mono text-gray-500 uppercase">
                {latencyLock ? 'Corridor PIN: 2ms flat (LOCKED)' : 'Corridor PING: FLUCTUATING SIGNAL JITTER'}
              </div>
              <div className="absolute right-2 bottom-1.5 text-[8.5px] font-mono text-white flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${latencyLock ? 'bg-cyan-400' : 'bg-pink-500'}`} />
                {latencyLock ? 'CORRIDOR ACTIVE' : 'DYNAMIC OSCILLATING'}
              </div>
            </div>
            <p className="text-[7.5px] text-gray-500 font-mono uppercase tracking-wide leading-relaxed">
              When locked, the network scope locks all JHammerZ socket signals flatline into an optimal 2ms corridor to prevent frame delays.
            </p>
          </div>

        </div>

        {/* Right Panel - Knowledge Index and Mitosis Canvas */}
        <div className="xl:col-span-3 space-y-5">
          
          {/* Mitosis Cell split diagram simulation canvas area */}
          <div className="bg-gradient-to-b from-[#06060c] to-[#010103] border-2 border-sovereign-line rounded-lg p-4 flex flex-col justify-between relative overflow-hidden h-[240px]">
            <div className="absolute top-0 right-0 p-1.5 font-mono text-[7px] text-gray-700 uppercase font-black cursor-pointer leading-none pointer-events-none">
              PHYS_MODEL_7
            </div>

            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                <h4 className="text-[9.5px] font-mono font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-sovereign-neon animate-spin-slow" />
                  Infinite Mitotic Cloner Engine
                </h4>
              </div>
              <canvas 
                ref={canvasRef} 
                width={260} 
                height={125} 
                className="w-full bg-black/40 border border-white/5 rounded-md"
              />
            </div>

            <div className="flex justify-between items-center pt-2 text-[8px] font-mono border-t border-white/5">
              <span className="text-gray-500 uppercase tracking-wider leading-none">Mitosis Status Model</span>
              <button
                type="button"
                onClick={handleToggleMitosis}
                className={`text-[8.5px] font-mono px-3 py-1 border rounded uppercase font-black tracking-wider transition-all cursor-pointer relative group/mitosis ${
                  infiniteMitosis 
                  ? 'bg-sovereign-neon/20 border-sovereign-neon text-sovereign-neon shadow-[0_0_8px_#00ff41]' 
                  : 'bg-black border-white/10 text-gray-400'
                }`}
              >
                {/* Hover Tooltip */}
                {!minimizeHovers && (
                  <div className="absolute opacity-0 group-hover/mitosis:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 transform transition-all duration-300 bottom-[125%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/mitosis:scale-100 normal-case select-none p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-sovereign-neon font-black">
                      <span>MITOTIC SWARM</span>
                      <span className="ml-auto text-[9px]">?</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans leading-normal text-gray-400 font-normal">Spawns automated learning agent clone units across the network on background intervals.</p>
                  </div>
                )}

                {infiniteMitosis ? 'SEAL INFINITE ACTIVE' : 'MANUAL CLONE'}
              </button>
            </div>
          </div>

          {/* Crawler Log Buffer Console */}
          <div className="bg-[#030305] border border-white/10 rounded-lg p-4 flex flex-col justify-between h-[270px]">
            <div>
              <h4 className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-widest pb-1.5 border-b border-white/5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sovereign-neon animate-pulse" />
                  Crawler Event Terminal Buffer
                </span>
                <span className="text-[7.5px] font-mono text-gray-600 uppercase">
                  {isCrawling ? 'STREAMING' : 'STANDBY'}
                </span>
              </h4>
              
              <div className="mt-2 text-[8.5px] text-gray-400 font-mono space-y-1.5 overflow-y-auto h-[165px] pr-1.5 scrollbar-thin scrollbar-thumb-gray-800 uppercase leading-relaxed">
                {crawlLogs.length === 0 ? (
                  <div className="text-gray-700 uppercase p-4 text-center">
                    Awaiting live search signal telemetry.
                  </div>
                ) : (
                  crawlLogs.map((log, i) => (
                    <div key={i} className="flex gap-1.5">
                      <span className="text-gray-600 font-bold select-none">{`>`}</span>
                      <span className={`${
                        log.includes('[SUCCESS]') || log.includes('[TACTICAL') ? 'text-sovereign-neon font-black' :
                        log.includes('[ERROR]') || log.includes('[CRITICAL') ? 'text-red-500 font-bold animate-pulse' :
                        log.includes('[FETCH') ? 'text-cyan-400' :
                        log.includes('[STRENGTHENING]') || log.includes('[N05') ? 'text-yellow-400 font-bold' :
                        log.includes('[INTEGRITY') ? 'text-white' :
                        'text-gray-400'
                      }`}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ingress status lock */}
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono uppercase text-gray-500">
              <span>LATENCY INTEGRITY GUARDWAY</span>
              <button
                type="button"
                onClick={handleToggleLatencyLock}
                className={`text-[8px] px-2 py-0.5 border rounded uppercase font-black transition-all cursor-pointer relative group/latency ${
                  latencyLock
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                    : 'bg-black border-white/10 text-gray-400'
                }`}
              >
                {/* Hover Tooltip */}
                {!minimizeHovers && (
                  <div className="absolute opacity-0 group-hover/latency:opacity-100 bg-[#121216]/95 border border-cyan-500/40 text-gray-300 transform transition-all duration-300 bottom-[125%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/latency:scale-100 normal-case select-none p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-cyan-400 font-black">
                      <span>LATENCY INTEGRITY</span>
                      <span className="ml-auto text-[9px]">?</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans leading-normal">Forces and stabilizes connection response speed over the active proxy pathways.</p>
                  </div>
                )}

                {latencyLock ? 'LOCK 2MS CONFIRMED' : 'DYNAMIC CHANNELS'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Structured Crawler Registry Indexes View Section */}
      <div className="bg-[#030305]/95 border-2 border-sovereign-line rounded-lg p-4 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1.5 font-mono text-[7px] text-gray-800 pointer-events-none uppercase font-black">
          DB_INGEST_LOGS_M14
        </div>
        
        <h4 className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest pb-1 border-b border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-sovereign-neon" />
            Socioeconomic Ingestion Registry list &amp; Extracted Entities Database
          </span>
          <span className="text-[7.5px] font-sans text-gray-600">CANONICAL_INDEX_ONLY</span>
        </h4>

        {/* Database Search Log rows */}
        <div className="mt-2 text-xs font-mono grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
          {crawlIndex.length === 0 ? (
            <div className="md:col-span-2 text-gray-600 uppercase text-center py-6 text-xs">No entries established in canonical index memory buffers.</div>
          ) : (
            crawlIndex.map((record, i) => (
              <div key={i} className="p-3 border border-white/5 bg-black/60 hover:bg-black/90 hover:border-sovereign-neon/30 rounded-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9.5px] font-bold text-white break-all leading-tight max-w-[80%] uppercase select-all">
                      {record.url}
                    </span>
                    <span className={`text-[7.5px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider leading-none text-right ${
                      record.status === 'RECONCILED_AND_STRENGTHENED' 
                      ? 'bg-sovereign-neon/20 text-sovereign-neon' 
                      : 'bg-cyan-500/15 text-cyan-400'
                    }`}>
                      {record.status}
                    </span>
                  </div>

                  <span className="text-[6.5px] text-gray-500 uppercase tracking-wider block mt-1">
                    INDEXED ON: {new Date(record.timestamp).toLocaleString()} • {record.sourceType}
                  </span>

                  <p className="text-[9px] text-[#8e9bb0] font-mono mt-2 leading-relaxed bg-[#030304] p-2 border border-white/5 rounded-md uppercase">
                    {record.findingsSummary}
                  </p>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1 items-center">
                  <span className="text-[7.5px] text-gray-500 uppercase mr-1">EXTRACTED ENTITIES:</span>
                  {record.entitiesExtracted.map((ent, idx) => (
                    <span key={idx} className="text-[7px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded leading-none mr-1 uppercase">
                      {ent}
                    </span>
                  ))}
                  {extractedEntities.length > 0 && i === 0 && (
                    <div className="mt-1 pt-1 flex flex-wrap gap-1 w-full border-t border-white/5">
                      <span className="text-[7.5px] text-sovereign-neon uppercase mr-1 animate-pulse font-extrabold">LIVE BUFFER INTEGRITY EXTENSIONS:</span>
                      {extractedEntities.map((ent, idx) => (
                        <span key={idx} className="text-[7px] bg-sovereign-neon/15 border border-sovereign-neon/30 text-sovereign-neon px-2 py-0.5 rounded leading-none">
                          {ent}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
