"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bot, Code, Play, Terminal, LayoutTemplate, Folder, File, ChevronRight, ChevronDown, User, Settings, Bell, GitBranch, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentStatus, type Agent } from '@/components/agentic-studio/agent-status';
import { FileTree, type FileNode } from '@/components/agentic-studio/file-tree';
import { ChatView, type Message } from '@/components/agentic-studio/chat-view';
import { CodeEditorView } from '@/components/agentic-studio/code-editor';
import { CanvasView } from '@/components/agentic-studio/canvas-view';
import { LivePreview } from '@/components/agentic-studio/live-preview';
import { LogsView, type Log } from '@/components/agentic-studio/logs-view';
import { useToast } from "@/hooks/use-toast"

// Mock Data
const initialFileStructure: FileNode = {
  name: 'projekt-receptov',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.jsx', type: 'file' },
            { name: 'RecipeCard.jsx', type: 'file' },
          ],
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'HomePage.jsx', type: 'file' },
            { name: 'LoginPage.jsx', type: 'file', status: 'generating' },
          ],
        },
        { name: 'App.jsx', type: 'file' },
        { name: 'index.css', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ],
};

const initialAgents: Agent[] = [
  { id: 1, name: 'Requirements Analyst', status: 'Idle', progress: 0 },
  { id: 2, name: 'UI/UX Architect', status: 'Idle', progress: 0 },
  { id: 3, name: 'Frontend Coder', status: 'Idle', progress: 0 },
  { id: 4, name: 'Backend Coder', status: 'Idle', progress: 0 },
  { id: 5, name: 'QA & Security Agent', status: 'Idle', progress: 0 },
  { id: 6, name: 'DevOps & Deployment', status: 'Idle', progress: 0 },
];

const codeContent: { [key: string]: string } = {
  'LoginPage.jsx': `
import React, { useState } from 'react';

// Generované Frontend Coder Agentom
// Úloha: Vytvoriť prihlasovací formulár

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implementovať volanie na Supabase Auth
    console.log('Prihlasovanie s:', { email, password });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Prihlásenie</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Heslo</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}
  `,
};

export default function AgenticStudioPage() {
  const [fileStructure, setFileStructure] = useState<FileNode>(initialFileStructure);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [centerView, setCenterView] = useState('chat');
  const [rightView, setRightView] = useState('preview');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Vitajte v **Agentic Studio**! Som váš AI projektový manažér a orchestrátor. Povedzte mi, čo by ste chceli vytvoriť.' }
  ]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeCodeFile, setActiveCodeFile] = useState('LoginPage.jsx');
  const { toast } = useToast();

  const addLog = useCallback((agent: string, message: string, color: string = 'text-green-400') => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [...prev, { timestamp, agent, message, color }]);
  }, []);

  const runAgentWorkflow = useCallback(() => {
    let currentAgents = [...initialAgents];
    
    const updateAgent = (id: number, status: Agent['status'], progress: number) => {
        currentAgents = currentAgents.map(a => a.id === id ? { ...a, status, progress } : a);
        setAgents([...currentAgents]);
    };

    addLog('Orchestrator', 'Prijatá požiadavka na vytvorenie prihlasovacej stránky.', 'text-yellow-300');
    
    setTimeout(() => {
        addLog('Orchestrator', 'Analyzujem požiadavky...');
        updateAgent(1, 'Pracuje', 50);
    }, 500);

    setTimeout(() => {
        updateAgent(1, 'Pracuje', 100);
        addLog('Requirements Analyst', 'Špecifikácie extrahované. Vstup: text, Výstup: PRD.', 'text-cyan-400');
    }, 1500);

    setTimeout(() => {
        updateAgent(1, 'Dokončené', 100);
        addLog('Orchestrator', 'Priraďujem úlohu UI/UX Architektovi.');
        updateAgent(2, 'Pracuje', 25);
    }, 2000);

    setTimeout(() => {
        addLog('UI/UX Architect', 'Generujem wireframe v Gemini Canvas...', 'text-purple-400');
        updateAgent(2, 'Pracuje', 75);
        setCenterView('canvas');
        toast({ title: "UI/UX Agent", description: "Gemini Canvas bol aktualizovaný."});
    }, 3000);

    setTimeout(() => {
        updateAgent(2, 'Dokončené', 100);
        addLog('Orchestrator', 'Návrh schválený. Priraďujem úlohu Frontend Coderovi.');
        updateAgent(3, 'Pracuje', 10);
    }, 4500);
    
    setTimeout(() => {
        addLog('Frontend Coder', 'Vytváram súbor `src/pages/LoginPage.jsx`...', 'text-pink-400');
        updateAgent(3, 'Pracuje', 30);
        setFileStructure(prev => {
            const newStruct = JSON.parse(JSON.stringify(prev));
            newStruct.children[0].children[1].children[1].status = 'generating';
            return newStruct;
        });
    }, 5500);

    setTimeout(() => {
        addLog('Frontend Coder', 'Píšem React kód pre prihlasovací formulár.', 'text-pink-400');
        updateAgent(3, 'Pracuje', 80);
        setCenterView('code');
        setActiveCodeFile('LoginPage.jsx');
        toast({ title: "Frontend Agent", description: "Kód pre LoginPage.jsx bol vygenerovaný."});
    }, 7000);

    setTimeout(() => {
        updateAgent(3, 'Dokončené', 100);
        addLog('Frontend Coder', 'Komponent `LoginPage` je pripravený na revíziu.', 'text-pink-400');
        setFileStructure(prev => {
            const newStruct = JSON.parse(JSON.stringify(prev));
            newStruct.children[0].children[1].children[1].status = 'done';
            return newStruct;
        });
        setMessages(prev => [...prev, { sender: 'ai', text: 'Frontend Coder dokončil implementáciu `LoginPage.jsx`. Kód je pripravený na revíziu v záložke **Kód** a náhľad je dostupný v **Živom náhľade**.' }]);
    }, 9000);
    
    setTimeout(() => {
        addLog('Orchestrator', 'Priraďujem úlohu QA Agentovi.');
        updateAgent(5, 'Pracuje', 20);
    }, 9500);

    setTimeout(() => {
        addLog('QA & Security', 'Spúšťam unit testy pre `LoginPage.jsx`...', 'text-teal-400');
        updateAgent(5, 'Pracuje', 70);
    }, 10500);

    setTimeout(() => {
        updateAgent(5, 'Dokončené', 100);
        addLog('QA & Security', 'Testy prešli. Pokrytie: 85%. Žiadne kritické zraniteľnosti.', 'text-teal-400');
        setMessages(prev => [...prev, { sender: 'ai', text: 'QA Agent potvrdil kvalitu a bezpečnosť kódu. Čakám na vaše schválenie alebo ďalšie pokyny.' }]);
    }, 12000);

  }, [addLog, toast]);

  const handleSendMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    
    if (text.toLowerCase().includes('prihlasovaciu stránku')) {
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Rozumiem. Spúšťam pracovný postup na vytvorenie prihlasovacej stránky. Budem vás informovať o priebehu.' }]);
            runAgentWorkflow();
        }, 1000);
    } else {
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Váš pokyn bol zaznamenaný. Momentálne som nakonfigurovaný na demo workflow pre "prihlasovaciu stránku". Skúste zadať tento pokyn.' }]);
        }, 1000);
    }
  }, [runAgentWorkflow]);

  return (
    <div className="bg-[#111827] text-white h-screen flex flex-col font-sans">
      <header className="flex items-center justify-between h-14 px-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Bot size={24} className="text-blue-400" />
          <h1 className="text-lg font-grotesk font-bold">Agentic Studio</h1>
          <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-md text-sm">
            <GitBranch size={14} className="mr-2" />
            <span>main</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            <Share2 size={14} className="mr-2" />
            Zdieľať
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings size={20} />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-indigo-500 text-white font-bold text-sm">P</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 min-w-[280px] bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-md font-grotesk font-semibold">Prieskumník</h2>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <FileTree node={fileStructure} />
          </div>
          <div className="border-t border-gray-700 flex-shrink-0">
            <AgentStatus agents={agents} />
          </div>
        </div>

        <div className="w-2/5 flex flex-col border-r border-gray-700">
          <div className="flex-shrink-0 border-b border-gray-700">
            <div className="flex space-x-1 p-2">
              <button onClick={() => setCenterView('chat')} className={`flex items-center px-4 py-2 text-sm rounded-md ${centerView === 'chat' ? 'bg-gray-700' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                <Bot size={16} className="mr-2" /> Chat
              </button>
              <button onClick={() => setCenterView('code')} className={`flex items-center px-4 py-2 text-sm rounded-md ${centerView === 'code' ? 'bg-gray-700' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                <Code size={16} className="mr-2" /> Kód
              </button>
              <button onClick={() => setCenterView('canvas')} className={`flex items-center px-4 py-2 text-sm rounded-md ${centerView === 'canvas' ? 'bg-gray-700' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                <LayoutTemplate size={16} className="mr-2" /> Canvas
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-gray-800/50">
            {centerView === 'chat' && <ChatView messages={messages} onSendMessage={handleSendMessage} />}
            {centerView === 'code' && <CodeEditorView content={codeContent[activeCodeFile] || 'Vyberte súbor na zobrazenie kódu.'} />}
            {centerView === 'canvas' && <CanvasView />}
          </div>
        </div>

        <div className="w-2/5 flex flex-col bg-gray-800/30">
          <div className="flex-shrink-0 border-b border-gray-700">
            <div className="flex space-x-1 p-2">
              <button onClick={() => setRightView('preview')} className={`flex items-center px-4 py-2 text-sm rounded-md ${rightView === 'preview' ? 'bg-gray-700' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                <Play size={16} className="mr-2" /> Živý náhľad
              </button>
              <button onClick={() => setRightView('logs')} className={`flex items-center px-4 py-2 text-sm rounded-md ${rightView === 'logs' ? 'bg-gray-700' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                <Terminal size={16} className="mr-2" /> Logy
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            {rightView === 'preview' && <LivePreview />}
            {rightView === 'logs' && <LogsView logs={logs} />}
          </div>
        </div>
      </div>
    </div>
  );
}
