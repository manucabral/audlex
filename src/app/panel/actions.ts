"use server";
import { cookies } from "next/headers";

export async function cerrarSesion(): Promise<{ exito: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { exito: true };
  } catch {
    return { exito: false };
  }
}
