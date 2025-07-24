export interface Settings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: string;
  // pridaj ďalšie polia podľa potreby
}

import { z } from 'zod';

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notificationsEnabled: z.boolean(),
  language: z.string().min(2, { message: 'Zadaj aspoň 2 písmená' }),
});

export type SettingsForm = z.infer<typeof settingsSchema>;