"use client";

import { usePathname } from 'next/navigation';
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
          <div className="flex items-center gap-2">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M14.6869 11.2334L18.4239 16.8964L20.8913 24.5L25.922 17.5186L28.9038 12.8711L25.101 6.83984L14.6869 11.2334Z"
                fill="currentColor"
              />
              <path
                d="M31.2588 4.97852C32.1963 5.86816 32.5579 7.04004 32.5579 8.49414C32.5579 10.1543 31.9449 11.5811 30.7188 12.7744L28.9041 12.8701L25.1014 6.83887L31.2588 4.97852Z"
                fill="currentColor"
                className="text-indigo-400"
              />
            </svg>
            <span className="text-xl font-bold">Control+</span>
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
