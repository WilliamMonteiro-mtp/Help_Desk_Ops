import React from 'react';
import { ToolDefinition } from '../../data/toolsCatalog';

interface ExecutionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feature: ToolDefinition | null;
}

export function ExecutionConfirmModal({ isOpen, onClose, onConfirm, feature }: ExecutionConfirmModalProps) {
  if (!isOpen || !feature) return null;

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-[500px] shadow-2xl transform transition-all">
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">Confirmar Execução de Sistema</h2>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getRiskColor(feature.risk)}`}>
            Risco: {feature.risk.toUpperCase()}
          </span>
          {feature.requiresRestart && (
            <span className="px-2 py-1 text-xs font-medium border rounded-md text-amber-500 bg-amber-500/10 border-amber-500/20">
              Requer Reinicialização
            </span>
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Você está prestes a executar <strong>{feature.name}</strong>. Esta ação executará o seguinte comando num subprocesso com privilégios elevados (UAC):
        </p>

        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 mb-6 font-mono text-sm text-zinc-300 break-all relative">
          {feature.command}
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancelar (Esc)
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors flex items-center gap-2"
          >
            <span className="w-4 h-4">🚀</span> Executar Comando
          </button>
        </div>
      </div>
    </div>
  );
}
