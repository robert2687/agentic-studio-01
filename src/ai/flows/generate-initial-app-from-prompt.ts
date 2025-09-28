
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
  fileStructure: z.string().describe('The generated file structure as a JSON string. Each file should have a `path` property.'),
  codeFiles: z.string().describe('The generated code files as a JSON string, where keys are file paths and values are file contents.'),
});
export type GenerateInitialAppOutput = z.infer<typeof GenerateInitialAppOutputSchema>;

export async function generateInitialApp(input: GenerateInitialAppInput): Promise<GenerateInitialAppOutput> {
  return generateInitialAppFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialAppPrompt',
  input: {schema: GenerateInitialAppInputSchema},
  output: {schema: GenerateInitialAppOutputSchema},
  prompt: `You are an expert full-stack developer tasked with generating the initial file structure and code for a simple React application based on a user's prompt. The output should be compatible with Sandpack (a browser-based bundler).

  Instructions:
  1.  Create a file structure for a simple React app. It should include at a minimum \`package.json\`, a root file like \`src/App.jsx\`, and \`src/index.js\`.
  2.  The \`package.json\` must include \`react\`, \`react-dom\`, and \`react-scripts\` as dependencies.
  3.  Generate the code for each file. The code should be simple, functional, and directly related to the user's prompt.
  4.  Return the file structure as a JSON string. The structure should be a tree of objects, where each object has a 'name', 'type' ('file' or 'folder'), and optionally 'children'.
  5.  Return the code files as a JSON string, where keys are full file paths (e.g., "src/App.jsx") and values are the file contents.

  Example File Structure JSON:
  '{
    "name": "my-app",
    "type": "folder",
    "children": [
      {
        "name": "src",
        "type": "folder",
        "children": [
          { "name": "App.jsx", "type": "file" },
          { "name": "index.js", "type": "file" },
          { "name": "styles.css", "type": "file" }
        ]
      },
      { "name": "package.json", "type": "file" }
    ]
  }'

  Example Code Files JSON:
  '{
    "package.json": "{\\"name\\": \\"react-app\\", \\"dependencies\\": {\\"react\\": \\"18.0.0\\", \\"react-dom\\": \\"18.0.0\\", \\"react-scripts\\": \\"5.0.0\\"}}",
    "src/App.jsx": "import React from \\'react\\';\\\\nimport \\'./styles.css\\';\\\\n\\\\nexport default function App() {\\\\n  return <h1>Hello World</h1>;\\\\n}",
    "src/index.js": "import React from \\'react\\';\\\\nimport { createRoot } from \\'react-dom/client\\';\\\\nimport App from \\'./App\\';\\\\n\\\\nconst root = createRoot(document.getElementById(\\'root\\'));\\\\nroot.render(<App />);",
    "src/styles.css": "body { font-family: sans-serif; }"
  }'

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

    