export interface Cliente {
  id_cliente: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion?: string;
  fecha_nacimiento?: string;
  avatar_url?: string;
  estado: 'activo' | 'inactivo';
  creado_por?: string;
  fecha_creado?: string;
  modificado_por?: string;
  fecha_modificado?: string;
} 