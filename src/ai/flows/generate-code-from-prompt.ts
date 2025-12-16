
'use server';

/**
 * @fileOverview This flow generates a code snippet based on a user's prompt.
 *
 * - generateCodeFromPrompt - A function that accepts a prompt and returns a generated code snippet.
 * - GenerateCodeFromPromptInput - The input type for the generateCodeFromPrompt function.
 * - GenerateCodeFromPromptOutput - The return type for the generateCodeFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired code snippet.'),
});
export type GenerateCodeFromPromptInput = z.infer<typeof GenerateCodeFromPromptInputSchema>;

const GenerateCodeFromPromptOutputSchema = z.object({
  code: z.string().describe('The generated code snippet as a string.'),
});
export type GenerateCodeFromPromptOutput = z.infer<typeof GenerateCodeFromPromptOutputSchema>;

export async function generateCodeFromPrompt(input: GenerateCodeFromPromptInput): Promise<GenerateCodeFromPromptOutput> {
  return generateCodeFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodeFromPromptPrompt',
  input: {schema: GenerateCodeFromPromptInputSchema},
  output: {schema: GenerateCodeFromPromptOutputSchema},
  prompt: `You are an expert Next.js full-stack developer. Your mission is to generate a single, clean, and production-ready code snippet based on a user's prompt.

  **Core Principles:**

  1.  **Analyze the User's Prompt:** Deconstruct the user's request to understand the desired functionality.
  2.  **Tech Stack & Design System:**
      -   **Framework:** Next.js (with App Router). Use Server Components by default.
      -   **Language:** TypeScript (use .tsx for components).
      -   **UI Components:** Exclusively use ShadCN/UI components (e.g., \`@/components/ui/button\`).
      -   **Styling:** Use Tailwind CSS utility classes.
      -   **Icons:** Use icons from the \`lucide-react\` library.

  3.  **Code Quality & Best Practices:**
      -   Produce clean, modern, readable, and production-ready code.
      -   The snippet should be a functional component using React Hooks.
      -   Ensure code is well-formatted.
      -   The generated code should be a single snippet that can be copied and pasted. Do not generate entire files or folder structures.

  4.  **Output Format:** You MUST return a single JSON object with one field: \`code\`.
      -   \`code\`: A string containing the complete code snippet.

  **User Prompt:** {{{prompt}}}
`,
});

const generateCodeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCodeFromPromptFlow',
    inputSchema: GenerateCodeFromPromptInputSchema,
    outputSchema: GenerateCodeFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
