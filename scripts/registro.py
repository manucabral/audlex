
"""
Debido a que AudLex no contiene sistema de registro de usuarios,
este script se encarga de registrar usuarios en la base de datos
incluyendo todas las medidas de seguridad necesarias.
"""

import os
import sys
import bcrypt
import mysql.connector
from mysql.connector import Error, MySQLConnection
from dotenv import load_dotenv
from getpass import getpass
from typing import Optional, Tuple


load_dotenv()


def conectar_base_de_datos() -> Optional[MySQLConnection]:
    """Crea y devuelve una conexión a la base de datos, o None en caso de fallo."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "audlex"),
        )
        return conn if conn.is_connected() else None
    except Error as e:
        print(f"[Error] No se pudo conectar a MySQL: {e}", file=sys.stderr)
        return None


def validar_inputs(nombre: str, nivel: int) -> Tuple[bool, str]:
    """Valida nombre de usuario y nivel."""
    if not nombre.strip():
        return False, "El nombre de usuario no puede estar vacío."
    if nivel < 1 or nivel > 3:
        return False, "El nivel de usuario debe estar entre 1 y 3."
    return True, ""


def registrar_usuario(nombre: str, contra: str, nivel: int = 1) -> Tuple[bool, str]:
    """
    Inserta un nuevo usuario en la tabla 'usuarios'.
    Devuelve (True, mensaje) o (False, error).
    """
    valido, msg = validar_inputs(nombre, nivel)
    if not valido:
        return False, msg

    conexion = conectar_base_de_datos()
    if conexion is None:
        return False, "Error de conexión a la base de datos."

    try:
        with conexion:
            with conexion.cursor(buffered=True) as cursor:
                cursor.execute("SELECT id FROM usuarios WHERE nombre = %s", (nombre,))
                if cursor.fetchone():
                    return False, "El nombre de usuario ya existe."
                salt = bcrypt.gensalt()
                hash_pw = bcrypt.hashpw(contra.encode("utf-8"), salt).decode("utf-8")
                cursor.execute(
                    "INSERT INTO usuarios (nombre, hash, level) VALUES (%s, %s, %s)",
                    (nombre, hash_pw, nivel)
                )
        return True, f"Usuario '{nombre}' registrado exitosamente."
    except Error as e:
        return False, f"Error al registrar usuario: {e}"


def main():
    print("=== AudLex: Registro de Usuarios ===")
    nombre = input("Nombre de usuario: ").strip()
    contra = getpass("Contraseña: ")
    contra2 = getpass("Confirmar contraseña: ")
    if contra != contra2:
        print("Las contraseñas no coinciden.", file=sys.stderr)
        sys.exit(1)

    try:
        nivel = int(input("Nivel de usuario (1-3): ").strip())
    except ValueError:
        print("Nivel inválido. Debe ser un número entero.", file=sys.stderr)
        sys.exit(1)

    ok, mensaje = registrar_usuario(nombre, contra, nivel)
    if ok:
        print(mensaje)
    else:
        print(f"[Error] {mensaje}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()