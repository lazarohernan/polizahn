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

export interface Cliente {
  id_cliente: string;
  id_correduria?: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
  correo: string;
  tel_1: string | null;
  tel_2: string | null;
  empresa: string | null;
  dob: Date | null;
  fecha_creado: Date | null;
  creado_por: string | null;
  fecha_modificado: Date | null;
  modificado_por: string | null;
  foto: string | null;
  direccion: string | null;
  total_polizas?: number;
  clientes_por_correduria?: {
    id_cliente_correduria: string;
    id_correduria: string;
    fecha_creado: string;
  }[];
  id_usuario_correduria?: string | null;
}

export interface CreateClienteDTO {
  id_correduria: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
  correo: string;
  tel_1?: string | null;
  tel_2?: string | null;
  empresa?: string | null;
  dob?: Date | null;
  creado_por: string;
}

export interface UpdateClienteDTO {
  nombres?: string;
  apellidos?: string;
  identificacion?: string;
  correo?: string;
  tel_1?: string | null;
  tel_2?: string | null;
  empresa?: string | null;
  dob?: Date | null;
  modificado_por: string;
}

export interface CreateClienteResponse {
  ok: boolean;
  message: string;
  data?: Cliente;
}
