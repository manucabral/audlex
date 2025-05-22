import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Testigo = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  BR: boolean;
  celular: string;
  audienciaId?: number;
  dificil: boolean;
};

async function crearNuevoTestigo(datos: Omit<Testigo, "id">): Promise<number> {
  try {
    const nuevo = await prisma.testigos.create({
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        BR: datos.BR,
        celular: datos.celular,
        dificil: datos.dificil,
        audienciaId: datos.audienciaId || 0,
      },
      select: { id: true },
    });
    return nuevo.id;
  } catch (error) {
    console.error("Error al crear nuevo testigo:", error);
    throw new Error("Error al crear nuevo testigo");
  }
}

async function obtenerTestigosAudiencia(id: number) {
  try {
    const data = await prisma.testigos.findMany({
      where: { audienciaId: id },
    });
    return data;
  } catch (error) {
    console.error("Error al obtener testigos de una audiencia:", error);
    throw new Error("Error al obtener testigos de una audiencia");
  }
  return [];
}

export { crearNuevoTestigo, obtenerTestigosAudiencia };
