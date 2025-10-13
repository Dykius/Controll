
"use client";

import { useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Account, Category, Transaction } from '@/lib/types';
import { addTransaction, updateTransaction } from '@/lib/data-service';
import { useAuth } from '@/hooks/use-auth';

interface TransactionFormProps {
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
    transaction?: Transaction | null;
}

const formSchema = z.object({
  description: z.string().min(2, { message: 'La descripción es muy corta.' }),
  amount: z.coerce.number().positive({ message: 'El monto debe ser positivo.' }),
  type: z.enum(['Income', 'Expense'], { required_error: 'Debes seleccionar un tipo.' }),
  date: z.date({ required_error: 'Debes seleccionar una fecha.' }),
  accountId: z.string({ required_error: 'Debes seleccionar una cuenta.' }),
  categoryId: z.string({ required_error: 'Debes seleccionar una categoría.' }),
});

export function TransactionForm({ accounts, categories, onSuccess, transaction }: TransactionFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = !!transaction;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'Expense',
      date: new Date(),
    },
  });

  useEffect(() => {
    if (isEditMode && transaction) {
      form.reset({
        ...transaction,
        amount: Number(transaction.amount),
        date: new Date(transaction.date),
      });
    } else {
        form.reset({
            description: '',
            amount: 0,
            type: 'Expense',
            date: new Date(),
            accountId: undefined,
            categoryId: undefined,
        })
    }
  }, [transaction, isEditMode, form]);
  
  const transactionType = form.watch('type');

  const filteredCategories = categories.filter(c => c.type === transactionType);

  useEffect(() => {
    if (!filteredCategories.some(c => c.id === form.getValues('categoryId'))) {
        form.setValue('categoryId', '');
    }
  }, [transactionType, filteredCategories, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error de autenticación' });
        return;
    }
    
    try {
        const dateISO = values.date.toISOString();
        const transactionData = {
            ...values,
            user_id: user.userId,
            date: dateISO,
        }

        if (isEditMode && transaction) {
            await updateTransaction({
                ...transaction,
                ...transactionData,
            });
            toast({
                title: '¡Transacción actualizada!',
                description: 'Tu transacción ha sido modificada.',
            });
        } else {
             await addTransaction(transactionData);
            toast({
              title: '¡Transacción agregada!',
              description: 'Tu nueva transacción ha sido registrada.',
            });
        }

      onSuccess();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: 'Ocurrió un error al registrar tu transacción.',
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Transacción</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Income" />
                    </FormControl>
                    <FormLabel className="font-normal">Ingreso</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Gasto</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Salario, Mercado..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="accountId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cuenta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                        {account.name}
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
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </Trigger>
                    </FormControl>
                    <SelectContent>
                    {filteredCategories.map(category => (
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
        </div>
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Transacción</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full"
        >
          {isEditMode ? 'Actualizar' : 'Guardar'} Transacción
        </Button>
      </form>
    </Form>
  );
}
