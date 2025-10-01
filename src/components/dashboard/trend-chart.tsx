"use client"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, ComposedChart } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useMemo } from "react";
import { formatCurrency, formatNumberAsK } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface TrendChartProps {
  transactions: Transaction[];
}

const chartConfig = {
    income: {
        label: "Ingresos",
        color: "hsl(var(--chart-1))",
    },
    expense: {
        label: "Gastos",
        color: "hsl(var(--chart-2))",
    },
};

export function TrendChart({ transactions }: TrendChartProps) {
    const data = useMemo(() => {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlyData = monthNames.map(month => ({ name: month, income: 0, expense: 0 }));
        
        const currentYear = new Date().getFullYear();

        transactions.forEach(t => {
            const transactionYear = new Date(t.date).getFullYear();
            if(transactionYear === currentYear) {
                const monthIndex = new Date(t.date).getMonth();
                if (t.type === 'Income') {
                    monthlyData[monthIndex].income += t.amount;
                } else {
                    monthlyData[monthIndex].expense += t.amount;
                }
            }
        });

        // show current month and previous 5 months
        const currentMonthIndex = new Date().getMonth();
        return monthlyData.slice(0, currentMonthIndex + 1);

    }, [transactions]);

  if (data.every(d => d.income === 0 && d.expense === 0)) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No hay datos de tendencia para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickFormatter={(value) => formatNumberAsK(Number(value))} tickLine={false} tickMargin={10} axisLine={false} />
            <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill={chartConfig.income.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill={chartConfig.expense.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
