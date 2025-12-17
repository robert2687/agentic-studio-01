"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Settings } from '@/types/settings';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon } from 'lucide-react';

// Lazy load form components
const SettingsForm = dynamic(() => import('@/components/settings/settings-form'), {
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <SettingsIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Načítavam nastavenia...</p>
      </div>
    </div>
  ),
});

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(() => {
        toast({
          title: "Chyba",
          description: "Nepodarilo sa načítať nastavenia",
          variant: "destructive"
        });
        setIsLoading(false);
      });
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SettingsIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Načítavam nastavenia...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Chyba pri načítaní nastavení</p>
      </div>
    );
  }

  return <SettingsForm initialSettings={settings} />;
}