
"use client";

import { getTransactions, getCategories } from "@/lib/data-service";
import { TransactionsClient } from "./transactions-client";

export default function TransactionsPage() {
  const transactionData = getTransactions();
  const categoryData = getCategories();
  return <TransactionsClient data={transactionData} categories={categoryData} />;
}
