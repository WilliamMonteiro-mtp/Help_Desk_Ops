import React, { useState, useMemo } from 'react';
import { RealtimeTerminal } from './components/terminal/RealtimeTerminal';
import { ToolCard } from './components/ui/ToolCard';
import { ExecutionConfirmModal } from './components/ui/ExecutionConfirmModal';
import { useTerminal } from './context/TerminalContext';
import { TOOLS_CATALOG, ToolDefinition, ToolCategory } from './data/toolsCatalog';

const TABS: { id: 'all' | ToolCategory; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'system', label: 'Sistema' },
  { id: 'network', label: 'Rede' },
  { id: 'disk', label: 'Disco' },
  { id: 'advanced', label: 'Avançado' },
];

export function App() {
  const { startExecution } = useTerminal();
  const [selectedFeature, setSelectedFeature] = useState<ToolDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardClick = (feature: ToolDefinition) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedFeature) {
      startExecution(selectedFeature.id);
    }
  };

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter(tool => {
      const matchesTab = activeTab === 'all' || tool.category === activeTab;
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = tool.name.toLowerCase().includes(lowerQuery) || 
                            tool.description.toLowerCase().includes(lowerQuery) ||
                            tool.command.toLowerCase().includes(lowerQuery);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white font-sans">
      {/* Topbar Customizada para Tauri */}
      <div data-tauri-drag-region className="h-10 flex items-center justify-between px-4 bg-zinc-900 border-b border-zinc-800 select-none flex-shrink-0 cursor-default">
        <div className="flex items-center space-x-3 pointer-events-none">
          <span className="font-semibold text-sm tracking-wide">HelpDesk Ops</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[10px] text-zinc-400 uppercase">Backend Conectado</span>
          </span>
        </div>
      </div>

      {/* Main Layout (Flex Grid) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Painel Principal / Catálogo */}
        <div className="flex-1 flex flex-col p-8 pb-0">
          <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
            <div className="mb-6 flex-shrink-0">
              <h1 className="text-2xl font-semibold mb-2 text-zinc-100">Catálogo de Ferramentas</h1>
              <p className="text-sm text-zinc-400 mb-6">Diagnóstico e manutenção avançada do sistema.</p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Tabs */}
                <div className="flex space-x-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                  {TABS.map(tab => {
                    const count = tab.id === 'all' 
                      ? TOOLS_CATALOG.length 
                      : TOOLS_CATALOG.filter(t => t.category === tab.id).length;
                    
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                          isActive 
                            ? 'bg-zinc-800 text-white font-medium shadow-sm' 
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
                      >
                        {tab.label} <span className="opacity-50 text-xs">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar ferramentas..."
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-lg leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 sm:text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Grid */}
            <div className="flex-1 overflow-y-auto pr-2 pb-8">
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTools.map(f => (
                    <ToolCard key={f.id} feature={f} onClick={handleCardClick} />
                  ))}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                  <p className="text-zinc-500 text-sm">Nenhuma ferramenta encontrada para a pesquisa indicada.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Barra Lateral com Terminal Embebido */}
        <div className="w-[450px] min-w-[400px] border-l border-zinc-800 bg-zinc-900/30 p-4 shadow-2xl flex-shrink-0">
          <RealtimeTerminal />
        </div>
      </div>

      <ExecutionConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        feature={selectedFeature}
      />
    </div>
  );
}
