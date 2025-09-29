import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MoraMetrics',
  description: 'Personal finance management made simple.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="p-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2 font-headline">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="group-data-[collapsible=icon]:hidden">MoraMetrics</span>
                </h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Log out</span>
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <AppHeader />
            <div className="p-4 sm:p-6 md:p-8">
              {children}
            </div>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
