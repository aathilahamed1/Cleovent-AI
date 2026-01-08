
'use client';

import DashboardLayout from '../dashboard/layout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import AlertsPanel from '@/components/dashboard/alerts-panel';

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex h-svh flex-col">
            <DashboardHeader title="Predictive Alerts" />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              <AlertsPanel />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardLayout>
  );
}
