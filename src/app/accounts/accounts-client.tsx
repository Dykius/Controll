"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import type { Account } from "@/lib/types";
import { PlusCircle } from "lucide-react";

interface AccountsClientProps {
    data: Account[];
}

export const AccountsClient: React.FC<AccountsClientProps> = ({ data }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Account
                </Button>
            </div>
            <div className="p-4 sm:p-6 md:p-8 rounded-lg card-glassmorphic">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
};
