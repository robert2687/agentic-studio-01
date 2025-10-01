
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Bot, Code, Play, Terminal, LayoutTemplate, GitBranch, Share2, ArrowUp, Download, Send, Bell, Settings, Save, Expand, Minimize, RefreshCw } from 'lucide-react';
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
    { id: 2, name: 'Architect Agent', status: 'Idle', progress: 0, dependencies: [1] },
    { id: 3, name: 'Coder Agent', status: 'Idle', progress: 0, dependencies: [2] },
    { id: 4, name: 'Reviewer Agent', status: 'Idle', progress: 0, dependencies: [3] },
    { id: 5, name: 'Deployer Agent', status: 'Idle', progress: 0, dependencies: [4] },
];

const initialCode = `
import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'sans-serif' }}>Welcome to Agentic Studio</h1>
      <p style={{ fontFamily: 'sans-serif' }}>Use the chat on the left to tell me what you want to build.</p>
    </div>
  )
}
`;

const initialIndexJs = `
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

const initialStylesCss = `
body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  -webkit-animation: bugfix infinite 1s;
  margin: 0;
}

h1, h2, p {
  font-family: sans-serif;
}
`

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
    '/src/styles.css': initialStylesCss,
    '/src/index.js': initialIndexJs,
    '/package.json': '{ "name": "my-app", "dependencies": { "react": "18.2.0", "react-dom": "18.2.0" }, "main": "/src/index.js" }',
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

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

  const canRunTask = (task: Agent, allAgents: Agent[]): boolean => {
    if (!task.dependencies || task.dependencies.length === 0) {
      return true;
    }
    for (const depId of task.dependencies) {
      const depTask = allAgents.find(a => a.id === depId);
      if (!depTask || depTask.status !== 'Done') {
        return false;
      }
    }
    return true;
  };

  const runAgentWorkflow = useCallback(async (prompt: string) => {
    setAgents(initialAgents.map(a => ({ ...a, status: 'Idle', progress: 0 })));
    setMessages(prev => [...prev, { sender: 'ai', text: `Okay, I will scaffold an application based on your request: "${prompt}". I am engaging my team of AI agents to fulfill your request. You can see their status on the left.` }]);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: `User request received: '${prompt}'. Engaging agent team.` }]);

    const runTask = async (task: Agent) => {
      setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Working', progress: 0 } : a));
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: "Task started." }]);
      
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 10, 90);
        setAgents(prev => prev.map(a => a.id === task.id ? { ...a, progress } : a));
      }, 200);

      try {
        // Simulate agent work
        if (task.name === 'Coder Agent') {
          const result = await generateInitialApp({ prompt });
          const newCodeFilesArray = result.codeFiles;

          if (!newCodeFilesArray || newCodeFilesArray.length === 0) {
            throw new Error("AI failed to generate code files.");
          }
          const newCodeFiles = newCodeFilesArray.reduce((acc, file) => {
            acc[file.path] = file.content;
            return acc;
          }, {} as { [key: string]: string });
          
          const newFileStructure: FileNode = {
            name: 'my-app', type: 'folder', path: '/', children: []
          };
          const srcFolder: FileNode = { name: 'src', type: 'folder', path: '/src', children: [] };
          
          const pathMap: { [key: string]: FileNode } = { '/': newFileStructure, '/src': srcFolder };
          newFileStructure.children!.push(srcFolder);

          newCodeFilesArray.forEach(file => {
            const parts = file.path.split('/').filter(p => p);
            let currentPath = '';
            for (let i = 0; i < parts.length - 1; i++) {
              const part = parts[i];
              const parentPath = currentPath;
              currentPath += `/${part}`;
              if (!pathMap[currentPath]) {
                const newFolder: FileNode = { name: part, type: 'folder', path: currentPath, children: [] };
                pathMap[parentPath].children!.push(newFolder);
                pathMap[currentPath] = newFolder;
              }
            }
            const fileName = parts[parts.length - 1];
            const parentPath = parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : '/';
            pathMap[parentPath].children!.push({ name: fileName, type: 'file', path: file.path });
          });
          
          Object.keys(newCodeFiles).forEach(path => {
              if (!path.startsWith('/src/')) {
                  newFileStructure.children?.push({
                      name: path.slice(1),
                      type: 'file',
                      path: path,
                  });
              }
          });


          setFileStructure(newFileStructure);
          setCodeFiles(newCodeFiles);
          
          const mainFile = Object.keys(newCodeFiles).find(name => name.includes('page.tsx') || name.includes('App.jsx')) || Object.keys(newCodeFiles)[0];
          setCode(newCodeFiles[mainFile] || '');
          setActiveCodeFile(mainFile);

        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }

        clearInterval(progressInterval);
        setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Done', progress: 100 } : a));
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: "Task completed successfully." }]);
        setMessages(prev => [...prev, { sender: 'ai', text: `The **${task.name}** has completed its task.` }]);
        return true;
      } catch (error) {
        clearInterval(progressInterval);
        const errorMessage = (error as Error).message || 'An unknown error occurred.';
        setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Failed', progress: a.progress } : a));
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: `Task failed: ${errorMessage}` }]);
        setMessages(prev => [...prev, { sender: 'ai', text: `The **${task.name}** has failed: ${errorMessage}` }]);
        return false;
      }
    };

    const processQueue = async (agentQueue: Agent[]) => {
      for (const task of agentQueue) {
        if (!canRunTask(task, agents)) {
          setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Blocked' } : a));
          setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: "Task blocked due to dependency failure." }]);
          continue;
        }

        const success = await runTask(task);
        if (!success) {
          // Mark dependent tasks as blocked
          setAgents(currentAgents => {
            const queue = [...currentAgents];
            for (const a of queue) {
              if (a.dependencies?.includes(task.id)) {
                const dependentIndex = queue.findIndex(agent => agent.id === a.id);
                if (dependentIndex !== -1) {
                  queue[dependentIndex] = { ...queue[dependentIndex], status: 'Blocked' };
                  setLogs(prevLogs => [...prevLogs, { timestamp: new Date().toLocaleTimeString(), agent: a.name, message: `Task blocked because dependency '${task.name}' failed.` }]);
                }
              }
            }
            return queue;
          });
          break; // Stop processing queue on failure
        }
         // Update agents state for the next canRunTask check
        setAgents(currentAgents => {
            const updatedAgents = [...currentAgents];
            const taskIndex = updatedAgents.findIndex(a => a.id === task.id);
            if (taskIndex !== -1) {
                updatedAgents[taskIndex] = { ...updatedAgents[taskIndex], status: 'Done', progress: 100 };
            }
            return updatedAgents;
        });
      }
    };
    
    await processQueue(initialAgents);
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: "Workflow finished." }]);

  }, [agents]);


  const handleRetryTask = (taskId: number) => {
    const taskToRetry = agents.find(a => a.id === taskId);
    if (!taskToRetry) return;

    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: "Orchestrator", message: `Retrying task: ${taskToRetry.name}` }]);

    const runTask = async (task: Agent) => {
      setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Working', progress: 0 } : a));
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: "Task started." }]);
      
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 10, 90);
        setAgents(prev => prev.map(a => a.id === task.id ? { ...a, progress } : a));
      }, 200);

      try {
        if (task.name === 'Coder Agent') {
            const prompt = messages.find(m => m.sender === 'user')?.text || '';
            const result = await generateInitialApp({ prompt });
            // ... (rest of coder agent logic)
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }

        clearInterval(progressInterval);
        setAgents(prev => {
            let newAgents = prev.map(a => a.id === task.id ? { ...a, status: 'Done', progress: 100 } : a);
            // Unblock dependent tasks
            newAgents = newAgents.map(a => {
                if(a.dependencies?.includes(task.id) && a.status === 'Blocked') {
                    return {...a, status: 'Idle'}
                }
                return a;
            })
            return newAgents;
        });
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: "Task completed successfully." }]);
        setMessages(prev => [...prev, { sender: 'ai', text: `The **${task.name}** has completed its task.` }]);
        return true;
      } catch (error) {
        clearInterval(progressInterval);
        const errorMessage = (error as Error).message || 'An unknown error occurred.';
        setAgents(prev => prev.map(a => a.id === task.id ? { ...a, status: 'Failed', progress: a.progress } : a));
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), agent: task.name, message: `Task failed: ${errorMessage}` }]);
        return false;
      }
    };
    
    runTask(taskToRetry);
  }

  const handleSendMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    runAgentWorkflow(text);
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
      <header className="flex items-center justify-between h-16 px-6 border-b border-border flex-shrink-0 bg-card">
        <div className="flex items-center space-x-4">
          <Bot size={28} className="text-primary" />
          <h1 className="text-xl font-grotesk font-bold">Agentic Studio</h1>
          <div className="flex items-center bg-muted px-3 py-1.5 rounded-md text-sm">
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
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Navigation & Agent Overview */}
          {!isZenMode && (
            <>
              <Panel defaultSize={20} minSize={15} className="min-w-[300px] bg-card border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-grotesk font-semibold">Explorer</h2>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  <FileTree node={fileStructure} onFileSelect={handleFileSelect} />
                </div>
                <div className="border-t border-border flex-shrink-0">
                  <AgentStatus agents={agents} onRetry={handleRetryTask} />
                </div>
              </Panel>
              <PanelResizeHandle className="w-1.5 bg-border/80 hover:bg-accent/50 transition-colors" />
            </>
          )}
          
          {/* Center Panel: Dynamic Workspace */}
          {!isZenMode && (
            <>
              <Panel defaultSize={45} minSize={30} className="flex flex-col border-r border-border">
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
              <PanelResizeHandle className="w-1.5 bg-border/80 hover:bg-accent/50 transition-colors" />
            </>
          )}

          {/* Right Panel: Immediate Feedback */}
          <Panel defaultSize={isZenMode ? 100 : 35} minSize={30} className="flex flex-col bg-muted/30">
            <div className="flex-shrink-0 border-b border-border bg-card">
              <div className="flex justify-between items-center p-2">
                <div className="flex space-x-1">
                  <Button variant={rightView === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setRightView('preview')}>
                    <Play size={16} className="mr-2" /> Live Preview
                  </Button>
                  <Button variant={rightView === 'logs' ? 'secondary' : 'ghost'} size="sm" onClick={() => setRightView('logs')}>
                    <Terminal size={16} className="mr-2" /> Logs
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsZenMode(!isZenMode)}>
                  {isZenMode ? <Minimize size={16} className="mr-2" /> : <Expand size={16} className="mr-2" />}
                  {isZenMode ? 'Exit Zen Mode' : 'Zen Mode'}
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
}

    