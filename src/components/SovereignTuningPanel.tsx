import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Settings, 
  Cpu, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Radio, 
  Activity, 
  Volume2, 
  Zap, 
  RefreshCw, 
  Globe2, 
  Sparkles,
  Award,
  Flame,
  Binary
} from 'lucide-react';

interface SovereignTuningPanelProps {
  onTerminalLog: (msg: string) => void;
  nodeLocks: Record<string, boolean>;
  onToggleUniversalLock: () => Promise<void>;
  onToggleNodeLock: (nodeId: string) => void;
  notesPermanentLock: boolean;
  onToggleNotesPermanentLock: (locked: boolean) => void;
  swarmStats: any;
  setSwarmStats: React.Dispatch<any>;
}

// Inline Synthesizer Core for high-fidelity audio responses matched to visualizers
class TuningSynth {
  private ctx: AudioContext | null = null;
  public mute: boolean = false;

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

  // Play crisp tactile mechanic click sound
  playClick() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Play sound when sliding parameters (ascending/descending chiptune tone)
  playSlide(val: number, max: number) {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 180 + (val / max) * 450;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Play professional system level double lock chime
  playLockAll() {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(520, now);
    osc1.frequency.setValueAtTime(640, now + 0.08);
    osc1.frequency.setValueAtTime(780, now + 0.16);

    osc2.frequency.setValueAtTime(1040, now);
    osc2.frequency.setValueAtTime(1280, now + 0.08);
    osc2.frequency.setValueAtTime(1560, now + 0.16);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  }

  // Play acoustic high frequency resonance sweep (Solfeggio hum)
  playAcousticChime(frequency: number) {
    if (this.mute) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(6, now); // 6Hz vibrato
    vibratoGain.gain.setValueAtTime(5, now);   // 5Hz frequency depth

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    vibrato.start();
    osc.start();
    vibrato.stop(now + 1.0);
    osc.stop(now + 1.05);
  }
}

const tuningSynth = new TuningSynth();

export function SovereignTuningPanel({
  onTerminalLog,
  nodeLocks,
  onToggleUniversalLock,
  onToggleNodeLock,
  notesPermanentLock,
  onToggleNotesPermanentLock,
  swarmStats,
  setSwarmStats
}: SovereignTuningPanelProps) {
  // Advanced tweakable state variables
  const [latencyOffset, setLatencyOffset] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_LATENCY_OFFSET') || '12');
  });
  const [jitterDev, setJitterDev] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_JITTER_DEV') || '1.8');
  });
  const [redundancyLevel, setRedundancyLevel] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_REDUNDANCY_LVL') || '4');
  });
  const [calibrationBase, setCalibrationBase] = useState<string>(() => {
    return localStorage.getItem('TUNE_CALIBRATION_BASE') || '432';
  });
  const [octaveSustainer, setOctaveSustainer] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_OCTAVE_SUSTAINER') || '8.8');
  });
  const [vocalResonance, setVocalResonance] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_VOCAL_RESONANCE') || '92');
  });
  const [threadsPerSilo, setThreadsPerSilo] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_THREADS_PER_SILO') || '150');
  });
  const [bandwidthQuota, setBandwidthQuota] = useState<number>(() => {
    return Number(localStorage.getItem('TUNE_BANDWIDTH_QUOTA') || '99.9');
  });
  const [selectedAlg, setSelectedAlg] = useState<string>(() => {
    return localStorage.getItem('TUNE_CRYPT_ALG') || 'Ed25519-EdDSA';
  });
  const [localNodesStatus, setLocalNodesStatus] = useState<Record<string, { latency: number; status: string; cdnSpeed: number }>>(() => {
    const saved = localStorage.getItem('TUNE_LOCAL_NODES_STATUS');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        // ignore & fallback
      }
    }
    
    // Stable default statuses for all 14 nodes
    const defaults: Record<string, { latency: number; status: string; cdnSpeed: number }> = {};
    const nodeNames = [
      'jhammerz.github.io', 'tiktok.com/@jhammerzz', 'linkedin.com/in/JHammerZ',
      'youtube.com/@JHammerZ', 'instagram.com/jhammerzz', 'facebook.com/JHammerzz',
      'jhammerz.carrd.co', 'amazon.music/jhammerz', 'apple.music/jhammerz',
      'bandlab.com/jhammerz', 'xiaohongshu/jhammerz', 'github.com/JHammerZ/jhammerz.github.io',
      'impact.com/secure', 'spotify.artist/7vRd2'
    ];
    nodeNames.forEach((name, i) => {
      defaults[`node-${i+1}`] = {
        latency: 10 + i * 3,
        status: 'SECURED_PERMANENT',
        cdnSpeed: 100 - (i % 3)
      };
    });
    return defaults;
  });

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [oscillateState, setOscillateState] = useState<number>(0);

  // Oscillating spectrum timer
  useEffect(() => {
    const timer = setInterval(() => {
      setOscillateState(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Sync state modifications down to storage elements
  useEffect(() => {
    localStorage.setItem('TUNE_LATENCY_OFFSET', String(latencyOffset));
  }, [latencyOffset]);

  useEffect(() => {
    localStorage.setItem('TUNE_JITTER_DEV', String(jitterDev));
  }, [jitterDev]);

  useEffect(() => {
    localStorage.setItem('TUNE_REDUNDANCY_LVL', String(redundancyLevel));
  }, [redundancyLevel]);

  useEffect(() => {
    localStorage.setItem('TUNE_CALIBRATION_BASE', calibrationBase);
  }, [calibrationBase]);

  useEffect(() => {
    localStorage.setItem('TUNE_OCTAVE_SUSTAINER', String(octaveSustainer));
  }, [octaveSustainer]);

  useEffect(() => {
    localStorage.setItem('TUNE_VOCAL_RESONANCE', String(vocalResonance));
  }, [vocalResonance]);

  useEffect(() => {
    localStorage.setItem('TUNE_THREADS_PER_SILO', String(threadsPerSilo));
  }, [threadsPerSilo]);

  useEffect(() => {
    localStorage.setItem('TUNE_BANDWIDTH_QUOTA', String(bandwidthQuota));
  }, [bandwidthQuota]);

  useEffect(() => {
    localStorage.setItem('TUNE_CRYPT_ALG', selectedAlg);
  }, [selectedAlg]);

  const saveLocalNodes = (newStatus: any) => {
    setLocalNodesStatus(newStatus);
    localStorage.setItem('TUNE_LOCAL_NODES_STATUS', JSON.stringify(newStatus));
  };

  const handleTuneLatency = (id: string, val: number) => {
    tuningSynth.playSlide(val, 200);
    const next = { ...localNodesStatus };
    next[id].latency = val;
    saveLocalNodes(next);
  };

  const handleTuneStatus = (id: string, stat: string) => {
    tuningSynth.playLockAll();
    const next = { ...localNodesStatus };
    next[id].status = stat;
    saveLocalNodes(next);
    onTerminalLog(`ALIGNMENT: Overrode Node ${id.toUpperCase()} profile status parameters to ${stat}.`);
  };

  const executeLockAll = async () => {
    tuningSynth.playLockAll();
    await onToggleUniversalLock();
    onTerminalLog('SECURITY_LOCK: Sealed and initialized immutable ledger blocks on 12 sibling enclaves.');
  };

  // Re-calibrates acoustic and global clocks for high integration
  const triggerReCalibration = () => {
    const fVal = Number(calibrationBase);
    tuningSynth.playAcousticChime(fVal);
    
    onTerminalLog(`TUNER: Initiated advanced high-integrity calibration sweep [${calibrationBase}Hz Reference]`);
    if (swarmStats) {
      setSwarmStats({
        ...swarmStats,
        velocity: swarmStats.velocity ? swarmStats.velocity + 0.3 : 1.9,
        active_peers: swarmStats.active_peers ? swarmStats.active_peers + 15 : 30
      });
    }
  };

  const toggleLocalMute = () => {
    tuningSynth.mute = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
  };

  const nodeNamesList = [
    { key: 'node-1', name: 'jhammerz.github.io', type: 'Primary Canonical Head' },
    { key: 'node-2', name: 'tiktok.com/@jhammerzz', type: 'Viral Stream Socket' },
    { key: 'node-3', name: 'linkedin.com/in/JHammerZ', type: 'Authority Core ID' },
    { key: 'node-4', name: 'youtube.com/@JHammerZ', type: 'Audio-Video Matrix' },
    { key: 'node-5', name: 'instagram.com/jhammerzz', type: 'Visual Micro-Stream' },
    { key: 'node-6', name: 'facebook.com/JHammerzz', type: 'Social Validation Hub' },
    { key: 'node-7', name: 'jhammerz.carrd.co', type: 'Direct Traffic Lander' },
    { key: 'node-8', name: 'amazon.music/jhammerz', type: 'Amazon Sound Stream' },
    { key: 'node-9', name: 'apple.music/jhammerz', type: 'Apple Sound Stream' },
    { key: 'node-10', name: 'bandlab.com/jhammerz', type: 'Interactive Audio Box' },
    { key: 'node-11', name: 'xiaohongshu/jhammerz', type: 'Global Vector Head' },
    { key: 'node-12', name: 'github.com/JHammerZ/jhammerz.github.io', type: 'Sovereign Code Base' },
    { key: 'node-13', name: 'impact.com/secure', type: 'Consolidated Value Ingress' },
    { key: 'node-14', name: 'spotify.artist/7vRd2', type: 'Interactive Archive Socket' }
  ];

  // Dynamic SVG Wave path builder depending on state parameters
  const getSpectrumWavePath = () => {
    const fhz = Number(calibrationBase);
    const amp = 15 + (vocalResonance / 100) * 15;
    const waveCount = fhz === 528 ? 6 : fhz === 440 ? 5 : 4;
    
    let path = `M 0 32`;
    for (let x = 0; x <= 220; x += 2) {
      const angle = (x / 220) * Math.PI * 2 * waveCount + (oscillateState * (Math.PI / 180) * 3);
      const y = 32 + Math.sin(angle) * amp;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div 
      className="bg-[#040407]/95 border-2 border-sovereign-line relative rounded-lg p-5 space-y-6 shadow-[0_0_35px_rgba(0,0,0,0.85)] text-white overflow-hidden" 
      id="sovereign-tuner-panel"
    >
      {/* Visual background overlays */}
      <div className="absolute inset-0 bg-[#0e0d12]/20 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none z-30" />
      <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-400/5 blur-3xl rounded-full pointer-events-none" />

      {/* Grid header area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-sovereign-line pb-4 gap-4 relative z-20">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-pink-500/10 p-1.5 rounded border border-pink-500/40 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-pink-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black font-mono tracking-[0.22em] text-white uppercase">
                SOVEREIGN ADVANCED ALIGNMENT &amp; RESILIENCE TUNER [V1.8]
              </h3>
              <p className="text-[9.5px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                Global 14-Node Port Interconnect Vector Matrices &amp; Cryptonode Calibration Area
              </p>
            </div>
          </div>
        </div>

        {/* Universal stabilization seal trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={executeLockAll}
            className="w-full md:w-auto px-4 py-2 border-2 border-sovereign-neon bg-sovereign-neon/15 hover:bg-sovereign-neon hover:text-black hover:border-sovereign-neon transition-all text-[9.5px] font-mono text-sovereign-neon font-black uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.25)] rounded-md relative group/btn"
          >
            {/* Hover Tooltip */}
            <div className="absolute opacity-0 group-hover/btn:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 text-[10px] p-3 rounded shadow-[0_4px_20px_rgba(0,0,0,0.8)] w-64 z-50 pointer-events-none transition-all duration-300 bottom-[125%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/btn:scale-100 normal-case select-none">
              <div className="flex items-center gap-1.5 mb-1.5 border-b border-white/5 pb-1 font-mono tracking-wider font-extrabold text-[9px] text-sovereign-neon">
                <span>✦ LOCK ALIGN SYSTEM</span>
                <span className="ml-auto text-sovereign-neon text-[10px] font-bold">?</span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans leading-normal">Synchronizes sitemaps, indexing priorities, and local configurations globally with extreme high-integrity authority lock.</p>
            </div>

            <Lock className="w-3.5 h-3.5" />
            LOCK-ALIGN ALL SIBLING CLIENT NODES FOREVER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        
        {/* Left Tuning parameters column */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-black/60 border border-sovereign-line/50 p-4 rounded-lg space-y-4">
            <h4 className="text-[9.5px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              Swarm Hardware &amp; Deep-Thread Allocation
            </h4>

            {/* Daemon swarm controller */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9.5px] font-mono">
                <span className="text-gray-450 uppercase font-bold">C++ Direct Threading Pool Allocation</span>
                <span className="text-cyan-400 font-extrabold">{threadsPerSilo} DEPT CORE_DAEMONS</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                value={threadsPerSilo} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setThreadsPerSilo(val);
                  tuningSynth.playSlide(val, 500);
                  if (val % 20 === 0) {
                    onTerminalLog(`TUNER: Distributed ${val} active daemon processes inside Lysander VM core.`);
                  }
                }}
                className="w-full xl:accent-cyan-400 bg-black border border-white/10 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[7.5px] text-gray-500 font-mono uppercase block leading-relaxed">
                Allocates direct high-fidelity processing cores to the background database reconciler threads.
              </span>
            </div>

            {/* Bandwidth cap override */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9.5px] font-mono">
                <span className="text-gray-450 uppercase font-bold">CDN Bandwidth Resource Quota</span>
                <span className="text-sovereign-neon font-extrabold">{bandwidthQuota}% ALLOC</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                step="0.1"
                value={bandwidthQuota} 
                onChange={(e) => {
                  setBandwidthQuota(Number(e.target.value));
                  tuningSynth.playSlide(Number(e.target.value), 100);
                }}
                className="w-full xl:accent-sovereign-neon bg-black border border-white/10 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[7.5px] text-gray-500 font-mono uppercase block leading-relaxed">
                Manages dedicated CDN server cache allocation speeds to prevent bandwidth throttling.
              </span>
            </div>
          </div>

          <div className="bg-black/60 border border-sovereign-line/50 p-4 rounded-lg space-y-4">
            <h4 className="text-[9.5px] font-mono font-black text-pink-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Volume2 className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              Global Acoustic Spectrum &amp; Harmonic Calibration
            </h4>

            {/* Live Holographic Acoustic Spectrum Range */}
            <div className="p-3 bg-black/80 border border-white/5 rounded-md flex justify-between items-center h-20 overflow-hidden relative">
              <div className="min-w-0 flex flex-col justify-between h-full">
                <span className="text-[9px] font-mono font-black text-white uppercase block leading-none">
                  Reference Frequency: {calibrationBase} Hz
                </span>
                <span className="text-[7.5px] font-mono text-gray-400 uppercase leading-relaxed block pr-2">
                  Harmonics alignment is verified optimal for human auditory resonance.
                </span>
              </div>
              <div className="w-[110px] h-14 border border-white/15 bg-[#020204] rounded p-1 flex items-center justify-center relative">
                <svg className="w-full h-full absolute inset-0">
                  <path
                    d={getSpectrumWavePath()}
                    fill="none"
                    stroke="#ff007f"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="absolute right-1.5 top-1 px-1 bg-pink-500/35 border border-pink-500/60 rounded text-[5px] font-mono font-black leading-none text-white uppercase">
                  MONITORING_PULSE
                </span>
              </div>
            </div>

            {/* Harmonic Frequency Anchor Selection */}
            <div className="space-y-2">
              <label className="text-[8.5px] font-mono text-gray-405 uppercase block">Acoustic Reference Standard</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: '432', label: '432 Hz Pythagorean', desc: 'Natural aura vibration base pitch.' },
                  { value: '440', label: '440 Hz ISO', desc: 'Standard modern western reference pitch.' },
                  { value: '528', label: '528 Hz Solfeggio', desc: 'Soma restoration resonance frequency.' }
                ].map((hz) => (
                  <button
                    key={hz.value}
                    type="button"
                    onClick={() => {
                      setCalibrationBase(hz.value);
                      tuningSynth.playAcousticChime(Number(hz.value));
                      onTerminalLog(`ACOUSTIC: Re-calibrated global integration frequency base pitch to ${hz.value}Hz.`);
                    }}
                    className={`p-1.5 border text-center transition-all cursor-pointer rounded-md relative group/hz ${
                      calibrationBase === hz.value
                        ? 'border-pink-500 bg-pink-500/15 text-pink-500 font-bold shadow-[0_0_8px_#ff007f]'
                        : 'border-white/10 bg-black/25 text-gray-500 hover:border-pink-500/40 hover:text-pink-300'
                    }`}
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute opacity-0 group-hover/hz:opacity-100 bg-[#121216]/95 border border-pink-500/40 text-gray-300 text-[9px] p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-44 z-50 pointer-events-none transition-all duration-300 bottom-[115%] left-1/2 -translate-x-1/2 text-left font-mono leading-relaxed scale-95 group-hover/hz:scale-100 normal-case select-none">
                      <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-pink-500 font-black">
                        <span>PITCH REF</span>
                        <span className="ml-auto text-[9px]">?</span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-sans leading-normal">{hz.desc}</p>
                    </div>

                    <span className="text-[10px] font-mono block font-black">{hz.value} Hz</span>
                    <span className="text-[6px] uppercase tracking-tighter block text-gray-500">{hz.value === '432' ? 'Natural Aura' : hz.value === '440' ? 'Standard Modern' : 'Soma Restore'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acoustic sound range sliders */}
            <div className="space-y-3 pt-1">
              {/* Vocal Octave range coefficient */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-gray-400 font-bold uppercase">Acoustic Sustained Resonance</span>
                  <span className="text-pink-400 font-black">{octaveSustainer} OCTAVES</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="12" 
                  step="0.1"
                  value={octaveSustainer} 
                  onChange={(e) => {
                    setOctaveSustainer(Number(e.target.value));
                    tuningSynth.playSlide(Number(e.target.value), 12);
                  }}
                  className="w-full xl:accent-pink-500 bg-black border border-white/5 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Vocal resonance booster slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-gray-400 font-bold uppercase">Harmonic Resonance Ratio</span>
                  <span className="text-pink-400 font-black">{vocalResonance}% Focus Amplitude</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={vocalResonance} 
                  onChange={(e) => {
                    setVocalResonance(Number(e.target.value));
                    tuningSynth.playSlide(Number(e.target.value), 100);
                  }}
                  className="w-full xl:accent-pink-500 bg-black border border-white/5 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Piano acoustic pitch seal toggle */}
              <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
                <span className="text-[9px] font-mono text-gray-400 uppercase block">Persistent Acoustic Notes Seal</span>
                <button
                  type="button"
                  onClick={() => {
                    tuningSynth.playLockAll();
                    onToggleNotesPermanentLock(!notesPermanentLock);
                  }}
                  className={`px-3 py-1 text-[8.5px] font-mono uppercase tracking-widest font-black transition-all border rounded-md cursor-pointer relative group/notes ${
                    notesPermanentLock 
                      ? 'border-pink-500 bg-pink-500/10 text-pink-500 shadow-[0_0_6px_#ff007f]' 
                      : 'border-white/10 bg-black/25 text-gray-500 hover:border-pink-500'
                  }`}
                >
                  {/* Hover Tooltip */}
                  <div className="absolute opacity-0 group-hover/notes:opacity-100 bg-[#121216]/95 border border-pink-500/40 text-gray-300 text-[9px] p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none transition-all duration-300 bottom-[115%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/notes:scale-100 normal-case select-none">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-pink-500 font-black uppercase">
                      <span>HARMONICS LOCK</span>
                      <span className="ml-auto text-[9px]">?</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans leading-normal">Forces ongoing audio chords, synthesizers, and harmonics to resonate indefinitely in the background.</p>
                  </div>

                  {notesPermanentLock ? 'SEALED FOREVER' : 'UNSEALED'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black/60 border border-sovereign-line/50 p-4 rounded-lg space-y-4">
            <h4 className="text-[10px] font-mono font-black text-sovereign-neon uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Binary className="w-3.5 h-3.5 text-sovereign-neon animate-pulse" />
              Cryptographic Ledger Sealer Config
            </h4>

            {/* Verification Algorithm Selection */}
            <div className="space-y-1.5">
              <label className="text-[8.5px] font-mono text-gray-450 uppercase block">Global Cryptographic Integrity Engine</label>
              <select 
                value={selectedAlg} 
                onChange={(e) => {
                  setSelectedAlg(e.target.value);
                  tuningSynth.playLockAll();
                  onTerminalLog(`SECURITY_LEDGER: Primary system verification algorithm upgraded to ${e.target.value}`);
                }}
                className="w-full bg-[#030304]/90 text-sovereign-neon border border-sovereign-neon/40 p-2 text-xs font-mono focus:outline-none focus:border-sovereign-neon rounded-md uppercase"
              >
                <option value="Ed25519-EdDSA">Ed25519 EdDSA Master Sign (Canonical)</option>
                <option value="HMAC-SHA512">HMAC-SHA512 Cryptic Double Hash</option>
                <option value="RSA-4096">RSA-4096 Master Root Key Exchange</option>
                <option value="AES-256-GCM">AES-256-GCM SFS Air-Gapped Seal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[8.5px] font-mono text-gray-400">
              <div className="p-2 border border-white/10 bg-[#030305] rounded-md">
                <span className="block text-gray-500 uppercase leading-none font-bold">REDUNDANCY SPREAD</span>
                <span className="text-white font-bold text-[9.5px] block mt-1 uppercase">{redundancyLevel}X CORE CLONES</span>
                <input 
                  type="range" 
                  min="2" 
                  max="8" 
                  value={redundancyLevel} 
                  onChange={(e) => {
                    setRedundancyLevel(Number(e.target.value));
                    tuningSynth.playSlide(Number(e.target.value), 8);
                  }}
                  className="w-full xl:accent-white bg-black h-1 mt-1.5 rounded cursor-pointer"
                />
              </div>
              <div className="p-3 border border-white/10 bg-[#030305] rounded-md flex flex-col justify-between">
                <div>
                  <span className="block text-gray-500 uppercase leading-none font-bold">SESSION TOKEN EXPIRY</span>
                  <span className="text-white font-bold text-[9.5px] block mt-1 uppercase">IMMUTABLE_BLOCK</span>
                </div>
                <div className="text-[7px] uppercase text-sovereign-neon tracking-[0.1em] font-black">CONTINUOUS OK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 14-Node detailed interactive matrix column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-black/60 border border-sovereign-line/50 p-4 rounded-lg h-full space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                <h4 className="text-[9.5px] font-mono font-black text-sovereign-neon uppercase tracking-widest flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-sovereign-neon animate-spin-slow" />
                  Socioeconomic Direct Node Realignment Area
                </h4>
                <button
                  type="button"
                  onClick={triggerReCalibration}
                  className="px-3 py-1 text-[8.5px] font-mono font-black uppercase text-sovereign-neon border border-sovereign-neon/40 hover:bg-sovereign-neon/15 hover:border-sovereign-neon/100 transition-colors rounded-md cursor-pointer shadow-[0_0_12px_rgba(0,255,65,0.15)] relative group/clocks"
                >
                  {/* Hover Tooltip */}
                  <div className="absolute opacity-0 group-hover/clocks:opacity-100 bg-[#121216]/95 border border-sovereign-neon/40 text-gray-300 text-[9px] p-2 rounded shadow-[0_4px_15px_rgba(0,0,0,0.8)] w-48 z-50 pointer-events-none transition-all duration-300 bottom-[115%] right-0 text-left font-mono leading-relaxed scale-95 group-hover/clocks:scale-100 normal-case select-none">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-0.5 mb-1 text-sovereign-neon font-black uppercase">
                      <span>PHASE SYNC</span>
                      <span className="ml-auto text-[9px]">?</span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-sans leading-normal">Resets phase offset signals and latency timers across all 14 active sitemap distribution nodes.</p>
                  </div>

                  Recalibrate Phase Clocks
                </button>
              </div>
              
              <p className="text-[8.5px] text-gray-400 uppercase font-mono leading-relaxed">
                Tune target ping offsets, align system lockstates, or manually deploy customized bypass tokens over the 14 active connection lines.
              </p>

              {/* 14 individual rows representing the nodes */}
              <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1.5 scrollbar-thin scrollbar-thumb-gray-800">
                {nodeNamesList.map((node, i) => {
                  const nodeState = localNodesStatus[node.key] || { latency: 15, status: 'SECURED_PERMANENT', cdnSpeed: 99 };
                  return (
                    <div 
                      key={node.key} 
                      className="p-2.5 border border-white/10 bg-[#020204]/90 hover:bg-black/90 hover:border-sovereign-neon/40 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all group/node relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-0.5 font-mono text-[5.5px] text-gray-800 uppercase pointer-events-none">
                        PORT_{(idx => idx < 10 ? '0' + idx : idx)(i + 1)}
                      </div>
                      <div className="flex items-start gap-2.5 max-w-[50%]">
                        <span className="text-[8px] font-mono font-black bg-sovereign-neon/15 text-sovereign-neon px-2 py-0.5 rounded leading-none mt-0.5 border border-sovereign-neon/30">
                          S{(i + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-mono font-bold text-white block truncate leading-tight group-hover/node:text-sovereign-neon transition-colors select-all">
                            {node.name}
                          </span>
                          <span className="text-[7px] font-mono text-gray-500 block uppercase tracking-tight truncate leading-none mt-1">
                            {node.type}
                          </span>
                        </div>
                      </div>

                      {/* Controls Area for individual components */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        
                        {/* Status override dropdown */}
                        <select
                          value={nodeState.status}
                          onChange={(e) => handleTuneStatus(node.key, e.target.value)}
                          className="bg-black text-[8px] font-mono border border-white/15 text-gray-300 p-1 rounded focus:outline-none focus:border-sovereign-neon uppercase cursor-pointer"
                        >
                          <option value="SECURED_PERMANENT">PERMANENT_SEAL</option>
                          <option value="ALIGNED_T0">ALIGNED_T0</option>
                          <option value="ACTIVE_MESH">ACTIVE_MESH</option>
                          <option value="CDN_MIRROR_OK">CDN_MIRROR_OK</option>
                        </select>

                        {/* Connection speed metric slider */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[6.5px] font-mono text-gray-500 uppercase">PING:</span>
                          <input
                            type="range"
                            min="1"
                            max="200"
                            value={nodeState.latency}
                            onChange={(e) => handleTuneLatency(node.key, Number(e.target.value))}
                            className="w-14 sm:w-16 xl:accent-cyan-400 bg-black h-1 rounded cursor-pointer"
                          />
                          <span className="text-[8px] font-mono text-cyan-400 font-extrabold w-8 text-right">
                            {nodeState.latency}ms
                          </span>
                        </div>

                        {/* Interactive Status Indicator LED */}
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            nodeState.latency < 25 ? 'bg-sovereign-neon' : 'bg-cyan-400'
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            nodeState.latency < 25 ? 'bg-sovereign-neon' : 'bg-cyan-400'
                          }`}></span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <span>14 DIRECT NETWORK INTERCONNECT PORTS COMPILING SEALS</span>
              </div>
              <div className="text-right text-sovereign-neon font-black shadow-inner animate-pulse">
                ACTIVE COGNITION SECURED • MESH STABILITY IN 2ms
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
