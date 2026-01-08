'use server';

import { initializeFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

type NewZonePayload = {
  name: string;
  type: string;
  baseEmissions: number;
  placement: { lat: number; lng: number };
};

export async function addZone(payload: NewZonePayload) {
  try {
    const { firestore } = initializeFirebase();
    const zonesCollection = collection(firestore, 'zones');
    
    // We don't await this to avoid blocking, UI will update via snapshots
    addDocumentNonBlocking(zonesCollection, payload);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error adding zone:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
}
