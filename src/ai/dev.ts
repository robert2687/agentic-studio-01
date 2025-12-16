import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-app-from-prompt.ts';
import '@/ai/flows/generate-tests-for-code.ts';
import '@/ai/flows/suggest-next-steps.ts';
import '@/ai/flows/generate-code-from-prompt.ts';
