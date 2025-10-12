
"use client";

import { getTransactions, getAccounts, getCategories } from "@/lib/data-service";
import { TransactionsClient } from "./transactions-client";
import { useEffect, useState, useCallback } from "react";
import type { Transaction, Account, Category } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // En una app real, el user_id vendría de la sesión
      const user_id = 1;
      const [transactionsData, accountsData, categoriesData] = await Promise.all([
        getTransactions(user_id),
        getAccounts(user_id),
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
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  if (isLoading) {
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
