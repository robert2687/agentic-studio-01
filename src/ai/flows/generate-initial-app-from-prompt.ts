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
  fileStructure: z.string().describe('The generated file structure as a JSON string.'),
  codeFiles: z.string().describe('The generated code files as a JSON string, where keys are file names and values are file contents.'),
});
export type GenerateInitialAppOutput = z.infer<typeof GenerateInitialAppOutputSchema>;

export async function generateInitialApp(input: GenerateInitialAppInput): Promise<GenerateInitialAppOutput> {
  return generateInitialAppFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialAppPrompt',
  input: {schema: GenerateInitialAppInputSchema},
  output: {schema: GenerateInitialAppOutputSchema},
  prompt: `You are an expert full-stack developer tasked with generating the initial file structure and code for a Next.js application based on a user's prompt.

  Instructions:
  1.  Based on the prompt, create a basic file structure including essential files and folders (e.g., src, components, pages, styles, public).
  2.  Generate code for the main components and pages, focusing on functionality and basic UI elements.
  3.  Return the file structure as a JSON string.
  4.  Return the code files as a JSON string, where keys are filenames and values are file contents.  Include file extensions.

  Example:
  {
    "fileStructure": '{\n      "name": "my-app",
      "type": "folder",
      "children": [{
        "name": "src",
        "type": "folder",
        "children": [{
          "name": "components",
          "type": "folder",
          "children": [{
            "name": "MyComponent.jsx",
            "type": "file"
          }]
        }, {
          "name": "pages",
          "type": "folder",
          "children": [{
            "name": "index.jsx",
            "type": "file"
          }]
        }]
      }, {
        "name": "package.json",
        "type": "file"
      }]
    }',
    "codeFiles": '{
      "src/components/MyComponent.jsx": "// MyComponent code",
      "src/pages/index.jsx": "// Index page code",
      "package.json": "{\n  \"name\": \"my-app\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"start\": \"next start\",\n    \"lint\": \"next lint\"\n  },\n  \"dependencies\": {\n    \"next\": \"^14.0.0\",\n    \"react\": \"^18\",\n    \"react-dom\": \"^18\"\n  },\n  \"devDependencies\": {\n    \"eslint\": \"^8\",\n    \"eslint-config-next\": \"14.0.0\"\n  }\n}"
    }'
  }

  Prompt: {{{prompt}}}
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

