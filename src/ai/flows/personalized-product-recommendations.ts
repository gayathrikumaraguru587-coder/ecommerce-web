'use server';

/**
 * @fileOverview Personalized product recommendations flow.
 *
 * This flow takes a user's browsing history and past purchases
 * and suggests relevant products using collaborative filtering.
 *
 * @param {PersonalizedProductRecommendationsInput} input - The input to the flow.
 * @returns {Promise<PersonalizedProductRecommendationsOutput>} - The personalized product recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  browsingHistory: z
    .array(z.string())
    .describe('The product IDs the user has recently viewed.'),
  pastPurchases: z
    .array(z.string())
    .describe('The product IDs the user has previously purchased.'),
});

export type PersonalizedProductRecommendationsInput = z.infer<
  typeof PersonalizedProductRecommendationsInputSchema
>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('A list of product IDs recommended for the user.'),
});

export type PersonalizedProductRecommendationsOutput = z.infer<
  typeof PersonalizedProductRecommendationsOutputSchema
>;

export async function getPersonalizedProductRecommendations(
  input: PersonalizedProductRecommendationsInput
): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const personalizedProductRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {
    schema: PersonalizedProductRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedProductRecommendationsOutputSchema,
  },
  prompt: `You are an e-commerce recommendation engine. Given a user's browsing history and past purchases, suggest products they might be interested in.

  User ID: {{{userId}}}
  Browsing History: {{#if browsingHistory}}{{#each browsingHistory}}- {{{this}}}{{/each}}{{else}}No browsing history{{/if}}
  Past Purchases: {{#if pastPurchases}}{{#each pastPurchases}}- {{{this}}}{{/each}}{{else}}No past purchases{{/if}}

  Based on this information, recommend a list of products:
  `, // Ensure the prompt is well-formatted for the Handlebars templating.
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedProductRecommendationsPrompt(input);
    return output!;
  }
);
