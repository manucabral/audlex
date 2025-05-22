"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import FormularioNuevaAudiencia from "./FormularioNuevaAudiencia";

export default function BotonNuevaAudiencia({
  usuarios,
}: {
  usuarios: Usuario[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex cursor-pointer items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Nueva Audiencia"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nueva Audiencia
      </button>

      {showModal && (
        <FormularioNuevaAudiencia
          usuarios={usuarios}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
