// src/ai/flows/suggest-activities.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest upcoming small group activities based on historical data and current trends.
 *
 * - suggestActivities - A function that triggers the activity suggestion flow.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActivitiesInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical data of past small group activities, including attendance, feedback, and resources used.'
    ),
  currentTrends: z
    .string()
    .describe(
      'Information about current trends in youth activities, popular topics, and successful events in other groups.'
    ),
  groupPreferences: z
    .string()
    .optional()
    .describe(
      'Optional information on specific small group preferences or constraints, such as age range, interests, or location.'
    ),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestActivitiesOutputSchema = z.object({
  suggestedActivities: z
    .array(z.string())
    .describe('A list of suggested upcoming small group activities.'),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the suggestions, explaining how historical data, current trends, and group preferences were considered.'
    ),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return suggestActivitiesFlow(input);
}

const suggestActivitiesPrompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are an AI assistant designed to suggest engaging small group activities for youth organizations.

  Based on the provided historical data, current trends, and group preferences, suggest a list of upcoming activities that would be relevant and appealing to the members.

  Historical Data: {{{historicalData}}}
  Current Trends: {{{currentTrends}}}
  Group Preferences (Optional): {{{groupPreferences}}}

  Consider factors like age range, interests, available resources, and potential impact on member engagement.
  Explain your reasoning behind each suggestion.
  Format your response as a JSON object with "suggestedActivities" (an array of activity names) and "reasoning" (a string explaining the suggestions).`,
});

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async input => {
    const {output} = await suggestActivitiesPrompt(input);
    return output!;
  }
);
