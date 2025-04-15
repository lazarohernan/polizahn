export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: PlanDePago[];
}

export interface DeleteResponse {
  ok: boolean;
  message: string;
  cantidad: string;
}

export interface RespuestaSimple {
  message: string;
  data: PlanDePago;
}

/**
 * Interfaz que representa un Plan de Pago en el sistema
 * Basada en la tabla plan_de_pago de la base de datos
 */
export interface PlanDePago {
  id_plan?: string;
  id_cliente: string;
  id_poliza: string;
  prima_total: number;
  plazo: number;
  fecha_de_pago: Date | string;
  pago_uno: number;
  numero_poliza: string;
  archivo_poliza?: string | null;
  observacion?: string | null;
  status?: string;

  // Propiedades adicionales para la UI (no están en la BD)
  nombre_cliente?: string;
  nombre_poliza?: string;
}

/**
 * Interfaz para crear un nuevo Plan de Pago
 * Omite campos que se generan automáticamente
 */
export interface CreatePlanDePagoDTO {
  id_cliente: string;
  id_poliza: string;
  prima_total: number;
  plazo: number;
  fecha_de_pago: Date | string;
  pago_uno: number;
  numero_poliza: string;
  archivo_poliza?: string | File;
  observacion?: string;
  status?: string;
}

/**
 * Interfaz para actualizar un Plan de Pago existente
 * Todos los campos son opcionales
 */
export interface UpdatePlanDePagoDTO {
  id_plan: string;
  id_cliente?: string;
  id_poliza?: string;
  prima_total?: number;
  plazo?: number;
  fecha_de_pago?: Date | string;
  estado?: boolean;
  pago_uno?: number;
  numero_poliza?: string;
  archivo_poliza?: string | File;
  observacion?: string;
  status?: string;
}

export interface CreatePlanDePagoResponse {
  ok: boolean;
  message: string;
  data: PlanDePago;
}

export interface UpdatePlanDePagoResponse {
  ok: boolean;
  message: string;
  data: PlanDePago;
}
