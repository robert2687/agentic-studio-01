"use client";

import React, { useEffect, useRef } from 'react';

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
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="h-full bg-black font-mono text-xs text-gray-300 p-4 overflow-y-auto rounded-lg">
            {logs.map((log, index) => (
                <div key={index} className="flex">
                    <span className="text-gray-500 mr-4 flex-shrink-0">{log.timestamp}</span>
                    <span className={`${log.color || 'text-green-400'} mr-2 flex-shrink-0`}>{`[${log.agent}]`}</span>
                    <span className="text-gray-300 whitespace-pre-wrap">{log.message}</span>
                </div>
            ))}
            <div ref={logsEndRef}/>
        </div>
    );
};
