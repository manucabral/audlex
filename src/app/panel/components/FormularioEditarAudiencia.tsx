"use client";

import type React from "react";
import { useState, startTransition } from "react";
import type { AudienciaDTO } from "../page";
import type { Usuario } from "../../../../prisma/servicio.usuarios";
import { intentarActualizarAudiencia } from "../actions";
import toast from "react-hot-toast";
import {
  X,
  Calendar,
  Clock,
  User,
  Building,
  Users,
  FileText,
  Info,
} from "lucide-react";

interface FormularioEditarProps {
  initialData: AudienciaDTO;
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}

export default function FormularioEditarAudiencia({
  initialData,
  usuarios,
  onClose,
  onSave,
}: FormularioEditarProps) {
  const fechaOriginal = initialData.fecha;
  const horaOriginal = initialData.hora;
  const [formData, setFormData] = useState<AudienciaDTO>({
    ...initialData,
    testigos: initialData.testigos.map((t) => ({ ...t, modificado: false })),
  });
  const [loading, setLoading] = useState(false);
  const [testigosModificados, setTestigosModificados] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "juzgado" ? Number(value) : value,
    }));
  };

  const handleTestigoChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const updatedTestigos = [...prev.testigos];
      updatedTestigos[idx] = {
        ...updatedTestigos[idx],
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        modificado: true,
      };
      return { ...prev, testigos: updatedTestigos };
    });
    setTestigosModificados(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    startTransition(async () => {
      try {
        const payload = {
          ...formData,
          testigosModificados,
          detalles: formData.detalles ?? "",
          informacion: formData.informacion ?? "",
        };
        if (payload.detalles === "" || payload.informacion === "")
          alert("Cuidado, los campos detalles e información están vacíos");
        const { exito, mensaje } = await intentarActualizarAudiencia(payload);
        if (!exito) throw new Error(mensaje);
        toast.success("Audiencia actualizada con éxito");
        onSave();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al actualizar audiencia"
        );
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Editar Audiencia</h2>
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
                    Carátula
                  </label>
                  <input
                    name="caratula"
                    value={formData.caratula}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Demandado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Demandado
                  </label>
                  <input
                    name="demandado"
                    value={formData.demandado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidad
                  </label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="semipresencial">Semipresencial</option>
                    <option value="virtual">Virtual</option>
                  </select>
                </div>

                {/* Usuario Asignado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4" />
                    Usuario Asignado
                  </label>
                  <select
                    name="usuarioId"
                    value={formData.usuarioId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Juzgado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4" />
                    Juzgado
                  </label>
                  <input
                    type="number"
                    name="juzgado"
                    value={formData.juzgado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
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
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original: {fechaOriginal}
                  </p>
                </div>

                {/* Hora */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4" />
                    Hora
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Original: {horaOriginal}
                  </p>
                </div>
              </div>
            </div>

            {/* Información y Detalles */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                <FileText className="h-5 w-5" />
                Descripción
              </div>

              <div className="space-y-6">
                {/* Información */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Información
                  </label>
                  <textarea
                    name="informacion"
                    value={formData.informacion || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={4}
                    placeholder="Ingrese información adicional sobre la audiencia..."
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
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                    placeholder="Ingrese detalles específicos..."
                  />
                </div>
              </div>
            </div>

            {/* Testigos */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-lg border-b border-blue-100 pb-2">
                <Users className="h-5 w-5" />
                Testigos ({formData.testigos.length})
              </div>

              <div className="space-y-4">
                {formData.testigos.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Nombre
                        </label>
                        <input
                          name="nombre"
                          value={t.nombre}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Apellido
                        </label>
                        <input
                          name="apellido"
                          value={t.apellido}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Apellido"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Celular
                        </label>
                        <input
                          name="celular"
                          value={t.celular}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Celular"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email
                        </label>
                        <input
                          name="email"
                          value={t.email}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                          placeholder="Email"
                        />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="BR"
                          checked={t.BR}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">BR</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="dificil"
                          checked={t.dificil}
                          onChange={(e) => handleTestigoChange(idx, e)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Difícil</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
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
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
