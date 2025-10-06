
"use client";

import { getTransactions } from "@/lib/data-service";
import { TransactionsClient } from "./transactions-client";
import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const transactionData = getTransactions();
    setData(transactionData);
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div>Cargando transacciones...</div>;
  }
  
  return <TransactionsClient data={data} />;
}
