"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import type { Transaction } from "@/lib/types";
import { PlusCircle, Upload } from "lucide-react";

interface TransactionsClientProps {
    data: Transaction[];
}

export const TransactionsClient: React.FC<TransactionsClientProps> = ({ data }) => {
    const [filter, setFilter] = useState('');
    
    const filteredData = data.filter(item => 
        item.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Input
                    placeholder="Filter transactions by description..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                    </Button>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                </div>
            </div>
            <div className="p-4 sm:p-6 md:p-8 rounded-lg card-glassmorphic">
                <DataTable columns={columns} data={filteredData} />
            </div>
        </div>
    );
};
