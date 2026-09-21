import React, { useEffect, useRef } from 'react';
import { useTerminal } from '../../context/TerminalContext';

export function RealtimeTerminal() {
  const { logs, isRunning, cancelExecution, clearLogs } = useTerminal();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll sempre que novos logs chegam
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: string, data: string) => {
    if (type === 'error' || data.includes('[ERRO]')) return 'text-rose-500 font-bold';
    if (type === 'exit') return 'text-amber-400 font-bold';
    if (type === 'info') return 'text-cyan-400';
    if (type === 'stderr') return 'text-rose-400';
    
    // Parsers básicos baseados no conteúdo (ANSI mock)
    if (data.toLowerCase().includes('sucesso')) return 'text-emerald-400';
    
    return 'text-zinc-300';
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] rounded-xl border border-zinc-800 overflow-hidden font-mono text-sm shadow-inner">
      {/* Topbar Terminal */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Terminal Output</span>
          {isRunning && (
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-emerald-500/80">Processo Ativo</span>
            </span>
          )}
        </div>
        <div className="flex space-x-4">
          <button onClick={clearLogs} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Limpar</button>
          {isRunning && (
            <button onClick={cancelExecution} className="text-xs text-rose-500 hover:text-rose-400 transition-colors font-semibold">⏹ Cancelar</button>
          )}
        </div>
      </div>
      
      {/* Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.length === 0 && (
          <div className="text-zinc-600 text-xs italic">A aguardar a execução de comandos...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className={`break-words whitespace-pre-wrap leading-relaxed ${getColor(log.type, log.data)}`}>
            {log.data}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
