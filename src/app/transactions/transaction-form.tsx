
"use client";

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
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Account, Category } from '@/lib/types';
import { addTransaction } from '@/lib/data-service';

interface TransactionFormProps {
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
}

const formSchema = z.object({
  description: z.string().min(2, { message: 'La descripción es muy corta.' }),
  amount: z.coerce.number().positive({ message: 'El monto debe ser positivo.' }),
  type: z.enum(['Income', 'Expense'], { required_error: 'Debes seleccionar un tipo.' }),
  date: z.date({ required_error: 'Debes seleccionar una fecha.' }),
  accountId: z.string({ required_error: 'Debes seleccionar una cuenta.' }),
  categoryId: z.string({ required_error: 'Debes seleccionar una categoría.' }),
});

export function TransactionForm({ accounts, categories, onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'Expense',
      date: new Date(),
    },
  });
  
  const transactionType = form.watch('type');

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (values.type === 'Expense') {
            const account = accounts.find(a => a.id === values.accountId);
            if (account && account.balance < values.amount) {
                toast({
                    variant: 'destructive',
                    title: 'Saldo insuficiente',
                    description: `No tienes suficiente saldo en la cuenta "${account.name}".`,
                });
                return;
            }
        }
    
        addTransaction({
            ...values,
            date: values.date.toISOString(),
        });
      
        toast({
          title: '¡Transacción agregada!',
          description: 'Tu nueva transacción ha sido registrada.',
      });
      router.refresh();
      onSuccess();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error al agregar',
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cuenta" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                        {account.name} ({formatCurrency(account.balance)})
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {categories.filter(c => c.type === transactionType).map(category => (
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
          Guardar Transacción
        </Button>
      </form>
    </Form>
  );
}
