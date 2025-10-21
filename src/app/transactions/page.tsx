
"use client";

import { getAppData } from "@/lib/data-service";
import { TransactionsClient } from "./transactions-client";
import { useEffect, useState, useCallback } from "react";
import type { Transaction, Account, Category } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function TransactionsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { transactions, accounts, categories } = await getAppData();
      setTransactions(transactions);
      setAccounts(accounts);
      setCategories(categories);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshData();
    }
    if (!isAuthLoading && !user) {
        setIsLoading(false);
        setTransactions([]);
        setAccounts([]);
        setCategories([]);
    }
  }, [user, isAuthLoading, refreshData]);
  
  if (isLoading || isAuthLoading) {
    return <div>Cargando transacciones...</div>;
  }
  
  return (
    <TransactionsClient 
      data={transactions} 
      accounts={accounts}
      categories={categories}
      onTransactionChange={refreshData} 
    />
  );
}
