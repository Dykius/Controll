import { transactions, categories } from "@/lib/data";
import { TransactionsClient } from "./transactions-client";

// Simulate fetching data from a server
async function getTransactions() {
  return transactions;
}

async function getCategories() {
    return categories;
}

export default async function TransactionsPage() {
  const transactionData = await getTransactions();
  const categoryData = await getCategories();
  return <TransactionsClient data={transactionData} categories={categoryData} />;
}
