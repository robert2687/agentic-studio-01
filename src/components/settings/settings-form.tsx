"use client";

import { useState } from 'react';
import { Settings } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: Settings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Chyba pri ukladaní');
      }

      toast({
        title: "Úspech",
        description: "Nastavenia boli úspešne uložené"
      });
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa uložiť nastavenia",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-grotesk font-bold text-foreground">Nastavenia</h1>
          </div>
          <p className="text-muted-foreground">Upravte si aplikáciu podľa svojich preferencií</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-grotesk">Vzhľad a správanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme-select" className="text-sm font-medium">
                Motív aplikácie
              </Label>
              <Select
                value={settings.theme}
                onValueChange={(value: 'light' | 'dark') => handleChange('theme', value)}
              >
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Vyberte motív" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">🌞 Svetlý motív</SelectItem>
                  <SelectItem value="dark">🌙 Tmavý motív</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Notifikácie
                </Label>
                <p className="text-xs text-muted-foreground">
                  Povoliť zobrazovanie upozornení v aplikácii
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => handleChange('notificationsEnabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Jazyk aplikácie
              </Label>
              <Input
                id="language"
                type="text"
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                placeholder="Zadajte kód jazyka (napr. sk, en)"
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Použite ISO kód jazyka (sk, en, de, fr, atď.)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <SettingsIcon className="w-4 h-4 mr-2 animate-spin" />
                Ukladám...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Uložiť
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
