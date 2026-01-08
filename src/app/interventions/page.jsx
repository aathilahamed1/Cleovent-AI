
'use client';

import DashboardLayout from '../dashboard/layout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import InterventionsPanel from '@/components/dashboard/interventions-panel';
import { useInterventions } from '@/hooks/use-interventions';

export default function InterventionsPage() {
  const { interventions, isLoading: isLoadingInterventions } = useInterventions();

  return (
    <DashboardLayout>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex h-svh flex-col">
            <DashboardHeader title="Interventions" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <InterventionsPanel
                interventions={interventions || []}
                isLoading={isLoadingInterventions}
              />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardLayout>
  );
}
