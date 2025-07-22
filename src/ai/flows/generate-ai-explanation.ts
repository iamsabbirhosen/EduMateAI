'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-based explanations of topic content extracted from a PDF.
 *
 * - generateAiExplanation - A function that generates AI explanation for a given topic.
 * - GenerateAiExplanationInput - The input type for the generateAiExplanation function.
 * - GenerateAiExplanationOutput - The return type for the generateAiExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiExplanationInputSchema = z.object({
  topicContent: z
    .string()
    .describe('The content of the topic extracted from the PDF.'),
  language: z.enum(['Bangla', 'English']).describe('The language of the explanation.'),
});
export type GenerateAiExplanationInput = z.infer<typeof GenerateAiExplanationInputSchema>;

const GenerateAiExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation of the topic.'),
});
export type GenerateAiExplanationOutput = z.infer<typeof GenerateAiExplanationOutputSchema>;

export async function generateAiExplanation(input: GenerateAiExplanationInput): Promise<GenerateAiExplanationOutput> {
  return generateAiExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiExplanationPrompt',
  input: {schema: GenerateAiExplanationInputSchema},
  output: {schema: GenerateAiExplanationOutputSchema},
  prompt: `You are an expert teacher explaining academic topics to students.

  Based on the topic content below, generate a clear and concise explanation in {{{language}}}.

  Topic Content:
  {{topicContent}}`,
});

const generateAiExplanationFlow = ai.defineFlow(
  {
    name: 'generateAiExplanationFlow',
    inputSchema: GenerateAiExplanationInputSchema,
    outputSchema: GenerateAiExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
