import { config } from 'dotenv';
config();

import '@/ai/flows/generate-diagnostic-test.ts';
import '@/ai/flows/answer-follow-up-questions.ts';
import '@/ai/flows/generate-ai-explanation.ts';