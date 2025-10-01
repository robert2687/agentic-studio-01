
"use client";

import React from 'react';
import { ImagePlus, PenSquare } from 'lucide-react';
import { PromptDialog } from './prompt-dialog';

interface CanvasViewProps {
    onGenerate: (prompt: string) => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ onGenerate }) => (
    <div className="h-full bg-background flex items-center justify-center p-8">
        <div className="w-full h-full border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-grotesk font-bold text-foreground">Gemini Canvas</h1>
                <p className="text-muted-foreground mt-2">Your visual prototyping space. Powered by AI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-card p-8 rounded-lg border border-border flex flex-col items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                    <ImagePlus size={48} className="text-primary mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Build from an Image</h2>
                    <p className="text-muted-foreground mt-1 text-sm">Drag and drop a screenshot or wireframe.</p>
                </div>
                
                <PromptDialog onGenerate={onGenerate}>
                    <div className="bg-card p-8 rounded-lg border border-border flex flex-col items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <PenSquare size={48} className="text-primary mb-4" />
                        <h2 className="text-xl font-semibold text-foreground">Build from a Prompt</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Describe the UI you want to create.</p>
                    </div>
                </PromptDialog>
            </div>

            <p className="text-xs text-muted-foreground mt-12">
                Click "Build from a Prompt" to generate a new application.
            </p>
        </div>
    </div>
);
