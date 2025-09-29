import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgets, categories, transactions } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BudgetsPage() {
  const currentMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;

  const monthlyBudgets = budgets.filter(b => b.month === currentMonth);

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-end">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Presupuesto
            </Button>
        </div>
        
        {monthlyBudgets.length === 0 ? (
             <Card className="card-glassmorphic text-center p-12 rounded-xl">
                <CardTitle className="font-headline">No Hay Presupuestos Para Este Mes</CardTitle>
                <CardDescription className="mt-2">Empieza creando un nuevo presupuesto.</CardDescription>
             </Card>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monthlyBudgets.map((budget) => {
                const category = categories.find(c => c.id === budget.categoryId);
                const spent = transactions
                .filter(t => t.categoryId === budget.categoryId && t.type === 'Expense' && new Date(t.date).toISOString().startsWith(currentMonth))
                .reduce((sum, t) => sum + t.amount, 0);
                
                const remaining = budget.amount - spent;
                const progress = Math.min((spent / budget.amount) * 100, 100);

                return (
                <Card key={budget.id} className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline">{category?.name}</CardTitle>
                        <CardDescription>
                            {formatCurrency(spent)} gastados de {formatCurrency(budget.amount)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Progress value={progress} />
                        <p className={`text-sm font-medium ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {formatCurrency(Math.abs(remaining))} {remaining < 0 ? 'excedido' : 'restante'}
                        </p>
                    </CardContent>
                </Card>
                );
            })}
            </div>
        )}
    </div>
  );
}
