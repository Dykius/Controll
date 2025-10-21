
"use client"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"
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
  const chartData = useMemo(() => {
    const expenseCategories = categories.filter(c => c.type === 'Expense');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return expenseCategories
      .map((category, index) => {
        const total = transactions
          .filter(t => {
            const transactionDate = new Date(t.date);
            return t.categoryId === category.id && 
                   t.type === 'Expense' &&
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const baseColorsCount = 5;
        const colorIndex = (index % baseColorsCount) + 1;
        let color = `hsl(var(--chart-${colorIndex}))`;

        return { 
          name: category.name, 
          value: total, 
          fill: color,
          label: category.name
        };
      })
      .filter(item => item.value > 0);
  }, [transactions, categories]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item) => {
        acc[item.name] = {
            label: item.label,
            color: item.fill
        };
        return acc;
    }, {} as any);
  }, [chartData]);


  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No hay datos de gastos para mostrar este mes.</p>
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
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
