
'use client';

import DashboardLayout from '../dashboard/layout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import ZonesPanel from '@/components/dashboard/zones-panel';
import { useZones } from '@/hooks/use-zones';

export default function ZonesPage() {
  const { zones, isLoading: isLoadingZones } = useZones();

  return (
    <DashboardLayout>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex h-svh flex-col">
            <DashboardHeader title="Zones" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <ZonesPanel zones={zones || []} isLoading={isLoadingZones} />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardLayout>
  );
}
