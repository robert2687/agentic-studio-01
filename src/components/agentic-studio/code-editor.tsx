
"use client";

import React from 'react';

interface CodeEditorViewProps {
    content: string;
    onContentChange: (newContent: string) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({ content, onContentChange }) => (
    <div className="h-full bg-[#1e293b] p-4 overflow-auto font-mono text-sm rounded-lg m-2 border border-border">
        <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none"
            spellCheck="false"
        />
    </div>
);

    