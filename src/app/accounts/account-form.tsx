
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addAccount } from '@/lib/data-service';
import { useAuth } from '@/hooks/use-auth';

interface AccountFormProps {
    onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es muy corto.' }),
  type: z.enum(['Bank', 'Cash', 'Wallet', 'Credit Card'], { required_error: 'Debes seleccionar un tipo.' }),
  initial_balance: z.coerce.number().optional(),
  credit_limit: z.coerce.number().optional(),
  initial_debt: z.coerce.number().optional(),
  closing_date: z.coerce.number().optional(),
}).refine(data => {
    if (data.type !== 'Credit Card') {
        return data.initial_balance !== undefined && data.initial_balance >= 0;
    }
    return true;
}, {
    message: 'El saldo inicial no puede ser negativo.',
    path: ['initial_balance'],
}).refine(data => {
    if (data.type === 'Credit Card') {
        return data.credit_limit !== undefined && data.credit_limit > 0;
    }
    return true;
}, {
    message: 'El límite de crédito debe ser positivo.',
    path: ['credit_limit'],
}).refine(data => {
    if (data.type === 'Credit Card') {
        return data.initial_debt !== undefined && data.initial_debt >= 0;
    }
    return true;
}, {
    message: 'La deuda inicial no puede ser negativa.',
    path: ['initial_debt'],
}).refine(data => {
    if (data.type === 'Credit Card') {
        return data.closing_date !== undefined && data.closing_date >= 1 && data.closing_date <= 31;
    }
    return true;
}, {
    message: 'El día de corte debe ser entre 1 y 31.',
    path: ['closing_date'],
});

export function AccountForm({ onSuccess }: AccountFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      initial_balance: 0,
      credit_limit: 0,
      initial_debt: 0,
      closing_date: 1,
    },
  });

  const accountType = form.watch('type');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Error de autenticación',
            description: 'No se ha podido identificar al usuario.',
        });
        return;
    }
    
    try {
        const dataToAdd: any = {
            name: values.name,
            type: values.type,
            user_id: user.userId,
            currency: 'COP',
        };

        if (values.type === 'Credit Card') {
            dataToAdd.credit_limit = values.credit_limit;
            dataToAdd.closing_date = values.closing_date;
            dataToAdd.initial_debt = values.initial_debt || 0;
            dataToAdd.initial_balance = 0;
        } else {
            dataToAdd.initial_balance = values.initial_balance || 0;
            dataToAdd.credit_limit = 0;
            dataToAdd.closing_date = null;
            dataToAdd.initial_debt = 0;
        }

        await addAccount(dataToAdd);
      
        toast({
          title: '¡Cuenta agregada!',
          description: 'Tu nueva cuenta ha sido registrada.',
      });
      onSuccess();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error al agregar',
            description: 'Ocurrió un error al registrar tu cuenta.',
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
                <FormItem>
                <FormLabel>Tipo de Cuenta</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Bank">Cuenta Bancaria</SelectItem>
                        <SelectItem value="Wallet">Billetera Digital</SelectItem>
                        <SelectItem value="Cash">Efectivo</SelectItem>
                        <SelectItem value="Credit Card">Tarjeta de Crédito</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Cuenta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Bancolombia, Tarjeta Nu, Nequi..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {accountType !== 'Credit Card' ? (
             <FormField
                control={form.control}
                name="initial_balance"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Saldo Inicial</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        ) : (
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="initial_debt"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Deuda Inicial</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="credit_limit"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Límite de Crédito</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="5,000,000" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="closing_date"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Día de Corte</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Ej: 15" {...field} value={field.value ?? ''} min="1" max="31" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )}
        
        <Button
          type="submit"
          className="w-full"
        >
          Guardar Cuenta
        </Button>
      </form>
    </Form>
  );
}
