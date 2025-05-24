"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { login } from "@/app/login/actions";
import { LockKeyhole, User, Scale } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const response = await login(formData);
        if (!response.exito) throw new Error(response.mensaje);
        toast.success("¡Bienvenido de nuevo!", { position: "top-center" });
        setTimeout(() => router.push("/panel"), 500);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Ocurrió un error inesperado."
        );
      }
    });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8 flex flex-col items-center">
          <Scale className="h-10 w-10 text-blue-600 mb-3" />
          <h1 className="text-3xl font-semibold text-gray-900">AudLex</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sistema de Gestión de Audiencias
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Iniciar sesión
            </h2>

            <form action={handleSubmit} className="space-y-5 text-black">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ingresa tu usuario"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
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
                    Ingresando...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              El acceso es completamente privado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
