import Link from 'next/link';
import Image from 'next/image';
import { AuthCard } from '@/components/auth/auth-card';
import { BackgroundPattern } from '@/components/auth/background-pattern';
import { SignUpForm } from './sign-up-form';

export default function SignUpPage() {
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
          title="Crea tu cuenta"
          subtitle="Empieza a gestionar tus finanzas hoy mismo"
        >
          <div className="mt-8">
            <SignUpForm />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/auth/sign-in"
                className="font-semibold text-nano-purple hover:text-white underline-offset-2 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
