
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import dynamic from 'next/dynamic';
import KpiSidebar from '@/components/dashboard/kpi-sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useZones } from '@/hooks/use-zones';
import { useInterventions } from '@/hooks/use-interventions';


const MapView = dynamic(() => import('@/components/dashboard/map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[calc(100vh-120px)] w-full" />,
});

export default function DashboardPage() {
  const { zones, isLoading: isLoadingZones } = useZones();
  const { interventions, isLoading: isLoadingInterventions } = useInterventions();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex h-svh flex-col">
          <DashboardHeader title="Dashboard"/>
          <main className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                { (isLoadingZones || isLoadingInterventions) ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <MapView interventions={interventions || []} zones={zones || []} />
                )}
            </div>
            <KpiSidebar />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
