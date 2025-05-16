"use client";

import type React from "react";
import { useState } from "react";

interface Testigo {
  id: string;
  nombre: string;
  esBR: boolean;
  telefono: string;
}

export default function FormularioNuevaAudiencia({
  onClose,
}: {
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    caratula: "",
    fecha: "",
    hora: "",
    modalidad: "virtual",
    estado: "vigente",
    demandado: "",
    juzgado: "",
    detalles: "",
    informacion: "",
  });

  const [testigos, setTestigos] = useState<Testigo[]>([
    { id: "1", nombre: "", esBR: false, telefono: "" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestigoChange = (
    id: string,
    field: keyof Testigo,
    value: string | boolean
  ) => {
    setTestigos((prev) =>
      prev.map((testigo) =>
        testigo.id === id ? { ...testigo, [field]: value } : testigo
      )
    );
  };

  const addTestigo = () => {
    if (testigos.length < 6) {
      setTestigos((prev) => [
        ...prev,
        { id: Date.now().toString(), nombre: "", esBR: false, telefono: "" },
      ]);
    }
  };

  const removeTestigo = (id: string) => {
    if (testigos.length > 1) {
      setTestigos((prev) => prev.filter((testigo) => testigo.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...form,
      testigos: testigos
        .filter((t) => t.nombre.trim() !== "")
        .map((t) => ({
          nombre: t.nombre,
          esBR: t.esBR,
          telefono: t.telefono,
        })),
    };
    console.log("Datos de nueva audiencia:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nueva Audiencia
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label
                htmlFor="caratula"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Carátula <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="caratula"
                name="caratula"
                required
                value={form.caratula}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese la carátula de la audiencia"
              />
            </div>

            <div>
              <label
                htmlFor="fecha"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                required
                value={form.fecha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="hora"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="hora"
                name="hora"
                required
                value={form.hora}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="modalidad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Modalidad <span className="text-red-500">*</span>
              </label>
              <select
                id="modalidad"
                name="modalidad"
                required
                value={form.modalidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="virtual">Virtual</option>
                <option value="presencial">Presencial</option>
                <option value="semipresencial">Semipresencial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                required
                value={form.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="vigente">Vigente</option>
                <option value="terminado">Terminado</option>
                <option value="reprogramado">Reprogramado</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="demandado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Demandado <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="demandado"
                name="demandado"
                required
                value={form.demandado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del demandado"
              />
            </div>

            <div>
              <label
                htmlFor="juzgado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Juzgado <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="juzgado"
                name="juzgado"
                required
                value={form.juzgado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número de juzgado"
              />
            </div>

            <div className="col-span-full">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Testigos{" "}
                  <span className="text-gray-400 text-xs">
                    ({testigos.length}/6)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={addTestigo}
                  disabled={testigos.length >= 6}
                  className={`text-xs px-2 py-1 rounded ${
                    testigos.length >= 6
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  + Agregar testigo
                </button>
              </div>

              <div className="space-y-4">
                {testigos.map((testigo, index) => (
                  <div
                    key={testigo.id}
                    className="p-4 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Testigo {index + 1}
                      </h3>
                      {testigos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestigo(testigo.id)}
                          className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                          aria-label="Eliminar testigo"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
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
                            value={testigo.nombre}
                            onChange={(e) =>
                              handleTestigoChange(
                                testigo.id,
                                "nombre",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Nombre del testigo ${index + 1}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            value={testigo.telefono}
                            onChange={(e) =>
                              handleTestigoChange(
                                testigo.id,
                                "telefono",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Número de teléfono"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center h-full">
                          <input
                            type="checkbox"
                            id={`br-${testigo.id}`}
                            checked={testigo.esBR}
                            onChange={(e) =>
                              handleTestigoChange(
                                testigo.id,
                                "esBR",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`br-${testigo.id}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Es BR
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="detalles"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Detalles
              </label>
              <textarea
                id="detalles"
                name="detalles"
                rows={3}
                value={form.detalles}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detalles de la audiencia"
              ></textarea>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="informacion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Información adicional
              </label>
              <textarea
                id="informacion"
                name="informacion"
                rows={3}
                value={form.informacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Información adicional relevante"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              Cancelar
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar Audiencia
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
