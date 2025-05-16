// app/components/CerrarSesionButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { cerrarSesion } from "../actions";
import { toast } from "react-hot-toast";

export default function CerrarSesionButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { exito } = await cerrarSesion();
    if (exito) {
      toast.success("Sesión cerrada exitosamente", {
        duration: 2000,
      });
      setTimeout(() => router.push("/"), 500);
    } else {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Cerrar sesión
    </button>
  );
}
