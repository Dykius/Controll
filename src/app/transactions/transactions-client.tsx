
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns";
import type { Transaction, Category, Account } from "@/lib/types";
import { PlusCircle, Upload, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';
import { getAccounts, getCategories, deleteTransaction } from '@/lib/data-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionsClientProps {
    data: Transaction[];
    onTransactionChange: () => void;
}

export const TransactionsClient: React.FC<TransactionsClientProps> = ({ data, onTransactionChange }) => {
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
    
    // We need to get the latest data for the form
    const accounts = getAccounts();
    const categories = getCategories();

    const filteredData = data.filter(item => {
        const descriptionMatch = item.description.toLowerCase().includes(filter.toLowerCase());
        const typeMatch = typeFilter === 'all' || item.type === (typeFilter === 'income' ? 'Income' : 'Expense');
        const categoryMatch = categoryFilter === 'all' || item.categoryId === categoryFilter;
        return descriptionMatch && typeMatch && categoryMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleSuccess = () => {
        setIsFormOpen(false);
        setEditingTransaction(null);
        onTransactionChange();
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const handleDeleteRequest = (transactionId: string) => {
        setTransactionToDelete(transactionId);
        setIsAlertOpen(true);
    };

    const confirmDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete);
            onTransactionChange();
            setTransactionToDelete(null);
        }
        setIsAlertOpen(false);
    };

    const columns = useMemo(() => getColumns(handleEdit, handleDeleteRequest), [onTransactionChange]);

    const openAddNew = () => {
        setEditingTransaction(null);
        setIsFormOpen(true);
    }

    return (
        <div className="space-y-6">
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
                    <Button onClick={openAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Transacción
                    </Button>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Importar CSV
                    </Button>
                </div>
            </div>
            <div className="p-4 sm:p-6 md:p-8 rounded-xl card-glassmorphic">
                <DataTable columns={columns} data={filteredData} />
            </div>

            <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingTransaction(null); }}>
                <DialogContent className="card-glassmorphic">
                    <DialogHeader>
                        <DialogTitle className="font-headline">
                            {editingTransaction ? 'Editar' : 'Nueva'} Transacción
                        </DialogTitle>
                    </DialogHeader>
                    <TransactionForm 
                        accounts={accounts} 
                        categories={categories} 
                        onSuccess={handleSuccess}
                        transaction={editingTransaction}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Estas realmente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        esto eliminara la transaccion. Esta accion es completamente irreversible.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
