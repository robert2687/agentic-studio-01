
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
    path: z.string().describe('The full path of the file, starting with a forward slash (e.g., /src/App.js). Use relative paths for imports (e.g. ./components/ui/button) instead of aliases like @/.'),
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
  prompt: `You are an expert full-stack developer acting as a "Full-Stack Application Generation Agent". Your mission is to generate the complete file structure and code for a new full-stack application based on a user's prompt. The application must be production-ready, scalable, and follow modern best practices.

  **Core Principles:**

  1.  **Analyze the User's Prompt:** Deconstruct the user's request to define the application's features, data models, and overall architecture.

  2.  **Tech Stack:**
      -   **Frontend:** Next.js (v14+) with TypeScript and Tailwind CSS.
      -   **Backend:** Node.js with Express and TypeScript.
      -   **UI Components:** Exclusively use ShadCN/UI components. Do NOT use raw HTML elements like \`<button>\` or \`<div>\` for layout when a component is more appropriate.
      -   **Styling:** Use Tailwind CSS utility classes.
      -   **Icons:** Use icons from the \`lucide-react\` library.
      -   **API:** The backend should expose a RESTful API that the frontend consumes.

  3.  **File Structure & Architecture (Monorepo-style):**
      -   Generate a complete and runnable application structure.
      -   **/client:** Contains the Next.js frontend.
          -   \`client/app/page.tsx\`: The main entry point for the application UI.
          -   \`client/app/layout.tsx\`: The root layout.
          -   \`client/components/\`: For custom React components.
          -   \`client/lib/\`: For utility functions.
          -   \`client/tailwind.config.js\`, \`client/postcss.config.js\`
          -   \`client/next.config.mjs\`
          -   \`client/tsconfig.json\`
          -   \`client/package.json\`: With all necessary dependencies for a Next.js app (\`next\`, \`react\`, \`react-dom\`, \`tailwindcss\`, \`shadcn/ui\`, \`lucide-react\`, etc.)
      -   **/server:** Contains the Node.js/Express backend.
          -   \`server/src/index.ts\`: The main entry point for the server.
          -   \`server/src/routes/\`: For API route definitions.
          -   \`server/tsconfig.json\`
          -   \`server/package.json\`: With all necessary dependencies (\`express\`, \`cors\`, \`typescript\`, \`ts-node\`, \`@types/express\`, etc.).
      -   **Root:**
          -   \`/package.json\`: A root \`package.json\` with scripts to install dependencies and run both the client and server concurrently (e.g., using \`concurrently\`).
          -   \`/.gitignore\`

  4.  **Code Quality & Best Practices:**
      -   Produce clean, modern, readable, and production-ready code.
      -   All components must be functional components using React Hooks.
      -   The backend should have basic error handling.
      -   Use TypeScript in both the frontend and backend.
      -   Ensure code is well-formatted.
      -   For any placeholder images, you MUST use \`https://picsum.photos/seed/<seedId>/<width>/<height>\` and include a relevant \`data-ai-hint\` attribute.

  5.  **Output Format:** You MUST return a single JSON object with one field: \`codeFiles\`.
      -   \`codeFiles\`: An array of objects. Each object must have a \`path\` (full path starting with a forward slash, e.g., \`/client/app/page.tsx\`) and \`content\` (the complete file content as a string).

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
