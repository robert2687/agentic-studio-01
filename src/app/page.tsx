
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Bot, Code, Play, Terminal, LayoutTemplate, GitBranch, Share2, ArrowUp, Download, Send, Bell, Settings, Save } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentStatus, type Agent } from '@/components/agentic-studio/agent-status';
import { FileTree, type FileNode } from '@/components/agentic-studio/file-tree';
import { ChatView, type Message } from '@/components/agentic-studio/chat-view';
import { CodeEditorView } from '@/components/agentic-studio/code-editor';
import { CanvasView } from '@/components/agentic-studio/canvas-view';
import { SandpackPreviewComponent } from '@/components/agentic-studio/sandpack-preview';
import { LogsView, type Log } from '@/components/agentic-studio/logs-view';
import { useToast } from "@/hooks/use-toast";
import { useAutoSave } from '@/hooks/use-auto-save';
import { SettingsDialog } from '@/components/agentic-studio/settings-dialog';
import { generateInitialApp } from '@/ai/flows/generate-initial-app-from-prompt';

const initialFileStructure: FileNode = {
  name: 'my-app',
  type: 'folder',
  path: '/',
  children: [
    {
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        { name: 'App.jsx', type: 'file', path: '/src/App.jsx' },
        { name: 'index.js', type: 'file', path: '/src/index.js' },
        { name: 'styles.css', type: 'file', path: '/src/styles.css' },
      ],
    },
    { name: 'package.json', type: 'file', path: '/package.json' },
  ],
};

const initialAgents: Agent[] = [
    { id: 1, name: 'Planner Agent', status: 'Idle', progress: 0 },
    { id: 2, name: 'Architect Agent', status: 'Idle', progress: 0 },
    { id: 3, name: 'Coder Agent', status: 'Idle', progress: 0 },
    { id: 4, name: 'Reviewer Agent', status: 'Idle', progress: 0 },
    { id: 5, name: 'Deployer Agent', status: 'Idle', progress: 0 },
];

const initialCode = `
import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Agentic Studio</h1>
      <p>Use the chat on the left to tell me what you want to build.</p>
    </div>
  )
}
`;

const initialIndexJs = `
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const EDITOR_STORAGE_KEY = 'synapse-editor-code';

export default function AgenticStudioPage() {
  const [fileStructure, setFileStructure] = useState<FileNode>(initialFileStructure);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [centerView, setCenterView] = useState('chat');
  const [rightView, setRightView] = useState('preview');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: `Welcome to **Agentic Studio**. I am your AI project manager.
<br/><br/>
My team of agents is ready to generate a production-ready upgrade for the **AI Builder Studio**. The plan includes:
- A modular drag-and-drop form builder
- A template library with categories and search
- Firestore for versioning and history with a diff view
- Role-Based Access Control (RBAC) and audit logging
- A secure Node.js/Express backend with CI/CD
<br/><br/>
Tell me to "start the build" to begin the upgrade.` }
  ]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeCodeFile, setActiveCodeFile] = useState('/src/App.jsx');
  
  const [code, setCode] = useState(initialCode);
  const { isSaving } = useAutoSave(code, EDITOR_STORAGE_KEY);

  const [codeFiles, setCodeFiles] = useState<{ [key: string]: string }>({
    '/src/App.jsx': initialCode,
    '/src/styles.css': 'body { margin: 0; }',
    '/src/index.js': initialIndexJs,
    '/package.json': '{ "name": "my-app", "dependencies": { "react": "18.2.0", "react-dom": "18.2.0", "react-scripts": "5.0.1" }, "main": "/src/index.js" }',
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedCode = localStorage.getItem(EDITOR_STORAGE_KEY);
      if (savedCode) {
        const parsedCode = JSON.parse(savedCode);
        if (typeof parsedCode === 'string') {
          setCode(parsedCode);
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  const runAgentWorkflow = useCallback(async (prompt: string) => {
    setAgents(initialAgents);
    setMessages(prev => [...prev, { sender: 'ai', text: `Okay, I will scaffold an application based on your request: "${prompt}". I am engaging my team of AI agents to fulfill your request. You can see their status on the left.` }]);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: `User request received: '${prompt}'. Engaging agent team.` }]);

    const agentRunner = (agentName: string, duration: number, callback: () => void) => {
        setAgents(prev => prev.map(a => a.name === agentName ? { ...a, status: 'Working', progress: 0 } : a));
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: agentName, message: "Task started." }]);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                setAgents(prev => prev.map(a => a.name === agentName ? { ...a, progress } : a));
            }
        }, duration / 10);
        
        setTimeout(() => {
            clearInterval(interval);
            setAgents(prev => prev.map(a => a.name === agentName ? { ...a, status: 'Done', progress: 100 } : a));
            setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: agentName, message: "Task completed successfully." }]);
            callback();
        }, duration);
    };

    agentRunner("Planner Agent", 1500, () => {
        setMessages(prev => [...prev, { sender: 'ai', text: 'The **Planner Agent** has defined the upgraded features, user personas, and workflows in a structured requirements document. Handing off to the Architect.' }]);
        agentRunner("Architect Agent", 2000, () => {
            setMessages(prev => [...prev, { sender: 'ai', text: `The **Architect Agent** has designed the system architecture, including a production-grade Firestore schema and a Role-Based Access Control (RBAC) model.
<br/><br/>
The schema supports multi-tenancy (\`organizations\`), versioned content (\`templates\`, \`versions\`), and security (\`roles\`, \`auditLogs\`). The security rules enforce least-privilege access and immutable versioning.
<br/><br/>
Passing the blueprint to the Coder.` }]);
            agentRunner("Coder Agent", 4000, async () => {
              setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Coder Agent", message: "Generating file structure and code..." }]);
              try {
                const result = await generateInitialApp({ prompt });
                const newFileStructure = result.fileStructure;
                const newCodeFilesArray = result.codeFiles;

                if (!newFileStructure || !newCodeFilesArray || newCodeFilesArray.length === 0) {
                  console.error("AI failed to generate file structure or code files.", result);
                  setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, an error occurred while building the application. The AI agents failed to generate the necessary files." }]);
                  setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: "Error: AI generation failed. Missing file structure or code files." }]);
                  return;
                }

                const newCodeFiles = newCodeFilesArray.reduce((acc, file) => {
                  acc[file.path] = file.content;
                  return acc;
                }, {} as { [key: string]: string });

                setFileStructure(newFileStructure);
                setCodeFiles(newCodeFiles);
                
                const mainFile = Object.keys(newCodeFiles).find(name => name.includes('App.jsx') || name.includes('index.js')) || Object.keys(newCodeFiles)[0];
                const mainFileContent = newCodeFiles[mainFile] || '';
                setCode(mainFileContent);
                setActiveCodeFile(mainFile);

                setMessages(prev => [...prev, { sender: 'ai', text: 'The **Coder Agent** has implemented the drag-and-drop builder, template library, and Firestore versioning. Submitting for review.' }]);

                agentRunner("Reviewer Agent", 2500, () => {
                    setMessages(prev => [...prev, { sender: 'ai', text: 'The **Reviewer Agent** has audited the Firestore security rules for least-privilege access and validated the immutability guarantees for versioned documents. Code approved. Handing off for deployment.' }]);
                    agentRunner("Deployer Agent", 1500, () => {
                        setMessages(prev => [...prev, { sender: 'ai', text: 'The **Deployer Agent** has provided a step-by-step guide for deploying the Firestore rules, audit-logging Cloud Functions, and a CI/CD pipeline that includes **preview channels for Hosting**, ensuring every PR gets its own isolated test environment. The application upgrade is ready.' }]);
                        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: "Workflow complete. All agents finished." }]);
                    });
                });
              } catch (error) {
                console.error("Error generating app:", error);
                const errorMessage = (error as Error).message || 'An unknown error occurred.';
                setMessages(prev => [...prev, { sender: 'ai', text: `An error occurred while building the application: ${errorMessage}` }]);
                setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: `Error during generation: ${errorMessage}` }]);
              }
          });
        });
    });
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    const fullPrompt = `You are a coordinated team of AI agents tasked with generating a complete, production-ready upgrade of the AI Builder Studio application.
Agents must collaborate sequentially, handing off results to the next role. Do not skip steps.

PROJECT CONTEXT:
- Application: AI Builder Studio
- User Request: "${text}"
- Upgrade goals:
  • Modular React components with reusable UI blocks
  • Drag & drop form builder with live preview
  • Template library with tags, categories, and search
  • Firestore versioning for templates and forms
  • Diff view for history and rollback
  • Role-based access control (RBAC) with granular permissions
  • Audit logging for all critical actions
  • Secure backend orchestration (Node.js/Express + Firebase Cloud Functions)`;
    runAgentWorkflow(fullPrompt);
  }, [runAgentWorkflow]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setCodeFiles(prev => ({
        ...prev,
        [activeCodeFile]: newCode
    }))
  }, [activeCodeFile]);

  const handleFileSelect = (path: string) => {
    if (codeFiles[path] !== undefined) {
      setActiveCodeFile(path);
      setCode(codeFiles[path]);
    }
  };


  return (
    <div className="bg-background text-foreground h-screen flex flex-col font-sans">
      <header className="flex items-center justify-between h-14 px-4 border-b border-border flex-shrink-0 bg-card">
        <div className="flex items-center space-x-4">
          <Bot size={24} className="text-primary" />
          <h1 className="text-lg font-grotesk font-bold">Agentic Studio</h1>
          <div className="flex items-center bg-muted px-3 py-1 rounded-md text-sm">
            <GitBranch size={14} className="mr-2" />
            <span>main</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Committing...", description: "Staging changes and committing to the local branch." })}>
            Commit
          </Button>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Pushing...", description: "Pushing changes to the remote repository." })}>
              <ArrowUp size={14} className="mr-2" />
              Push
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Pulling...", description: "Fetching and merging changes from the remote." })}>
              <Download size={14} className="mr-2" />
              Pull
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            {isSaving && <div className="flex items-center text-sm text-muted-foreground"><Save size={14} className="mr-1 animate-pulse" /> Saving...</div>}
          <Button variant="default" size="sm" onClick={() => toast({ title: "Shared", description: "Project shared successfully." })}>
            <Share2 size={14} className="mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => toast({ title: "Notifications", description: "No new notifications." })}>
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Navigation & Agent Overview */}
          <Panel defaultSize={20} minSize={15} className="min-w-[280px] bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-md font-grotesk font-semibold">Explorer</h2>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <FileTree node={fileStructure} onFileSelect={handleFileSelect} />
            </div>
            <div className="border-t border-border flex-shrink-0">
              <AgentStatus agents={agents} />
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors" />

          {/* Center Panel: Dynamic Workspace */}
          <Panel defaultSize={40} minSize={30} className="flex flex-col border-r border-border">
            <div className="flex-shrink-0 border-b border-border bg-card">
              <div className="flex space-x-1 p-2">
                <Button variant={centerView === 'chat' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCenterView('chat')}>
                  <Bot size={16} className="mr-2" /> Chat
                </Button>
                <Button variant={centerView === 'code' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCenterView('code')}>
                  <Code size={16} className="mr-2" /> Code
                </Button>
                <Button variant={centerView === 'canvas' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCenterView('canvas')}>
                  <LayoutTemplate size={16} className="mr-2" /> Canvas
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-background">
              {centerView === 'chat' && <ChatView messages={messages} onSendMessage={handleSendMessage} />}
              {centerView === 'code' && <CodeEditorView files={codeFiles} activeFile={activeCodeFile} onCodeChange={handleCodeChange} code={code} />}
              {centerView === 'canvas' && <CanvasView />}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors" />

          {/* Right Panel: Immediate Feedback */}
          <Panel defaultSize={40} minSize={30} className="flex flex-col bg-muted/30">
            <div className="flex-shrink-0 border-b border-border bg-card">
              <div className="flex space-x-1 p-2">
                <Button variant={rightView === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setRightView('preview')}>
                   <Play size={16} className="mr-2" /> Live Preview
                </Button>
                <Button variant={rightView === 'logs' ? 'secondary' : 'ghost'} size="sm" onClick={() => setRightView('logs')}>
                  <Terminal size={16} className="mr-2" /> Logs
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {rightView === 'preview' && <SandpackPreviewComponent files={codeFiles} />}
              {rightView === 'logs' && <div className="p-4"><LogsView logs={logs} /></div>}
            </div>
          </Panel>
        </PanelGroup>
      </main>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );

    

    

