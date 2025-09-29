import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ArrowUpRight, DollarSign, CreditCard, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(6000000)}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
         <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(2215000)}</div>
            <p className="text-xs text-muted-foreground">+12.5% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(3785000)}</div>
            <p className="text-xs text-muted-foreground">Balance actual de todas las cuentas</p>
          </CardContent>
        </Card>
         <Card className="card-glassmorphic rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Presupuesto</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{formatCurrency(800000)}</div>
            <p className="text-xs text-muted-foreground">Presupuesto de mercado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2 space-y-8">
            <Card className="card-glassmorphic rounded-xl">
                <CardHeader>
                    <CardTitle className="font-headline">Resumen de Gastos</CardTitle>
                    <CardDescription>Distribución de gastos por categoría este mes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpensesChart />
                </CardContent>
            </Card>
        </div>
      </div>
       <Card className="card-glassmorphic rounded-xl">
            <CardHeader>
                <CardTitle className="font-headline">Tendencia Mensual</CardTitle>
                <CardDescription>Ingresos vs. Gastos en los últimos meses.</CardDescription>
            </CardHeader>
            <CardContent>
                <TrendChart />
            </CardContent>
        </Card>
    </div>
  );
}
