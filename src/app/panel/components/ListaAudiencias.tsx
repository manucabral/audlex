"use client";

import React, { useState } from "react";
import type { Audiencia } from "../../../../prisma/servicio.audiencias";

export default function ListaAudiencias({ data }: { data: Audiencia[] }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-blue-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 text-lg">
          No se encontraron audiencias con los filtros aplicados.
        </p>
        <button
          onClick={() => (window.location.href = "/panel")}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "vigente":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Vigente
          </span>
        );
      case "terminado":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Terminado
          </span>
        );
      case "reprogramado":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            Reprogramado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  const getModalidadBadge = (modalidad: string) => {
    switch (modalidad) {
      case "virtual":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Virtual
          </span>
        );
      case "presencial":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            Presencial
          </span>
        );
      case "semipresencial":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
            Semipresencial
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {modalidad}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Listado de Audiencias
        </h2>
        <p className="text-blue-600 mt-1">
          {data.length} audiencias encontradas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Carátula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modalidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demandado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Juzgado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((a) => (
              <React.Fragment key={a.id}>
                <tr
                  className={`hover:bg-blue-50 ${
                    expandedRow === a.id ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDate(a.fecha).split(",")[0]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(a.fecha).split(",")[1]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="max-w-xs truncate" title={a.caratula}>
                      {a.caratula}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        {a.usuario ? a.usuario.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="ml-3">{a.usuario || "Sin asignar"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getModalidadBadge(a.modalidad)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(a.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate" title={a.demandado}>
                      {a.demandado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {a.juzgado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleRow(a.id)}
                      className={`text-blue-600 hover:text-blue-900 flex items-center ${
                        !a.detalles && !a.informacion
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!a.detalles && !a.informacion}
                    >
                      {expandedRow === a.id ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          Ocultar
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                          Detalles
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {expandedRow === a.id && (a.detalles || a.informacion) && (
                  <tr className="bg-blue-50">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {a.detalles && (
                          <div className="mb-3">
                            <h4 className="font-medium text-blue-700 mb-1">
                              Detalles:
                            </h4>
                            <p className="ml-4">{a.detalles}</p>
                          </div>
                        )}
                        {a.informacion && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-1">
                              Información adicional:
                            </h4>
                            <p className="ml-4">{a.informacion}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
