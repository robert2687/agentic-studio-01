"use client";

import React from 'react';

interface CodeEditorViewProps {
    content: string;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({ content }) => (
    <div className="h-full bg-[#1e1e1e] p-4 overflow-auto font-mono text-sm">
        <pre><code className="language-jsx text-gray-300">{content}</code></pre>
    </div>
);
