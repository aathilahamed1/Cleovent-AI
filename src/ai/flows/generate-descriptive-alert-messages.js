// src/ai/flows/generate-descriptive-alert-messages.ts
'use server';

/**
 * @fileOverview Generates descriptive alert messages for predicted CO2 spikes, explaining the cause, severity, and recommended action.
 *
 * - generateDescriptiveAlertMessage - A function that generates descriptive alert messages for predicted CO2 spikes.
 * - GenerateDescriptiveAlertMessageInput - The input type for the generateDescriptiveAlertMessage function.
 * - GenerateDescriptiveAlertMessageOutput - The return type for the generateDescriptiveAlertMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDescriptiveAlertMessageInputSchema = z.object({
  zoneName: z.string().describe('The name of the zone where the CO2 spike is predicted.'),
  predictedValue: z.number().describe('The predicted CO2 value (in ppm).'),
  baselineValue: z.number().describe('The baseline CO2 value (in ppm).'),
  cause: z.string().describe('The predicted cause of the CO2 spike (e.g., increased traffic, industrial activity).'),
  actionRecommended: z.string().describe('The recommended action to mitigate the CO2 spike (e.g., activate capture units).'),
});
export type GenerateDescriptiveAlertMessageInput = z.infer<typeof GenerateDescriptiveAlertMessageInputSchema>;

const GenerateDescriptiveAlertMessageOutputSchema = z.object({
  alertMessage: z.string().describe('A descriptive alert message explaining the predicted CO2 spike, its cause, severity, and recommended action.'),
});
export type GenerateDescriptiveAlertMessageOutput = z.infer<typeof GenerateDescriptiveAlertMessageOutputSchema>;

export async function generateDescriptiveAlertMessage(input: GenerateDescriptiveAlertMessageInput): Promise<GenerateDescriptiveAlertMessageOutput> {
  return generateDescriptiveAlertMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDescriptiveAlertMessagePrompt',
  input: {schema: GenerateDescriptiveAlertMessageInputSchema},
  output: {schema: GenerateDescriptiveAlertMessageOutputSchema},
  prompt: `You are an AI assistant that generates descriptive alert messages for city officials regarding predicted CO2 spikes in urban zones.

  Given the following information, generate a concise and informative alert message that explains the predicted cause, severity, and recommended action.

  Zone Name: {{{zoneName}}}
  Predicted CO2 Value: {{{predictedValue}}} ppm
  Baseline CO2 Value: {{{baselineValue}}} ppm
  Cause: {{{cause}}}
  Recommended Action: {{{actionRecommended}}}

  Alert Message: `,
});

const generateDescriptiveAlertMessageFlow = ai.defineFlow(
  {
    name: 'generateDescriptiveAlertMessageFlow',
    inputSchema: GenerateDescriptiveAlertMessageInputSchema,
    outputSchema: GenerateDescriptiveAlertMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
