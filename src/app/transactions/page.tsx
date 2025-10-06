
"use client";

import { getTransactions } from "@/lib/data-service";
import { TransactionsClient } from "./transactions-client";

export default function TransactionsPage() {
  const transactionData = getTransactions();
  return <TransactionsClient data={transactionData} />;
}
