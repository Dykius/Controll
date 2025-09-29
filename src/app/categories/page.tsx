import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const incomeCategories = categories.filter(c => c.type === 'Income');
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="card-glassmorphic">
          <CardHeader>
            <CardTitle className="font-headline">Categorías de Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {incomeCategories.map(category => (
              <Badge key={category.id} variant="secondary" className="text-lg py-1 px-3">
                {category.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card className="card-glassmorphic">
          <CardHeader>
            <CardTitle className="font-headline">Categorías de Gastos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {expenseCategories.map(category => (
              <Badge key={category.id} variant="secondary" className="text-lg py-1 px-3">
                {category.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
