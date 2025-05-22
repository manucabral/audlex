"use client";

import type React from "react";
import type { Testigo } from "../../../../prisma/servicio.testigos";
import type { Audiencia } from "../../../../prisma/servicio.audiencias";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import { startTransition, useState } from "react";
import { intentarCrearNuevaAudiencia, intentarCrearTestigo } from "../actions";
import toast from "react-hot-toast";
import { X, Plus, Trash2 } from "lucide-react";

type FormAudiencia = Omit<Audiencia, "id">;

type TestigoForm = Omit<Testigo, "id" | "audienciaId">;

export default function FormularioNuevaAudiencia({
  onClose,
  usuarios,
}: {
  onClose: () => void;
  usuarios: Usuario[];
}) {
  const [loading, setLoading] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<number | null>(
    null
  );

  // Estado para el formulario de audiencia
  const [formData, setFormData] = useState<FormAudiencia>({
    caratula: "",
    demandado: "",
    fecha: new Date(),
    hora: new Date(),
    juzgado: 1,
    usuarioId: 0,
    modalidad: "presencial",
    estado: "vigente",
    detalles: "",
    informacion: "",
  });

  // Estado para almacenar la hora como string (HH:MM)
  const [horaString, setHoraString] = useState<string>("00:00");

  // Estado para los testigos
  const [testigos, setTestigos] = useState<TestigoForm[]>([]);
  const [currentTestigo, setCurrentTestigo] = useState<TestigoForm>({
    nombre: "",
    apellido: "",
    email: "",
    BR: false,
    celular: "",
    dificil: false,
  });

  const handleAudienciaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "fecha") {
      // Para la fecha, creamos un nuevo objeto Date a partir del valor del input
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setFormData((prev) => ({ ...prev, fecha: newDate }));
      }
    } else if (name === "hora") {
      // Guardamos la hora como string para enviarla al servidor
      setHoraString(value);

      // También actualizamos el objeto Date para mantener la consistencia interna
      const [hours, minutes] = value.split(":").map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes, 0, 0);
      setFormData((prev) => ({ ...prev, hora: newDate }));
    } else if (name === "juzgado") {
      setFormData((prev) => ({ ...prev, juzgado: Number(value) }));
    } else if (name === "usuarioId") {
      const userId = Number(value);
      setSelectedUsuarioId(userId);
      setFormData((prev) => ({ ...prev, usuarioId: userId }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTestigoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentTestigo((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCurrentTestigo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addTestigo = () => {
    if (
      !currentTestigo.nombre ||
      !currentTestigo.apellido ||
      !currentTestigo.celular
    ) {
      toast.error("Por favor complete los campos obligatorios del testigo");
      return;
    }

    if (testigos.length >= 6) {
      toast.error("No se pueden agregar más de 6 testigos");
      return;
    }

    setTestigos((prev) => [...prev, { ...currentTestigo }]);
    setCurrentTestigo({
      nombre: "",
      apellido: "",
      email: "",
      BR: false,
      celular: "",
      dificil: false,
    });
  };

  const removeTestigo = (index: number) => {
    setTestigos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caratula || !formData.demandado || !selectedUsuarioId) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    setLoading(true);

    startTransition(async () => {
      try {
        // Crear una copia del formData para modificar la hora
        const formDataToSubmit = {
          ...formData,
          // Enviamos la hora como string en formato HH:MM
          hora: horaString,
        };

        const { exito, informacion, mensaje } =
          await intentarCrearNuevaAudiencia(formDataToSubmit);
        if (!exito) throw new Error(mensaje);

        for (const t of testigos) {
          const { exito: exitoTestigo, mensaje: mensajeTestigo } =
            await intentarCrearTestigo({
              ...t, // excluyendo obviamente el id.
              audienciaId: informacion,
            });
          if (!exitoTestigo) throw new Error(mensajeTestigo);
        }

        toast.success("Nueva audiencia creada con éxito", {
          position: "top-center",
        });
        onClose();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado."
        );
      } finally {
        setLoading(false);
      }
    });
  };

  const formatDateForInput = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return new Date().toISOString().split("T")[0]; // Valor por defecto si la fecha es inválida
    }
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-700">
            Nueva Audiencia
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Sección de datos de audiencia */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-blue-700 mb-4">
                Datos de la Audiencia
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carátula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caratula"
                    value={formData.caratula}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demandado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="demandado"
                    value={formData.demandado}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario Asignado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="usuarioId"
                    value={selectedUsuarioId || ""}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Juzgado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="juzgado"
                    value={formData.juzgado}
                    onChange={handleAudienciaChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formatDateForInput(formData.fecha)}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={horaString}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modalidad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="semipresencial">Semipresencial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleAudienciaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="vigente">Vigente</option>
                    <option value="terminado">Terminado</option>
                    <option value="reprogramado">Reprogramado</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Información adicional
                  </label>
                  <textarea
                    name="informacion"
                    value={formData.informacion || ""}
                    onChange={handleAudienciaChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detalles
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles || ""}
                    onChange={handleAudienciaChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Sección de testigos */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-blue-700">
                  Testigos ({testigos.length}/6)
                </h3>
                <span className="text-sm text-gray-500">
                  {testigos.length >= 6 ? "Límite alcanzado" : "Opcional"}
                </span>
              </div>

              {/* Formulario para agregar testigo */}
              {testigos.length < 6 && (
                <div className="bg-white p-4 rounded-md border border-gray-200 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Agregar nuevo testigo
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={currentTestigo.nombre}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={currentTestigo.apellido}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentTestigo.email}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Celular
                      </label>
                      <input
                        type="tel"
                        name="celular"
                        value={currentTestigo.celular}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="BR"
                          name="BR"
                          checked={currentTestigo.BR}
                          onChange={handleTestigoChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="BR"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          BR
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="dificil"
                          name="dificil"
                          checked={currentTestigo.dificil}
                          onChange={handleTestigoChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="dificil"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Difícil
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={addTestigo}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Testigo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de testigos */}
              {testigos.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {testigos.map((testigo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-200"
                    >
                      <div>
                        <div className="font-medium">
                          {testigo.nombre} {testigo.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testigo.email}
                        </div>
                        <div className="flex space-x-2 mt-1">
                          {testigo.BR && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                              BR
                            </span>
                          )}
                          {testigo.dificil && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                              Difícil
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestigo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No hay testigos agregados
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                "Guardar Audiencia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
