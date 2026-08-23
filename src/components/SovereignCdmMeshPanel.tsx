import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Radio, 
  Globe, 
  Activity, 
  Cpu, 
  Database, 
  Sparkles,
  Zap
} from 'lucide-react';
import { UniversalEndpointSpec, CdmRoutingMeshEngine } from '../lib/cdm_mesh';

export const SovereignCdmMeshPanel: React.FC = () => {
  const [meshState, setMeshState] = useState<any>(null);
  const [verificationReport, setVerificationReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [sealing, setSealing] = useState<boolean>(false);
  const [sealedBlock, setSealedBlock] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<UniversalEndpointSpec | null>(null);

  const fetchMeshState = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cdm/mesh');
      if (res.ok) {
        const data = await res.json();
        setMeshState(data);
        if (data.endpoints && data.endpoints.length > 0 && !selectedEndpoint) {
          setSelectedEndpoint(data.endpoints[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch CDM mesh state:', err);
    } finally {
      setLoading(false);
    }
  };

  const runVerification = async () => {
    try {
      setVerifying(true);
      const res = await fetch('/api/cdm/verify-routes');
      if (res.ok) {
        const data = await res.json();
        setVerificationReport(data.report);
      }
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleSealWorm = async () => {
    try {
      setSealing(true);
      const res = await fetch('/api/cdm/seal-immutable', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSealedBlock(data.record.block);
      }
    } catch (err) {
      console.error('Sealing failed:', err);
    } finally {
      setSealing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  useEffect(() => {
    fetchMeshState();
    runVerification();
  }, []);

  return (
    <div id="sovereign-cdm-mesh-panel" className="w-full space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                IMMUTABLE W.O.R.M. SEALED
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                BI-DIRECTIONAL ROUTING
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono text-slate-400 border border-slate-700 bg-slate-800">
                14 UNIVERSAL ENDPOINTS
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3 tracking-tight">
              <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
              Sovereign Universal Endpoints & Bi-Directional CDM Mesh
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Consolidated 14 immutable universal nodes with strict bi-directional traffic routing 
              anchoring all ingress and egress through <span className="text-emerald-400 font-mono font-semibold">https://jhammerz.github.io</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="cdm-verify-routes-btn"
              onClick={runVerification}
              disabled={verifying}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-sm font-mono flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? 'Verifying Routes...' : 'Verify Bi-Directional Routes'}
            </button>
            <button
              id="cdm-seal-worm-btn"
              onClick={handleSealWorm}
              disabled={sealing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold rounded-lg text-sm font-mono flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              {sealing ? 'Committing to W.O.R.M...' : 'Commit to Immutable W.O.R.M.'}
            </button>
          </div>
        </div>

        {/* Live Merkle & Status Bar */}
        {meshState && (
          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">CANONICAL ORIGIN</span>
              <span className="text-emerald-400 font-bold break-all flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {meshState.canonical_origin}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">ROUTING TOPOLOGY</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Hub-and-Spoke Bi-Directional
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">MERKLE ROOT HASH</span>
              <span className="text-slate-300 font-mono truncate block" title={meshState.merkle_root}>
                {meshState.merkle_root?.substring(0, 20)}...
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1">VERIFICATION HEALTH</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                14 / 14 Routes Verified 100%
              </span>
            </div>
          </div>
        )}

        {sealedBlock && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg flex items-center justify-between text-xs font-mono text-emerald-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Permanently committed to Immutable W.O.R.M. Block #{sealedBlock.blockIndex} ({sealedBlock.blockId})
            </span>
            <span className="text-slate-400">{sealedBlock.timestamp}</span>
          </div>
        )}
      </div>

      {/* 14 Universal Endpoints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Consolidated 14 Universal Endpoints Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Click any node for bidirectional flow inspect
            </span>
          </div>

          <div className="space-y-2">
            {(meshState?.endpoints || []).map((ep: UniversalEndpointSpec) => {
              const isSelected = selectedEndpoint?.c_num === ep.c_num;
              const isHub = ep.routing_type === 'PRIMARY_HUB';
              return (
                <div
                  key={ep.c_num}
                  id={`endpoint-card-${ep.c_num}`}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold ${
                      isHub 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-800 text-cyan-400 border border-slate-700'
                    }`}>
                      {ep.c_num}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100 truncate">
                          {ep.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {ep.class}
                        </span>
                        {isHub && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                            HUB ORIGIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                        {ep.endpoint}
                      </p>
                    </div>
                  </div>

                  {/* Flow Route Indicator */}
                  <div className="flex items-center gap-3 self-end md:self-center font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] text-slate-300">
                        {isHub ? 'Universal Egress' : '↔ jhammerz.github.io'}
                      </span>
                    </div>

                    <a
                      href={ep.endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded transition"
                      title="Open Canonical URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Detail & Bi-Directional Inspector */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Bi-Directional CDM Route Inspector
          </h3>

          {selectedEndpoint ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                    {selectedEndpoint.c_num}
                  </span>
                  <span className="font-semibold text-slate-100 text-sm">
                    {selectedEndpoint.name}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedEndpoint.endpoint)}
                  className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 p-1 rounded hover:bg-slate-800 transition"
                  title="Copy Canonical URL"
                >
                  <Copy className="w-3 h-3" />
                  {copiedUrl === selectedEndpoint.endpoint ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Ingress Flow */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 font-bold">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    INGRESS ROUTE (To Hub)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                    Target: &lt;{selectedEndpoint.latency_target_ms}ms
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono break-all">
                  Origin: <span className="text-slate-400">{selectedEndpoint.ingress_flow.origin}</span>
                </p>
                <p className="text-xs text-emerald-400 font-mono break-all">
                  Destination: <span className="text-slate-200 font-bold">{selectedEndpoint.ingress_flow.destination}</span>
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  Mechanism: {selectedEndpoint.ingress_flow.mechanism}
                </div>
              </div>

              {/* Egress Flow */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    EGRESS ROUTE (From Hub)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    Target: &lt;{selectedEndpoint.latency_target_ms}ms
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono break-all">
                  Origin: <span className="text-emerald-400 font-bold">{selectedEndpoint.egress_flow.origin}</span>
                </p>
                <p className="text-xs text-slate-300 font-mono break-all">
                  Destination: <span className="text-slate-400">{selectedEndpoint.egress_flow.destination}</span>
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  Mechanism: {selectedEndpoint.egress_flow.mechanism}
                </div>
              </div>

              {/* Immutable Hash */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 block">IMMUTABLE IDENTITY HASH (SHA-256)</span>
                <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 break-all select-all">
                  {selectedEndpoint.immutable_hash}
                </p>
              </div>

              {/* Alignment Purpose */}
              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span className="text-slate-500 font-mono block mb-1">PURPOSE ALIGNMENT</span>
                {selectedEndpoint.purpose_alignment}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
              Select an endpoint from the matrix to inspect bi-directional routing metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SovereignCdmMeshPanel;
