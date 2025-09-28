
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

const FileNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  name: z.string(),
  type: z.enum(['folder', 'file']),
  path: z.string(),
  children: z.optional(z.array(FileNodeSchema)),
}));


const GenerateInitialAppOutputSchema = z.object({
  fileStructure: FileNodeSchema.describe('The generated file structure as a JSON object. Each file should have a `path` property.'),
  codeFiles: z.array(z.object({
    path: z.string().describe('The full path of the file.'),
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
  prompt: `You are an expert full-stack developer tasked with generating the initial file structure and code for a simple React application based on a user's prompt. The output should be compatible with Sandpack (a browser-based bundler).

  Instructions:
  1.  Analyze the user's prompt to determine the application's requirements.
  2.  Create a file structure for a simple React app that fulfills the prompt. It must include \`package.json\`, a root file like \`src/App.jsx\`, and an entry point like \`src/index.js\`.
  3.  **CRITICAL**: The \`package.json\` file MUST include \`react\`, \`react-dom\`, and \`react-scripts\` as dependencies. This is required for the application to run. Use recent but stable versions.
  4.  Generate the code for each file. The code should be simple, functional, and directly related to the user's prompt.
  5.  **VERY IMPORTANT**: You will return a single JSON object containing two fields: \`fileStructure\` and \`codeFiles\`.
      - \`fileStructure\`: A JSON object representing the file tree.
      - \`codeFiles\`: An array of objects. Each object must have a \`path\` and a \`content\` property.

  Example \`fileStructure\` JSON object:
  {
    "name": "my-app",
    "type": "folder",
    "path": "/",
    "children": [
      {
        "name": "src",
        "type": "folder",
        "path": "/src",
        "children": [
          { "name": "App.jsx", "type": "file", "path": "/src/App.jsx" },
          { "name": "index.js", "type": "file", "path": "/src/index.js" },
          { "name": "styles.css", "type": "file", "path": "/src/styles.css" }
        ]
      },
      { "name": "package.json", "type": "file", "path": "/package.json" }
    ]
  }

  Example \`codeFiles\` array:
  [
    {
      "path": "/package.json",
      "content": "{\\n  \\"name\\": \\"react-app\\",\\n  \\"dependencies\\": {\\n    \\"react\\": \\"18.2.0\\",\\n    \\"react-dom\\": \\"18.2.0\\",\\n    \\"react-scripts\\": \\"5.0.1\\"\\n  }\\n}"
    },
    {
      "path": "/src/App.jsx",
      "content": "import React from 'react';\\nimport './styles.css';\\n\\nexport default function App() {\\n  return <h1>Hello from my App!</h1>;\\n}"
    },
    {
      "path": "/src/index.js",
      "content": "import React from 'react';\\nimport { createRoot } from 'react-dom/client';\\nimport App from './App';\\n\\nconst root = createRoot(document.getElementById('root'));\\nroot.render(<App />);"
    },
    {
      "path": "/src/styles.css",
      "content": "body { font-family: sans-serif; }"
    }
  ]

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
