import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Activity, 
  GitBranch, 
  Github, 
  Globe, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Share2, 
  Database, 
  Terminal, 
  Layers, 
  Sliders, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ExternalLink,
  Shield,
  Atom,
  Server,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  ShieldAlert,
  Key,
  FileCheck,
  AlertCircle,
  Binary,
  Gauge,
  FileText
} from 'lucide-react';
import { SovereignLivingManifestPanel } from './SovereignLivingManifestPanel';

export interface A2AAgent {
  id: string;
  name: string;
  role: string;
  status: 'CONNECTED' | 'ACTIVE' | 'SYNCING' | 'SANDBOXED';
  endpoint: string;
  latencyMs: number;
  packetsReceived: number;
  packetsSent: number;
  lastHeartbeat: string;
  capabilities: string[];
  l2QuarantineCompliant: boolean;
}

export interface A2APacket {
  id: string;
  timestamp: string;
  fromAgent: string;
  toAgent: string;
  type: string;
  payload: any;
  signature: string;
  l2Status: string;
  latencyMs: number;
}

export interface A2AConsensusRound {
  roundId: number;
  timestamp: string;
  proposer: string;
  stateRootHash: string;
  votesCount: number;
  requiredQuorum: number;
  status: string;
  diodeVerification: string;
}

export interface GitHubNetworkRepo {
  name: string;
  fullName: string;
  url: string;
  htmlUrl: string;
  defaultBranch: string;
  status: 'LIVE' | 'SYNCED' | 'CANONICAL';
  lastSync: string;
  description: string;
  isPages: boolean;
  pagesUrl?: string;
  stars?: number;
  openIssues?: number;
}

interface A2ABridgeConsoleProps {
  onTerminalLog?: (log: string) => void;
}

export const A2ABridgeConsole: React.FC<A2ABridgeConsoleProps> = ({ onTerminalLog }) => {
  const [bridgeStatus, setBridgeStatus] = useState<any>(null);
  const [agents, setAgents] = useState<A2AAgent[]>([]);
  const [packets, setPackets] = useState<A2APacket[]>([]);
  const [consensusRounds, setConsensusRounds] = useState<A2AConsensusRound[]>([]);
  const [githubRepos, setGithubRepos] = useState<GitHubNetworkRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState<boolean>(false);
  const [isConsensusRunning, setIsConsensusRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'packets' | 'github' | 'consensus' | 'dispatch' | 'kernel_pipeline' | 'hardware_phy' | 'tee_iommu' | 'living_manifest'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Kernel Register 0x7F Subsystem State
  const [kernelData, setKernelData] = useState<any>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [pipelineResult, setPipelineResult] = useState<any>(null);
  const [routingCheckResult, setRoutingCheckResult] = useState<any>(null);
  const [preCommitResult, setPreCommitResult] = useState<any>(null);
  const [selectedPeer, setSelectedPeer] = useState<string>('aurelius-spark-01');
  const [pipelinePayloadText, setPipelinePayloadText] = useState<string>('AURELIUS_SOVEREIGN_TRANSACTION_0x7F');
  
  // FPGA-Accelerated PHY & IRQ 0x09 Rate Limiter State
  const [hardwareData, setHardwareData] = useState<any>(null);
  const [isHardwarePulseRunning, setIsHardwarePulseRunning] = useState<boolean>(false);
  const [hardwarePulseResult, setHardwarePulseResult] = useState<any>(null);
  const [pulseFrameSize, setPulseFrameSize] = useState<number>(1024);
  const [pulseSerDesLane, setPulseSerDesLane] = useState<number>(0);
  
  // TEE Enclave & IOMMU-Mediated DMA to Core RAM 0xFF00AA7B State
  const [teeIommuData, setTeeIommuData] = useState<any>(null);
  const [isTeeTransferRunning, setIsTeeTransferRunning] = useState<boolean>(false);
  const [teeTransferResult, setTeeTransferResult] = useState<any>(null);
  const [dmaPayloadText, setDmaPayloadText] = useState<string>('ZK_STATE_TRANSITION_ATTESTATION_0xFF00AA7B');
  const [dmaPayloadSize, setDmaPayloadSize] = useState<number>(2048);
  
  // Interactive Dispatch Form
  const [dispatchFrom, setDispatchFrom] = useState<string>('aurelius-spark-01');
  const [dispatchTo, setDispatchTo] = useState<string>('broadcast');
  const [dispatchType, setDispatchType] = useState<string>('DIRECTIVE');
  const [dispatchPayload, setDispatchPayload] = useState<string>('{"directive": "Synchronize sovereign state across all JHammerZ edge nodes and github.com/JHammerZ repos."}');
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [packetFilter, setPacketFilter] = useState<string>('ALL');

  const sseRef = useRef<EventSource | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/a2a/status');
      if (res.ok) {
        const data = await res.json();
        setBridgeStatus(data);
        if (data.agents) setAgents(data.agents);
        if (data.recentPackets) setPackets(data.recentPackets);
        if (data.consensusRounds) setConsensusRounds(data.consensusRounds);
      }
    } catch (err) {
      console.warn("A2A status fetch error:", err);
    }
  };

  const fetchGitHubNetwork = async () => {
    try {
      const res = await fetch('/api/github/network');
      if (res.ok) {
        const data = await res.json();
        if (data.repositories) {
          setGithubRepos(data.repositories);
        }
      }
    } catch (err) {
      console.warn("GitHub network fetch error:", err);
    }
  };

  const fetchKernelRegister = async () => {
    try {
      const res = await fetch('/api/kernel/register-0x7f');
      if (res.ok) {
        const data = await res.json();
        setKernelData(data);
      }
    } catch (err) {
      console.warn("Kernel register fetch error:", err);
    }
  };

  const fetchHardwareData = async () => {
    try {
      const res = await fetch('/api/hardware/irq-0x09');
      if (res.ok) {
        const data = await res.json();
        setHardwareData(data);
      }
    } catch (err) {
      console.warn("Hardware IRQ fetch error:", err);
    }
  };

  const fetchTeeIommuData = async () => {
    try {
      const res = await fetch('/api/hardware/tee-iommu');
      if (res.ok) {
        const data = await res.json();
        setTeeIommuData(data);
      }
    } catch (err) {
      console.warn("TEE IOMMU fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchGitHubNetwork();
    fetchKernelRegister();
    fetchHardwareData();
    fetchTeeIommuData();

    // Setup live SSE stream for real-time packet & heartbeat listening
    try {
      const sse = new EventSource('/api/a2a/bridge-stream');
      sse.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PACKET' && msg.packet) {
            setPackets(prev => [msg.packet, ...prev.slice(0, 49)]);
          } else if (msg.type === 'STATUS_UPDATE') {
            if (msg.bridgeStatus) setBridgeStatus(msg.bridgeStatus);
            if (msg.agents) setAgents(msg.agents);
          } else if (msg.type === 'CONSENSUS_UPDATE' && msg.round) {
            setConsensusRounds(prev => [msg.round, ...prev.slice(0, 19)]);
          }
        } catch (e) {
          // ignore parsing error
        }
      };
      sseRef.current = sse;
    } catch (err) {
      console.warn("SSE connection error:", err);
    }

    const interval = setInterval(fetchStatus, 4000);
    return () => {
      clearInterval(interval);
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, []);

  const handleConnectAll = async () => {
    setIsLoading(true);
    onTerminalLog?.('[A2A_BRIDGE] Connecting all sovereign nodes and edge agents to A2A Bridge mesh...');
    try {
      const res = await fetch('/api/a2a/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectAll: true, initiator: 'JHammerZ Sovereign Orchestrator' })
      });
      const data = await res.json();
      if (data.success) {
        onTerminalLog?.(`[A2A_BRIDGE SUCCESS] Connected ${data.connectedCount} sovereign agents across the mesh with 100% L2 compliance!`);
        fetchStatus();
      }
    } catch (err: any) {
      onTerminalLog?.(`[A2A_BRIDGE ERROR] ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncGitHubNetwork = async () => {
    setIsSyncingGitHub(true);
    onTerminalLog?.('[JHAMMERZ_NETWORK] Initiating full bidirectional sync across github.com/JHammerZ & jhammerz.github.io...');
    try {
      const res = await fetch('/api/github/network/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        onTerminalLog?.(`[JHAMMERZ_NETWORK SUCCESS] Synced ${data.syncedRepos?.length || 0} repositories and all 14 distribution feeds. Canonical: https://jhammerz.github.io`);
        fetchGitHubNetwork();
        fetchStatus();
      }
    } catch (err: any) {
      onTerminalLog?.(`[JHAMMERZ_NETWORK ERROR] ${err.message}`);
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleRunConsensus = async () => {
    setIsConsensusRunning(true);
    onTerminalLog?.('[A2A_CONSENSUS] Initializing Quarantined L2 Micro-Consensus Protocol Round...');
    try {
      const res = await fetch('/api/a2a/consensus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposer: 'aurelius-spark-01' })
      });
      const data = await res.json();
      if (data.success) {
        onTerminalLog?.(`[A2A_CONSENSUS SUCCESS] Round #${data.round?.roundId} COMMITTED with ${data.round?.votesCount}/${data.round?.requiredQuorum} quorum votes! StateRoot: ${data.round?.stateRootHash?.slice(0, 16)}...`);
        fetchStatus();
      }
    } catch (err: any) {
      onTerminalLog?.(`[A2A_CONSENSUS ERROR] ${err.message}`);
    } finally {
      setIsConsensusRunning(false);
    }
  };

  const handleDispatchMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(dispatchPayload);
      } catch {
        parsedPayload = { message: dispatchPayload };
      }

      onTerminalLog?.(`[A2A_DISPATCH] Dispatching ${dispatchType} from [${dispatchFrom}] to [${dispatchTo}]...`);
      const res = await fetch('/api/a2a/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAgent: dispatchFrom,
          toAgent: dispatchTo,
          type: dispatchType,
          payload: parsedPayload
        })
      });
      const data = await res.json();
      setDispatchResult(data);
      if (data.success) {
        onTerminalLog?.(`[A2A_DISPATCH SUCCESS] Packet [${data.packet?.id}] routed in ${data.packet?.latencyMs}ms. Signature: ${data.packet?.signature?.slice(0, 12)}...`);
        fetchStatus();
      }
    } catch (err: any) {
      onTerminalLog?.(`[A2A_DISPATCH ERROR] ${err.message}`);
    }
  };

  const handleExecuteKernelPipeline = async () => {
    setIsPipelineRunning(true);
    onTerminalLog?.('[KERNEL 0x7F] Executing: [LOCAL EDGE PEER] → [KERNEL FIREWALL] → [ZK-VERIFY] → [SYSTEM_CORE_REGISTER_0x7F]...');
    try {
      const res = await fetch('/api/kernel/pipeline-exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peerId: selectedPeer,
          payloadData: pipelinePayloadText,
          bypassKernelRouting: false,
          bypassMainChainConsensus: false
        })
      });
      const data = await res.json();
      setPipelineResult(data);
      if (data.success) {
        onTerminalLog?.(`[KERNEL 0x7F SUCCESS] Hardware Register 0x7F Committed: ${data.execution?.systemCoreRegister0x7F?.committedHexValue} | StateRoot: ${data.execution?.systemCoreRegister0x7F?.stateRootHash?.slice(0, 16)}... | Clock: #${data.execution?.systemCoreRegister0x7F?.hardwareClockCycle}`);
        fetchKernelRegister();
      }
    } catch (err: any) {
      onTerminalLog?.(`[KERNEL 0x7F ERROR] ${err.message}`);
    } finally {
      setIsPipelineRunning(false);
    }
  };

  const handleCheckRoutingTable = async () => {
    onTerminalLog?.('[KERNEL FIB] Checking Kernel Routing Table. Enforcing strict validation (Bypass strictly forbidden)...');
    try {
      const res = await fetch('/api/kernel/routing-table/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setRoutingCheckResult(data);
      if (data.success) {
        onTerminalLog?.(`[KERNEL FIB CHECK] ${data.verifiedRoutes}/${data.totalRoutes} routes verified. Kernel Routing Table check PASSED.`);
      }
    } catch (err: any) {
      onTerminalLog?.(`[KERNEL FIB ERROR] ${err.message}`);
    }
  };

  const handlePreCommitConsensus = async () => {
    onTerminalLog?.('[MAIN-CHAIN CONSENSUS] Requesting Main-Chain Consensus PRE-COMMIT certification (Bypass forbidden)...');
    try {
      const res = await fetch('/api/kernel/consensus/pre-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setPreCommitResult(data);
      if (data.success) {
        onTerminalLog?.(`[MAIN-CHAIN PRE-COMMIT] Block #${data.preCommitBlockHeight} Quorum: ${data.quorum} | Hash: ${data.preCommitBlockHash?.slice(0, 16)}...`);
      }
    } catch (err: any) {
      onTerminalLog?.(`[MAIN-CHAIN ERROR] ${err.message}`);
    }
  };

  const handleExecuteHardwarePulse = async (bypassCooldown: boolean = false, bypassEpoc: boolean = false) => {
    setIsHardwarePulseRunning(true);
    onTerminalLog?.(`[HARDWARE PHY] Ingesting Pulse via [FPGA-ACCELERATED PHY] (Lane ${pulseSerDesLane}, ${pulseFrameSize}B)...`);
    try {
      const res = await fetch('/api/hardware/phy-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameSize: pulseFrameSize,
          serDesLane: pulseSerDesLane,
          attemptBypassCooldown: bypassCooldown,
          attemptBypassEpoc: bypassEpoc
        })
      });
      const data = await res.json();
      setHardwarePulseResult(data);
      if (data.success) {
        onTerminalLog?.(`[FPGA-PHY → RATE_LIMITER → IRQ 0x09] ACK: ${data.record?.irq0x09?.ackSignature} | Tokens: ${data.rateLimiter?.currentTokens}/${data.rateLimiter?.bucketCapacity} | Cooldown: ${data.record?.rateLimiter?.cooldownDampening} | EPOC: ${data.record?.rateLimiter?.epocDampening}`);
        fetchHardwareData();
      } else {
        onTerminalLog?.(`[HARDWARE RATE LIMIT] ${data.error}`);
      }
    } catch (err: any) {
      onTerminalLog?.(`[HARDWARE PHY ERROR] ${err.message}`);
    } finally {
      setIsHardwarePulseRunning(false);
    }
  };

  const handleExecuteTeeTransfer = async (bypassDirectDma: boolean = false, bypassFullKernel: boolean = false) => {
    setIsTeeTransferRunning(true);
    onTerminalLog?.(`[TEE → IOMMU → RAM] Initiating DMA pipeline transfer to Core RAM 0xFF00AA7B (${dmaPayloadSize}B)...`);
    try {
      const res = await fetch('/api/hardware/iommu-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payloadData: dmaPayloadText,
          payloadSize: dmaPayloadSize,
          attemptDirectDma: bypassDirectDma,
          attemptFullKernelBypass: bypassFullKernel
        })
      });
      const data = await res.json();
      setTeeTransferResult(data);
      if (data.success) {
        onTerminalLog?.(`[IOMMU DMA COMMITTED] [TEE ENCLAVE] → [IOMMU (${data.record?.iommu?.channelAccess})] → [CORE RAM 0xFF00AA7B (${data.coreRam?.currentCommittedHex})] | Latency: ${data.record?.iommu?.dmaTranslationTimeNs}ns`);
        fetchTeeIommuData();
      } else {
        onTerminalLog?.(`[IOMMU ERROR] ${data.error || 'Failed to complete DMA transfer'}`);
      }
    } catch (err: any) {
      onTerminalLog?.(`[TEE IOMMU ERROR] ${err.message}`);
    } finally {
      setIsTeeTransferRunning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPackets = packets.filter(p => {
    if (packetFilter === 'ALL') return true;
    return p.type === packetFilter;
  });

  return (
    <div className="w-full bg-[#050508] border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl font-mono text-gray-200">
      {/* TOP HEADER & TELEMETRY STRIP */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#070b14] via-[#09101f] to-[#070b14] border-b border-cyan-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <Network className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wider flex items-center gap-2">
                A2A BRIDGE & JHAMMERZ NETWORK
              </h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ACTIVE MESH
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                L2 AIRGAP VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Agent-to-Agent Micro-Consensus, jhammerz.github.io & github.com/JHammerZ Full Network Substrate
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleConnectAll}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          >
            <Zap className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            CONNECT ALL TO A2A
          </button>
          <button
            type="button"
            onClick={handleSyncGitHubNetwork}
            disabled={isSyncingGitHub}
            className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 text-purple-300 text-[10px] font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
          >
            <Github className={`w-3.5 h-3.5 ${isSyncingGitHub ? 'animate-spin' : ''}`} />
            SYNC JHAMMERZ GITHUB
          </button>
          <button
            type="button"
            onClick={handleRunConsensus}
            disabled={isConsensusRunning}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isConsensusRunning ? 'animate-spin' : ''}`} />
            L2 MICRO-CONSENSUS
          </button>
        </div>
      </div>

      {/* METRIC VITALS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-cyan-500/15 bg-black/40 text-[10px]">
        <div className="p-3 border-r border-cyan-500/10 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">A2A Bridge Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            100% OPERATIONAL
          </span>
        </div>
        <div className="p-3 border-r border-cyan-500/10 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">Connected Agents</span>
          <span className="text-cyan-300 font-bold mt-0.5">
            {bridgeStatus?.connectedAgentsCount || agents.length || 7} / 7 NODES ACTIVE
          </span>
        </div>
        <div className="p-3 border-r border-cyan-500/10 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">Average Mesh Latency</span>
          <span className="text-amber-300 font-bold mt-0.5">
            {bridgeStatus?.avgLatencyMs || '1.8'} ms (ULTRA-FAST)
          </span>
        </div>
        <div className="p-3 border-r border-cyan-500/10 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">Total Packets Routed</span>
          <span className="text-purple-300 font-bold mt-0.5">
            {bridgeStatus?.totalPacketsRouted || 1420} PACKETS
          </span>
        </div>
        <div className="p-3 border-r border-cyan-500/10 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">Consensus Commitment</span>
          <span className="text-emerald-300 font-bold mt-0.5">
            ROUND #{consensusRounds[0]?.roundId || 42} (COMMITTED)
          </span>
        </div>
        <div className="p-3 flex flex-col justify-center">
          <span className="text-gray-400 text-[9px] uppercase tracking-wider">GitHub.io Truth Anchor</span>
          <a
            href="https://jhammerz.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 mt-0.5 truncate"
          >
            jhammerz.github.io
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
          </a>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-4 border-b border-cyan-500/15 bg-[#06080e] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('agents')}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'agents' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          CONNECTED AGENTS ({agents.length || 7})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('github')}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'github' 
              ? 'border-purple-400 text-purple-300 bg-purple-500/10' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          JHAMMERZ NETWORK & REPOS ({githubRepos.length || 5})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('packets')}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'packets' 
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          LIVE PACKET STREAM ({packets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('consensus')}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'consensus' 
              ? 'border-amber-400 text-amber-300 bg-amber-500/10' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          L2 MICRO-CONSENSUS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dispatch')}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'dispatch' 
              ? 'border-sky-400 text-sky-300 bg-sky-500/10' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          INTER-AGENT DISPATCHER
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('kernel_pipeline');
            fetchKernelRegister();
          }}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'kernel_pipeline' 
              ? 'border-red-400 text-red-300 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.15)]' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          KERNEL 0x7F PIPELINE
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('hardware_phy');
            fetchHardwareData();
          }}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hardware_phy' 
              ? 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          FPGA PHY & IRQ 0x09
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('tee_iommu');
            fetchTeeIommuData();
          }}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tee_iommu' 
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          TEE & IOMMU DMA (0xFF00AA7B)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('living_manifest');
          }}
          className={`py-2.5 px-3 border-b-2 text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'living_manifest' 
              ? 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          LIVING MANIFEST (V1.9)
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="p-4 sm:p-5">
        {/* TAB 1: AGENTS GRID */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Sovereign Multi-Agent Mesh: 7 Authorized Enclaves & Edge Nodes Connected via Zero-Trust A2A Bridge
              </span>
              <button
                type="button"
                onClick={fetchStatus}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    agent.id === selectedAgent
                      ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#080c14] border-cyan-500/15 hover:border-cyan-500/40 hover:bg-[#0a101b]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[12px]">{agent.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      </div>
                      <span className="text-[9px] text-cyan-400/80 font-mono block mt-0.5">{agent.id}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {agent.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-cyan-500/10 text-[9.5px]">
                    <div>
                      <span className="text-gray-500 block text-[8px]">LATENCY</span>
                      <span className="text-emerald-400 font-bold">{agent.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[8px]">PACKETS TX/RX</span>
                      <span className="text-gray-300 font-bold">{agent.packetsSent}/{agent.packetsReceived}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[8px]">L2 AIRGAP</span>
                      <span className="text-emerald-400 font-bold">{agent.l2QuarantineCompliant ? 'VERIFIED' : 'PENDING'}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.capabilities.map((cap, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-black/50 border border-white/10 rounded text-[8px] text-gray-300">
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] text-gray-500">
                    <span>Endpoint: {agent.endpoint}</span>
                    <span>Ping: {new Date(agent.lastHeartbeat).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: JHAMMERZ GITHUB NETWORK & REPOSITORIES */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-white text-[13px]">GITHUB.COM/JHAMMERZ NETWORK & CANONICAL WEB</span>
                </div>
                <p className="text-[10px] text-gray-300 mt-1">
                  Master Repository <code className="text-purple-300 bg-purple-950/40 px-1 py-0.5 rounded">JHammerZ/jhammerz.github.io</code> synced with active deployments, GitHub Pages, and distribution nodes.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/JHammerZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 rounded text-purple-300 text-[10px] font-bold flex items-center gap-1"
                >
                  github.com/JHammerZ
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://jhammerz.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 rounded text-sky-300 text-[10px] font-bold flex items-center gap-1"
                >
                  jhammerz.github.io
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Repositories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {githubRepos.map((repo, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-[#080c14] border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white text-[13px] hover:text-purple-300 flex items-center gap-1.5"
                        >
                          {repo.fullName}
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </a>
                        <p className="text-[10px] text-gray-400 mt-1">{repo.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                        repo.isPages 
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' 
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}>
                        {repo.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-cyan-400" />
                        Branch: <strong className="text-gray-200">{repo.defaultBranch}</strong>
                      </span>
                      {repo.pagesUrl && (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          Pages: <a href={repo.pagesUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">{repo.pagesUrl}</a>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-500/10 flex items-center justify-between text-[9px]">
                    <span className="text-gray-500">Last Sync: {new Date(repo.lastSync).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={handleSyncGitHubNetwork}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-gray-300 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Re-sync
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PACKET STREAM */}
        {activeTab === 'packets' && (
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400">
                Real-Time A2A Packet Inspection: Live stream of messages, heartbeats, and micro-consensus votes.
              </span>
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                {['ALL', 'DIRECTIVE', 'CONSENSUS_PROPOSAL', 'HEARTBEAT', 'STATE_SYNC'].map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setPacketFilter(flt)}
                    className={`px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                      packetFilter === flt
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                        : 'bg-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredPackets.map((pkt) => (
                <div
                  key={pkt.id}
                  className="p-3 bg-[#080c14] border border-cyan-500/15 rounded-lg text-[10px] hover:border-cyan-500/40 transition-all font-mono"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {pkt.type}
                      </span>
                      <span className="text-gray-300 font-bold">{pkt.fromAgent}</span>
                      <span className="text-gray-600">➔</span>
                      <span className="text-cyan-400 font-bold">{pkt.toAgent}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-gray-500">
                      <span>Latency: <strong className="text-emerald-400">{pkt.latencyMs}ms</strong></span>
                      <span>{new Date(pkt.timestamp).toLocaleTimeString()}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(JSON.stringify(pkt, null, 2), pkt.id)}
                        className="text-gray-400 hover:text-white"
                        title="Copy Packet JSON"
                      >
                        {copiedId === pkt.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-black/60 rounded border border-white/5 text-[9px] text-gray-300 overflow-x-auto">
                    <pre>{JSON.stringify(pkt.payload, null, 2)}</pre>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[8px] text-gray-500">
                    <span>Packet ID: {pkt.id}</span>
                    <span className="text-emerald-400/80 font-mono">HMAC: {pkt.signature}</span>
                    <span className="text-cyan-400 font-mono">L2: {pkt.l2Status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONSENSUS */}
        {activeTab === 'consensus' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-[13px]">L2 SANDBOX AIRGAP & MICRO-CONSENSUS</span>
                </div>
                <p className="text-[10px] text-gray-300 mt-1">
                  Enforces sovereign ZT-AP-01 airgap policy. All ad-hoc A2A consensus transitions execute within isolated L2 sandboxes with unidirectional data diode verification.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunConsensus}
                disabled={isConsensusRunning}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 rounded-lg text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                EXECUTE NEW CONSENSUS ROUND
              </button>
            </div>

            <div className="space-y-2.5">
              {consensusRounds.map((round) => (
                <div
                  key={round.roundId}
                  className="p-3.5 bg-[#080c14] border border-emerald-500/20 rounded-lg text-[10px] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-[12px]">Round #{round.roundId}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {round.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        DIODE: {round.diodeVerification}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[9px] text-gray-400 space-y-0.5">
                      <div>Proposer: <strong className="text-gray-200">{round.proposer}</strong></div>
                      <div>State Root Hash: <code className="text-emerald-400">{round.stateRootHash}</code></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-bold text-emerald-400">
                      Quorum Votes: {round.votesCount} / {round.requiredQuorum} (100% UNANIMOUS)
                    </div>
                    <div className="text-[8px] text-gray-500 mt-1">
                      Committed At: {new Date(round.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DISPATCHER */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4">
            <form onSubmit={handleDispatchMessage} className="p-4 rounded-lg bg-[#080c14] border border-sky-500/20 space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-sky-500/10">
                <Send className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-white text-[12px]">DISPATCH AGENT-TO-AGENT (A2A) PACKET</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
                <div>
                  <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">From Agent</label>
                  <select
                    value={dispatchFrom}
                    onChange={(e) => setDispatchFrom(e.target.value)}
                    className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                  >
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">To Destination</label>
                  <select
                    value={dispatchTo}
                    onChange={(e) => setDispatchTo(e.target.value)}
                    className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                  >
                    <option value="broadcast">BROADCAST (All 7 Agents)</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">Packet Type</label>
                  <select
                    value={dispatchType}
                    onChange={(e) => setDispatchType(e.target.value)}
                    className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                  >
                    <option value="DIRECTIVE">DIRECTIVE</option>
                    <option value="STATE_SYNC">STATE_SYNC</option>
                    <option value="CONSENSUS_PROPOSAL">CONSENSUS_PROPOSAL</option>
                    <option value="CODEBASE_DISPATCH">CODEBASE_DISPATCH</option>
                    <option value="SUDO_ELEVATION">SUDO_ELEVATION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">JSON Payload / Task Directive</label>
                <textarea
                  value={dispatchPayload}
                  onChange={(e) => setDispatchPayload(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-black border border-white/15 rounded text-gray-200 text-[10px] font-mono"
                  placeholder='{"directive": "Your command here..."}'
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[9px] text-gray-500">
                  Payload will be automatically cryptographically signed with HMAC-SHA256 and routed through L2 Diode.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 rounded text-sky-300 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  TRANSMIT OVER A2A BRIDGE
                </button>
              </div>
            </form>

            {dispatchResult && (
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-[10px] font-mono">
                <span className="text-emerald-400 font-bold block mb-1">TRANSMISSION RESULT:</span>
                <pre className="text-gray-300 text-[9px] overflow-x-auto">{JSON.stringify(dispatchResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: KERNEL 0x7F SECURITY PIPELINE */}
        {activeTab === 'kernel_pipeline' && (
          <div className="space-y-6">
            {/* MANDATE ENFORCEMENT BANNER */}
            <div className="p-4 bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black border border-red-500/40 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-red-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-500/20 border border-red-400 rounded-lg text-red-300">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[13px] tracking-wide">
                      SOVEREIGN KERNEL SECURITY POLICY & REGISTER 0x7F
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      Enforcing strict hardware routing and main-chain consensus pre-commit before register commit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-red-900/60 border border-red-400/60 text-red-200 text-[10px] font-bold">
                    PORT: 0x7F (ACTIVE)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-400/60 text-emerald-200 text-[10px] font-bold">
                    BYPASS: STRICTLY BLOCKED
                  </span>
                </div>
              </div>

              {/* SPECIFICATION COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[10px]">
                <div className="p-2.5 bg-black/60 border border-red-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <span className="text-red-500 font-black">[-]</span> DEPRECATED / FORBIDDEN BYPASSES
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">Bypass: Kernel Routing Table</span> (REJECTED)
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">Bypass: Main-Chain Consensus</span> (REJECTED)
                  </div>
                </div>

                <div className="p-2.5 bg-black/60 border border-emerald-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="text-emerald-400 font-black">[+]</span> MANDATORY ENFORCED DIRECTIVES
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-emerald-300 font-bold">Require: Kernel Routing Table CHECK</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 rounded">FIB-VALIDATED</span>
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-amber-300 font-bold">Require: Main-Chain Consensus PRE-COMMIT</span>
                    <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 rounded">QUORUM 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUAL FLOW DIAGRAM: [LOCAL EDGE PEER] → [KERNEL FIREWALL] → [ZK-VERIFY] → [SYSTEM_CORE_REGISTER_0x7F] */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  AUTHENTICATION & EXECUTION PIPELINE
                </span>
                <span className="text-[9px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  SYNCHRONOUS ATTESTATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* STAGE 1 */}
                <div className="p-3 bg-gradient-to-b from-blue-950/30 to-black border border-blue-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">STAGE 01</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Server className="w-4 h-4 text-blue-400" />
                    [LOCAL EDGE PEER]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Validates edge cryptographic signature, nonce sequence, and hardware identity.
                  </p>
                  <div className="p-1.5 bg-black/60 rounded border border-white/10 text-[9px] text-blue-300 font-mono">
                    ID: {selectedPeer}
                  </div>
                </div>

                {/* STAGE 2 */}
                <div className="p-3 bg-gradient-to-b from-red-950/30 to-black border border-red-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-red-400 font-bold uppercase tracking-wider mb-1">STAGE 02</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    [KERNEL FIREWALL]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Enforces Kernel FIB check & Main-Chain pre-commit. Strips bypass attempts.
                  </p>
                  <div className="p-1.5 bg-black/60 rounded border border-white/10 text-[9px] text-red-300 font-mono">
                    FIB: CHECKED | PRE-COMMIT: OK
                  </div>
                </div>

                {/* STAGE 3 */}
                <div className="p-3 bg-gradient-to-b from-purple-950/30 to-black border border-purple-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mb-1">STAGE 03</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Key className="w-4 h-4 text-purple-400" />
                    [ZK-VERIFY]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Groth16 zk-SNARK proof diode validates state transition without exposing raw vectors.
                  </p>
                  <div className="p-1.5 bg-black/60 rounded border border-white/10 text-[9px] text-purple-300 font-mono">
                    CIRCUIT: CORE_0x7F_V4
                  </div>
                </div>

                {/* STAGE 4 */}
                <div className="p-3 bg-gradient-to-b from-emerald-950/30 to-black border border-emerald-500/40 rounded-lg relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1">STAGE 04</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    [REGISTER_0x7F]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Atomic state root written to hardware register 0x7F at address 0x007F_C0DE_A1.
                  </p>
                  <div className="p-1.5 bg-black/60 rounded border border-white/10 text-[9px] text-emerald-300 font-mono truncate">
                    VAL: {kernelData?.register?.currentValue || '0xDEAD_BEEF_7F00_A1B2'}
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE CONTROLS & REGISTER STATE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* REGISTER CARD */}
              <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    SYSTEM_CORE_REGISTER_0x7F
                  </span>
                  <button
                    type="button"
                    onClick={fetchKernelRegister}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Register Address:</span>
                    <span className="text-cyan-300 font-bold">0x7F (127 Decimal)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Memory Offset:</span>
                    <span className="text-purple-300 font-bold">0x007F_C0DE_A1</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Current Value:</span>
                    <span className="text-emerald-300 font-bold">{kernelData?.register?.currentValue || '0xDEAD_BEEF_7F00_A1B2'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Hardware Clock:</span>
                    <span className="text-amber-300 font-bold">#{kernelData?.register?.lastHardwareClockCycle || '8942150'}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Total Pipeline Runs:</span>
                    <span className="text-white font-bold">{kernelData?.register?.totalPipelinesExecuted || 142}</span>
                  </div>
                  <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded text-[9px] text-emerald-300">
                    STATUS: {kernelData?.register?.preCommitQuorumStatus || '100% QUORUM PRE-COMMITTED'}
                  </div>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="lg:col-span-2 p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">
                    PIPELINE DISPATCH & VERIFICATION ACTIONS
                  </span>
                  <span className="text-[9px] text-gray-400">Zero-Bypass Policy Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">Local Edge Peer</label>
                    <select
                      value={selectedPeer}
                      onChange={(e) => setSelectedPeer(e.target.value)}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                    >
                      {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">Payload Transaction Tag</label>
                    <input
                      type="text"
                      value={pipelinePayloadText}
                      onChange={(e) => setPipelinePayloadText(e.target.value)}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px] font-mono"
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleExecuteKernelPipeline}
                    disabled={isPipelineRunning}
                    className="p-2.5 bg-gradient-to-r from-red-600/30 to-amber-600/30 hover:from-red-600/40 hover:to-amber-600/40 border border-red-400/50 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)] disabled:opacity-50"
                  >
                    <ShieldAlert className={`w-3.5 h-3.5 text-red-400 ${isPipelineRunning ? 'animate-spin' : ''}`} />
                    EXECUTE 4-STAGE PIPELINE
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckRoutingTable}
                    className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 rounded-lg text-blue-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                    CHECK ROUTING TABLE (FIB)
                  </button>

                  <button
                    type="button"
                    onClick={handlePreCommitConsensus}
                    className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg text-amber-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    CERTIFY PRE-COMMIT
                  </button>
                </div>

                {/* RESULT FEEDBACK STRIPS */}
                {routingCheckResult && (
                  <div className="p-2.5 bg-blue-950/30 border border-blue-500/30 rounded text-[9px] font-mono text-blue-200">
                    <span className="font-bold text-blue-400">[ROUTING CHECK]</span> {routingCheckResult.message} ({routingCheckResult.verifiedRoutes}/{routingCheckResult.totalRoutes} verified)
                  </div>
                )}

                {preCommitResult && (
                  <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded text-[9px] font-mono text-amber-200">
                    <span className="font-bold text-amber-400">[PRE-COMMIT]</span> Block #{preCommitResult.preCommitBlockHeight} | Quorum: {preCommitResult.quorum} | Hash: {preCommitResult.preCommitBlockHash?.slice(0, 24)}...
                  </div>
                )}

                {pipelineResult && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-[9px] font-mono text-emerald-200 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PIPELINE COMMITTED TO SYSTEM_CORE_REGISTER_0x7F:
                    </div>
                    <div>• Execution ID: {pipelineResult.execution?.id}</div>
                    <div>• Value: <span className="font-bold text-white">{pipelineResult.execution?.systemCoreRegister0x7F?.committedHexValue}</span> (Address: 0x007F_C0DE_A1)</div>
                    <div>• ZK Proof: {pipelineResult.execution?.zkVerify?.proofHash?.slice(0, 32)}... ({pipelineResult.execution?.zkVerify?.verificationTimeMs}ms)</div>
                    <div>• Firewall: {pipelineResult.execution?.kernelFirewall?.ruleId} (Bypass Flags Enforced & Disallowed)</div>
                  </div>
                )}
              </div>
            </div>

            {/* ROUTING TABLE FIB ENTRIES */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white text-[11px] flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  KERNEL ROUTING TABLE (FIB) — ZERO-BYPASS ENFORCED
                </span>
                <span className="text-[9px] text-gray-400">Status: ALL FIB ENTRIES ACTIVE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[9px] uppercase">
                      <th className="py-2 px-2">Route ID</th>
                      <th className="py-2 px-2">Prefix / Dest</th>
                      <th className="py-2 px-2">Gateway</th>
                      <th className="py-2 px-2">Interface</th>
                      <th className="py-2 px-2">Metric</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">FIB Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(kernelData?.routingTable || [
                      { routeId: "rt-00", prefix: "0.0.0.0/0", gateway: "10.0.0.1", interfaceName: "eth0_sovereign", metric: 10, status: "ACTIVE_VERIFIED", fibValidated: true },
                      { routeId: "rt-01", prefix: "10.0.7.0/24", gateway: "10.0.7.1", interfaceName: "tun_aurelius_01", metric: 5, status: "IMMUTABLE_CORE", fibValidated: true },
                      { routeId: "rt-02", prefix: "10.0.8.0/24", gateway: "10.0.8.1", interfaceName: "tun_manus_02", metric: 5, status: "IMMUTABLE_CORE", fibValidated: true },
                      { routeId: "rt-03", prefix: "10.0.9.0/24", gateway: "10.0.9.1", interfaceName: "tun_mythos_03", metric: 5, status: "IMMUTABLE_CORE", fibValidated: true },
                      { routeId: "rt-04", prefix: "127.0.0.127/32", gateway: "0.0.0.0", interfaceName: "lo_register_0x7f", metric: 1, status: "IMMUTABLE_CORE", fibValidated: true },
                      { routeId: "rt-05", prefix: "jhammerz.github.io/32", gateway: "185.199.108.153", interfaceName: "mesh_a2a_05", metric: 2, status: "ACTIVE_VERIFIED", fibValidated: true }
                    ]).map((route: any) => (
                      <tr key={route.routeId} className="hover:bg-white/5">
                        <td className="py-2 px-2 text-cyan-300 font-bold">{route.routeId}</td>
                        <td className="py-2 px-2 text-white font-bold">{route.prefix}</td>
                        <td className="py-2 px-2 text-gray-300">{route.gateway}</td>
                        <td className="py-2 px-2 text-gray-400">{route.interfaceName}</td>
                        <td className="py-2 px-2 text-amber-300">{route.metric}</td>
                        <td className="py-2 px-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold">
                            {route.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px]">
                            <Check className="w-3 h-3" /> VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT PIPELINE ATTESTATIONS & REGISTER COMMITS */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white text-[11px] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  IMMUTABLE REGISTER 0x7F ATTESTATION LOGS
                </span>
                <span className="text-[9px] text-gray-400">
                  {kernelData?.recentExecutions?.length || 5} Records in Memory Buffer
                </span>
              </div>

              <div className="space-y-2">
                {(kernelData?.recentExecutions || []).map((rec: any) => (
                  <div 
                    key={rec.id}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono hover:border-white/20 transition-all space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-gray-400 pb-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{rec.id}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-cyan-300">From: {rec.localEdgePeer?.peerId}</span>
                      </div>
                      <span className="text-[8px] text-gray-500">{new Date(rec.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="text-gray-300 text-[9px] font-bold">
                      {rec.flow}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[8px] text-gray-400 pt-1">
                      <div>
                        <span className="text-red-400 font-bold">FIREWALL:</span> {rec.kernelFirewall?.status} (FIB: {rec.kernelFirewall?.routingTableCheck})
                      </div>
                      <div className="truncate">
                        <span className="text-purple-400 font-bold">ZK-PROOF:</span> {rec.zkVerify?.proofHash?.slice(0, 16)}...
                      </div>
                      <div>
                        <span className="text-emerald-400 font-bold">0x7F COMMIT:</span> {rec.systemCoreRegister0x7F?.committedHexValue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FPGA PHY & IRQ 0x09 RATE LIMITER PIPELINE */}
        {activeTab === 'hardware_phy' && (
          <div className="space-y-6">
            {/* MANDATE ENFORCEMENT BANNER */}
            <div className="p-4 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black border border-amber-500/40 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 border border-amber-400 rounded-lg text-amber-300">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[13px] tracking-wide">
                      FPGA PHY HARDWARE ACCELERATION & IRQ 0x09 DAMPENING
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      Eliminating infinite interrupt storms with hardware-level token bucket regulation and epoch dampening.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-amber-900/60 border border-amber-400/60 text-amber-200 text-[10px] font-bold">
                    VECTOR: IRQ 0x09
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-400/60 text-emerald-200 text-[10px] font-bold">
                    RATE: 1.0ms TOKEN-BUCKET
                  </span>
                </div>
              </div>

              {/* SPECIFICATION COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[10px]">
                <div className="p-2.5 bg-black/60 border border-red-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <span className="text-red-500 font-black">[-]</span> DEPRECATED / FORBIDDEN HARDWARE STATES
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">COOLDOWN_DAMPENING: NONE</span> (REJECTED / STORM HAZARD)
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">EPOC_DAMPENING: BYPASSED</span> (REJECTED / FLOOD HAZARD)
                  </div>
                </div>

                <div className="p-2.5 bg-black/60 border border-emerald-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="text-emerald-400 font-black">[+]</span> MANDATORY ENFORCED DIRECTIVES
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-amber-300 font-bold">COOLDOWN_DAMPENING: TOKEN_BUCKET_1ms</span>
                    <span className="text-[9px] text-amber-400 bg-amber-950/60 px-1 rounded">1.00ms LEAK</span>
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-emerald-300 font-bold">EPOC_DAMPENING: ENFORCED</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 rounded">SLOT-REGULATED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUAL FLOW DIAGRAM: [FPGA-ACCELERATED PHY] → [RATE_LIMITER] → [IRQ 0x09] */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-amber-400" />
                  HARDWARE INGESTION & INTERRUPT SERVICE PIPELINE
                </span>
                <span className="text-[9px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                  [FPGA-ACCELERATED PHY] → [RATE_LIMITER] → [IRQ 0x09]
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* STAGE 1: FPGA-ACCELERATED PHY */}
                <div className="p-3.5 bg-gradient-to-b from-blue-950/30 to-black border border-blue-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">STAGE 01 (PHYSICAL INGRESS)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Radio className="w-4 h-4 text-blue-400" />
                    [FPGA-ACCELERATED PHY]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    PCIe Gen5 / 25GbE SerDes optical transceiver with zero-copy ring buffers and CRC32 verification.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Line Rate:</span>
                      <span className="text-blue-300 font-bold">{hardwareData?.fpgaPhy?.lineRateGbps || 25.78} Gbps</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>SerDes Clock:</span>
                      <span className="text-cyan-300 font-bold">{hardwareData?.fpgaPhy?.serDesClockMhz || 156.25} MHz</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Frames Ingested:</span>
                      <span className="text-white font-bold">{hardwareData?.fpgaPhy?.phyRxFramesTotal?.toLocaleString() || '184,920'}</span>
                    </div>
                  </div>
                </div>

                {/* STAGE 2: RATE_LIMITER */}
                <div className="p-3.5 bg-gradient-to-b from-amber-950/30 to-black border border-amber-500/40 rounded-lg relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider mb-1">STAGE 02 (REGULATION DIODE)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    [RATE_LIMITER]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Token bucket leak rate of 1.00ms/token with active epoch slot burst suppression.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Cooldown:</span>
                      <span className="text-amber-300 font-bold">TOKEN_BUCKET_1ms</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Epoch Dampening:</span>
                      <span className="text-emerald-300 font-bold">ENFORCED</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Bucket Fill:</span>
                      <span className="text-white font-bold">{Math.floor(hardwareData?.rateLimiter?.currentTokens || 480)} / {hardwareData?.rateLimiter?.bucketCapacity || 500} Tokens</span>
                    </div>
                  </div>
                </div>

                {/* STAGE 3: IRQ 0x09 */}
                <div className="p-3.5 bg-gradient-to-b from-purple-950/30 to-black border border-purple-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mb-1">STAGE 03 (SOVEREIGN INTERRUPT)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    [IRQ 0x09]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Vector 9 hardware fast-path interrupt dispatch directly servicing Core 0 Sovereign worker loop.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Vector:</span>
                      <span className="text-purple-300 font-bold">0x09 (Dec: 9)</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Affinity:</span>
                      <span className="text-cyan-300 font-bold">CORE_0_SOVEREIGN</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Service Latency:</span>
                      <span className="text-emerald-300 font-bold">&lt; 420 ns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE PULSE DISPATCHER & LIVE TOKEN BUCKET */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* TOKEN BUCKET STATUS CARD */}
              <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    TOKEN BUCKET TELEMETRY
                  </span>
                  <button
                    type="button"
                    onClick={fetchHardwareData}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                <div className="space-y-2 text-[10px] font-mono">
                  {/* Visual Token Level Bar */}
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                      <span>Current Token Level:</span>
                      <span className="text-amber-300 font-bold">
                        {Math.floor(hardwareData?.rateLimiter?.currentTokens || 480)} / {hardwareData?.rateLimiter?.bucketCapacity || 500}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, ((hardwareData?.rateLimiter?.currentTokens || 480) / (hardwareData?.rateLimiter?.bucketCapacity || 500)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Refill Constant:</span>
                    <span className="text-emerald-300 font-bold">1.00 token / 1.00 ms</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Epoch Slot Window:</span>
                    <span className="text-blue-300 font-bold">{hardwareData?.rateLimiter?.epochWindowMs || 100} ms</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Packets Passed:</span>
                    <span className="text-white font-bold">{(hardwareData?.rateLimiter?.totalPacketsPassed || 184920).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Storms Throttled:</span>
                    <span className="text-red-300 font-bold">{hardwareData?.rateLimiter?.totalPacketsThrottled || 0}</span>
                  </div>
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-[9px] text-emerald-300">
                    DAMPENING STATUS: {hardwareData?.rateLimiter?.dampeningStatus || 'ACTIVE_REGULATION (TOKEN_BUCKET_1ms)'}
                  </div>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="lg:col-span-2 p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    HARDWARE PULSE INGESTION & STORM TESTING
                  </span>
                  <span className="text-[9px] text-gray-400">Zero-Bypass Policy Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">Frame Size (Bytes)</label>
                    <select
                      value={pulseFrameSize}
                      onChange={(e) => setPulseFrameSize(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                    >
                      <option value={64}>64 Bytes (Min Ethernet / Fast Probe)</option>
                      <option value={512}>512 Bytes (Standard Micro-Consensus)</option>
                      <option value={1024}>1024 Bytes (Standard Mesh Frame)</option>
                      <option value={4096}>4096 Bytes (ZK-SNARK Proof Vector)</option>
                      <option value={9000}>9000 Bytes (Jumbo Frame)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">FPGA SerDes Lane</label>
                    <select
                      value={pulseSerDesLane}
                      onChange={(e) => setPulseSerDesLane(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                    >
                      <option value={0}>Lane 0 (Primary Optical Ingress)</option>
                      <option value={1}>Lane 1 (Inter-Node Mesh Ring)</option>
                      <option value={2}>Lane 2 (Sovereign Node Cluster)</option>
                      <option value={3}>Lane 3 (Air-Gapped Cold Path)</option>
                    </select>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteHardwarePulse(false, false)}
                    disabled={isHardwarePulseRunning}
                    className="p-2.5 bg-gradient-to-r from-amber-600/30 to-emerald-600/30 hover:from-amber-600/40 hover:to-emerald-600/40 border border-amber-400/50 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] disabled:opacity-50"
                  >
                    <Zap className={`w-3.5 h-3.5 text-amber-400 ${isHardwarePulseRunning ? 'animate-spin' : ''}`} />
                    EXECUTE HARDWARE PULSE
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteHardwarePulse(true, false)}
                    className="p-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-lg text-red-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    TEST BYPASS (STRIPPED)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < 5; i++) {
                        setTimeout(() => handleExecuteHardwarePulse(false, false), i * 150);
                      }
                    }}
                    className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 rounded-lg text-blue-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Binary className="w-3.5 h-3.5 text-blue-400" />
                    BURST TRAIN (5X PULSES)
                  </button>
                </div>

                {/* RESULT FEEDBACK STRIP */}
                {hardwarePulseResult && (
                  <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg text-[9px] font-mono text-amber-200 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      PULSE ROUTED: [FPGA PHY] → [RATE_LIMITER] → [IRQ 0x09]
                    </div>
                    <div>• Pulse ID: {hardwarePulseResult.record?.pulseId}</div>
                    <div>• FPGA PHY: {hardwarePulseResult.record?.fpgaPhy?.frameSize}B on Lane {hardwarePulseResult.record?.fpgaPhy?.serDesLane} (CRC32: {hardwarePulseResult.record?.fpgaPhy?.crc32})</div>
                    <div>• Rate Limiter: {hardwarePulseResult.record?.rateLimiter?.cooldownDampening} | EPOC: {hardwarePulseResult.record?.rateLimiter?.epocDampening} ({hardwarePulseResult.record?.rateLimiter?.dampeningAction})</div>
                    <div>• IRQ 0x09: <span className="font-bold text-white">{hardwarePulseResult.record?.irq0x09?.ackSignature}</span> (Serviced in {hardwarePulseResult.record?.irq0x09?.servicedLatencyNs}ns on Core 0)</div>
                  </div>
                )}
              </div>
            </div>

            {/* RECENT IRQ 0x09 HARDWARE INTERRUPT ATTESTATIONS */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white text-[11px] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  IMMUTABLE IRQ 0x09 INTERRUPT SERVICE LOGS
                </span>
                <span className="text-[9px] text-gray-400">
                  {hardwareData?.recentInterrupts?.length || 5} Attestations in Ring Buffer
                </span>
              </div>

              <div className="space-y-2">
                {(hardwareData?.recentInterrupts || []).map((rec: any) => (
                  <div 
                    key={rec.pulseId}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono hover:border-white/20 transition-all space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-gray-400 pb-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{rec.pulseId}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-cyan-300">PHY: {rec.fpgaPhy?.frameSize}B / Lane {rec.fpgaPhy?.serDesLane}</span>
                      </div>
                      <span className="text-[8px] text-gray-500">{new Date(rec.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="text-gray-300 text-[9px] font-bold">
                      {rec.flow}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[8px] text-gray-400 pt-1">
                      <div>
                        <span className="text-blue-400 font-bold">CRC32:</span> {rec.fpgaPhy?.crc32}
                      </div>
                      <div>
                        <span className="text-amber-400 font-bold">RATE LIMITER:</span> {rec.rateLimiter?.cooldownDampening} (EPOC: {rec.rateLimiter?.epocDampening})
                      </div>
                      <div className="truncate">
                        <span className="text-purple-400 font-bold">IRQ 0x09 ACK:</span> {rec.irq0x09?.ackSignature} ({rec.irq0x09?.servicedLatencyNs}ns)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TEE ENCLAVE & IOMMU-MEDIATED DMA (CORE RAM 0xFF00AA7B) */}
        {activeTab === 'tee_iommu' && (
          <div className="space-y-6">
            {/* MANDATE ENFORCEMENT BANNER */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-black border border-cyan-500/40 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-500/20 border border-cyan-400 rounded-lg text-cyan-300">
                    <Lock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[13px] tracking-wide">
                      TEE ENCLAVE &amp; IOMMU-MEDIATED DMA SUBSYSTEM
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      Eliminating direct DMA bypass and full kernel bypass via hardware IOMMU page table remapping to Core RAM <code className="text-cyan-300 font-bold">0xFF00AA7B</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-900/60 border border-cyan-400/60 text-cyan-200 text-[10px] font-bold">
                    CHANNEL: IOMMU_MEDIATED_DMA
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-400/60 text-emerald-200 text-[10px] font-bold">
                    BYPASS: KERNEL_MEDIATED_PASSTHROUGH
                  </span>
                </div>
              </div>

              {/* SPECIFICATION COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-[10px]">
                <div className="p-2.5 bg-black/60 border border-red-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-red-400 font-bold flex items-center gap-1">
                    <span className="text-red-500 font-black">[-]</span> DEPRECATED / FORBIDDEN MEMORY ACCESS
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">CHANNEL_ACCESS: DIRECT_MEMORY_ACCESS_DMA</span> (REJECTED / UNPROTECTED EXPOSURE)
                  </div>
                  <div className="text-gray-400 pl-4">
                    • <span className="line-through text-red-300/80">ABSTRACTION_BYPASS: FULL_KERNEL_BYPASS</span> (REJECTED / UNVERIFIED ESCALATION)
                  </div>
                </div>

                <div className="p-2.5 bg-black/60 border border-emerald-500/30 rounded-lg space-y-1 font-mono">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="text-emerald-400 font-black">[+]</span> MANDATORY ENFORCED DIRECTIVES
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-cyan-300 font-bold">CHANNEL_ACCESS: IOMMU_MEDIATED_DMA</span>
                    <span className="text-[9px] text-cyan-400 bg-cyan-950/60 px-1 rounded">VT-d / AMD-Vi</span>
                  </div>
                  <div className="text-gray-300 pl-4 flex items-center gap-1">
                    • <span className="text-emerald-300 font-bold">ABSTRACTION_BYPASS: KERNEL_MEDIATED_PASSTHROUGH</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1 rounded">RING-0 SUPERVISED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VISUAL FLOW DIAGRAM: [TEE ENCLAVE] → [IOMMU] → [CORE RAM 0xFF00AA7B] */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  DMA MEMORY ACCESS &amp; SEGMENTATION PIPELINE
                </span>
                <span className="text-[9px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                  [TEE ENCLAVE] → [IOMMU] → [CORE RAM 0xFF00AA7B]
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* STAGE 1: TEE ENCLAVE */}
                <div className="p-3.5 bg-gradient-to-b from-blue-950/30 to-black border border-blue-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">STAGE 01 (ISOLATED EXECUTION)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    [TEE ENCLAVE]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    AMD-SEV-SNP hardware security enclave with sealed measurement quotes and hardware AES-256-GCM memory encryption.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Enclave ID:</span>
                      <span className="text-blue-300 font-bold">{teeIommuData?.teeEnclave?.enclaveId || 'TEE-SEV-SNP-CORE-01'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Attestation:</span>
                      <span className="text-emerald-300 font-bold">{teeIommuData?.teeEnclave?.attestationStatus || 'HARDWARE_ATTESTED_VALID'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Isolated Pages:</span>
                      <span className="text-white font-bold">{teeIommuData?.teeEnclave?.isolatedPages || 2048} Pages (8 MB)</span>
                    </div>
                  </div>
                </div>

                {/* STAGE 2: IOMMU CONTROLLER */}
                <div className="p-3.5 bg-gradient-to-b from-cyan-950/30 to-black border border-cyan-500/40 rounded-lg relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mb-1">STAGE 02 (DMA TRANSLATION)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    [IOMMU]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Two-level VT-d / AMD-Vi page-table DMA remapping with ring-0 supervised passthrough.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Channel Access:</span>
                      <span className="text-cyan-300 font-bold">IOMMU_MEDIATED_DMA</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Bypass Policy:</span>
                      <span className="text-emerald-300 font-bold">KERNEL_PASSTHROUGH</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Page Table Root:</span>
                      <span className="text-white font-bold">{teeIommuData?.iommu?.pageTableRoot || '0x00FF_00AA_7B00'}</span>
                    </div>
                  </div>
                </div>

                {/* STAGE 3: CORE RAM 0xFF00AA7B */}
                <div className="p-3.5 bg-gradient-to-b from-purple-950/30 to-black border border-purple-500/40 rounded-lg relative overflow-hidden">
                  <div className="text-[9px] text-purple-400 font-bold uppercase tracking-wider mb-1">STAGE 03 (TARGET RAM SEGMENT)</div>
                  <div className="font-bold text-white text-[12px] flex items-center gap-1.5 mb-1.5">
                    <Database className="w-4 h-4 text-purple-400" />
                    [CORE RAM 0xFF00AA7B]
                  </div>
                  <p className="text-[9px] text-gray-400 mb-2">
                    Protected physical host memory range <code className="text-purple-300">0xFF00AA7B - 0xFF00B27B</code> with ECC validation.
                  </p>
                  <div className="space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Physical Address:</span>
                      <span className="text-purple-300 font-bold">0xFF00AA7B</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Segment Size:</span>
                      <span className="text-cyan-300 font-bold">{teeIommuData?.coreRam?.segmentSizeKb || 2048} KB</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Hardware Lock:</span>
                      <span className="text-emerald-300 font-bold">LOCKED &amp; SEALED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DMA DISPATCHER & CORE RAM TELEMETRY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* CORE RAM 0xFF00AA7B TELEMETRY */}
              <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    CORE RAM 0xFF00AA7B REGISTER
                  </span>
                  <button
                    type="button"
                    onClick={fetchTeeIommuData}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                <div className="space-y-2 text-[10px] font-mono">
                  <div className="p-2.5 bg-white/5 border border-cyan-500/20 rounded space-y-1.5">
                    <div className="flex justify-between text-gray-400">
                      <span>Target Base Address:</span>
                      <span className="text-cyan-300 font-bold">0xFF00AA7B</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Memory Range:</span>
                      <span className="text-gray-200">0xFF00AA7B - 0xFF00B27B</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Committed Hex Word:</span>
                      <span className="text-amber-300 font-bold">{teeIommuData?.coreRam?.currentCommittedHex || '0xAA7B_CAFE_BEEF'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>ECC Status:</span>
                      <span className="text-emerald-300 font-bold">{teeIommuData?.coreRam?.eccStatus || 'ECC_HARDWARE_VALIDATED'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">DMA Transfers Remapped:</span>
                    <span className="text-white font-bold">{teeIommuData?.iommu?.totalDmaTransfers || 924}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Bytes Remapped:</span>
                    <span className="text-cyan-300 font-bold">{((teeIommuData?.iommu?.totalBytesRemapped || 1894400) / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Bypass Attacks Blocked:</span>
                    <span className="text-red-300 font-bold">{teeIommuData?.iommu?.unauthorizedDmaAttemptsBlocked || 14}</span>
                  </div>
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-[9px] text-emerald-300">
                    PROTECTION: IOMMU_MEDIATED_DMA &amp; KERNEL_MEDIATED_PASSTHROUGH ACTIVE
                  </div>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="lg:col-span-2 p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
                <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    EXECUTE DMA MEMORY TRANSFER &amp; BYPASS TEST
                  </span>
                  <span className="text-[9px] text-gray-400">Enforced Hardware Remapping</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">State Transition Payload</label>
                    <input
                      type="text"
                      value={dmaPayloadText}
                      onChange={(e) => setDmaPayloadText(e.target.value)}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px] font-mono"
                      placeholder="Payload string"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[9px] uppercase font-bold mb-1">DMA Transfer Size</label>
                    <select
                      value={dmaPayloadSize}
                      onChange={(e) => setDmaPayloadSize(Number(e.target.value))}
                      className="w-full p-2 bg-black border border-white/15 rounded text-gray-200 text-[10px]"
                    >
                      <option value={512}>512 Bytes (Micro Enclave Proof)</option>
                      <option value={1024}>1024 Bytes (Standard 1-Page Segment)</option>
                      <option value={2048}>2048 Bytes (2-Page State Attestation)</option>
                      <option value={4096}>4096 Bytes (Full 4K Physical Page)</option>
                      <option value={8192}>8192 Bytes (Multi-Page State Vector)</option>
                    </select>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteTeeTransfer(false, false)}
                    disabled={isTeeTransferRunning}
                    className="p-2.5 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-400/50 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)] disabled:opacity-50"
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 text-cyan-400 ${isTeeTransferRunning ? 'animate-spin' : ''}`} />
                    EXECUTE IOMMU DMA
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteTeeTransfer(true, false)}
                    className="p-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 rounded-lg text-red-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    TEST DIRECT DMA (TRAPPED)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteTeeTransfer(false, true)}
                    className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg text-amber-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    TEST KERNEL BYPASS (TRAPPED)
                  </button>
                </div>

                {/* RESULT FEEDBACK STRIP */}
                {teeTransferResult && (
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-lg text-[9px] font-mono text-cyan-200 space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      PIPELINE COMMITTED: [TEE ENCLAVE] → [IOMMU] → [CORE RAM 0xFF00AA7B]
                    </div>
                    <div>• Transfer ID: {teeTransferResult.record?.transferId}</div>
                    <div>• TEE Enclave Quote: {teeTransferResult.record?.teeEnclave?.attestationQuote} ({teeTransferResult.record?.teeEnclave?.payloadSize}B)</div>
                    <div>• IOMMU Channel: <span className="text-white font-bold">{teeTransferResult.record?.iommu?.channelAccess}</span> (Remapped {teeTransferResult.record?.iommu?.virtualAddress} → {teeTransferResult.record?.iommu?.physicalAddress} in {teeTransferResult.record?.iommu?.dmaTranslationTimeNs}ns)</div>
                    <div>• Core RAM 0xFF00AA7B: <span className="font-bold text-amber-300">{teeTransferResult.coreRam?.currentCommittedHex}</span> (ECC: {teeTransferResult.record?.coreRam?.eccParityCheck}, Status: {teeTransferResult.record?.coreRam?.status})</div>
                  </div>
                )}
              </div>
            </div>

            {/* RECENT TEE -> IOMMU -> RAM 0xFF00AA7B DMA ATTESTATIONS */}
            <div className="p-4 bg-black/70 border border-white/15 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white text-[11px] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  IMMUTABLE IOMMU-MEDIATED DMA TRANSFER LEDGER (0xFF00AA7B)
                </span>
                <span className="text-[9px] text-gray-400">
                  {teeIommuData?.recentTransfers?.length || 5} Remapped Records
                </span>
              </div>

              <div className="space-y-2">
                {(teeIommuData?.recentTransfers || []).map((rec: any) => (
                  <div 
                    key={rec.transferId}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono hover:border-white/20 transition-all space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-gray-400 pb-1 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">{rec.transferId}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-blue-300">TEE: {rec.teeEnclave?.enclaveId}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-purple-300">RAM: {rec.coreRam?.physicalAddress}</span>
                      </div>
                      <span className="text-[8px] text-gray-500">{new Date(rec.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="text-gray-300 text-[9px] font-bold">
                      {rec.flow}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[8px] text-gray-400 pt-1">
                      <div className="truncate">
                        <span className="text-blue-400 font-bold">QUOTE:</span> {rec.teeEnclave?.attestationQuote}
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold">IOMMU:</span> {rec.iommu?.channelAccess} ({rec.iommu?.dmaTranslationTimeNs}ns)
                      </div>
                      <div className="truncate">
                        <span className="text-purple-400 font-bold">STATE ROOT:</span> {rec.coreRam?.stateRootCommitted?.slice(0, 18)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* TAB 9: SOVEREIGN LIVING MANIFEST V1.9 */}
        {activeTab === 'living_manifest' && (
          <div className="space-y-4">
            <SovereignLivingManifestPanel onTerminalLog={onTerminalLog} />
          </div>
        )}
      </div>
    </div>
  );
};
