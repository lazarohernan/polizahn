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
  cantidad: string;
}

export interface RespuestaSimple {
  message: string;
  data: Cliente;
}

export interface Cliente {
  id_cliente?: string;
  id_correduria: string;
  id_usuario_correduria: string;
  identificacion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  dob: Date;
  empresa: string;
  tel_1: string;
  tel_2: string;
  direccion: string;
  foto: File | string;
}

export interface CreateClienteResponse {
  ok: boolean;
  message: string;
  data: Cliente;
}
