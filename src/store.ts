import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentConfig } from './types';

interface AgentStore {
  agents: AgentConfig[];
  currentAgent: AgentConfig | null;
  addAgent: (agent: AgentConfig) => void;
  setCurrentAgent: (agent: AgentConfig | null) => void;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      agents: [],
      currentAgent: null,
      addAgent: (agent) => 
        set((state) => {
          const newAgent = { ...agent, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
          return {
            agents: [newAgent, ...state.agents],
            currentAgent: newAgent
          };
        }),
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
    }),
    {
      name: 'merchant-agents-storage',
    }
  )
);
