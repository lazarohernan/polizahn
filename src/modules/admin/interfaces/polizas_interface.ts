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

/**
 * Interfaz completa que refleja la estructura de la tabla polizas en la base de datos
 */
export interface Poliza {
  id_poliza?: string;
  id_correduria: string;
  nombre: string;
  descripcion: string;
  archivo_poliza: string | File;
  fecha_poliza: string;
  fecha_creado: string;
  creado_por: string;
  fecha_modificado?: string | null;
  modificado_por?: string | null;
  id_aseguradora: string;
  nombre_aseguradora?: string; // Campo virtual para UI, no existe en la BD
}

/**
 * Interfaz para formularios o vistas específicas que no requieren todos los campos
 */
export interface PolizaFormulario {
  id_poliza?: string;
  id_correduria: string;
  nombre: string;
  descripcion: string;
  archivo_poliza: string | File;
  id_aseguradora: string;
}

/**
 * Interfaz para listados que incluyen información adicional de relaciones
 */
export interface PolizaConRelaciones extends Poliza {
  nombre_aseguradora: string;
  nombre_correduria?: string;
  nombre_creador?: string;
}

export interface CreatePolizaResponse {
  ok: boolean;
  message: string;
  data: Poliza;
}
