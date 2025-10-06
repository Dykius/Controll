
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

interface AccountFormProps {
    onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es muy corto.' }),
  initialBalance: z.coerce.number().min(0, { message: 'El saldo inicial no puede ser negativo.' }),
  type: z.enum(['Bank', 'Cash', 'Wallet'], { required_error: 'Debes seleccionar un tipo.' }),
});

export function AccountForm({ onSuccess }: AccountFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      initialBalance: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        addAccount(values);
      
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
                <Input placeholder="Ej: Bancolombia, Efectivo, Nequi..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Inicial</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
