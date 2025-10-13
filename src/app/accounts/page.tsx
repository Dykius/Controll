
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
      // Ya no es necesario pasar el user.userId
      const accountsData = await getAccounts();
      setData(accountsData);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshAccounts();
    }
     if (!isAuthLoading && !user) {
      setIsLoading(false);
      setData([]);
    }
  }, [user, isAuthLoading, refreshAccounts]);
  
  if (isLoading || isAuthLoading) {
    return <div>Cargando cuentas...</div>;
  }

  return (
    <AccountsClient data={data} onAccountChange={refreshAccounts}/>
  );
}
