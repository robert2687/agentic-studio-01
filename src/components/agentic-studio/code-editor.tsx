
"use client";

import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

interface CodeEditorViewProps {
    files: { [key: string]: string };
    activeFile: string;
    code: string;
    onCodeChange: (newCode: string) => void;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({ files, activeFile, code, onCodeChange }) => {
    
    const sandpackFiles = Object.entries(files).reduce((acc, [path, fileContent]) => {
        const sandpackPath = path.startsWith('/') ? path : `/${path}`;
        if (path === activeFile) {
            acc[sandpackPath] = { code: code, active: true };
        } else {
            acc[sandpackPath] = fileContent;
        }
        return acc;
    }, {} as { [key: string]: any });

    return (
        <div className="h-full w-full bg-card">
            <Sandpack
                template="react"
                files={sandpackFiles}
                options={{
                    showLineNumbers: true,
                    showInlineErrors: true,
                    showNavigator: false,
                    showTabs: true,
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
