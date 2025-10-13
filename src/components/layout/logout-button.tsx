
"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // This will trigger a reload and the middleware will redirect to the login page.
            toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión exitosamente.",
            });
            router.push('/auth/sign-in');
            router.refresh();
        }
    };

    return (
        <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
            <LogOut className="size-5" />
            <span className="truncate group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
        </SidebarMenuButton>
    );
}
