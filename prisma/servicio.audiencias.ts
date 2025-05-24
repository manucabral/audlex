import { Prisma } from "@prisma/client";
import { obtenerUsuarioPorNombre } from "./servicio.usuarios";
import type { Testigo, TestigoModificado } from "./servicio.testigos";
import { prisma } from "./init";

type AudienciaBase = {
  usuario: string;
  caratula: string;
  modalidad: "virtual" | "semipresencial" | "presencial";
  estado: "vigente" | "terminado" | "reprogramado";
  demandado: string;
  juzgado: number;
};

export type FiltroAudiencia = Partial<AudienciaBase> & {
  fechaDesde?: Date;
  fechaHasta?: Date;
  testigo?: string;
};

export type Audiencia = {
  id?: number;
  caratula: string;
  demandado: string;
  fecha: Date;
  hora: Date | string;
  juzgado: number;
  usuarioId: number;
  modalidad: "virtual" | "semipresencial" | "presencial";
  estado: "vigente" | "terminado" | "reprogramado";
  detalles?: string;
  informacion?: string;
};

export type AudienciaModificada = {
  id?: number;
  caratula: string;
  demandado: string;
  fecha: Date | string;
  hora: Date | string;
  juzgado: number;
  usuarioId: number;
  modalidad: "virtual" | "semipresencial" | "presencial";
  estado: "vigente" | "terminado" | "reprogramado";
  detalles: string;
  informacion: string;
  testigos?: TestigoModificado[] | Testigo[];
  testigosModificados?: boolean;
};

async function obtenerAudiencias(filtros: FiltroAudiencia) {
  const whereClauses: Prisma.audienciasWhereInput[] = [];

  if (filtros.usuario) {
    const { id } = await obtenerUsuarioPorNombre(filtros.usuario);
    whereClauses.push({ usuarioId: id });
  }

  if (filtros.fechaDesde || filtros.fechaHasta) {
    whereClauses.push({
      fecha: {
        ...(filtros.fechaDesde && { gte: filtros.fechaDesde }),
        ...(filtros.fechaHasta && { lte: filtros.fechaHasta }),
      },
    });
  }
  if (filtros.modalidad) {
    whereClauses.push({ modalidad: filtros.modalidad });
  }
  if (filtros.estado) {
    whereClauses.push({ estado: filtros.estado });
  }
  if (filtros.demandado) {
    whereClauses.push({ demandado: { contains: filtros.demandado } });
  }
  if (filtros.caratula) {
    whereClauses.push({ caratula: { contains: filtros.caratula } });
  }
  if (typeof filtros.juzgado === "number") {
    whereClauses.push({ juzgado: filtros.juzgado });
  }
  try {
    const data = await prisma.audiencias.findMany({
      where: { AND: whereClauses },
      orderBy: { fecha: "asc" },
    });
    return data;
  } catch (error) {
    console.error("Al obtener audiencias:", error);
    throw new Error("Error al obtener audiencias");
  }
}

async function crearNuevaAudiencia(datos: Audiencia) {
  try {
    const nuevafecha = new Date(datos.fecha);
    const isoString = `1970-01-01T${datos.hora}:00.000Z`;
    const nuevo = await prisma.audiencias.create({
      data: {
        usuarioId: datos.usuarioId,
        caratula: datos.caratula,
        fecha: nuevafecha,
        hora: new Date(isoString),
        modalidad: datos.modalidad,
        estado: datos.estado,
        demandado: datos.demandado,
        detalles: datos.detalles,
        informacion: datos.informacion,
        juzgado: datos.juzgado,
      },
      select: { id: true },
    });
    return nuevo.id;
  } catch (error) {
    console.error("Error al crear nueva audiencia:", error);
    throw new Error("Error al crear nueva audiencia");
  }
}

async function editarAudiencia(id: number, datos: AudienciaModificada) {
  try {
    const nuevafecha = new Date(datos.fecha);
    const isoString = `1970-01-01T${datos.hora}:00.000Z`;
    const nuevo = await prisma.audiencias.update({
      where: { id },
      data: {
        usuarioId: Number(datos.usuarioId),
        caratula: datos.caratula,
        fecha: nuevafecha,
        hora: new Date(isoString),
        modalidad: datos.modalidad,
        estado: datos.estado,
        demandado: datos.demandado,
        detalles: datos.detalles,
        informacion: datos.informacion,
        juzgado: datos.juzgado,
      },
    });
    return nuevo;
  } catch (error) {
    console.error("Error al editar audiencia:", error);
  }
}

async function eliminarAudiencia(id: number) {
  try {
    const nuevo = await prisma.audiencias.delete({
      where: { id },
    });
    return nuevo;
  } catch (error) {
    console.error("Error al eliminar audiencia:", error);
    throw new Error("Error al eliminar audiencia");
  }
}

export {
  obtenerAudiencias,
  crearNuevaAudiencia,
  editarAudiencia,
  eliminarAudiencia,
};
