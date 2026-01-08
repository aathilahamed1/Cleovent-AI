'use server';

import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

type NewInterventionPayload = {
    systemId: string;
    type: string;
    zoneId: string;
    status: string;
    estimatedImpact: number;
    placement: { lat: number; lng: number };
    parameters?: {
      ratedAirflow?: number;
      removalEfficiency?: number;
      energyUse?: number;
    }
};

export async function addIntervention(payload: NewInterventionPayload) {
  try {
    const { firestore } = initializeFirebase();
    const interventionsCollection = collection(firestore, 'interventions');
    
    // We don't await this to avoid blocking, UI will update via snapshots
    addDocumentNonBlocking(interventionsCollection, payload);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding intervention:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
}
