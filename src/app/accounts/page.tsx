import { accounts } from "@/lib/data";
import { AccountsClient } from "./accounts-client";

// Simulate fetching data from a server
async function getAccounts() {
  return accounts;
}

export default async function AccountsPage() {
  const data = await getAccounts();
  return (
    <AccountsClient data={data}/>
  );
}
