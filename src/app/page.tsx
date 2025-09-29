import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { accounts, transactions } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TrendChart } from "@/components/dashboard/trend-chart";

export default function Home() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.initialBalance, 0) +
    transactions.reduce((sum, txn) => sum + (txn.type === 'Income' ? txn.amount : -txn.amount), 0);

  const monthlyIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">En todas las cuentas</p>
          </CardContent>
        </Card>
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(monthlyIncome)}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Mensuales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 card-glassmorphic rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Ingresos vs. Gastos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3 card-glassmorphic rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesChart />
          </CardContent>
        </Card>
      </div>

      <RecentTransactions />
    </div>
  );
}
