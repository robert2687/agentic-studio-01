
"use client";

import React from 'react';
import { LayoutTemplate } from 'lucide-react';

export const CanvasView = () => (
    <div className="h-full bg-background flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center border-2 border-dashed border-border rounded-lg p-12">
            <LayoutTemplate size={64} className="mx-auto mb-4 text-muted-foreground"/>
            <h3 className="text-xl font-grotesk font-semibold text-foreground">Gemini Canvas</h3>
            <p>A space for visual prototyping and collaboration with the UI/UX Agent.</p>
        </div>
    </div>
);

    