import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Bienvenido a Control+</h1>
        <p className="text-muted-foreground text-lg">
          Tu aplicación para gestionar finanzas personales.
        </p>
      </div>
      <div className="flex gap-4 mt-8">
        <Button asChild>
          <Link href="/auth/sign-in">Iniciar Sesión</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/sign-up">Crear Cuenta</Link>
        </Button>
      </div>
    </div>
  );
}
