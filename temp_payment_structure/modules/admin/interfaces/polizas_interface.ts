export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: Poliza[];
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
  cantidad: string;
}

export interface RespuestaSimple {
  message: string;
  data: Poliza;
}

export interface Poliza {
  id_poliza?: string;
  id_correduria: string;
  nombre: string;
  descripcion: string;
  archivo_poliza: string | File;
  id_aseguradora: string;
  nombre_aseguradora?: string;
}

export interface CreatePolizaResponse {
  ok: boolean;
  message: string;
  data: Poliza;
}
