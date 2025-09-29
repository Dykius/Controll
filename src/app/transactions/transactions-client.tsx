"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import type { Transaction, Category } from "@/lib/types";
import { PlusCircle, Upload, Search, ListFilter, LayoutGrid, LayoutList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

interface TransactionsClientProps {
    data: Transaction[];
    categories: Category[];
}

export const TransactionsClient: React.FC<TransactionsClientProps> = ({ data, categories }) => {
    const [filter, setFilter] = useState('');
    const [viewMode, setViewMode] = useState('list');
    
    const filteredData = data.filter(item => 
        item.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 items-center">
                    <ToggleGroup type="single" defaultValue="all" variant="outline">
                        <ToggleGroupItem value="all">Todos</ToggleGroupItem>
                        <ToggleGroupItem value="income">Ingreso</ToggleGroupItem>
                        <ToggleGroupItem value="expense">Gasto</ToggleGroupItem>
                    </ToggleGroup>
                     <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar transacción..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
             <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Transacción
                    </Button>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Importar CSV
                    </Button>
                </div>
                 <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode} variant="outline">
                    <ToggleGroupItem value="list" aria-label="List view">
                        <LayoutList className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                        <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className="p-4 sm:p-6 md:p-8 rounded-xl card-glassmorphic">
                <DataTable columns={columns} data={filteredData} />
            </div>
        </div>
    );
};
