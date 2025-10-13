
"use client";

import { getTransactions, getAccounts, getCategories } from "@/lib/data-service";
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
      // Ya no es necesario pasar el user.userId
      const [transactionsData, accountsData, categoriesData] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getCategories()
      ]);
      setTransactions(transactionsData);
      setAccounts(accountsData);
      setCategories(categoriesData);
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
