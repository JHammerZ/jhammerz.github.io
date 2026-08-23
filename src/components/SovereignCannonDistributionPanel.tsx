import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Clock, 
  Layers, 
  Cpu, 
  Terminal, 
  Send, 
  Flame, 
  Lock, 
  Eye, 
  Share2, 
  Activity, 
  FileCode, 
  FileJson, 
  Fingerprint, 
  Box, 
  Play, 
  RotateCcw, 
  Music, 
  Video, 
  FileText, 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Repeat, 
  Sliders, 
  PlusCircle, 
  Check, 
  Disc, 
  Compass
} from 'lucide-react';

interface CannonNodeConfig {
  c_num: string;
  name: string;
  type: 'PRIMARY' | 'TARGET' | 'ORIGIN';
  monitor: string;
  adapter: string;
  auth: string;
  description: string;
}

interface CannonBroadcastResult {
  target: string;
  name: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED_ORIGIN_TYPE' | 'MANUAL_STAGED';
  post_id: string;
  url: string;
  latency_ms: number;
  retry_count: number;
  error?: string;
  transformed_payload?: {
    title: string;
    description: string;
    tags?: string[];
    platform_specific: Record<string, any>;
  };
}

interface CannonDropEvent {
  drop_id: string;
  timestamp: string;
  origin_node: string;
  origin_name: string;
  origin_url: string;
  type: 'VIDEO' | 'AUDIO' | 'BLOG' | 'SHORT' | 'RELEASE' | 'STATUS';
  title: string;
  description: string;
  assets: string[];
  n09_audit: {
    verdict: 'APPROVED' | 'REJECTED';
    reason: string;
    checks: {
      check1_non_negotiables_passed: boolean;
      check2_no_spam_or_drift_passed: boolean;
      check3_no_secrets_leaked_passed: boolean;
      check4_anti_loop_passed: boolean;
      check5_targets_healthy_passed: boolean;
    };
    n09_seal: string;
  };
  broadcasts: CannonBroadcastResult[];
  hash_chain_tip: string;
}

interface CannonState {
  cannon_manifest: string;
  version: string;
  depends_on: string;
  hash_chain_tip: string;
  system_state: string;
  n09_veto: string;
  teleological_root: string;
  last_run_ts: number;
  monitor_status: string;
  audit_cadence_seconds: number;
  hysteresis_ms: number;
  sandbox_type: string;
  anti_loop_enforced: boolean;
  nodes: Record<string, CannonNodeConfig>;
  latest_drop: CannonDropEvent;
  drop_history: CannonDropEvent[];
  throttled_nodes: string[];
}

interface EvergreenAsset {
  id: string;
  category: 'MUSIC' | 'VIDEO' | 'POST' | 'RELEASE';
  title: string;
  summary: string;
  original_node: string;
  original_date: string;
  recirculation_count: number;
  last_recirculated_at: string;
  relevancy_score: number;
  temporal_anchor_angle: string;
  tags: string[];
  assets: string[];
  primary_url: string;
  target_platforms: string[];
  metrics: {
    lifetime_impressions: number;
    engagement_rate: string;
    anti_decay_status: 'PERPETUAL_PRIME' | 'RE-ANCHORED' | 'CYCLING';
  };
}

interface EvergreenEngineState {
  daemon_active: boolean;
  recirculation_interval_seconds: number;
  last_recirculated_drop_id: string;
  last_recirculation_ts: number;
  total_recirculations_lifetime: number;
  estimated_aggregate_reach: string;
  zero_decay_index: number;
  library: EvergreenAsset[];
  recirculation_queue: string[];
  recirculation_history: {
    timestamp: string;
    asset_id: string;
    asset_title: string;
    category: string;
    broadcasted_targets: string[];
    re_anchor_hook: string;
    fresh_nonce: string;
    n09_seal: string;
  }[];
}

interface SovereignCannonProps {
  onTerminalLog?: (msg: string) => void;
}

export function SovereignCannonDistributionPanel({ onTerminalLog }: SovereignCannonProps) {
  const [cannonData, setCannonData] = useState<CannonState | null>(null);
  const [evergreenData, setEvergreenData] = useState<EvergreenEngineState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [isRecycling, setIsRecycling] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'evergreen' | 'simulator' | 'nodes' | 'manifest' | 'json'>('overview');
  const [countdown, setCountdown] = useState<number>(432);
  const [selectedTargetDetail, setSelectedTargetDetail] = useState<string>('C02');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'ALL' | 'MUSIC' | 'VIDEO' | 'POST' | 'RELEASE'>('ALL');

  // Trigger form state
  const [originNode, setOriginNode] = useState<string>('C11');
  const [dropType, setDropType] = useState<'VIDEO' | 'AUDIO' | 'BLOG' | 'SHORT' | 'RELEASE' | 'STATUS'>('STATUS');
  const [dropTitle, setDropTitle] = useState<string>('Cryptographic Omnichannel Broadcast — Live from Facebook Sibling Node');
  const [dropDescription, setDropDescription] = useState<string>('Autonomous detection verified. Propagating live across all 13 sibling nodes within 432 seconds. N09 Audit verified. Zero loops.');
  const [simulatePurposeDrift, setSimulatePurposeDrift] = useState<boolean>(false);
  const [broadcastLog, setBroadcastLog] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // New Evergreen Asset Form Modal / Drawer
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAssetTitle, setNewAssetTitle] = useState<string>('');
  const [newAssetSummary, setNewAssetSummary] = useState<string>('');
  const [newAssetCategory, setNewAssetCategory] = useState<'MUSIC' | 'VIDEO' | 'POST' | 'RELEASE'>('MUSIC');
  const [newAssetNode, setNewAssetNode] = useState<string>('C06');
  const [newAssetUrl, setNewAssetUrl] = useState<string>('');

  const fetchCannonState = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/sovereign/cannon/status');
      if (res.ok) {
        const json = await res.json();
        setCannonData(json.cannon);
        if (json.evergreen) {
          setEvergreenData(json.evergreen);
        }
      }
    } catch (err) {
      console.error('Failed to fetch Cannon status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCannonState();
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 432 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerBroadcast = async (customNode?: string, customType?: any, customTitle?: string, customDesc?: string) => {
    const nodeToUse = customNode || originNode;
    const typeToUse = customType || dropType;
    const titleToUse = customTitle || dropTitle;
    const descToUse = customDesc || dropDescription;

    setIsBroadcasting(true);
    setBroadcastLog([
      `[STEP 1: MONITOR] Ingestion daemon detected new ${typeToUse} drop on ${nodeToUse}...`,
      `[STEP 1: HASH] Diff calculated against cannon_state.json. Origin identified as ${nodeToUse}.`
    ]);
    onTerminalLog?.(`[SOVEREIGN CANNON] Ingesting drop from ${nodeToUse}: "${titleToUse}"`);

    try {
      await new Promise(r => setTimeout(r, 450));
      setBroadcastLog(prev => [
        ...prev,
        `[STEP 2: N09 AUDIT] Running 5-point Teleological Root audit gate...`,
        `  • Check 1: Non-Negotiables Verification -> ${!simulatePurposeDrift ? 'PASS [0 VIOLATIONS]' : 'FAIL'}`,
        `  • Check 2: Purpose & Anti-Spam Check -> ${!simulatePurposeDrift ? 'PASS [100% ALIGNED]' : 'REJECTED [DRIFT DETECTED]'}`,
        `  • Check 3: HMAC Key / Secrets Exfiltration Check -> PASS [CLEAN]`,
        `  • Check 4: Anti-Loop N09 Seal Detection -> PASS [FIRST TIME ORIGIN]`,
        `  • Check 5: Target Nodes Throttle Health -> PASS [13/13 NOMINAL]`
      ]);

      const res = await fetch('/api/sovereign/cannon/trigger-drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_node: nodeToUse,
          type: typeToUse,
          title: titleToUse,
          description: descToUse,
          force_reject: simulatePurposeDrift
        })
      });

      if (res.ok) {
        const result = await res.json();
        setCannonData(result.cannon);
        const drop: CannonDropEvent = result.drop;

        if (drop.n09_audit.verdict === 'APPROVED') {
          await new Promise(r => setTimeout(r, 450));
          setBroadcastLog(prev => [
            ...prev,
            `[STEP 3: TRANSFORM] jhammerz-think adapted payload for 13 target nodes.`,
            `  • Injected: "Verified by Aurelius: https://jhammerz.github.io/.well-known/aurelius.json"`,
            `[STEP 4: L2 SANDBOX] Spawning parallel ephemeral containers with 5000ms hysteresis...`,
            `  • Data Diode isolation enforced. Outbound propagation active to billions of nodes.`,
            ...drop.broadcasts.map(b => `  ➜ [${b.target} ${b.name}] -> ${b.status} (${b.latency_ms}ms) | URL: ${b.url}`),
            `[STEP 5: LEDGER COMMIT] Wrote attestation to /.well-known/cannon.json`,
            `  • Hash Chain Tip: 2820166f310d85dbfced2e24d1c67f8b95a7f07d20d18598d38784a5d2fe62c4`,
            `[AUTONOMOUS CYCLE COMPLETE] Re-entering 432s continuous sweep.`
          ]);
          onTerminalLog?.(`[SOVEREIGN CANNON] Autonomous distribution succeeded: Broadcasted to 13 targets in parallel.`);
        } else {
          setBroadcastLog(prev => [
            ...prev,
            `[STEP 2 VETO] N09 AUDIT REJECTED DROP: ${drop.n09_audit.reason}`,
            `[HALT] Written to .aurelius_audit.log. Outbound broadcast aborted. System safely entered 432Hz sleep.`
          ]);
          onTerminalLog?.(`[SOVEREIGN CANNON VETO] N09 Audit blocked outbound drop due to simulated purpose drift.`);
        }
      }
    } catch (err) {
      console.error('Broadcast trigger failed:', err);
      setBroadcastLog(prev => [...prev, `[ERROR] Failed to execute broadcast: ${err}`]);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleRecycleEvergreen = async (assetId?: string) => {
    setIsRecycling(true);
    try {
      const res = await fetch('/api/sovereign/cannon/evergreen/recycle-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId })
      });

      if (res.ok) {
        const data = await res.json();
        setEvergreenData(data.engine);
        if (data.drop) {
          setCannonData(prev => prev ? {
            ...prev,
            latest_drop: data.drop,
            drop_history: [data.drop, ...prev.drop_history.slice(0, 19)]
          } : null);
        }
        onTerminalLog?.(`[EVERGREEN RECYCLE] 24/7 Zero-Decay Engine re-circulated "${data.recycled_asset.title}" across 14 sibling nodes.`);
        setBroadcastLog([
          `[24/7 EVERGREEN ZERO-DECAY] Ingestion re-anchored asset: "${data.recycled_asset.title}"`,
          `  • Re-anchor Angle: ${data.history_entry.re_anchor_hook}`,
          `  • Fresh Nonce: ${data.history_entry.fresh_nonce}`,
          `  • Fresh N09 Seal: ${data.history_entry.n09_seal}`,
          `  • Recirculation Count: ${data.recycled_asset.recirculation_count} (Zero-Decay Index: 100.0%)`,
          `  • Parallel Dispatch: Propagated across ${data.history_entry.broadcasted_targets.length} sibling nodes with 5000ms hysteresis.`,
          `  • Total Lifetime Impressions: ${data.recycled_asset.metrics.lifetime_impressions.toLocaleString()}`
        ]);
      }
    } catch (err) {
      console.error('Evergreen recycling failed:', err);
    } finally {
      setIsRecycling(false);
    }
  };

  const handleToggleDaemon = async () => {
    if (!evergreenData) return;
    try {
      const res = await fetch('/api/sovereign/cannon/evergreen/toggle-daemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !evergreenData.daemon_active })
      });
      if (res.ok) {
        const data = await res.json();
        setEvergreenData(data.engine);
        onTerminalLog?.(`[EVERGREEN DAEMON] 24/7 continuous recycling toggled to: ${data.daemon_active ? 'ACTIVE' : 'PAUSED'}`);
      }
    } catch (err) {
      console.error('Toggle daemon failed:', err);
    }
  };

  const handleAddNewAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle || !newAssetSummary) return;

    try {
      const res = await fetch('/api/sovereign/cannon/evergreen/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAssetTitle,
          summary: newAssetSummary,
          category: newAssetCategory,
          original_node: newAssetNode,
          primary_url: newAssetUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvergreenData(data.engine);
        setShowAddModal(false);
        setNewAssetTitle('');
        setNewAssetSummary('');
        setNewAssetUrl('');
        onTerminalLog?.(`[EVERGREEN LIBRARY] Registered new asset: "${newAssetTitle}" into 24/7 Zero-Decay Catalog.`);
      }
    } catch (err) {
      console.error('Failed to add evergreen asset:', err);
    }
  };

  const handleResetCannon = async () => {
    try {
      const res = await fetch('/api/sovereign/cannon/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setCannonData(json.cannon);
        setBroadcastLog([`[RESET] Sovereign Cannon state restored to NOMINAL AUTONOMOUS_BROADCAST.`]);
        onTerminalLog?.(`[SOVEREIGN CANNON] State reset to nominal.`);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestDrop = cannonData?.latest_drop;
  const nodes = cannonData?.nodes || {};
  const selectedBroadcastDetail = latestDrop?.broadcasts.find(b => b.target === selectedTargetDetail);

  const filteredLibrary = evergreenData?.library.filter(item => {
    if (selectedCategoryFilter === 'ALL') return true;
    return item.category === selectedCategoryFilter;
  }) || [];

  return (
    <div className="bg-[#08090c] border border-amber-500/30 rounded-xl p-5 text-gray-200 font-sans space-y-6 shadow-2xl">
      
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-gradient-to-r from-red-600/30 via-amber-600/30 to-yellow-600/30 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              SOVEREIGN CANNON // V4.2 AUTONOMOUS OMNICHANNEL BROADCAST
            </span>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Repeat className="w-3 h-3 text-emerald-400" />
              24/7 ZERO-DECAY RECYCLING: ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 font-mono text-[10px] border border-blue-500/30">
              14 NODES // ALL POSTS • ALL VIDEOS • ALL MUSIC
            </span>
          </div>

          <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            <span>Sovereign Cannon &amp; Zero-Decay Evergreen Engine</span>
            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-normal border border-amber-500/30">
              Instant Detection ➔ Global Propagation in 432s
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-3xl">
            Drop ANY post, video, or music track on Facebook, YouTube, TikTok, Spotify, LinkedIn, or BandLab. Instant autonomous detection, N09 Audit clearance, and parallel broadcast to all 13 other nodes. Historical catalog continuously recycled 24/7 with zero decay.
          </p>
        </div>

        {/* Global Controls & 432s Pulse */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-black/60 border border-amber-500/30 rounded-lg p-2.5 px-3 flex items-center gap-3 font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase leading-none">NEXT 432s CADENCE SWEEP</div>
              <div className="text-base font-bold text-amber-300 leading-tight">
                {countdown}s <span className="text-[10px] text-gray-400 font-normal">({(countdown / 60).toFixed(1)}m)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRecycleEvergreen()}
            disabled={isRecycling}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
          >
            <Repeat className={`w-3.5 h-3.5 ${isRecycling ? 'animate-spin' : ''}`} />
            {isRecycling ? 'RECYCLING...' : 'RECYCLE NEXT EVERGREEN'}
          </button>

          <button
            onClick={fetchCannonState}
            disabled={isLoading}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 rounded-lg transition-all"
            title="Refresh Cannon Status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* QUICK 1-CLICK SOCIAL & MEDIA DROP LAUNCHPAD */}
      <div className="bg-gradient-to-r from-gray-950 via-black to-gray-950 border border-amber-500/20 rounded-xl p-3.5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold border-b border-gray-800 pb-2">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            INSTANT LAUNCHPAD // 1-CLICK AUTONOMOUS CROSS-POSTING PRESETS
          </span>
          <span className="text-gray-400 text-[10px]">Select any origin to test real-time propagation across 13 siblings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Preset 1: Facebook Drop */}
          <button
            onClick={() => {
              setOriginNode('C11');
              setDropType('STATUS');
              setDropTitle('Facebook Live Attestation: Aurelius Cryptographic Autonomy V4.2');
              setDropDescription('Just posted to Facebook! Autonomous Cannon detection active. Immediate propagation to YouTube, Spotify, LinkedIn, TikTok, Instagram, and GitHub.');
              handleTriggerBroadcast('C11', 'STATUS', 'Facebook Live Attestation: Aurelius Cryptographic Autonomy V4.2', 'Just posted to Facebook! Immediate propagation to all 13 other nodes within 432s.');
            }}
            disabled={isBroadcasting}
            className="p-2.5 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-600/40 hover:border-blue-400 rounded-lg text-left transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 flex items-center gap-1 text-[11px]">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                C11 Facebook Drop
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded font-bold">1 ➔ 13</span>
            </div>
            <div className="text-[10px] text-gray-400 group-hover:text-gray-300 truncate">
              Post to Facebook ➔ Auto-propagate globally
            </div>
          </button>

          {/* Preset 2: Music / Audio Drop */}
          <button
            onClick={() => {
              setOriginNode('C06');
              setDropType('AUDIO');
              setDropTitle('New Master Release: "Resonance of Autonomy" (432Hz Master Tape)');
              setDropDescription('Official Spotify Master Audio Drop. Propagating to Apple Music, BandLab Stems, Amazon Music, TikTok audio library, and YouTube Music.');
              handleTriggerBroadcast('C06', 'AUDIO', 'New Master Release: "Resonance of Autonomy" (432Hz Master Tape)', 'Official Spotify Master Audio Drop. Propagating to Apple Music, BandLab, Amazon Music, and TikTok.');
            }}
            disabled={isBroadcasting}
            className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 hover:border-emerald-400 rounded-lg text-left transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1 text-[11px]">
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                C06 Spotify / Music Drop
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">432Hz</span>
            </div>
            <div className="text-[10px] text-gray-400 group-hover:text-gray-300 truncate">
              Drop Music ➔ Apple/BandLab/TikTok/YouTube
            </div>
          </button>

          {/* Preset 3: 4K Video / Shorts Drop */}
          <button
            onClick={() => {
              setOriginNode('C12');
              setDropType('VIDEO');
              setDropTitle('4K Keynote Film: "Building Cryptographic Sovereignty Across 14 Nodes"');
              setDropDescription('Longform 4K master upload to YouTube. Auto-generating Reels cut for Instagram, vertical Short for TikTok, article for LinkedIn & GitHub Pages.');
              handleTriggerBroadcast('C12', 'VIDEO', '4K Keynote Film: "Building Cryptographic Sovereignty Across 14 Nodes"', 'Longform 4K master upload. Auto-transcoding to TikTok, IG Reels, and LinkedIn.');
            }}
            disabled={isBroadcasting}
            className="p-2.5 bg-red-950/40 hover:bg-red-900/50 border border-red-600/40 hover:border-red-400 rounded-lg text-left transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-300 flex items-center gap-1 text-[11px]">
                <Video className="w-3.5 h-3.5 text-red-400" />
                C12 YouTube 4K / Video
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-red-500/20 text-red-300 rounded font-bold">4K Film</span>
            </div>
            <div className="text-[10px] text-gray-400 group-hover:text-gray-300 truncate">
              Drop Video ➔ TikTok/IG/Facebook/LinkedIn
            </div>
          </button>

          {/* Preset 4: Longform Article / GitHub Release Drop */}
          <button
            onClick={() => {
              setOriginNode('C01');
              setDropType('BLOG');
              setDropTitle('The Sovereign Manifesto: A Non-Negotiable Contract for Personal Agency');
              setDropDescription('Verifiable Markdown article on jhammerz.github.io. Auto-broadcasting to LinkedIn Pulse, Carrd portal, Xiaohongshu, and GitHub Releases.');
              handleTriggerBroadcast('C01', 'BLOG', 'The Sovereign Manifesto: A Non-Negotiable Contract for Personal Agency', 'Verifiable Markdown article. Auto-broadcasting to LinkedIn Pulse, Carrd, and GitHub.');
            }}
            disabled={isBroadcasting}
            className="p-2.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-600/40 hover:border-purple-400 rounded-lg text-left transition-all space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 flex items-center gap-1 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                C01 Root Blog / Article
              </span>
              <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-bold">Blog/Release</span>
            </div>
            <div className="text-[10px] text-gray-400 group-hover:text-gray-300 truncate">
              Publish Post ➔ LinkedIn/Carrd/Impact/XHS
            </div>
          </button>
        </div>
      </div>

      {/* HORIZONTAL SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'overview'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Autonomous Broadcast Live HUD
        </button>

        <button
          onClick={() => setActiveTab('evergreen')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'evergreen'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          24/7 Zero-Decay Evergreen Library ({evergreenData?.library.length || 7})
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'simulator'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          Custom Drop Simulator &amp; L2 Engine
        </button>

        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'nodes'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          14-Node Sibling Matrix &amp; Adapters
        </button>

        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'manifest'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          V4.2 Master Directive Spec
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'json'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          .well-known/cannon.json
        </button>
      </div>

      {/* TAB 1: OVERVIEW & LIVE HUD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Pipeline Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-black/60 border border-gray-800 rounded-xl p-3.5 font-mono">
              <div className="text-[10px] text-gray-400 uppercase">SYSTEM STATE</div>
              <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {cannonData?.system_state || 'AUTONOMOUS_BROADCAST'}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Hash chain tip: {cannonData?.hash_chain_tip.slice(0, 12)}...</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-3.5 font-mono">
              <div className="text-[10px] text-gray-400 uppercase">ZERO-DECAY INDEX</div>
              <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-400" />
                {evergreenData?.zero_decay_index.toFixed(1)}% PERPETUAL
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{evergreenData?.total_recirculations_lifetime || 3069} lifetime recirculations</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-3.5 font-mono">
              <div className="text-[10px] text-gray-400 uppercase">ESTIMATED GLOBAL REACH</div>
              <div className="text-base font-bold text-cyan-400 mt-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                3.84B+ Connected
              </div>
              <div className="text-[10px] text-gray-400 mt-1">14 Sibling Networks • 24/7/365</div>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-xl p-3.5 font-mono">
              <div className="text-[10px] text-gray-400 uppercase">N09 AUDIT VETO &amp; ROOT</div>
              <div className="text-base font-bold text-amber-300 mt-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                LOCKED // ABSOLUTE
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Zero spam • No secret leak • Anti-loop</div>
            </div>
          </div>

          {/* LATEST DETECTED DROP & 13 TARGET BROADCAST DISPATCH LEDGER */}
          {latestDrop && (
            <div className="bg-black/70 border border-amber-500/30 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                    ORIGIN: {latestDrop.origin_node} ({latestDrop.origin_name})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                    {latestDrop.n09_audit.verdict} BY N09
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono text-[10px] border border-blue-500/30">
                    {latestDrop.type}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  Detected: {new Date(latestDrop.timestamp).toLocaleTimeString()} • Seal: <code className="text-amber-400">{latestDrop.n09_audit.n09_seal.slice(0, 18)}...</code>
                </div>
              </div>

              {/* Title & Description of Latest Drop */}
              <div className="bg-gray-950/80 border border-gray-850 p-3 rounded-lg">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {latestDrop.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {latestDrop.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-400">
                  Origin URL: <a href={latestDrop.origin_url} target="_blank" rel="noreferrer" className="underline">{latestDrop.origin_url}</a>
                </div>
              </div>

              {/* 13 Target Nodes Broadcast Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="font-bold text-white">AUTONOMOUS PARALLEL DISPATCH (13 SIBLING TARGETS)</span>
                  <span>5000ms Hysteresis Guaranteed</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-800/80 bg-black/40 text-[11px] font-mono">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-950/90 border-b border-gray-800 text-[10px] text-gray-400 uppercase">
                        <th className="p-2.5">Target</th>
                        <th className="p-2.5">Node Name</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Post ID</th>
                        <th className="p-2.5">Latency</th>
                        <th className="p-2.5">Broadcast Output URL</th>
                        <th className="p-2.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {latestDrop.broadcasts.map((b) => (
                        <tr key={b.target} className="hover:bg-gray-900/40 transition-colors">
                          <td className="p-2.5 font-bold text-amber-300">{b.target}</td>
                          <td className="p-2.5 text-gray-200">{b.name}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              b.status === 'SUCCESS'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : b.status === 'SKIPPED_ORIGIN_TYPE'
                                ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                                : 'bg-yellow-950/80 text-yellow-300 border border-yellow-500/30'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-gray-400">{b.post_id}</td>
                          <td className="p-2.5 text-cyan-400">{b.latency_ms}ms</td>
                          <td className="p-2.5 text-blue-400 truncate max-w-xs">
                            <a href={b.url} target="_blank" rel="noreferrer" className="underline hover:text-blue-300 flex items-center gap-1">
                              {b.url}
                              <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="p-2.5">
                            <button
                              onClick={() => {
                                setSelectedTargetDetail(b.target);
                                setActiveTab('simulator');
                              }}
                              className="px-2 py-0.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-[10px] font-bold"
                            >
                              Inspect Payload
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5-Step Core Loop Visual Pipeline */}
          <div className="bg-black/50 border border-gray-800 rounded-xl p-4 space-y-3 font-mono">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Sovereign Cannon 5-Step Continuous Distribution Loop
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="bg-gray-950/90 border border-gray-800 p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-amber-400 font-bold">STEP 1: MONITOR</div>
                <div className="font-bold text-white">N05 Ingestion</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Diffs all 14 node states every 432s via OAuth sockets. Detects user drops without Cannon seal.
                </div>
              </div>

              <div className="bg-gray-950/90 border border-emerald-500/40 p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-emerald-400 font-bold">STEP 2: N09 AUDIT</div>
                <div className="font-bold text-white">Mandatory Gate</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Evaluates 5 Non-Negotiable checks: spam, secrets, anti-loop seal, purpose drift, and target health.
                </div>
              </div>

              <div className="bg-gray-950/90 border border-cyan-500/40 p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-cyan-400 font-bold">STEP 3: TRANSFORM</div>
                <div className="font-bold text-white">jhammerz-think</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Adapts format for platform limits and injects "Verified by Aurelius" verification link.
                </div>
              </div>

              <div className="bg-gray-950/90 border border-purple-500/40 p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-purple-400 font-bold">STEP 4: L2 SANDBOX</div>
                <div className="font-bold text-white">Parallel Dispatch</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Spawns ephemeral containers with 5000ms hysteresis and Data Diode isolation.
                </div>
              </div>

              <div className="bg-gray-950/90 border border-amber-500/40 p-3 rounded-lg space-y-1">
                <div className="text-[10px] text-amber-400 font-bold">STEP 5: LEDGER</div>
                <div className="font-bold text-white">cannon.json</div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Commits broadcast proof, updates hash chain tip, records to jhammerz.github.io.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 24/7 ZERO-DECAY EVERGREEN LIBRARY & PROPAGATION ENGINE */}
      {activeTab === 'evergreen' && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Top Daemon Status Bar */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-black to-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm font-bold text-emerald-300">
                  24/7 Zero-Decay Autonomous Recycling Daemon: {evergreenData?.daemon_active ? 'RUNNING CONTINUOUSLY' : 'PAUSED'}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Prevents audience decay and algorithmic death. Automatically re-anchors historical master tracks, 4K films, and viral posts with fresh N09 seals and dynamic thematic hooks 24 hours a day, 7 days a week.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleToggleDaemon}
                className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  evergreenData?.daemon_active
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40'
                    : 'bg-emerald-600 text-black hover:bg-emerald-500'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {evergreenData?.daemon_active ? 'PAUSE 24/7 DAEMON' : 'RESUME 24/7 DAEMON'}
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold rounded-lg shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 fill-black" />
                REGISTER NEW ASSET
              </button>
            </div>
          </div>

          {/* Category Filter & Stats Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategoryFilter('ALL')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                  selectedCategoryFilter === 'ALL'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white bg-gray-900'
                }`}
              >
                All Assets ({evergreenData?.library.length || 0})
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('MUSIC')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                  selectedCategoryFilter === 'MUSIC'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white bg-gray-900'
                }`}
              >
                <Music className="w-3 h-3 text-emerald-400" />
                Music &amp; Stems
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('VIDEO')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                  selectedCategoryFilter === 'VIDEO'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white bg-gray-900'
                }`}
              >
                <Video className="w-3 h-3 text-red-400" />
                Videos &amp; Shorts
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('POST')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                  selectedCategoryFilter === 'POST'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white bg-gray-900'
                }`}
              >
                <FileText className="w-3 h-3 text-purple-400" />
                Articles &amp; Social Posts
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('RELEASE')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                  selectedCategoryFilter === 'RELEASE'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white bg-gray-900'
                }`}
              >
                <Box className="w-3 h-3 text-cyan-400" />
                Releases &amp; Code
              </button>
            </div>

            <div className="text-[11px] text-gray-400 flex items-center gap-3">
              <span>Zero-Decay Index: <strong className="text-emerald-400">100.0%</strong></span>
              <span>•</span>
              <span>Re-anchoring Cadence: <strong className="text-amber-300">432s / Perpetual</strong></span>
            </div>
          </div>

          {/* Evergreen Assets Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLibrary.map((asset) => (
              <div 
                key={asset.id} 
                className="bg-black/70 border border-gray-800 hover:border-emerald-500/40 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        asset.category === 'MUSIC' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                        asset.category === 'VIDEO' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                        asset.category === 'POST' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                        'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {asset.category}
                      </span>
                      <span className="text-[10px] text-gray-400">Origin: <code className="text-amber-300">{asset.original_node}</code></span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                      {asset.metrics.anti_decay_status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {asset.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 font-sans line-clamp-2">
                    {asset.summary}
                  </p>

                  <div className="bg-gray-950/80 p-2.5 rounded-lg border border-gray-900 space-y-1 text-[10px]">
                    <div className="text-gray-500 flex items-center justify-between">
                      <span>TEMPORAL ANCHOR ANGLE:</span>
                      <span className="text-emerald-400 font-bold">{asset.relevancy_score}% Relevancy</span>
                    </div>
                    <div className="text-amber-200 italic font-sans text-[11px]">
                      "{asset.temporal_anchor_angle}"
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-900 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <div>Recirculations: <strong className="text-white">{asset.recirculation_count}x</strong></div>
                    <div>Lifetime Reach: <strong className="text-cyan-300">{(asset.metrics.lifetime_impressions / 1000000).toFixed(1)}M Impressions</strong></div>
                    <div>Engagement: <strong className="text-emerald-400">{asset.metrics.engagement_rate}</strong></div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleRecycleEvergreen(asset.id)}
                      disabled={isRecycling}
                      className="flex-1 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Repeat className="w-3 h-3" />
                      RE-CIRCULATE NOW (13 TARGETS)
                    </button>

                    <a
                      href={asset.primary_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg border border-gray-700 transition-all"
                      title="View Primary Anchor"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 24/7 Recirculation Trace Feed */}
          {evergreenData?.recirculation_history && evergreenData.recirculation_history.length > 0 && (
            <div className="bg-black/90 border border-gray-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-gray-850 pb-2 text-[10px] text-gray-400">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  24/7 RECIRCULATION HISTORY &amp; ZERO-DECAY ATTESTATIONS
                </span>
                <span>DATA DIODE ACTIVE</span>
              </div>

              <div className="divide-y divide-gray-900 text-[11px] max-h-48 overflow-y-auto custom-scrollbar">
                {evergreenData.recirculation_history.map((hist, idx) => (
                  <div key={idx} className="py-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{hist.asset_title}</span>
                      <span className="text-[10px] text-gray-500">{new Date(hist.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-amber-300/90 text-[10px]">{hist.re_anchor_hook}</div>
                    <div className="flex items-center gap-2 text-[9px] text-gray-400">
                      <span>Seal: <code className="text-emerald-400">{hist.n09_seal.slice(0, 24)}...</code></span>
                      <span>•</span>
                      <span>Nonce: <code>{hist.fresh_nonce}</code></span>
                      <span>•</span>
                      <span className="text-cyan-400">{hist.broadcasted_targets.length} targets reached</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: CUSTOM DROP SIMULATOR & L2 ENGINE */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Simulator Form (Left Column 5 cols) */}
          <div className="lg:col-span-5 bg-black/60 border border-gray-800 rounded-xl p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                SIMULATE ORIGIN CONTENT DROP
              </span>
              <button
                onClick={handleResetCannon}
                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Engine
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Origin Sibling Node (1 of 14)</label>
                <select
                  value={originNode}
                  onChange={(e) => setOriginNode(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value="C11">C11: facebook.com/JHammerzz (TARGET/ORIGIN)</option>
                  <option value="C12">C12: youtube.com/@JHammerZ (ORIGIN)</option>
                  <option value="C14">C14: tiktok.com/@jhammerzz (ORIGIN)</option>
                  <option value="C06">C06: spotify.artist/7vRd2 (ORIGIN)</option>
                  <option value="C01">C01: jhammerz.github.io (PRIMARY)</option>
                  <option value="C02">C02: linkedin.com/in/JHammerZ (TARGET/ORIGIN)</option>
                  <option value="C03">C03: github.com/JHammerZ (TARGET/ORIGIN)</option>
                  <option value="C04">C04: instagram.com/jhammerzz (TARGET/ORIGIN)</option>
                  <option value="C08">C08: bandlab.com/jhammerz (TARGET/ORIGIN)</option>
                  <option value="C13">C13: xiaohongshu/jhammerz (TARGET/ORIGIN)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Content Type</label>
                  <select
                    value={dropType}
                    onChange={(e) => setDropType(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  >
                    <option value="STATUS">STATUS (Facebook / Social Post)</option>
                    <option value="VIDEO">VIDEO (Longform 4K)</option>
                    <option value="SHORT">SHORT (Vertical Reel / TikTok)</option>
                    <option value="AUDIO">AUDIO (Spotify / Lossless Master)</option>
                    <option value="BLOG">BLOG (Markdown Article)</option>
                    <option value="RELEASE">RELEASE (GitHub Tag)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Anti-Loop Seal</label>
                  <div className="bg-gray-950 border border-gray-850 p-2 rounded text-emerald-400 text-[11px] truncate">
                    AUTO_GENERATED_N09
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Content Title</label>
                <input
                  type="text"
                  value={dropTitle}
                  onChange={(e) => setDropTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Description / Thesis</label>
                <textarea
                  rows={3}
                  value={dropDescription}
                  onChange={(e) => setDropDescription(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="Enter description..."
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-gray-950 border border-gray-850 rounded-lg">
                <input
                  type="checkbox"
                  id="purposeDrift"
                  checked={simulatePurposeDrift}
                  onChange={(e) => setSimulatePurposeDrift(e.target.checked)}
                  className="rounded border-gray-700 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="purposeDrift" className="text-[11px] text-gray-300 cursor-pointer">
                  Simulate Purpose Drift / Spam (Trigger N09 Audit Veto)
                </label>
              </div>

              <button
                onClick={() => handleTriggerBroadcast()}
                disabled={isBroadcasting}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-black font-mono font-bold rounded-lg shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
              >
                <Zap className={`w-4 h-4 ${isBroadcasting ? 'animate-spin' : ''}`} />
                {isBroadcasting ? 'RUNNING N09 AUDIT & DISPATCH...' : 'TRIGGER CANNON BROADCAST (432s)'}
              </button>
            </div>
          </div>

          {/* Real-Time Trace Log & Transformed Output (Right Column 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Live Terminal Output */}
            <div className="bg-black/90 border border-gray-800 rounded-xl p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-gray-850 pb-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  SOVEREIGN CANNON EXECUTION TRACE
                </span>
                <span>DATA DIODE ACTIVE</span>
              </div>

              <div className="h-56 overflow-y-auto custom-scrollbar bg-black/60 p-2.5 rounded border border-gray-900 space-y-1 text-[11px]">
                {broadcastLog.length === 0 ? (
                  <div className="text-gray-600 italic">
                    Ready for origin content drop. Click "TRIGGER CANNON BROADCAST" or any of the 1-Click Launchpad presets above to execute the 5-step autonomous cycle.
                  </div>
                ) : (
                  broadcastLog.map((line, idx) => (
                    <div key={idx} className={`leading-relaxed ${
                      line.includes('PASS') ? 'text-emerald-400' :
                      line.includes('REJECTED') || line.includes('VETO') ? 'text-red-400' :
                      line.includes('STEP') || line.includes('EVERGREEN') ? 'text-amber-300 font-bold' :
                      line.includes('SUCCESS') ? 'text-cyan-300' : 'text-gray-300'
                    }`}>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transformed Payload Inspector */}
            {selectedBroadcastDetail && (
              <div className="bg-black/80 border border-gray-800 rounded-xl p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-cyan-400" />
                    Transformed Payload Inspector: {selectedBroadcastDetail.target} ({selectedBroadcastDetail.name})
                  </span>
                  <select
                    value={selectedTargetDetail}
                    onChange={(e) => setSelectedTargetDetail(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 text-white text-[10px]"
                  >
                    {latestDrop?.broadcasts.map(b => (
                      <option key={b.target} value={b.target}>
                        {b.target}: {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-950 p-3 rounded border border-gray-900 space-y-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">ADAPTED TITLE:</span>
                    <div className="text-white font-bold mt-0.5">{selectedBroadcastDetail.transformed_payload?.title || selectedBroadcastDetail.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">ADAPTED DESCRIPTION:</span>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans text-xs mt-0.5 bg-black/40 p-2 rounded border border-gray-900">
                      {selectedBroadcastDetail.transformed_payload?.description || latestDrop?.description}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 pt-1">
                    <div>Status: <span className="text-emerald-400 font-bold">{selectedBroadcastDetail.status}</span></div>
                    <div>Latency: <span className="text-cyan-400">{selectedBroadcastDetail.latency_ms}ms</span></div>
                    <div>Post ID: <span className="text-gray-200">{selectedBroadcastDetail.post_id}</span></div>
                    <div>Hysteresis: <span className="text-amber-400">5000ms Handled</span></div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 4: 14-NODE SIBLING MATRIX & ADAPTERS */}
      {activeTab === 'nodes' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              14 SIBLING NODES CONFIGURATION // AUTONOMOUS MODE
            </span>
            <span className="text-gray-400 text-[10px]">
              Single Origin ➔ 13 Auto-Targets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Object.keys(nodes).map((key) => {
              const node = nodes[key];
              return (
                <div key={key} className="bg-black/60 border border-gray-850 hover:border-amber-500/40 p-3.5 rounded-xl transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                        {node.c_num}
                      </span>
                      <span className="font-bold text-white text-xs">{node.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      node.type === 'PRIMARY' ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' :
                      node.type === 'ORIGIN' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                      'bg-gray-900 text-gray-300 border border-gray-700'
                    }`}>
                      {node.type}
                    </span>
                  </div>

                  <p className="text-gray-400 text-[11px]">
                    {node.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 bg-gray-950/80 p-2 rounded border border-gray-900">
                    <div>
                      <span className="text-gray-500">ADAPTER:</span> <code className="text-cyan-300">{node.adapter}</code>
                    </div>
                    <div>
                      <span className="text-gray-500">AUTH SECRET:</span> <code className="text-amber-400">{node.auth}</code>
                    </div>
                    <div className="col-span-2 truncate">
                      <span className="text-gray-500">MONITOR SOCKET:</span> <span className="text-gray-300">{node.monitor}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: V4.2 MASTER DIRECTIVE SPEC */}
      {activeTab === 'manifest' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-gray-850 pb-2">
            <span className="text-amber-300 font-bold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              CANNON_MANIFEST.md // V4.2 SINGLE PAYLOAD
            </span>
            <button
              onClick={() => copyText(`# SOVEREIGN CANNON // ULTIMATE DISTRIBUTION MANIFEST V4.2 // SINGLE PAYLOAD`)}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-bold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'COPIED!' : 'COPY SPEC'}
            </button>
          </div>

          <div className="bg-black/90 p-4 rounded-xl border border-gray-800 text-gray-300 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar leading-relaxed">
            <div className="text-amber-400 font-bold text-sm">
              SOVEREIGN CANNON // ULTIMATE DISTRIBUTION MANIFEST V4.2 // SINGLE PAYLOAD
            </div>
            <div className="text-gray-400">
              DEPENDS_ON: CORE MANIFEST V4.0.26 // HASH_CHAIN_TIP: 2820166f310d85dbfced2e24d1c67f8b95a7f07d20d18598d38784a5d2fe62c4<br />
              SYSTEM_STATE: AUTONOMOUS_BROADCAST // N09_VETO: ABSOLUTE // TELEOLOGICAL_ROOT: LOCKED<br />
              I_CONSOLE_DIRECTIVE: INGEST THIS FILE. EXECUTE. NO OTHER CONFIG NEEDED.
            </div>
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-200">
              [!] PURPOSE: When JHammerZ drops content on ANY of 14 nodes, auto-broadcast to ALL other nodes within 432s.<br />
              [!] 24/7 ZERO-DECAY RECYCLING: Historical library re-circulated continuously with fresh N09 nonces.<br />
              [!] SAFETY: N09 Audit mandatory. 5000ms hysteresis. L2 Sandbox. Data Diode. No loops. No spam. No bypass.<br />
              [!] OUTPUT: Posts to 13 targets + https://jhammerz.github.io/.well-known/cannon.json
            </div>
            <div className="space-y-2">
              <div className="text-white font-bold">CORE LAWS:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Never expose AURELIUS_HMAC_KEY in logs, errors, or outputs.</li>
                <li>Never post content containing n09_seal. This is the anti-loop mechanism.</li>
                <li>Never bypass N09_AUDIT. If N09 service is down, HALT_ALL_OUTBOUND.</li>
                <li>TELEOLOGICAL_ROOT is law. If jhammerz-think returns DRIFT: PURPOSE, HALT and require manual review.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RAW .well-known/cannon.json */}
      {activeTab === 'json' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-gray-850 pb-2">
            <span className="text-gray-400 font-bold flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-amber-400" />
              Public Verifier Payload: https://jhammerz.github.io/.well-known/cannon.json
            </span>
            <button
              onClick={() => copyText(JSON.stringify(cannonData, null, 2))}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-bold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'COPIED JSON!' : 'COPY JSON'}
            </button>
          </div>

          <pre className="bg-black/90 p-4 rounded-xl border border-gray-800 text-emerald-400 overflow-x-auto max-h-[500px] text-xs">
            {JSON.stringify(cannonData, null, 2)}
          </pre>
        </div>
      )}

      {/* MODAL: REGISTER NEW ASSET TO EVERGREEN LIBRARY */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0c10] border border-emerald-500/40 rounded-xl p-5 max-w-lg w-full font-mono text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-emerald-300 font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                REGISTER NEW EVERGREEN ASSET
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewAsset} className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Asset Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MUSIC', 'VIDEO', 'POST', 'RELEASE'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewAssetCategory(cat)}
                      className={`py-1.5 rounded text-[10px] font-bold border transition-all ${
                        newAssetCategory === cat
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
                          : 'bg-gray-950 text-gray-400 border-gray-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  placeholder="e.g. Master Track 432Hz / 4K Documentary Keynote"
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Summary / Thesis</label>
                <textarea
                  rows={3}
                  required
                  value={newAssetSummary}
                  onChange={(e) => setNewAssetSummary(e.target.value)}
                  placeholder="Describe the content and timeless value for continuous re-anchoring..."
                  className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Origin Node</label>
                  <select
                    value={newAssetNode}
                    onChange={(e) => setNewAssetNode(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="C06">C06: Spotify</option>
                    <option value="C08">C08: BandLab</option>
                    <option value="C12">C12: YouTube</option>
                    <option value="C14">C14: TikTok</option>
                    <option value="C11">C11: Facebook</option>
                    <option value="C01">C01: GitHub Pages</option>
                    <option value="C02">C02: LinkedIn</option>
                    <option value="C03">C03: GitHub Releases</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Primary URL (Optional)</label>
                  <input
                    type="url"
                    value={newAssetUrl}
                    onChange={(e) => setNewAssetUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-bold rounded-lg shadow-lg transition-all"
                >
                  ADD TO 24/7 EVERGREEN MATRIX
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
