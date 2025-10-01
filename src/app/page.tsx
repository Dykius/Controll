import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { formatCurrency } from "@/lib/utils";
import { transactions, categories, accounts } from "@/lib/data";
import type { Transaction, Category, Account } from "@/lib/types";

function getDashboardData() {
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance, transactions, categories, accounts };
}

export default function DashboardPage() {
    const { totalIncome, totalExpense, balance, transactions, categories, accounts } = getDashboardData();
    
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Ingresos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-[hsl(var(--chart-1))]">{formatCurrency(totalIncome)}</p>
                    </CardContent>
                </Card>
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Gastos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-[hsl(var(--chart-2))]">{formatCurrency(totalExpense)}</p>
                    </CardContent>
                </Card>
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Balance Actual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
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
                        <CardDescription>Cómo se distribuyen tus gastos por categoría.</CardDescription>
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
