export interface Poliza {
  id_poliza: string;
  id_cliente: string;
  id_aseguradora: string;
  prima_total: number;
  fecha_inicio: string;
  fecha_vencimiento: string;
  estado: 'activa' | 'vencida' | 'cancelada';
  tipo_poliza: string;
  numero_poliza: string;
  archivo_poliza?: string;
  fecha_creado?: string;
  creado_por?: string;
  fecha_modificado?: string;
  modificado_por?: string;
} 