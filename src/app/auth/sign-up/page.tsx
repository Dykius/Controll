import Link from 'next/link';
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
            <div className="flex items-center gap-2">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M7.5 13.5c-2.2 0-4-2-4-4.5s1.8-4.5 4-4.5h9c2.2 0 4 2 4 4.5s-1.8 4.5-4 4.5h-3" />
                <path d="M9 13.5c-2.2 0-4 2-4 4.5s1.8 4.5 4 4.5h9c2.2 0 4-2.2 4-4.5s-1.8-4.5-4-4.5Z" />
              </svg>
              <span className="text-xl font-bold text-white">Control+</span>
            </div>
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
