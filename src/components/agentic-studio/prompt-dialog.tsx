
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '../ui/label';

interface PromptDialogProps {
  children: React.ReactNode;
  onGenerate: (prompt: string) => void;
}

export const PromptDialog: React.FC<PromptDialogProps> = ({ children, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
      setIsOpen(false);
      setPrompt('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Build from a Prompt</DialogTitle>
          <DialogDescription>
            Describe the application you want the AI agents to build. Be as descriptive as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Your Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A to-do list app with categories and due dates."
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
          <Button type="submit" onClick={handleGenerate} disabled={!prompt.trim()}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

    