import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type FiltroAudiencia = {
  fechaDesde?: Date;
  fechaHasta?: Date;
  usuario?: string;
  testigo?: string;
  modalidad?: "virtual" | "semipresencial" | "presencial";
  estado?: "terminado" | "vigente" | "reprogramado";
  demandado?: string;
  caratula?: string;
  juzgado?: number;
};

async function obtenerAudiencias(filtros: FiltroAudiencia) {
  const clauses: Prisma.Sql[] = [Prisma.sql`1 = 1`];
  if (filtros.fechaDesde)
    clauses.push(Prisma.sql`a.fecha >= ${filtros.fechaDesde}`);
  if (filtros.fechaHasta)
    clauses.push(Prisma.sql`a.fecha <= ${filtros.fechaHasta}`);
  if (filtros.usuario)
    clauses.push(Prisma.sql`u.nombre LIKE ${`%${filtros.usuario}%`}`);
  if (filtros.testigo)
    clauses.push(Prisma.sql`t.testigo LIKE ${`%${filtros.testigo}%`}`);
  if (filtros.modalidad)
    clauses.push(Prisma.sql`a.modalidad = ${filtros.modalidad}`);
  if (filtros.estado) clauses.push(Prisma.sql`a.estado = ${filtros.estado}`);
  if (filtros.demandado)
    clauses.push(Prisma.sql`a.demandado LIKE ${`%${filtros.demandado}%`}`);
  if (filtros.caratula)
    clauses.push(Prisma.sql`a.caratula LIKE ${`%${filtros.caratula}%`}`);
  if (filtros.juzgado !== undefined)
    clauses.push(Prisma.sql`a.juzgado = ${filtros.juzgado}`);
  const query = Prisma.sql`
    SELECT
      a.id,
      a.caratula,
      a.fecha,
      u.nombre AS usuario,
      a.modalidad,
      a.estado,
      a.demandado,
      a.juzgado,
      a.detalles,
      a.informacion
    FROM audiencias a
    LEFT JOIN usuarios u ON a.usuarioId = u.id
    LEFT JOIN testigos t ON t.audienciaId = a.id
    WHERE ${Prisma.join(clauses, " AND ")}
    ORDER BY a.fecha ASC
  `;
  try {
    return await prisma.$queryRaw<typeof query>(query);
  } catch (error) {
    console.error("Al obtener audiencias:", error);
    throw new Error("Error al obtener audiencias");
  }
}

export { obtenerAudiencias };
