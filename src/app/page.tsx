import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-5xl font-bold mb-4">Bienvenido a Control+</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Tu aplicación para la gestión de finanzas personales.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/sign-in">Iniciar Sesión</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/sign-up">Registrarse</Link>
        </Button>
      </div>
    </div>
  );
}
