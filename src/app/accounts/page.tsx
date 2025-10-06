
"use client";
import { getAccounts } from "@/lib/data-service";
import { AccountsClient } from "./accounts-client";
import type { Account } from "@/lib/types";
import { useEffect, useState } from "react";

export default function AccountsPage() {
  const [data, setData] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccounts = () => {
    const accountsData = getAccounts();
    setData(accountsData);
  }

  useEffect(() => {
    refreshAccounts();
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div>Cargando cuentas...</div>;
  }

  return (
    <AccountsClient data={data} onAccountChange={refreshAccounts}/>
  );
}
