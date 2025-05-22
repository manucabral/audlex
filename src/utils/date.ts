export const obtenerFechaCorrecta = (fecha: Date): string => {
  const d = new Date(fecha);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const obtenerHoraCorrecta = (fecha: Date): string => {
  const d = new Date(fecha);
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes} hs`;
};
