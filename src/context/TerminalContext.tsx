import React, { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';

export type LogMessage = {
  type: 'stdout' | 'stderr' | 'info' | 'error' | 'exit';
  data: string;
};

interface TerminalContextProps {
  logs: LogMessage[];
  isConnected: boolean;
  isRunning: boolean;
  startExecution: (featureId: string) => void;
  clearLogs: () => void;
  cancelExecution: () => void;
}

const TerminalContext = createContext<TerminalContextProps | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const cancelExecution = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      setIsRunning(false);
      setLogs(prev => [...prev, { type: 'info', data: '[INFO] Execução cancelada pelo utilizador.' }]);
    }
  }, []);

  const startExecution = useCallback((featureId: string) => {
    if (isRunning) return;
    
    // Conecta ao WebSocket do sidecar FastAPI
    const ws = new WebSocket('ws://127.0.0.1:8123/ws/terminal');
    wsRef.current = ws;
    setIsRunning(true);
    
    ws.onopen = () => {
      setIsConnected(true);
      // Envia o payload inicial para engatilhar o comando
      ws.send(JSON.stringify({ feature_id: featureId }));
    };
    
    ws.onmessage = (event) => {
      try {
        const msg: LogMessage = JSON.parse(event.data);
        setLogs(prev => [...prev, msg]);
        if (msg.type === 'exit') {
          setIsRunning(false);
          ws.close();
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLogs(prev => [...prev, { type: 'error', data: '[ERRO] Falha na conexão com o Sidecar. O Backend está a correr?' }]);
      setIsRunning(false);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setIsRunning(false);
    };
  }, [isRunning]);

  return (
    <TerminalContext.Provider value={{ logs, isConnected, isRunning, startExecution, clearLogs, cancelExecution }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) throw new Error("useTerminal must be used within a TerminalProvider");
  return context;
};
