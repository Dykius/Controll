"use client";

import { usePathname, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [session, setSession] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const sessionData = localStorage.getItem('session');
      if (sessionData) {
        setSession(sessionData);
      } else {
        router.replace('/auth/sign-in');
      }
    } catch (error) {
      // Could be server-side rendering
    } finally {
        setIsLoading(false);
    }
  }, [pathname, router]);

  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }
  
  if (isLoading) {
      // You can return a loader here
      return null;
  }
  
  if (!session) {
    // Already handled by useEffect redirect, but as a fallback
    return null;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M7.5 13.5c-2.2 0-4-2-4-4.5s1.8-4.5 4-4.5h9c2.2 0 4 2 4 4.5s-1.8 4.5-4 4.5h-3"></path><path d="M9 13.5c-2.2 0-4 2-4 4.5s1.8 4.5 4 4.5h9c2.2 0 4-2.2 4-4.5s-1.8-4.5-4-4.5Z"></path></svg>
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
