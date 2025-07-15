// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that analyzes the current project state and suggests the next logical steps.
 *
 * - suggestNextSteps - A function that takes the current project state and returns suggested next steps.
 * - SuggestNextStepsInput - The input type for the suggestNextSteps function.
 * - SuggestNextStepsOutput - The return type for the suggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextStepsInputSchema = z.object({
  currentProjectState: z.string().describe('A description of the current project state, including file structure, code snippets, and agent statuses.'),
});

export type SuggestNextStepsInput = z.infer<typeof SuggestNextStepsInputSchema>;

const SuggestNextStepsOutputSchema = z.object({
  nextSteps: z.array(z.string()).describe('An array of suggested next steps for the developer.'),
});

export type SuggestNextStepsOutput = z.infer<typeof SuggestNextStepsOutputSchema>;

export async function suggestNextSteps(input: SuggestNextStepsInput): Promise<SuggestNextStepsOutput> {
  return suggestNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextStepsPrompt',
  input: {schema: SuggestNextStepsInputSchema},
  output: {schema: SuggestNextStepsOutputSchema},
  prompt: `You are an AI assistant helping a developer build a full-stack application.

You are given the current state of the project, and you need to suggest the next logical steps the developer should take.

Consider the following project state:

{{currentProjectState}}

Suggest at least three next steps the developer should take to continue building the application.
Keep the response to a maximum of five steps.

Format the output as a JSON array of strings.
`,
});

const suggestNextStepsFlow = ai.defineFlow(
  {
    name: 'suggestNextStepsFlow',
    inputSchema: SuggestNextStepsInputSchema,
    outputSchema: SuggestNextStepsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
