
"use client";

import React from 'react';

interface CodeEditorViewProps {
    content: string;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({ content }) => (
    <div className="h-full bg-[#1e293b] p-4 overflow-auto font-mono text-sm rounded-lg m-2 border border-border">
        <pre><code className="language-jsx text-gray-300">{content}</code></pre>
    </div>
);

    