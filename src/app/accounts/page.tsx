
"use client";
import { getAccounts } from "@/lib/data-service";
import { AccountsClient } from "./accounts-client";
import type { Account } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function AccountsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [data, setData] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccounts = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const accountsData = await getAccounts(user.id);
      setData(accountsData);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      // Opcional: mostrar un toast de error al usuario
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshAccounts();
    }
  }, [user, refreshAccounts]);
  
  if (isLoading || isAuthLoading) {
    return <div>Cargando cuentas...</div>;
  }

  return (
    <AccountsClient data={data} onAccountChange={refreshAccounts}/>
  );
}
