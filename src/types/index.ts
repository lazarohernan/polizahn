/**
 * types/index.ts
 * 
 * Definiciones de tipos TypeScript utilizados en toda la aplicación.
 * Incluye interfaces para usuarios, respuestas de API y manejo de errores.
 */

/**
 * Representa un usuario del sistema
 * @interface User
 * @property {number} id - Identificador único del usuario
 * @property {string} email - Correo electrónico del usuario
 * @property {string} name - Nombre completo del usuario
 * @property {string} [role] - Rol del usuario (opcional)
 * @property {'pending' | 'active' | 'inactive'} [status] - Estado de la cuenta
 */
export interface User {
  id: number
  email: string
  name: string
  role?: string
  status?: 'pending' | 'active' | 'inactive'
}

/**
 * Estructura de error de la API
 * @interface ApiError
 * @property {string} message - Mensaje descriptivo del error
 * @property {string} code - Código de error para identificación
 */
export interface ApiError {
  message: string
  code: string
}

/**
 * Respuesta de autenticación exitosa
 * @interface AuthResponse
 * @property {string} token - Token JWT para autenticación
 * @property {User} user - Datos del usuario autenticado
 */
export interface AuthResponse {
  token: string
  user: User
}

/**
 * Estructura genérica de respuesta de la API
 * @interface ApiResponse
 * @template T - Tipo de datos en la respuesta
 * @property {T} data - Datos de la respuesta
 * @property {string} [message] - Mensaje opcional de la operación
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/**
 * Tipos de notificaciones del sistema
 * @type NotificationType
 */
export type NotificationType = 
  | 'policy_expiring'      // Póliza próxima a vencer
  | 'policy_expired'       // Póliza vencida
  | 'payment_due'          // Pago próximo a vencer
  | 'payment_overdue'      // Pago vencido
  | 'client_updated'       // Información de cliente actualizada
  | 'policy_created'       // Nueva póliza creada
  | 'policy_updated'       // Póliza actualizada
  | 'payment_received'     // Pago recibido
  | 'system_update'        // Actualización del sistema

/**
 * Representa una notificación del sistema
 * @interface Notification
 * @property {number} id - Identificador único de la notificación
 * @property {NotificationType} type - Tipo de notificación
 * @property {string} title - Título de la notificación
 * @property {string} message - Mensaje detallado
 * @property {string} date - Fecha de la notificación
 * @property {boolean} read - Estado de lectura
 * @property {string} [link] - Enlace relacionado (opcional)
 * @property {Record<string, any>} [metadata] - Datos adicionales específicos del tipo
 */
export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
  link?: string
  metadata?: {
    policyId?: number
    clientId?: number
    paymentId?: number
    amount?: number
    dueDate?: string
    version?: string
    details?: string
  }
}

export interface Cliente {
  id_cliente: string;
  identificacion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  dob: Date | null;
  empresa: string | null;
  tel_1: string | null;
  tel_2: string | null;
  direccion: string | null;
  foto: string | null;
  fecha_creado: string;
  creado_por: string | null;
  fecha_modificado: string | null;
  modificado_por: string | null;
  total_polizas?: number;
  clientes_por_correduria?: {
    id_cliente_correduria: string;
    id_correduria: string;
    fecha_creado: string;
  }[];
  id_correduria?: string; // Para compatibilidad con componentes existentes
}
