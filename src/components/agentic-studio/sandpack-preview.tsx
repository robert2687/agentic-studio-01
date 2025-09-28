
"use client";

import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

interface SandpackPreviewProps {
    files: { [key: string]: string };
}

export const SandpackPreview: React.FC<SandpackPreviewProps> = ({ files }) => {
    
    const sandpackFiles = Object.entries(files).reduce((acc, [path, code]) => {
        // Sandpack expects paths to start with /
        const sandpackPath = path.startsWith('/') ? path : `/${path}`;
        acc[sandpackPath] = code;
        return acc;
    }, {} as { [key: string]: string });

    return (
        <Sandpack
            template="react"
            files={sandpackFiles}
            options={{
                showLineNumbers: true,
                showInlineErrors: true,
                showNavigator: true,
                showTabs: true,
                showConsole: true,
                showConsoleButton: true,
                editorHeight: '100%',
                previewHeight: '100%',
                readOnly: false,
            }}
            theme="dark"
        />
    );
};

    