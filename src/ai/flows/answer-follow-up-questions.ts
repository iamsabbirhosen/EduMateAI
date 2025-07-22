'use server';

/**
 * @fileOverview A chat-based follow-up question answering AI agent.
 *
 * - answerFollowUpQuestions - A function that handles answering follow-up questions about a topic.
 * - AnswerFollowUpQuestionsInput - The input type for the answerFollowUpQuestions function.
 * - AnswerFollowUpQuestionsOutput - The return type for the answerFollowUpQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFollowUpQuestionsInputSchema = z.object({
  pdfContent: z.string().describe('The content of the PDF for the topic.'),
  question: z.string().describe('The follow-up question from the student.'),
  language: z.enum(['Bangla', 'English']).describe('The language to respond in.'),
});
export type AnswerFollowUpQuestionsInput = z.infer<typeof AnswerFollowUpQuestionsInputSchema>;

const AnswerFollowUpQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the follow-up question.'),
});
export type AnswerFollowUpQuestionsOutput = z.infer<typeof AnswerFollowUpQuestionsOutputSchema>;

export async function answerFollowUpQuestions(input: AnswerFollowUpQuestionsInput): Promise<AnswerFollowUpQuestionsOutput> {
  return answerFollowUpQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFollowUpQuestionsPrompt',
  input: {schema: AnswerFollowUpQuestionsInputSchema},
  output: {schema: AnswerFollowUpQuestionsOutputSchema},
  prompt: `You are a helpful AI chatbot assisting students with their studies. You will be provided with the content of a PDF document and a follow-up question from the student. Your task is to answer the question based on the provided content.

PDF Content:
{{{pdfContent}}}

Question:
{{{question}}}

Answer in {{language}}.
`,
});

const answerFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'answerFollowUpQuestionsFlow',
    inputSchema: AnswerFollowUpQuestionsInputSchema,
    outputSchema: AnswerFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
