import React from 'react';
import { ToolDefinition } from '../../data/toolsCatalog';

interface ToolCardProps {
  feature: ToolDefinition;
  onClick: (feature: ToolDefinition) => void;
}

export function ToolCard({ feature, onClick }: ToolCardProps) {
  return (
    <div 
      onClick={() => onClick(feature)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/80 transition-all group backdrop-blur-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 transition-colors">
            <span className="text-xl">🛠️</span>
          </div>
          {feature.risk === 'high' && (
            <span title="Alto Risco" className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
          )}
          {feature.risk === 'medium' && (
            <span title="Médio Risco" className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
          {feature.risk === 'low' && (
            <span title="Baixo Risco" className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </div>
        <h3 className="text-zinc-100 font-semibold text-base mb-1">{feature.name}</h3>
        <p className="text-zinc-400 text-xs mb-3">{feature.description}</p>
      </div>
      <p className="text-zinc-500 text-[10px] font-mono truncate border-t border-zinc-800/50 pt-3">{feature.command}</p>
    </div>
  );
}
