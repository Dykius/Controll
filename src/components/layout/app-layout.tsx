"use client";

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { AppHeader } from '@/components/layout/app-header';
import React from 'react';
import { GaugeCircle } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  // If it's an auth page, don't render the main app layout
  if (isAuthPage) {
    return <>{children}</>;
  }
  
  // Render the main app layout for all other pages
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <GaugeCircle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Control+</span>
            </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarInset>
      <SidebarRail />
    </SidebarProvider>
  );
}
