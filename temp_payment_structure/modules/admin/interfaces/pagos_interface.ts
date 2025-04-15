export interface RespuestaPagos {
  message: string;
  totalRegistros: number;
  data: Pago[];
}

export interface RespuestaPagoSimple {
  message: string;
  data: Pago;
}

export interface CreatePagoResponse {
  ok: boolean;
  message: string;
  data: Pago;
}

export interface UpdatePagoResponse {
  ok: boolean;
  message: string;
  data: Pago;
}

export interface DeletePagoResponse {
  ok: boolean;
  message: string;
  cantidad: string;
}

/**
 * Interfaz que representa un Pago en el sistema
 * Basada en la tabla pagos_de_polizas de la base de datos
 */
export interface Pago {
  id_pago?: string;
  id_plan: string;
  abono: number;
  fecha: Date | string;
  metodo_pago: string;
  url_comprobante?: string | File;
  creado_por?: string;
  fecha_creado?: Date | string;
  modificado_por?: string | null;
  fecha_modificado?: Date | string | null;
  estado?: boolean;

  // Propiedades adicionales que vienen en las consultas
  numero_poliza?: string;
  prima_total?: number;
  plazo?: number;
}

/**
 * Interfaz para crear un nuevo Pago
 * Omite campos que se generan automáticamente
 */
export interface CreatePagoDTO {
  id_plan: string;
  abono: number;
  fecha?: Date | string;
  metodo_pago: string;
  comprobante?: File;
}

/**
 * Interfaz para actualizar un Pago existente
 * Todos los campos son opcionales excepto los requeridos para la ruta
 */
export interface UpdatePagoDTO {
  abono: number;
  fecha?: Date | string;
  metodo_pago: string;
  comprobante?: File;
}
