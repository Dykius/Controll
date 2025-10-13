
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un correo válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const response = await fetch('/api/auth/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Credenciales inválidas.');
        }

        toast({
            title: 'Inicio de sesión exitoso',
            description: `¡Bienvenido de nuevo, ${data.user.fullName}!`,
        });
        
        router.push('/');
        router.refresh();

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error de autenticación',
            description: error.message,
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  {...field}
                  className="auth-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  {...field}
                  className="auth-input pr-10"
                />
              </FormControl>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-nano-purple to-nano-pink shadow-nano-glow hover:-translate-y-0.5 active:scale-[0.99] transition-all"
        >
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}
