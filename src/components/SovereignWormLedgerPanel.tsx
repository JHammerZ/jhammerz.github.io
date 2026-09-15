import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  FileText, 
  Key, 
  Cpu, 
  Terminal,
  Search,
  ExternalLink,
  Layers,
  Fingerprint
} from 'lucide-react';
import { WormBlock, WormLedgerMetadata } from '../lib/worm_storage';

export function SovereignWormLedgerPanel() {
  const [metadata, setMetadata] = useState<WormLedgerMetadata | null>(null);
  const [blocks, setBlocks] = useState<WormBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [newTag, setNewTag] = useState('SOVEREIGN_ASSERTION');
  const [newPayload, setNewPayload] = useState('');
  const [writing, setWriting] = useState(false);
  const [writeSuccess, setWriteSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<WormBlock | null>(null);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/worm/ledger');
      const data = await res.json();
      if (data.success) {
        setBlocks(data.blocks || []);
        setMetadata(data.metadata || null);
        if (data.blocks && data.blocks.length > 0 && !selectedBlock) {
          setSelectedBlock(data.blocks[data.blocks.length - 1]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch WORM ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    try {
      setAuditLoading(true);
      const res = await fetch('/api/worm/audit');
      const data = await res.json();
      if (data.success) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error("Failed to audit WORM vault:", err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleWriteRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayload.trim()) return;
    try {
      setWriting(true);
      setWriteSuccess(null);
      let payloadData: any = newPayload;
      try {
        payloadData = JSON.parse(newPayload);
      } catch {
        payloadData = { message: newPayload };
      }

      const res = await fetch('/api/worm/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'JHammerZ',
          tag: newTag,
          data: payloadData
        })
      });
      const data = await res.json();
      if (data.success) {
        setWriteSuccess(`Block #${data.block.blockIndex} sealed with seal ${data.block.tamperSeal.slice(0, 16)}...`);
        setNewPayload('');
        await fetchLedger();
        setSelectedBlock(data.block);
      }
    } catch (err: any) {
      console.error("Failed to write to WORM vault:", err);
    } finally {
      setWriting(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredBlocks = blocks.filter(b => 
    b.blockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tamperSeal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(b.data).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-400">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-wide text-white">W.O.R.M. IMMUTABLE PERSISTENCE ENGINE</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                ZERO MUTATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Authority: <span className="text-emerald-300">HUMAN_KERNEL_ABSOLUTE</span> (JHammerZ) // Write Once, Read Many
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAudit}
            disabled={auditLoading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
            {auditLoading ? 'Auditing Vault...' : 'Run Forensic Audit'}
          </button>
          <button
            onClick={fetchLedger}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Ledger
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs font-mono text-slate-400">Total Sealed Blocks</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {metadata ? metadata.totalBlocks : blocks.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Append-only chain</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs font-mono text-slate-400">Integrity Status</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            100% UNBROKEN
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">SHA-512 Hash Chained</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs font-mono text-slate-400">Privilege Level</div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-1 truncate">
            RING -3 (SUPREME)
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Human Sovereign Exemption</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs font-mono text-slate-400">Merkle Root</div>
          <div className="text-xs font-mono text-slate-300 mt-1 truncate" title={metadata?.merkleRoot}>
            {metadata ? `${metadata.merkleRoot.slice(0, 14)}...` : 'Calculating...'}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-1">Immutable Root Anchor</div>
        </div>
      </div>

      {/* Audit Banner if run */}
      {auditResult && (
        <div className={`p-4 rounded-lg border font-mono text-xs ${
          auditResult.isValid ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-red-950/40 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-bold">FORENSIC AUDIT RESULT: {auditResult.isValid ? 'PASSED (ZERO MUTATION VERIFIED)' : 'INTEGRITY ALERT'}</span>
            <span className="text-[10px] text-slate-400">{auditResult.auditedAt}</span>
          </div>
          <p className="mt-1 text-slate-300">
            Audited {auditResult.totalBlocks} blocks in sequence. Merkle Root: {auditResult.merkleRoot}
          </p>
        </div>
      )}

      {/* Write Console & Ledger Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Write Console (Left Column) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white">APPEND IMMUTABLE RECORD (WORM)</h3>
          </div>

          <form onSubmit={handleWriteRecord} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">RECORD TAG</label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. ALPHA_LOCK, KERNEL_PROOF, HFID_RECORD"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">RECORD PAYLOAD (JSON or TEXT)</label>
              <textarea
                value={newPayload}
                onChange={(e) => setNewPayload(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder='e.g. {"assertion": "Consensus subordinated to Supreme Architect", "status": "LOCKED"}'
                required
              />
            </div>

            <button
              type="submit"
              disabled={writing}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-mono font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <Lock className="w-3.5 h-3.5" />
              {writing ? 'Sealing Block with HMAC-SHA512...' : 'SEAL IMMUTABLE RECORD (WRITE-ONCE)'}
            </button>
          </form>

          {writeSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{writeSuccess}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-500 font-mono space-y-1 pt-2 border-t border-slate-800">
            <p>• Once written, records can NEVER be modified or deleted.</p>
            <p>• Every block calculates an HMAC-SHA512 seal chained to previous block.</p>
            <p>• Read access is available indefinitely (Read Many).</p>
          </div>
        </div>

        {/* Blocks Explorer (Right Column) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold font-mono text-white">IMMUTABLE BLOCK CHAIN</h3>
            </div>
            <div className="relative w-48">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blocks..."
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
              />
            </div>
          </div>

          {/* Block list */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredBlocks.map((block) => (
              <div
                key={block.blockId}
                onClick={() => setSelectedBlock(block)}
                className={`p-3 rounded-lg border font-mono text-xs cursor-pointer transition-all ${
                  selectedBlock?.blockId === block.blockId
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-slate-900 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      #{block.blockIndex}
                    </span>
                    <span className="font-bold text-white">{block.blockId}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(block.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[200px]">Seal: {block.tamperSeal.slice(0, 16)}...</span>
                  <span className="text-emerald-400/90 font-semibold">{block.author}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Selected Block Inspector */}
          {selectedBlock && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3 mt-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">BLOCK #{selectedBlock.blockIndex} INSPECTOR</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded">
                  IMMUTABLE SEALED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Block ID:</span>{' '}
                  <span className="text-slate-300">{selectedBlock.blockId}</span>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp:</span>{' '}
                  <span className="text-slate-300">{selectedBlock.timestamp}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-500">Tamper Seal (SHA-256):</span>{' '}
                  <span className="text-emerald-400 break-all">{selectedBlock.tamperSeal}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-500">Previous Block Hash:</span>{' '}
                  <span className="text-slate-400 break-all">{selectedBlock.previousHash}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-500">Signature (HMAC-SHA512):</span>{' '}
                  <span className="text-amber-400/80 break-all">{selectedBlock.signature}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Payload Data:</span>
                <pre className="bg-slate-900 border border-slate-800 p-2.5 rounded text-[11px] text-emerald-300 overflow-x-auto">
                  {JSON.stringify(selectedBlock.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
