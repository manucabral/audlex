import LoginPage from "@/app/login/page";
import { obtenerSesion } from "../../prisma/servicio.auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const sesion = await obtenerSesion();
  if (sesion) redirect("/panel");
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <LoginPage />
    </main>
  );
}
