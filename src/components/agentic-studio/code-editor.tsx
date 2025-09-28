
"use client";

import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

interface CodeEditorViewProps {
    files: { [key: string]: string };
    activeFile: string;
    onCodeChange: (newCode: string) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({ files, activeFile, onCodeChange }) => {
    
    const sandpackFiles = Object.entries(files).reduce((acc, [path, code]) => {
        const sandpackPath = path.startsWith('/') ? path : `/${path}`;
        acc[sandpackPath] = code;
        return acc;
    }, {} as { [key: string]: string });

    return (
        <div className="h-full w-full bg-card">
            <Sandpack
                template="react"
                files={sandpackFiles}
                options={{
                    activeFile: activeFile.startsWith('/') ? activeFile : `/${activeFile}`,
                    showLineNumbers: true,
                    showInlineErrors: true,
                    showNavigator: false,
                    showTabs: false,
                    showConsole: false,
                    showConsoleButton: false,
                    editorHeight: 'calc(100vh - 100px)',
                    readOnly: false,
                }}
                theme="dark"
                onCodeUpdate={(newCode) => onCodeChange(newCode)}
            />
        </div>
    );
};
