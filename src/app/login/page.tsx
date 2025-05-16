"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { login } from "@/app/login/actions";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const response = await login(formData);
        if (!response.exito) {
          toast.error(response.mensaje || "Error al iniciar sesión");
        }
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">AudLex</h1>
      <form
        action={handleSubmit}
        className="w-full max-w-sm bg-white p-6 text-black rounded-lg shadow-lg border border-blue-200"
      >
        <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Identifícate
        </h2>

        <label
          htmlFor="username"
          className="block text-sm font-medium text-blue-600"
        >
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="mt-1 mb-4 w-full rounded-md border border-blue-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
          placeholder="Ingresa tu usuario"
        />

        <label
          htmlFor="password"
          className="block text-sm font-medium text-blue-600"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 mb-6 w-full rounded-md border border-blue-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
          placeholder="Ingresa tu contraseña"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
