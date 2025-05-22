import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  obtenerUsuarios,
  type Usuario,
} from "../../../prisma/servicio.usuarios";
import {
  obtenerTestigosAudiencia,
  type Testigo,
} from "../../../prisma/servicio.testigos";
import {
  obtenerAudiencias,
  type FiltroAudiencia,
  type Audiencia,
} from "../../../prisma/servicio.audiencias";
import { obtenerSesion, type Sesion } from "../../../prisma/servicio.auth";
import FormularioFiltros from "./components/FormularioFiltros";
import BotonNuevaAudiencia from "./components/BotonNuevaAudiencia";
import CerrarSesionButton from "./components/BotonCerrarSesion";
import ListaAudiencias from "./components/ListaAudiencias";
import { obtenerFechaCorrecta, obtenerHoraCorrecta } from "@/utils/date";

export const metadata: Metadata = {
  title: "Panel de Control",
  description: "Gestión de audiencias y testimonios judiciales.",
};

export type AudienciaDTO = Omit<
  Audiencia,
  "fecha" | "hora" | "detalles" | "informacion"
> & {
  fecha: string;
  hora: string;
  detalles: string | null;
  informacion: string | null;
  testigos: Testigo[];
};

export default async function PanelPage({
  searchParams,
}: {
  searchParams: Promise<Partial<Record<keyof FiltroAudiencia, string>>>;
}) {
  const allParams = await searchParams;
  const {
    fechaDesde,
    fechaHasta,
    usuario,
    testigo,
    modalidad,
    estado,
    demandado,
    caratula,
    juzgado,
  } = allParams;

  const sesion: Sesion | null = await obtenerSesion();
  if (!sesion) redirect("/");

  const filtros: FiltroAudiencia = {
    fechaDesde: fechaDesde ? new Date(fechaDesde) : undefined,
    fechaHasta: fechaHasta ? new Date(fechaHasta) : undefined,
    usuario,
    testigo,
    modalidad: modalidad as FiltroAudiencia["modalidad"],
    estado: estado as FiltroAudiencia["estado"],
    demandado,
    caratula,
    juzgado: juzgado ? Number(juzgado) : undefined,
  };

  const audienciasRaw = await obtenerAudiencias(filtros);
  const usuarios: Usuario[] = await obtenerUsuarios();

  const audienciasMap: AudienciaDTO[] = [];
  for (const a of audienciasRaw) {
    const testigos = await obtenerTestigosAudiencia(a.id);
    audienciasMap.push({
      ...a,
      fecha: obtenerFechaCorrecta(new Date(a.fecha)),
      hora: obtenerHoraCorrecta(new Date(a.hora)),
      testigos,
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">
                Panel de Control
              </h1>
              <p className="mt-1 text-gray-600">
                Hola, <span className="font-medium">{sesion.nombre}</span>.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <BotonNuevaAudiencia usuarios={usuarios} />
              <CerrarSesionButton />
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Exportar
              </button>
            </div>
          </div>
        </div>
        <FormularioFiltros initial={allParams} />
        <div className="mt-6">
          <ListaAudiencias
            audiencias={audienciasMap}
            usuarios={usuarios}
            sesion={sesion}
          />
        </div>
      </div>
    </main>
  );
}
