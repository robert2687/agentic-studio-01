
"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

export type Agent = {
  id: number;
  name: string;
  status: 'Idle' | 'Working' | 'Done' | 'Failed' | 'Blocked';
  progress: number;
  dependencies?: number[];
};

interface AgentStatusProps {
  agents: Agent[];
  onRetry: (taskId: number) => void;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ agents, onRetry }) => (
  <div className="p-4">
    <h3 className="text-sm font-grotesk font-semibold text-muted-foreground uppercase tracking-wider mb-3">Agent Status</h3>
    <div className="space-y-4">
      {agents.map(agent => (
        <div key={agent.id}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-foreground">{agent.name}</span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                agent.status === 'Working' ? 'bg-blue-500/20 text-blue-300' : 
                agent.status === 'Done' ? 'bg-green-500/20 text-green-300' :
                agent.status === 'Failed' ? 'bg-red-500/20 text-red-300' :
                agent.status === 'Blocked' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-muted text-muted-foreground'
              }`}>
                {agent.status}
              </span>
              {agent.status === 'Failed' && (
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onRetry(agent.id)}>
                  <RefreshCw className="h-3 w-3 text-red-400" />
                </Button>
              )}
            </div>
          </div>
          <Progress value={agent.progress} className={`h-1.5 w-full bg-muted ${
            agent.status === 'Failed' ? '[&>div]:bg-red-500' : ''
          }`} />
        </div>
      ))}
    </div>
  </div>
);
