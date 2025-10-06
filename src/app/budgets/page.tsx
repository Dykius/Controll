
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBudgets, getCategories, getTransactions, deleteBudget } from "@/lib/data-service";
import { formatCurrency, getBudgetStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreVertical, Edit, Trash2, Building, ShoppingCart, Home, Car, Ticket, Laptop, Lightbulb, HeartPulse } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BudgetForm } from "./budget-form";
import MonthSelector from "./month-selector";
import type { Budget, Category, Transaction } from "@/lib/types";
import { addMonths } from "date-fns";


const iconMap: { [key: string]: React.ReactNode } = {
    Briefcase: <Building className="h-6 w-6" />,
    ShoppingCart: <ShoppingCart className="h-6 w-6" />,
    Home: <Home className="h-6 w-6" />,
    Car: <Car className="h-6 w-6" />,
    Ticket: <Ticket className="h-6 w-6" />,
    Laptop: <Laptop className="h-6 w-6" />,
    Lightbulb: <Lightbulb className="h-6 w-6" />,
    HeartPulse: <HeartPulse className="h-6 w-6" />,
    Default: <div className="h-6 w-6" />
};

export default function BudgetsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // States for data
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshData = () => {
    setBudgets(getBudgets());
    setCategories(getCategories());
    setTransactions(getTransactions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const { monthlyBudgetsData, totalBudgeted, totalSpent } = useMemo(() => {
    const monthStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const monthlyBudgets = budgets.filter(b => b.month === monthStr);
    
    const data = monthlyBudgets.map((budget) => {
      const category = categories.find(c => c.id === budget.categoryId);
      const spent = transactions
        .filter(t => t.categoryId === budget.categoryId && t.type === 'Expense' && new Date(t.date).toISOString().startsWith(monthStr))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const progress = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
      
      return {
        ...budget,
        categoryName: category?.name || 'Sin categoría',
        categoryIcon: category?.icon || 'Default',
        spent,
        remaining: budget.amount - spent,
        progress,
        color: getBudgetStatusColor(progress),
      };
    });

    const totalBudgeted = data.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = data.reduce((sum, b) => sum + b.spent, 0);

    return { monthlyBudgetsData: data, totalBudgeted, totalSpent };
  }, [currentDate, budgets, categories, transactions]);


  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };
  
  const handleDeleteRequest = (budgetId: string) => {
    setBudgetToDelete(budgetId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      deleteBudget(budgetToDelete);
      setBudgetToDelete(null);
      refreshData();
    }
    setIsAlertOpen(false);
  };
  
  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
    refreshData();
  }

  const maxDate = addMonths(new Date(), 3);
  const minDate = new Date(2020, 0, 1); // Example min date

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <MonthSelector 
              selectedDate={currentDate} 
              onDateChange={setCurrentDate}
              minDate={minDate}
              maxDate={maxDate}
            />
             <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setEditingBudget(null); }}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Presupuesto
                    </Button>
                </DialogTrigger>
                <DialogContent className="card-glassmorphic">
                    <DialogHeader>
                        <DialogTitle className="font-headline">{editingBudget ? "Editar" : "Nuevo"} Presupuesto</DialogTitle>
                    </DialogHeader>
                    <BudgetForm onSuccess={handleSuccess} budget={editingBudget} />
                </DialogContent>
            </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-glassmorphic rounded-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Total Presupuestado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(totalBudgeted)}</p>
                </CardContent>
            </Card>
             <Card className="card-glassmorphic rounded-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Total Gastado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
                </CardContent>
            </Card>
             <Card className="card-glassmorphic rounded-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Balance del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className={`text-3xl font-bold ${totalBudgeted - totalSpent < 0 ? 'text-destructive' : ''}`}>{formatCurrency(totalBudgeted - totalSpent)}</p>
                </CardContent>
            </Card>
        </div>
        
        {monthlyBudgetsData.length === 0 ? (
             <Card className="card-glassmorphic text-center p-12 rounded-xl flex flex-col items-center justify-center min-h-[200px]">
                <CardTitle className="font-headline">No Hay Presupuestos Para Este Mes</CardTitle>
                <CardDescription className="mt-2">Empieza creando un nuevo presupuesto para organizar tus gastos.</CardDescription>
             </Card>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monthlyBudgetsData.map((budget) => (
                <Card key={budget.id} className="card-glassmorphic rounded-xl flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full">
                                {iconMap[budget.categoryIcon] || iconMap.Default}
                            </div>
                            <CardTitle className="font-headline text-xl">{budget.categoryName}</CardTitle>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(budget)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteRequest(budget.id)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
                        <div>
                             <p className="text-sm text-muted-foreground">
                                {formatCurrency(budget.spent)} de {formatCurrency(budget.amount)}
                            </p>
                            <Progress value={budget.progress} className="h-3 mt-1" style={{ '--progress-color': budget.color } as React.CSSProperties} />
                        </div>
                        <p className={`text-lg font-bold ${budget.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {formatCurrency(Math.abs(budget.remaining))} {budget.remaining < 0 ? 'excedido' : 'restante'}
                        </p>
                    </CardContent>
                </Card>
            ))}
            </div>
        )}
         <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente tu presupuesto para esta categoría.
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
}
