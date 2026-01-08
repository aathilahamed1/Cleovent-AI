'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal carbon capture interventions.
 *
 * The flow takes in urban layout and emissions data, and outputs suggested intervention locations and types.
 * - suggestOptimalInterventions - The main function to trigger the flow.
 * - SuggestOptimalInterventionsInput - The input type for the function.
 * - SuggestOptimalInterventionsOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalInterventionsInputSchema = z.object({
  urbanLayout: z.string().describe('GeoJSON data representing the urban layout, including building footprints, roads, and green spaces.'),
  emissionsData: z.string().describe('JSON data containing CO2 emissions data for different zones in the city.'),
  interventionTypes: z.array(z.string()).describe('List of available intervention types (e.g., Amine Scrubber, Vertical Garden).'),
  optimizationGoals: z.array(z.string()).describe('A list of goals to consider when providing recommendations, e.g. cost, carbon capture, available space.'),
});
export type SuggestOptimalInterventionsInput = z.infer<typeof SuggestOptimalInterventionsInputSchema>;

const SuggestOptimalInterventionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    zoneId: z.string().describe('The ID of the zone where the intervention is suggested.'),
    location: z.object({
      latitude: z.number().describe('Latitude of the suggested location.'),
      longitude: z.number().describe('Longitude of the suggested location.'),
    }).describe('Suggested location for the intervention.'),
    interventionType: z.string().describe('The type of intervention suggested (e.g., Amine Scrubber).'),
    expectedImpact: z.object({
      tco2CapturedPerDay: z.number().describe('Estimated tons of CO2 captured per day.'),
      costPerTonCO2: z.number().describe('Estimated cost per ton of CO2 captured.'),
      energyConsumptionPerDay: z.number().describe('Estimated energy consumption per day.'),
    }).describe('Estimated impact of the intervention.'),
    reasoning: z.string().describe('Explanation of why this intervention is recommended for this location.'),
  })).describe('A list of suggested intervention locations and types.'),
});
export type SuggestOptimalInterventionsOutput = z.infer<typeof SuggestOptimalInterventionsOutputSchema>;

export async function suggestOptimalInterventions(input: SuggestOptimalInterventionsInput): Promise<SuggestOptimalInterventionsOutput> {
  return suggestOptimalInterventionsFlow(input);
}

const suggestOptimalInterventionsPrompt = ai.definePrompt({
  name: 'suggestOptimalInterventionsPrompt',
  input: {schema: SuggestOptimalInterventionsInputSchema},
  output: {schema: SuggestOptimalInterventionsOutputSchema},
  prompt: `You are an expert urban planner specializing in carbon capture interventions.

  Given the following information about the urban layout, emissions data, available intervention types, and optimization goals, suggest optimal locations and types of carbon capture interventions.

  Urban Layout (GeoJSON):
  {{urbanLayout}}

  Emissions Data (JSON):
  {{emissionsData}}

  Available Intervention Types:
  {{#each interventionTypes}}- {{this}}\n{{/each}}

  Optimization Goals:
  {{#each optimizationGoals}}- {{this}}\n{{/each}}

  Provide a list of suggestions, including the zone ID, location (latitude and longitude), intervention type, expected impact (tons of CO2 captured per day and cost per ton of CO2), and a brief explanation of why this intervention is recommended for this location.

  Format your response as a JSON object matching the SuggestOptimalInterventionsOutputSchema. Follow schema descriptions when generating values.
  `,
});

const suggestOptimalInterventionsFlow = ai.defineFlow(
  {
    name: 'suggestOptimalInterventionsFlow',
    inputSchema: SuggestOptimalInterventionsInputSchema,
    outputSchema: SuggestOptimalInterventionsOutputSchema,
  },
  async input => {
    const {output} = await suggestOptimalInterventionsPrompt(input);
    return output!;
  }
);
