import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-700 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        <span className="text-sm font-medium">Volver al inicio</span>
      </Link>
    </main>
  );
}
