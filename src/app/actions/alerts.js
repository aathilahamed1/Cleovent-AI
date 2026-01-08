'use server';

import { generateDescriptiveAlertMessage } from '@/ai/flows/generate-descriptive-alert-messages';
import { zones } from '@/lib/data';

// This function now returns a Promise with a more predictable structure.
// The randomness is still here, but it's called from a client-side effect.
export async function generateAlert() {
  try {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const baseline = zones.find(z => z.id === randomZone.id)?.baseEmissions ?? 500;
    
    const isSpike = Math.random() > 0.3;
    const changeFactor = isSpike ? (1 + Math.random() * 0.5) : (1 - Math.random() * 0.3);
    const predictedValue = Math.round(baseline * changeFactor);

    const input = {
      zoneName: randomZone.name,
      predictedValue: predictedValue,
      baselineValue: baseline,
      cause: isSpike ? 'unusually high industrial activity' : 'decreased traffic flow',
      actionRecommended: isSpike ? 'Activate standby capture units' : 'No action needed',
    };

    const { alertMessage } = await generateDescriptiveAlertMessage(input);

    const newAlert: Alert = {
      id: `alert_${Date.now()}`,
      zoneId: randomZone.id,
      zoneName: randomZone.name,
      level: isSpike ? 'Warning' : 'Info',
      message: alertMessage,
      timestamp: new Date().toISOString(),
      status: 'Active',
      predictedValue: predictedValue,
      baselineValue: baseline,
      actionRecommended: input.actionRecommended,
    };

    return newAlert;
  } catch (error) {
    console.error('Error generating alert:', error);
    return null;
  }
}
