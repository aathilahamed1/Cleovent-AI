import { config } from 'dotenv';
config();

import '@/ai/flows/generate-descriptive-alert-messages.ts';
import '@/ai/flows/suggest-optimal-interventions.ts';
import '@/ai/flows/get-location-data.ts';
