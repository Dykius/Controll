"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the session cookie
        document.cookie = 'session=; path=/; max-age=0;';
        // Force a reload to ensure middleware catches the change
        window.location.href = '/auth/sign-in';
    };

    return (
        <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
            <LogOut className="size-5" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
        </SidebarMenuButton>
    );
}
