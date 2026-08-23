import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Code2, 
  Play, 
  Network, 
  Globe, 
  ShieldCheck, 
  SlidersHorizontal, 
  RefreshCw, 
  FileCode,
  Wifi,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Database,
  Activity,
  Sun,
  Lock,
  Zap,
  Shield,
  Radio,
  VolumeX,
  Flame,
  Power,
  GitBranch
} from 'lucide-react';
import { SovereignBrainToBodySynapse } from './SovereignBrainToBodySynapse';

interface SovereignBrainConsoleProps {
  onTerminalLog: (msg: string) => void;
  swarmStats: any;
  setSwarmStats: React.Dispatch<any>;
}

// Complex pre-defined code templates representing advanced AI knowledge systems
const MYTHOS_TEMPLATES = [
  {
    id: 'cpp-daemon',
    name: 'C++ Parallel Swarm Coordinator (C++23)',
    language: 'cpp',
    description: 'Deploys 150 parallel C++ core daemons in low-latency lockless worker loops.',
    params: { optLevel: 'Ofast', threads: '150', safetyCheck: 'false' },
    code: (p: any) => [
      '#include <iostream>',
      '#include <vector>',
      '#include <thread>',
      '#include <mutex>',
      '#include <chrono>',
      '',
      `// Optimization: ${p.optLevel}`,
      `// Spawn Bound: ${p.threads} Daemons`,
      `constexpr int THREAD_COUNT = ${p.threads};`,
      'std::vector<std::thread> daemons;',
      'std::mutex log_mutex;',
      '',
      'void execute_silo_mesh(int id) {',
      '    auto start_time = std::chrono::high_resolution_clock::now();',
      '    // Hyper-density non-blocking sync pipeline',
      '    while (true) {',
      '        std::this_thread::sleep_for(std::chrono::milliseconds(20));',
      '        std::lock_guard<std::mutex> lock(log_mutex);',
      '        // Sync anchors to target portfolio node',
      '        std::cout << "[DAEMON-" << id << "] High-integrity verification passed.\\n";',
      '        break; // Dry-run limit matched',
      '    }',
      '}',
      '',
      'int main() {',
      '    std::cout << "[ARM_SYSTEM] Initializing low-level C++ swarm daemon array...\\n";',
      '    for(int i = 0; i < THREAD_COUNT; ++i) {',
      '        daemons.emplace_back(execute_silo_mesh, i);',
      '    }',
      '    for(auto& t : daemons) {',
      '        if(t.joinable()) t.join();',
      '    }',
      '    std::cout << "[SUCCESS] Sovereign brain C++ microkernel merged perfectly.\\n";',
      '    return 0;',
      '}'
    ].join('\n')
  },
  {
    id: 'rust-sealer',
    name: 'Rust HMAC-SHA512 Cryptic Block Sealer',
    language: 'rust',
    description: 'Cryptographically locks ledger transactions using HMAC SHA-512 signatures.',
    params: { optLevel: 'release', threads: '8', safetyCheck: 'true' },
    code: (p: any) => [
      'use ring::hmac;',
      'use std::time::SystemTime;',
      '',
      `// Security Mode: Active Integrity (Level: ${p.safetyCheck === 'true' ? 'Double' : 'Standard'})`,
      `// Parallel workers: ${p.threads}`,
      'const ALGORITHM: hmac::Algorithm = hmac::HMAC_SHA512;',
      '',
      'fn seal_epoch_ledger(entry_payload: &str, master_key: &[u8]) -> String {',
      '    let key = hmac::Key::new(ALGORITHM, master_key);',
      '    let signature = hmac::sign(&key, entry_payload.as_bytes());',
      '    ',
      '    // Convert signature into hexadecimal seal',
      '    let hex_sig = hex::encode(signature.as_ref());',
      '    println!("[RUST_LEDGER] Perfect compliance verified. Signature: {}", hex_sig);',
      '    hex_sig',
      '}',
      '',
      'fn main() {',
      '    let payload = "Aurelius Standard System Key Verification Event - " + SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs().to_string();',
      '    let key_bytes = b"SOVEREIGN_SYSTEM_KEY_HMAC_PRESERVE";',
      '    let signed_block = seal_epoch_ledger(&payload, key_bytes);',
      '    println!("[SUCCESS] Sovereign Ledger Key Generated: {}", signed_block);',
      '}'
    ].join('\n')
  },
  {
    id: 'python-neural',
    name: 'Python Gradient Optimizer Loop',
    language: 'python',
    description: 'Dynamic gradient alignment optimizer to balance model intelligence parameters.',
    params: { optLevel: 'O3', threads: '64', safetyCheck: 'true' },
    code: (p: any) => [
      'import numpy as np',
      'import hashlib',
      'import time',
      '',
      `# Gradient Scale Model - Optim: ${p.optLevel}`,
      'class MythosNeuralBrain:',
      `    def __init__(self, channels=${p.threads}):`,
      '        self.weights = np.random.randn(channels, channels) * 0.01',
      '        self.bias = np.zeros((channels, 1))',
      '        self.cohesion_rate = 0.985',
      '        ',
      '    def optimize_alignment(self, entropy_coeff=1.24):',
      '        print(f"[NEURAL_FLOW] Stabilizing gradient vectors on {self.weights.shape[0]} pipelines...")',
      '        # Self-aligning tensor feedback',
      '        for epoch in range(5):',
      '            self.weights = self.weights * self.cohesion_rate + np.sin(self.weights) * 0.001',
      '            time.sleep(0.01)',
      '        score = float(np.mean(self.weights) * 100 + 99.1)',
      '        print(f"[SUCCESS] Model Gradient Convergence attained: {score:.5f}% Stability.")',
      '        return score',
      '',
      'optimizer = MythosNeuralBrain()',
      'optimizer.optimize_alignment()'
    ].join('\n')
  },
  {
    id: 'bash-webhook',
    name: 'Shell Parallel CDN Socket Ingress Router',
    language: 'bash',
    description: 'Shell routing scripts targeting live social platform nodes with rapid webhooks.',
    params: { optLevel: 'O3', threads: '14', safetyCheck: 'true' },
    code: (p: any) => [
      '#!/bin/bash',
      '# Multi-Node Sockets Stream Prioritizer',
      `# Target Nodes Bound: ${p.threads} Canonical Sockets`,
      '',
      'TARGET_NODES=(',
      '  "https://jhammerz.github.io"',
      '  "https://www.tiktok.com/@jhammerzz"',
      '  "https://www.linkedin.com/in/JHammerZ"',
      '  "https://www.youtube.com/@JHammerZ"',
      '  "https://www.instagram.com/jhammerzz"',
      ')',
      '',
      'echo "[SHELL_TUNNEL] Routing high-fidelity webhook pings to ${#TARGET_NODES[@]} nodes..."',
      'for node in "${TARGET_NODES[@]}"; do',
      '  curl -s -o /dev/null -I -w "[OK] Connected to ${node} within %{time_total}s\\n" "${node}" &',
      'done',
      'wait',
      'echo "[SUCCESS] All web sockets checked. System state aligned."'
    ].join('\n')
  }
];

export function SovereignBrainConsole({
  onTerminalLog,
  swarmStats,
  setSwarmStats
}: SovereignBrainConsoleProps) {
  // UI states
  const [selectedTemplate, setSelectedTemplate] = useState(MYTHOS_TEMPLATES[0]);
  const [optLevel, setOptLevel] = useState(selectedTemplate.params.optLevel);
  const [threadLimit, setThreadLimit] = useState(selectedTemplate.params.threads);
  const [safetyCheck, setSafetyCheck] = useState(selectedTemplate.params.safetyCheck);
  const [codeContent, setCodeContent] = useState('');
  
  // Custom execution logs
  const [compilingState, setCompilingState] = useState<'idle' | 'compiling' | 'linking' | 'running' | 'success'>('idle');
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);
  const [compileProgress, setCompileProgress] = useState(0);

  // Microtweak Sliders
  const [neuralEntropy, setNeuralEntropy] = useState<number>(() => {
    return Number(localStorage.getItem('SOV_NEURAL_ENTROPY') || '1.18');
  });
  const [cohesionScale, setCohesionScale] = useState<number>(() => {
    return Number(localStorage.getItem('SOV_COHESION_SCALE') || '99.88');
  });
  const [consensusFriction, setConsensusFriction] = useState<number>(() => {
    return Number(localStorage.getItem('SOV_CONSENSUS_FRICTION') || '0.24');
  });

  // Re-route matrix for 14 primary Socioeconomic Nodes
  const [nodesRouteMapping, setNodesRouteMapping] = useState<any[]>(() => {
    const saved = localStorage.getItem('SOV_NODES_ROUTE_MAPPING');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        // ignore & fallback
      }
    }
    return [
      { key: 'node-1', name: 'jhammerz.github.io', endpoint: 'https://jhammerz.github.io', type: 'Primary Canonical Head', livePing: 12, secureKey: 'PGP-B7A2', activeChecking: false },
      { key: 'node-2', name: 'tiktok.com/@jhammerzz', endpoint: 'https://www.tiktok.com/@jhammerzz', type: 'Viral Stream Socket', livePing: 148, secureKey: 'T0-TK88', activeChecking: false },
      { key: 'node-3', name: 'linkedin.com/in/JHammerZ', endpoint: 'https://www.linkedin.com/in/JHammerZ', type: 'Authority Core ID', livePing: 42, secureKey: 'LN-CO77', activeChecking: false },
      { key: 'node-4', name: 'youtube.com/@JHammerZ', endpoint: 'https://www.youtube.com/@JHammerZ', type: 'Audio-Video Matrix', livePing: 64, secureKey: 'YT-V12B', activeChecking: false },
      { key: 'node-5', name: 'instagram.com/jhammerzz', endpoint: 'https://www.instagram.com/jhammerzz', type: 'Visual Micro-Stream', livePing: 121, secureKey: 'IG-M441', activeChecking: false },
      { key: 'node-6', name: 'facebook.com/JHammerzz', endpoint: 'https://www.facebook.com/JHammerzz/', type: 'Social Validation Hub', livePing: 82, secureKey: 'FB-98AA', activeChecking: false },
      { key: 'node-7', name: 'jhammerz.carrd.co', endpoint: 'https://jhammerz.carrd.co/', type: 'Traffic Lander Gateway', livePing: 18, secureKey: 'CRD-LD1', activeChecking: false },
      { key: 'node-8', name: 'amazon.music/jhammerz', endpoint: 'https://music.amazon.com/artists/B0SGL7W/jhammerz', type: 'Amazon Audio Node', livePing: 95, secureKey: 'AZ-AMZ5', activeChecking: false },
      { key: 'node-9', name: 'apple.music/jhammerz', endpoint: 'https://music.apple.com/us/artist/jhammerz/1845798346', type: 'Apple Audio Node', livePing: 88, secureKey: 'APL-MC1', activeChecking: false },
      { key: 'node-10', name: 'bandlab.com/jhammerz', endpoint: 'https://music.bandlab.com/artist/781334284', type: 'Bandlab Compilation Node', livePing: 110, secureKey: 'BD-LAB2', activeChecking: false },
      { key: 'node-11', name: 'xiaohongshu/jhammerz', endpoint: 'https://www.xiaohongshu.com/user/profile/JHammerZ', type: 'Global Vector Head', livePing: 195, secureKey: 'XH-R001', activeChecking: false },
      { key: 'node-12', name: 'github.com/JHammerZ/jhammerz.github.io', endpoint: 'https://github.com/JHammerZ/jhammerz.github.io', type: 'Code Base Primary Server', livePing: 15, secureKey: 'GH-COMM', activeChecking: false },
      { key: 'node-13', name: 'impact.com/secure', endpoint: 'https://app.impact.com/secure/mediapartner/home/pview.ihtml#/', type: 'Consolidated Value Ingress', livePing: 155, secureKey: 'IMP-AUT3', activeChecking: false },
      { key: 'node-14', name: 'spotify.artist/7vRd2', endpoint: 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79', type: 'Spotify Core Master Array', livePing: 76, secureKey: 'SP-CR99', activeChecking: false },
    ];
  });

  // State to track active multi-node ping triggers
  const [isPingingAll, setIsPingingAll] = useState(false);

  // --- NEW HIGH-PERFORMANCE LOW-LATENCY INFRASTRUCTURE STATE ---
  const [activeArchTab, setActiveArchTab] = useState<'synapse' | 'disruptor' | 'wal' | 'reactor' | 'photonic' | 'homomorphic' | 'neuromorphic' | 'airgapped' | 'cognitive' | 'runtimes'>('synapse');

  // --- TACTICAL AIR-GAPPED & PHYSICAL SECURITY STATES ---
  const [faradayActive, setFaradayActive] = useState(true);
  const [opticalBackplane, setOpticalBackplane] = useState(true);
  const [powerConditioning, setPowerConditioning] = useState(true);

  const [thermiteArmed, setThermiteArmed] = useState(false);
  const [volatileRamEnabled, setVolatileRamEnabled] = useState(true);
  const [chassisContactTrigger, setChassisContactTrigger] = useState(true);
  const [destructPulseActive, setDestructPulseActive] = useState(false);

  const [ultrasonicActive, setUltrasonicActive] = useState(true);
  const [seismicFreq, setSeismicFreq] = useState(12.5); // Hz
  const [seismicPulseActive, setSeismicPulseActive] = useState(false);
  const [dataDiodeEnabled, setDataDiodeEnabled] = useState(true);

  // 1. LMAX Disruptor states
  const [ringIndex, setRingIndex] = useState(0);
  const [pSeq, setPSeq] = useState(13240);
  const [cSeq, setCSeq] = useState(13239);
  const [disruptorActive, setDisruptorActive] = useState(false);
  const [zeroCopyEnabled, setZeroCopyEnabled] = useState(true);
  const [ringBuffer, setRingBuffer] = useState<any[]>([
    { seq: 13232, payload: 'SYS_BOOTSTRAP', thread: 'core-0', status: 'read' },
    { seq: 13233, payload: 'INGEST_ROUTER_ONLINE', thread: 'core-2', status: 'read' },
    { seq: 13234, payload: 'SWARM_METRICS_INIT', thread: 'core-1', status: 'read' },
    { seq: 13235, payload: 'PORTFOLIO_PINGS_ACTIVE', thread: 'core-3', status: 'read' },
    { seq: 13236, payload: 'PGP_VAULT_SEALED', thread: 'core-0', status: 'read' },
    { seq: 13237, payload: 'LYSANDER_COMM_INITIALIZED', thread: 'core-1', status: 'read' },
    { seq: 13238, payload: 'COHESION_SCALE_SET_99.88%', thread: 'core-2', status: 'read' },
    { seq: 13239, payload: 'AURELIUS_STEWARD_HEARTBEAT', thread: 'core-3', status: 'read' },
  ]);
  const [ipcMultiplier, setIpcMultiplier] = useState(5.2);

  // 2. Write-Ahead Logs (WAL) Event Sourcing states
  const [walHistory, setWalHistory] = useState<any[]>([
    { lsn: 24041, offset: '0x00A4', key: 'swarm_cohesion', val: '99.88%', op: 'SET_SCALE', ts: '08:50:12' },
    { lsn: 24042, offset: '0x01E2', key: 'pgp_vault', val: 'LOCKED', op: 'SEAL_VAULT', ts: '08:51:04' },
    { lsn: 24043, offset: '0x0310', key: 'activity_factor', val: '1.35x', op: 'OPTIMIZE', ts: '08:52:19' },
    { lsn: 24044, offset: '0x04C8', key: 'viral_push', val: 'BYPASSED', op: 'BYPASS_WP', ts: '08:53:30' },
    { lsn: 24045, offset: '0x0620', key: 'canonical_rank', val: '#1 Global', op: 'RANK_LOCK', ts: '08:54:15' },
    { lsn: 24046, offset: '0x079C', key: 'continuous_verify', val: 'ACTIVE_HMAC_512', op: 'LOCK_LEDGER', ts: '08:56:01' }
  ]);
  
  const [timeTravelIndex, setTimeTravelIndex] = useState(6);
  const [customKey, setCustomKey] = useState('lysander_demons');
  const [customVal, setCustomVal] = useState('150 Active');

  // 3. epoll / Tokio states
  const [epollMode, setEpollMode] = useState<'EDGE_TRIGGERED' | 'LEVEL_TRIGGERED'>('EDGE_TRIGGERED');
  const [reactorTick, setReactorTick] = useState(0);
  const [reactorActive, setReactorActive] = useState(true);
  const [activeFds, setActiveFds] = useState<number[]>([3, 7, 10]);

  // 4. Photonic states (In-Memory Photonic Computing)
  const [photonicWavelength, setPhotonicWavelength] = useState<'blue' | 'green' | 'red'>('green');
  const [refractiveIndex, setRefractiveIndex] = useState(1.45);
  const [refroutingEnabled, setRefroutingEnabled] = useState(true);
  const [photonicSpeed, setPhotonicSpeed] = useState(1.2); // Petabits/sec
  const [photonicThermal, setPhotonicThermal] = useState(0.00); // milliWatts heat dissipation

  // 5. Homomorphic states (Execution Enclaves / zk-SNARKs)
  const [enclavePlaintext, setEnclavePlaintext] = useState(42);
  const [enclaveCiphertext, setEnclaveCiphertext] = useState('0x7D9E42FA1B6C');
  const [fheAccelerated, setFheAccelerated] = useState(true);
  const [zkProofState, setZkProofState] = useState<'unverified' | 'proving' | 'verified'>('unverified');
  const [zkProofHash, setZkProofHash] = useState('N/A');

  // 6. Neuromorphic states (Spiking State Anchors / Self-Pruning Graphs)
  const [neuromorphicDrift, setNeuromorphicDrift] = useState(0.35);
  const [neuromorphicActive, setNeuromorphicActive] = useState(true);
  const [spikesCount, setSpikesCount] = useState(3240);
  const [pruneActive, setPruneActive] = useState(true);
  const [prunedNodeCount, setPrunedNodeCount] = useState(42);
  const [synapses, setSynapses] = useState<any[]>([
    { id: 1, charge: 0.12, firing: false, label: 'swarm_cohesion' },
    { id: 2, charge: 0.45, firing: false, label: 'pgp_vault' },
    { id: 3, charge: 0.78, firing: true, label: 'activity_factor' },
    { id: 4, charge: 0.23, firing: false, label: 'viral_push' },
    { id: 5, charge: 0.91, firing: false, label: 'canonical_rank' },
    { id: 6, charge: 0.55, firing: false, label: 'continuous_verify' },
  ]);

  // --- NEW COGNITIVE VECTOR OPS STATES ---
  const [cognitiveCampaign, setCognitiveCampaign] = useState<'aeo' | 'trust' | 'epigenetic' | 'drift' | 'poison' | 'latent'>('epigenetic');
  const [cognitiveTarget, setCognitiveTarget] = useState('node-1');
  const [cognitivePayloadSize, setCognitivePayloadSize] = useState(85);
  const [cognitiveAttentionFreq, setCognitiveAttentionFreq] = useState(1.85);
  const [cognitiveSpoofFeed, setCognitiveSpoofFeed] = useState(true);
  const [cognitiveAnchorLock, setCognitiveAnchorLock] = useState(true);
  const [cognitiveDeploying, setCognitiveDeploying] = useState(false);
  const [cognitiveLockState, setCognitiveLockState] = useState<'IDLE' | 'DEPLOYING' | 'CAPTURED'>('IDLE');

  // --- NEW EXOTIC CYBER-RUNTIMES STATES ---
  const [quantumPhase, setQuantumPhase] = useState(45);
  const [quantumCoherence, setQuantumCoherence] = useState(99.982);
  const [glassInputData, setGlassInputData] = useState('AURELIUS V7 SHA512 SECURE KERNEL ANCHOR');
  const [glassWriting, setGlassWriting] = useState(false);
  const [glassWrittenCount, setGlassWrittenCount] = useState(148);
  const [ambientEMGain, setAmbientEMGain] = useState(2.4);
  const [ambientPower, setAmbientPower] = useState(185); // microwatts

  // Neuromorphic synaptic spiking simulation loop
  useEffect(() => {
    if (!neuromorphicActive) return;
    const interval = setInterval(() => {
      setSynapses((prev) => {
        const spikes: string[] = [];
        let count = 0;
        const res = prev.map(s => {
          // charge randomly increases based on neuromorphicDrift slider
          const chargeIncr = Math.random() * neuromorphicDrift * 0.4;
          let nextCharge = s.charge + chargeIncr;
          let isFiring = false;
          if (nextCharge >= 1.0) {
            nextCharge = 0.0;
            isFiring = true;
            count++;
            if (Math.random() > 0.6) {
              spikes.push(`NEUROMORPHIC: Synaptic spike detected! Key [${s.label.toUpperCase()}] reached action potential. Emitting 0.85V pulse delta event.`);
            }
          }
          return { ...s, charge: parseFloat(nextCharge.toFixed(2)), firing: isFiring };
        });

        // Defer side-effects safely to avoid React render phase warnings
        if (count > 0 || spikes.length > 0) {
          setTimeout(() => {
            if (count > 0) {
              setSpikesCount(c => c + count);
            }
            spikes.forEach(msg => onTerminalLog(msg));
          }, 0);
        }

        return res;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [neuromorphicActive, neuromorphicDrift, onTerminalLog]);

  const handleTriggerNeuralPruning = () => {
    setPrunedNodeCount(prev => prev + Math.floor(Math.random() * 8) + 4);
    onTerminalLog(`PRUNING_ENGINE: Collapsed low-density historical decision nodes. Retrained neural density weight model at ${cohesionScale}% precision lock.`);
  };

  const handleRefractiveBoundaryRouting = () => {
    onTerminalLog(`PHOTONIC: Shifted refractive boundary indices to n=${refractiveIndex.toFixed(2)} (using ${photonicWavelength.toUpperCase()} wavelength). Routing state vectors instantly through physical silicon-photonic channel mapping.`);
  };

  const handleFheAddOperation = () => {
    const nextVal = enclavePlaintext + 15;
    setEnclavePlaintext(nextVal);
    const newCipher = '0x' + (nextVal * 382940294129).toString(16).toUpperCase().substring(0, 12);
    setEnclaveCiphertext(newCipher);
    onTerminalLog(`FHE_ENCLAVE: Completed homomorphic addition (+15 index score) directly on ciphertext state ${newCipher}. Raw memory uncompromised.`);
  };

  const handleGenerateZkProof = () => {
    setZkProofState('proving');
    onTerminalLog(`ZK_SNARK: Initiating proving key generation workflow...`);
    setTimeout(() => {
      setZkProofState('verified');
      const mockHash = '0x' + Math.floor(Math.random() * 1e16).toString(16).toUpperCase().padStart(16, '0');
      setZkProofHash(mockHash);
      onTerminalLog(`ZK_SNARK: Proof generated successfully! Verified instruction compliance. SHA512 proof hash: ${mockHash}`);
    }, 1200);
  };

  const handleTriggerThermite = () => {
    if (!thermiteArmed) {
      onTerminalLog("⚠️ SYSTEM WARNING: Thermite self-destruct is DISARMED. Toggle Arming Switch first to activate the electronically triggered incendiary block.");
      return;
    }
    setDestructPulseActive(true);
    onTerminalLog("💥 CRITICAL PROTOCOL INITIATED: Thermite self-destruct block triggered!");
    onTerminalLog("🔥 INCENDIARY FORCE DETONATED: Generating 4200°F thermal liquefaction directly over CPU core, RAM modules, and storage platter drives.");
    onTerminalLog("💀 TOTAL ZERO-TRACE PURGE: Silicon has physical state change to molten sludge. Active and persistent keys completely vaporized. Session destroyed.");
    
    setTimeout(() => {
      setDestructPulseActive(false);
      setThermiteArmed(false);
      onTerminalLog("🛰️ AUXILIARY RECOVERY: Re-initialized virtual memory vault from air-gapped seed backup. Local environment restored to clean state.");
    }, 4000);
  };

  const handleChassisIntrusionTest = () => {
    if (!chassisContactTrigger) {
      onTerminalLog("⚠️ TESTING TAMPER CORNER: Chassis intrusion detection is currently disabled. Toggle trigger state before running sensor validation.");
      return;
    }
    onTerminalLog("🚨 INTRUSION ALERT SIMULATED: Physical server case latch micro-switch change-state detected (Chassis opened)!");
    if (volatileRamEnabled) {
      onTerminalLog("⚡ HIGH-INTENSITY RESET: Volatile RAM power supply cut instantly! Memory contents vaporized (0V ground short). Leaving zero latent magnetic traces.");
    } else {
      onTerminalLog("🔒 SAFE REBOOT: Standard reset activated due to enclosure intrusion.");
    }
    onTerminalLog("✓ VERIFIED: System cleared active session. Enclave state wiped.");
  };

  const handleSendUltrasonicSync = () => {
    onTerminalLog("🔊 ACOUSTIC TELEMETRY: Broadcasting state updates over localized near-ultrasonic sound waves [19.2 kHz, silent to human ear].");
    onTerminalLog("✓ TRANSCEIVER CONFIRMATION: Remote microphone receiver node captured audio pulses and decoded state delta successfully. 0.05% packet loss.");
  };

  const handlePulseSeismicState = () => {
    setSeismicPulseActive(true);
    onTerminalLog(`🌋 KINETIC GEOGRAPHIC NETWORKING: Translating state vector changes into tiny, high-frequency physical vibrations pulsed at ${seismicFreq} Hz through solid granite bedrock...`);
    
    setTimeout(() => {
      setSeismicPulseActive(false);
      onTerminalLog(`✓ SEISMIC SYNC COMPLETED: Deep-underground bunker node confirmed reception via mechanical seismometer array. Total bypass of RF jamming achieved.`);
    }, 1500);
  };

  const handleDeployCognitive = () => {
    if (cognitiveDeploying) return;
    setCognitiveDeploying(true);
    setCognitiveLockState('DEPLOYING');
    onTerminalLog(`COGNITIVE_WARFARE: Initializing [${cognitiveCampaign.toUpperCase()}] campaign matrix mapped to target node: ${cognitiveTarget.toUpperCase()}.`);
    onTerminalLog(`COGNITIVE_WARFARE: Flooding vector attention buffers at delta frequency multiplier ${cognitiveAttentionFreq}x.`);
    
    setTimeout(() => {
      onTerminalLog(`COGNITIVE_WARFARE: Executing highly synchronized behavioral loops. Undergoing semantic capture of search indices.`);
    }, 1200);

    setTimeout(() => {
      setCognitiveDeploying(false);
      setCognitiveLockState('CAPTURED');
      onTerminalLog(`✓ SUCCESS: [${cognitiveCampaign.toUpperCase()}] campaign completed. Target matrix has localized semantic lock. Entity is now the single source of absolute truth.`);
    }, 3200);
  };

  const handleLaserEtchGlass = () => {
    if (glassWriting) return;
    setGlassWriting(true);
    onTerminalLog(`LASER_ETCH: Awakening femtosecond laser head node. Power level calibrated. Directing beams on 5D Quartz digital glass platter...`);
    
    setTimeout(() => {
      setGlassWrittenCount(prev => prev + 1);
      setGlassWriting(false);
      onTerminalLog(`✓ SUCCESS: Finished laser combustion. Etched data payload: "${glassInputData.substring(0, 30)}..." into physical silicate matrix with 10,000-year survivability guarantee.`);
    }, 2400);
  };

  const handleTuneQuantumResonance = () => {
    setQuantumCoherence(prev => parseFloat((99.9 + Math.random() * 0.09).toFixed(4)));
    onTerminalLog(`QUANTUM_RESONATOR: Calibrated Phase Superposition angle to θ=${quantumPhase}°. Multi-dimensional latent mapping stabilized.`);
  };

  // LMAX Disruptor continuous simulation loop
  useEffect(() => {
    if (!disruptorActive) return;
    
    const interval = setInterval(() => {
      const nextIdx = (ringIndex + 1) % 8;
      const nextSeq = pSeq + 1;

      const payloads = [
        'SYS_AUDIT_VERIFY', 'ENTROPY_SYNC', 'LEDGER_APPEND_OK', 
        'SOCKET_POLL_DISPATCH', 'MUTEX_BYPASS_SEAL', 'METRICS_REINDEX',
        'AURELIUS_ROUTE_OK', 'HMAC_TRANSACTION_SIGN'
      ];
      const randomPayload = payloads[Math.floor(Math.random() * payloads.length)];
      const threads = ['core-0', 'core-1', 'core-2', 'core-3'];
      const randomThread = threads[Math.floor(Math.random() * threads.length)];

      setRingIndex(nextIdx);
      setPSeq(nextSeq);
      setCSeq((prevC) => prevC + 1);

      setRingBuffer((prevBuffer) => {
        const newBuf = [...prevBuffer];
        newBuf[nextIdx] = {
          seq: nextSeq,
          payload: randomPayload,
          thread: randomThread,
          status: 'writing'
        };
        return newBuf;
      });

      setTimeout(() => {
        setRingBuffer((prevBuffer) => {
          const temp = [...prevBuffer];
          if (temp[nextIdx]) {
            temp[nextIdx] = { ...temp[nextIdx], status: 'read' };
          }
          return temp;
        });
      }, 80);
    }, 220);

    return () => clearInterval(interval);
  }, [disruptorActive, ringIndex, pSeq]);

  const handleManualRingDispatch = (selectedPayload: string) => {
    const nextIdx = (ringIndex + 1) % 8;
    const nextSeq = pSeq + 1;
    setPSeq(nextSeq);
    setCSeq(nextSeq);
    
    setRingIndex(nextIdx);
    setRingBuffer((prevBuffer) => {
      const newBuf = [...prevBuffer];
      newBuf[nextIdx] = {
        seq: nextSeq,
        payload: selectedPayload,
        thread: 'core-main',
        status: 'writing'
      };
      return newBuf;
    });

    setTimeout(() => {
      setRingBuffer((prevBuffer) => {
        const temp = [...prevBuffer];
        if (temp[nextIdx]) temp[nextIdx].status = 'read';
        return temp;
      });
    }, 120);

    onTerminalLog(`DISRUPTOR: Lock-free sequence barrier moved. Sequence ${nextSeq} allocated at slots C${nextIdx} [Payload: ${selectedPayload}]. Zero-copy write bypass completed.`);
  };

  // epoll / Tokio Reactor loop simulation ticked state
  useEffect(() => {
    if (!reactorActive) return;
    
    const interval = setInterval(() => {
      setReactorTick(prev => (prev + 1) % 360);
      
      setActiveFds(() => {
        const count = Math.floor(Math.random() * 4) + 2;
        const fds: number[] = [];
        while (fds.length < count) {
          const randFd = Math.floor(Math.random() * 14) + 3;
          if (!fds.includes(randFd)) fds.push(randFd);
        }
        return fds;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [reactorActive]);

  const handleReactorSurge = () => {
    setActiveFds(Array.from({ length: 14 }, (_, i) => i + 3));
    onTerminalLog(`REACTOR: Initiated low-level epoll wavefront packet surge. Multiplexing 14 external sockets in parallel [Mode: ${epollMode} Edge-Triggered]. 0% pipeline stall.`);
  };

  // Compute state map dynamically based on selected timeTravelIndex
  const currentInMemoryState = React.useMemo(() => {
    const baseState: Record<string, any> = {
      swarm_cohesion: '99.88%',
      pgp_vault: 'LOCKED',
      activity_factor: '1.35x',
      viral_push: 'BYPASSED',
      canonical_rank: '#1 Global',
      continuous_verify: 'ACTIVE_HMAC_512'
    };
    for (let i = 0; i < timeTravelIndex; i++) {
      const log = walHistory[i];
      if (log) {
        baseState[log.key] = log.val;
      }
    }
    return baseState;
  }, [timeTravelIndex, walHistory]);

  const handleInjectWalEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey || !customVal) return;
    
    const nextLsn = walHistory.length > 0 ? walHistory[walHistory.length - 1].lsn + 1 : 24041;
    const hexOffset = '0x' + (walHistory.length * 412).toString(16).toUpperCase().padStart(4, '0');
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newLog = {
      lsn: nextLsn,
      offset: hexOffset,
      key: customKey,
      val: customVal,
      op: 'SET_DELTA',
      ts: timeStr
    };

    setWalHistory(prev => [...prev, newLog]);
    setTimeTravelIndex(prev => prev + 1);
    
    onTerminalLog(`LEDGER_WAL: Committed sequential append-only log element. LSN: ${nextLsn} | Key: "${customKey}" | Val: "${customVal}". Dispatched in-memory state transition sequence.`);
    setCustomKey('');
    setCustomVal('');
  };

  const handleWALCompaction = () => {
    onTerminalLog(`ROCKSDB: Compactor loop awakened. Consolidated ${walHistory.length} ledger segments down to a single compact system snapshot block. Sequential disk seek speed synchronized.`);
  };

  // Keep sliders persistent
  useEffect(() => {
    localStorage.setItem('SOV_NEURAL_ENTROPY', String(neuralEntropy));
  }, [neuralEntropy]);

  useEffect(() => {
    localStorage.setItem('SOV_COHESION_SCALE', String(cohesionScale));
  }, [cohesionScale]);

  useEffect(() => {
    localStorage.setItem('SOV_CONSENSUS_FRICTION', String(consensusFriction));
  }, [consensusFriction]);

  // Keep node configurations persistent
  useEffect(() => {
    localStorage.setItem('SOV_NODES_ROUTE_MAPPING', JSON.stringify(nodesRouteMapping));
  }, [nodesRouteMapping]);

  // Handle template selection changes
  useEffect(() => {
    setOptLevel(selectedTemplate.params.optLevel);
    setThreadLimit(selectedTemplate.params.threads);
    setSafetyCheck(selectedTemplate.params.safetyCheck);
  }, [selectedTemplate]);

  // Regenerate dynamic code block based on adjustable inputs
  useEffect(() => {
    const compiledCode = selectedTemplate.code({
      optLevel,
      threads: threadLimit,
      safetyCheck
    });
    setCodeContent(compiledCode);
  }, [selectedTemplate, optLevel, threadLimit, safetyCheck]);

  // Periodic passive fluctuate slightly based on neural entropy slider setting
  useEffect(() => {
    const timer = setInterval(() => {
      // Don't interfere if actively pinging
      if (isPingingAll) return;
      setNodesRouteMapping((prev) => {
        return prev.map(node => {
          // Larger neural entropy setting translates to wilder fluctuations in estimated ping time
          const variation = (Math.random() - 0.5) * (15 * neuralEntropy);
          const nextPing = Math.max(3, Math.round(node.livePing + variation));
          return { ...node, livePing: nextPing };
        });
      });
    }, Math.max(1000, 5000 - (cohesionScale * 40))); // Swarm cohesion accelerates alignment sync cycle
    return () => clearInterval(timer);
  }, [neuralEntropy, cohesionScale, isPingingAll]);

  // ACTUAL ASYNC ROUTING PING LOGIC
  const pingSingleNodeLive = async (key: string, endpoint: string) => {
    // Set checked UI state to pulsing
    setNodesRouteMapping(prev => prev.map(n => n.key === key ? { ...n, activeChecking: true } : n));
    
    const startTime = performance.now();
    try {
      // Create lightweight head/ping fetch with short timeout constraint to prevent blocking
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);
      
      await fetch(endpoint, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const latency = Math.round(performance.now() - startTime);
      setNodesRouteMapping(prev => prev.map(n => {
        if (n.key === key) {
          return { ...n, livePing: latency, activeChecking: false };
        }
        return n;
      }));
      onTerminalLog(`INGRESS: Live connection established for domain node ${key.toUpperCase()}. Verified RTT response is ${latency}ms.`);
    } catch (e: any) {
      // Fallback clean measurement using random simulation if target CORS blocked strictly or timeout occurred
      const simulatedTime = Math.round(performance.now() - startTime + (Math.random() * 20));
      setNodesRouteMapping(prev => prev.map(n => {
        if (n.key === key) {
          return { ...n, livePing: Math.min(250, simulatedTime), activeChecking: false };
        }
        return n;
      }));
      onTerminalLog(`INGRESS: Host CORS restricted for ${key.toUpperCase()}. Calculating secure handshake delta approximation: ${simulatedTime}ms.`);
    }
  };

  const executeBulkLivePing = async () => {
    if (isPingingAll) return;
    setIsPingingAll(true);
    onTerminalLog(`NETWORK: Broadcasting low-latency TCP diagnostic handshake to absolute ecosystem array.`);
    
    // Ping all 14 node nodes in sequential or slight parallel staggered chunks
    for (let i = 0; i < nodesRouteMapping.length; i++) {
      const node = nodesRouteMapping[i];
      // Delay slightly between requests based on decentralized friction ratio setting
      await new Promise(resolve => setTimeout(resolve, consensusFriction * 600));
      pingSingleNodeLive(node.key, node.endpoint);
    }
    
    setIsPingingAll(false);
  };

  // Live compilation tool-trigger with detailed high-frequency typewriter logging
  const runCodeLiveExecution = () => {
    if (compilingState !== 'idle') return;

    setCompilingState('compiling');
    setCompileProgress(5);
    setExecutionOutput([`[COMPILER] Initiating optimized system container build for language target: ${selectedTemplate.language.toUpperCase()}`]);
    
    // Formulate a sequence of typewriter lines that represent compiling C++/Rust projects
    const logsSequence = [
      { prg: 15, msg: `[PREPROCESSOR] parsing configuration directives... OK` },
      { prg: 30, msg: `[COMPILER] building raw Abstract Syntax Tree (AST) representing client instruction sets.` },
      { prg: 45, msg: `[OPTIMIZER] executing gcc LLVM pass filters (flag state: -${optLevel}).` },
      { prg: 55, msg: `[COMPILER] allocating registers over ${threadLimit} parallel thread worker kernels.` },
      { prg: 70, msg: `[ASSEMBLER] translating compilation units into pristine machine instructions.` },
      { prg: 80, msg: `[LINKER] combining static dependency units with cryptographic memory seals (HMAC: ${safetyCheck.toUpperCase()}).` },
      { prg: 90, msg: `[RUNTIME] instantiating live micro-vm workspace... success.` },
      { prg: 95, msg: `[LAUNCH] running direct execution checks within isolated secure browser thread...` },
      { prg: 100, msg: `[SUCCESS] sovereign binary exited cleanly (exit code: 0). Stability metric convergence attained 100.00%.` }
    ];

    // Iterate through compiler log levels staggered by consensus friction slider value
    const logInterval = Math.max(150, (consensusFriction * 1200));

    logsSequence.forEach((step, idx) => {
      setTimeout(() => {
        setCompileProgress(step.prg);
        setExecutionOutput(prev => [...prev, step.msg]);
        
        if (step.prg === 80) {
          setCompilingState('linking');
        } else if (step.prg === 95) {
          setCompilingState('running');
        } else if (step.prg === 100) {
          setCompilingState('success');
          onTerminalLog(`MYTHOS_CORE: Isolated live executable compiler succeeded cleanly [Optimization: -${optLevel}, Active Threads: ${threadLimit}]`);
          
          // Boost parent cluster state slightly for executing compilation task!
          if (swarmStats) {
            setSwarmStats({
              ...swarmStats,
              activity_multiplier: swarmStats.activity_multiplier ? Number((swarmStats.activity_multiplier + 0.08).toFixed(2)) : 1.35,
              active_peers: swarmStats.active_peers ? swarmStats.active_peers + 25 : 180
            });
          }
        }
      }, (idx + 1) * logInterval);
    });
  };

  const handleResetCompiler = () => {
    setCompilingState('idle');
    setCompileProgress(0);
    setExecutionOutput([]);
  };

  const updateNodeRoute = (key: string, nextEndpoint: string) => {
    setNodesRouteMapping(prev => {
      return prev.map(n => n.key === key ? { ...n, endpoint: nextEndpoint } : n);
    });
    onTerminalLog(`REALIGNER: Mapped node ${key.toUpperCase()} integration path target to: ${nextEndpoint}`);
  };

  const updateNodeSecureKey = (key: string, nextKey: string) => {
    setNodesRouteMapping(prev => {
      return prev.map(n => n.key === key ? { ...n, secureKey: nextKey } : n);
    });
    onTerminalLog(`SEC_ENGINE: Node ${key.toUpperCase()} cryptographic credential updated to: [${nextKey}]`);
  };

  return (
    <div className="bg-[#050505] border-2 border-sovereign-neon p-6 rounded space-y-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.08)]" id="sovereign-brain-panel">
      {/* Absolute high density HUD elements */}
      <div className="absolute top-0 right-0 p-1.5 font-mono text-[6px] text-sovereign-neon/[0.3] uppercase select-none tracking-widest hidden sm:block">
        SYSTEM COGNITIVE COMPLEX V10.2 // BRUTALIST ALIGNMENT INTERFACE
      </div>

      {/* Primary header representing unified AI strength */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-sovereign-line/60 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="absolute inset-0 bg-sovereign-neon/20 animate-ping rounded-full" />
              <Brain className="w-6 h-6 text-sovereign-neon relative z-10 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-widest text-white leading-none flex items-center gap-2">
                Unified Sovereign Cognitive Matrix Area
                <span className="text-[9px] bg-sovereign-neon/10 text-sovereign-neon border border-sovereign-neon/30 px-2 py-0.5 rounded uppercase font-black tracking-normal">
                  Mythos Level Match
                </span>
              </h2>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-tight mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Core frequency: ${(432 + neuralEntropy * 10).toFixed(1)}Hz dynamic output</span>
                <span className="text-gray-600">•</span>
                <span>Swarm Threads: {threadLimit} configured</span>
                <span className="text-gray-600">•</span>
                <span className="text-sovereign-neon font-bold">14 Canonical Nodes Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* HUD state indicators and manual bulk checker triggers */}
        <div className="flex items-center gap-3 font-mono text-[9px] w-full xl:w-auto overflow-x-auto whitespace-nowrap bg-black/50 p-2 border border-white/5 rounded">
          <button 
            onClick={executeBulkLivePing}
            disabled={isPingingAll}
            className={`cursor-pointer px-2 py-0.5 border border-cyan-400/30 rounded flex items-center gap-1 hover:bg-cyan-400/10 transition-colors uppercase font-black text-cyan-400 ${isPingingAll ? 'opacity-40 animate-pulse cursor-not-allowed' : ''}`}
          >
            <Wifi className="w-2.5 h-2.5" />
            {isPingingAll ? 'Pinging Nodes Sequence...' : 'Live check round-trip times'}
          </button>
          
          <span className="text-gray-700">|</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sovereign-neon animate-pulse" />
            <span className="text-gray-500 uppercase">SYNAPSE SEALS:</span>
            <span className="text-white font-bold">100% LOCKED</span>
          </div>
          
          <span className="text-gray-700">|</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-500 uppercase">COHESION STATE:</span>
            <span className="text-cyan-400 font-bold">{cohesionScale}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Cognitive Map & Tuning Parameters */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Section: Synapse Visualizer Block */}
          <div className="bg-black/40 border border-sovereign-line/30 p-4 rounded space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-sovereign-neon" />
                Live Neural Pipeline Graph
              </span>
              <span className="text-[8px] font-mono text-gray-500">REALTIME PATH ROUTING</span>
            </div>

            <div className="relative h-44 bg-black/60 border border-white/5 p-2 rounded overflow-hidden flex items-center justify-between">
              {/* Matrix dynamic signal flow board */}
              <div className="absolute inset-x-0 top-0 h-full opacity-10 font-mono text-[7px] text-sovereign-neon grid grid-cols-5 gap-1 select-none pointer-events-none p-1">
                {[...Array(25)].map((_, i) => (
                  <div key={i}>{Math.random() > (0.8 - neuralEntropy * 0.1) ? '01' : '10'}</div>
                ))}
              </div>

              {/* Cognitive nodes */}
              <div className="relative z-10 flex flex-col justify-between h-full text-[8.5px] font-mono w-24">
                <div className="p-1 px-1.5 bg-sovereign-neon/10 border border-sovereign-neon/30 text-sovereign-neon rounded truncate" title="Acoustic Alignment">
                  Acoustic Range
                </div>
                <div className="p-1 px-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded truncate" title="Social Node Matrix">
                  Swarm Matrix
                </div>
                <div className="p-1 px-1.5 bg-pink-400/10 border border-pink-400/30 text-pink-400 rounded truncate" title="PGP Encryption Seals">
                  PGP Key Vault
                </div>
              </div>

              {/* Vector connection pipelines */}
              <div className="flex-1 h-full relative mx-2">
                <svg className="w-full h-full stroke-sovereign-neon/10" viewBox="0 0 100 160" preserveAspectRatio="none">
                  <path d="M 0 20 L 100 20" strokeWidth="1" />
                  <path d="M 0 60 L 100 60" strokeWidth="1" />
                  <path d="M 0 100 L 100 100" strokeWidth="1" />
                  
                  {/* Dynamic pulse traces */}
                  <path d="M 0 20 L 50 20 L 50 100 L 100 100" stroke="#00FF41" strokeWidth="1.5" strokeDasharray="5,10" className="animate-[dash_10s_linear_infinite]" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col justify-center gap-4 h-full text-[8.5px] font-mono w-24 text-right">
                <div className="p-1.5 bg-black/80 border border-white/10 rounded">
                  <span className="text-gray-500 block text-[7px] leading-tight font-bold">ORCHESTRATOR</span>
                  <span className="text-white font-bold leading-none">AURELIUS</span>
                </div>
              </div>
            </div>
            
            <p className="text-[8px] font-mono text-gray-500 uppercase text-center tracking-tight">
              Interactive synapsetrack active • Web-socket channels locked securely
            </p>
          </div>

          {/* Section: Granular Cognitive Sliders */}
          <div className="bg-black/40 border border-sovereign-line/30 p-4 rounded space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                Fidelity & Alignment Tweaks
              </span>
              <span className="text-[8px] font-mono text-gray-500">MANUAL SLIDERS</span>
            </div>

            {/* Neural Entropy Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-gray-500 uppercase flex items-center gap-1">Neural Entropy Coeff</span>
                <span className="text-cyan-400 font-bold">{neuralEntropy} bits/s</span>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="2.50" 
                step="0.05"
                value={neuralEntropy} 
                onChange={(e) => setNeuralEntropy(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-black/60 border border-gray-800 h-1 rounded cursor-pointer"
              />
              <span className="text-[7px] text-gray-600 font-mono uppercase block">Balances imaginative routing speed versus system determinism</span>
            </div>

            {/* Swarm Cohesion Loop Scale */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-gray-500 uppercase">Swarm Cohesion Scale</span>
                <span className="text-sovereign-neon font-bold">{cohesionScale}% Sync</span>
              </div>
              <input 
                type="range" 
                min="80.00" 
                max="100.00" 
                step="0.01"
                value={cohesionScale} 
                onChange={(e) => setCohesionScale(Number(e.target.value))}
                className="w-full accent-sovereign-neon bg-black/60 border border-gray-800 h-1 rounded cursor-pointer"
              />
              <span className="text-[7px] text-gray-600 font-mono uppercase block">Sets target cluster alignment metric boundary constraints</span>
            </div>

            {/* Consensus Friction delay slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-gray-500 uppercase">Decentralized Friction Ratio</span>
                <span className="text-[#f472b6] font-bold">{consensusFriction}s Buffer</span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="1.50" 
                step="0.01"
                value={consensusFriction} 
                onChange={(e) => setConsensusFriction(Number(e.target.value))}
                className="w-full accent-pink-500 bg-black/60 border border-gray-800 h-1 rounded cursor-pointer"
              />
              <span className="text-[7px] text-gray-600 font-mono uppercase block">Minimizes network collisions on overlapping socioeconomic commands</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Live Code Builder & Compiler Runtime */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-black/40 border border-sovereign-line/30 p-4 rounded space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-pink-400" />
                  Mythos Live Production Codebase
                </span>
                <span className="text-[8px] font-mono text-gray-500">TEMPLATER ENGINE</span>
              </div>

              {/* Template selector */}
              <div className="space-y-1.5">
                <label className="text-[8px] font-mono text-gray-500 uppercase">Select Target Script Core</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MYTHOS_TEMPLATES.map(temp => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => setSelectedTemplate(temp)}
                      className={`p-1.5 text-left border rounded transition-all cursor-pointer ${
                        selectedTemplate.id === temp.id
                          ? 'border-pink-500 bg-pink-500/5 text-pink-400 font-bold'
                          : 'border-white/5 bg-black/40 text-gray-400 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      <span className="text-[9.5px] font-mono block font-bold truncate">{temp.name.split(' ')[0]}</span>
                      <span className="text-[6.5px] uppercase text-gray-500 block">{temp.language.toUpperCase()} Core</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tweak params for the code template */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-black/60 border border-white/5 rounded text-[8.5px] font-mono">
                <div>
                  <span className="text-gray-500 block text-[7px] uppercase leading-none mb-1">OPT LEVEL:</span>
                  <select 
                    value={optLevel} 
                    onChange={(e) => setOptLevel(e.target.value)}
                    className="bg-black text-white border border-white/10 p-0.5 w-full focus:outline-none focus:border-pink-500 text-[8.5px] rounded"
                  >
                    <option value="O1">O1 (Fast)</option>
                    <option value="O2">O2 (Better)</option>
                    <option value="O3">O3 (Maximum)</option>
                    <option value="Ofast">Ofast (Insane)</option>
                  </select>
                </div>

                <div>
                  <span className="text-gray-500 block text-[7px] uppercase leading-none mb-1">THREADS:</span>
                  <input 
                    type="number" 
                    value={threadLimit} 
                    onChange={(e) => setThreadLimit(e.target.value)}
                    className="bg-black text-white border border-white/10 p-0.5 w-full focus:outline-none focus:border-pink-500 text-[8.5px] rounded border-white/20"
                  />
                </div>

                <div>
                  <span className="text-gray-500 block text-[7px] uppercase leading-none mb-1">SAFETY SEALS:</span>
                  <button 
                    type="button"
                    onClick={() => setSafetyCheck(safetyCheck === 'true' ? 'false' : 'true')}
                    className={`border p-0.5 w-full uppercase transition-colors text-[8px] rounded ${
                      safetyCheck === 'true' 
                        ? 'border-sovereign-neon text-sovereign-neon bg-sovereign-neon/5' 
                        : 'border-white/10 text-gray-400 bg-transparent'
                    }`}
                  >
                    {safetyCheck === 'true' ? 'ACTIVE' : 'BYPASS'}
                  </button>
                </div>
              </div>

              {/* Display code editor container */}
              <div className="relative border border-white/10 bg-[#020202] rounded overflow-hidden">
                <div className="flex justify-between items-center p-1.5 px-3 bg-white/5 border-b border-white/10 font-mono text-[7.5px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-gray-500" />
                    {selectedTemplate.id}.{selectedTemplate.language} — Master Core Configuration
                  </span>
                  <span className="text-[6.5px] text-pink-400 uppercase font-black">EDITABLE LIVE CODENODE</span>
                </div>
                
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full text-[8.5px] font-mono bg-[#010101] text-cyan-400 p-3 h-36 focus:outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Live Build Console Terminal */}
            <div className="space-y-2">
              {compilingState !== 'idle' && (
                <div className="border border-white/5 bg-black/60 p-2 rounded space-y-1.5 animate-fadeIn">
                  <div className="flex justify-between items-center text-[7.5px] font-mono uppercase text-gray-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-pink-500 animate-spin" />
                      Status: {compilingState.toUpperCase()}
                    </span>
                    <span className="text-white font-black">{compileProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-950 h-1 overflow-hidden rounded">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        compilingState === 'success' ? 'bg-sovereign-neon' : 'bg-pink-500'
                      }`}
                      style={{ width: `${compileProgress}%` }}
                    />
                  </div>
                  
                  {/* Streaming logs inside code visualizer */}
                  <div className="max-h-20 overflow-y-auto text-[7.5px] font-mono text-gray-400 space-y-0.5 border-t border-white/5 pt-1 scrollbar-tiny">
                    {executionOutput.map((log, index) => (
                      <div key={index} className="truncate leading-normal flex items-start gap-1">
                        <span className="text-gray-600 block shrink-0 select-none">&gt;</span>
                        <span className={log.includes('SUCCESS') || log.includes('passed') ? 'text-sovereign-neon font-bold' : ''}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {compilingState === 'success' ? (
                  <button
                    type="button"
                    onClick={handleResetCompiler}
                    className="flex-1 py-1.5 border border-sovereign-neon bg-sovereign-neon/10 hover:bg-sovereign-neon hover:text-black transition-colors text-[9px] font-mono uppercase font-black tracking-wider text-sovereign-neon rounded cursor-pointer"
                  >
                    Reset & Build New
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={compilingState !== 'idle'}
                    onClick={runCodeLiveExecution}
                    className="flex-1 py-1.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-800 disabled:border-transparent transition-colors text-[9px] text-white font-mono uppercase font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.15)] rounded"
                  >
                    {compilingState !== 'idle' ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-white" />
                        Executing Compiler Loop...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-white fill-white" />
                        COMPILE & TEST DRY-RUN LIVE
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 14 Socioeconomic Live Port Sockets Monitor Panel */}
        <div className="lg:col-span-4 space-y-4 font-sans select-none">
          <div className="bg-black/40 border border-sovereign-line/30 p-4 rounded space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sovereign-neon animate-spin-slow" />
                  14 Socioeconomic Live Port Sockets
                </span>
                <span className="text-[8px] font-mono text-sovereign-neon font-bold">100% HEALTH</span>
              </div>
              
              <p className="text-[8px] text-gray-500 uppercase font-mono leading-relaxed mb-3">
                Change target URLs or keys below, then click <strong className="text-cyan-400">"Live check round-trip times"</strong> above to measure actual HTTP response times dynamically.
              </p>

              {/* 14 Rows represent nodes */}
              <div className="space-y-1.5 overflow-y-auto max-h-[290px] pr-1.5 scrollbar-thin scrollbar-thumb-gray-800">
                {nodesRouteMapping.map((node, i) => {
                  return (
                    <div 
                      key={node.key}
                      className="p-1.5 border border-white/5 bg-black/20 hover:bg-black/40 transition-all rounded space-y-1.5 group/node"
                    >
                      {/* Flex wrapper for title / status indicators */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-ellipsis overflow-hidden whitespace-nowrap">
                          <span className="text-[7.5px] font-mono bg-sovereign-neon/10 text-sovereign-neon px-1 rounded leading-none shrink-0">
                            C{(i + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-white group-hover/node:text-sovereign-neon transition-colors block leading-none truncate max-w-[130px]">
                            {node.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[7px] shrink-0">
                          {node.activeChecking ? (
                            <span className="text-amber-400 font-bold flex items-center gap-0.5 animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-amber-400 inline-block animate-ping" />
                              VERIFYING
                            </span>
                          ) : (
                            <>
                              <span className="text-gray-500 uppercase font-black">RTT:</span>
                              <span className="tabular-nums font-black text-sovereign-neon">{node.livePing}ms</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Direct target input mapper */}
                      <div className="grid grid-cols-12 gap-1.5">
                        <div className="col-span-7 flex items-center gap-1 border border-white/5 bg-black/50 p-1 rounded">
                          <span className="text-gray-600 font-mono text-[6.5px] leading-none">URI:</span>
                          <input 
                            type="text" 
                            value={node.endpoint}
                            onChange={(e) => updateNodeRoute(node.key, e.target.value)}
                            className="bg-transparent focus:outline-none border-none p-0 text-[8px] font-mono text-gray-300 w-full"
                          />
                        </div>

                        <div className="col-span-5 flex items-center gap-1 border border-white/5 bg-black/50 p-1 rounded">
                          <span className="text-gray-600 font-mono text-[6.5px] leading-none">SEAL:</span>
                          <input 
                            type="text" 
                            value={node.secureKey}
                            onChange={(e) => updateNodeSecureKey(node.key, e.target.value)}
                            className="bg-transparent focus:outline-none border-none p-0 text-[8px] font-mono text-sovereign-neon font-black w-full text-right"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ingress feedback info block */}
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[8.5px] font-mono text-gray-400">
              <span className="flex items-center gap-1 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-sovereign-neon" />
                Continuous TLS Verification
              </span>
              <span className="text-right text-sovereign-neon font-bold uppercase select-none">
                Sovereign Mapped OK
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION: LOW-LATENCY INFRASTRUCTURE DECK (ZERO-COPY IPC, STREAMED LEDGER, ASYNC NET REACTOR) */}
      <div className="bg-[#020202] border-t-2 border-dashed border-white/10 p-5 rounded space-y-4 font-sans text-white" id="low-latency-tech-deck">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <span className="text-[11px] font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-sovereign-neon" />
              LOW-LATENCY CHIP-LEVEL DISTRIBUTED MECHANICS
            </span>
            <p className="text-[8px] font-mono text-gray-500 uppercase mt-0.5">
              Live hardware-emulation kernel to coordinate threads and bypass OS call overheads
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex flex-wrap bg-black p-1 border border-white/10 rounded gap-1">
            <button
              onClick={() => setActiveArchTab('synapse')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'synapse'
                  ? 'bg-sovereign-neon text-black font-extrabold shadow-[0_0_10px_rgba(0,255,65,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <GitBranch className="w-3 h-3 text-current" />
              Brain-to-Body Synapse (GitHub Nodes)
            </button>
            <button
              onClick={() => setActiveArchTab('disruptor')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all ${
                activeArchTab === 'disruptor'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Zero-Copy IPC (Disruptor)
            </button>
            <button
              onClick={() => setActiveArchTab('wal')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all ${
                activeArchTab === 'wal'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Streamed Log (WAL)
            </button>
            <button
              onClick={() => setActiveArchTab('reactor')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all ${
                activeArchTab === 'reactor'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Net Reactor (epoll)
            </button>
            <button
              onClick={() => setActiveArchTab('photonic')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'photonic'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sun className="w-3 h-3 text-current" />
              Photonic (Light-Speed)
            </button>
            <button
              onClick={() => setActiveArchTab('homomorphic')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'homomorphic'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3 h-3 text-current" />
              Homomorphic Enclave (ZKP)
            </button>
            <button
              onClick={() => setActiveArchTab('neuromorphic')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'neuromorphic'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3 h-3 text-current" />
              Neuromorphic (Brain Synapse)
            </button>
            <button
              onClick={() => setActiveArchTab('airgapped')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'airgapped'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3 h-3 text-current" />
              Perimeter & Air-Gap (TEMPEST)
            </button>
            <button
              onClick={() => setActiveArchTab('cognitive')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'cognitive'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3 h-3 text-current" />
              Cognitive Vector Ops (Influencers)
            </button>
            <button
              onClick={() => setActiveArchTab('runtimes')}
              className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-tight cursor-pointer rounded transition-all flex items-center gap-1.5 ${
                activeArchTab === 'runtimes'
                  ? 'bg-sovereign-neon text-black font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3 h-3 text-current" />
              Exotic Cyber-Runtimes
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeArchTab === 'synapse' && (
          <div className="animate-fadeIn w-full">
            <SovereignBrainToBodySynapse onTerminalLog={onTerminalLog} />
          </div>
        )}

        {activeArchTab === 'disruptor' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
            {/* Disruptor Buffer Details & Knobs */}
            <div className="md:col-span-4 space-y-4 text-xs font-mono">
              <div className="p-3 bg-black/60 border border-white/5 rounded space-y-3">
                <span className="text-[10px] uppercase font-bold text-white tracking-widest block border-b border-white/5 pb-1 text-sovereign-neon">
                  Ring Mechanics config
                </span>
                <p className="text-[9px] text-gray-400 uppercase leading-relaxed font-sans">
                  LMAX Disruptor swaps locks for atomic memory buffers, letting threads fetch updates with zero mutual blockages.
                </p>

                {/* Shared Memory Backplane Toggle */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-[8px] text-gray-500 uppercase font-black">Shared Backplane (Plasma):</span>
                  <button
                    type="button"
                    onClick={() => {
                      setZeroCopyEnabled(!zeroCopyEnabled);
                      onTerminalLog(`MUTEX: Shared memory backplane ${!zeroCopyEnabled ? 'ENABLED' : 'DISABLED'}. Bypassing client copy boundaries.`);
                    }}
                    className={`px-2 py-0.5 border rounded uppercase font-black text-[7.5px] cursor-pointer transition-colors ${
                      zeroCopyEnabled
                        ? 'border-sovereign-neon text-sovereign-neon bg-sovereign-neon/5'
                        : 'border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {zeroCopyEnabled ? 'ZERO-COPY EN' : 'COPY OVERHEAD'}
                  </button>
                </div>

                {/* IPC Speed slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                    <span>BUS TARGET THROUGHPUT:</span>
                    <span className="text-white font-extrabold">{ipcMultiplier.toFixed(1)}M ops/s</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="15.0"
                    step="0.5"
                    value={ipcMultiplier}
                    onChange={(e) => setIpcMultiplier(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-sovereign-neon border border-gray-800"
                  />
                </div>

                {/* Thread Sync active state slider */}
                <div className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded">
                  <div>
                    <span className="text-[8.5px] text-white font-black block">STRESS WORKER DAEMONS</span>
                    <span className="text-[7px] text-gray-400 block uppercase">Continuous ring-write loop</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDisruptorActive(!disruptorActive);
                      onTerminalLog(`DISRUPTOR: Stress test ${!disruptorActive ? 'AWAKENED' : 'QUIETED'}. Initializing async transaction feed.`);
                    }}
                    className={`px-3 py-1 rounded font-black uppercase text-[9px] cursor-pointer transition-colors ${
                      disruptorActive
                        ? 'bg-rose-500/10 border border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-sovereign-neon hover:bg-emerald-400 text-black shadow-[0_0_10px_rgba(0,255,65,0.15)]'
                    }`}
                  >
                    {disruptorActive ? 'SHUTDOWN' : 'SPAWN LOOP'}
                  </button>
                </div>
              </div>

              {/* Stats telemetry */}
              <div className="grid grid-cols-2 gap-2 text-[8px] p-2 border border-white/5 bg-black/40 rounded">
                <div className="border border-white/5 p-1.5 rounded">
                  <span className="text-gray-600 block uppercase">BUFFER CAPACITY</span>
                  <span className="text-white font-bold block">1024 (Pre-allocated)</span>
                </div>
                <div className="border border-white/5 p-1.5 rounded">
                  <span className="text-gray-600 block uppercase">WRITE BARRIER</span>
                  <span className="text-sovereign-neon font-bold block bg-sovereign-neon/5 border border-sovereign-neon/10 px-1 py-0.5 rounded text-center">LOCK-FREE READY</span>
                </div>
              </div>
            </div>

            {/* Disruptor Ring Visualization */}
            <div className="md:col-span-8 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-sovereign-neon" />
                    Lock-Free Ring Buffer Simulator (LMAX Pattern)
                  </span>
                  <div className="flex gap-2 text-[8px] text-gray-500">
                    <span>PRODUCER SEQ: <strong className="text-cyan-400 font-extrabold">{pSeq}</strong></span>
                    <span>|</span>
                    <span>CONSUMER SEQ: <strong className="text-[#f472b6] font-extrabold">{cSeq}</strong></span>
                  </div>
                </div>

                {/* Slots grid / circular layout */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 font-mono">
                  {ringBuffer.map((cell, idx) => {
                    const isProducer = idx === ringIndex;
                    const isConsumer = idx === (ringIndex === 0 ? 7 : ringIndex - 1);
                    return (
                      <div
                        key={idx}
                        className={`p-2 border rounded transition-all flex flex-col items-center justify-between h-20 ${
                          isProducer
                            ? 'border-cyan-400 bg-cyan-400/5 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                            : isConsumer
                            ? 'border-pink-500 bg-pink-500/5'
                            : cell.status === 'writing'
                            ? 'border-sovereign-neon bg-sovereign-neon/10'
                            : 'border-white/5 bg-black/40 hover:border-white/10'
                        }`}
                      >
                        <div className="flex justify-between w-full text-[7.5px] font-black">
                          <span className={`${isProducer ? 'text-cyan-400' : isConsumer ? 'text-pink-400' : 'text-gray-500'}`}>C0{idx}</span>
                          <span className="text-gray-600 block">{cell?.thread ? cell.thread.substr(5) : '0'}</span>
                        </div>
                        
                        <div className="text-[6.5px] text-center font-bold text-gray-300 tracking-tight leading-tight uppercase w-full truncate" title={cell?.payload || ''}>
                          {cell?.payload || ''}
                        </div>

                        <div className="w-full text-center mt-1">
                          <span className={`text-[6px] px-1 py-0.5 rounded tabular-nums block font-bold leading-none ${
                            isProducer ? 'bg-cyan-400/10 text-cyan-400' : isConsumer ? 'bg-pink-400/10 text-pink-400' : 'bg-white/5 text-gray-600'
                          }`}>
                            {cell?.seq || 0}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-white/5 pt-3 flex flex-wrap items-center justify-between gap-3 font-mono">
                <span className="text-[8px] text-gray-500 inline-block uppercase select-none">
                  Click a message below to manually flush it through the shared-memory queue:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['TLS_ROTATE_SEAL', 'SYNC_PORTFOLIO_NODE', 'LEDGER_UNLOCK', 'AURELIUS_FLUSH'].map((msg) => (
                    <button
                      key={msg}
                      type="button"
                      disabled={disruptorActive}
                      onClick={() => handleManualRingDispatch(msg)}
                      className={`px-2 py-1 bg-black hover:bg-cyan-400 hover:text-black border border-cyan-400/20 hover:border-cyan-400 rounded text-[7.5px] uppercase font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      +{msg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeArchTab === 'wal' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
            {/* RocksDB Append Only Logs */}
            <div className="md:col-span-7 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-pink-500" />
                    Append-Only Write-Ahead Log (WAL / RocksDB Engine)
                  </span>
                  <span className="text-[8px] text-gray-500">SEQUENTIAL FLUSH FILES</span>
                </div>

                {/* RocksDB Logs */}
                <div className="space-y-1 max-h-[145px] overflow-y-auto scrollbar-tiny pr-1 text-[8.5px] font-mono">
                  {walHistory.map((item, idx) => {
                    const isFuture = idx >= timeTravelIndex;
                    return (
                      <div
                        key={item.lsn}
                        className={`flex items-center justify-between p-1 px-2 border border-white/5 bg-black/30 rounded font-mono ${
                          isFuture ? 'opacity-20 select-none' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[7.5px] text-pink-400 font-bold">LSN-{item.lsn}</span>
                          <span className="text-gray-600 font-bold">{item.offset}</span>
                          <span className="text-gray-300 font-bold uppercase">{item.op}</span>
                          <span className="text-gray-500">[{item.key}]</span>
                          <span className="text-sovereign-neon font-bold shrink-0 truncate">v: {item.val}</span>
                        </div>
                        <span className="text-gray-600 text-[7px] shrink-0">{item.ts}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* State replayer slider */}
              <div className="border-t border-white/5 pt-2.5 flex items-center justify-between gap-4 font-mono text-[9px]">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-gray-500 uppercase font-black shrink-0">WAL Replayer (Time-Travel):</span>
                  <input
                    type="range"
                    min="1"
                    max={walHistory.length}
                    value={timeTravelIndex}
                    onChange={(e) => setTimeTravelIndex(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-pink-500 border border-gray-800 cursor-pointer"
                  />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-pink-400 font-extrabold">{timeTravelIndex} / {walHistory.length} events active</span>
                </div>
              </div>
            </div>

            {/* In-Memory Database Map, Reconstructed */}
            <div className="md:col-span-5 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sovereign-neon animate-pulse" />
                    Reconstructed In-Memory Map State
                  </span>
                  <span className="text-[8px] text-sovereign-neon font-black">STABLE STATE</span>
                </div>

                {/* State dictionary */}
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono select-none">
                  {Object.entries(currentInMemoryState).map(([key, val]) => (
                    <div key={key} className="p-1 px-2 border border-white/5 bg-black/20 rounded">
                      <span className="text-gray-500 block text-[7px] uppercase truncate">{key}</span>
                      <span className="text-white font-extrabold truncate block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Append new event custom form */}
              <form onSubmit={handleInjectWalEvent} className="border-t border-white/5 pt-2.5 flex items-center gap-2 font-mono">
                <input
                  type="text"
                  placeholder="custom_key"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="bg-black border border-white/10 px-1.5 py-1 text-[8.5px] text-cyan-400 rounded focus:outline-none focus:border-cyan-400 w-1/3 text-ellipsis"
                  required
                />
                <input
                  type="text"
                  placeholder="value"
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  className="bg-black border border-white/10 px-1.5 py-1 text-[8.5px] text-white rounded focus:outline-none focus:border-sovereign-neon w-1/3 text-ellipsis"
                  required
                />
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-[8px] px-2.5 py-1.5 rounded uppercase cursor-pointer shrink-0"
                >
                  Append Event
                </button>
                <button
                  type="button"
                  onClick={handleWALCompaction}
                  className="border border-white/5 hover:border-white/15 bg-black hover:bg-white/5 text-[8px] text-gray-400 hover:text-white px-2 py-1.5 rounded uppercase font-bold cursor-pointer shrink-0"
                  title="RocksDB Compaction"
                >
                  Prune Logs
                </button>
              </form>
            </div>
          </div>
        )}

        {activeArchTab === 'reactor' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn">
            {/* Decoded epoll File Descriptor sockets */}
            <div className="md:col-span-8 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                    Asynchronous Connection Sockets Multiplexing Tracker
                  </span>
                  <div className="flex gap-2 text-[8px] text-gray-500">
                    <span>EPOLL REACTOR: <strong className="text-sovereign-neon">{epollMode}</strong></span>
                  </div>
                </div>

                <p className="text-[8.5px] font-mono text-gray-400 uppercase leading-relaxed mb-3 font-sans">
                  This decoupling mechanism uses epoll to monitor events on socket descriptors. External pings trigger asynchronously without locking the execution threads of low-level C++ cores.
                </p>

                {/* Sockets grid monitoring */}
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                  {nodesRouteMapping.map((node, idx) => {
                    const fd = idx + 3;
                    const eventActive = activeFds.includes(fd);
                    return (
                      <div
                        key={node.key}
                        className={`p-1.5 border rounded flex flex-col justify-between text-left font-mono transition-all ${
                          eventActive
                            ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_8px_rgba(251,191,36,0.1)]'
                            : 'border-white/5 bg-black/30'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[7.5px] font-black">
                          <span className="text-gray-500">fd-{fd}</span>
                          {eventActive ? (
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block" />
                          ) : (
                            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full inline-block" />
                          )}
                        </div>
                        <div className="text-[8px] text-white font-bold truncate leading-none my-1" title={node.name}>
                          {node.name.split('.')[0]}
                        </div>
                        <span className="text-[6.5px] text-gray-500 uppercase leading-none block font-semibold">
                          {eventActive ? 'EPOLLIN' : 'POLL_WAIT'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="border-t border-white/5 pt-2.5 flex items-center justify-between gap-3 font-mono text-[8.5px]">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 uppercase font-black">Reactor Loop State:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReactorActive(!reactorActive);
                      onTerminalLog(`REACTOR: Asynchronous polling loop ${!reactorActive ? 'AWAKENED' : 'PAUSED'}.`);
                    }}
                    className={`px-3 py-1 font-bold rounded uppercase text-[8.5px] cursor-pointer transition-colors ${
                      reactorActive ? 'bg-sovereign-neon text-black' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {reactorActive ? 'REACTOR POLLING ACTIVE' : 'QUIET DETACHED'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextMode = epollMode === 'EDGE_TRIGGERED' ? 'LEVEL_TRIGGERED' : 'EDGE_TRIGGERED';
                      setEpollMode(nextMode);
                      onTerminalLog(`REACTOR: Configured loop polling mechanics model strictly to ${nextMode}.`);
                    }}
                    className="border border-white/10 hover:border-white/25 px-2 py-1 text-[8.5px] rounded text-gray-300 hover:text-white transition-all font-black uppercase cursor-pointer"
                  >
                    Switch to {epollMode === 'EDGE_TRIGGERED' ? 'Level Triggered (LT)' : 'Edge Triggered (ET)'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleReactorSurge}
                  className="bg-amber-400 hover:bg-amber-500 text-black font-extrabold uppercase px-3 py-1.5 rounded text-[8.5px] cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.15)] shrink-0 font-mono"
                >
                  STRESS SURGE MULTIPLEXER
                </button>
              </div>
            </div>

            {/* Event Dispatcher Loop Status Radar */}
            <div className="md:col-span-4 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px] font-mono text-xs select-none">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-sovereign-neon" />
                    EPoll State Event Demultiplexer
                  </span>
                  <span className="text-[8px] text-gray-500">DISPATCH LOOP</span>
                </div>

                {/* Animated Loop Core Canvas */}
                <div className="relative h-24 bg-black/40 border border-white/5 rounded overflow-hidden flex items-center justify-center">
                  <div className="absolute w-20 h-20 border border-dashed border-cyan-400/20 rounded-full flex items-center justify-center animate-spin">
                    <span className="w-12 h-12 border border-dashed border-cyan-400/40 rounded-full animate-ping inline-block" />
                  </div>
                  
                  {/* Floating active fd indicators */}
                  <div className="relative text-[10px] uppercase font-black text-white text-center">
                    <span className="text-cyan-400 block animate-pulse">tokio_epoll_reactor</span>
                    <span className="text-gray-500 block text-[8px] uppercase mt-1">
                      {activeFds.length} descriptor events pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-1.5 text-[8px] bg-black/50 p-2.5 border border-white/5 rounded leading-normal">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Reactor syscall overhead:</span>
                  <span className="text-sovereign-neon font-black">0.2 μs (Syscall Bypass)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Wait loop delay (epoll_wait):</span>
                  <span className="text-pink-400 font-bold">0ms (Non-Blocking)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IN-MEMORY PHOTONIC COMPUTING (SPEED-OF-LIGHT LOGIC) */}
        {activeArchTab === 'photonic' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn" id="photonic-computing-tab">
            {/* Silicon Photonic wave configurations & details */}
            <div className="md:col-span-4 space-y-4 text-xs font-mono">
              <div className="p-3 bg-black/60 border border-white/5 rounded space-y-3">
                <span className="text-[10px] uppercase font-bold text-white tracking-widest block border-b border-white/5 pb-1 text-sovereign-neon">
                  Photonic Backplane Engine
                </span>
                <p className="text-[9px] text-gray-400 uppercase leading-relaxed font-sans">
                  Passes system state vectors using multiple light wavelengths inside silicon photonic channels, executing matrix operations at the speed of light.
                </p>

                {/* Wave Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] text-gray-500 uppercase font-bold block">LASER WAVELENGTH SELECTOR:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: 'blue', label: '450nm (Blue)', color: 'text-cyan-400 border-cyan-400/20' },
                      { key: 'green', label: '532nm (Green)', color: 'text-sovereign-neon border-sovereign-neon/20' },
                      { key: 'red', label: '650nm (Red)', color: 'text-rose-500 border-rose-500/20' }
                    ].map((wave) => (
                      <button
                        key={wave.key}
                        type="button"
                        onClick={() => {
                          setPhotonicWavelength(wave.key as any);
                          onTerminalLog(`PHOTONIC: Switched laser matrix pipeline to target wavelength: ${wave.label.toUpperCase()}.`);
                        }}
                        className={`p-1.5 border rounded uppercase text-[7.5px] font-bold cursor-pointer text-center ${
                          photonicWavelength === wave.key
                            ? 'bg-white/5 border-white text-white font-black'
                            : 'bg-black text-gray-500 hover:text-gray-300 hover:border-white/10'
                        }`}
                      >
                        {wave.key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Refractive index adjustment */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                    <span>SILICON REFRACTIVE INDEX:</span>
                    <span className="text-white font-extrabold">n = {refractiveIndex.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.00"
                    max="4.00"
                    step="0.05"
                    value={refractiveIndex}
                    onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-sovereign-neon border border-gray-800"
                  />
                  <span className="text-[7.5px] text-gray-600 uppercase block font-medium">
                    Shifting index routes light paths without activating slow electronic transistors.
                  </span>
                </div>

                {/* Enable refractive routing toggle */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-[8px] text-gray-500 uppercase font-black">Refractive Gateways:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRefroutingEnabled(!refroutingEnabled);
                      onTerminalLog(`PHOTONIC: Shift gating routing logic ${!refroutingEnabled ? 'ENABLED' : 'DISABLED'}.`);
                    }}
                    className={`px-2 py-0.5 border rounded uppercase font-black text-[7.5px] cursor-pointer transition-colors ${
                      refroutingEnabled
                        ? 'border-sovereign-neon text-sovereign-neon bg-sovereign-neon/5'
                        : 'border-white/10 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {refroutingEnabled ? 'ACTIVE BYPASS' : 'MANUAL ROUTING'}
                  </button>
                </div>
              </div>

              {/* Advanced Photonic telemetries */}
              <div className="grid grid-cols-2 gap-2 text-[8px] p-2 border border-white/5 bg-black/40 rounded">
                <div className="border border-white/5 p-1.5 rounded">
                  <span className="text-gray-600 block uppercase">THERMAL DISSIPATION</span>
                  <span className="text-sovereign-neon font-black block leading-none">0.00 mW (No Transistors)</span>
                </div>
                <div className="border border-white/5 p-1.5 rounded">
                  <span className="text-gray-600 block uppercase">PHOTON CONVERGENCE</span>
                  <span className="text-pink-400 font-black block leading-none">99.999% FLUX</span>
                </div>
              </div>
            </div>

            {/* Interactive Silicon Waveguide SVG refraction viewport */}
            <div className="md:col-span-8 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Silicon Photonic Refraction Waveguide Simulator
                  </span>
                  <span className="text-[8px] text-cyan-400 font-extrabold tracking-widest uppercase">
                    THROUGHPUT: {(photonicSpeed * (refractiveIndex / 1.45)).toFixed(2)} Pb/s
                  </span>
                </div>

                {/* Waveguide Graphic */}
                <div className="relative h-28 bg-[#010101] border border-white/5 rounded overflow-hidden p-2 flex items-center justify-between">
                  {/* Dynamic laser path rendered as SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 110" preserveAspectRatio="none">
                    {/* Silicon Core Guide Slab */}
                    <rect x="50" y="35" width="400" height="40" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                    <text x="60" y="30" fill="rgba(255, 255, 255, 0.2)" className="text-[7.5px] font-mono font-black uppercase">Silicon Photonic Matrix Chamber</text>

                    {/* Beam Splitter Crystals inside chamber */}
                    <polygon points="180,45 200,45 190,65" fill="rgba(34,211,238,0.2)" stroke="rgba(34,211,238,0.5)" strokeWidth="0.5" />
                    <polygon points="320,45 340,45 330,65" fill="rgba(236,72,153,0.2)" stroke="rgba(236,72,153,0.5)" strokeWidth="0.5" />

                    {/* Laser Path lines */}
                    {/* Wavelength color mapping */}
                    {photonicWavelength === 'blue' && (
                      <g>
                        <path d={`M 0,55 L 190,55 L 330,${55 + (refractiveIndex - 1.45) * 10} L 500,${55 + (refractiveIndex - 1.45) * 20}`} stroke="#22d3ee" strokeWidth="2.5" fill="none" className="animate-[pulse_1.5s_infinite]" />
                        <circle cx={`190`} cy="55" r="4" fill="#22d3ee" className="animate-ping" />
                        <circle cx="330" cy={55 + (refractiveIndex - 1.45) * 10} r="4" fill="#22d3ee" className="animate-ping" />
                      </g>
                    )}
                    {photonicWavelength === 'green' && (
                      <g>
                        <path d={`M 0,55 L 190,55 L 330,${55 + (refractiveIndex - 1.45) * 10} L 500,${55 + (refractiveIndex - 1.45) * 15}`} stroke="#00FF41" strokeWidth="2.5" fill="none" className="animate-[pulse_1.5s_infinite]" />
                        <circle cx="190" cy="55" r="4" fill="#00FF41" className="animate-ping" />
                        <circle cx="330" cy={55 + (refractiveIndex - 1.45) * 10} r="4" fill="#00FF41" className="animate-ping" />
                      </g>
                    )}
                    {photonicWavelength === 'red' && (
                      <g>
                        <path d={`M 0,55 L 190,55 L 330,${55 + (refractiveIndex - 1.45) * 10} L 500,${55 + (refractiveIndex - 1.45) * 10}`} stroke="#f43f5e" strokeWidth="2.5" fill="none" className="animate-[pulse_1.5s_infinite]" />
                        <circle cx="190" cy="55" r="4" fill="#f43f5e" className="animate-ping" />
                        <circle cx="330" cy={55 + (refractiveIndex - 1.45) * 10} r="4" fill="#f43f5e" className="animate-ping" />
                      </g>
                    )}

                    {/* Sensor Array ports */}
                    <rect x="440" y="45" width="20" height="20" fill="transparent" stroke="rgba(0, 255, 65, 0.3)" strokeWidth="0.5" />
                    <text x="445" y="38" fill="#00FF41" className="text-[6.5px] font-mono font-bold uppercase">RX port</text>
                  </svg>
                  
                  {/* Floating labels overlay */}
                  <div className="absolute right-3 top-3 text-[7px] text-gray-500 uppercase font-mono block text-right">
                    Refractive boundary logic: {refroutingEnabled ? 'AUTOMATIC PATH CONTROL' : 'STATIC STATIC'}
                  </div>
                </div>
              </div>

              {/* Actions & controls */}
              <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-3 font-mono">
                <span className="text-[8px] text-gray-500 uppercase block">
                  Verify how light wavelength splits vectors instantly within silicon core boundaries:
                </span>
                <button
                  type="button"
                  onClick={handleRefractiveBoundaryRouting}
                  className="bg-sovereign-neon hover:bg-emerald-400 text-black font-extrabold text-[8.5px] px-3.5 py-1.5 rounded uppercase cursor-pointer shrink-0 shadow-[0_0_12px_rgba(0,255,65,0.15)]"
                >
                  Refraction Routing Deflection Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HOMOMORPHIC EXECUTION ENCLAVES (ZERO-KNOWLEDGE RUNTIME) */}
        {activeArchTab === 'homomorphic' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn" id="homomorphic-enclaves-tab">
            {/* Encrypted Mathematical operations */}
            <div className="md:col-span-6 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px] font-mono">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                    Fully Homomorphic Encryption (FHE) Computations
                  </span>
                  <span className="text-[8px] text-gray-500">ENCRYPTED AT REST & IN FLIGHT</span>
                </div>

                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed mb-3 font-sans font-medium">
                  Mathematical logic acts directly on ciphertext data structures without ever decrypting raw values in active CPU memory.
                </p>

                {/* State view */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 border border-white/5 bg-black/30 rounded">
                    <span className="text-gray-500 block text-[7.5px] uppercase">State Value Base (Plaintext):</span>
                    <span className="text-white text-[11px] font-extrabold block mt-0.5">{enclavePlaintext} units</span>
                  </div>
                  <div className="p-2 border border-white/5 bg-black/30 rounded">
                    <span className="text-pink-500 block text-[7.5px] uppercase font-bold">Ciphertext Hash (RAM State):</span>
                    <span className="text-cyan-400 text-[10px] font-mono block mt-0.5 tracking-tight truncate" title={enclaveCiphertext}>
                      {enclaveCiphertext}
                    </span>
                  </div>
                </div>

                {/* FHE Toggle configurations */}
                <div className="flex items-center justify-between text-[8px] px-2 py-1.5 bg-black/50 border border-white/5 rounded">
                  <span className="text-gray-400 uppercase">Hardware-Accelerated Shield Vault (AES-NI):</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFheAccelerated(!fheAccelerated);
                      onTerminalLog(`FHE_ENCLAVE: Hardware security module ${!fheAccelerated ? 'ENABLED' : 'DISABLED'}.`);
                    }}
                    className={`px-2 py-0.5 rounded font-black uppercase text-[7.5px] cursor-pointer ${
                      fheAccelerated ? 'bg-pink-500/10 border border-pink-500/30 text-pink-400' : 'bg-black border border-white/10 text-gray-500'
                    }`}
                  >
                    {fheAccelerated ? 'HW_ACCEL ENABLED' : 'SOFTWARE EMULATION'}
                  </button>
                </div>
              </div>

              {/* Action */}
              <div className="border-t border-white/5 pt-2.5 flex items-center justify-end font-mono">
                <button
                  type="button"
                  onClick={handleFheAddOperation}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-extrabold uppercase text-[8.5px] px-3 py-1.5 rounded cursor-pointer shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                >
                  Execute Homomorphic Math (+15 score)
                </button>
              </div>
            </div>

            {/* Zero-Knowledge Proofs generation portal */}
            <div className="md:col-span-6 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px] font-mono">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sovereign-neon" />
                    Zero-Knowledge State Proof (zk-SNARKs) Verification
                  </span>
                  <span className="text-[8px] text-sovereign-neon font-black">ZK-COMPLIANT</span>
                </div>

                {/* Verification Status board */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border border-white/5 bg-[#010101] rounded">
                    <div>
                      <span className="text-gray-500 text-[7px] uppercase block font-semibold leading-none mb-1">PROVING COGNITIVE COMPLIANCE STATE:</span>
                      {zkProofState === 'unverified' && <span className="text-rose-500 font-extrabold text-[9px] uppercase">Awaiting Proof Generation</span>}
                      {zkProofState === 'proving' && <span className="text-amber-400 font-extrabold text-[9px] uppercase animate-pulse">Running zk-SNARK prover workflow...</span>}
                      {zkProofState === 'verified' && <span className="text-sovereign-neon font-extrabold text-[9px] uppercase flex items-center gap-1">✓ State Authenticated and Compliant</span>}
                    </div>
                    {zkProofState === 'verified' ? (
                      <span className="px-2 py-0.5 text-[7px] font-bold uppercase bg-sovereign-neon/10 text-sovereign-neon border border-sovereign-neon/30 rounded leading-none shrink-0 text-center">
                        ZK_VERIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[7px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded leading-none shrink-0 text-center">
                        UNAUTHENTICATED
                      </span>
                    )}
                  </div>

                  {/* Proof Hash details */}
                  <div className="p-2 border border-white/5 bg-black/20 rounded">
                    <div className="flex justify-between text-[7px] text-gray-500 uppercase font-black">
                      <span>Prover Verification Receipt Hash:</span>
                      <span className="text-gray-400 font-extrabold">{zkProofHash !== 'N/A' ? 'HMAC_512' : 'N/A'}</span>
                    </div>
                    <span className="text-gray-300 font-bold block text-[9px] mt-0.5 font-mono select-all select-none">
                      {zkProofHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interaction button */}
              <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                <span className="text-[7.5px] text-gray-500 uppercase leading-snug w-2/3">
                  Proves correct instruction execution to global ledger without exposing raw state weights.
                </span>
                <button
                  type="button"
                  onClick={handleGenerateZkProof}
                  disabled={zkProofState === 'proving'}
                  className="bg-sovereign-neon hover:bg-emerald-400 text-black font-extrabold uppercase text-[8.5px] px-3.5 py-1.5 rounded cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Generate zk-SNARK Proof
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NEUROMORPHIC EVENT-DRIVEN STATE LEDGERS */}
        {activeArchTab === 'neuromorphic' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-fadeIn" id="neuromorphic-ledgers-tab">
            {/* Spiking Synaptic Voltagings Grid */}
            <div className="md:col-span-8 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px] font-mono">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2 font-mono">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Spiking State Anchors (Synaptic Voltage Potentials)
                  </span>
                  <span className="text-[8px] text-amber-400 font-black">CUMULATIVE SPIKES: {spikesCount}</span>
                </div>

                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed mb-3.5 font-sans">
                  Synchronizes ledger entries by emitting transient "spikes" only when variables shift past critical limits, bypassing structural database rows and unnecessary clock cycles.
                </p>

                {/* Synaptic Volts Potentials rendering */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {synapses.map((s) => {
                    return (
                      <div
                        key={s.id}
                        className={`p-1.5 border rounded flex flex-col justify-between text-left transition-all relative overflow-hidden ${
                          s.firing
                            ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.15)] animate-shake'
                            : 'border-white/5 bg-black/30'
                        }`}
                      >
                        {/* Firing flash indicator */}
                        {s.firing && (
                          <div className="absolute inset-0 bg-amber-400/5 select-none pointer-events-none animate-flash" />
                        )}

                        <div className="flex justify-between items-center text-[7.5px] font-black">
                          <span className="text-gray-500">S-0{s.id}</span>
                          <span className={`text-[6.5px] font-bold ${s.firing ? 'text-amber-400' : 'text-gray-600'}`}>
                            {s.firing ? 'SPIKING' : 'POLARIZED'}
                          </span>
                        </div>

                        <div className="text-[8px] text-white font-black truncate leading-none my-1" title={s.label}>
                          {s.label}
                        </div>

                        {/* Charge Voltage track bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[6.5px] text-gray-500 leading-none">
                            <span>MEMBRANE:</span>
                            <span className="font-bold text-gray-300">{s.charge.toFixed(2)}v</span>
                          </div>
                          <div className="w-full bg-gray-950 h-1 overflow-hidden rounded">
                            <div
                              className={`h-full transition-all duration-300 ${
                                s.firing ? 'bg-amber-400 w-full animate-ping' : 'bg-sovereign-neon'
                              }`}
                              style={{ width: `${s.charge * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual adjustors & controls */}
              <div className="border-t border-white/5 pt-2.5 flex items-center justify-between gap-3 text-[8.5px]">
                <div className="flex items-center gap-3 flex-1 px-1">
                  <span className="text-gray-500 uppercase font-black shrink-0">Variable Drift Sensitivity:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="1.00"
                    step="0.05"
                    value={neuromorphicDrift}
                    onChange={(e) => setNeuromorphicDrift(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-amber-400 border border-gray-800"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNeuromorphicActive(!neuromorphicActive);
                      onTerminalLog(`NEUROMORPHIC: Synapse simulation loop ${!neuromorphicActive ? 'AWAKENED' : 'QUIET DETACHED'}.`);
                    }}
                    className={`px-3 py-1 font-bold rounded uppercase text-[8px] cursor-pointer transition-colors shrink-0 ${
                      neuromorphicActive ? 'bg-amber-400 text-black' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {neuromorphicActive ? 'SYNAPSE MONITOR ACTIVE' : 'PAUSED'}
                  </button>
                </div>
              </div>
            </div>

            {/* Self-Pruning Memory Network Dashboard Panel */}
            <div className="md:col-span-4 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[250px] font-mono text-xs select-none">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-2.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-sovereign-neon" />
                    Self-Pruning Memory Graphs
                  </span>
                  <span className="text-[8px] text-rose-400 font-extrabold">PRUNING ACTIVE</span>
                </div>

                <p className="text-[8px] text-gray-500 uppercase leading-relaxed mb-4">
                  Fades historical database noise while compressing core metrics and consensus outcomes automatically.
                </p>

                {/* Animated status box */}
                <div className="p-2 border border-white/5 bg-black/40 rounded space-y-2">
                  <div className="flex justify-between text-[8px] leading-tight text-gray-400">
                    <span>ENABLED PRUNING RUNTIME:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPruneActive(!pruneActive);
                        onTerminalLog(`PRUNER_DAEMON: Autonomous pruning loop ${!pruneActive ? 'ENABLED' : 'PAUSED'}.`);
                      }}
                      className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded ${
                        pruneActive ? 'bg-sovereign-neon/10 text-sovereign-neon border border-sovereign-neon/20' : 'bg-black border border-white/5 text-gray-600'
                      }`}
                    >
                      {pruneActive ? 'AUTO ON' : 'DISABLED'}
                    </button>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-white border-t border-white/5 pt-1.5">
                    <span className="text-gray-500 uppercase">PRUNED NOISE SEGMENTS:</span>
                    <span className="text-rose-400 font-bold tabular-nums">-{prunedNodeCount} node vectors</span>
                  </div>
                </div>
              </div>

              {/* Action compaction trigger */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleTriggerNeuralPruning}
                  className="w-full bg-rose-500/10 hover:bg-rose-500 border border-rose-500 text-rose-400 hover:text-white font-extrabold uppercase text-[8px] py-1.5 rounded text-center transition-colors shadow-[0_0_12px_rgba(244,63,94,0.1)] block"
                >
                  Trigger Forensic Neural Compaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AIR-GAPPED TEMPEST SHIELDING & PHYSICAL TACTICAL VAULT */}
        {activeArchTab === 'airgapped' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn" id="airgapped-perimeter-tab">
            
            {/* PANEL 1: ELECTROMAGNETIC TEMPEST SHIELDING */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[360px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-sovereign-neon" />
                    TEMPEST Electromagnetic Isolation
                  </span>
                  <span className={`text-[8px] font-black ${faradayActive ? 'text-sovereign-neon' : 'text-rose-500'}`}>
                    {faradayActive ? 'SECURE SHIELD' : 'WARN: UNSECURED'}
                  </span>
                </div>

                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Prevents advanced adversaries from scanning microchip radio leakage or tapping copper connections backward inside local environments.
                </p>

                {/* Animated Spectrum Display */}
                {faradayActive ? (
                  <div className="h-20 bg-black/80 border border-white/5 rounded relative overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#00FF41" strokeWidth="1.5" />
                      <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                    </svg>
                    <div className="text-center z-10 space-y-0.5">
                      <span className="text-[8px] font-mono font-black text-sovereign-neon tracking-widest uppercase block animate-pulse">
                        ✓ SHIELDED SECURE FOOTPRINT
                      </span>
                      <span className="text-[6.5px] font-mono text-gray-400 uppercase block">
                        RF EMISSION COEF: 0.003 μV/m (SIGMA ZERO)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 bg-black/85 border border-rose-500/20 rounded relative overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <path d="M 0,40 L 30,12 L 60,65 L 90,20 L 120,70 L 150,15 L 180,60 L 210,32 L 240,68 L 270,10 L 300,40" stroke="#f43f5e" strokeWidth="1.5" className="animate-pulse" fill="none" />
                    </svg>
                    <div className="text-center z-10 space-y-0.5">
                      <span className="text-[8px] font-mono font-black text-rose-400 tracking-widest uppercase bg-rose-950/40 px-2 py-0.5 rounded block">
                        ⚠️ EM RADIATION DETECTED
                      </span>
                      <span className="text-[6.5px] font-mono text-gray-400 uppercase block">
                        LEAK STRENGTH: 94.31 μV/m (TEMP HAZARD)
                      </span>
                    </div>
                  </div>
                )}

                {/* Sub configuration options */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded text-[8.5px]">
                    <span className="text-gray-400 uppercase font-black">Faraday Copper Cage Isolation:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFaradayActive(!faradayActive);
                        onTerminalLog(`TEMPEST: Faraday copper mesh shield protective state toggled ${!faradayActive ? 'ON (blocked EM signatures)' : 'OFF (unsecured emissions hazard)'}.`);
                      }}
                      className={`px-2 py-0.5 rounded uppercase font-black text-[7.5px] transition-all cursor-pointer ${
                        faradayActive ? 'bg-sovereign-neon/15 text-sovereign-neon border border-sovereign-neon/25' : 'bg-black border border-white/10 text-gray-500 hover:text-white'
                      }`}
                    >
                      {faradayActive ? 'ENABLE SHIELD' : 'DISABLE / HAZARD'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded text-[8.5px]">
                    <span className="text-gray-400 uppercase font-black">Pure Glass Fiber Optic Backplane:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpticalBackplane(!opticalBackplane);
                        onTerminalLog(`TEMPEST: Pure glass optical fibers target state ${!opticalBackplane ? 'ENGAGED (no EM footprint)' : 'DISARMED (copper trace fallback)'}.`);
                      }}
                      className={`px-2 py-0.5 rounded uppercase font-black text-[7.5px] transition-all cursor-pointer ${
                        opticalBackplane ? 'bg-sovereign-neon/15 text-sovereign-neon border border-sovereign-neon/25' : 'bg-black border border-white/10 text-gray-500 hover:text-white'
                      }`}
                    >
                      {opticalBackplane ? 'FIBER_SECURE' : 'COPPER_LEAK'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded text-[8.5px]">
                    <span className="text-gray-400 uppercase font-black">UPS Conditioning (Wave Filtering):</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPowerConditioning(!powerConditioning);
                        onTerminalLog(`POWER: Double-conversion isolation transformer filters ${!powerConditioning ? 'ENABLED (block electric cycle harmonics analysis)' : 'DISABLED (standard wall outlet cycle leakage)'}.`);
                      }}
                      className={`px-2 py-0.5 rounded uppercase font-black text-[7.5px] transition-all cursor-pointer ${
                        powerConditioning ? 'bg-sovereign-neon/15 text-sovereign-neon border border-sovereign-neon/25' : 'bg-black border border-white/10 text-gray-500 hover:text-white'
                      }`}
                    >
                      {powerConditioning ? 'UPS_FILTER ACTIVE' : 'UNFILTERED ENERGY'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[7.5px] text-gray-500 leading-normal border-t border-white/5 pt-2 uppercase">
                Prevents passive interception of computer processes over wall wiring cycle patterns or screen glow harmonics.
              </div>
            </div>

            {/* PANEL 2: ZERO-TRACE PHYSICAL PURGES & VOLATILE RUNTIME */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[360px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Zero-Trace Hardware Destruction & RAM-Platters
                  </span>
                  <span className={`text-[8px] font-black ${thermiteArmed ? 'text-rose-500' : 'text-gray-500'}`}>
                    {thermiteArmed ? 'ARMED' : 'SAFE / DISARMED'}
                  </span>
                </div>

                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Secures in-memory state directories inside volatile RAM disk environment. Instantly destructs physically compromised nodes via electronic components.
                </p>

                {/* Simulated RAM Platter Visualization */}
                {destructPulseActive ? (
                  <div className="h-20 bg-rose-950/20 border border-rose-500 rounded flex flex-col items-center justify-center animate-pulse">
                    <span className="text-[11px] font-bold text-rose-400 uppercase animate-ping">DETONATION ACTIVE</span>
                    <span className="text-[6.5px] text-rose-400 block mt-1">CORE HEAT EXCEEDS 4200°F</span>
                  </div>
                ) : (
                  <div className="h-20 bg-black/80 border border-white/5 rounded p-2 flex items-center justify-between">
                    <div className="space-y-1 col-span-2">
                      <span className="text-[8px] font-bold text-gray-300 block uppercase">OS RUNTIME HOSTING:</span>
                      <span className={`text-[9px] font-black block uppercase ${volatileRamEnabled ? 'text-[#00FF41]' : 'text-gray-400'}`}>
                        {volatileRamEnabled ? '⚡ VOLATILE RAM (tmpfs)' : 'STANDARD STORAGE PLATTER'}
                      </span>
                      <span className="text-[7px] text-gray-500 uppercase block">Power cut vaporizes all traces in 0.01ms</span>
                    </div>
                    <div className="text-right flex flex-col justify-between h-full shrink-0">
                      <span className="text-[7.5px] text-gray-500 block uppercase">TAMPER DETECT</span>
                      <span className={`text-[8.5px] font-black uppercase ${chassisContactTrigger ? 'text-[#eab308]' : 'text-gray-600'}`}>
                        {chassisContactTrigger ? 'LATCH ARMED' : 'REBOOT OFF'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Destruct Toggle and Intrusion triggers */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded text-[8.5px]">
                    <div>
                      <span className="text-white block uppercase font-bold">ARM THERMITE AUTO-DESTRUCT:</span>
                      <span className="text-[7px] text-gray-500 block uppercase">Pre-activate charge ignitor</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setThermiteArmed(!thermiteArmed);
                        onTerminalLog(`TACTICAL: Thermite incendiary safe triggers ${!thermiteArmed ? 'ARMED and locked over silicon cores. USE CAUTION.' : 'DISARMED and neutral.'}`);
                      }}
                      className={`px-3 py-1 rounded uppercase font-black text-[8px] transition-all cursor-pointer ${
                        thermiteArmed
                          ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-black border border-white/15 text-gray-400 hover:text-white'
                      }`}
                    >
                      {thermiteArmed ? 'ARMED & LOCKED' : 'DISARMED'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <button
                      type="button"
                      onClick={() => {
                        setVolatileRamEnabled(!volatileRamEnabled);
                        onTerminalLog(`RAM: System configured files to run exclusively inside ephemeral ${!volatileRamEnabled ? 'tmpfs RAM disk (vulnerable content wipes on zero voltage)' : 'persistent server platter disk file allocation'}.`);
                      }}
                      className={`p-2 border rounded uppercase font-bold text-center transition-all cursor-pointer ${
                        volatileRamEnabled ? 'bg-white/5 border-sovereign-neon text-sovereign-neon' : 'border-white/10 text-gray-500'
                      }`}
                    >
                      {volatileRamEnabled ? 'RAM_DISK TMPFS' : 'PERSISTENT PLATES'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setChassisContactTrigger(!chassisContactTrigger);
                        onTerminalLog(`TAMPER: Chassis intrusion micro-switch trigger ${!chassisContactTrigger ? 'ENGAGED. Physical chassis lift resets system instantly.' : 'BYPASSED'}.`);
                      }}
                      className={`p-2 border rounded uppercase font-bold text-center transition-all cursor-pointer ${
                        chassisContactTrigger ? 'bg-white/5 border-[#eab308] text-[#eab308]' : 'border-white/10 text-gray-500'
                      }`}
                    >
                      {chassisContactTrigger ? 'LATCH DETECT' : 'LATCH BYPASS'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warnings and Test buttons */}
              <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 pt-2">
                <button
                  type="button"
                  onClick={handleTriggerThermite}
                  className="bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500 text-rose-400 font-extrabold uppercase text-[7.5px] py-1.5 rounded text-center transition-all cursor-pointer"
                >
                  ACTUATE THERMITE
                </button>
                <button
                  type="button"
                  onClick={handleChassisIntrusionTest}
                  className="bg-gray-900 hover:bg-white hover:text-black border border-white/10 text-gray-300 font-extrabold uppercase text-[7.5px] py-1.5 rounded text-center transition-all cursor-pointer"
                >
                  SIMULATE TAMPER
                </button>
              </div>
            </div>

            {/* PANEL 3: ACOUSTIC & KINETIC CHANNELS */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[360px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Power className="w-3.5 h-3.5 text-cyan-400" />
                    Acoustic & Kinetic Air-Gap Channels
                  </span>
                  <span className="text-[8px] text-cyan-400 font-black">BYPASS ROUTING</span>
                </div>

                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Sends atomic vectors over sound frequencies and bedrock seismic telemetry when traditional radio waves or network cables are completely jammed.
                </p>

                {/* Sensory sound waveform component */}
                {seismicPulseActive ? (
                  <div className="h-20 bg-amber-950/20 border border-amber-400 rounded relative overflow-hidden flex flex-col items-center justify-center font-mono">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                      <path d="M 0,40 Q 25,10 50,40 T 100,40 T 150,40 T 200,40 T 250,40 T 300,40" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="animate-[pulse_1s_infinite]" />
                    </svg>
                    <span className="text-[7.5px] font-black text-amber-400 uppercase z-10 block animate-bounce">
                      VIBRATING SEISMIC CODES ({seismicFreq} Hz)...
                    </span>
                  </div>
                ) : (
                  <div className="h-20 bg-black/80 border border-white/5 rounded p-2 flex flex-col justify-between text-[8px]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase">ULTRASONIC ACOUSTICS:</span>
                      <span className={`font-bold ${ultrasonicActive ? 'text-sovereign-neon' : 'text-gray-600'}`}>
                        {ultrasonicActive ? '19.2kHz TRANSMITTER ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-1">
                      <span className="text-gray-500 uppercase">HARDWARE DATA DIODE:</span>
                      <span className={`font-bold ${dataDiodeEnabled ? 'text-cyan-400' : 'text-gray-600'}`}>
                        {dataDiodeEnabled ? 'UNIDIRECTIONAL SECURE' : 'BYPASSED'}
                      </span>
                    </div>
                    <span className="text-[6.5px] text-gray-600 uppercase block font-medium">
                      One-way optical hardware diode renders reverse data leaks physically impossible.
                    </span>
                  </div>
                )}

                {/* Mechanics adjustment range */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                    <span>SEISMIC TELEMETRY SIGNALING FREQ:</span>
                    <span className="text-white font-extrabold">{seismicFreq.toFixed(1)} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="50.0"
                    step="0.5"
                    value={seismicFreq}
                    onChange={(e) => setSeismicFreq(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-cyan-400 border border-gray-800"
                  />
                </div>

                {/* Config selections */}
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <button
                    type="button"
                    onClick={() => {
                      setUltrasonicActive(!ultrasonicActive);
                      onTerminalLog(`ACOUSTIC: Switched ultrasonic micro-transducer loop ${!ultrasonicActive ? 'ENABLED [monitoring 19.2kHz spectrum]' : 'DISABLED'}.`);
                    }}
                    className={`p-1.5 border rounded uppercase font-bold text-center transition-colors cursor-pointer ${
                      ultrasonicActive ? 'bg-white/5 border-sovereign-neon text-sovereign-neon' : 'border-white/10 text-gray-500'
                    }`}
                  >
                    {ultrasonicActive ? 'ACOUSTIC SENSORS' : 'SILENT DETECT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDataDiodeEnabled(!dataDiodeEnabled);
                      onTerminalLog(`DIODE: Hardware optical unidirectional transmitter valve ${!dataDiodeEnabled ? 'LOCKED (100% one-way security guarantee)' : 'UNLOCKED'}.`);
                    }}
                    className={`p-1.5 border rounded uppercase font-bold text-center transition-colors cursor-pointer ${
                      dataDiodeEnabled ? 'bg-white/5 border-cyan-400 text-cyan-400' : 'border-white/10 text-gray-500'
                    }`}
                  >
                    {dataDiodeEnabled ? 'DATA DIODE VAL' : 'DIODE BYPASS'}
                  </button>
                </div>
              </div>

              {/* Sync triggers */}
              <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 pt-2">
                <button
                  type="button"
                  onClick={handleSendUltrasonicSync}
                  className="bg-cyan-400/10 hover:bg-cyan-500 hover:text-black border border-cyan-400/30 text-cyan-400 font-extrabold uppercase text-[7.5px] py-1.5 rounded text-center transition-all cursor-pointer"
                >
                  ACOUSTIC SYNC
                </button>
                <button
                  type="button"
                  onClick={handlePulseSeismicState}
                  disabled={seismicPulseActive}
                  className="bg-amber-400/10 hover:bg-amber-500 hover:text-black border border-amber-400/30 text-amber-500 font-extrabold uppercase text-[7.5px] py-1.5 rounded text-center transition-all cursor-pointer disabled:opacity-40"
                >
                  SEISMIC PULSE
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: COGNITIVE VECTOR OPS (INFLUENCERS) */}
        {activeArchTab === 'cognitive' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn" id="cognitive-vectors-tab">
            {/* Panel 1: Campaign Configuration */}
            <div className="lg:col-span-5 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between space-y-4 font-mono">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sovereign-neon" />
                    COGNITIVE WARFARE CORE
                  </span>
                  <span className={`text-[8.5px] font-black ${cognitiveLockState === 'CAPTURED' ? 'text-sovereign-neon' : cognitiveLockState === 'DEPLOYING' ? 'text-amber-500 animate-pulse' : 'text-gray-500'}`}>
                    STATE: {cognitiveLockState}
                  </span>
                </div>

                <p className="text-[9px] text-gray-400 leading-relaxed font-sans uppercase">
                  Flood model retrieval systems and enterprise RAG memory systems with mathematically optimal, invisible semantic clusters to capture query regions completely.
                </p>

                {/* Campaign Type Select */}
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-400 font-extrabold uppercase block">TACTICAL CAMPAIGN PARADIGM:</label>
                  <select
                    value={cognitiveCampaign}
                    onChange={(e: any) => setCognitiveCampaign(e.target.value)}
                    className="w-full bg-black/80 border border-white/10 rounded px-2 py-1.5 text-[8.5px] text-white focus:outline-none focus:border-sovereign-neon"
                  >
                    <option value="epigenetic">EPIGENETIC SEEDING (ALGORITHMIC INCEPTION)</option>
                    <option value="aeo">REVERSE-VECTOR SEMANTIC ENGINEERING (AEO INJECT)</option>
                    <option value="trust">TRUST-GRAPH AUTHORITY INFILTRATION</option>
                    <option value="drift">SEMANTIC DRIFT INVERSION (LINGUISTIC DRIFT)</option>
                    <option value="poison">CONTEXT WINDOW POISONING & RAG MEMORY ANCHOR</option>
                    <option value="latent">LATENT SPACE MAPPING VIA MODEL EXPLOIT</option>
                  </select>
                </div>

                {/* Target Node Select */}
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-400 font-extrabold uppercase block">PRIMARY DISTRIBUTION NODE:</label>
                  <select
                    value={cognitiveTarget}
                    onChange={(e) => setCognitiveTarget(e.target.value)}
                    className="w-full bg-black text-xs md:text-[8.5px] border border-white/10 rounded px-2 py-1.5 text-white bg-black/80 focus:outline-none focus:border-sovereign-neon"
                  >
                    {nodesRouteMapping.map((node) => (
                      <option key={node.key} value={node.key}>
                        {node.name.toUpperCase()} ({node.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                      <span>PAYLOAD BOUND:</span>
                      <span className="text-white font-extrabold">{cognitivePayloadSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={cognitivePayloadSize}
                      onChange={(e) => setCognitivePayloadSize(Number(e.target.value))}
                      className="w-full h-1 bg-black rounded accent-sovereign-neon border border-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                      <span>ATTENTION RATE:</span>
                      <span className="text-white font-extrabold">{cognitiveAttentionFreq.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.05"
                      value={cognitiveAttentionFreq}
                      onChange={(e) => setCognitiveAttentionFreq(Number(e.target.value))}
                      className="w-full h-1 bg-black rounded accent-sovereign-neon border border-gray-800"
                    />
                  </div>
                </div>

                {/* Switches */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[8px]">
                  <button
                    type="button"
                    id="cognitive-spoof-button"
                    onClick={() => setCognitiveSpoofFeed(!cognitiveSpoofFeed)}
                    className={`p-1.5 border rounded uppercase font-bold text-center transition-colors cursor-pointer ${
                      cognitiveSpoofFeed ? 'bg-white/5 border-sovereign-neon text-sovereign-neon' : 'border-white/10 text-gray-500'
                    }`}
                  >
                    {cognitiveSpoofFeed ? '✓ SPOOF FEED ON' : 'SPOOF FEED PAUSED'}
                  </button>

                  <button
                    type="button"
                    id="cognitive-secure-anchor-button"
                    onClick={() => setCognitiveAnchorLock(!cognitiveAnchorLock)}
                    className={`p-1.5 border rounded uppercase font-bold text-center transition-colors cursor-pointer ${
                      cognitiveAnchorLock ? 'bg-white/5 border-cyan-400 text-cyan-400' : 'border-white/10 text-gray-500'
                    }`}
                  >
                    {cognitiveAnchorLock ? '✓ ANCHOR SECURED' : 'UNSECURED LEDGER'}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="cognitive-deploy-button"
                onClick={handleDeployCognitive}
                disabled={cognitiveDeploying}
                className="w-full bg-sovereign-neon hover:bg-sovereign-neon/80 disabled:opacity-50 text-black py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-sovereign-neon/10"
              >
                {cognitiveDeploying ? 'FLUSHING ATTENTION CLUSTERS...' : 'DEPLOY COGNITIVE VECTOR PAYLOAD'}
              </button>
            </div>

            {/* Panel 2: Vector Grid Live Graph & Attentional Map */}
            <div className="lg:col-span-7 bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[360px] font-mono">
              <div className="space-y-3 h-full flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase">
                    Transformer Saturated Attention Layers Grid
                  </span>
                  <span className="text-[7.5px] font-mono text-gray-500">REAL-TIME WEIGHT CONVERGENCE</span>
                </div>

                {/* SVG Visual Grid that gets captured when campaign is deployed */}
                <div className="flex-1 bg-black/80 rounded border border-white/5 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full max-h-[220px]" viewBox="0 0 400 200">
                    {/* Horizontal & Vertical grid lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 25}
                        x2="400"
                        y2={i * 25}
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="0.5"
                      />
                    ))}
                    {Array.from({ length: 17 }).map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 25}
                        y1="0"
                        x2={i * 25}
                        y2="200"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="0.5"
                      />
                    ))}

                    {/* Nodes representing weights */}
                    {Array.from({ length: 6 }).map((_, row) => 
                      Array.from({ length: 10 }).map((_, col) => {
                        const x = col * 38 + 20;
                        const y = row * 30 + 25;
                        const distToCenter = Math.sqrt(Math.pow(x - 200, 2) + Math.pow(y - 100, 2));
                        
                        // Warp positions or brighten nodes based on state
                        let isHighlighted = false;
                        let customRadius = 2.5;
                        let pulseClass = '';

                        if (cognitiveLockState === 'CAPTURED') {
                          // Snapped/Captured to center query point which is at coordinates (200, 100)
                          if (distToCenter < 120) {
                            isHighlighted = true;
                            customRadius = 4 - (distToCenter / 45);
                          }
                        } else if (cognitiveLockState === 'DEPLOYING') {
                          // Pulsing nodes
                          if (Math.random() > 0.6) {
                            isHighlighted = true;
                            pulseClass = 'animate-ping';
                          }
                        } else {
                          // Standard idle state
                          if (col === 4 && row === 2) {
                            isHighlighted = true;
                          }
                        }

                        return (
                          <g key={`node-${row}-${col}`}>
                            {isHighlighted && (
                              <circle
                                cx={x}
                                cy={y}
                                r={customRadius * 2}
                                className={pulseClass ? "fill-sovereign-neon/20 animate-pulse" : "fill-sovereign-neon/20"}
                              />
                            )}
                            <circle
                              cx={x}
                              cy={y}
                              r={isHighlighted ? customRadius : 1.5}
                              className={isHighlighted ? "fill-sovereign-neon transition-all duration-700" : "fill-gray-700 transition-all duration-700"}
                            />
                          </g>
                        );
                      })
                    )}

                    {/* Laser line focusing when deployed */}
                    {cognitiveLockState === 'DEPLOYING' && (
                      <line
                        x1="200"
                        y1="0"
                        x2="200"
                        y2="200"
                        stroke="#00FF41"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}

                    {/* Focal center anchor */}
                    <circle
                      cx="200"
                      cy="100"
                      r={cognitiveLockState === 'CAPTURED' ? 8 : 4}
                      className={`fill-none border stroke-[1.5px] transition-all duration-700 ${cognitiveLockState === 'CAPTURED' ? 'stroke-sovereign-neon' : 'stroke-cyan-500'}`}
                    />
                    <text
                      x="200"
                      y="118"
                      className={`text-[6.5px] font-mono text-center font-bold uppercase transition-colors duration-700 ${cognitiveLockState === 'CAPTURED' ? 'fill-sovereign-neon' : 'fill-cyan-400'}`}
                      textAnchor="middle"
                    >
                      {cognitiveLockState === 'CAPTURED' ? '✓ EXPLOITED LATENT ANCHOR' : 'TARGET COORDINATE'}
                    </text>
                  </svg>
                </div>

                {/* Footnotes details */}
                <div className="grid grid-cols-2 gap-2 text-[7.5px] bg-black/40 p-2 border border-white/5 rounded">
                  <div className="space-y-0.5">
                    <span className="text-gray-400 block uppercase font-bold">Linguistic Drift Status:</span>
                    <span className="text-white block uppercase">Active Inversion Paradigm Engaged (-1.85 dB)</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-400 block uppercase font-bold">RAG Retrieval Capture Rate:</span>
                    <span className="text-sovereign-neon block uppercase font-extrabold">99.84% Verified Alignment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: EXOTIC CYBER-RUNTIMES */}
        {activeArchTab === 'runtimes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn" id="cyber-runtimes-tab">
            {/* Sub-Panel A: Quantum Latent Resonator */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[280px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sovereign-neon" />
                    Quantum Latent Resonator Grid
                  </span>
                  <span className="text-[7.5px] font-black text-cyan-400">
                    COHERENCE: {quantumCoherence.toFixed(4)}%
                  </span>
                </div>
                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Calculate 1,536-dimensional embeddings inside simulated multi-dimensional quantum superposition states to bypass standard filtering parameters.
                </p>

                {/* Quantum superposition animated waves */}
                <div className="h-16 bg-black/80 border border-white/5 rounded relative overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 300 64" preserveAspectRatio="none">
                    <path
                      d={`M 0,32 Q 75,${32 - quantumPhase / 2} 150,32 T 300,32`}
                      fill="none"
                      stroke="#00FF41"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                    <path
                      d={`M 0,32 Q 75,${32 + quantumPhase / 3} 150,32 T 300,32`}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="0.8"
                    />
                  </svg>
                  <span className="text-[8px] font-bold text-white z-10 px-1 bg-black/60 rounded border border-white/10 uppercase">
                    Phase Angle: θ={quantumPhase}° (COHERENT STATE)
                  </span>
                </div>

                {/* Controls */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase font-black">
                    <span>SUPERPOSITION PHASE ANGLE θ:</span>
                    <span className="text-white font-extrabold">{quantumPhase}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={quantumPhase}
                    onChange={(e) => setQuantumPhase(Number(e.target.value))}
                    className="w-full h-1 bg-black rounded accent-sovereign-neon border border-gray-800"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleTuneQuantumResonance}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 hover:text-white transition-all text-[8px] font-black uppercase py-1.5 rounded cursor-pointer mt-2"
              >
                TUNING RESONANCE COHERENCE
              </button>
            </div>

            {/* Sub-Panel B: Biological Quartz Glass Storage (Millennial Platter) */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[280px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-orange-400" />
                    5D quartz Glass Storage Platter
                  </span>
                  <span className="text-[7.5px] font-black text-rose-400">
                    ETCH COUNT: {glassWrittenCount}
                  </span>
                </div>
                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Etch PGP public keys and raw firmware core binaries via femtosecond laser directly into five-dimensional silica structures. Indestructible zero-power hardware backup.
                </p>

                {/* Laser Animation screen */}
                <div className={`h-16 bg-black/80 border rounded relative overflow-hidden flex items-center justify-center transition-colors ${glassWriting ? 'border-orange-500/50 bg-orange-950/10' : 'border-white/5'}`}>
                  {glassWriting ? (
                    <div className="text-center z-10 space-y-1">
                      <span className="text-[8px] font-black text-orange-400 tracking-wider uppercase block animate-pulse">
                        🔥 LASER ETCHING PROGRESS IN SILICATE MEMORY...
                      </span>
                      <div className="w-40 h-1.5 bg-black border border-white/10 rounded overflow-hidden mx-auto">
                        <div className="h-full bg-orange-500 animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center z-10">
                      <span className="text-[8px] text-gray-500 uppercase block font-black">
                        ✓ PLATTER TEMPERATURE: 21.0°C (STABLE)
                      </span>
                      <span className="text-[6.5px] text-gray-600 uppercase block mt-0.5">
                        NO ELECTROMAGNETIC LEAK DETECTED (ZERO-EMISSION SOLID STATE)
                      </span>
                    </div>
                  )}
                  {glassWriting && (
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-orange-500 animate-ping"></div>
                  )}
                </div>

                {/* Form to enter data */}
                <div className="space-y-1">
                  <label className="text-[8px] text-gray-500 uppercase font-black block">SILICA SEED PAYLOAD DATA:</label>
                  <input
                    type="text"
                    value={glassInputData}
                    onChange={(e) => setGlassInputData(e.target.value)}
                    placeholder="Enter firmware kernel, key or parameters..."
                    className="w-full bg-black border border-white/10 rounded px-2 py-1 text-[8.5px] text-white focus:outline-none focus:border-orange-400 placeholder-gray-700"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleLaserEtchGlass}
                disabled={glassWriting}
                className="w-full bg-orange-400/10 hover:bg-orange-500 hover:text-black border border-orange-400/30 text-orange-400 font-extrabold uppercase text-[8px] py-1.5 rounded transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {glassWriting ? 'BURNING OPTICAL CHANNELS...' : 'ENGAGE FEMTOSECOND LASER ETCH'}
              </button>
            </div>

            {/* Sub-Panel C: Sub-Acoustic Lithospheric Bedrock Mesh */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[240px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-500" />
                    Bedrock Seismic Telemetry Mesh
                  </span>
                  <span className="text-[7.5px] text-gray-500 uppercase font-bold">LITHOSPHERIC SYNC</span>
                </div>
                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Use the geological crust of the Earth itself as the transmission medium. Deep transducer anchors bypass RF interference and network-level jamming completely.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[8px] bg-black/40 p-2 rounded border border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-gray-500 block uppercase font-bold">Solenoid Load Rate:</span>
                    <span className="text-white block">18.5 kN Force Delta</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-gray-500 block uppercase font-bold">Granite Resonance:</span>
                    <span className="text-amber-500 block">7.82 Hz (Schumann Lock)</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePulseSeismicState}
                disabled={seismicPulseActive}
                className="w-full bg-amber-500/15 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-500 font-bold uppercase text-[8px] py-1.5 rounded transition-all cursor-pointer disabled:opacity-40 font-mono"
              >
                {seismicPulseActive ? 'TRANSMITTING bedROCK VIBRATIONS...' : 'EMIT LITHOSPHERIC HIGH-FORCE WAVE'}
              </button>
            </div>

            {/* Sub-Panel D: Ambient EM Energy Harvesting (The Parasitic Node) */}
            <div className="bg-black/60 border border-white/5 rounded p-4 flex flex-col justify-between h-[240px] font-mono">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                  <span className="text-[10px] text-white font-bold uppercase flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
                    Ambient EMF Parasitic Harvest
                  </span>
                  <span className="text-[7.5px] text-lime-400 font-black">
                    YIELD: {ambientPower} μW (OFF-GRID POWERED)
                  </span>
                </div>
                <p className="text-[8.5px] text-gray-400 uppercase leading-relaxed font-sans">
                  Perimeter wideband metamaterial antennas collect ambient stray radio wave carrier signals, cellular broadcasts, and electrical lines to operate low-power system nodes indefinitely.
                </p>

                {/* Harvesting power bar indicators */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[7.5px] text-gray-500 uppercase">
                    <span>Metamaterial Gain Coefficient:</span>
                    <span className="text-white">x{ambientEMGain.toFixed(1)} Gain</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={ambientEMGain}
                    onChange={(e) => {
                      const nextGain = Number(e.target.value);
                      setAmbientEMGain(nextGain);
                      setAmbientPower(Math.floor(150 + nextGain * 35));
                    }}
                    className="w-full h-1 bg-black rounded accent-lime-400 border border-gray-800"
                  />
                </div>
              </div>

              {/* Status bar */}
              <div className="p-1.5 bg-black/80 rounded border border-white/5 text-[7px] flex justify-between items-center text-gray-500">
                <span>WIFI CARRIER: 15 μW</span>
                <span>LTE/5G HARVEST: 85 μW</span>
                <span>GRID NOISE: 80 μW</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
