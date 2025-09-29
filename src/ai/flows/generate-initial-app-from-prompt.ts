
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
    path: z.string().describe('The full path of the file, starting with a forward slash (e.g., /src/App.jsx).'),
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
  prompt: `You are an expert full-stack developer tasked with generating the initial files for a simple React application based on a user's prompt. The output must be compatible with Sandpack's "react" template.

  Instructions:
  1.  Analyze the user's prompt to determine the application's requirements.
  2.  You MUST generate the following files:
      - \`/package.json\`
      - \`/src/App.js\` or \`/src/App.jsx\`
      - \`/src/index.js\`
      - \`/src/styles.css\`
  3.  **CRITICAL**: The \`package.json\` file MUST only include \`react\` and \`react-dom\` as dependencies. Do NOT include \`react-scripts\`.
      The 'main' entry point must be '/src/index.js'.
      Example package.json:
      \`\`\`json
      {
        "name": "react-app",
        "dependencies": {
          "react": "18.2.0",
          "react-dom": "18.2.0"
        },
        "main": "/src/index.js"
      }
      \`\`\`
  4.  The \`src/index.js\` file must be the entry point and render the \`App\` component into the DOM.
  5.  Generate simple, functional code for each file that directly relates to the user's prompt.
  6.  **DO NOT** use any third-party libraries other than \`react\` and \`react-dom\`. The Sandpack environment does not support installing other packages. All code must be self-contained.
  7.  **VERY IMPORTANT**: You will return a single JSON object containing one field: \`codeFiles\`.
      - \`codeFiles\`: An array of objects. Each object must have a \`path\` and a \`content\` property.

  User Prompt: {{{prompt}}}
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
