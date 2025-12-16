
"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type Log = {
    timestamp: string;
    agent: string;
    message: string;
    color?: string;
};

interface LogsViewProps {
    logs: Log[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [selectedAgent, setSelectedAgent] = useState('all');

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs, selectedAgent]);

    const agents = useMemo(() => ['all', ...Array.from(new Set(logs.map(log => log.agent)))], [logs]);

    const filteredLogs = useMemo(() => {
        if (selectedAgent === 'all') {
            return logs;
        }
        return logs.filter(log => log.agent === selectedAgent);
    }, [logs, selectedAgent]);

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-shrink-0 flex items-center gap-2">
                <Label htmlFor="agent-filter" className="text-sm">Filter by Agent:</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger id="agent-filter" className="w-[180px] h-9">
                        <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                        {agents.map(agent => (
                            <SelectItem key={agent} value={agent}>
                                {agent === 'all' ? 'All Agents' : agent}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 bg-card font-mono text-xs text-foreground p-4 overflow-y-auto rounded-lg border border-border">
                {filteredLogs.map((log, index) => (
                    <div key={index} className="flex">
                        <span className="text-muted-foreground mr-4 flex-shrink-0">{log.timestamp}</span>
                        <span className={`${log.color || 'text-green-400'} mr-2 flex-shrink-0 font-bold`}>{`[${log.agent}]`}</span>
                        <span className="text-foreground whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
                <div ref={logsEndRef}/>
            </div>
        </div>
    );
};
