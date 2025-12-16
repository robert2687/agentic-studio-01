
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type Message = {
    sender: 'user' | 'ai';
    text: string;
};

interface ChatMessageProps {
    msg: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg }) => {
    const isUser = msg.sender === 'user';
    const Icon = isUser ? User : Bot;
    
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
             <Avatar>
                <AvatarFallback className={isUser ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-muted'}>
                  <Icon size={18} />
                </AvatarFallback>
            </Avatar>
            <div className={`p-3 rounded-lg max-w-xl ${isUser ? 'bg-primary/10' : 'bg-muted'}`}>
                <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
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
        <div className="h-full flex flex-col bg-background">
            <div className="flex-1 overflow-y-auto p-6">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border">
                <div className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type 'start the build' to begin the upgrade..."
                        className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg py-3 pl-4 pr-12 focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        rows={1}
                    />
                    <Button onClick={handleSend} size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
