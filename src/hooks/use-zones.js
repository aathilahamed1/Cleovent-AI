'use client';
import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Zone } from '@/lib/types';
import { zones as mockZones } from '@/lib/data';

export function useZones() {
  const firestore = useFirestore();

  const zonesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'zones')) : null),
    [firestore]
  );
  
  const { data: firestoreZones, isLoading, error } = useCollection<Zone>(zonesQuery);

  const zones = useMemo(() => {
    if (isLoading) return [];
    if (!firestoreZones || firestoreZones.length === 0) {
      return mockZones;
    }
    return firestoreZones;
  }, [firestoreZones, isLoading]);

  return { zones, isLoading, error };
}
