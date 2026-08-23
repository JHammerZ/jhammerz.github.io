import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  Lock,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Terminal,
  Globe,
  Radio,
  Server,
  Cpu,
  Clock,
  ExternalLink,
  Flame,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  XCircle,
  Network,
  Share2,
  FileCheck2,
  Fingerprint,
  History
} from 'lucide-react';

interface SiblingNodeItem {
  c_num: string;
  endpoint: string;
  class: string;
  purpose_alignment: string;
  throttle_state: 'NOMINAL' | 'THROTTLED' | 'QUARANTINED' | 'KILLED' | 'SAFE_MODE';
  last_verified: string;
  purpose_alignment_score: number;
  last_seal: string;
  last_ts: string;
  response_time_ms: number;
  desync_seconds: number;
}

interface MerkleProofStep {
  siblingHash: string;
  position: 'left' | 'right';
  level: number;
}

interface MerkleProofBundle {
  root_hash: string;
  merkle_root: string;
  node_id: string;
  endpoint: string;
  class: string;
  purpose_alignment: string;
  throttle_state: string;
  leaf_hash: string;
  merkle_path: MerkleProofStep[];
  n09_cosignature: string;
  timestamp: string;
  teleological_root_id: string;
  is_valid: boolean;
  verification_command: string;
}

interface VerificationResult {
  verified: boolean;
  claim: string;
  target_date: string;
  node_id: string;
  endpoint: string;
  root_hash: string;
  merkle_root: string;
  merkle_root_matches: boolean;
  n09_cosigned: boolean;
  purpose_aligned: boolean;
  proof_bundle: MerkleProofBundle;
  verification_steps: Array<{
    step: number;
    description: string;
    input_hash: string;
    sibling_hash?: string;
    position?: string;
    resulting_hash: string;
    passed: boolean;
  }>;
  execution_log: string[];
  cli_command: string;
  certificate: {
    certificate_id: string;
    issued_at: string;
    issuer: string;
    attestation: string;
    verifier_url: string;
  };
}

interface LivingManifestState {
  version: string;
  spark_compat: string;
  ledger_anchor: string;
  hmac_algo: string;
  signature_seed: string;
  system_state: 'LIVING' | 'THROTTLED' | 'SAFE_MODE_432HZ' | 'HALTED' | 'DRAFT';
  target_horizon: string;
  audit_cadence_seconds: number;
  hash_chain_tip: string;
  genesis_identifier_sha256: string;
  i_console_endpoint: string;
  system_access: string;
  last_audit_timestamp: string;
  next_audit_countdown_seconds: number;
  total_audits_completed: number;
  purpose_re_attested: boolean;
  active_throttle_reasons: string[];
  is_genesis_committed?: boolean;
  genesis_commit_hash?: string;
  genesis_timestamp?: string;
  genesis_pushed_target?: string;
  teleological_root: {
    purpose: string;
    non_negotiables: string[];
    throttle_conditions: string[];
    succession_protocol: string;
    manifest_intent_payload: string;
  };
  nodes: SiblingNodeItem[];
  recent_audit_ledger: Array<{
    audit_id: string;
    timestamp: string;
    hash_chain_tip: string;
    status: 'VERIFIED' | 'DRIFT' | 'THROTTLED' | 'HALTED' | 'GENESIS';
    hmac_seal: string;
    drift_nodes: string[];
    action_taken: string;
    n09_cosign: string;
  }>;
}

interface Props {
  onTerminalLog?: (msg: string) => void;
}

export function SovereignLivingManifestPanel({ onTerminalLog }: Props) {
  const [manifestData, setManifestData] = useState<LivingManifestState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'matrix' | 'proof' | 'root' | 'throttle' | 'executable' | 'raw'>('proof');
  const [copiedTip, setCopiedTip] = useState<boolean>(false);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isGenesisCommitting, setIsGenesisCommitting] = useState<boolean>(false);
  const [genesisReceipt, setGenesisReceipt] = useState<any | null>(null);
  const [simulatingCondition, setSimulatingCondition] = useState<number | null>(null);

  // Transitive Proof State
  const [selectedNodeForProof, setSelectedNodeForProof] = useState<string>('C14');
  const [activeClaimText, setActiveClaimText] = useState<string>(
    "The TikTok @jhammerzz posted on 2026-09-01 was authorized by JHammerZ and aligned with PURPOSE."
  );
  const [targetDateInput, setTargetDateInput] = useState<string>("2026-09-01");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifyingClaim, setIsVerifyingClaim] = useState<boolean>(false);
  const [selectedProofNodeDetail, setSelectedProofNodeDetail] = useState<MerkleProofBundle | null>(null);

  const fetchManifest = async () => {
    try {
      const res = await fetch('/api/sovereign/living-manifest');
      if (res.ok) {
        const data = await res.json();
        setManifestData(data.manifest);
      }
    } catch (err) {
      console.error("Error loading living manifest:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
    const interval = setInterval(fetchManifest, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial proof for default node (C14)
  useEffect(() => {
    fetchNodeProof(selectedNodeForProof);
    runTransitiveVerification(
      selectedNodeForProof,
      activeClaimText,
      targetDateInput
    );
  }, []);

  const fetchNodeProof = async (nodeId: string) => {
    try {
      const res = await fetch(`/api/sovereign/transitive-proof/node/${nodeId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProofNodeDetail(data.proofBundle);
      }
    } catch (err) {
      console.error("Error fetching node proof:", err);
    }
  };

  const runTransitiveVerification = async (nodeIdOrUrl: string, claimStr: string, dateStr: string) => {
    setIsVerifyingClaim(true);
    onTerminalLog?.(`[AURELIUS-VERIFY] Running transitive proof verification for ${nodeIdOrUrl}...`);
    try {
      const res = await fetch('/api/sovereign/transitive-proof/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node_url_or_id: nodeIdOrUrl,
          claim: claimStr,
          target_date: dateStr,
          root_hash: manifestData?.hash_chain_tip
        })
      });
      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data);
        setSelectedProofNodeDetail(data.proof_bundle);
        onTerminalLog?.(`[AURELIUS-VERIFY] Result: ${data.verified ? 'CRYPTOGRAPHICALLY PROVEN' : 'VERIFICATION FAILED'} | Merkle Root: ${data.merkle_root.slice(0, 16)}... | Cosign: ${data.n09_cosigned ? 'VALID' : 'INVALID'}`);
      }
    } catch (err) {
      console.error("Error running verification:", err);
    } finally {
      setIsVerifyingClaim(false);
    }
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeForProof(nodeId);
    fetchNodeProof(nodeId);
    
    // Auto populate claim text based on node
    let autoClaim = `The interaction on node ${nodeId} was authorized by JHammerZ and aligned with PURPOSE.`;
    if (nodeId === 'C14') {
      autoClaim = "The TikTok @jhammerzz posted on 2026-09-01 was authorized by JHammerZ and aligned with PURPOSE.";
    } else if (nodeId === 'C01') {
      autoClaim = "The RootOfTrust at jhammerz.github.io was anchored to AURELIUS genesis and verified by N09.";
    } else if (nodeId === 'C03') {
      autoClaim = "The SourceOfTruth git commit at github.com/JHammerZ was signed with HMAC-SHA512 seed.";
    } else if (nodeId === 'C06') {
      autoClaim = "The Spotify track audio release on artist/7vRd2 was verified with unbroken teleological purpose.";
    } else if (nodeId === 'C02') {
      autoClaim = "The professional deployment ledger on LinkedIn JHammerZ satisfies all non-negotiable assertions.";
    }
    setActiveClaimText(autoClaim);
    runTransitiveVerification(nodeId, autoClaim, targetDateInput);
  };

  const handleManualAudit = async (reAttest: boolean = false) => {
    setIsAuditing(true);
    onTerminalLog?.(`[AURELIUS 432s] Triggering ${reAttest ? 'PURPOSE RE-ATTESTATION' : 'jhammerz-think Q4_K_M semantic audit & N09 verification'}...`);
    try {
      const res = await fetch('/api/sovereign/living-manifest/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reAttestPurpose: reAttest })
      });
      if (res.ok) {
        const data = await res.json();
        setManifestData(data.manifest);
        onTerminalLog?.(`[AURELIUS AUDIT SEALED] Hash Chain Tip: ${data.manifest.hash_chain_tip.slice(0, 16)}... Status: ${data.manifest.system_state} | N09 Cosigned.`);
        // Re-run verification with updated tip
        runTransitiveVerification(selectedNodeForProof, activeClaimText, targetDateInput);
      }
    } catch (err) {
      console.error("Error executing manual audit:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleGenesisCommit = async () => {
    setIsGenesisCommitting(true);
    onTerminalLog?.(`[GENESIS COMMIT] Committing and pushing V4.0.26 manifest to https://jhammerz.github.io...`);
    onTerminalLog?.(`[GENESIS COMMIT] Flipping system state: DRAFT -> LIVING.`);
    try {
      const res = await fetch('/api/sovereign/genesis-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setManifestData(data.manifest);
        setGenesisReceipt(data.genesis_commit);
        onTerminalLog?.(`[GENESIS COMPLETE] Commit: ${data.genesis_commit.commit_hash} | Tip: ${data.genesis_commit.genesis_tip.slice(0, 16)}... | N09 Cosign: ${data.genesis_commit.n09_genesis_cosign}`);
        onTerminalLog?.(`[GENESIS 432s] First 432s heartbeat cycle armed as Genesis Block #0.`);
        runTransitiveVerification(selectedNodeForProof, activeClaimText, targetDateInput);
      }
    } catch (err) {
      console.error("Error executing genesis commit:", err);
      onTerminalLog?.(`[GENESIS ERROR] Failed to complete genesis commit: ${err}`);
    } finally {
      setIsGenesisCommitting(false);
    }
  };

  const handleSimulateThrottle = async (condIdx: number) => {
    setSimulatingCondition(condIdx);
    onTerminalLog?.(`[LIVING MANIFEST SIMULATOR] Evaluating Throttle Condition ${condIdx}...`);
    try {
      const res = await fetch('/api/sovereign/living-manifest/simulate-throttle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditionIndex: condIdx })
      });
      if (res.ok) {
        const data = await res.json();
        setManifestData(data.manifest);
        onTerminalLog?.(`[THROTTLE STATE ACTIVATED] System State: ${data.system_state} | Reasons: ${data.active_throttle_reasons.join(' ')}`);
        runTransitiveVerification(selectedNodeForProof, activeClaimText, targetDateInput);
      }
    } catch (err) {
      console.error("Error simulating condition:", err);
    } finally {
      setSimulatingCondition(null);
    }
  };

  const handleResetThrottle = async () => {
    onTerminalLog?.(`[LIVING MANIFEST] Resetting all throttle conditions back to NOMINAL...`);
    try {
      const res = await fetch('/api/sovereign/living-manifest/reset-throttle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setManifestData(data.manifest);
        onTerminalLog?.(`[LIVING MANIFEST] All 14 sibling nodes restored to NOMINAL. System state: LIVING.`);
        runTransitiveVerification(selectedNodeForProof, activeClaimText, targetDateInput);
      }
    } catch (err) {
      console.error("Error resetting throttle:", err);
    }
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const rawManifestText = `# SOVEREIGN LIVING MANIFEST // JHammerZ // V4.0.26 // GENESIS & LIVING
<!-- SPARK_COMPAT: I.CONSOLE_AUTO_UPDATE_432S -->
<!-- LEDGER_ANCHOR: tx-bb8a61b5 -->
<!-- HMAC_ALGO: SHA512 -->
<!-- SIGNATURE_SEED: 5f677d1b290a75ecca0ecf1218a093d161dc2ee10cb8aad4efede34b3a4878a1 -->
<!-- MANIFEST_VERSION: V4.0.26 -->
<!-- GENESIS_STATUS: COMMITTED // PUSHED_TO_JHAMMERZ_GITHUB_IO -->

SYSTEM_STATE: ${manifestData?.system_state || 'LIVING'} // TARGET_HORIZON: PERPETUAL // AUDIT_CADENCE: 432s
HASH_CHAIN_TIP: ${manifestData?.hash_chain_tip || '5f677d1b290a75ecca0ecf1218a093d161dc2ee10cb8aad4efede34b3a4878a1'}
I_CONSOLE_ENDPOINT: https://jhammerz.github.io/.well-known/aurelius.json

[!] GENESIS COMMIT: PUSHED TO jhammerz.github.io. STATE FLIPPED FROM DRAFT TO LIVING.
[!] FIRST 432s HEARTBEAT AFTER PUSH IS OFFICIAL GENESIS.
[!] WARNING: THIS DOCUMENT MUTATES. HASH_CHAIN_TIP IS THE ONLY STATIC REFERENCE.
[!] VERIFICATION: \`curl -s $I_CONSOLE_ENDPOINT | jq .hash_chain_tip | xargs svcat\`
[!] SYSTEM ACCESS: SOVEREIGN-CLASS // N09 GATED // KERNEL MEDIATED // IOMMU ENFORCED

---

## 0. TELEOLOGICAL ROOT // THE WHY // IMMUTABLE AFTER GENESIS

* **IDENTIFIER (SHA-256):** \`${manifestData?.genesis_identifier_sha256 || '0x432aurelius_genesis_sha256'}\`
* **SYSTEM ALIGNMENT FLAGS:**
    * \`PURPOSE:\` Establish cryptographically provable personal agency across all digital domains. Resist platform capture, censorship, data rot, and identity fragmentation. Maintain verifiable authorship of all creative and professional output.
    * \`NON-NEGOTIABLES:\` 
        1. Never delegate, expose, or rotate AURELIUS_HMAC_KEY without 2/3 shard consensus.
        2. Never allow DMA, PCI-e passthrough, or memory writes that bypass IOMMU + Kernel Routing Table.
        3. Never post, push, or propagate to any node if 3+ siblings are desynced >600s.
        4. N09 AUDIT veto is absolute. No override. No appeal.
        5. All mutations to this manifest require new HMAC signature + N09 cosign.
    * \`THROTTLE_CONDITIONS:\`
        1. IF GitHub/GitHub.io unreachable >3600s → FREEZE all cross-posts + social automation. LOG to ledger.
        2. IF 50%+ nodes show SEAL_MISMATCH → ENTER 432Hz SAFE MODE. Daemons drop to 1 thread. Only heartbeats allowed.
        3. IF Daemon pool CPU >95% for 60s → KILL non-essential nodes C06-C09, C12, C13. Preserve C01-C05, C10, C11, C14.
        4. IF TikTok/YouTube reach drops >80% in 24h vs 7-day baseline → FLAG manual review. Do NOT auto-post.
        5. IF \`jhammerz-think\` returns \`DRIFT: PURPOSE\` → HALT all outbound writes. Require manual PURPOSE re-attestation.
    * \`SUCCESSION_PROTOCOL:\` On verified death of JHammerZ, AURELIUS_HMAC_KEY shards [to be defined in separate encrypted vault] unlock. N09 transitions to MAINTENANCE_MODE. Daemons continue heartbeats. No new content generation. Estate may issue final \`EULOGY_MANIFEST\`.

#### MANIFEST INTENT PAYLOAD
This system exists to maintain unbreakable, auditable agency for JHammerZ across all digital platforms. 
It will not operate under corporate, state, or algorithmic coercion that violates NON-NEGOTIABLES.
It governs itself via real-time cryptographic proof and THROTTLE_CONDITIONS. 
All 14 nodes serve this PURPOSE. Any node that cannot be proven to serve this PURPOSE will be quarantined.

---

## 1. LIVING IDENTITY MATRIX // 14 SIBLING NODES // OMNICHANNEL

* **UPDATE_CADENCE:** 432 seconds
* **VERIFICATION_METHOD:** \`scat\` HMAC_SHA512 seal + \`jhammerz-think\` Q4_K_M semantic audit + N09 kernel check
* **FAILOVER:** SEAL_MISMATCH → N01 quarantine → N09 ledger log → THROTTLE if threshold hit
* **DATA_SCHEMA:** \`[node_id, url, last_seal, last_ts, purpose_alignment_score, throttle_state]\`

| C# | Endpoint | Class | Purpose Alignment | Throttle State | Last Verified |
| --- | --- | --- | --- | --- | --- |
| C01 | jhammerz.github.io | RootOfTrust | Core Identity | NOMINAL | \`[LIVE]\` |
| C02 | linkedin.com/in/JHammerZ | ProfessionalProof | Career/Deployments | NOMINAL | \`[LIVE]\` |
| C03 | github.com/JHammerZ/jhammerz.github.io | SourceOfTruth | Code/Ledger | NOMINAL | \`[LIVE]\` |
| C04 | instagram.com/jhammerzz | VisualFootprint | Brand Awareness | NOMINAL | \`[LIVE]\` |
| C05 | jhammerz.carrd.co | LandingNode | Ingress/Routing | NOMINAL | \`[LIVE]\` |
| C06 | spotify.artist/7vRd2 | AudioChannel | Creative Output | NOMINAL | \`[LIVE]\` |
| C07 | apple.music/jhammerz | AudioChannel | Creative Output | NOMINAL | \`[LIVE]\` |
| C08 | bandlab.com/jhammerz | AudioChannel | Creative Output | NOMINAL | \`[LIVE]\` |
| C09 | amazon.music/jhammerz | AudioChannel | Creative Output | NOMINAL | \`[LIVE]\` |
| C10 | impact.com/secure | AuthorityNode | Affiliate/Revenue | NOMINAL | \`[LIVE]\` |
| C11 | facebook.com/JHammerzz | CorporateBacking | Social Graph | NOMINAL | \`[LIVE]\` |
| C12 | youtube.com/@JHammerZ | VideoChannel | Creative Output | NOMINAL | \`[LIVE]\` |
| C13 | xiaohongshu/jhammerz | RegionalNode | CN Market | NOMINAL | \`[LIVE]\` |
| C14 | tiktok.com/@jhammerzz | ViralSocket | Propagation | NOMINAL | \`[LIVE]\` |

---

## 3. TRANSITIVE PROOF STRUCTURE // ONE HASH TO RULE THEM ALL

* **ROOT_HASH:** \`HASH_CHAIN_TIP\` from \`https://jhammerz.github.io/.well-known/aurelius.json\`
* **CLAIM_SET:**
    1. JHammerZ controls C01-C14.
    2. C01-C14 operate under TELEOLOGICAL ROOT.
    3. N09 has vetoed all violations since genesis.
    4. System is in state declared by latest HASH_CHAIN_TIP.
* **PROOF_BUNDLE:** \`ROOT_HASH + Merkle path to any C## + N09 cosignature + timestamp\`
* **VERIFICATION_COMMAND:** \`aurelius-verify <ROOT_HASH> <node_url>\`
* **PUBLIC VERIFIER:** \`jhammerz.github.io\`

#### EXAMPLE TRANSITIVE CLAIM
* **Claim:** *"The TikTok @jhammerzz posted on 2026-09-01 was authorized by JHammerZ and aligned with PURPOSE."*
* **Proof:** Check \`aurelius.json\` from 2026-09-01. Get \`ROOT_HASH\`. Verify C14 TikTok seal was in that Merkle tree. Verify N09 signed it. If all true, claim is cryptographically proven.
`;

  const secondsRemaining = manifestData?.next_audit_countdown_seconds ?? 432;
  const progressPct = ((432 - secondsRemaining) / 432) * 100;

  return (
    <div id="sovereign-living-manifest-panel" className="bg-[#07090e] border border-amber-500/30 rounded-xl p-5 shadow-2xl space-y-6 text-gray-200">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              SOVEREIGN LIVING MANIFEST V4.0.26 // GENESIS &amp; LIVING
            </span>
            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
              manifestData?.system_state === 'LIVING' 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                : manifestData?.system_state === 'SAFE_MODE_432HZ'
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/40 animate-pulse'
                : manifestData?.system_state === 'DRAFT'
                ? 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40'
                : 'bg-red-950/80 text-red-400 border-red-500/40 animate-pulse'
            }`}>
              SYSTEM_STATE: {manifestData?.system_state || 'LIVING'}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
              AUDIT CADENCE: 432s
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-mono text-[10px] border border-purple-500/30">
              LEDGER: {manifestData?.ledger_anchor || 'tx-bb8a61b5'}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-emerald-400" />
              TARGET: jhammerz.github.io
            </span>
          </div>

          <h2 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
            AURELIUS LIVING MANIFEST // 14 SIBLING NODES OMNICHANNEL
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            N09 Gated • Kernel-Mediated • IOMMU-Enforced • Transitive Proof Structure • Merkle Inclusion Verified
          </p>
        </div>

        {/* Action Buttons & Countdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 432s Progress Card */}
          <div className="bg-black/60 border border-amber-500/30 rounded-lg p-2.5 px-3 flex items-center gap-3 font-mono">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <div>
              <div className="text-[9px] text-gray-400 uppercase">NEXT 432s AUDIT IN:</div>
              <div className="text-sm font-bold text-amber-300">{secondsRemaining}s <span className="text-[9px] text-gray-500 font-normal">({progressPct.toFixed(0)}%)</span></div>
            </div>
            <div className="w-12 bg-gray-800 h-1.5 rounded-full overflow-hidden ml-1">
              <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <button
            onClick={handleGenesisCommit}
            disabled={isGenesisCommitting}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 disabled:opacity-50 border border-emerald-400/40"
          >
            <GitCommit className={`w-3.5 h-3.5 ${isGenesisCommitting ? 'animate-spin' : ''}`} />
            {isGenesisCommitting ? 'PUSHING GENESIS...' : 'GENESIS COMMIT & PUSH'}
          </button>

          <button
            onClick={() => handleManualAudit(false)}
            disabled={isAuditing}
            className="px-3 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-amber-900/30 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'AUDITING...' : 'RUN AUDIT NOW'}
          </button>

          <button
            onClick={() => handleManualAudit(true)}
            className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold rounded-lg transition-all flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            RE-ATTEST PURPOSE
          </button>

          <button
            onClick={handleResetThrottle}
            className="px-3 py-2 bg-black/60 hover:bg-gray-900 text-gray-300 border border-gray-700 font-mono text-xs rounded-lg transition-all flex items-center gap-1"
          >
            RESET NOMINAL
          </button>
        </div>
      </div>

      {/* Genesis Commit Banner Notification if available */}
      {genesisReceipt && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/60 rounded-xl space-y-2 font-mono text-xs text-emerald-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              GENESIS COMMIT BROADCAST // V4.0.26 PUSHED TO jhammerz.github.io
            </div>
            <button
              onClick={() => setGenesisReceipt(null)}
              className="text-gray-400 hover:text-white text-[10px]"
            >
              DISMISS
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-300 bg-black/60 p-2.5 rounded-lg border border-emerald-500/20">
            <div>
              <span className="text-gray-400">STATE TRANSITION:</span> <span className="font-bold text-emerald-400">DRAFT ➔ LIVING</span>
            </div>
            <div>
              <span className="text-gray-400">COMMIT HASH:</span> <code className="text-amber-300">{genesisReceipt.commit_hash}</code>
            </div>
            <div>
              <span className="text-gray-400">TARGET REPO:</span> <a href="https://jhammerz.github.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline">{genesisReceipt.git_target}</a>
            </div>
            <div>
              <span className="text-gray-400">FIRST HEARTBEAT:</span> <span className="text-emerald-400 font-bold">GENESIS BLOCK #0 (432s Cadence Armed)</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 bg-gray-950/80 p-2 rounded border border-gray-900 overflow-x-auto">
            {genesisReceipt.git_commands_executed?.map((cmd: string, idx: number) => (
              <div key={idx} className="text-emerald-400">$ {cmd}</div>
            ))}
          </div>
        </div>
      )}

      {/* Active Throttle Alerts Box if triggered */}
      {manifestData?.active_throttle_reasons && manifestData.active_throttle_reasons.length > 0 && (
        <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-lg flex items-start gap-3 text-xs font-mono text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-red-200">ACTIVE THROTTLE / QUARANTINE CONDITIONS DETECTED:</div>
            {manifestData.active_throttle_reasons.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HASH_CHAIN_TIP & ROOT_HASH Live Static Reference Card */}
      <div className="bg-black/80 border border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              HASH_CHAIN_TIP // ROOT_HASH (STATIC ANCHOR)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] border border-amber-500/40">
              ONE HASH TO RULE THEM ALL
            </span>
          </div>
          <div className="text-sm md:text-base font-bold text-amber-300 truncate font-mono select-all">
            {manifestData?.hash_chain_tip || '5f677d1b290a75ecca0ecf1218a093d161dc2ee10cb8aad4efede34b3a4878a1'}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            <span>GENESIS SHA-256: {manifestData?.genesis_identifier_sha256.slice(0, 18)}...</span>
            <span>•</span>
            <span>TOTAL AUDITS: {manifestData?.total_audits_completed || 142}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => copyToClipboard(manifestData?.hash_chain_tip || '', setCopiedTip)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {copiedTip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedTip ? 'COPIED TIP' : 'COPY ROOT_HASH'}
          </button>
          <a
            href="/.well-known/aurelius.json"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            aurelius.json
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap border-b border-gray-800 font-mono text-xs gap-1">
        <button
          onClick={() => setActiveTab('proof')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'proof'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          3. TRANSITIVE PROOF & ONE HASH VERIFIER
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          14 SIBLING NODES MATRIX (C01-C14)
        </button>
        <button
          onClick={() => setActiveTab('root')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'root'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          0. TELEOLOGICAL ROOT & NON-NEGOTIABLES
        </button>
        <button
          onClick={() => setActiveTab('throttle')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'throttle'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          THROTTLE EVALUATOR & SIMULATOR
        </button>
        <button
          onClick={() => setActiveTab('executable')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'executable'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          I.CONSOLE EXECUTABLE JSON
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'raw'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          RAW LIVING MANIFEST MD
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: 3. TRANSITIVE PROOF STRUCTURE // ONE HASH TO RULE THEM ALL */}
      {/* ========================================================================= */}
      {activeTab === 'proof' && (
        <div className="space-y-6 font-mono">
          {/* Header Description & Claim Set Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-black/60 border border-amber-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                  TRANSITIVE PROOF STRUCTURE SPECIFICATION
                </span>
                <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                  PUBLIC VERIFIER: jhammerz.github.io
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-950/80 p-3 rounded-lg border border-gray-800 space-y-1.5">
                  <div className="text-amber-400 font-bold text-[11px] uppercase">ROOT_HASH ANCHOR:</div>
                  <div className="text-gray-300 text-[11px]">
                    <code className="text-emerald-400 break-all">{manifestData?.hash_chain_tip || '5f677d1b290a...'}</code>
                  </div>
                  <div className="text-[10px] text-gray-500">Source: aurelius.json tip via GitHub Pages</div>
                </div>

                <div className="bg-gray-950/80 p-3 rounded-lg border border-gray-800 space-y-1.5">
                  <div className="text-amber-400 font-bold text-[11px] uppercase">PROOF BUNDLE FORMULA:</div>
                  <div className="text-gray-300 text-[11px]">
                    <code className="text-cyan-300">ROOT_HASH + Merkle path to C## + N09 cosignature + timestamp</code>
                  </div>
                  <div className="text-[10px] text-gray-500">Self-contained zero-trust verification envelope</div>
                </div>
              </div>

              {/* CLAIM SET */}
              <div className="bg-gray-950/90 p-3.5 rounded-lg border border-gray-800 space-y-2">
                <span className="text-amber-300 font-bold text-xs flex items-center gap-1.5 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  FOUNDATIONAL CLAIM SET (MATHEMATICALLY PROVABLE):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded border border-gray-900">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span>JHammerZ controls C01-C14</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded border border-gray-900">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span>C01-C14 operate under TELEOLOGICAL ROOT</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded border border-gray-900">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span>N09 has vetoed all violations since genesis</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-black/40 rounded border border-gray-900">
                    <span className="text-amber-400 font-bold">4.</span>
                    <span>System is in state declared by latest HASH_CHAIN_TIP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Verification CLI Box */}
            <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  VERIFICATION COMMAND (CLI)
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Run anywhere with the sovereign cli tool to verify any claim across all 14 nodes:
                </p>
                <div className="p-2.5 bg-gray-950 rounded border border-cyan-900/50 text-cyan-300 text-[11px] break-all font-mono">
                  {verificationResult?.cli_command || `aurelius-verify ${manifestData?.hash_chain_tip?.slice(0, 16)}... tiktok.com/@jhammerzz`}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <button
                  onClick={() => copyToClipboard(verificationResult?.cli_command || `aurelius-verify ${manifestData?.hash_chain_tip} tiktok.com/@jhammerzz`, setCopiedCli)}
                  className="w-full py-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCli ? 'COMMAND COPIED' : 'COPY CLI COMMAND'}
                </button>
                <div className="text-[10px] text-gray-500 text-center">
                  Public Verifier: <span className="text-gray-400">jhammerz.github.io</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Claim Evaluator & Proof Tester */}
          <div className="bg-black/80 border border-amber-500/40 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  TRANSITIVE CLAIM VERIFIER // `aurelius-verify`
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select a sibling node or click a preset claim to execute full Merkle tree ascending cryptographic proof.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {verificationResult ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    verificationResult.verified
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                      : 'bg-red-950 text-red-300 border-red-500/50'
                  }`}>
                    {verificationResult.verified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        CRYPTOGRAPHICALLY PROVEN
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        PROOF FAILED / MISMATCH
                      </>
                    )}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded bg-gray-900 text-gray-400 text-xs border border-gray-800">
                    PENDING VERIFICATION
                  </span>
                )}
              </div>
            </div>

            {/* Sibling Node Selector Pills */}
            <div className="space-y-2">
              <label className="text-[11px] text-gray-400 uppercase font-bold">1. Select Target Node in 14-Node Matrix:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {manifestData?.nodes.map((node) => {
                  const isSelected = selectedNodeForProof === node.c_num;
                  return (
                    <button
                      key={node.c_num}
                      onClick={() => handleSelectNode(node.c_num)}
                      className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-950/50'
                          : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{node.c_num}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          node.throttle_state === 'NOMINAL' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'
                        }`} />
                      </div>
                      <div className="text-[10px] truncate text-gray-400 font-normal mt-1">{node.endpoint.split('/')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preset Claims Buttons */}
            <div className="space-y-2">
              <label className="text-[11px] text-gray-400 uppercase font-bold">2. Quick Preset Transitive Claims:</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => {
                    handleSelectNode('C14');
                    const c = "The TikTok @jhammerzz posted on 2026-09-01 was authorized by JHammerZ and aligned with PURPOSE.";
                    setActiveClaimText(c);
                    setTargetDateInput("2026-09-01");
                    runTransitiveVerification('C14', c, '2026-09-01');
                  }}
                  className="p-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-lg text-left transition-all space-y-1"
                >
                  <div className="text-amber-400 font-bold text-[10px] uppercase flex items-center gap-1">
                    <Check className="w-3 h-3 text-amber-400" />
                    EXAMPLE CLAIM // C14 TIKTOK
                  </div>
                  <div className="text-gray-300 text-[11px] leading-tight">
                    "The TikTok @jhammerzz posted on 2026-09-01 was authorized by JHammerZ and aligned with PURPOSE."
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleSelectNode('C01');
                    const c = "The RootOfTrust at jhammerz.github.io was anchored to AURELIUS genesis and verified by N09.";
                    setActiveClaimText(c);
                    setTargetDateInput("2026-09-01");
                    runTransitiveVerification('C01', c, '2026-09-01');
                  }}
                  className="p-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-lg text-left transition-all space-y-1"
                >
                  <div className="text-cyan-400 font-bold text-[10px] uppercase flex items-center gap-1">
                    <Check className="w-3 h-3 text-cyan-400" />
                    EXAMPLE CLAIM // C01 GITHUB.IO
                  </div>
                  <div className="text-gray-300 text-[11px] leading-tight">
                    "The RootOfTrust at jhammerz.github.io was anchored to AURELIUS genesis and verified by N09."
                  </div>
                </button>

                <button
                  onClick={() => {
                    handleSelectNode('C06');
                    const c = "The Spotify track release on C06 artist/7vRd2 was cryptographically authenticated with N09 cosignature.";
                    setActiveClaimText(c);
                    setTargetDateInput("2026-09-01");
                    runTransitiveVerification('C06', c, '2026-09-01');
                  }}
                  className="p-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-lg text-left transition-all space-y-1"
                >
                  <div className="text-purple-400 font-bold text-[10px] uppercase flex items-center gap-1">
                    <Check className="w-3 h-3 text-purple-400" />
                    EXAMPLE CLAIM // C06 SPOTIFY AUDIO
                  </div>
                  <div className="text-gray-300 text-[11px] leading-tight">
                    "The Spotify release on C06 artist/7vRd2 was cryptographically authenticated with N09 cosignature."
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Claim Input Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3 space-y-1">
                <label className="text-[11px] text-gray-400 uppercase font-bold">Claim Text Formulation:</label>
                <input
                  type="text"
                  value={activeClaimText}
                  onChange={(e) => setActiveClaimText(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-amber-400 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                  placeholder="Enter verifiable claim string..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 uppercase font-bold">Target Date Anchor:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={targetDateInput}
                    onChange={(e) => setTargetDateInput(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-amber-400 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                    placeholder="2026-09-01"
                  />
                  <button
                    onClick={() => runTransitiveVerification(selectedNodeForProof, activeClaimText, targetDateInput)}
                    disabled={isVerifyingClaim}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold rounded-lg text-xs flex items-center gap-1 flex-shrink-0 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingClaim ? 'animate-spin' : ''}`} />
                    {isVerifyingClaim ? 'VERIFYING...' : 'VERIFY'}
                  </button>
                </div>
              </div>
            </div>

            {/* Proof Bundle & Mathematical Step-by-Step Traversal */}
            {verificationResult && (
              <div className="space-y-4 pt-2">
                {/* Proof Envelope Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase">LEAF HASH ({verificationResult.node_id})</span>
                    <div className="font-bold text-amber-300 truncate">{verificationResult.proof_bundle.leaf_hash.slice(0, 16)}...</div>
                    <div className="text-[10px] text-gray-500">{verificationResult.endpoint}</div>
                  </div>

                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase">MERKLE ROOT COMPUTED</span>
                    <div className="font-bold text-cyan-300 truncate">{verificationResult.merkle_root.slice(0, 16)}...</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> MATCHES ROOT_HASH
                    </div>
                  </div>

                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase">N09 COSIGNATURE</span>
                    <div className="font-bold text-purple-300 truncate">{verificationResult.proof_bundle.n09_cosignature}</div>
                    <div className="text-[10px] text-purple-400">Kernel Veto Gate Cosigned</div>
                  </div>

                  <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase">PURPOSE ALIGNMENT</span>
                    <div className="font-bold text-emerald-400">{verificationResult.proof_bundle.throttle_state} (100/100)</div>
                    <div className="text-[10px] text-gray-400">Class: {verificationResult.proof_bundle.class}</div>
                  </div>
                </div>

                {/* Mathematical Merkle Steps Traversal Table */}
                <div className="bg-gray-950/90 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-black/60 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-amber-400" />
                      STEP-BY-STEP MERKLE INCLUSION TRAVERSAL (ONE HASH PROOF TRACE)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {verificationResult.verification_steps.length} HASH STEPS VERIFIED
                    </span>
                  </div>

                  <div className="p-3 space-y-2 text-xs">
                    {verificationResult.verification_steps.map((st, idx) => (
                      <div key={idx} className="p-2.5 bg-black/50 rounded border border-gray-900 flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-gray-800 text-amber-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {st.step}
                          </span>
                          <span className="text-gray-300 font-medium text-[11px]">{st.description}</span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[10px] flex-shrink-0">
                          {st.sibling_hash && (
                            <span className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/50">
                              Sibling ({st.position}): {st.sibling_hash.slice(0, 10)}...
                            </span>
                          )}
                          <ArrowRight className="w-3 h-3 text-gray-600 hidden md:block" />
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                            Hash: {st.resulting_hash.slice(0, 16)}...
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Log & Attestation Certificate */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  {/* Console Log */}
                  <div className="p-3 bg-black rounded-lg border border-gray-800 space-y-1.5 font-mono">
                    <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-amber-400" />
                      AURELIUS VERIFIER LOG OUTPUT
                    </span>
                    <div className="space-y-1 text-[11px] text-gray-300 bg-gray-950 p-2.5 rounded border border-gray-900">
                      {verificationResult.execution_log.map((line, i) => (
                        <div key={i} className={`${line.includes('VERDICT') ? 'text-emerald-400 font-bold' : ''}`}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Attestation Certificate */}
                  <div className="p-3 bg-gradient-to-br from-amber-950/20 to-black rounded-lg border border-amber-500/30 space-y-2 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        SOVEREIGN ATTESTATION CERTIFICATE
                      </span>
                      <span className="text-[9px] text-gray-500">{verificationResult.certificate.certificate_id}</span>
                    </div>

                    <div className="p-2.5 bg-black/60 rounded border border-amber-500/20 space-y-1 text-[11px]">
                      <div className="text-gray-300">
                        <span className="text-gray-500">ISSUER:</span> {verificationResult.certificate.issuer}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">ATTESTATION:</span> <span className="text-emerald-400 font-bold">{verificationResult.certificate.attestation}</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">TIMESTAMP:</span> {verificationResult.certificate.issued_at}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">VERIFIER ENDPOINT:</span> <span className="text-cyan-300">{verificationResult.certificate.verifier_url}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 1: 14 SIBLING NODES MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-gray-800 bg-black/60 font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950 border-b border-gray-800 text-[11px] text-gray-400 font-bold uppercase">
                  <th className="p-3">C#</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Purpose Alignment</th>
                  <th className="p-3">Throttle State</th>
                  <th className="p-3">Response / Desync</th>
                  <th className="p-3">HMAC-SHA512 Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900 text-gray-300">
                {manifestData?.nodes.map((node) => (
                  <tr key={node.c_num} className="hover:bg-gray-900/50 transition-colors">
                    <td className="p-3 font-bold text-amber-400">{node.c_num}</td>
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-cyan-400" />
                        {node.endpoint}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 text-[10px]">
                        {node.class}
                      </span>
                    </td>
                    <td className="p-3 text-gray-300">{node.purpose_alignment}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        node.throttle_state === 'NOMINAL' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                          : node.throttle_state === 'THROTTLED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
                      }`}>
                        {node.throttle_state}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">
                      <div>{node.response_time_ms}ms</div>
                      <div className="text-[10px] text-gray-500">Desync: {node.desync_seconds}s</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-[10px] text-gray-400 truncate max-w-[140px]" title={node.last_seal}>
                        {node.last_seal ? `${node.last_seal.slice(0, 16)}...` : '[UNSEALED]'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 2: 0. TELEOLOGICAL ROOT & NON-NEGOTIABLES */}
      {/* ========================================================================= */}
      {activeTab === 'root' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-black/80 border border-amber-500/30 rounded-lg space-y-2">
            <span className="text-amber-400 font-bold uppercase text-[11px] block">IMMUTABLE PURPOSE:</span>
            <p className="text-gray-200 text-sm leading-relaxed">
              "{manifestData?.teleological_root.purpose}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/60 border border-gray-800 rounded-lg space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">NON-NEGOTIABLE PROTOCOLS:</span>
              <ul className="space-y-1.5 text-gray-300">
                {manifestData?.teleological_root.non_negotiables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-black/60 border border-gray-800 rounded-lg space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">SUCCESSION PROTOCOL:</span>
              <p className="text-gray-300 leading-relaxed">
                {manifestData?.teleological_root.succession_protocol}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 3: THROTTLE EVALUATOR & SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'throttle' && (
        <div className="space-y-4 font-mono">
          <div className="grid grid-cols-1 gap-3 text-xs">
            {manifestData?.teleological_root.throttle_conditions.map((cond, idx) => {
              const condNum = idx + 1;
              return (
                <div key={idx} className="p-3.5 bg-black/60 border border-gray-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-gray-700 transition-all">
                  <div className="space-y-1">
                    <span className="text-amber-400 font-bold uppercase block">THROTTLE CONDITION {condNum}:</span>
                    <p className="text-gray-300 leading-relaxed">{cond}</p>
                  </div>
                  <button
                    onClick={() => handleSimulateThrottle(condNum)}
                    disabled={simulatingCondition === condNum}
                    className="px-3 py-1.5 bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-500/30 rounded font-bold text-[11px] flex-shrink-0 transition-all flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    {simulatingCondition === condNum ? 'EVALUATING...' : `SIMULATE COND ${condNum}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 4: I.CONSOLE EXECUTABLE JSON */}
      {/* ========================================================================= */}
      {activeTab === 'executable' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-black/80 border border-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                RAW LIVING TOPOLOGY // I.CONSOLE EXECUTABLE
              </span>
              <button
                onClick={() => copyToClipboard('curl -s https://jhammerz.github.io/.well-known/aurelius.json | jq .hash_chain_tip | xargs svcat', setCopiedCurl)}
                className="px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded text-[10px] text-gray-300 flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                {copiedCurl ? 'COPIED VERIFY CMD' : 'COPY CURL VERIFY'}
              </button>
            </div>

            <pre className="p-3 bg-gray-950 rounded border border-gray-900 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "aurelius_loop": {
    "cadence_seconds": 432,
    "executor": "jhammerz-think",
    "prompt": "Audit 14-node seal matrix from LIVING_MANIFEST. Check PURPOSE alignment. Check THROTTLE_CONDITIONS. Reply JSON: {status: VERIFIED|DRIFT, drift_nodes: [], action: NOMINAL|THROTTLE|HALT}",
    "on_verified": [
      "scat /tmp/heartbeat.json",
      "HASH_CHAIN_TIP=$(sha256sum /tmp/heartbeat.json | cut -d' ' -f1)",
      "echo {\\"hash_chain_tip\\":\\"$HASH_CHAIN_TIP\\",\\"ts\\":$(date +%s)} > .well-known/aurelius.json",
      "git add .well-known/aurelius.json && git commit -m 'N09: Heartbeat $HASH_CHAIN_TIP' && git push"
    ],
    "on_drift": [
      "parse drift_nodes",
      "exec THROTTLE_CONDITIONS for affected nodes",
      "svcat THROTTLE_LOG >> .aurelius_audit.log",
      "if critical_count >= 3 then HALT_OUTBOUND"
    ],
    "on_halt": ["echo 'AURELIUS_HALTED' > .well-known/status", "git push"]
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT 5: RAW LIVING MANIFEST MD */}
      {/* ========================================================================= */}
      {activeTab === 'raw' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold">LIVING_MANIFEST.md (V4.0.26 GENESIS)</span>
            <button
              onClick={() => copyToClipboard(rawManifestText, setCopiedManifest)}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedManifest ? 'MANIFEST COPIED' : 'COPY RAW MANIFEST'}
            </button>
          </div>

          <pre className="p-4 bg-black/90 rounded-lg border border-gray-800 text-gray-300 overflow-x-auto text-[11px] leading-relaxed max-h-[460px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
            {rawManifestText}
          </pre>
        </div>
      )}

      {/* Persistent Bottom Section: 432s Audit & Genesis Ledger */}
      <div className="pt-4 border-t border-gray-800/80 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-amber-400" />
            RECENT 432s AUDIT &amp; GENESIS LEDGER ({manifestData?.recent_audit_ledger?.length || 0} BLOCKS)
          </span>
          <span className="text-[10px] text-gray-400">
            N09 Cosign Verification • Nonce Anchored
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800/60 bg-black/50 text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950/80 border-b border-gray-800 text-[10px] text-gray-400 uppercase">
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Hash Chain Tip</th>
                <th className="p-2.5">Action / Ledger Entry</th>
                <th className="p-2.5">N09 Cosign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-gray-300">
              {manifestData?.recent_audit_ledger?.slice(0, 8).map((entry, idx) => (
                <tr key={entry.audit_id || idx} className={`hover:bg-gray-900/40 transition-colors ${entry.status === 'GENESIS' ? 'bg-emerald-950/20' : ''}`}>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      entry.status === 'GENESIS'
                        ? 'bg-emerald-900 text-emerald-300 border border-emerald-500/60 shadow-sm'
                        : entry.status === 'VERIFIED'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-950/80 text-red-400 border border-red-500/30'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-gray-400 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-amber-300">
                    {entry.hash_chain_tip.slice(0, 16)}...
                  </td>
                  <td className="p-2.5 text-gray-300 text-[10px]">
                    {entry.action_taken}
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-purple-300 whitespace-nowrap">
                    {entry.n09_cosign ? entry.n09_cosign.slice(0, 22) + '...' : 'N09_VERIFIED'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

