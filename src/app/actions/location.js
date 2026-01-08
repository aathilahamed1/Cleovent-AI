'use server';

import { getLocationData } from '@/ai/flows/get-location-data';

export async function getSimulatedLocationData(lat: number, lng: number) {
  try {
    const data = await getLocationData({ lat, lng });
    return data;
  } catch (error) {
    console.error('Error getting location data:', error);
    return null;
  }
}
