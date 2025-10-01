"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  FileUp,
  Landmark,
  List,
  Settings,
} from 'lucide-react';
import React from 'react';
import { LogoutButton } from './logout-button';

const links = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/accounts', label: 'Cuentas', icon: Landmark },
  { href: '/categories', label: 'Categorías', icon: List },
  { href: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Presupuestos', icon: Target },
];

const secondaryLinks = [
    { href: '#', label: 'Importar CSV', icon: FileUp },
]

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="flex flex-col h-full">
      <div className="flex-1">
        {links.map((link) => {
          // Handle nested routes for active state
          const isActive = link.href === '/' ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton isActive={isActive} tooltip={link.label}>
                  <Icon className="size-5" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
        <SidebarSeparator className="my-2" />
        {secondaryLinks.map((link) => {
          const Icon = link.icon;
          
          return (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton tooltip={link.label}>
                  <Icon className="size-5" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </div>
      <div className="mt-auto">
        <SidebarSeparator className="my-2" />
         <SidebarMenuItem>
            <Link href="#">
              <SidebarMenuButton tooltip="Configuración">
                <Settings className="size-5" />
                <span className="truncate group-data-[collapsible=icon]:hidden">Configuración</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        <SidebarMenuItem>
            <LogoutButton />
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}
