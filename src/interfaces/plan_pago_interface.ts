export interface PlanDePago {
  id_plan: string;
  id_poliza: string;
  prima_total: number;
  plazo: number;
  fecha_de_pago: string;
  estado: 'activo' | 'inactivo';
  fecha_creado?: string;
  creado_por?: string;
  id_cliente: string;
  pago_uno: number;
  numero_poliza: string;
  archivo_poliza?: string;
  observacion?: string;
}

export interface CuotaPlan {
  numero: number;
  monto: number;
  fecha_vencimiento: string;
  monto_pendiente: number;
  pagado: boolean;
} 