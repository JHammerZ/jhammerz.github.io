import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, 
  RefreshCw, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Activity,
  Cpu,
  Trash2,
  Github,
  Star,
  Code,
  ExternalLink,
  Lock
} from 'lucide-react';

interface PipelineState {
  id: string;
  workflowName: string;
  job: string;
  file_target: string;
  artifact: string;
  runId: number;
  status: 'IDLE' | 'QUEUED' | 'BUILDING' | 'TESTING' | 'DEPLOYING' | 'SUCCESSFUL' | 'FAILED' | 'WAITING_FOR_RUNNER';
  progress: number;
  logs: string[];
  updatedAt: string;
}

interface SovereignRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stars: number;
  language: string;
  html_url: string;
  pushed_at: string;
  open_issues: number;
  topics: string[];
  private?: boolean;
}

export const PipelineStatus: React.FC = () => {
  const [pipelinesList, setPipelinesList] = useState<PipelineState[]>([]);
  const [activeStateId, setActiveStateId] = useState<string>('quota_purge');
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineState | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  // Sovereign Repositories states
  const [repos, setRepos] = useState<SovereignRepository[]>([]);
  const [reposLive, setReposLive] = useState(false);
  const [showRepos, setShowRepos] = useState(true);
  const [isRefreshingRepos, setIsRefreshingRepos] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/pipeline/status?id=${activeStateId}&_t=${Date.now()}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setPipelinesList(data.pipelines || []);
          setSelectedPipeline(data.selected || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pipeline status:', error);
    }
  };

  const fetchRepos = async () => {
    setIsRefreshingRepos(true);
    try {
      const response = await fetch(`/api/github/repos?_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRepos(data.repos || []);
          setReposLive(data.live);
        }
      }
    } catch (error) {
      console.error('Failed to fetch JHammerZ repositories:', error);
    } finally {
      setIsRefreshingRepos(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2500);
    return () => clearInterval(interval);
  }, [activeStateId]);

  useEffect(() => {
    fetchRepos();
    const repoInterval = setInterval(fetchRepos, 15000);
    return () => clearInterval(repoInterval);
  }, []);

  const triggerPipeline = async () => {
    setIsTriggering(true);
    try {
      const response = await fetch(`/api/pipeline/trigger?id=${activeStateId}`, { 
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: activeStateId })
      });
      if (response.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Failed to trigger pipeline:', error);
    } finally {
      setIsTriggering(false);
    }
  };

  const statusColors: Record<string, string> = {
    IDLE: 'text-gray-400 border-gray-800 bg-gray-900/40',
    QUEUED: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
    BUILDING: 'text-amber-500 border-amber-500/20 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    TESTING: 'text-pink-500 border-pink-500/20 bg-pink-500/10 shadow-[0_0_10px_rgba(236,72,153,0.1)]',
    DEPLOYING: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
    SUCCESSFUL: 'text-sovereign-neon border-sovereign-neon/20 bg-sovereign-neon/10 shadow-[0_0_10px_rgba(0,255,65,0.1)]',
    FAILED: 'text-red-500 border-red-500/20 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    WAITING_FOR_RUNNER: 'text-purple-500 border-purple-500/20 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
  };

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL':
        return 'bg-sovereign-neon shadow-[0_0_6px_#00FF41]';
      case 'FAILED':
        return 'bg-red-500 shadow-[0_0_6px_#ef4444]';
      case 'IDLE':
        return 'bg-gray-700';
      default:
        return 'bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse';
    }
  };

  const pipelineIcons: Record<string, any> = {
    quota_purge: Trash2,
    sovereign_sync: GitBranch,
    kernel_realignment: Cpu
  };

  const activePipeline = selectedPipeline;
  if (!activePipeline) return null;

  const isRunning = ['QUEUED', 'BUILDING', 'TESTING', 'DEPLOYING'].includes(activePipeline.status);

  return (
    <div className="w-full bg-sovereign-card brutalist-border p-4 relative overflow-hidden group space-y-6">
      {/* Dynamic scanline element for active running pipelines */}
      {isRunning && (
        <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sovereign-neon to-transparent animate-pulse opacity-40 animate-duration-1000" />
      )}

      {/* 1. CHANNEL SELECTION OVERLAYS */}
      <div>
        <div className="flex flex-wrap items-center gap-2 border-b border-sovereign-line pb-3 mb-4">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mr-2">Sovereign Channels:</span>
          {pipelinesList.map((p) => {
            const Icon = pipelineIcons[p.id] || GitBranch;
            const isCurrent = p.id === activeStateId;
            const pRunning = ['QUEUED', 'BUILDING', 'TESTING', 'DEPLOYING'].includes(p.status);

            return (
              <button
                key={p.id}
                id={`btn-pipeline-${p.id}`}
                onClick={() => {
                  setActiveStateId(p.id);
                  if (p.id === 'sovereign_sync') {
                    fetchRepos();
                  }
                }}
                className={`px-3 py-1.5 font-mono text-[9px] uppercase transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isCurrent 
                    ? 'bg-sovereign-neon/10 border-sovereign-neon text-white shadow-[0_0_8px_rgba(0,255,65,0.05)]' 
                    : 'bg-black/20 border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                <Icon className={`w-3 h-3 ${pRunning ? 'animate-spin text-amber-500' : isCurrent ? 'text-sovereign-neon' : 'text-gray-500'}`} />
                <span className="font-bold">{p.workflowName.replace(/_/g, ' ')}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(p.status)}`} />
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isRunning ? (
                <Loader2 className="w-5 h-5 text-sovereign-neon animate-spin" />
              ) : (
                <Activity className="w-5 h-5 text-gray-400" />
              )}
              {!isRunning && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-sovereign-neon rounded-full shadow-[0_0_6px_#00FF41]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">ACTIVE TELEMETRY CHANNEL</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 border border-white/10 text-white/40 uppercase">RUN #{activePipeline.runId}</span>
              </div>
              <h3 className="text-sm font-bold tracking-tight text-white font-mono uppercase mt-1 flex items-center gap-1.5">
                {activePipeline.workflowName}
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
              </h3>
            </div>
          </div>

          {/* Progress Meter */}
          <div className="flex-1 max-w-sm md:mx-6 flex flex-col gap-1.5 justify-center">
            <div className="flex justify-between items-center font-mono text-[10px]">
              <span className={`uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${statusColors[activePipeline.status] || 'text-white border-white/10 bg-white/5'}`}>
                {activePipeline.status}
              </span>
              <span className="text-gray-400">{activePipeline.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 border border-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${activePipeline.status === 'FAILED' ? 'bg-red-500' : 'bg-sovereign-neon shadow-[0_0_8px_#00FF41]'}`}
                animate={{ width: `${activePipeline.progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              id="btn-toggle-pipeline-logs"
              onClick={() => setShowLogs(!showLogs)}
              className="px-3 py-1.5 text-gray-400 hover:text-white border border-gray-800 hover:border-white transition-colors flex items-center gap-1.5 font-mono text-[10px] uppercase cursor-pointer"
            >
              <Terminal className="w-3 h-3" />
              <span>{showLogs ? 'Hide Console' : 'Console'}</span>
              {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              id="btn-trigger-pipeline-dispatch"
              onClick={triggerPipeline}
              disabled={isTriggering || isRunning}
              className="px-3 py-1.5 bg-sovereign-neon/10 hover:bg-sovereign-neon text-sovereign-neon hover:text-black border border-sovereign-neon/30 hover:border-sovereign-neon disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isTriggering || isRunning ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Triggering...' : isRunning ? 'In Progress' : 'Dispatch Sync'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Log console segment */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-1 border-t border-sovereign-line"
          >
            <div className="bg-black/90 p-3 rounded font-mono text-[10px] text-gray-400 space-y-1.5 leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar border border-gray-900 shadow-inner">
              <div className="flex justify-between text-[8px] text-gray-600 border-b border-gray-900 pb-1 mb-2">
                <span>VIRTUAL_RUNNER@LYSANDER-NODE-AX-01</span>
                <span>UTC: {new Date(activePipeline.updatedAt).toLocaleTimeString()}</span>
              </div>
              <div className="text-[8px] text-gray-500 mb-1">
                TARGET FILE: <span className="text-white">{activePipeline.file_target}</span> | JOB: <span className="text-white">{activePipeline.job}</span>
              </div>
              {activePipeline.logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-1.5 ${
                    log.includes('[SUCCESS]') || log.includes('successfully') ? 'text-sovereign-neon' :
                    log.includes('[SYSTEM]') ? 'text-gray-500' :
                    log.includes('[DEPLOY]') ? 'text-cyan-400' :
                    log.includes('[TEST]') ? 'text-pink-400' :
                    log.includes('[BUILD]') ? 'text-amber-400' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-600 select-none">{">"}</span>
                  <span className="whitespace-pre-wrap">{log}</span>
                </div>
              ))}
              {isRunning && (
                <div className="flex items-center gap-1 text-sovereign-neon font-bold animate-pulse text-[8px] tracking-wider uppercase mt-2">
                  <span className="w-1.5 h-1.5 bg-sovereign-neon rounded-full shadow-[0_0_4px_#00FF41]" />
                  <span>Awaiting next telemetry step...</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC LIVE MULTI-REPOSITORY GRID LIST */}
      <div className="border-t border-sovereign-line/60 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div 
            onClick={() => setShowRepos(!showRepos)}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <Github className="w-4 h-4 text-white group-hover:text-sovereign-neon transition-colors" />
            <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              Sovereign Repository Substrate Clusters
              <span className="text-[8px] font-normal px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {repos.length || 8} Active
              </span>
            </h4>
            {showRepos ? <ChevronUp className="w-3 h-3 text-gray-500" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[8px] font-mono leading-none ${reposLive ? 'text-sovereign-neon font-bold animate-pulse' : 'text-amber-500/80'}`}>
              ● {reposLive ? 'LIVE GITHUB INSTANCE' : 'SECURE PARITY HARD BUFFERED'}
            </span>
            <button
              id="btn-refresh-repos"
              disabled={isRefreshingRepos}
              onClick={fetchRepos}
              className="p-1 px-1.5 rounded bg-black/40 border border-gray-800 hover:border-gray-500 text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isRefreshingRepos ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showRepos && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 overflow-hidden"
            >
              {repos.map((repo) => (
                <div 
                  key={repo.id}
                  id={`repo-card-${repo.name}`}
                  className="bg-black/30 border border-gray-950 p-2.5 rounded hover:border-sovereign-neon/40 hover:bg-black/50 transition-all group flex flex-col justify-between align-stretch text-left relative"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[10px] font-bold text-white group-hover:text-sovereign-neon transition-colors truncate flex items-center gap-1">
                        {repo.name}
                        {repo.private && <Lock className="w-2.5 h-2.5 text-amber-500/90 shrink-0" />}
                      </span>
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer self-start p-0.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    
                    <p className="text-[9px] text-gray-400 leading-normal min-h-[27px] line-clamp-2">
                      {repo.description || "No specific design documentation provided."}
                    </p>
                  </div>

                  <div className="border-t border-gray-900/60 pt-2 mt-2 flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-[8px] font-mono text-gray-500">
                        <Code className="w-2.5 h-2.5" />
                        {repo.language}
                      </span>
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-0.5 text-[8px] font-mono text-amber-500 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          {repo.stars}
                        </span>
                      )}
                    </div>

                    <span className="text-[7.5px] font-mono text-gray-600">
                      PUSH: {new Date(repo.pushed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {repo.topics.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[6.5px] font-normal px-1 py-0.2 border border-gray-900 bg-gray-950 text-gray-500 uppercase rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
