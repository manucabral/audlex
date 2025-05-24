import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  obtenerUsuarios,
  type Usuario,
} from "../../../prisma/servicio.usuarios";
import {
  obtenerTestigosAudiencia,
  type TestigoModificado,
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
import BotonExportar from "./components/BotonExportar";
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
  testigos: Testigo[] | TestigoModificado[];
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

  let audienciasMap: AudienciaDTO[] = [];
  for (const a of audienciasRaw) {
    const testigos = await obtenerTestigosAudiencia(a.id);
    audienciasMap.push({
      ...a,
      fecha: obtenerFechaCorrecta(new Date(a.fecha)),
      hora: obtenerHoraCorrecta(new Date(a.hora)),
      testigos,
    });
  }

  if (filtros.testigo) {
    const aBuscarTestigo = filtros.testigo.toLowerCase();
    audienciasMap = audienciasMap.filter((a) =>
      a.testigos.some(
        (t) =>
          t.nombre.toLowerCase().includes(aBuscarTestigo) ||
          t.apellido.toLowerCase().includes(aBuscarTestigo)
      )
    );
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
              {sesion.nivel > 1 && <BotonNuevaAudiencia usuarios={usuarios} />}
              <CerrarSesionButton />
              <BotonExportar audiencias={audienciasMap} usuarios={usuarios} />
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
