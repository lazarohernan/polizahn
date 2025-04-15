export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: Aseguradora[];
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
  cantidad: string;
}

export interface RespuestaSimple {
  message: string;
  data: Aseguradora;
}

export interface Aseguradora {
  id_aseguradora?: string;
  id_correduria: string;
  nombre: string;
  nombre_gestor: string;
  tel_gestor: string;
  correo_gestor: string;
  logo: string | File;
  descripcion: string;
}

export interface CreateAseguradoraResponse {
  ok: boolean;
  message: string;
  data: Aseguradora;
}
