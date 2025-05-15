// app/page.tsx
import LoginPage from "@/app/login/page";
import { obtenerAudiencias } from "../../prisma/servicio.audiencias";

export default async function Home() {
  const audiencias = await obtenerAudiencias({
    juzgado: 55,
    fechaHasta: new Date("2025-05-13"),
  });
  console.info(audiencias);
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <LoginPage />
    </main>
  );
}
