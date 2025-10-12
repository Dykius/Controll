
"use client";
import { getAccounts } from "@/lib/data-service";
import { AccountsClient } from "./accounts-client";
import type { Account } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export default function AccountsPage() {
  const [data, setData] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      // En una app real, el user_id vendría de la sesión
      const user_id = 1;
      const accountsData = await getAccounts(user_id);
      setData(accountsData);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      // Opcional: mostrar un toast de error al usuario
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);
  
  if (isLoading) {
    return <div>Cargando cuentas...</div>;
  }

  return (
    <AccountsClient data={data} onAccountChange={refreshAccounts}/>
  );
}
