
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const incomeCategories = categories.filter(c => c.type === 'Income');
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  if (isLoading) {
    return <div>Cargando categorías...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Categorías de Ingresos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {incomeCategories.map(category => (
              <Badge key={category.id} variant="secondary" className="text-lg py-1 px-3 rounded-full">
                {category.name}
              </Badge>
            ))}
             {incomeCategories.length === 0 && <p className="text-sm text-muted-foreground">No hay categorías de ingresos.</p>}
          </CardContent>
        </Card>
        <Card className="card-glassmorphic rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline">Categorías de Gastos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {expenseCategories.map(category => (
              <Badge key={category.id} variant="secondary" className="text-lg py-1 px-3 rounded-full">
                {category.name}
              </Badge>
            ))}
            {expenseCategories.length === 0 && <p className="text-sm text-muted-foreground">No hay categorías de gastos.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
