import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  Play, 
  HelpCircle, 
  Radio, 
  RefreshCw, 
  Flame, 
  Sliders, 
  Lock, 
  Unlock, 
  Terminal, 
  Search, 
  Volume2, 
  VolumeX, 
  Binary, 
  Clock, 
  Wifi, 
  Activity, 
  Link, 
  Layers,
  Sparkles,
  Server,
  TrendingUp,
  SlidersHorizontal,
  Bell,
  AlertTriangle,
  FileCode,
  Music,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Network,
  Disc,
  FolderOpen,
  Atom,
  Dribbble,
  Inbox,
  FileText,
  GitBranch
} from 'lucide-react';

// Import subcomponents for horizontal channel slide-pages
import { AIChat } from './AIChat';
import { SovereignCrawlerPanel } from './SovereignCrawlerPanel';
import { SovereignBrainConsole } from './SovereignBrainConsole';
import { SovereignTuningPanel } from './SovereignTuningPanel';
import { SingularityVisualizer } from './SingularityVisualizer';
import { PipelineStatus } from './PipelineStatus';
import { A2ABridgeConsole } from './A2ABridgeConsole';
import { SovereignAuditMitigationPanel } from './SovereignAuditMitigationPanel';
import { SovereignLivingManifestPanel } from './SovereignLivingManifestPanel';
import { SovereignCannonDistributionPanel } from './SovereignCannonDistributionPanel';
import { SovereignBrainToBodySynapse } from './SovereignBrainToBodySynapse';
import { SovereignWormLedgerPanel } from './SovereignWormLedgerPanel';

// Specialized Inline Synthesizer for high-fidelity tactical feedback & continuous audio oscillators
class WarRoomTacticalSynth {
  private ctx: AudioContext | null = null;
  public mute: boolean = false;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private humFilter: BiquadFilterNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMechanicalClick() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1050, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playBeepPulse() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc1.frequency.setValueAtTime(1320, this.ctx.currentTime + 0.08);

    osc2.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.21);
    osc2.stop(this.ctx.currentTime + 0.21);
  }

  playEngineHum() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playEmergencySiren() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
    osc.frequency.linearRampToValueAtTime(400, now + 0.3);
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.31);
  }

  playSuccessChime() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.02, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.18);
    });
  }

  startContinuousHum(frequency: number) {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;
    
    this.stopContinuousHum();

    try {
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();
      this.humFilter = this.ctx.createBiquadFilter();

      this.humOsc.type = 'sawtooth';
      this.humOsc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      this.humFilter.type = 'lowpass';
      this.humFilter.frequency.setValueAtTime(frequency * 2.5, this.ctx.currentTime);

      this.humGain.gain.setValueAtTime(0.006, this.ctx.currentTime);

      this.humOsc.connect(this.humFilter);
      this.humFilter.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc.start();
    } catch (e) {
      console.warn("Continuous hum start failed:", e);
    }
  }

  updateHumFrequency(frequency: number) {
    if (this.mute) {
      this.stopContinuousHum();
      return;
    }
    this.init();
    if (this.humOsc && this.ctx) {
      try {
        this.humOsc.frequency.exponentialRampToValueAtTime(frequency, this.ctx.currentTime + 0.12);
        if (this.humFilter) {
          this.humFilter.frequency.exponentialRampToValueAtTime(frequency * 2.5, this.ctx.currentTime + 0.12);
        }
      } catch (e) {}
    }
  }

  stopContinuousHum() {
    if (this.humOsc) {
      try {
        this.humOsc.stop();
        this.humOsc.disconnect();
      } catch (e) {}
      this.humOsc = null;
    }
    if (this.humGain) {
      try {
        this.humGain.disconnect();
      } catch (e) {}
      this.humGain = null;
    }
    if (this.humFilter) {
      try {
        this.humFilter.disconnect();
      } catch (e) {}
      this.humFilter = null;
    }
  }
}

const synthEngine = new WarRoomTacticalSynth();

export interface TacticalNodeObjective {
  id: string;
  name: string;
  endpoint: string;
  status: string;
  type: string;
  latencyIndex: number;
  cryptKey: string;
  influenceMetric: string;
  explanation: string;
  preloadedDirectives: string[];
  roleDescription: string;
  category: string;
}
export type GameNodeObjective = TacticalNodeObjective;

const NODE_OBJECTIVES: TacticalNodeObjective[] = [
  {
    id: 'node-1',
    name: 'jhammerz.github.io',
    endpoint: 'https://jhammerz.github.io',
    status: 'CANONICAL_ANCHOR_STABLE',
    type: 'Primary Canonical Head',
    latencyIndex: 12,
    cryptKey: 'PGP-ROOT-MASTER',
    influenceMetric: '100% Core Trust',
    explanation: 'Hosts the centralized manifest indices, sitemaps, and llms.txt anchors. Serves as the primary truth source referencing all downstream assets.',
    roleDescription: 'Secures primary indexing routing configurations, provides fallback verification handshakes, and locks overall search engine crawling anchors.',
    category: 'Master Node',
    preloadedDirectives: [
      'Force Root Signature Handshake',
      'Audit Master Sitemap Index',
      'Deploy Cryptographic Guardrail Key',
      'Verify SSL Socket Handshake Route'
    ]
  },
  {
    id: 'node-2',
    name: 'tiktok.com/@jhammerzz',
    endpoint: 'https://www.tiktok.com/@jhammerzz',
    status: 'ENGAGEMENT_SPILLOVER_ACTIVE',
    type: 'Consumer Viral Pipeline',
    latencyIndex: 28,
    cryptKey: 'TOK-ALGO-V7',
    influenceMetric: 'Sovereign Presence',
    explanation: 'High-frequency outreach node broadcasting creative audio-visual snippets directly to short-form indexing registers.',
    roleDescription: 'Injects consumer audience attention triggers, driving organic user routing vectors back to the main domain anchor.',
    category: 'Viral Gateway',
    preloadedDirectives: [
      'Scrape Real-Time Engagement Statistics',
      'Broadcast Sound Byte Engagement Sync',
      'Optimize Bio Redirection Headers',
      'Audit Short-Form Retention Markers'
    ]
  },
  {
    id: 'node-3',
    name: 'linkedin.com/in/JHammerZ',
    endpoint: 'https://www.linkedin.com/in/JHammerZ',
    status: 'CORPORATE_REGISTER_SYNCED',
    type: 'Credential Validator Node',
    latencyIndex: 34,
    cryptKey: 'LKD-SEC-LOCK',
    influenceMetric: 'Enterprise Verified',
    explanation: 'Corporate credential consensus node backing human authenticity and professional engineering achievements publicly.',
    roleDescription: 'Authenticates high-integrity development portfolios against corporate networks and prevents credential spoofing.',
    category: 'Validation Core',
    preloadedDirectives: [
      'Synchronize Professional Certifications',
      'Lock Enterprise Handshake Signature',
      'Validate Corporate Schema Indices',
      'Cross-Reference Master Portfolios'
    ]
  },
  {
    id: 'node-4',
    name: 'youtube.com/@JHammerZ',
    endpoint: 'https://www.youtube.com/@JHammerZ',
    status: 'BROADCASTER_STREAMS_OK',
    type: 'Main Video Broadcast Hub',
    latencyIndex: 19,
    cryptKey: 'YT-MEDIA-ENCODER',
    influenceMetric: 'Multi-Format Channel',
    explanation: 'Primary high-density media streaming vault hosting deep discussions, sessions, and musical audio releases.',
    roleDescription: 'Distributes audio-visual evidence of sovereign development and triggers parallel search engine metadata optimization.',
    category: 'Broadcast Hub',
    preloadedDirectives: [
      'Index Deep Think Topic Metadata',
      'Verify Acoustic Frequency Spectrum',
      'Resolve Live Stream Latency Drifts',
      'Cache Video Metadata Anchors'
    ]
  },
  {
    id: 'node-5',
    name: 'instagram.com/jhammerzz',
    endpoint: 'https://www.instagram.com/jhammerzz',
    status: 'LIFESTYLE_MATRIX_VALID',
    type: 'Social Proof Stream',
    latencyIndex: 25,
    cryptKey: 'IMG-VALIDATION-7',
    influenceMetric: 'Visual Anchor',
    explanation: 'Supplementary human-presence validation stream providing proof-of-life visuals and JHammerZ lifestyle logs.',
    roleDescription: 'Increases local network cluster credibility density by establishing decentralized visual lifestyle indicators.',
    category: 'Public Proof',
    preloadedDirectives: [
      'Collect Feed Impression Vectors',
      'Verify Media Asset Cryptographic Signatures',
      'Pre-cache Target Redirect Links',
      'Re-align Regional Routing Blocks'
    ]
  },
  {
    id: 'node-6',
    name: 'facebook.com/JHammerzz',
    endpoint: 'https://www.facebook.com/JHammerzz/',
    status: 'REDUNDANT_LEDGER_STANDBY',
    type: 'Backup Validation Rail',
    latencyIndex: 42,
    cryptKey: 'META-API-REDUNDANT',
    influenceMetric: 'Fallback Verified',
    explanation: 'Redundant metadata directory maintaining backup profile assets in case principal channels face routing conflicts.',
    roleDescription: 'Acts as failover network fallback, asserting ownership tags even in restrictive corporate firewall environments.',
    category: 'Redundant Node',
    preloadedDirectives: [
      'Purge Diagnostic Tracker Cache',
      'Re-validate Meta API Gateway Link',
      'Query Redundant Record Integrity',
      'Flush Static Redirect Mapping'
    ]
  },
  {
    id: 'node-7',
    name: 'jhammerz.carrd.co',
    endpoint: 'https://jhammerz.carrd.co/',
    status: 'ROUTER_REDIRECT_ACTIVE',
    type: 'Velocity Gateway Indexer',
    latencyIndex: 14,
    cryptKey: 'CRD-LIGHTNING-GW',
    influenceMetric: 'Lightning Transit',
    explanation: 'Ultra-lightweight traffic router designed for rapid network traversal, capturing and funneling visitors to canonical nodes.',
    roleDescription: 'Accelerates path routing for incoming queries, bypassing bulky DNS lookups for third-party discovery apps.',
    category: 'Edge Routing',
    preloadedDirectives: [
      'Ping Carrd Redirect Latency Offset',
      'Assert Strict SEO Enforcer Script',
      'Evaluate Edge Cache Compression Ratio',
      'Force Sibling Domain Handshake'
    ]
  },
  {
    id: 'node-8',
    name: 'amazon.music/jhammerz',
    endpoint: 'https://music.amazon.com/artists/B0SGL7W/jhammerz',
    status: 'STREAM_CATALOG_SYNCED',
    type: 'Global Audio Warehouse',
    latencyIndex: 45,
    cryptKey: 'AMZ-ROYALTY-KEY',
    influenceMetric: 'Premium Distributor',
    explanation: 'Retail-connected high-fidelity audio catalog distribution cell publishing JHammerZ original syntheses.',
    roleDescription: 'Monetizes digital acoustics on major corporate servers, building sovereign distribution royalties persistently.',
    category: 'Acoustic Node',
    preloadedDirectives: [
      'Collect Acoustic Royalties Audit',
      'Pre-generate Waveform Cache Matrix',
      'Re-index Streaming Distribution Pipeline',
      'Register New Release Metadata'
    ]
  },
  {
    id: 'node-9',
    name: 'apple.music/jhammerz',
    endpoint: 'https://music.apple.com/us/artist/jhammerz/1845798346',
    status: 'HI_RES_LOSSLESS_ONLINE',
    type: 'Lossless Streaming Vault',
    latencyIndex: 31,
    cryptKey: 'AAPL-LOSSLESS-V2',
    influenceMetric: 'Studio High-Fid',
    explanation: 'Elite high-resolution publishing hub distributing JHammerZ uncompressed audio master records across Apple network nodes.',
    roleDescription: 'Maintains JHammerZ acoustic sovereignty in high-fidelity listener brackets, registering absolute digital rights.',
    category: 'Acoustic Node',
    preloadedDirectives: [
      'Load High-Resolution Acoustic Master',
      'Validate DRM Rights Digital Fingerprint',
      'Retrieve Global Catalog Index Rank',
      'Sync Lossless Streaming Bitrate'
    ]
  },
  {
    id: 'node-10',
    name: 'bandlab.com/jhammerz',
    endpoint: 'https://music.bandlab.com/artist/781334284',
    status: 'PRODUCTION_WORKSPACE_STABLE',
    type: 'High-Density Creation Lab',
    latencyIndex: 20,
    cryptKey: 'BL-COLLAB-AUTH',
    influenceMetric: 'Beta Active',
    explanation: 'Real-time collaborative production workspace where new acoustic concepts, tests, and audio patterns are compiled.',
    roleDescription: 'Provides open workspace production metrics for active community engagements and acoustic tracking.',
    category: 'Dev Environment',
    preloadedDirectives: [
      'Push Creative Audio Draft Snapshot',
      'Sync Harmonic Sound Wave Vectors',
      'Verify Live Collaborative Keys',
      'Re-ping High-Frequency Production Socket'
    ]
  },
  {
    id: 'node-11',
    name: 'xiaohongshu/jhammerz',
    endpoint: 'https://www.xiaohongshu.com/user/profile/JHammerZ',
    status: 'EASTERN_SEC_SECT_ONLINE',
    type: 'Eastern Vector Pipeline',
    latencyIndex: 88,
    cryptKey: 'XHS-SEO-ENCRYPT',
    influenceMetric: 'Global Penetration',
    explanation: 'International matrix portal connecting JHammerZ to high-density discovery communities across eastern markets.',
    roleDescription: 'Expands the sovereign index footprint across geo-political boundaries, securing global accessibility.',
    category: 'Eastern Vector',
    preloadedDirectives: [
      'Translate Key Alignment Schemas',
      'Inspect Geo-Location Routing Pins',
      'Assess Foreign Firewall Latency',
      'Evaluate Localized Index Signals'
    ]
  },
  {
    id: 'node-12',
    name: 'github.com/JHammerZ/jhammerz.github.io',
    endpoint: 'https://github.com/JHammerZ/jhammerz.github.io',
    status: 'REPOSITORY_MAIN_STABLE',
    type: 'Sovereign Code Database',
    latencyIndex: 10,
    cryptKey: 'GH-TOKEN-SOVEREIGN',
    influenceMetric: 'Master Orchestration',
    explanation: 'Primary source-code database coordinating CI/CD runners, triggers, and deployments to public truth servers.',
    roleDescription: 'Houses the actual git commits, scripts, workflows, and private environment variables that coordinate dual-enclave logic.',
    category: 'Core Database',
    preloadedDirectives: [
      'Dispatch Real-Time Repository Dispatch',
      'Verify Runner Handshake Connection',
      'Inquire GitHub API Rate Limits',
      'Securely Rotate Session Access Tokens'
    ]
  },
  {
    id: 'node-13',
    name: 'impact.com/secure',
    endpoint: 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/',
    status: 'LEDGER_PARTNERSHIP_SECURE',
    type: 'Monetization Ledger Head',
    latencyIndex: 55,
    cryptKey: 'IMP-REV-STREAM-77',
    influenceMetric: 'Corporate Aligned',
    explanation: 'Commercial gateway managing commercialization, monetized distribution agreements, and corporate sponsorships.',
    roleDescription: 'Ensures absolute tracking audit security of JHammerZ financial streams and active sponsor compliance matrices.',
    category: 'Rev Core',
    preloadedDirectives: [
      'Audit Corporate Revenue Pipelines',
      'Verify Active Partner Handshake Keys',
      'Analyze Affiliate Conversion Vectors',
      'Cleanse Session Audit Trace'
    ]
  },
  {
    id: 'node-14',
    name: 'spotify.artist/7vRd2',
    endpoint: 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79',
    status: 'CORE_ENGINE_FLOW_LIVE',
    type: 'Acoustic Sovereign Core',
    latencyIndex: 8,
    cryptKey: 'SPOT-ALG-RANK-MASTER',
    influenceMetric: '#1 Viral Rank Target',
    explanation: 'The primary audio-streaming engine powering high-density tracks, syncing listeners, and distributing JHammerZ original soundwaves.',
    roleDescription: 'Directs the global recommendation algorithm engine towards JHammerZ profiles, asserting absolute ranking dominance.',
    category: 'Acoustic Core',
    preloadedDirectives: [
      'Verify Algorithmic Placement Signal',
      'Cache Real-Time Listener Telemetry',
      'Cross-Track Playlist Injection Nodes',
      'Run Dynamic Global Audio Sync'
    ]
  }
];

export interface SovereignWarRoomHUDProps {
  onTerminalLog: (msg: string) => void;
  swarmStats: any;
  setSwarmStats: React.Dispatch<React.SetStateAction<any>>;
  nodeLocks: Record<string, boolean>;
  onToggleNodeLock: (nodeKey: string) => void;
  onToggleUniversalLock: () => Promise<void>;
  notesPermanentLock: boolean;
  onToggleNotesPermanentLock: (locked: boolean) => void;
  ledger: any[];
  setLedger: React.Dispatch<React.SetStateAction<any[]>>;
  accessLevel: number;
  forensicScore: number;
  volatilityScore: number;
  isKernelRealigned: boolean;
  addTerminalEntry: (msg: string) => void;
  decryptionStage: number;
  setDecryptionStage: React.Dispatch<React.SetStateAction<number>>;
  decryptedLogs: string[];
  setDecryptedLogs: React.Dispatch<React.SetStateAction<string[]>>;
  decryptionFeedback: any;
  setDecryptionFeedback: React.Dispatch<React.SetStateAction<any>>;
}
export type SovereignGameConsoleHUDProps = SovereignWarRoomHUDProps;

export function SovereignWarRoomHUD({
  onTerminalLog,
  swarmStats,
  setSwarmStats,
  nodeLocks,
  onToggleNodeLock,
  onToggleUniversalLock,
  notesPermanentLock,
  onToggleNotesPermanentLock,
  ledger,
  setLedger,
  accessLevel,
  forensicScore,
  volatilityScore,
  isKernelRealigned,
  addTerminalEntry,
  decryptionStage,
  setDecryptionStage,
  decryptedLogs,
  setDecryptedLogs,
  decryptionFeedback,
  setDecryptionFeedback
}: SovereignWarRoomHUDProps) {

  // Horizontal routing channels
  const [activeChannelIdx, setActiveChannelIdx] = useState<number>(0);
  const channels = [
    { id: 'core', label: 'Mission Core', icon: Radio, desc: '14-Node Tactical Grid Launcher' },
    { id: 'chat', label: 'AI Command Chat', icon: MessageSquare, desc: 'Server-Side Orchestrator & Manus Co-Enclave' },
    { id: 'crawler', label: 'Swarm Crawler', icon: Binary, desc: 'Web Traversal & Mitotic Cell Simulation' },
    { id: 'brain', label: 'Deepthink Brain', icon: Cpu, desc: 'Neural Sockets Multi-Agent Compiler' },
    { id: 'tuner', label: 'Sovereign Tuner', icon: Sliders, desc: 'Active Swarm Tuning & Locks Matrix' },
    { id: 'jham', label: 'JHAM 3D Sculptor', icon: Layers, desc: 'Word Script to Rotating 3D Holograms' },
    { id: 'singularity', label: 'Singularity status', icon: Atom, desc: 'Decryption Core & Telemetry Ledger Grid' },
    { id: 'a2a', label: 'A2A Bridge & GitHub Mesh', icon: Network, desc: 'Agent-to-Agent Micro-Consensus & jhammerz.github.io Network Substrate' },
    { id: 'audit', label: 'Resiliency & Audit Matrix', icon: ShieldCheck, desc: 'Cloudflare LRU Cache, Manus Vault Tarball & GitHub Pages SEO Engine' },
    { id: 'manifest', label: 'Living Manifest V4.0.26', icon: FileText, desc: '14 Sibling Nodes, 432s Auto-Loop, Teleological Root & Non-Negotiables' },
    { id: 'cannon', label: 'Sovereign Cannon V4.2', icon: Zap, desc: 'Autonomous Broadcast Engine, 14 Nodes, N09 Veto, 5000ms Hysteresis' },
    { id: 'synapse', label: 'Brain-to-Body Synapse', icon: GitBranch, desc: 'Military-Grade Neural Brain to 7 GitHub Repositories Synapse Matrix' },
    { id: 'worm', label: 'W.O.R.M. Immutable Vault', icon: Lock, desc: 'Write Once, Read Many Sovereign Cryptographic Persistence & Merkle Proofs' }
  ];

  // original Page 0 Core HUD states
  const [currentNodeIdx, setCurrentNodeIdx] = useState<number>(0);
  const [selectedDirective, setSelectedDirective] = useState<string>('');
  const [customActionText, setCustomActionText] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [visualizerMode, setVisualizerMode] = useState<'radar' | 'stream' | 'waves'>('radar');

  // DIY Slider parameters
  const [signalBoost, setSignalBoost] = useState<number>(1.0);
  const [reactorPitch, setReactorPitch] = useState<number>(55);
  const [autoPilotSpeed, setAutoPilotSpeed] = useState<number>(10);
  const [autoPilot, setAutoPilot] = useState<boolean>(false);
  const [autoPilotTimer, setAutoPilotTimer] = useState<number>(10);

  // Live telemetry datasets
  const [liveNodesData, setLiveNodesData] = useState<Record<number, any>>({});
  const [isLiveFetching, setIsLiveFetching] = useState<boolean>(false);
  const [interactiveHumActive, setInteractiveHumActive] = useState<boolean>(false);
  const [liveJitterPing, setLiveJitterPing] = useState<Record<number, number>>({});
  const [localLogs, setLocalLogs] = useState<string[]>([
    '[SYSTEM] Sovereign Multi-Channel War Room Command Center Initialized.', 
    '[LIVE_READY] Horizon Carousel sliding layout locked. Vertically centered.'
  ]);

  // JHAM 3D Holographic System States
  const [jhamSourceCode, setJhamSourceCode] = useState<string>(
    `# LYSANDER_SWARM_INTEGRATION_PLAN
CREATE_SHAPE QUANTUM_SWARM [Radius=48, Coords=(0,0,0)]
COLOR #00FF41 // Pure radioactive glow
VERTEX_DENSITY 65 // Nodes multiplier
WIREFRAME_EDGES CONNECT_ALL_SIBLINGS
IMAGE_SCALE_INIT Factor=1.8 // Hyper-scaling applied
AUTOROTATE Axis=Y Speed=0.015
FOCAL_DEPTH 250 // Cyber matrix field
GLOW_TRANSFORM Pulse=0.05 Amplitude=25`
  );
  const [jhamActiveShape, setJhamActiveShape] = useState<'swarm' | 'starship' | 'gate' | 'sphere'>('swarm');
  const [jhamConsoleLogs, setJhamConsoleLogs] = useState<string[]>([
    '[JHAM] Holographic workspace initialized.',
    '[JHAM] Awaiting script compilation sequence...'
  ]);
  const [jhamExecuting, setJhamExecuting] = useState<boolean>(false);
  const [jhamScale, setJhamScale] = useState<number>(1.5);
  const [jhamRotX, setJhamRotX] = useState<number>(0.3);
  const [jhamRotY, setJhamRotY] = useState<number>(0.4);
  const [jhamFov, setJhamFov] = useState<number>(200);
  const [jhamWireframe, setJhamWireframe] = useState<boolean>(true);
  const [jhamVerticesCount, setJhamVerticesCount] = useState<number>(65);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const jhamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentNode = NODE_OBJECTIVES[currentNodeIdx];

  // Dynamic system-level activity ticker
  const [activeLogs, setActiveLogs] = useState<string[]>([
    '[SYSTEM] Dual-Enclaves online. All routes verified.'
  ]);

  // Decryption Puzzle States
  const [activeDecryptionPhrase, setActiveDecryptionPhrase] = useState('');

  // Decryption sources definition
  const decryptionSourceData = [
    {
      archiveCode: 'ARCHIVE-01: AURELIUS_CORE',
      encrypted: '41 55 52 45 4c 49 55 53',
      algorithm: 'EdDSA Hex Octet Matrix / ASCII Bytes',
      hint: 'Translate each hexadecimal pair directly to ASCII character plaintext.',
      answer: 'AURELIUS',
      lore: 'Aurelius is the Tier 0 automation core, syncing 14 distribution silos to preserve persistent truth anchors globally.'
    },
    {
      archiveCode: 'ARCHIVE-02: LYSANDER_DAEMONS',
      encrypted: 'TFlTQU5ERVI=',
      algorithm: 'Base64 Token Cryptography',
      hint: 'Decode base64 string to discover the parallel daemon engine label.',
      answer: 'LYSANDER',
      lore: 'Lysander is the high-performance C++ backend, running 150-daemon parallel processes to handle streaming metrics.'
    },
    {
      archiveCode: 'ARCHIVE-03: SOVEREIGN_BEACON',
      encrypted: '53 4f 56 45 52 45 49 47 4e',
      algorithm: 'Sovereign Digit Translation',
      hint: 'Pairwise hexadecimal byte matrix conversion to absolute string plaintext.',
      answer: 'SOVEREIGN',
      lore: 'The Sovereign framework represents absolute digital self-governance, bypassing legacy surveillance and ad platforms.'
    }
  ];

  // Compile / execute JHAM Word code script
  const compileJhamScript = () => {
    setJhamExecuting(true);
    synthEngine.playEngineHum();
    setJhamConsoleLogs(prev => [
      `[JHAM_COMPILER] Initiating JHAM code parsing sequence...`,
      `[JHAM] Reading active Word document tags...`,
      ...prev
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step === 1) {
        // Parse shape
        let shapeMode: 'swarm' | 'starship' | 'gate' | 'sphere' = 'swarm';
        if (jhamSourceCode.toLowerCase().includes('starship') || jhamSourceCode.toLowerCase().includes('interceptor')) shapeMode = 'starship';
        else if (jhamSourceCode.toLowerCase().includes('gate') || jhamSourceCode.toLowerCase().includes('ring')) shapeMode = 'gate';
        else if (jhamSourceCode.toLowerCase().includes('sphere') || jhamSourceCode.toLowerCase().includes('singularity')) shapeMode = 'sphere';
        setJhamActiveShape(shapeMode);

        // Parse scale factor
        const scaleMatch = jhamSourceCode.match(/Factor=([0-9.]+)/i);
        if (scaleMatch && scaleMatch[1]) {
          setJhamScale(parseFloat(scaleMatch[1]));
        }

        // Parse density/vertices multiplier
        const densityMatch = jhamSourceCode.match(/density\s*(\d+)/i) || jhamSourceCode.match(/VERTEX_DENSITY\s*(\d+)/i);
        if (densityMatch && densityMatch[1]) {
          setJhamVerticesCount(parseInt(densityMatch[1]));
        }

        setJhamConsoleLogs(prev => [
          `[JHAM] Instantiated Shape: ${shapeMode.toUpperCase()} projected successfully.`,
          `[JHAM] Applied focal multiplier: ${jhamScale}x. Vertex points map: ${jhamVerticesCount} nodes.`,
          ...prev
        ]);
      } else if (step === 2) {
        setJhamConsoleLogs(prev => [
          `[HOLOGRAPH] Projection parameters compiled using JHAM Word protocol.`,
          `[HOLOGRAPH] Connection of sibling enclaves secured over memory buffers.`,
          ...prev
        ]);
      } else if (step === 3) {
        clearInterval(interval);
        setJhamExecuting(false);
        synthEngine.playSuccessChime();
        setJhamConsoleLogs(prev => [
          `[SUCCESS] Program of 3D model through JHAM Word completed successfully!`,
          `[LIVE] Rotating visual scale: ${jhamScale}x. Core active and tracing orbit matrices.`,
          `=============================================================`,
          ...prev
        ]);
      }
    }, 850);
  };

  // Preset loading for JHAM 3D Sculptor
  const loadJhamPreset = (type: 'swarm' | 'starship' | 'gate' | 'sphere') => {
    synthEngine.playMechanicalClick();
    setJhamActiveShape(type);
    if (type === 'swarm') {
      setJhamSourceCode(`# JHAM_WORD_SCRIPT: SOVEREIGN_SWARM
CREATE_SHAPE QUANTUM_SWARM [Radius=55, Coords=(0,0,0)]
COLOR #00FF41 // Radioactive cyber green
VERTEX_DENSITY 65 // Multiplied points
WIREFRAME_EDGES CONNECT_ALL_PLATFORMS
IMAGE_SCALE_INIT Factor=1.6
AUTOROTATE Axis=Y Speed=0.012
FOCAL_DEPTH 250 // Perspective spacing`);
      setJhamScale(1.6);
      setJhamRotX(0.3);
      setJhamRotY(0.4);
      setJhamFov(250);
      setJhamVerticesCount(65);
    } else if (type === 'starship') {
      setJhamSourceCode(`# JHAM_WORD_SCRIPT: LYSANDER_INTERCEPTOR
CREATE_SHAPE STARSHIP_FIGHTER [Wingspan=72, Cockpit=(0,10,0)]
COLOR #ff5500 // Plasma hot flare orange
VERTEX_DENSITY 150 // Extreme tactical density
WIREFRAME_EDGES CONNECT_THRUSTERS_AND_WINGS
IMAGE_SCALE_INIT Factor=2.2 // Widescreen visual scaling
AUTOROTATE Axis=Y Speed=0.02
FOCAL_DEPTH 300 // Expanded depth`);
      setJhamScale(2.2);
      setJhamRotX(0.4);
      setJhamRotY(0.8);
      setJhamFov(300);
      setJhamVerticesCount(150);
    } else if (type === 'gate') {
      setJhamSourceCode(`# JHAM_WORD_SCRIPT: AURELIUS_SINGULARITY_GATE
CREATE_SHAPE INTERLOCKING_RINGS [Radius_Outer=60, Radius_Inner=30]
COLOR #00ffff // Quantum cyan resonance
VERTEX_DENSITY 80 // Dense concentric loops
WIREFRAME_EDGES REVOLVE_SPHERICAL
IMAGE_SCALE_INIT Factor=1.8
AUTOROTATE Axis=BOTH Speed=0.016
FOCAL_DEPTH 220`);
      setJhamScale(1.8);
      setJhamRotX(0.5);
      setJhamRotY(0.5);
      setJhamFov(220);
      setJhamVerticesCount(80);
    } else if (type === 'sphere') {
      setJhamSourceCode(`# JHAM_WORD_SCRIPT: CORE_SINGULARITY_BUBBLE
CREATE_SHAPE PERFECT_GEODESIC_SPHERE [Radius=36]
COLOR #a855f7 // Deep mystical high-altitude violet
VERTEX_DENSITY 45 // Classic retro low-poly
WIREFRAME_EDGES GEODESIC_TRIANGLES
IMAGE_SCALE_INIT Factor=1.4
AUTOROTATE Axis=X Speed=0.008
FOCAL_DEPTH 180`);
      setJhamScale(1.4);
      setJhamRotX(0.2);
      setJhamRotY(0.3);
      setJhamFov(180);
      setJhamVerticesCount(45);
    }
    setJhamConsoleLogs(prev => [
      `[JHAM] Loaded pre-programmed Word blueprint: ${type.toUpperCase()}`,
      ...prev
    ]);
  };

  // Sync initial directive options on node change
  useEffect(() => {
    setSelectedDirective(currentNode.preloadedDirectives[0]);
    setCustomActionText('');
  }, [currentNodeIdx]);

  // Audio Mute engine control
  useEffect(() => {
    synthEngine.mute = isAudioMuted;
    if (isAudioMuted) {
      synthEngine.stopContinuousHum();
    } else if (interactiveHumActive) {
      synthEngine.startContinuousHum(reactorPitch);
    }
  }, [isAudioMuted]);

  // Live Continuous Reactor Hum frequency update
  useEffect(() => {
    if (interactiveHumActive && !isAudioMuted) {
      synthEngine.updateHumFrequency(reactorPitch);
    }
  }, [reactorPitch, interactiveHumActive, isAudioMuted]);

  // Channel transition sound chime
  useEffect(() => {
    synthEngine.playMechanicalClick();
  }, [activeChannelIdx]);

  // Dynamic continuous ping jitter loop for ultra-live telemetry
  useEffect(() => {
    const jitterInterval = setInterval(() => {
      const updatedPings: Record<number, number> = {};
      NODE_OBJECTIVES.forEach((node, idx) => {
        const baseline = node.latencyIndex;
        const boostEffect = Math.max(0.2, 1.5 - (signalBoost * 0.15));
        const delta = (Math.random() * 8 - 4) * boostEffect;
        updatedPings[idx] = Math.max(2, Math.round(baseline + delta));
      });
      setLiveJitterPing(updatedPings);

      if (Math.random() > 0.75 && !isExecuting) {
        const randomNode = NODE_OBJECTIVES[Math.floor(Math.random() * 14)];
        const boostText = signalBoost > 1.0 ? ` (Boost: +${(signalBoost * 4).toFixed(1)}dB)` : '';
        setLocalLogs(l => [
          `[LIVE_PULSE] Route to node [${randomNode.name}] verified. Ping: ${updatedPings[NODE_OBJECTIVES.indexOf(randomNode)] || randomNode.latencyIndex}ms${boostText}`,
          ...l.slice(0, 50)
        ]);
      }
    }, 3000);

    return () => clearInterval(jitterInterval);
  }, [signalBoost, isExecuting]);

  // High fidelity 3D wireframe render loop for JHAM canvas
  useEffect(() => {
    if (activeChannelIdx !== 5 || !jhamCanvasRef.current) return;
    const canvas = jhamCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localRotX = jhamRotX;
    let localRotY = jhamRotY;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate 3D point vertices and edge indices based on selected shape
    const vertices: { x: number; y: number; z: number }[] = [];
    const edges: [number, number][] = [];

    const generateGeometry = () => {
      if (jhamActiveShape === 'sphere') {
        const bands = 8;
        for (let lat = 0; lat <= bands; lat++) {
          const theta = (lat * Math.PI) / bands;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
          for (let lon = 0; lon < bands * 2; lon++) {
            const phi = (lon * 2 * Math.PI) / (bands * 2);
            vertices.push({
              x: Math.cos(phi) * sinTheta * 22,
              y: cosTheta * 22,
              z: Math.sin(phi) * sinTheta * 22
            });
          }
        }
        // Connect longitude ring lines and latitude ring lines
        for (let lat = 0; lat < bands; lat++) {
          const r1 = lat * bands * 2;
          const r2 = (lat + 1) * bands * 2;
          for (let lon = 0; lon < bands * 2; lon++) {
            const nextL = (lon + 1) % (bands * 2);
            edges.push([r1 + lon, r1 + nextL]);
            if (lat < bands) edges.push([r1 + lon, r2 + lon]);
          }
        }
      } else if (jhamActiveShape === 'starship') {
        // Space fighter model nodes
        vertices.push(
          { x: 0, y: 0, z: -35 }, // nose [0]
          { x: -8, y: -2, z: -10 }, // cockpit left [1]
          { x: 8, y: -2, z: -10 }, // cockpit right [2]
          { x: 0, y: 6, z: -12 }, // fin top [3]
          { x: -35, y: -3, z: 12 }, // Wing left port edge [4]
          { x: 35, y: -3, z: 12 }, // Wing right port edge [5]
          { x: -12, y: 0, z: 18 }, // left nozzle exhaust [6]
          { x: 12, y: 0, z: 18 }, // right nozzle exhaust [7]
          { x: 0, y: -3, z: 15 }, // belly launcher [8]
          { x: 0, y: 5, z: 15 } // tail fin [9]
        );
        edges.push(
          [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3], // nose connection
          [1, 4], [2, 5], [6, 4], [7, 5], // wings connects
          [6, 8], [7, 8], [6, 7], [3, 9], [9, 6], [9, 7],
          [4, 6], [5, 7], [0, 8]
        );
      } else if (jhamActiveShape === 'gate') {
        // Interlocking double rings
        const ringPoints = 24;
        // Ring 1 (Horizontal)
        for (let i = 0; i < ringPoints; i++) {
          const angle = (i * 2 * Math.PI) / ringPoints;
          vertices.push({ x: Math.cos(angle) * 26, y: 0, z: Math.sin(angle) * 26 });
          edges.push([i, (i + 1) % ringPoints]);
        }
        // Ring 2 (Vertical orientation, slightly offset)
        for (let i = 0; i < ringPoints; i++) {
          const angle = (i * 2 * Math.PI) / ringPoints;
          vertices.push({ x: 0, y: Math.cos(angle) * 26, z: Math.sin(angle) * 26 });
          edges.push([ringPoints + i, ringPoints + ((i + 1) % ringPoints)]);
        }
      } else {
        // Default: Quantum Swarm Polyhedron matrix (connected 14-Node Sovereign stars)
        NODE_OBJECTIVES.forEach((node, idx) => {
          const angle = (idx * 2 * Math.PI) / 14;
          const radius = 24 + (idx % 3) * 4;
          vertices.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle * 1.5) * 12,
            z: Math.sin(angle) * radius
          });
        });
        // Generate connection lines forming orbital vectors
        for (let i = 0; i < 14; i++) {
          edges.push([i, (i + 1) % 14]);
          edges.push([i, (i + 5) % 14]); // diagonal inter-cloves link
        }
      }
    };

    generateGeometry();

    const draw = () => {
      // Auto-rotation vectors
      localRotY += 0.012;
      localRotX += 0.006;

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const centerX = w / 2;
      const centerY = h / 2;

      ctx.fillStyle = '#030305';
      ctx.fillRect(0, 0, w, h);

      // Programmed glow line grid background
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.015)';
      ctx.lineWidth = 1;
      const stepGrid = 20;
      for (let x = 0; x < w; x += stepGrid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += stepGrid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Project 3D points using matrix rotation
      const projected: { x: number; y: number; visible: boolean }[] = [];

      vertices.forEach((v) => {
        // Rotate about Y
        let x1 = v.x * Math.cos(localRotY) - v.z * Math.sin(localRotY);
        let z1 = v.x * Math.sin(localRotY) + v.z * Math.cos(localRotY);

        // Rotate about X
        let y2 = v.y * Math.cos(localRotX) - z1 * Math.sin(localRotX);
        let z2 = v.y * Math.sin(localRotX) + z1 * Math.cos(localRotX);

        // Focal perspective projection
        const focal = jhamFov;
        const scaleVal = jhamScale * 5.0; // scale up by user boost modifier
        const d = focal / (focal + z2);

        projected.push({
          x: centerX + x1 * scaleVal * d,
          y: centerY + y2 * scaleVal * d,
          visible: z2 > -focal
        });
      });

      // Draw edges connectivity lines
      ctx.lineWidth = 1.2;
      edges.forEach(([p1, p2]) => {
        const pt1 = projected[p1];
        const pt2 = projected[p2];

        if (pt1 && pt2 && pt1.visible && pt2.visible) {
          // Dynamic color based on shape and active code execution
          let edgeColor = 'rgba(0, 255, 65, 0.45)';
          if (jhamActiveShape === 'starship') edgeColor = 'rgba(255, 85, 0, 0.55)';
          if (jhamActiveShape === 'gate') edgeColor = 'rgba(0, 255, 255, 0.55)';
          if (jhamActiveShape === 'sphere') edgeColor = 'rgba(168, 85, 247, 0.55)';

          ctx.strokeStyle = edgeColor;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();

          // Under-glow neon edge duplication effect for massive scaling
          if (jhamScale > 1.8) {
            ctx.strokeStyle = edgeColor.replace('0.55', '0.12').replace('0.45', '1.0');
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
            ctx.lineWidth = 1.2;
          }
        }
      });

      // Render vertex beads
      projected.forEach((pt, idx) => {
        if (pt.visible) {
          ctx.fillStyle = jhamActiveShape === 'starship' ? '#ff5500' : (jhamActiveShape === 'gate' ? '#00ffff' : (jhamActiveShape === 'sphere' ? '#a855f7' : '#00FF41'));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, idx % 5 === 0 ? 3.5 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Holographic corner coordinates details
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '7.5px "JetBrains Mono", Courier, monospace';
      ctx.fillText(`JHAM BUILD ENGINE: ONLINE | ROT_X: ${localRotX.toFixed(2)} | ROT_Y: ${localRotY.toFixed(2)}`, 12, 18);
      ctx.fillText(`GEOMETRY SHAPE: ${jhamActiveShape.toUpperCase()} | TARGET_VERT: ${vertices.length} | TARGET_EDGE: ${edges.length}`, 12, h - 12);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeChannelIdx, jhamActiveShape, jhamScale, jhamRotX, jhamRotY, jhamFov, jhamVerticesCount]);

  // Real-time backend fetch integration
  const fetchBackendData = async () => {
    setIsLiveFetching(true);
    const updated: Record<number, any> = {};
    
    try {
      for (let i = 0; i < 14; i++) {
        const nodeNum = i + 1;
        let route = `/api/node${nodeNum}`;
        if (nodeNum === 13) route = '/api/sovereign/economy';
        if (nodeNum === 14) route = '/api/music/telemetry';

        try {
          const res = await fetch(route);
          if (res.ok) {
            const data = await res.json();
            updated[i] = {
              status: data.status?.toUpperCase() || data.label || 'ONLINE',
              score: data.metric_score || data.score || 99,
              extra: data
            };
          }
        } catch (e) {}
      }

      setLiveNodesData(updated);
      setLocalLogs(l => [
        `[LIVE_FETCH] Queried real-time Express backend endpoints. All twin-enclaves synchronizing perfectly.`,
        ...l.slice(0, 50)
      ]);
    } catch (err) {
      // fallback
    } finally {
      setIsLiveFetching(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
    const fetchInterval = setInterval(fetchBackendData, 20000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Autopilot loop
  useEffect(() => {
    let timerId: any;
    if (autoPilot && !isExecuting && activeChannelIdx === 0) {
      if (autoPilotTimer <= 0) {
        setCurrentNodeIdx(prev => (prev === NODE_OBJECTIVES.length - 1 ? 0 : prev + 1));
        synthEngine.playBeepPulse();
        setAutoPilotTimer(autoPilotSpeed);
        setLocalLogs(l => [
          `[AUTOPILOT] Advancing scanner destination -> Objective OBJ-${String(((currentNodeIdx + 1) % 14) + 1).padStart(2, '0')}`,
          ...l.slice(0, 50)
        ]);
      } else {
        timerId = setTimeout(() => {
          setAutoPilotTimer(prev => prev - 1);
        }, 1000);
      }
    }
    return () => clearTimeout(timerId);
  }, [autoPilot, autoPilotTimer, autoPilotSpeed, isExecuting, currentNodeIdx, activeChannelIdx]);

  // Toggle Continuous Hum Reactor
  const handleToggleHum = () => {
    synthEngine.playMechanicalClick();
    if (interactiveHumActive) {
      synthEngine.stopContinuousHum();
      setInteractiveHumActive(false);
      setLocalLogs(l => [`[ANALOG_SYNTH] Reactor core drone oscillator disconnected.`, ...l]);
    } else {
      setInteractiveHumActive(true);
      if (!isAudioMuted) {
        synthEngine.startContinuousHum(reactorPitch);
      }
      setLocalLogs(l => [`[ANALOG_SYNTH] Activated continuous analog reactor drone at ${reactorPitch}Hz.`, ...l]);
    }
  };

  // Navigations
  const navigateObjectives = (direction: 'prev' | 'next') => {
    synthEngine.playMechanicalClick();
    if (autoPilot) setAutoPilotTimer(autoPilotSpeed);
    
    if (direction === 'prev') {
      setCurrentNodeIdx(prev => (prev === 0 ? NODE_OBJECTIVES.length - 1 : prev - 1));
    } else {
      setCurrentNodeIdx(prev => (prev === NODE_OBJECTIVES.length - 1 ? 0 : prev + 1));
    }
  };

  const selectNodeDirectly = (idx: number) => {
    synthEngine.playMechanicalClick();
    if (autoPilot) setAutoPilotTimer(autoPilotSpeed);
    setCurrentNodeIdx(idx);
  };

  // Sound triggers
  const triggerSoundKey = (type: 'beep' | 'click' | 'siren' | 'chime' | 'hum') => {
    if (type === 'beep') {
      synthEngine.playBeepPulse();
      setLocalLogs(l => [`[SOUNDBOARD] Played HIGH_FREQUENCY_BEEP_PULSE`, ...l]);
    } else if (type === 'click') {
      synthEngine.playMechanicalClick();
      setLocalLogs(l => [`[SOUNDBOARD] Played MECHANICAL_RELAY_CLICK`, ...l]);
    } else if (type === 'siren') {
      synthEngine.playEmergencySiren();
      setLocalLogs(l => [`[SOUNDBOARD] Triggered ERROR_TACTICAL_SIREN`, ...l]);
    } else if (type === 'chime') {
      synthEngine.playSuccessChime();
      setLocalLogs(l => [`[SOUNDBOARD] Simulated ENCLAVE_SUCCESS_CHIME`, ...l]);
    } else if (type === 'hum') {
      synthEngine.playEngineHum();
      setLocalLogs(l => [`[SOUNDBOARD] Dispatched CORE_ENGINE_SWEEP_HUM`, ...l]);
    }
  };

  // Execute directive trigger
  const executeSelectedAction = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionProgress(0);
    synthEngine.playEngineHum();

    if (autoPilot) setAutoPilotTimer(autoPilotSpeed);

    const actionToRun = customActionText.trim() ? `DIY_REST: ${customActionText}` : selectedDirective;
    
    setLocalLogs(p => [
      `[LAUNCH_EXEC] Transmitting protocol to ${currentNode.name}...`,
      `[CRYPTO] Signature validated using enclaved vault key: ${currentNode.cryptKey}`,
      `[ACTION_PARAM] Payload: "${actionToRun}" (Signal power level: +${(signalBoost * 6).toFixed(1)} dBm)`,
      ...p.slice(0, 45)
    ]);

    const randomMode = ['stream', 'waves', 'radar'][Math.floor(Math.random() * 3)] as 'radar' | 'stream' | 'waves';
    setVisualizerMode(randomMode);

    const interval = setInterval(() => {
      setExecutionProgress(prev => {
        const step = (Math.floor(Math.random() * 14) + 6) * (1 + (signalBoost - 1) * 0.2);
        const nextVal = prev + step;
        
        if (nextVal >= 100) {
          clearInterval(interval);
          finishExecution(actionToRun);
          return 100;
        }
        
        if (nextVal > 30 && nextVal < 45 && prev <= 30) {
          setLocalLogs(l => [
            `[TELEMETRY] Response Code: 100 CONTINUE | Measured latency: ${liveJitterPing[currentNodeIdx] || currentNode.latencyIndex} ms`,
            `[ENCLAVE_TUNNEL] Established secure SSL session handshake to Edge`,
            ...l.slice(0, 45)
          ]);
        }
        if (nextVal > 68 && nextVal < 82 && prev <= 68) {
          setLocalLogs(l => [
            `[MUTATION] Ingesting schema changes payload. Integration parameters aligned.`,
            `[LEDGER] Logged secure token transaction back to local file context.`,
            ...l.slice(0, 45)
          ]);
        }
        
        return nextVal;
      });
    }, 135);
  };

  const finishExecution = (actionToRun: string) => {
    setIsExecuting(false);
    synthEngine.playSuccessChime();
    setVisualizerMode('radar');
    setLocalLogs(p => [
      `[REST_SUCCESS] Target response received from ${currentNode.endpoint}! State: 200 OK`,
      `[COMPLETE] Execution of "${actionToRun}" completed on dual-enclave ${currentNode.id.toUpperCase()}`,
      `================================================`,
      ...p.slice(0, 45)
    ]);
  };

  // Channel increment/decrement helpers for visual carousel swipe
  const rotateChannel = (dir: 'left' | 'right') => {
    synthEngine.playMechanicalClick();
    if (dir === 'left') {
      setActiveChannelIdx(prev => (prev === 0 ? channels.length - 1 : prev - 1));
    } else {
      setActiveChannelIdx(prev => (prev === channels.length - 1 ? 0 : prev + 1));
    }
  };

  // Local Solver decrypt check
  const handleSubmitDecryption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDecryptionPhrase.trim()) return;

    const source = decryptionSourceData[decryptionStage];
    if (!source) return;

    const parsedInput = activeDecryptionPhrase.trim().toUpperCase();
    if (parsedInput === source.answer) {
      synthEngine.playSuccessChime();
      setDecryptionFeedback({ success: true, msg: 'DEC_SUCCESS: Absolute match.' });
      setDecryptedLogs(prev => [
        `[SOLVED] Code parsed: ${source.encrypted} -> Character Plaintext: "${source.answer}"`,
        ` [INFO] ${source.lore}`,
        ...prev
      ]);
      setDecryptionStage(decryptionStage + 1);
      setActiveDecryptionPhrase('');
    } else {
      synthEngine.playEmergencySiren();
      setDecryptionFeedback({ success: false, msg: 'DEC_REJECT: Alignment drift mismatch!' });
    }
  };

  // Render original Page 0 Canvas visualizer Radar/Waves sweep
  useEffect(() => {
    if (activeChannelIdx !== 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      time += 0.045;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Clean
      ctx.fillStyle = '#040407';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.025)';
      ctx.lineWidth = 1;
      const grid = 18;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      if (visualizerMode === 'radar') {
        const centerX = w / 2;
        const centerY = h / 2;
        const maxRadius = Math.min(centerX, centerY) - 16;

        ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
        for (let r = 0.25; r <= 1; r += 0.25) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, maxRadius * r, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(centerX - maxRadius - 5, centerY);
        ctx.lineTo(centerX + maxRadius + 5, centerY);
        ctx.moveTo(centerX, centerY - maxRadius - 5);
        ctx.lineTo(centerX, centerY + maxRadius + 5);
        ctx.stroke();

        const scanAngle = (time * 0.9) % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(scanAngle) * maxRadius, centerY + Math.sin(scanAngle) * maxRadius);
        ctx.stroke();

        NODE_OBJECTIVES.forEach((node, idx) => {
          const orbitAngle = (idx * (Math.PI * 2) / 14) + (time * 0.06);
          const orbitDist = maxRadius * (0.35 + (idx % 3) * 0.2);
          const targetX = centerX + Math.cos(orbitAngle) * orbitDist;
          const targetY = centerY + Math.sin(orbitAngle) * orbitDist;

          const isCurrent = idx === currentNodeIdx;
          
          if (isCurrent) {
            ctx.fillStyle = 'rgba(0, 255, 65, 0.16)';
            ctx.beginPath();
            ctx.arc(targetX, targetY, 13 + Math.sin(time * 3.5) * 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#00FF41';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(targetX, targetY, 7 + Math.sin(time * 3.5) * 1.5, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = isCurrent ? '#00FF41' : 'rgba(0, 255, 65, 0.35)';
          ctx.beginPath();
          ctx.arc(targetX, targetY, isCurrent ? 5.5 : 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = isCurrent ? 'rgba(0, 255, 65, 0.25)' : 'rgba(0, 255, 65, 0.04)';
          ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(targetX, targetY); ctx.stroke();
        });

        ctx.fillStyle = '#00FF41';
        ctx.font = '7.5px "JetBrains Mono", Courier, monospace';
        ctx.fillText(`ACTIVE RADAR SWEEP // NODE-${currentNodeIdx + 1}: ${currentNode.name.toUpperCase()}`, 12, h - 12);
        ctx.fillText(`CRYPT SEC_KEY: ${currentNode.cryptKey}`, 12, 18);

      } else if (visualizerMode === 'stream') {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.18)';
        ctx.font = '8px "JetBrains Mono", monospace';
        
        const linesCount = 15;
        for (let i = 0; i < linesCount; i++) {
          const xPos = (w / linesCount) * i + 8;
          ctx.fillText(Math.random() > 0.4 ? "1" : "0", xPos, (time * 90 + i * 42) % h);
          ctx.fillText(Math.random() > 0.5 ? "0" : "1", xPos, (time * 90 + i * 42 + 25) % h);
          ctx.fillText(currentNode.cryptKey.charAt(i % currentNode.cryptKey.length), xPos, (time * 70 + i * 32 - 40) % h);
        }

        ctx.fillStyle = '#00FF41';
        ctx.font = '9px "JetBrains Mono", Courier, monospace';
        ctx.fillText(`TRANSMITTING BINARY PAYLOAD: [${executionProgress}%]`, 15, 22);
        
        ctx.strokeStyle = '#00FF41';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, 27, w - 30, 8);
        ctx.fillRect(15, 27, (w - 30) * (executionProgress / 100), 8);

      } else if (visualizerMode === 'waves') {
        const waveCount = 3;
        for (let wIdx = 0; wIdx < waveCount; wIdx++) {
          ctx.strokeStyle = `rgba(0, 255, 65, ${0.85 - wIdx * 0.22})`;
          ctx.lineWidth = 2.4 - wIdx * 0.7;
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const frequency = (0.012 + wIdx * 0.004) * (1 + (signalBoost - 1) * 0.25);
            const amplitude = (26 / (wIdx + 1)) * signalBoost * (executionProgress > 0 ? 1.4 : 0.8);
            const y = h / 2 + Math.sin(x * frequency + time * (2.2 + wIdx)) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        ctx.fillStyle = '#00FF41';
        ctx.font = '7.5px "JetBrains Mono", monospace';
        ctx.fillText(`ACOUSTIC SPECTRUM RESONANCE PITCH: ${reactorPitch} HZ`, 12, h - 12);
        ctx.fillText(`MUTATOR WAVE COUPLING: ACTIVE`, 12, 18);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentNodeIdx, visualizerMode, executionProgress, signalBoost, reactorPitch, activeChannelIdx]);

  return (
    <section className="bg-black border-2 border-sovereign-line relative rounded overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-24px)] select-none">
      
      {/* HUD HEADER BAR */}
      <header className="bg-[#0b0c10] border-b border-sovereign-line p-3.5 flex flex-col sm:flex-row justify-between items-center gap-3.5 flex-shrink-0 relative z-30">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2.5 bg-sovereign-neon text-black font-mono font-extrabold text-[9px] rounded uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            <Radio className="w-2.5 h-2.5" />
            <span>SOVEREIGN COMMAND HUD V7.2</span>
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] font-sans flex items-center gap-2">
              Aurelius Sovereign Command Center
              {isLiveFetching && (
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </h3>
            <span className="text-[8px] font-mono text-gray-400 uppercase block tracking-wider mt-0.5">
              Twin-Enclave Virtualized Operations Terminal // Zero Vertical Scroll Widescreen Deck
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Live Sync Status indicator */}
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1 border border-gray-900 rounded-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
            </span>
            <span className="text-[8px] font-mono text-gray-400">
              {isLiveFetching ? 'TUNNEL_TUNING...' : 'LEDGER SECURELY COMMITTED'}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-gray-800 hidden md:block" />

          {/* Sound Mute */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-gray-500 uppercase">SYNTH_OUTPUT</span>
            <button
              onClick={() => {
                synthEngine.playMechanicalClick();
                setIsAudioMuted(!isAudioMuted);
              }}
              className={`p-1 px-2 border rounded cursor-pointer transition-all font-mono text-[8.5px] uppercase ${
                isAudioMuted ? 'border-red-500/50 text-red-400 bg-red-950/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20'
              }`}
              title={isAudioMuted ? "Unmute Tactical Sound Effects" : "Mute Tactical Sound Effects"}
            >
              <div className="flex items-center gap-1.5">
                {isAudioMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 animate-pulse" />}
                <span>{isAudioMuted ? 'MUTED' : 'ONLINE'}</span>
              </div>
            </button>
          </div>
          
          <div className="h-4 w-[1px] bg-gray-800 hidden md:block" />
          
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] font-mono text-sovereign-neon tracking-widest leading-none">HIGH INTEGRITY</span>
            <Wifi className="w-3.5 h-3.5 text-sovereign-neon animate-pulse" />
          </div>
        </div>
      </header>

      {/* HORIZONTAL CHANNEL NAVIGATION DOCK */}
      <nav className="bg-[#050507] border-b border-sovereign-line px-3 py-2 flex items-center justify-between gap-3.5 flex-shrink-0 relative z-30">
        <button
          onClick={() => rotateChannel('left')}
          className="p-2 border border-gray-800 hover:border-sovereign-neon bg-black text-gray-400 hover:text-white transition-all rounded cursor-pointer focus:outline-none flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-sovereign-neon" />
        </button>

        {/* Widescreen tabs dock */}
        <div className="flex-1 overflow-x-auto custom-scrollbar flex gap-2.5 py-1 px-1 select-none whitespace-nowrap scroll-smooth">
          {channels.map((chan, i) => {
            const isSelected = i === activeChannelIdx;
            const IconComponent = chan.icon;
            
            return (
              <button
                key={chan.id}
                onClick={() => {
                  synthEngine.playMechanicalClick();
                  setActiveChannelIdx(i);
                }}
                className={`py-2 px-4 border font-mono text-[9px] uppercase tracking-wider rounded cursor-pointer transition-all flex items-center gap-2 flex-shrink-0 ${
                  isSelected 
                    ? 'border-sovereign-neon text-black bg-sovereign-neon/90 font-bold shadow-[0_0_12px_rgba(0,255,65,0.25)]' 
                    : 'border-gray-900 bg-black text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-black animate-pulse' : 'text-sovereign-neon/70'}`} />
                <div className="flex flex-col items-start">
                  <span className="text-[9.5px] font-black leading-none">{chan.label}</span>
                  <span className={`text-[6.5px] font-mono normal-case leading-none mt-1 opacity-70 ${isSelected ? 'text-black/80' : 'text-gray-500'}`}>
                    {chan.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => rotateChannel('right')}
          className="p-2 border border-gray-800 hover:border-sovereign-neon bg-black text-gray-400 hover:text-white transition-all rounded cursor-pointer focus:outline-none flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 text-sovereign-neon" />
        </button>
      </nav>

      {/* CORE CAROUSEL SLIDER VIEWPORT */}
      <div className="flex-1 min-h-0 relative bg-black overflow-hidden z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChannelIdx}
            initial={{ opacity: 0, x: 45 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -45 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full p-4 overflow-hidden"
          >
            
            {/* CHANNEL 0: EXTREME TACTICAL MISSION DIRECTORS */}
            {activeChannelIdx === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full overflow-hidden">
                
                {/* Nodes scrolling band column */}
                <div className="lg:col-span-8 flex flex-col justify-between h-full min-h-0 bg-[#040406] border border-gray-900 rounded p-4 gap-4">
                  
                  {/* Title metadata */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-900 pb-2 flex-shrink-0">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[8px] font-mono px-2 py-0.5 border border-indigo-500/40 text-indigo-400 bg-indigo-950/20 rounded uppercase">
                          NODE TARGET {currentNodeIdx + 1} / 14
                        </span>
                        <span className="text-[8px] font-mono px-2 py-0.5 border border-sovereign-neon/40 text-sovereign-neon bg-emerald-950/20 rounded uppercase">
                          {currentNode.type}
                        </span>
                        <span className="text-[8px] font-mono px-2 py-0.5 border border-cyan-500/40 text-cyan-400 bg-cyan-950/20 rounded uppercase">
                          {NODE_OBJECTIVES[currentNodeIdx].category}
                        </span>
                      </div>
                      <h4 className="text-xl font-sans font-black text-white uppercase tracking-tight">
                        {currentNode.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[9px]">
                        <Link className="w-2.5 h-2.5 text-gray-600" />
                        <span>SUITE URL:</span>
                        <a href={currentNode.endpoint} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-sovereign-neon underline decoration-emerald-500/20">
                          {currentNode.endpoint}
                        </a>
                      </div>
                    </div>

                    <div className="bg-[#07070b] border border-gray-800 p-2 rounded text-right min-w-[125px]">
                      <span className="text-[7.5px] font-mono text-gray-500 block uppercase">LEDGER_STABLE_SCORE</span>
                      <span className="text-xs font-mono font-extrabold text-cyan-400 block mt-0.5 font-bold">
                        {(liveNodesData[currentNodeIdx]?.score || 98) + (signalBoost > 1.0 ? Math.floor(signalBoost * 1.2) : 0)}% Integrity
                      </span>
                      <span className="text-[7px] font-mono text-gray-400 uppercase tracking-widest mt-0.5 block truncate">
                        STATUS: {liveNodesData[currentNodeIdx] ? liveNodesData[currentNodeIdx].status : currentNode.status}
                      </span>
                    </div>
                  </div>

                  {/* Preloaded System Dropdown selection */}
                  <div className="bg-[#07070b]/90 border border-gray-900 rounded p-3 space-y-1.5 flex-shrink-0">
                    <span className="text-[8.5px] font-mono text-gray-400 uppercase block font-bold tracking-widest flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sovereign-neon" />
                      <span>⚡ Preloaded Mission Directives (Automated Options)</span>
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <select
                        value={selectedDirective}
                        onChange={(e) => {
                          synthEngine.playMechanicalClick();
                          setSelectedDirective(e.target.value);
                        }}
                        disabled={isExecuting}
                        className="md:col-span-8 bg-black border border-gray-800 text-[10px] font-mono text-white p-2 rounded focus:outline-none focus:border-sovereign-neon cursor-pointer"
                      >
                        {currentNode.preloadedDirectives.map((cmd) => (
                          <option key={cmd} value={cmd} className="bg-black text-[9px]">{cmd}</option>
                        ))}
                      </select>
                      <div className="md:col-span-4 text-[8px] font-mono text-gray-500 uppercase leading-normal">
                        Reroute absolute security states into the server's backend Express database enclaves.
                      </div>
                    </div>
                  </div>

                  {/* Custom Command Box */}
                  <div className="bg-[#07070b]/90 border border-gray-900 rounded p-3 space-y-1.5 flex-shrink-0">
                    <div className="flex justify-between items-center text-[8.5px] font-mono">
                      <span className="text-gray-400 uppercase font-bold tracking-[0.1em] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                        <span>⚙️ DIY Rest API Injector Mode (Custom Command Key)</span>
                      </span>
                      <span className="text-yellow-500 text-[7px] uppercase font-bold bg-yellow-950/10 px-1.5 py-0.5 border border-yellow-800/20 rounded">
                        REPLICATION BY-PASS APPROVED
                      </span>
                    </div>
                    <input
                      type="text"
                      value={customActionText}
                      onChange={(e) => setCustomActionText(e.target.value)}
                      disabled={isExecuting}
                      placeholder="PROMPT BY-PASS COMMAND (e.g. trigger_local_audit, lock_mesh, reindex_catalog)..."
                      className="w-full bg-black border border-gray-850 text-[10.5px] font-mono text-yellow-400 placeholder-gray-800 py-2.5 px-3 focus:outline-none focus:border-yellow-500 rounded"
                    />
                  </div>

                  {/* Command buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center flex-shrink-0">
                    <button
                      onClick={executeSelectedAction}
                      disabled={isExecuting}
                      className="w-full sm:w-auto px-6 py-3 bg-sovereign-neon hover:bg-white text-black font-extrabold uppercase font-mono text-[9px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer rounded disabled:opacity-45"
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Deploy Directive</span>
                        </>
                      )}
                    </button>

                    <div className="flex-1 w-full bg-black/60 border border-gray-950 rounded p-2 flex flex-col justify-center gap-1">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-gray-500">
                        <span>ESTIMATED LATENCY: {liveJitterPing[currentNodeIdx] || currentNode.latencyIndex} MS</span>
                        <span className="text-sovereign-neon">BOOST AMPLIFIED</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden border border-gray-950 relative">
                        <motion.div className="h-full bg-sovereign-neon" style={{ width: `${isExecuting ? executionProgress : 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Narrative details logs inside panel */}
                  <div className="flex-1 min-h-0 bg-black border border-gray-950 rounded p-2.5 overflow-hidden flex flex-col justify-between">
                    <span className="text-[7.5px] font-mono text-indigo-400 uppercase block font-bold border-b border-gray-950 pb-1 flex-shrink-0 tracking-wider">
                      Console Trace Telemetry Nodes:
                    </span>
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[8.5px] text-gray-400 space-y-1 pt-1.5 min-h-0">
                      {localLogs.map((logMsg, i) => (
                        <div key={i} className="truncate select-text select-none">
                          <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {logMsg}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Cyber Canvas and Tonal reactor adjustments column */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-0 bg-[#040406] border border-gray-900 rounded overflow-hidden">
                  
                  {/* Visualizer viewport */}
                  <div className="relative aspect-[4/3] w-full min-h-[160px] border-b border-gray-900 bg-black flex-shrink-0">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
                    <div className="absolute top-2.5 right-2.5 flex gap-1 z-20">
                      {(['radar', 'waves', 'stream'] as const).map((mode) => (
                        <button 
                          key={mode} 
                          onClick={() => { synthEngine.playMechanicalClick(); setVisualizerMode(mode); }}
                          className={`p-1 px-1.5 border font-mono text-[7px] uppercase rounded transition-colors cursor-pointer ${
                            visualizerMode === mode 
                              ? 'border-sovereign-neon text-sovereign-neon bg-emerald-950/20 font-bold' 
                              : 'border-gray-800 text-gray-500 bg-black/60 hover:text-gray-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 border border-gray-900 px-2 py-0.5 rounded text-[7px] font-mono text-gray-400 uppercase flex items-center gap-1 shadow-md z-20">
                      <Activity className="w-2.5 h-2.5 text-sovereign-neon animate-pulse" />
                      <span>{currentNode.name.split('.')[0]}</span>
                    </div>
                  </div>

                  {/* Tuning Controllers Sliders */}
                  <div className="p-3 bg-[#08080c]/50 border-b border-gray-900 space-y-2.5 flex-shrink-0">
                    <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block font-extrabold flex items-center gap-1 border-b border-gray-950 pb-1">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      <span>🎛️ Acoustic Reactor Signal Tuning Controls</span>
                    </span>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[7px] font-mono">
                        <span className="text-gray-500">I. SIGNAL BOOST (AMPLITUDE MULTIPLIER)</span>
                        <span className="text-sovereign-neon font-bold">{signalBoost.toFixed(1)}x (+{(signalBoost * 12).toFixed(0)} dB)</span>
                      </div>
                      <input 
                        type="range" min="1.0" max="5.0" step="0.1" value={signalBoost}
                        onChange={(e) => { setSignalBoost(parseFloat(e.target.value)); synthEngine.playMechanicalClick(); }}
                        className="w-full accent-sovereign-neon bg-gray-955 h-1 rounded cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[7px] font-mono">
                        <span className="text-gray-500">II. TACTICAL DRONE ANCHOR FREQUENCY</span>
                        <span className="text-indigo-400 font-bold">{reactorPitch} HZ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" min="35" max="120" step="1" value={reactorPitch}
                          onChange={(e) => setReactorPitch(parseInt(e.target.value))}
                          className="flex-1 accent-indigo-400 bg-gray-955 h-1 rounded cursor-pointer"
                        />
                        <button
                          onClick={handleToggleHum}
                          className={`px-2 py-0.5 border text-[7.5px] font-mono rounded cursor-pointer transition-colors ${
                            interactiveHumActive ? 'border-indigo-500 text-black bg-indigo-500 font-bold' : 'border-gray-800 text-gray-400 hover:text-white bg-black/40'
                          }`}
                        >
                          {interactiveHumActive ? 'Hum ON' : 'Hum OFF'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[7px] font-mono">
                        <span className="text-gray-500">III. AUTOPILOT DWELL TIME CYCLER</span>
                        <span className="text-cyan-400 font-bold">{autoPilotSpeed} Seconds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" min="4" max="30" step="1" value={autoPilotSpeed}
                          onChange={(e) => { setAutoPilotSpeed(parseInt(e.target.value)); setAutoPilotTimer(parseInt(e.target.value)); }}
                          className="flex-1 accent-cyan-400 bg-gray-955 h-1 rounded cursor-pointer"
                        />
                        <button
                          onClick={() => { synthEngine.playMechanicalClick(); setAutoPilot(!autoPilot); setAutoPilotTimer(autoPilotSpeed); }}
                          className={`px-2 py-0.5 border text-[7.5px] font-mono rounded cursor-pointer transition-all ${
                            autoPilot ? 'border-cyan-500 text-black bg-cyan-500 font-bold' : 'border-gray-800 text-gray-400 bg-black/40'
                          }`}
                        >
                          {autoPilot ? 'STOP_SCAN' : 'AUTO_SCAN'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sound Trigger Station keys */}
                  <div className="p-3 bg-[#08080c]/80 flex-1 flex flex-col justify-center gap-1.5">
                    <span className="text-[7.5px] font-mono text-gray-400 uppercase block font-extrabold flex items-center justify-between border-b border-gray-950 pb-1 flex-shrink-0">
                      <span className="flex items-center gap-1.5"><Music className="w-3 h-3 text-cyan-400" /><span>🎹 Live Synthesizer playboard</span></span>
                    </span>
                    <div className="grid grid-cols-5 gap-1 select-none flex-shrink-0">
                      {(['click', 'beep', 'hum', 'chime', 'siren'] as const).map((snd) => (
                        <button 
                          key={snd} onClick={() => triggerSoundKey(snd)}
                          className="py-2.5 px-0.5 border border-gray-850 hover:border-emerald-500 hover:text-white bg-black/60 text-gray-400 font-mono text-[7px] rounded capitalize transition-all transform active:scale-95 cursor-pointer flex flex-col items-center gap-1"
                        >
                          <span className="text-[5.5px] text-gray-600 block uppercase">OSC</span>
                          <span>{snd}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* CHANNEL 1: TWO CORES REAL-TIME INTERACTIVE GPT-LLM CHAT */}
            {activeChannelIdx === 1 && (
              <div className="h-full w-full overflow-hidden flex flex-col bg-[#040406] border border-gray-900 rounded p-1.5 min-h-0 relative">
                <AIChat isInline={true} />
              </div>
            )}

            {/* CHANNEL 2: HIGH-FREQUENCY MITOSIS WEB CRAWLER GATEWAY */}
            {activeChannelIdx === 2 && (
              <div className="h-full w-full overflow-hidden flex flex-col bg-[#040406] border border-gray-900 rounded p-2 min-h-0 relative">
                <div className="flex justify-between items-center bg-[#07070b] border border-gray-900 p-2 text-xs font-mono mb-2 flex-shrink-0">
                  <span className="text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-sovereign-neon animate-pulse" />
                    <span>Recursive traversal Matrix & Crawler swarm engine</span>
                  </span>
                  <span className="text-emerald-400 text-[8px] bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/30 rounded font-bold">
                    MITOSIS: ACTIVE
                  </span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                  <SovereignCrawlerPanel 
                    onTerminalLog={onTerminalLog}
                    onRefreshStats={async () => {
                      try {
                        const res = await fetch('/api/swarm/status');
                        if (res.ok) {
                          const data = await res.json();
                          setSwarmStats(data);
                        }
                      } catch (err) {
                        console.error("Error refreshing swarm stats:", err);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* CHANNEL 3: LMAX DISRUPTOR NEURAL DEEPTHINK MULTI-AGENT COMPILER */}
            {activeChannelIdx === 3 && (
              <div className="h-full w-full overflow-hidden flex flex-col bg-[#040406] border border-gray-900 rounded p-2 min-h-0 relative">
                <div className="flex justify-between items-center bg-[#07070b] border border-gray-900 p-2 text-xs font-mono mb-2 flex-shrink-0">
                  <span className="text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>LMAX Disruptor & Dual-Enclave Neural Brain Compiler</span>
                  </span>
                  <span className="text-purple-400 text-[8px] bg-purple-950/20 px-2 py-0.5 border border-purple-550/30 rounded font-bold">
                    NEUROMORPHIC COHESION: ACTIVE
                  </span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                  <SovereignBrainConsole 
                    onTerminalLog={onTerminalLog}
                    swarmStats={swarmStats}
                    setSwarmStats={setSwarmStats}
                  />
                </div>
              </div>
            )}

            {/* CHANNEL 4: LIVE SOUND ACTIVE SWARM TUNER & MATRIX LOCKS */}
            {activeChannelIdx === 4 && (
              <div className="h-full w-full overflow-hidden flex flex-col bg-[#040406] border border-gray-900 rounded p-2 min-h-0 relative">
                <div className="flex justify-between items-center bg-[#07070b] border border-gray-900 p-2 text-xs font-mono mb-2 flex-shrink-0">
                  <span className="text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Acoustic Amplitude Tuner & Dual-Silo Security Handshaking</span>
                  </span>
                  <span className="text-cyan-400 text-[8px] bg-cyan-950/20 px-2 py-0.5 border border-cyan-550/30 rounded font-bold">
                    PGP LOCK CONTROL: DEPLOYED
                  </span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                  <SovereignTuningPanel 
                    onTerminalLog={onTerminalLog}
                    nodeLocks={nodeLocks}
                    onToggleNodeLock={onToggleNodeLock}
                    onToggleUniversalLock={onToggleUniversalLock}
                    notesPermanentLock={notesPermanentLock}
                    onToggleNotesPermanentLock={onToggleNotesPermanentLock}
                    swarmStats={swarmStats}
                    setSwarmStats={setSwarmStats}
                  />
                </div>
              </div>
            )}

            {/* CHANNEL 5: THE GREAT JHAM WORD 3D MODEL SCULPTING PROCESSOR */}
            {activeChannelIdx === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full overflow-hidden">
                
                {/* Script text editor column */}
                <div className="lg:col-span-5 h-full min-h-0 bg-[#040406] border border-gray-900 rounded p-4 flex flex-col justify-between gap-3">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2 flex-shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">JHAM 3D MODEL SCULPTING CODE SUITE</span>
                      <h4 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-sovereign-neon" />
                        <span>Word Document Core Parser</span>
                      </h4>
                    </div>
                    <span className="text-sovereign-neon text-[8.5px] font-mono uppercase tracking-[0.25em] animate-pulse">
                      SECURE_PRODUCTION
                    </span>
                  </div>

                  {/* Presets blueprints drawer */}
                  <div className="bg-black border border-gray-950 p-2 rounded flex-shrink-0">
                    <span className="text-[6.5px] font-mono text-gray-500 uppercase block tracking-widest pb-1 border-b border-gray-950">
                      I. CHOOSE PRE-PACKED WORD BLUEPRINT SCHEMAS:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                      {(['swarm', 'starship', 'gate', 'sphere'] as const).map((preset) => (
                        <button 
                          key={preset}
                          onClick={() => loadJhamPreset(preset)}
                          className={`py-1 bg-black/60 border font-mono text-[7.5px] uppercase tracking-wider rounded cursor-pointer transition-all ${
                            jhamActiveShape === preset 
                              ? 'border-sovereign-neon text-sovereign-neon font-black bg-emerald-950/10 shadow-[0_0_8px_rgba(0,255,65,0.15)]' 
                              : 'border-gray-900 text-gray-500 hover:text-white'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Word doc editor */}
                  <div className="flex-1 min-h-0 flex flex-col justify-between bg-black border border-gray-950 p-2 rounded">
                    <span className="text-[6.5px] font-mono text-gray-500 uppercase block tracking-widest pb-1 flex-shrink-0">
                      II. DOCUMENT SCRIPTS INTERNET DIRECTIVE EDITOR:
                    </span>
                    <textarea
                      value={jhamSourceCode}
                      onChange={(e) => setJhamSourceCode(e.target.value)}
                      disabled={jhamExecuting}
                      className="flex-1 w-full bg-black text-gray-300 font-mono text-[10px] leading-relaxed p-2 focus:outline-none focus:border-sovereign-neon resize-none min-h-0 select-text"
                    />
                  </div>

                  {/* Trigger compiler switcher */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={compileJhamScript}
                      disabled={jhamExecuting}
                      className="px-6 py-3 bg-sovereign-neon hover:bg-white text-black font-extrabold uppercase font-mono text-[9px] tracking-[0.2em] rounded cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      {jhamExecuting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>PARSING WORD...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Execute JHAM Script</span>
                        </>
                      )}
                    </button>
                    <div className="text-[7.5px] font-mono text-gray-400 uppercase leading-relaxed">
                      *Word doc interpreter parses programmatic layout rules and builds mathematical vertices rotation matrices.
                    </div>
                  </div>

                  {/* Trace Logs panel */}
                  <div className="h-24 bg-black border border-gray-950 p-2 rounded overflow-hidden flex flex-col justify-between flex-shrink-0">
                    <span className="text-[6.5px] font-mono text-indigo-400 font-extrabold uppercase tracking-wide border-b border-gray-950 pb-1">
                      Programmer Logs Trace:
                    </span>
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[8px] text-gray-500 space-y-0.5 pt-1">
                      {jhamConsoleLogs.map((logStr, i) => (
                        <div key={i} className="truncate select-text">
                          <span className="text-gray-750">[{new Date().toLocaleTimeString()}]</span> {logStr}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Cyber projection visualization viewport and dials */}
                <div className="lg:col-span-7 h-full min-h-0 bg-[#040406] border border-gray-900 rounded overflow-hidden flex flex-col justify-between">
                  
                  {/* Holographic rendering port */}
                  <div className="relative flex-1 min-h-[220px] bg-black">
                    <canvas ref={jhamCanvasRef} className="absolute inset-0 w-full h-full block" />
                    
                    {/* Perspective projection HUD */}
                    <div className="absolute top-3.5 right-3.5 flex flex-col gap-1 text-right font-mono text-[7.5px] text-gray-500 bg-black/80 border border-gray-950 p-2.5 rounded-sm z-20">
                      <span className="text-sovereign-neon font-black font-bold">HOLOGRAPHIC EYE PROJECTOR // SHAPE: {jhamActiveShape.toUpperCase()}</span>
                      <span>IMAGE SCALE: {jhamScale.toFixed(2)}X (Hyper scaled)</span>
                      <span>CYBER DEPTH (FOV): {jhamFov} FL</span>
                      <span>WIREFRAME_EDGES: {jhamWireframe ? 'WIREFRAME' : 'VERTICES_ONLY'}</span>
                      <div className="h-px bg-gray-900 my-1"/>
                      <button 
                        onClick={() => { synthEngine.playMechanicalClick(); setJhamWireframe(!jhamWireframe); }}
                        className="py-1 px-2 border border-gray-800 text-gray-300 rounded hover:border-sovereign-neon hover:text-white transition-colors cursor-pointer"
                      >
                        Toggler wireframe lines
                      </button>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 bg-black/85 border border-gray-950 px-2.5 py-1.5 rounded-sm flex items-center gap-2 text-[8px] font-mono text-gray-400 z-20">
                      <Atom className="w-3.5 h-3.5 text-sovereign-neon animate-spin" />
                      <span>LIVE 3D VECTOR TRANSFORMATION ENGINE PERSPECTIVES RENDERER</span>
                    </div>

                    {/* Laser calibration markings */}
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-sovereign-neon/20 pointer-events-none"/>
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-sovereign-neon/20 pointer-events-none"/>
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-sovereign-neon/20 pointer-events-none"/>
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-sovereign-neon/20 pointer-events-none"/>
                  </div>

                  {/* Microtweak parameters sliders */}
                  <div className="p-4 bg-[#08080c] border-t border-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-[7px]">
                        <span className="text-gray-500">I. FOV (FOCAL DEPTH LEVEL DEFINITION)</span>
                        <span className="text-sovereign-neon font-extrabold">{jhamFov} FL</span>
                      </div>
                      <input 
                        type="range" min="100" max="400" value={jhamFov} onChange={(e) => setJhamFov(parseInt(e.target.value))}
                        className="w-full accent-sovereign-neon bg-gray-955 h-1 rounded cursor-pointer"
                      />

                      <div className="flex justify-between font-mono text-[7px] mt-1.5">
                        <span className="text-gray-500">II. COMPILER DENSITY POINT INTENCITY</span>
                        <span className="text-indigo-400 font-extrabold">{jhamVerticesCount} Vertices</span>
                      </div>
                      <input 
                        type="range" min="20" max="200" value={jhamVerticesCount} onChange={(e) => setJhamVerticesCount(parseInt(e.target.value))}
                        className="w-full accent-indigo-400 bg-gray-955 h-1 rounded cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-[7px]">
                        <span className="text-gray-500">III. PROGRAMMED SCALE STABILITY (IMAG_SCALE)</span>
                        <span className="text-cyan-400 font-extrabold">{jhamScale.toFixed(2)}x</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="4.0" step="0.1" value={jhamScale} onChange={(e) => setJhamScale(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 bg-gray-955 h-1 rounded cursor-pointer"
                      />

                      <div className="flex justify-between font-mono text-[7px] mt-1.5">
                        <span className="text-gray-500">IV. INITIAL VECTOR HORIZON ROTATION</span>
                        <span className="text-purple-400 font-extrabold">{jhamRotY.toFixed(2)} RAD</span>
                      </div>
                      <input 
                        type="range" min="0.0" max="3.14" step="0.1" value={jhamRotY} onChange={(e) => setJhamRotY(parseFloat(e.target.value))}
                        className="w-full accent-purple-400 bg-gray-955 h-1 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* CHANNEL 6: NETWORK INTERGRITY DUAL-ENCLAVE TELEMETRY LEDGER */}
            {activeChannelIdx === 6 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full overflow-hidden">
                
                {/* Visualizer maps column */}
                <div className="lg:col-span-8 flex flex-col justify-between h-full min-h-0 bg-[#040406] border border-gray-900 rounded p-4 gap-4">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2 flex-shrink-0">
                    <div className="space-y-0.5">
                      <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">AURELIUS UNIFIED SINGULARITY DECK</span>
                      <h4 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-bold">
                        <Atom className="w-4 h-4 text-purple-400 animate-spin" />
                        <span>Sovereign Singularity & Pipeline Status Monitor</span>
                      </h4>
                    </div>
                    <span className="text-purple-400 text-[8px] font-mono bg-purple-950/20 px-2 py-0.5 border border-purple-550/30 rounded font-bold">
                      TELEMETRIC RUNNER READY
                    </span>
                  </div>

                  {/* Network singularity map */}
                  <div className="flex-1 min-h-[160px] bg-black border border-gray-950 rounded p-2 overflow-hidden flex flex-col">
                    <span className="text-[6.5px] font-mono text-gray-500 uppercase tracking-widest block pb-1 border-b border-gray-950">
                      I. DUAL-MESH NETWORK TOPOLOGY MAP:
                    </span>
                    <div className="flex-1 min-h-0 relative">
                      <SingularityVisualizer />
                    </div>
                  </div>

                  {/* Pipeline logs indicator */}
                  <div className="h-44 bg-black border border-gray-950 rounded p-2 flex flex-col flex-shrink-0">
                    <span className="text-[6.5px] font-mono text-gray-500 uppercase tracking-widest block pb-1 border-b border-gray-950 flex-shrink-0">
                      II. DISPATCH MULTI-AGENT STATE RUNNER ACTION STATUS:
                    </span>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                      <PipelineStatus />
                    </div>
                  </div>

                </div>

                {/* Right Column: Code lock validation and decryption archives */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-0 bg-[#040406] border border-gray-900 rounded p-4 gap-4 overflow-hidden">
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block font-extrabold flex items-center gap-1.5 border-b border-gray-950 pb-2 flex-shrink-0">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>🔑 Enclaved Cryptographic Decryption Core</span>
                  </span>

                  {decryptionStage < 3 ? (
                    <form onSubmit={handleSubmitDecryption} className="space-y-3.5 flex-1 flex flex-col justify-between min-h-0">
                      <div className="bg-black border border-gray-950 p-2.5 rounded space-y-2 flex-shrink-0">
                        <span className="text-[8px] font-mono text-gray-400 block font-bold uppercase tracking-wider">
                          ACTIVE CELL REPLICA:
                        </span>
                        <div className="p-2 bg-purple-950/10 border border-purple-500/20 rounded font-mono text-[9px] text-purple-300 font-bold tracking-widest animate-pulse uppercase truncate">
                          {decryptionSourceData[decryptionStage]?.archiveCode}
                        </div>
                      </div>

                      <div className="bg-black border border-gray-950 p-2.5 rounded space-y-1.5 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <div className="flex justify-between font-mono text-[7px] text-gray-500 uppercase tracking-wider">
                          <span>CIPHER TEXT</span>
                          <span className="text-purple-400 font-bold">{decryptionSourceData[decryptionStage]?.algorithm}</span>
                        </div>
                        <div className="p-2.5 bg-[#07070b] border border-gray-900 rounded font-mono text-xs text-white tracking-widest text-center select-text font-black">
                          {decryptionSourceData[decryptionStage]?.encrypted}
                        </div>
                        <p className="text-[8px] font-mono leading-relaxed text-gray-500 uppercase pt-1">
                          HINT/GLYPH: <span className="text-purple-300 font-bold">{decryptionSourceData[decryptionStage]?.hint}</span>
                        </p>
                      </div>

                      <div className="space-y-2 flex-shrink-0">
                        <input
                          type="text"
                          value={activeDecryptionPhrase}
                          onChange={(e) => setActiveDecryptionPhrase(e.target.value)}
                          placeholder="INPUT PLAINTEXT MATCH SEED..."
                          className="w-full bg-black border border-gray-850 py-3 px-3 text-[10px] font-mono text-purple-400 focus:outline-none focus:border-purple-500 rounded uppercase tracking-wider"
                        />
                        <button
                          type="submit"
                          disabled={!activeDecryptionPhrase.trim()}
                          className="w-full py-3 bg-purple-600 hover:bg-white text-black font-extrabold uppercase font-mono text-[9.5px] tracking-[0.2em] rounded cursor-pointer transition-all disabled:opacity-40"
                        >
                          Submit Handshake Plaintext
                        </button>
                      </div>

                      {decryptionFeedback && (
                        <div className={`p-2 border text-[8px] font-mono rounded text-center flex-shrink-0 ${
                          decryptionFeedback.success ? 'border-emerald-500 bg-emerald-950/10 text-emerald-400' : 'border-red-500 bg-red-950/10 text-red-400'
                        }`}>
                          {decryptionFeedback.msg}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
                      <div className="p-4 bg-purple-950/20 border border-purple-500 rounded text-center space-y-2 flex-shrink-0">
                        <ShieldCheck className="w-10 h-10 text-purple-500 mx-auto animate-pulse" />
                        <p className="text-[9px] text-purple-305 font-black uppercase tracking-widest">
                          SOVEREIGN SEC-CELL DECRYPT COMPLETED
                        </p>
                        <p className="text-[7.5px] font-mono text-purple-400/80 leading-normal uppercase">
                          "Mesh handshake mapping verified completely. Decrypted logs added back to secure enclaves."
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { synthEngine.playMechanicalClick(); setDecryptionStage(0); setDecryptedLogs([]); setDecryptionFeedback(null); }}
                        className="w-full py-3 border border-purple-500/30 text-purple-450 hover:bg-purple-600 hover:text-black hover:border-purple-600 transition-all font-mono text-[9px] font-bold uppercase rounded cursor-pointer flex-shrink-0"
                      >
                        Reset Cryptographic Sequence
                      </button>
                    </div>
                  )}

                  {/* Solved archives logs */}
                  {decryptedLogs.length > 0 && (
                    <div className="bg-black border border-gray-950 p-2 rounded max-h-[100px] overflow-y-auto custom-scrollbar flex-shrink-0">
                      <span className="text-[6.5px] font-mono text-purple-300 uppercase block font-bold tracking-widest pb-1 border-b border-gray-950">
                        DECRYPTED SECURITY ARCHIVES COPIES:
                      </span>
                      <div className="space-y-1 mt-1 text-[7px] font-mono text-purple-400 select-text leading-tight">
                        {decryptedLogs.map((logItem, index) => (
                          <div key={index} className="truncate select-text">{logItem}</div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* CHANNEL 7: A2A BRIDGE & JHAMMERZ GITHUB NETWORK SUBSTRATE */}
            {activeChannelIdx === 7 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar">
                <A2ABridgeConsole onTerminalLog={onTerminalLog} />
              </div>
            )}

            {/* CHANNEL 8: RESILIENCY & AUDIT MITIGATION MATRIX */}
            {activeChannelIdx === 8 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar p-4">
                <SovereignAuditMitigationPanel onTerminalLog={onTerminalLog} />
              </div>
            )}

            {/* CHANNEL 9: SOVEREIGN LIVING MANIFEST V4.0.26 ULTIMATE */}
            {activeChannelIdx === 9 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar p-4">
                <SovereignLivingManifestPanel onTerminalLog={onTerminalLog} />
              </div>
            )}

            {/* CHANNEL 10: SOVEREIGN CANNON // ULTIMATE DISTRIBUTION MANIFEST V4.2 */}
            {activeChannelIdx === 10 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar p-4">
                <SovereignCannonDistributionPanel onTerminalLog={onTerminalLog} />
              </div>
            )}

            {/* CHANNEL 11: MILITARY-GRADE BRAIN-TO-BODY SYNAPTIC MATRIX */}
            {activeChannelIdx === 11 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar p-4">
                <SovereignBrainToBodySynapse onTerminalLog={onTerminalLog} />
              </div>
            )}

            {/* CHANNEL 12: W.O.R.M. IMMUTABLE PERSISTENCE VAULT */}
            {activeChannelIdx === 12 && (
              <div className="w-full h-full min-h-0 overflow-y-auto custom-scrollbar p-4">
                <SovereignWormLedgerPanel />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* DETAILED INTERACTIVE BOTTOM NAVIGATION DECK FLOOR PANEL */}
      <footer className="border-t-2 border-sovereign-line p-3 bg-black flex-shrink-0 relative z-30">
        <div className="flex items-center justify-between gap-3 border-b border-gray-950 pb-2 mb-2 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-sovereign-neon animate-pulse" />
            <h5 className="text-[8.5px] font-black font-mono uppercase tracking-[0.15em] text-white">
              Sovereign Twin-Enclave Integrated Distribution Grid Analytics Dashboard
            </h5>
          </div>

          <div className="flex items-center gap-4 text-[7px] font-mono text-gray-500">
            <span className="flex items-center gap-1"><span className="w-1.2 h-1.2 rounded-full bg-emerald-500 inline-block"/> STABLE_STATE</span>
            <span className="flex items-center gap-1"><span className="w-1.2 h-1.2 rounded-full bg-cyan-400 inline-block animate-pulse"/> ACTIVE_STREAM</span>
            <button 
              onClick={fetchBackendData}
              className="px-2 py-0.5 border border-gray-850 rounded bg-black/60 hover:text-white hover:border-gray-650 cursor-pointer text-[7.5px]"
            >
              PING ALL ENCLAVES
            </button>
          </div>
        </div>

        {/* 14-Node Grid Map Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 flex-shrink-0 w-full overflow-hidden select-none">
          {NODE_OBJECTIVES.map((node, i) => {
            const isSelected = i === currentNodeIdx && activeChannelIdx === 0;
            const currentPing = liveJitterPing[i] || node.latencyIndex;
            const liveData = liveNodesData[i];
            
            let statusColor = 'bg-emerald-500';
            if (i % 3 === 0) statusColor = 'bg-cyan-400 animate-pulse';
            if (i === 10) statusColor = 'bg-teal-400';

            return (
              <div
                key={node.id}
                onClick={() => {
                  synthEngine.playMechanicalClick();
                  setCurrentNodeIdx(i);
                  setActiveChannelIdx(0); // auto-jump back to Mission Core page!
                }}
                className={`p-2 border rounded text-left transition-all relative cursor-pointer group ${
                  isSelected 
                    ? 'border-sovereign-neon bg-sovereign-neon/5 shadow-[0_0_10px_rgba(0,255,65,0.15)] font-bold' 
                    : 'border-gray-950 hover:border-gray-800 bg-[#030305]'
                }`}
              >
                {/* Health Flashing Dot */}
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className={`inline-block w-1.2 h-1.2 rounded-full ${statusColor}`} />
                </div>

                <div className="font-mono text-[7px] text-gray-500 font-bold uppercase block tracking-wider leading-none">
                  OBJ-{String(i+1).padStart(2, '0')}
                </div>
                
                <div className="font-sans font-black text-[9.5px] text-gray-200 mt-1 uppercase truncate">
                  {node.name.split('.')[0]}
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-950 text-[6.5px] font-mono">
                  <span className="text-gray-500 leading-none">LATENCY</span>
                  <span className={isSelected ? 'text-sovereign-neon font-bold leading-none' : 'text-gray-400 leading-none'}>
                    {currentPing}ms
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-0.5 text-[6.5px] font-mono">
                  <span className="text-gray-500 leading-none">SCORE</span>
                  <span className="text-cyan-400 font-extrabold leading-none">
                    {liveData ? liveData.score : (97 + (i % 4))}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </footer>

    </section>
  );
}

export const SovereignGameConsoleHUD = SovereignWarRoomHUD;
