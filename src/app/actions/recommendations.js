'use server';

import { suggestOptimalInterventions } from '@/ai/flows/suggest-optimal-interventions';
import { zones, interventions } from '@/lib/data';

export async function getRecommendations(optimizationGoals) {
  try {
    // In a real app, this data would be dynamically generated or fetched.
    // For this demo, we'll use mock data.
    const mockUrbanLayout = JSON.stringify({
      type: 'FeatureCollection',
      features: zones.map((z, i) => ({
        type: 'Feature',
        properties: { name: z.name, type: z.type },
        geometry: {
          type: 'Point',
          coordinates: [ -73.99 + i * 0.02, 40.73 - i * 0.01 ],
        },
      })),
    });

    const mockEmissionsData = JSON.stringify(
      zones.map(z => ({
        zoneId: z.id,
        emissions: z.baseEmissions.industry + z.baseEmissions.power + z.baseEmissions.transport,
      }))
    );

    const input = {
      urbanLayout: mockUrbanLayout,
      emissionsData: mockEmissionsData,
      interventionTypes: [
        'Amine Scrubber',
        'Vertical Garden',
        'Roadside DAC',
      ],
      optimizationGoals,
    };

    const recommendations = await suggestOptimalInterventions(input);
    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
}
