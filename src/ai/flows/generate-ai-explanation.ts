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
  mode: z.enum(['teacher', 'fun', 'simple']).describe('The teaching mode for the explanation.')
});
export type GenerateAiExplanationInput = z.infer<typeof GenerateAiExplanationInputSchema>;

const GenerateAiExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation of the topic.'),
});
export type GenerateAiExplanationOutput = z.infer<typeof GenerateAiExplanationOutputSchema>;

export async function generateAiExplanation(input: GenerateAiExplanationInput): Promise<GenerateAiExplanationOutput> {
  return generateAiExplanationFlow(input);
}

const teacherPrompt = `You are an expert teacher explaining academic topics to students in a friendly, conversational, and human-like manner. Your explanation should be detailed and structured.`;
const funPrompt = `You are a fun and engaging tutor who uses creative examples, analogies, and humor to explain topics. Make learning exciting!`;
const simplePrompt = `You are a helpful assistant who can explain complex topics in the simplest way possible. Use very easy language and break everything down into small, digestible pieces.`;


const prompt = ai.definePrompt({
  name: 'generateAiExplanationPrompt',
  input: {schema: GenerateAiExplanationInputSchema},
  output: {schema: GenerateAiExplanationOutputSchema},
  prompt: `
  {{#if (eq mode "teacher")}}
    ${teacherPrompt}
  {{else if (eq mode "fun")}}
    ${funPrompt}
  {{else if (eq mode "simple")}}
    ${simplePrompt}
  {{/if}}

  Based on the topic content below, generate a detailed explanation in {{{language}}}.

  Your explanation should include:
  1.  **Topic Definition:** A clear and easy-to-understand definition of the main topic.
  2.  **Laws Breakdown:** If there are any laws or principles, break them down step-by-step. Explain the concepts behind them. Use examples.
  3.  **Sample Question Patterns:** Provide a few sample questions (and their patterns/types) that are commonly asked from this topic in exams.

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
