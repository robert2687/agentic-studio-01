"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";

export type Agent = {
  id: number;
  name: string;
  status: 'Idle' | 'Pracuje' | 'Dokončené';
  progress: number;
};

interface AgentStatusProps {
  agents: Agent[];
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ agents }) => (
  <div className="p-4">
    <h3 className="text-sm font-grotesk font-semibold text-gray-400 uppercase tracking-wider mb-3">Stav Agentov</h3>
    <div className="space-y-4">
      {agents.map(agent => (
        <div key={agent.id}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">{agent.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              agent.status === 'Pracuje' ? 'bg-blue-500/20 text-blue-300' : 
              agent.status === 'Dokončené' ? 'bg-green-500/20 text-green-300' :
              'bg-gray-600/50 text-gray-400'
            }`}>
              {agent.status}
            </span>
          </div>
          <Progress value={agent.progress} className="h-1.5 w-full bg-gray-700" indicatorClassName="bg-blue-500" />
        </div>
      ))}
    </div>
  </div>
);
