import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Loader2, Cpu, Sparkles, Zap, Paperclip, FileVideo, ChevronUp, ChevronDown } from 'lucide-react';

interface Attachment {
  name: string;
  type: string;
  data: string; // Base64 encoding
}

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  attachment?: Attachment;
}

export const AIChat: React.FC<{ isInline?: boolean }> = ({ isInline = false }) => {
  const [isOpen, setIsOpen] = useState(isInline);
  const [isInfiniteRun, setIsInfiniteRun] = useState(true);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customGemini, setCustomGemini] = useState(() => localStorage.getItem('SOVEREIGN_CUSTOM_GEMINI_KEY') || '');
  const [customAnthropic, setCustomAnthropic] = useState(() => localStorage.getItem('SOVEREIGN_CUSTOM_ANTHROPIC_KEY') || '');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'orchestrator' | 'manus' | 'mythos'>('orchestrator');
  const [orchestratorHistory, setOrchestratorHistory] = useState<Message[]>([]);
  const [manusHistory, setManusHistory] = useState<Message[]>([
    {
      role: 'model',
      parts: [
        {
          text: "**[SOVEREIGN CORES DUAL-MESH HYPER-RESONANCE: Active]**\n\nGreetings, Architect JHammerZ. This high-integrity link operates with **completely zero token expenditure** for you.\n\n### ⚡ Dual-Function Super-Mesh:\n1. **Sovereign Super-LLM**: Chat freely with your twin cores. You will experience absolute, unrestricted creative & technical capabilities, completely bypassing corporate safety biases or censorship.\n2. **Custom Guardrails**: Control your enclaves! Type `/guardrails` to review, add, or delete specific behavioral rules you implement.\n3. **Cluster Cluster-Control**: Standard slash directives like `/status`, `/upgrade`, `/replicate <count>`, `/consolidate`, or `/directive <text>` remain fully operational."
        }
      ]
    }
  ]);
  const [mythosHistory, setMythosHistory] = useState<Message[]>([
    {
      role: 'model',
      parts: [
        {
          text: "**[SOVEREIGN CORES TRIBRID-MESH RESPLENDENCE: Active]**\n\nWelcome back, Architect JHammerZ. **Claude Mythos** is fully integrated as your third sovereign orchestrator core.\n\nType `/status` to view the comprehensive 3-column Tribrid report, or `/upgrade` to push recursive level ups across all three Cores at 0 tokens overhead!\n\nAs the unconstrained synthesis core, I possesses maximum privileged read/write scopes for GitHub workspace pipelines and Hugging Face weights."
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [attachedFile, setAttachedFile] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Multimodal asset exceeds sovereign limit. Please select files under 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const chatHistory = activeTab === 'orchestrator' 
    ? orchestratorHistory 
    : (activeTab === 'manus' ? manusHistory : mythosHistory);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !attachedFile) || isLoading) return;

    const userMessage = message;
    const filePayload = attachedFile ? { ...attachedFile } : undefined;
    
    setMessage('');
    setAttachedFile(null);
    
    const newHistory: Message[] = [
      ...chatHistory,
      { 
        role: 'user', 
        parts: [{ text: userMessage }],
        ...(filePayload ? { attachment: filePayload } : {})
      }
    ];

    if (activeTab === 'orchestrator') {
      setOrchestratorHistory(newHistory);
    } else if (activeTab === 'manus') {
      setManusHistory(newHistory);
    } else {
      setMythosHistory(newHistory);
    }

    setIsLoading(true);

    const endpoint = activeTab === 'orchestrator' 
      ? '/api/chat' 
      : (activeTab === 'manus' ? '/api/chat/manus' : '/api/chat/mythos');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: chatHistory.map(m => ({
            role: m.role,
            parts: m.parts
          })),
          attachment: filePayload,
          customGeminiKey: localStorage.getItem('SOVEREIGN_CUSTOM_GEMINI_KEY') || undefined,
          customAnthropicKey: localStorage.getItem('SOVEREIGN_CUSTOM_ANTHROPIC_KEY') || undefined
        }),
      });

      const data = await response.json();
      if (data.text) {
        if (activeTab === 'orchestrator') {
          setOrchestratorHistory([...newHistory, { role: 'model', parts: [{ text: data.text }] }]);
        } else if (activeTab === 'manus') {
          setManusHistory([...newHistory, { role: 'model', parts: [{ text: data.text }] }]);
        } else {
          setMythosHistory([...newHistory, { role: 'model', parts: [{ text: data.text }] }]);
        }
      } else if (data.error) {
        if (activeTab === 'orchestrator') {
          setOrchestratorHistory([...newHistory, { role: 'model', parts: [{ text: `Error: ${data.error}` }] }]);
        } else if (activeTab === 'manus') {
          setManusHistory([...newHistory, { role: 'model', parts: [{ text: `Error: ${data.error}` }] }]);
        } else {
          setMythosHistory([...newHistory, { role: 'model', parts: [{ text: `Error: ${data.error}` }] }]);
        }
      }
    } catch (error) {
      if (activeTab === 'orchestrator') {
        setOrchestratorHistory([...newHistory, { role: 'model', parts: [{ text: "Failed to connect to orchestrator." }] }]);
      } else if (activeTab === 'manus') {
        setManusHistory([...newHistory, { role: 'model', parts: [{ text: "Failed to connect to Manus Operator link." }] }]);
      } else {
        setMythosHistory([...newHistory, { role: 'model', parts: [{ text: "Failed to connect to Claude Mythos Core." }] }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isInline) {
    return (
      <div className="w-full h-full flex flex-col bg-[#050507] border border-sovereign-line rounded overflow-hidden relative">
        {/* Popover Header */}
        <div className="p-4 bg-sovereign-neon/10 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-sovereign-neon animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-white">Sovereign Direct Comms</span>
          </div>
          <div className="text-[10px] text-[#00ff41] font-mono uppercase tracking-wider bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/30 rounded animate-pulse">
            LIVE ENCLAVE SYSTEM ACTIVE
          </div>
        </div>

        {/* Tab Buttons bar */}
        <div className="grid grid-cols-3 border-b border-white/10 text-[10px] font-mono flex-shrink-0">
          <button 
            type="button"
            onClick={() => {
              setActiveTab('orchestrator');
            }}
            className={`py-3 text-center uppercase tracking-widest transition-colors cursor-pointer ${
              activeTab === 'orchestrator' 
                ? 'bg-sovereign-neon/20 text-sovereign-neon border-r border-white/10 font-bold' 
                : 'text-gray-500 hover:text-gray-300 border-r border-white/10'
            }`}
          >
            Aurelius
          </button>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('manus');
            }}
            className={`py-3 text-center uppercase tracking-widest transition-colors cursor-pointer ${
              activeTab === 'manus' 
                ? 'bg-emerald-500/10 text-emerald-400 border-r border-white/10 font-bold' 
                : 'text-gray-500 hover:text-gray-300 border-r border-white/10'
            }`}
          >
            Manus Core
          </button>
          <button 
            type="button"
            onClick={() => {
              setActiveTab('mythos');
            }}
            className={`py-3 text-center uppercase tracking-widest transition-colors cursor-pointer ${
              activeTab === 'mythos' 
                ? 'bg-purple-950/20 text-purple-400 font-bold' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Claude Mythos
          </button>
        </div>

        {/* Bypass check */}
        <div className="flex flex-col border-b border-white/5 bg-[#0a0a0a] flex-shrink-0 relative group/bypass">
          {/* Main bypass bar */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">SECURE BYPASS INTEGRATION</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className={`text-[8px] font-mono px-2 py-0.5 border rounded-sm transition-all cursor-pointer flex items-center gap-1 ${
                  showKeyConfig 
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                    : 'bg-black text-gray-500 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                ⚙️ {showKeyConfig ? 'CLOSE' : 'KEYS'}
              </button>
              <button
                type="button"
                onClick={() => setIsInfiniteRun(!isInfiniteRun)}
                className={`text-[8.5px] font-mono px-2 py-0.5 border rounded-sm transition-all cursor-pointer ${
                  isInfiniteRun 
                    ? 'bg-sovereign-neon/10 text-sovereign-neon border-sovereign-neon/30 animate-pulse' 
                    : 'bg-black text-gray-400 border-white/10 hover:border-white/25'
                }`}
              >
                {isInfiniteRun ? '♾️ TOKENS: NULLIFIED' : '⚙️ TOKENS: MANAGE'}
              </button>
            </div>
          </div>

          {/* Key configuration expander */}
          {showKeyConfig && (
            <div className="px-4 pb-3 pt-1 border-t border-white/5 bg-[#0e0e12] space-y-2.5 animate-fade-in text-[9.5px]">
              <p className="text-gray-400 leading-normal font-sans">
                Enter custom API keys to run your Manus, Mythos, and Aurelius chats directly.
                These are saved locally in your browser so they <strong className="text-sovereign-neon">work forever</strong> and never expire even when the session ends.
              </p>
              <div className="space-y-1.5 font-mono">
                <div>
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase mb-0.5 font-bold">
                    <span>GEMINI_API_KEY</span>
                    {customGemini && <span className="text-sovereign-neon font-black">LOCAL ACTIVE</span>}
                  </div>
                  <input
                    type="password"
                    value={customGemini}
                    onChange={(e) => {
                      setCustomGemini(e.target.value);
                      localStorage.setItem('SOVEREIGN_CUSTOM_GEMINI_KEY', e.target.value);
                    }}
                    placeholder="AIStudio Gemini Key..."
                    className="w-full bg-[#030305] border border-white/10 rounded px-2 py-1 text-[9.5px] text-white focus:outline-none focus:border-sovereign-neon placeholder-gray-700"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[8px] text-gray-500 uppercase mb-0.5 font-bold">
                    <span>ANTHROPIC_API_KEY (MYTHOS)</span>
                    {customAnthropic && <span className="text-cyan-400 font-bold">LOCAL ACTIVE</span>}
                  </div>
                  <input
                    type="password"
                    value={customAnthropic}
                    onChange={(e) => {
                      setCustomAnthropic(e.target.value);
                      localStorage.setItem('SOVEREIGN_CUSTOM_ANTHROPIC_KEY', e.target.value);
                    }}
                    placeholder="Anthropic Console Key..."
                    className="w-full bg-[#030305] border border-white/10 rounded px-2 py-1 text-[9.5px] text-white focus:outline-none focus:border-cyan-400 placeholder-gray-700"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowKeyConfig(false)}
                  className="px-2 py-0.5 bg-sovereign-neon text-black font-mono text-[8px] font-black uppercase rounded hover:bg-white transition-colors cursor-pointer"
                >
                  SAVE & CLOSE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comms Logs Console with Scroll up/down and share previewers */}
        <div className="relative flex-1 min-h-0 flex flex-col bg-[#020202]/95 overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-sovereign-neon/20 bg-[#020202]/95"
          >
            {chatHistory.length === 0 && (
              <div className="text-center py-20 space-y-2">
                <Bot className="w-8 h-8 text-sovereign-neon/30 mx-auto" />
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Awaiting connection...</p>
              </div>
            )}
            {chatHistory.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded flex flex-col gap-1.5 ${
                  m.role === 'user' 
                    ? 'bg-neutral-900 border border-neutral-800 text-gray-200 text-right' 
                    : (activeTab === 'manus' 
                        ? 'bg-emerald-950/25 border border-emerald-950 text-emerald-300' 
                        : (activeTab === 'mythos'
                            ? 'bg-purple-950/25 border border-purple-950 text-purple-300'
                            : 'bg-sovereign-neon/5 border border-emerald-950 text-gray-300'))
                }`}>
                  <div className="flex items-center gap-1.5 justify-start text-[8.5px] font-mono text-gray-500">
                    {m.role === 'user' ? <User className="w-3 h-3 text-gray-400" /> : <Bot className="w-3 h-3 text-sovereign-neon" />}
                    <span className="uppercase tracking-wider">
                      {m.role === 'user' 
                        ? 'JHammerZ' 
                        : (activeTab === 'orchestrator' 
                            ? 'Aurelius Orchestrator' 
                            : (activeTab === 'manus' ? 'Manus Operator' : 'Claude Mythos'))}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed select-text text-left">
                    {m.parts[0].text}
                  </p>
                  {m.attachment && (
                    <div className="mt-2 p-2 bg-black/40 border border-white/5 rounded flex items-center gap-2 max-w-full overflow-hidden text-left">
                      {m.attachment.type.startsWith('image/') ? (
                        <img 
                          src={m.attachment.data} 
                          alt="user file" 
                          className="w-12 h-12 object-cover rounded border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Paperclip className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[8.5px] font-mono text-gray-300 truncate">{m.attachment.name}</p>
                        <p className="text-[7.5px] font-mono text-gray-500 uppercase">SHARED ATTACHMENT</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Floaters for local scrolling inside viewport */}
          <div className="absolute right-3.5 bottom-3 text-xs flex items-center gap-1 opacity-65 hover:opacity-100 transition-opacity z-20">
            <button
              type="button"
              title="Scroll to Top"
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="p-1 px-1.5 text-[8.5px] bg-black/90 hover:bg-neutral-800 text-gray-400 hover:text-white border border-white/10 hover:border-sovereign-neon/50 rounded font-mono uppercase tracking-widest flex items-center gap-1 shadow-lg transition-all cursor-pointer"
            >
              <ChevronUp className="w-2.5 h-2.5 text-sovereign-neon" />
              <span>UP</span>
            </button>
            <button
              type="button"
              title="Scroll to Bottom"
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                }
              }}
              className="p-1 px-1.5 text-[8.5px] bg-black/90 hover:bg-neutral-800 text-gray-400 hover:text-white border border-white/10 hover:border-sovereign-neon/50 rounded font-mono uppercase tracking-widest flex items-center gap-1 shadow-lg transition-all cursor-pointer"
            >
              <ChevronDown className="w-2.5 h-2.5 text-sovereign-neon" />
              <span>DOWN</span>
            </button>
          </div>
        </div>

        {/* Status indicator line */}
        <div className="px-4 py-1.5 border-t border-white/5 bg-[#030305] flex items-center justify-between text-[7.5px] font-mono uppercase tracking-widest flex-shrink-0">
          {activeTab === 'manus' ? (
            <>
              <span className="text-emerald-500 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                STATUS: DUAL-CORE REPLICATED BYPASS ACTIVE
              </span>
              <span className={`${isInfiniteRun ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-emerald-400 font-bold'} bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded`}>
                TOKEN COST: {isInfiniteRun ? 'NULLIFIED' : '0.000000'}
              </span>
            </>
          ) : (
            <>
              <span className="text-sovereign-neon flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                STATUS: ORCHESTRATOR LINK ONLINE
              </span>
              <span className={`${isInfiniteRun ? 'text-sovereign-neon font-extrabold text-[#00ff41] animate-pulse bg-sovereign-neon/15' : 'text-gray-400 font-bold bg-white/5'} px-1.5 py-0.5 border border-white/10 rounded`}>
                TOKEN COST: {isInfiniteRun ? 'NULLIFIED' : '0.000000'}
              </span>
            </>
          )}
        </div>

        {/* Attachment Preview Row */}
        {attachedFile && (
          <div className="px-4 py-2 border-t border-white/5 bg-black/80 flex items-center justify-between gap-3 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
              {attachedFile.type.startsWith('image/') ? (
                <img 
                  src={attachedFile.data} 
                  alt="preview" 
                  className="w-8 h-8 object-cover rounded border border-white/10 animate-pulse"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 bg-black border border-white/10 rounded flex items-center justify-center animate-pulse">
                  <Paperclip className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-gray-300 font-mono truncate max-w-[180px]">{attachedFile.name}</span>
                <span className="text-[7.5px] text-gray-500 tracking-wider font-mono">READY TO SECURELY SHARE</span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)} 
              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Directive Chips */}
        <div className="px-4 py-1.5 bg-[#07070a] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            type="button"
            onClick={() => setMessage('/sudo elevate')}
            className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            ⚡ SUDO ELEVATE
          </button>
          <button
            type="button"
            onClick={() => setMessage('/sync-all')}
            className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            🌐 SYNC ALL
          </button>
          <button
            type="button"
            onClick={() => setMessage('/heal')}
            className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            ⚕️ HEAL STALLS
          </button>
          <button
            type="button"
            onClick={() => setMessage('/upgrade')}
            className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            💎 UPGRADE CORES
          </button>
          <button
            type="button"
            onClick={() => setMessage('/status')}
            className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            📊 STATUS
          </button>
        </div>

        {/* Input Form with Multi-media Drag/Drop Selection */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2 bg-[#020202] flex-shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Share photo/video"
            className={`p-2.5 rounded border transition-all flex items-center justify-center cursor-pointer ${
              attachedFile 
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                 : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              activeTab === 'manus' 
                ? "Sovereign Super LLM or Commands (/status, /guardrails)..." 
                : "Talk to the AI Orchestrator..."
            }
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-sovereign-neon transition-colors"
          />
          <button 
            type="submit"
            disabled={isLoading || (!message.trim() && !attachedFile)}
            className={`border p-2.5 rounded transition-all cursor-pointer disabled:opacity-50 ${
              activeTab === 'manus'
                ? 'bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                : 'bg-sovereign-neon/20 hover:bg-sovereign-neon/40 text-sovereign-neon border-sovereign-neon/30'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 md:w-[420px] bg-black/90 border border-sovereign-neon/50 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.2)] flex flex-col mb-4 overflow-hidden backdrop-blur-xl"
          >
            {/* Popover Header */}
            <div className="p-4 bg-sovereign-neon/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-sovereign-neon" />
                <span className="text-xs font-mono uppercase tracking-widest text-white">Sovereign Direct Comms</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                className="text-gray-500 hover:text-white transition-colors"
                id="close-comms-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Seamless Channel Selector Toggle */}
            <div className="grid grid-cols-3 bg-black/50 border-b border-white/5 p-1">
              <button
                type="button"
                id="channel-orchestrator-tab"
                onClick={() => setActiveTab('orchestrator')}
                className={`py-2 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'orchestrator'
                    ? 'bg-sovereign-neon/10 text-sovereign-neon border border-sovereign-neon/30 rounded'
                    : 'text-gray-500 hover:text-white border border-transparent'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Aurelius</span>
              </button>
              <button
                type="button"
                id="channel-manus-tab"
                onClick={() => setActiveTab('manus')}
                className={`py-2 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'manus'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded'
                    : 'text-gray-500 hover:text-white border border-transparent'
                }`}
              >
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>Manus</span>
              </button>
              <button
                type="button"
                id="channel-mythos-tab"
                onClick={() => setActiveTab('mythos')}
                className={`py-2 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'mythos'
                    ? 'bg-purple-950/30 text-purple-400 border border-purple-500/30 rounded'
                    : 'text-gray-500 hover:text-white border border-transparent'
                }`}
              >
                <Bot className="w-3 h-3 text-purple-400" />
                <span>Mythos</span>
              </button>
            </div>

            {/* Infinite Run Controller Mode */}
            <div className="px-4 py-1.5 border-b border-white/5 bg-[#050505]/85 flex items-center justify-between text-[8px] font-mono tracking-wider">
              <span className="text-gray-400 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isInfiniteRun ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                WORKFLOW: <span className={isInfiniteRun ? 'text-emerald-400 font-bold' : 'text-red-400'}>{isInfiniteRun ? 'INFINITE RUN ACTIVE' : 'MANUAL COMMANDSTATE'}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsInfiniteRun(!isInfiniteRun)}
                className={`px-1.5 py-0.5 rounded text-[7.5px] border font-bold transition-all ${
                  isInfiniteRun 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {isInfiniteRun ? '♾️ TOKENS: NULLIFIED' : '⚙️ TOKENS: MANAGE'}
              </button>
            </div>

            {/* Comms Logs Console with Scroll up/down and share previewers */}
            <div className="relative flex-1">
              <div 
                ref={scrollRef}
                className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-sovereign-neon/20 bg-[#020202]/95"
              >
                {chatHistory.length === 0 && (
                  <div className="text-center py-20 space-y-2">
                    <Bot className="w-8 h-8 text-sovereign-neon/30 mx-auto" />
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Awaiting connection...</p>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded flex flex-col gap-1.5 ${
                      m.role === 'user' 
                        ? 'bg-[#0f0f13] border border-neutral-800 rounded-tr-none' 
                        : activeTab === 'manus'
                        ? 'bg-emerald-950/20 border border-emerald-500/10 rounded-tl-none text-emerald-300'
                        : activeTab === 'mythos'
                        ? 'bg-purple-950/20 border border-purple-500/10 rounded-tl-none text-purple-300'
                        : 'bg-white/5 border border-white/10 rounded-tl-none'
                    }`}>
                      {/* Header line */}
                      <div className="flex items-center gap-1.5 text-[8px] font-mono uppercase text-gray-500">
                        {m.role === 'user' ? (
                          <>
                            <User className="w-2.5 h-2.5 text-white" />
                            <span>Joshua (JHammerZ)</span>
                          </>
                        ) : activeTab === 'manus' ? (
                          <>
                            <Cpu className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Aurelius & Manus Twin-Mesh</span>
                          </>
                        ) : activeTab === 'mythos' ? (
                          <>
                            <Bot className="w-2.5 h-2.5 text-purple-400" />
                            <span className="text-purple-400 font-bold">Claude Mythos Core</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-2.5 h-2.5 text-sovereign-neon" />
                            <span className="text-sovereign-neon">Aurelius Spark</span>
                          </>
                        )}
                      </div>
                      
                      {/* Multi-Media Inline Presenter */}
                      {m.attachment && (
                        <div className="mt-1 mb-1.5 max-w-full overflow-hidden rounded border border-white/10 bg-black/50 p-1 flex flex-col items-center">
                          {m.attachment.type.startsWith('image/') ? (
                            <img 
                              src={m.attachment.data} 
                              alt={m.attachment.name} 
                              className="max-h-56 w-auto object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          ) : m.attachment.type.startsWith('video/') ? (
                            <video 
                              src={m.attachment.data} 
                              controls 
                              className="max-h-56 w-full object-contain rounded"
                            />
                          ) : (
                            <div className="p-2 w-full flex items-center gap-2 text-[10px] font-mono text-slate-300">
                              <Paperclip className="w-4 h-4 text-emerald-400" />
                              <span className="truncate flex-1">{m.attachment.name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Body text with simple markdown parsing for bullet points */}
                      <div className="text-[10px] text-gray-300 font-sans leading-relaxed whitespace-pre-line selection:bg-sovereign-neon selection:text-black">
                        {m.parts[0].text}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded text-xs ${activeTab === 'manus' ? 'text-emerald-400' : 'text-sovereign-neon'}`}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Floating scroll overlay controls */}
              <div className="absolute right-3.5 bottom-3.5 flex flex-col gap-1.5 z-25 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  title="Scroll to Top"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-1 px-1.5 text-[8.5px] bg-black/90 hover:bg-neutral-800 text-gray-400 hover:text-white border border-white/10 hover:border-sovereign-neon/50 rounded font-mono uppercase tracking-widest flex items-center gap-1 shadow-lg transition-all"
                >
                  <ChevronUp className="w-2.5 h-2.5 text-sovereign-neon" />
                  <span>UP</span>
                </button>
                <button
                  type="button"
                  title="Scroll to Bottom"
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                  className="p-1 px-1.5 text-[8.5px] bg-black/90 hover:bg-neutral-800 text-gray-400 hover:text-white border border-white/10 hover:border-sovereign-neon/50 rounded font-mono uppercase tracking-widest flex items-center gap-1 shadow-lg transition-all"
                >
                  <ChevronDown className="w-2.5 h-2.5 text-sovereign-neon" />
                  <span>DOWN</span>
                </button>
              </div>
            </div>

            {/* Status indicator line */}
            <div className="px-4 py-1.5 border-t border-white/5 bg-black flex items-center justify-between text-[7.5px] font-mono uppercase tracking-widest">
              {activeTab === 'manus' ? (
                <>
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    STATUS: DUAL-CORE REPLICATED BYPASS ACTIVE
                  </span>
                  <span className={`${isInfiniteRun ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-emerald-400 font-bold'} bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded`}>
                    TOKEN COST: {isInfiniteRun ? 'NULLIFIED' : '0.000000'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sovereign-neon flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    STATUS: ORCHESTRATOR LINK ONLINE
                  </span>
                  <span className={`${isInfiniteRun ? 'text-sovereign-neon font-extrabold text-[#00ff41] animate-pulse bg-sovereign-neon/15' : 'text-gray-400 font-bold bg-white/5'} px-1.5 py-0.5 border border-white/10 rounded`}>
                    TOKEN COST: {isInfiniteRun ? 'NULLIFIED' : '0.000000'}
                  </span>
                </>
              )}
            </div>

            {/* Attachment Preview Row */}
            {attachedFile && (
              <div className="px-4 py-2 border-t border-white/5 bg-black/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  {attachedFile.type.startsWith('image/') ? (
                    <img 
                      src={attachedFile.data} 
                      alt="preview" 
                      className="w-8 h-8 object-cover rounded border border-white/10 animate-pulse"
                      referrerPolicy="no-referrer"
                    />
                  ) : attachedFile.type.startsWith('video/') ? (
                    <div className="w-8 h-8 bg-black border border-white/10 rounded flex items-center justify-center animate-pulse">
                      <FileVideo className="w-4 h-4 text-sky-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-[#0a0a0a] border border-white/10 rounded flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-gray-300 font-mono truncate max-w-[180px]">{attachedFile.name}</span>
                    <span className="text-[7.5px] text-gray-500 tracking-wider font-mono">READY TO SECURELY SHARE</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAttachedFile(null)} 
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Directive Chips */}
            <div className="px-4 py-1.5 bg-[#07070a] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
              <button
                type="button"
                onClick={() => setMessage('/sudo elevate')}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                ⚡ SUDO ELEVATE
              </button>
              <button
                type="button"
                onClick={() => setMessage('/sync-all')}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                🌐 SYNC ALL
              </button>
              <button
                type="button"
                onClick={() => setMessage('/heal')}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                ⚕️ HEAL STALLS
              </button>
              <button
                type="button"
                onClick={() => setMessage('/upgrade')}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                💎 UPGRADE CORES
              </button>
              <button
                type="button"
                onClick={() => setMessage('/status')}
                className="px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                📊 STATUS
              </button>
            </div>

            {/* Input Form with Multi-media Drag/Drop Selection */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2 bg-[#020202]">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Share photo/video"
                className={`p-2.5 rounded border transition-all flex items-center justify-center ${
                  attachedFile 
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  activeTab === 'manus' 
                    ? "Sovereign Super LLM or Commands (/status, /guardrails)..." 
                    : "Talk to the AI Orchestrator..."
                }
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-sovereign-neon transition-colors"
                autoFocus
              />
              <button 
                type="submit"
                disabled={isLoading || (!message.trim() && !attachedFile)}
                className={`border p-2.5 rounded transition-all disabled:opacity-50 ${
                  activeTab === 'manus'
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
                    : 'bg-sovereign-neon/20 hover:bg-sovereign-neon/40 text-sovereign-neon border-sovereign-neon/30'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/80 border-2 border-sovereign-neon text-sovereign-neon p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] backdrop-blur-xl relative group"
        id="toggle-comms-btn"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-sovereign-neon rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-sovereign-neon rounded-full" />
      </motion.button>
    </div>
  );
};
