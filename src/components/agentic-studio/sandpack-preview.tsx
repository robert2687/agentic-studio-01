
"use client";

import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

interface SandpackPreviewProps {
    code: string;
}

export const SandpackPreview: React.FC<SandpackPreviewProps> = ({ code }) => {
    return (
        <Sandpack
            template="react"
            files={{
                "/App.js": code,
            }}
            options={{
                showLineNumbers: true,
                showInlineErrors: true,
                showNavigator: false,
                showTabs: false,
                showConsole: false,
                showConsoleButton: false,
                editorHeight: '100%',
                previewHeight: '100%',
                readOnly: true,
            }}
            theme="dark"
        />
    );
};
