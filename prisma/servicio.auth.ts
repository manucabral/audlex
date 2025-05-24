"use server";
import { prisma } from "./init";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = process.env
  .JWT_EXPIRES_IN as SignOptions["expiresIn"];

export type Sesion = {
  _id: number;
  nombre: string;
  nivel: number;
};

export async function verificarCredenciales(
  nombre: string,
  clave: string
): Promise<
  { exito: false; mensaje: string } | { exito: true; usuario: Sesion }
> {
  const usuario = await prisma.usuarios.findUnique({ where: { nombre } });
  if (!usuario) return { exito: false, mensaje: "Usuario desconocido" };
  const coincidencia = await bcrypt.compare(clave, usuario.hash);
  if (!coincidencia) return { exito: false, mensaje: "Clave incorrecta" };
  return {
    exito: true,
    usuario: {
      _id: usuario.id,
      nombre: usuario.nombre,
      nivel: usuario.nivel,
    },
  };
}

export async function intentarLogin(
  nombre: string,
  clave: string
): Promise<{ exito: boolean; mensaje?: string }> {
  const resultado = await verificarCredenciales(nombre, clave);
  if (!resultado.exito) return { exito: false, mensaje: resultado.mensaje };
  const token = jwt.sign({ ...resultado.usuario }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return { exito: true };
}

export async function obtenerSesion(): Promise<Sesion | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const datos = jwt.verify(token, JWT_SECRET) as Sesion;
    return {
      _id: datos._id,
      nombre: datos.nombre,
      nivel: datos.nivel,
    };
  } catch {
    return null;
  }
}
