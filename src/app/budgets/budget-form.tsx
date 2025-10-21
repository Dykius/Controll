
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addBudget, updateBudget } from '@/lib/data-service';
import type { Budget, Category } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { Calendar } from '@/components/ui/calendar';

interface BudgetFormProps {
    onSuccess: () => void;
    budget?: Budget | null;
    categories: Category[];
    allBudgets: Budget[];
}

const formSchema = z.object({
  categoryId: z.string({ required_error: 'Debes seleccionar una categoría.' }),
  amount: z.coerce.number().positive({ message: 'El monto debe ser un número positivo.' }),
  month: z.date({ required_error: 'Debes seleccionar un mes.' }),
});

export function BudgetForm({ onSuccess, budget, categories, allBudgets }: BudgetFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const expenseCategories = categories.filter(c => c.type === 'Expense');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: '',
      amount: 0,
      month: new Date(),
    },
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        categoryId: budget.categoryId,
        amount: budget.amount,
        month: new Date(budget.month + '-02'), // Use day 02 to avoid timezone issues
      });
    } else {
        form.reset({
            categoryId: '',
            amount: 0,
            month: new Date(),
        })
    }
  }, [budget, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error de autenticación' });
        return;
    }

    const monthString = `${values.month.getFullYear()}-${(values.month.getMonth() + 1).toString().padStart(2, '0')}`;

    if (!budget && allBudgets.some(b => b.categoryId === values.categoryId && b.month === monthString)) {
        toast({
            variant: 'destructive',
            title: 'Presupuesto duplicado',
            description: 'Ya existe un presupuesto para esta categoría en el mes seleccionado.',
        });
        return;
    }

    try {
      const budgetData = {
        ...values,
        month: monthString,
        user_id: user.userId
      };

      if (budget) {
        await updateBudget({ ...budget, ...budgetData });
        toast({ title: '¡Presupuesto actualizado!', description: 'Tu presupuesto ha sido modificado.' });
      } else {
        await addBudget(budgetData);
        toast({ title: '¡Presupuesto agregado!', description: 'Tu nuevo presupuesto ha sido registrado.' });
      }
      onSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'Ocurrió un error al registrar tu presupuesto.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría de Gasto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto del Presupuesto</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mes del Presupuesto</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        format(field.value, "MMMM yyyy", { locale: es })
                      ) : (
                        <span>Selecciona un mes</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                   <Input
                        type="month"
                        value={format(field.value || new Date(), 'yyyy-MM')}
                        onChange={(e) => {
                            const [year, month] = e.target.value.split('-');
                            field.onChange(new Date(Number(year), Number(month) - 1, 2));
                        }}
                        className="block sm:hidden"
                    />
                    <div className="hidden sm:block">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().getFullYear(), new Date().getMonth(), 1) || date > addMonths(new Date(), 3)
                            }
                            initialFocus
                            locale={es}
                        />
                    </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {budget ? 'Actualizar' : 'Guardar'} Presupuesto
        </Button>
      </form>
    </Form>
  );
}
