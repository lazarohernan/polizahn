export interface Pago {
  id_pago: string;
  id_plan: string;
  abono: number;
  fecha: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  url_comprobante?: string;
  creado_por?: string;
  fecha_creado?: string;
  modificado_por?: string;
  fecha_modificado?: string;
  estado: 'activo' | 'inactivo';
  numero_cuota?: number; // Para asociar con el número de cuota del plan
} 