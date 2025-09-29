import { transactions } from "@/lib/data";
import { TransactionsClient } from "./transactions-client";

// Simulate fetching data from a server
async function getTransactions() {
  return transactions;
}

export default async function TransactionsPage() {
  const data = await getTransactions();
  return <TransactionsClient data={data} />;
}
