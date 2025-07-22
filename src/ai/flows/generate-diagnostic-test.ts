'use server';

/**
 * @fileOverview A diagnostic test generation AI agent.
 *
 * - generateDiagnosticTest - A function that handles the generation of a diagnostic test.
 * - GenerateDiagnosticTestInput - The input type for the generateDiagnosticTest function.
 * - GenerateDiagnosticTestOutput - The return type for the generateDiagnosticTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagnosticTestInputSchema = z.object({
  pdfContent: z
    .string()
    .describe('The extracted text content from the topic PDF.'),
  language: z.enum(['Bangla', 'English']).describe('The language of the student.'),
});
export type GenerateDiagnosticTestInput = z.infer<
  typeof GenerateDiagnosticTestInputSchema
>;

const GenerateDiagnosticTestOutputSchema = z.object({
  questions: z
    .array(z.string())
    .describe('The generated diagnostic test questions.'),
});
export type GenerateDiagnosticTestOutput = z.infer<
  typeof GenerateDiagnosticTestOutputSchema
>;

export async function generateDiagnosticTest(
  input: GenerateDiagnosticTestInput
): Promise<GenerateDiagnosticTestOutput> {
  return generateDiagnosticTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiagnosticTestPrompt',
  input: {schema: GenerateDiagnosticTestInputSchema},
  output: {schema: GenerateDiagnosticTestOutputSchema},
  prompt: `You are an expert in generating diagnostic tests for students.

  You will receive the content of a PDF document for a specific topic, and your goal is to generate a set of diagnostic questions based on that content.
  The student will use these questions to assess their understanding of the topic and identify any weak areas.

  Please generate a variety of question types, including multiple-choice, short answer, and true/false questions.

  Consider the student's language which is {{{language}}}.

  PDF Content: {{{pdfContent}}}

  Output the questions in JSON format using the schema definition. Each question should be clear, concise, and directly related to the PDF content.
  Make sure to output valid JSON.
  `,
});

const generateDiagnosticTestFlow = ai.defineFlow(
  {
    name: 'generateDiagnosticTestFlow',
    inputSchema: GenerateDiagnosticTestInputSchema,
    outputSchema: GenerateDiagnosticTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
