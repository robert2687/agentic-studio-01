"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';

export type Message = {
    sender: 'user' | 'ai';
    text: string;
};

interface ChatMessageProps {
    msg: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg }) => {
    const Icon = msg.sender === 'user' ? User : Bot;
    const bgColor = msg.sender === 'user' ? 'bg-blue-600/30' : 'bg-gray-700/50';
    const alignment = msg.sender === 'user' ? 'justify-end' : 'justify-start';

    return (
        <div className={`flex ${alignment} mb-4`}>
            <div className={`flex items-start gap-3 max-w-xl`}>
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><Icon size={18} className="text-gray-300" /></div>}
                <div className={`${bgColor} p-3 rounded-lg`}>
                    <p className="text-sm text-gray-200" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                </div>
                 {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Icon size={18} className="text-white" /></div>}
            </div>
        </div>
    );
};


interface ChatViewProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-800/50">
            <div className="flex-1 overflow-y-auto p-6">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Zadajte pokyn pre orchestrátora... (napr. 'Vytvor prihlasovaciu stránku')"
                        className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
