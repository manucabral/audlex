"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Users,
  Trash2,
  Calendar,
  Building2,
  User,
  Info,
  FileText,
  Gavel,
} from "lucide-react";
import type { AudienciaDTO } from "../page";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import type { Sesion } from "../../../../prisma/servicio.auth";
import { intentarEliminarAudiencia } from "../actions";
import toast from "react-hot-toast";

export default function ListaAudiencias({
  audiencias,
  usuarios,
  sesion,
}: {
  audiencias: AudienciaDTO[];
  usuarios: Usuario[];
  sesion: Sesion;
}) {
  const router = useRouter();
  const [sortField, setSortField] = useState<keyof AudienciaDTO>("fecha");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filtrar audiencias según el nivel de usuario
  const audienciasFiltradas =
    sesion.nivel > 1
      ? audiencias
      : audiencias.filter((a) => a.usuarioId === sesion._id);

  const eliminarAudiencia = async (id: number) => {
    try {
      const { exito, mensaje } = await intentarEliminarAudiencia(id);
      if (!exito) throw new Error(mensaje);
      toast.success(mensaje);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  const handleSort = (field: keyof AudienciaDTO) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAudiencias = [...audienciasFiltradas].sort((a, b) => {
    if (sortField === "fecha") {
      const dateA = a.fecha.split("/").reverse().join("-");
      const dateB = b.fecha.split("/").reverse().join("-");
      return sortDirection === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    }

    if (sortField === "juzgado") {
      return sortDirection === "asc"
        ? a.juzgado - b.juzgado
        : b.juzgado - a.juzgado;
    }

    if (a[sortField] && b[sortField]) {
      const valueA = String(a[sortField]);
      const valueB = String(b[sortField]);
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return 0;
  });

  const obtenerNombreUsuario = (id: number) => {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? usuario.nombre : "Desconocido";
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "vigente":
        return "bg-green-100 text-green-800 border border-green-200";
      case "terminado":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "reprogramado":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border border-blue-200";
    }
  };

  const obtenerIconoModalidad = (modalidad: string) => {
    switch (modalidad) {
      case "virtual":
        return "🖥️";
      case "semipresencial":
        return "🔄";
      case "presencial":
        return "👥";
      default:
        return "❓";
    }
  };

  const toggleExpand = (id: number) =>
    setExpandedId(expandedId === id ? null : id);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-5 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center mb-2">
            <Gavel className="h-7 w-7 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-blue-700">
              Listado de Audiencias
            </h2>
          </div>
          <p className="text-base text-blue-600 pl-10">
            {sesion.nivel > 1
              ? "Mostrando todas las audiencias"
              : "Mostrando sus audiencias asignadas"}
          </p>
        </div>

        <div
          className={`overflow-x-auto ${
            expandedId !== null ? "bg-gray-600/30" : ""
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-base font-medium text-blue-700 uppercase tracking-wider cursor-pointer w-[15%]"
                  onClick={() => handleSort("fecha")}
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Fecha
                    {sortField === "fecha" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-5 w-5 ml-1 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 ml-1 text-blue-600" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-base font-medium text-blue-700 uppercase tracking-wider cursor-pointer w-[45%]"
                  onClick={() => handleSort("caratula")}
                >
                  <div className="flex items-center">
                    Carátula
                    {sortField === "caratula" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-5 w-5 ml-1 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 ml-1 text-blue-600" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-base font-medium text-blue-700 uppercase tracking-wider w-[15%]"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Asignado
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-base font-medium text-blue-700 uppercase tracking-wider cursor-pointer w-[15%]"
                  onClick={() => handleSort("modalidad")}
                >
                  <div className="flex items-center">
                    Modalidad
                    {sortField === "modalidad" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-5 w-5 ml-1 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 ml-1 text-blue-600" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-base font-medium text-blue-700 uppercase tracking-wider w-[10%]"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAudiencias.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-800 text-lg"
                  >
                    No se encontraron audiencias
                  </td>
                </tr>
              ) : (
                sortedAudiencias.map((audiencia) => (
                  <React.Fragment key={audiencia.id}>
                    <tr
                      key={audiencia.id}
                      onClick={() => toggleExpand(audiencia.id || 0)}
                      className={`transition-all duration-200 ease-in-out cursor-pointer border-b border-gray-300 ${
                        expandedId === audiencia.id
                          ? "bg-blue-50 border-l-4 border-blue-500 relative z-10 shadow-md"
                          : "hover:bg-blue-50/50 hover:shadow-md hover:translate-y-[-1px] border border-gray-200"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-lg font-bold text-gray-900">
                            {audiencia.fecha}
                          </div>
                          <div className="text-base text-gray-800">
                            {audiencia.hora}
                          </div>
                          <span
                            className={`mt-1 px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getEstadoColor(
                              audiencia.estado
                            )}`}
                          >
                            {audiencia.estado.charAt(0).toUpperCase() +
                              audiencia.estado.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-lg font-bold text-gray-900">
                            {audiencia.caratula}
                          </div>
                          <div className="text-base text-gray-800">
                            {audiencia.demandado}
                          </div>
                          <div className="flex items-center mt-1 text-base text-gray-800">
                            <Building2 className="h-5 w-5 mr-1" />
                            Juzgado {audiencia.juzgado}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-medium text-gray-900">
                          {obtenerNombreUsuario(audiencia.usuarioId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">
                              {obtenerIconoModalidad(audiencia.modalidad)}
                            </span>
                            <span className="text-base text-gray-800 capitalize">
                              {audiencia.modalidad}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-base text-gray-800">
                            <Users className="h-5 w-5 mr-1" />
                            <span className="font-medium">
                              {audiencia.testigos.length}
                            </span>
                            <span className="ml-1">
                              testigo
                              {audiencia.testigos.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center space-x-3">
                          {(sesion.nivel > 1 ||
                            audiencia.usuarioId === sesion._id) && (
                            <>
                              <Link
                                href={`/panel/audiencia/editar/${audiencia.id}`} // TODO:
                                className="text-gray-800 hover:text-blue-700 transition-colors"
                                title="Editar audiencia"
                              >
                                <Edit className="h-6 w-6" />
                              </Link>

                              {sesion.nivel > 1 && (
                                <button
                                  onClick={() =>
                                    eliminarAudiencia(audiencia.id as number)
                                  }
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Eliminar audiencia"
                                >
                                  <Trash2 className="h-6 w-6" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Detalles expandibles: información y testigos en la misma fila, detalles abajo */}
                    {expandedId === audiencia.id && (
                      <tr key={`details-${audiencia.id}`}>
                        <td
                          colSpan={5}
                          className="px-6 py-4 bg-white border-t-0 border-b border-blue-100 shadow-md relative z-20"
                        >
                          <div className="space-y-6">
                            {/* Primera fila: Información y Testigos */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Información de la audiencia */}
                              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                                <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
                                  <Info className="h-5 w-5 mr-2" />
                                  Información de la audiencia
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Carátula:
                                      </span>{" "}
                                      <span className="text-gray-900">
                                        {audiencia.caratula}
                                      </span>
                                    </p>
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Demandado:
                                      </span>{" "}
                                      <span className="text-gray-900">
                                        {audiencia.demandado}
                                      </span>
                                    </p>
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Juzgado:
                                      </span>{" "}
                                      <span className="text-gray-900">
                                        {audiencia.juzgado}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="space-y-3">
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Fecha y hora:
                                      </span>{" "}
                                      <span className="text-gray-900">
                                        {audiencia.fecha} - {audiencia.hora}
                                      </span>
                                    </p>
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Modalidad:
                                      </span>{" "}
                                      <span className="text-gray-900 capitalize">
                                        {audiencia.modalidad}
                                      </span>
                                    </p>
                                    <p className="text-base">
                                      <span className="font-medium text-blue-600">
                                        Asignado a:
                                      </span>{" "}
                                      <span className="text-gray-900">
                                        {obtenerNombreUsuario(
                                          audiencia.usuarioId
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                {audiencia.informacion && (
                                  <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-base text-gray-800">
                                      {audiencia.informacion}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Testigos */}
                              <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                                <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
                                  <Users className="h-5 w-5 mr-2" />
                                  Testigos ({audiencia.testigos.length})
                                </h3>
                                {audiencia.testigos.length > 0 ? (
                                  <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {audiencia.testigos.map((testigo) => (
                                      <li
                                        key={testigo.id}
                                        className="bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200"
                                      >
                                        <div className="text-base">
                                          {testigo.nombre}{" "}
                                          <span className="font-bold">
                                            {testigo.apellido}
                                          </span>
                                        </div>
                                        <div className="text-base text-gray-800">
                                          {testigo.email}
                                        </div>
                                        <div className="text-base text-gray-800">
                                          {testigo.celular}
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {testigo.BR && (
                                            <span className="px-2 py-0.5 text-sm rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                              Bajo Responsabilidad
                                            </span>
                                          )}
                                          {testigo.dificil && (
                                            <span className="px-2 py-0.5 text-sm rounded-full bg-red-100 text-red-800 border border-red-200">
                                              Difícil
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-base text-gray-500 italic">
                                      No hay testigos registrados
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Segunda fila: Detalles de la audiencia */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                              <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Detalles de la audiencia
                              </h3>
                              {audiencia.detalles ? (
                                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-base text-gray-800 whitespace-pre-line">
                                    {audiencia.detalles}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                  <p className="text-base text-gray-500 italic">
                                    No hay detalles disponibles
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
