import Link from 'next/link';
import Image from 'next/image';
import { AuthCard } from '@/components/auth/auth-card';
import { BackgroundPattern } from '@/components/auth/background-pattern';
import { SignInForm } from './sign-in-form';

export default function SignInPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <BackgroundPattern />
      <div className="relative z-10 w-full">
        <AuthCard
          logo={
            <Image 
              src="/Logo.png" 
              alt="Control+ Logo" 
              width={180} 
              height={43}
              quality={100}
            />
          }
          title="Inicia Sesión"
          subtitle="Bienvenido de nuevo a Control+"
        >
          <div className="mt-8">
            <SignInForm />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/auth/sign-up"
                className="font-semibold text-nano-purple hover:text-white underline-offset-2 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
