import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ToolMode = 'basic' | 'advanced';
interface ToolModeValue { mode: ToolMode; setMode: (mode: ToolMode) => void }
const MODE_KEY = 'biocraft:tool-mode';
const ToolModeContext = createContext<ToolModeValue>({ mode: 'basic', setMode: () => {} });

export function ToolModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ToolMode>(() => {
    try { return window.localStorage.getItem(MODE_KEY) === 'advanced' ? 'advanced' : 'basic'; } catch { return 'basic'; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(MODE_KEY, mode); } catch { /* storage unavailable */ }
  }, [mode]);
  return <ToolModeContext.Provider value={{ mode, setMode }}>{children}</ToolModeContext.Provider>;
}

export function useToolMode(): ToolModeValue {
  return useContext(ToolModeContext);
}
