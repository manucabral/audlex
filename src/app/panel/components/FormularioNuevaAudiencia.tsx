"use client";

import type React from "react";
import type { Testigo } from "../../../../prisma/servicio.testigos";
import type { Audiencia } from "../../../../prisma/servicio.audiencias";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import { startTransition, useState } from "react";
import { intentarCrearNuevaAudiencia, intentarCrearTestigo } from "../actions";
import toast from "react-hot-toast";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  User,
  Building,
  Users,
  FileText,
  Info,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

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
  const [horaString, setHoraString] = useState<string>("09:00");

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
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) {
        setFormData((prev) => ({ ...prev, fecha: newDate }));
      }
    } else if (name === "hora") {
      setHoraString(value);
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
    toast.success("Testigo agregado correctamente");
  };

  const removeTestigo = (index: number) => {
    setTestigos((prev) => prev.filter((_, i) => i !== index));
    toast.success("Testigo eliminado");
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
        const formDataToSubmit = {
          ...formData,
          hora: horaString,
        };

        const { exito, informacion, mensaje } =
          await intentarCrearNuevaAudiencia(formDataToSubmit);
        if (!exito) throw new Error(mensaje);

        for (const t of testigos) {
          const { exito: exitoTestigo, mensaje: mensajeTestigo } =
            await intentarCrearTestigo({
              ...t,
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
      return new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  const isTestigoFormValid =
    currentTestigo.nombre && currentTestigo.apellido && currentTestigo.celular;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Nueva Audiencia</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Información General */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                <Info className="h-5 w-5" />
                Información General
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Carátula */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carátula <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caratula"
                    value={formData.caratula}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingrese la carátula del caso"
                    required
                  />
                </div>

                {/* Demandado */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demandado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="demandado"
                    value={formData.demandado}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nombre del demandado"
                    required
                  />
                </div>

                {/* Usuario Asignado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4" />
                    Usuario Asignado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="usuarioId"
                    value={selectedUsuarioId || ""}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

                {/* Juzgado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4" />
                    Juzgado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="juzgado"
                    value={formData.juzgado}
                    onChange={handleAudienciaChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidad <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="semipresencial">Semipresencial</option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="vigente">Vigente</option>
                    <option value="terminado">Terminado</option>
                    <option value="reprogramado">Reprogramado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Programación */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                <Calendar className="h-5 w-5" />
                Programación
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formatDateForInput(formData.fecha)}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Hora */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4" />
                    Hora <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={horaString}
                    onChange={handleAudienciaChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                <FileText className="h-5 w-5" />
                Descripción
              </div>

              <div className="space-y-6">
                {/* Información */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información adicional
                  </label>
                  <textarea
                    name="informacion"
                    value={formData.informacion || ""}
                    onChange={handleAudienciaChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Información adicional sobre la audiencia..."
                  />
                </div>

                {/* Detalles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalles
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles || ""}
                    onChange={handleAudienciaChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Detalles específicos del caso..."
                  />
                </div>
              </div>
            </div>

            {/* Testigos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                  <Users className="h-5 w-5" />
                  Testigos ({testigos.length}/6)
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {testigos.length >= 6 ? (
                    <span className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      Límite alcanzado
                    </span>
                  ) : (
                    <span className="text-gray-500">Opcional</span>
                  )}
                </div>
              </div>

              {/* Formulario para agregar testigo */}
              {testigos.length < 6 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-700">
                      Agregar nuevo testigo
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={currentTestigo.nombre}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nombre del testigo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={currentTestigo.apellido}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Apellido del testigo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={currentTestigo.email}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Celular <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="celular"
                        value={currentTestigo.celular}
                        onChange={handleTestigoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Número de celular"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="BR"
                          checked={currentTestigo.BR}
                          onChange={handleTestigoChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">BR</span>
                      </label>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="dificil"
                          checked={currentTestigo.dificil}
                          onChange={handleTestigoChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Difícil</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={addTestigo}
                      disabled={!isTestigoFormValid}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Testigo
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de testigos */}
              {testigos.length > 0 ? (
                <div className="space-y-3">
                  {testigos.map((testigo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-gray-900">
                            {testigo.nombre} {testigo.apellido}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {testigo.email} • {testigo.celular}
                        </div>
                        <div className="flex gap-2">
                          {testigo.BR && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                              BR
                            </span>
                          )}
                          {testigo.dificil && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                              Difícil
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestigo(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay testigos agregados</p>
                  <p className="text-sm">
                    Los testigos son opcionales para esta audiencia
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Crear Audiencia
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
