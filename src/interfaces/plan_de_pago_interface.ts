import { Pago } from './pago_interface';

export interface PlanDePago {
  id_plan: string;
  id_poliza: string;
  id_cliente: string;
  prima_total: number;
  plazo: number;
  fecha_de_pago: string;
  pago_uno: number;
  numero_poliza?: string;
  archivo_poliza?: string;
  observacion?: string;
  estado: 'activo' | 'inactivo';
  fecha_creado?: string;
  creado_por?: string;
  fecha_modificado?: string;
  modificado_por?: string;
}

export interface CuotaPlanDePago {
  numero_cuota: number;
  monto: number;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  pagos_aplicados?: Partial<Pago>[];
} 