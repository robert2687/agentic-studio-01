
"use client";

import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

interface SandpackPreviewComponentProps {
    files: { [key: string]: string };
}

const OpenInNewWindowButton = () => {
    const { sandpack } = useSandpack();
    const openInNewWindow = () => {
        const clientId = Object.keys(sandpack.clients)[0];
        if (clientId) {
            window.open(`https://sandpack.codesandbox.io/p/v2/embed.html?clientId=${clientId}`, '_blank');
        }
    }
    return (
        <Button size="sm" variant="outline" onClick={openInNewWindow} disabled={!Object.keys(sandpack.clients).length}>
            <ExternalLink size={16} className="mr-2" /> Open in New Window
        </Button>
    )
}

export const SandpackPreviewComponent: React.FC<SandpackPreviewComponentProps> = ({ files }) => {
    
    const sandpackFiles = Object.entries(files).reduce((acc, [path, code]) => {
        const sandpackPath = path.startsWith('/') ? path : `/${path}`;
        acc[sandpackPath] = code;
        return acc;
    }, {} as { [key: string]: string });

    return (
        <div className="h-full w-full">
        <SandpackProvider
            template="react"
            files={sandpackFiles}
            theme="dark"
            options={{
              activeFile: sandpackFiles['/src/App.js'] ? '/src/App.js' : Object.keys(sandpackFiles).find(f => f.startsWith('/src')) || '/src/index.js'
            }}
        >
            <SandpackLayout>
                <SandpackPreview 
                    showNavigator={true}
                    showRefreshButton={true}
                    actionsChildren={<OpenInNewWindowButton />}
                />
            </SandpackLayout>
        </SandpackProvider>
        </div>
    );
};
