export interface Respuesta {
  message: string;
  paginaActual: number;
  totalPaginas: number;
  limite: number;
  totalRegistros: number;
  data: Cliente[];
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
}

export interface RespuestaSimple {
  message: string;
  data: Cliente;
}

/**
 * Interfaz que representa un Cliente en el sistema
 * Basada en la tabla `clientes` de Supabase
 */
export interface Cliente {
  id_cliente: string;
  nombres: string;          // Corresponde a la columna nombres
  apellidos: string;        // Corresponde a la columna apellidos
  identificacion: string;   // Corresponde a la columna identificacion (DNI)
  correo: string;           // Corresponde a la columna correo (email)
  tel_1?: string | null;     // Corresponde a la columna tel_1 (telefono principal)
  tel_2?: string | null;     // Corresponde a la columna tel_2 (telefono secundario)
  empresa?: string | null;   // Corresponde a la columna empresa
  dob?: string | null;       // Corresponde a la columna dob (fecha de nacimiento)
  direccion?: string | null; // Corresponde a la columna direccion
  avatar_url?: string | null; // Permitir null
  estado: boolean;          // Corresponde a la columna estado (activo/inactivo)
  creado_por?: string | null; // Permitir null
  fecha_creado?: string | null; // Permitir null
  modificado_por?: string | null; // Permitir null
  fecha_modificado?: string | null; // Permitir null
}

/**
 * DTO para crear un nuevo cliente
 */
export interface CreateClienteDTO {
  nombres: string;
  apellidos: string;
  identificacion: string;
  correo: string;
  tel_1?: string | null;
  tel_2?: string | null;
  empresa?: string | null;
  dob?: string | null;
  direccion?: string | null;
  avatar_url?: string | null;
  creado_por?: string | null; // Permitir null
  // fecha_creado se genera en DB
}

/**
 * DTO para actualizar un cliente existente
 */
export interface UpdateClienteDTO {
  nombres?: string;
  apellidos?: string;
  identificacion?: string;
  correo?: string;
  tel_1?: string | null;
  tel_2?: string | null;
  empresa?: string | null;
  dob?: string | null;
  direccion?: string | null;
  avatar_url?: string | null;
  estado?: boolean;
  modificado_por?: string | null; // Permitir null
  // fecha_modificado se actualiza en DB
}

export interface CreateClienteResponse {
  ok: boolean;
  message: string;
  data?: Cliente;
}
