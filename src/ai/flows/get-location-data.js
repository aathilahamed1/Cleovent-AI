'use server';
/**
 * @fileOverview A flow that returns real-world air quality data from the WAQI API.
 *
 * - getLocationData - A function that returns environmental data.
 * - GetLocationDataInput - The input type for the getLocationData function.
 * - GetLocationDataOutput - The return type for the getLocationData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import fetch from 'node-fetch';

const GetLocationDataInputSchema = z.object({
  lat: z.number().describe('Latitude of the location.'),
  lng: z.number().describe('Longitude of the location.'),
});
export type GetLocationDataInput = z.infer<typeof GetLocationDataInputSchema>;

const GetLocationDataOutputSchema = z.object({
  co2: z.number().describe('CO2 level in parts per million (ppm). May be unavailable (0).'),
  aqi: z.number().describe('Air Quality Index (AQI).'),
  aqiDescription: z
    .string()
    .describe(
      'A brief, one-sentence qualitative description of the air quality (e.g., Good, Moderate, Unhealthy).'
    ),
});
export type GetLocationDataOutput = z.infer<typeof GetLocationDataOutputSchema>;

// This function is not a flow itself, but is called by the flow.
async function fetchWaqiData(lat: number, lng: number): Promise<any> {
  const token = process.env.WAQI_API_TOKEN;
  if (!token) {
    console.error("WAQI_API_TOKEN is not set in environment variables.");
    throw new Error("API token for WAQI is missing.");
  }
  const url = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${token}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WAQI API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from WAQI:", error);
    throw error;
  }
}

function getAqiDescription(aqi: number): string {
    if (aqi <= 50) return "Air quality is Good.";
    if (aqi <= 100) return "Air quality is Moderate.";
    if (aqi <= 150) return "Air quality is Unhealthy for Sensitive Groups.";
    if (aqi <= 200) return "Air quality is Unhealthy.";
    if (aqi <= 300) return "Air quality is Very Unhealthy.";
    return "Air quality is Hazardous.";
}

export const getLocationData = ai.defineFlow(
  {
    name: 'getLocationData',
    inputSchema: GetLocationDataInputSchema,
    outputSchema: GetLocationDataOutputSchema,
  },
  async ({ lat, lng }) => {
    const waqiResponse = await fetchWaqiData(lat, lng);

    if (waqiResponse.status !== 'ok') {
      throw new Error(`WAQI API returned an error: ${waqiResponse.data}`);
    }

    const aqi = waqiResponse.data.aqi || 0;
    // WAQI API provides 'co' not 'co2' directly in many cases. We will use it as a stand-in.
    const co2 = waqiResponse.data.iaqi.co?.v || 0; 

    return {
      aqi: aqi,
      co2: co2,
      aqiDescription: getAqiDescription(aqi),
    };
  }
);
