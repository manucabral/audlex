"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useRef, useEffect } from "react";

interface InitialFilters {
  [key: string]: string | undefined;
}

export default function FormularioDeFiltros({
  initial,
}: {
  initial: InitialFilters;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const [form, setForm] = useState<InitialFilters>({
    fechaDesde: initial.fechaDesde || "",
    fechaHasta: initial.fechaHasta || "",
    usuario: initial.usuario || "",
    testigo: initial.testigo || "",
    modalidad: initial.modalidad || "",
    estado: initial.estado || "",
    demandado: initial.demandado || "",
    caratula: initial.caratula || "",
    juzgado: initial.juzgado || "",
  });

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.position = "absolute";
      contentRef.current.style.visibility = "hidden";
      contentRef.current.style.display = "block";
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      contentRef.current.style.position = "";
      contentRef.current.style.visibility = "";
      contentRef.current.style.display = "";
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`/panel?${params.toString()}`);
    setIsOpen(false);
  };

  const resetForm = () => {
    setForm({
      fechaDesde: "",
      fechaHasta: "",
      usuario: "",
      testigo: "",
      modalidad: "",
      estado: "",
      demandado: "",
      caratula: "",
      juzgado: "",
    });
    router.push("/panel");
  };

  const hasActiveFilters = Object.values(form).some((value) => value !== "");

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-blue-700">
            Filtros de Audiencias
            {hasActiveFilters && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                Filtros activos
              </span>
            )}
          </h2>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-blue-700 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
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
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen
            ? contentHeight
              ? `${contentHeight}px`
              : "2000px"
            : "0",
        }}
      >
        <div className="p-6 border-t border-gray-200">
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4"
          >
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Fecha desde
              </label>
              <input
                type="date"
                value={form.fechaDesde}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fechaDesde: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Fecha hasta
              </label>
              <input
                type="date"
                value={form.fechaHasta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fechaHasta: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Nombre usuario"
                  value={form.usuario}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, usuario: e.target.value }))
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Testigo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Testigo"
                  value={form.testigo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, testigo: e.target.value }))
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Modalidad
              </label>
              <select
                value={form.modalidad}
                onChange={(e) =>
                  setForm((f) => ({ ...f, modalidad: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todas</option>
                <option value="virtual">Virtual</option>
                <option value="semipresencial">Semipresencial</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estado: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todos</option>
                <option value="vigente">Vigente</option>
                <option value="terminado">Terminado</option>
                <option value="reprogramado">Reprogramado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Demandado
              </label>
              <input
                type="text"
                placeholder="Demandado"
                value={form.demandado}
                onChange={(e) =>
                  setForm((f) => ({ ...f, demandado: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Carátula
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Carátula"
                  value={form.caratula}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, caratula: e.target.value }))
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Juzgado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
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
                </div>
                <input
                  type="number"
                  placeholder="Nº Juzgado"
                  value={form.juzgado}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, juzgado: e.target.value }))
                  }
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="col-span-full flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                Limpiar filtros
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Aplicar filtros
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
