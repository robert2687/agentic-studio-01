"use client";

import React from 'react';
import { LayoutTemplate } from 'lucide-react';

export const CanvasView = () => (
    <div className="h-full bg-gray-800 flex items-center justify-center text-gray-400">
        <div className="text-center">
            <LayoutTemplate size={64} className="mx-auto mb-4 text-gray-500"/>
            <h3 className="text-xl font-grotesk font-semibold">Gemini Canvas</h3>
            <p>A space for visual prototyping and collaboration with the UI/UX Agent.</p>
        </div>
    </div>
);
