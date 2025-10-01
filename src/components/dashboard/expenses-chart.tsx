"use client"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, Category } from "@/lib/types";

interface ExpensesChartProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ExpensesChart({ transactions, categories }: ExpensesChartProps) {
  const chartConfig = useMemo(() => {
    return categories.reduce((acc, category, index) => {
      acc[category.name] = {
        label: category.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    }, {} as any);
  }, [categories]);

  const expenseData = useMemo(() => {
    return categories
      .filter(c => c.type === 'Expense')
      .map(category => {
        const total = transactions
          .filter(t => t.categoryId === category.id && t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: category.name, value: total, fill: chartConfig[category.name]?.color };
      })
      .filter(item => item.value > 0);
  }, [transactions, categories, chartConfig]);

  if (expenseData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No hay datos de gastos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
                />
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                     {expenseData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
