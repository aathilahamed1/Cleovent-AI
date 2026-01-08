
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  ClipboardList,
  Cog,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { useAuth, useUser } from '@/firebase';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 shrink-0 text-primary" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <h2 className="font-headline text-lg font-semibold tracking-tight">
                CleoVent
              </h2>
              <p className="text-[10px] text-muted-foreground">by Cstark</p>
            </div>
            <p className="text-xs text-muted-foreground">Digital CO₂ Twin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/zones'}>
              <Link href="/zones">
                <MapPin />
                Zones
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/interventions'}>
              <Link href="/interventions">
                <Cog />
                Interventions
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/scenarios'}>
              <Link href="/scenarios">
                <ClipboardList />
                Scenarios
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/alerts'}>
              <Link href="/alerts">
                <AlertTriangle />
                Alerts
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/recommendations'}>
              <Link href="/recommendations">
                <Lightbulb />
                Recommendations
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         <div className="flex items-center justify-between gap-3 rounded-md bg-card p-2">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage
                    src={user?.photoURL ?? "https://picsum.photos/seed/avatar/100/100"}
                    alt={user?.displayName ?? "User"}
                    data-ai-hint="person face"
                    />
                    <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.displayName ?? 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-8 w-8">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
