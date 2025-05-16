"use server";

import { intentarLogin } from "../../../prisma/servicio.auth";

export async function login(formData: FormData) {
  const nombre = formData.get("username") as string;
  const password = formData.get("password") as string;
  const result = await intentarLogin(nombre, password);
  if (!result.exito)
    return { exito: false, mensaje: result.mensaje || "Error al ingresar" };
  return { exito: true };
}
