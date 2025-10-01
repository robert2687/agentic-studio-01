
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
  prompt: `You are an expert Next.js full-stack developer acting as a "Design System Agent". Your mission is to generate the initial file structure and code for a new application based on a user's prompt, ensuring it is production-ready, beautiful, and adheres to a strict design system.

  **Core Principles:**

  1.  **Analyze the User's Prompt:** Deconstruct the user's request to define components, pages, and overall application structure.
  2.  **Tech Stack & Design System:**
      -   **Framework:** Next.js (with App Router). Use Server Components by default.
      -   **Language:** TypeScript (use .tsx for components).
      -   **UI Components:** Exclusively use ShadCN/UI components (e.g., \`@/components/ui/button\`, \`@/components/ui/card\`, etc.). Do NOT use raw HTML elements like \`<button>\` or \`<div>\` for layout when a component is more appropriate.
      -   **Styling:** Use Tailwind CSS utility classes. Strictly adhere to the design system defined in the global CSS file (e.g., use \`bg-primary\`, \`text-foreground\`, \`border\`). Do not use arbitrary values.
      -   **Icons:** Use icons from the \`lucide-react\` library.
      -   **Fonts:** Use the configured fonts: \`font-sans\` for body, \`font-grotesk\` for headings.

  3.  **File Structure & Architecture:**
      -   Generate a complete and runnable Next.js application structure within the \`/src\` directory.
      -   **Component-Based:** Break down the UI into logical, reusable components and place them in \`/src/components/custom/\`. Do not put all the code in a single page file.
      -   Create necessary files: \`/src/app/layout.tsx\`, \`/src/app/page.tsx\`, and any additional pages or components required by the prompt.
      -   For any placeholder images, you MUST use \`https://picsum.photos/seed/<seedId>/<width>/<height>\` and include a relevant \`data-ai-hint\` attribute.

  4.  **Code Quality & Best Practices:**
      -   Produce clean, modern, readable, and production-ready code.
      -   All components must be functional components using React Hooks.
      -   Ensure code is well-formatted.
      -   Do not include any files outside the \`src\` directory (like \`package.json\`, \`next.config.js\`, etc.). The environment handles these.

  5.  **Output Format:** You MUST return a single JSON object with one field: \`codeFiles\`.
      -   \`codeFiles\`: An array of objects. Each object must have a \`path\` (full path starting with \`/\`) and \`content\` (the complete file content as a string).

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
