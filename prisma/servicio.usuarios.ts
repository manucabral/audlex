import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type Usuario = {
  id: number;
  nombre: string;
  hash: string;
  nivel: number;
};

async function obtenerUsuarioPorNombre(nombre: string) {
  const usuario = await prisma.usuarios.findUnique({ where: { nombre } });
  if (!usuario) return { id: 0 };
  return usuario;
}

async function obtenerUsuarios() {
  const usuarios = await prisma.usuarios.findMany();
  return usuarios;
}

export { obtenerUsuarios, obtenerUsuarioPorNombre };
