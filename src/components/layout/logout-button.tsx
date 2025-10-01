"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear client-side session
        localStorage.removeItem('session');
        // Clear the session cookie for the middleware
        document.cookie = 'session=; path=/; max-age=0;';
        
        // Redirect to sign-in page and refresh the application state
        router.push('/auth/sign-in');
        router.refresh();
    };

    return (
        <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
            <LogOut className="size-5" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
        </SidebarMenuButton>
    );
}
