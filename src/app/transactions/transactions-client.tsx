
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import type { Transaction, Category, Account } from "@/lib/types";
import { PlusCircle, Upload, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';
import { getAccounts, getCategories } from '@/lib/data-service';

interface TransactionsClientProps {
    data: Transaction[];
    onTransactionChange: () => void;
}

export const TransactionsClient: React.FC<TransactionsClientProps> = ({ data, onTransactionChange }) => {
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // We need to get the latest data for the form
    const accounts = getAccounts();
    const categories = getCategories();

    const filteredData = data.filter(item => {
        const descriptionMatch = item.description.toLowerCase().includes(filter.toLowerCase());
        const typeMatch = typeFilter === 'all' || item.type === (typeFilter === 'income' ? 'Income' : 'Expense');
        const categoryMatch = categoryFilter === 'all' || item.categoryId === categoryFilter;
        return descriptionMatch && typeMatch && categoryMatch;
    });

    const handleSuccess = () => {
        setIsFormOpen(false);
        onTransactionChange();
    };

    return (
        <div className="space-y-6">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 items-center flex-wrap">
                        <ToggleGroup type="single" value={typeFilter} onValueChange={(value) => value && setTypeFilter(value)} variant="outline">
                            <ToggleGroupItem value="all">Todos</ToggleGroupItem>
                            <ToggleGroupItem value="income">Ingreso</ToggleGroupItem>
                            <ToggleGroupItem value="expense">Gasto</ToggleGroupItem>
                        </ToggleGroup>
                         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="relative w-full sm:max-w-xs">
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
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nueva Transacción
                            </Button>
                        </DialogTrigger>
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Importar CSV
                        </Button>
                    </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 rounded-xl card-glassmorphic">
                    <DataTable columns={columns} data={filteredData} />
                </div>
                <DialogContent className="card-glassmorphic">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Nueva Transacción</DialogTitle>
                    </DialogHeader>
                    <TransactionForm 
                        accounts={accounts} 
                        categories={categories} 
                        onSuccess={handleSuccess}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
