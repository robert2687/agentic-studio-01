// This file is used to generate unit tests for a given code file.

'use server';

/**
 * @fileOverview Generates unit tests for a given code file.
 *
 * - generateTestsForCode - A function that generates unit tests for a given code file.
 * - GenerateTestsForCodeInput - The input type for the generateTestsForCode function.
 * - GenerateTestsForCodeOutput - The return type for the generateTestsForCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestsForCodeInputSchema = z.object({
  code: z.string().describe('The code to generate unit tests for.'),
  filePath: z.string().describe('The path to the file containing the code.'),
});
export type GenerateTestsForCodeInput = z.infer<typeof GenerateTestsForCodeInputSchema>;

const GenerateTestsForCodeOutputSchema = z.object({
  tests: z.string().describe('The generated unit tests.'),
});
export type GenerateTestsForCodeOutput = z.infer<typeof GenerateTestsForCodeOutputSchema>;

export async function generateTestsForCode(input: GenerateTestsForCodeInput): Promise<GenerateTestsForCodeOutput> {
  return generateTestsForCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestsForCodePrompt',
  input: {schema: GenerateTestsForCodeInputSchema},
  output: {schema: GenerateTestsForCodeOutputSchema},
  prompt: `You are an expert software engineer specializing in generating unit tests.

  You will be given the code for a file, and your task is to generate unit tests for that code.
  The tests should be comprehensive and cover all important aspects of the code.
  Make sure to import the original code from the path: {{{filePath}}}.

  Here is the code:
  \`\`\`
  {{{code}}}
  \`\`\`

  Please generate the unit tests and ensure that they are in Typescript.
  The unit tests must be complete and ready to run without modification.
  `,
});

const generateTestsForCodeFlow = ai.defineFlow(
  {
    name: 'generateTestsForCodeFlow',
    inputSchema: GenerateTestsForCodeInputSchema,
    outputSchema: GenerateTestsForCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
