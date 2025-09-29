import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppHeader } from '@/components/layout/app-header';

export const metadata: Metadata = {
  title: 'Control+',
  description: 'Gestión de finanzas personales simplificada.',
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  // This is a placeholder for session logic
  const session = false; // Set to false to default to auth pages

  if (!session) {
    return (
        <html lang="es" className="dark" suppressHydrationWarning>
         <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased bg-background text-foreground">
            {children}
            <Toaster />
        </body>
        </html>
    );
  }

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
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
        <Toaster />
      </body>
    </html>
  );
}
