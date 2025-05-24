"use client";

import { useState } from "react";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import type { AudienciaDTO } from "../page";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import toast from "react-hot-toast";

interface BotonExportarProps {
  audiencias: AudienciaDTO[];
  usuarios: Usuario[];
}

export default function BotonExportar({
  audiencias,
  usuarios,
}: BotonExportarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatearAudienciaParaExporte = (audiencia: AudienciaDTO): string => {
    const usuarioAsignado = usuarios.find((u) => u.id === audiencia.usuarioId);
    const nombreUsuario = usuarioAsignado
      ? usuarioAsignado.nombre
      : "SIN ASIGNAR";

    let contenido = "";
    contenido += `${audiencia.fecha}\n`;
    contenido += `${audiencia.hora} J${audiencia.juzgado} ${audiencia.caratula} ** ${nombreUsuario}\n\n`;
    if (audiencia.testigos && audiencia.testigos.length > 0) {
      audiencia.testigos.forEach((testigo, _) => {
        const marcadores = [];
        contenido += `${testigo.nombre} ${testigo.apellido}`;
        if (testigo.celular) contenido += `${testigo.celular}`;
        if (testigo.BR) marcadores.push("BR");
        if (testigo.dificil) marcadores.push("Difícil");
        const marcadoresTexto =
          marcadores.length > 0 ? ` (${marcadores.join(", ")})` : "";
        contenido += marcadoresTexto;
        contenido += "\n";
      });
    } else {
      contenido += "Sin testigos asignados\n";
    }
    contenido += `\n${audiencia.detalles}\n\n`;
    contenido += `${audiencia.informacion}\n`;
    contenido += "\n" + "=".repeat(80) + "\n\n";
    return contenido;
  };

  const exportarAudiencias = async () => {
    if (audiencias.length === 0) {
      toast.error("No hay audiencias para exportar");
      return;
    }

    setIsExporting(true);

    try {
      let contenidoCompleto = `REPORTE DE AUDIENCIAS\n`;
      contenidoCompleto += `Generado el: ${new Date().toLocaleString(
        "es-ES"
      )}\n`;
      contenidoCompleto += `Total de audiencias: ${audiencias.length}\n`;
      contenidoCompleto += "=".repeat(80) + "\n\n";
      audiencias.forEach((audiencia, index) => {
        contenidoCompleto += `AUDIENCIA ${index + 1}\n`;
        contenidoCompleto += formatearAudienciaParaExporte(audiencia);
      });

      const blob = new Blob([contenidoCompleto], {
        type: "text/plain;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fechaActual = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `audiencias_${fechaActual}.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(`${audiencias.length} audiencias exportadas correctamente`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar las audiencias");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportarAudiencias}
      disabled={isExporting || audiencias.length === 0}
      className="group relative inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      title={
        audiencias.length === 0
          ? "No hay audiencias para exportar"
          : `Exportar ${audiencias.length} audiencias`
      }
    >
      <div className="absolute inset-0 bg-gray-100 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />

      <div className="relative flex items-center justify-center">
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
        ) : audiencias.length === 0 ? (
          <FileText className="h-4 w-4 opacity-50" />
        ) : (
          <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform duration-200" />
        )}
      </div>

      <span className="flex items-center gap-1">
        {isExporting ? (
          "Exportando..."
        ) : audiencias.length === 0 ? (
          "Sin datos"
        ) : (
          <>
            Exportar
            <span className="hidden sm:inline">({audiencias.length})</span>
          </>
        )}
      </span>

      {!isExporting && audiencias.length > 0 && (
        <CheckCircle2 className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </button>
  );
}
