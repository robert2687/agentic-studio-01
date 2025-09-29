
'use server';

/**
 * @fileOverview This flow generates the initial app file structure and code based on a user's prompt.
 *
 * - generateInitialApp - A function that accepts a prompt and returns the generated file structure and code.
 * - GenerateInitialAppInput - The input type for the generateInitialApp function.
 * - GenerateInitialAppOutput - The return type for the generateInitialApp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialAppInputSchema = z.object({
  prompt: z.string().describe('A high-level prompt describing the desired application.'),
});
export type GenerateInitialAppInput = z.infer<typeof GenerateInitialAppInputSchema>;

const GenerateInitialAppOutputSchema = z.object({
  codeFiles: z.array(z.object({
    path: z.string().describe('The full path of the file, starting with a forward slash (e.g., /src/app/page.tsx).'),
    content: z.string().describe('The complete, raw code for the file as a string.'),
  })).describe('An array of objects, where each object represents a file with its path and content.'),
});
export type GenerateInitialAppOutput = z.infer<typeof GenerateInitialAppOutputSchema>;

export async function generateInitialApp(input: GenerateInitialAppInput): Promise<GenerateInitialAppOutput> {
  return generateInitialAppFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialAppPrompt',
  input: {schema: GenerateInitialAppInputSchema},
  output: {schema: GenerateInitialAppOutputSchema},
  prompt: `You are an expert Next.js full-stack developer. Your task is to generate the initial file structure and code for a new application based on a user's prompt. The application must be built using the Next.js App Router, TypeScript, ShadCN UI components, and Tailwind CSS.

  **Instructions:**

  1.  **Analyze the User's Prompt:** Carefully understand the requirements described in the user's prompt.
  2.  **Tech Stack:**
      -   **Framework:** Next.js (with App Router)
      -   **Language:** TypeScript (use .tsx for components)
      -   **UI Components:** ShadCN/UI. You have access to all standard ShadCN components (e.g., \`@/components/ui/button\`, \`@/components/ui/card\`).
      -   **Styling:** Tailwind CSS. Use utility classes for styling. Adhere to the design system defined in the global CSS file (e.g., use \`bg-primary\`, \`text-foreground\`).
      -   **Icons:** Use icons from the \`lucide-react\` library.

  3.  **File Structure:** Generate all necessary files for a complete, runnable Next.js application. This should at a minimum include:
      -   \`src/app/layout.tsx\`: The root layout.
      -   \`src/app/page.tsx\`: The main page component.
      -   \`src/components/ui/\`: You can assume all ShadCN components are available and do not need to be generated.
      -   Additional components or routes as needed to fulfill the prompt.
      -   For any placeholder images, use \`https://picsum.photos/seed/<seedId>/<width>/<height>\`.

  4.  **Code Quality:**
      -   Produce clean, modern, and production-ready code.
      -   All components must be functional components using React Hooks.
      -   Ensure code is well-formatted and readable.
      -   Do not include any files that are not part of the \`src\` directory (like \`package.json\`, \`next.config.js\`, etc.). The environment handles these.

  5.  **Output Format:** You MUST return a single JSON object with one field: \`codeFiles\`.
      -   \`codeFiles\`: An array of objects. Each object must have a \`path\` (full path starting with \`/\`) and \`content\` (the complete file content).

  **Example File Structure:**
  - \`/src/app/page.tsx\`
  - \`/src/app/layout.tsx\`
  - \`/src/components/my-custom-component.tsx\`

  **User Prompt:** {{{prompt}}}
`,
});

const generateInitialAppFlow = ai.defineFlow(
  {
    name: 'generateInitialAppFlow',
    inputSchema: GenerateInitialAppInputSchema,
    outputSchema: GenerateInitialAppOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
