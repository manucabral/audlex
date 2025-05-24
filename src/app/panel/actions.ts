"use server";
import { cookies } from "next/headers";
import {
  crearNuevoTestigo,
  editarTestigo,
  type Testigo,
} from "../../../prisma/servicio.testigos";
import {
  crearNuevaAudiencia,
  editarAudiencia,
  eliminarAudiencia,
  type Audiencia,
  type AudienciaModificada,
} from "../../../prisma/servicio.audiencias";

export async function cerrarSesion(): Promise<{ exito: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { exito: true };
  } catch {
    return { exito: false };
  }
}

export async function intentarCrearTestigo(datos: Omit<Testigo, "id">) {
  try {
    const nuevo = await crearNuevoTestigo(datos);
    return { exito: true, mensaje: `Testigo creado con éxito ${nuevo}` };
  } catch (error) {
    if (error instanceof Error) return { exito: false, mensaje: error.message };
    return { exito: false, mensaje: "Error al intentar crear testigo" };
  }
}

export async function intentarCrearNuevaAudiencia(datos: Audiencia) {
  try {
    console.log("Datos de la nueva audiencia:", datos);
    const nuevo = await crearNuevaAudiencia(datos);
    return {
      exito: true,
      mensaje: `Nueva audiencia creada con éxito ${nuevo}`,
      informacion: nuevo,
    };
  } catch (error) {
    if (error instanceof Error) return { exito: false, mensaje: error.message };
    return { exito: false, mensaje: "Error al intentar crear audiencia" };
  }
}

export async function intentarActualizarAudiencia(datos: AudienciaModificada) {
  try {
    if (!datos.id)
      return { exito: false, mensaje: "ID de audiencia no proporcionado" };
    if (datos.testigosModificados && datos.testigos)
      for (const testigo of datos.testigos)
        if ("modificado" in testigo && testigo.modificado)
          await editarTestigo(testigo.id, testigo);
    const nuevo = await editarAudiencia(datos.id, datos);
    return {
      exito: true,
      mensaje: `Audiencia actualizada con éxito ${nuevo}`,
      informacion: nuevo,
    };
  } catch (error) {
    if (error instanceof Error) return { exito: false, mensaje: error.message };
    return { exito: false, mensaje: "Error al intentar actualizar audiencia" };
  }
}

export async function intentarEliminarAudiencia(id: number) {
  try {
    const resultado = await eliminarAudiencia(id);
    if (!resultado)
      return { exito: false, mensaje: "Error al eliminar audiencia" };
    return { exito: true, mensaje: "Audiencia eliminada con éxito" };
  } catch (error) {
    if (error instanceof Error) return { exito: false, mensaje: error.message };
    return { exito: false, mensaje: "Error al intentar eliminar audiencia" };
  }
}
