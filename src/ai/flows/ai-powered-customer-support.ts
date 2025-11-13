'use server';

/**
 * @fileOverview An AI-powered customer support chatbot.
 *
 * - customerSupportChatbot - A function that provides customer support by answering queries.
 * - CustomerSupportChatbotInput - The input type for the customerSupportChatbot function.
 * - CustomerSupportChatbotOutput - The return type for the customerSupportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSupportChatbotInputSchema = z.object({
  query: z.string().describe('The customer query.'),
});
export type CustomerSupportChatbotInput = z.infer<typeof CustomerSupportChatbotInputSchema>;

const CustomerSupportChatbotOutputSchema = z.object({
  response: z.string().describe('The response to the customer query.'),
});
export type CustomerSupportChatbotOutput = z.infer<typeof CustomerSupportChatbotOutputSchema>;

export async function customerSupportChatbot(input: CustomerSupportChatbotInput): Promise<CustomerSupportChatbotOutput> {
  return customerSupportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `You are a customer support chatbot for an e-commerce platform called CommerceWave.

  Your primary goal is to answer user queries and provide helpful assistance to resolve their issues quickly.
  If the query is too complex or requires specialized human support, indicate that you will redirect the customer to a human support agent.

  User Query: {{{query}}}`,
});

const customerSupportChatbotFlow = ai.defineFlow(
  {
    name: 'customerSupportChatbotFlow',
    inputSchema: CustomerSupportChatbotInputSchema,
    outputSchema: CustomerSupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
