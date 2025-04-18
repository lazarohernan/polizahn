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
  id_pago: string;
  id_plan: string;
  id_detalle?: string;
  abono: number;
  fecha: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  url_comprobante?: string;
  creado_por?: string;
  fecha_creado?: string;
  modificado_por?: string;
  fecha_modificado?: string;
  estado: 'activo' | 'inactivo';
  numero_cuota?: number;
}

/**
 * Interfaz para crear un nuevo Pago
 * Omite campos que se generan automáticamente
 */
export interface CreatePagoDTO {
  id_plan: string;
  id_detalle?: string;
  abono: number;
  fecha: string | Date;
  metodo_pago: string;
  url_comprobante?: string | File;
  numero_cuota?: number;
  descripcion?: string;
  id_poliza?: string;
  plazo?: number;
}

/**
 * Interfaz para actualizar un Pago existente
 * Todos los campos son opcionales excepto los requeridos para la ruta
 */
export interface UpdatePagoDTO {
  id_pago?: string;
  id_plan?: string;
  id_detalle?: string;
  abono?: number;
  fecha?: string | Date;
  metodo_pago?: string;
  url_comprobante?: string | File | null;
  estado?: string;
  descripcion?: string;
  numero_cuota?: number;
  plazo?: number;
}

export interface DetallePlan {
  id_detalle: string;
  id_plan: string;
  numero_pago: number;
  monto: number;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  fecha_creado?: string;
  creado_por?: string;
  fecha_modificado?: string;
  modificado_por?: string;
}
