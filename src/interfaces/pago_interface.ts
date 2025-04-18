export interface Pago {
  id_pago: string;
  id_plan: string;
  num_cuota?: number; // Número de cuota al que corresponde este pago
  abono: number;
  fecha: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  url_comprobante?: string;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  creado_por?: string;
  fecha_creado?: string;
  modificado_por?: string;
  fecha_modificado?: string;
} 