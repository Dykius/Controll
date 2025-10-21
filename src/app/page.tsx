
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { formatCurrency } from "@/lib/utils";
import { getAppData } from "@/lib/data-service";
import { useState, useEffect, useCallback } from "react";
import type { Account, Category, Transaction, Budget } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

type AppData = {
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
    monthlySummary: {
        totalIncome: number;
        totalExpense: number;
        totalBalance: number;
    }
};


export default function DashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [data, setData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const appData = await getAppData();
            setData(appData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if(user){
            fetchData();
        }
        if (!isAuthLoading && !user) {
            setIsLoading(false);
            setData(null);
        }
    }, [user, isAuthLoading, fetchData]);

    if (isLoading || isAuthLoading) {
        return <div>Cargando...</div>;
    }

    if (!data || data.accounts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="card-glassmorphic text-center p-8 max-w-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">¡Bienvenido a Control+!</CardTitle>
                        <CardDescription className="text-base">
                            Parece que todavía no tienes ninguna cuenta. ¡Crea una para empezar a gestionar tus finanzas!
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    const { monthlySummary, transactions, categories, accounts } = data;
    
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Ingresos Totales (Mes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-[hsl(var(--chart-1))]">{formatCurrency(monthlySummary.totalIncome)}</p>
                    </CardContent>
                </Card>
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Gastos Totales (Mes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-[hsl(var(--chart-2))]">{formatCurrency(monthlySummary.totalExpense)}</p>
                    </CardContent>
                </Card>
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Balance Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(monthlySummary.totalBalance)}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline">Tendencia Mensual</CardTitle>
                        <CardDescription>Ingresos vs. Gastos del año actual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrendChart transactions={transactions} />
                    </CardContent>
                </Card>
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline">Distribución de Gastos</CardTitle>
                        <CardDescription>Cómo se distribuyen tus gastos por categoría este mes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExpensesChart transactions={transactions} categories={categories} />
                    </CardContent>
                </Card>
            </div>

            <RecentTransactions transactions={transactions} categories={categories} accounts={accounts} />
        </div>
    );
}
