'use client';
import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Intervention } from '@/lib/types';
import { interventions as mockInterventions } from '@/lib/data';

export function useInterventions() {
  const firestore = useFirestore();

  const interventionsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'interventions')) : null),
    [firestore]
  );

  const { data: firestoreInterventions, isLoading, error } = useCollection<Intervention>(interventionsQuery);

  const interventions = useMemo(() => {
    if (isLoading) return [];
    if (!firestoreInterventions || firestoreInterventions.length === 0) {
      return mockInterventions;
    }
    return firestoreInterventions;
  }, [firestoreInterventions, isLoading]);

  return { interventions, isLoading, error };
}
