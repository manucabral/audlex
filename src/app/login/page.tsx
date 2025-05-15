"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-8">AudLex</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg border border-blue-200"
      >
        <h1 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
          Identificate
        </h1>

        <label
          htmlFor="username"
          className="block text-sm font-medium text-blue-600"
        >
          Usuario
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 mb-6 w-full rounded-md border border-blue-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
          placeholder="Ingresa tu contraseña"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
