"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    const segment = pathname.split('/')[1];
    if (segment === '') return 'Inicio';
    if (!segment) return 'Inicio';

    const titles: { [key: string]: string } = {
        'accounts': 'Cuentas',
        'transactions': 'Transacciones',
        'budgets': 'Presupuestos',
        'categories': 'Categorías'
    }

    return titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b border-transparent bg-transparent px-4 sm:px-6 md:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-3xl font-bold md:text-4xl font-headline">{getPageTitle()}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
