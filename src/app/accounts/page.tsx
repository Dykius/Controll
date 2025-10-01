
"use client";
import { getAccounts } from "@/lib/data-service";
import { AccountsClient } from "./accounts-client";

export default function AccountsPage() {
  const data = getAccounts();
  return (
    <AccountsClient data={data}/>
  );
}
