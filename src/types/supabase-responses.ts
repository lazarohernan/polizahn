/**
 * Interfaces para respuestas de Supabase API
 * Este archivo define tipos específicos para las respuestas de Supabase,
 * mejorando la seguridad de tipos en toda la aplicación.
 */

// Interfaz base para errores de Supabase
export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  [key: string]: any;
}

// Interfaz para respuestas de consulta
export interface SupabaseQueryResponse<T> {
  data: T | null;
  error: SupabaseError | null;
  count?: number;
  status?: number;
}

// Interfaz para respuestas de Storage
export interface SupabaseStorageResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

// Tipos específicos para Storage
export interface SupabaseStorageUploadResponse {
  data: {
    path?: string;
    id?: string;
    fullPath?: string;
  } | null;
  error: SupabaseError | null;
}

// La respuesta de getPublicUrl tiene una estructura diferente
export interface SupabaseStoragePublicUrlResponse {
  data: {
    publicUrl: string;
  };
  // getPublicUrl no devuelve un error en la estructura actual de Supabase
}

// Interfaz para respuestas de autenticación
export interface SupabaseAuthResponse<T> {
  data: {
    user: T | null;
    session: any | null;
  };
  error: SupabaseError | null;
}

// Interfaz genérica para respuestas de API personalizadas
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message: string;
  error?: string;
}
