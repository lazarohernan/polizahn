/**
 * Utilidades para el manejo seguro de tipos en TypeScript
 * Este archivo proporciona funciones de guarda de tipos (type guards) y utilidades
 * para mejorar la seguridad de tipos en toda la aplicación.
 */

import { SupabaseError } from '@/types/supabase-responses'

/**
 * Verifica si un valor es un error de Supabase
 */
export function isSupabaseError(value: unknown): value is SupabaseError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value
  )
}

/**
 * Verifica si un valor es un objeto no nulo
 */
export function isNonNullObject<T>(value: T | null | undefined): value is NonNullable<T> {
  return value !== null && value !== undefined
}

/**
 * Verifica si un valor es un array no vacío
 */
export function isNonEmptyArray<T>(value: T[] | null | undefined): value is NonNullable<T[]> {
  return Array.isArray(value) && value.length > 0
}

/**
 * Verifica si un valor es una cadena no vacía
 */
export function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

/**
 * Maneja de forma segura el acceso a propiedades anidadas de un objeto
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined
}

/**
 * Convierte un valor desconocido a string de forma segura
 */
export function safeToString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return Object.prototype.toString.call(value)
    }
  }
  
  return String(value)
}

/**
 * Convierte un valor desconocido a número de forma segura
 */
export function safeToNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0
  }
  
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

/**
 * Aplica una función a un valor si no es nulo o indefinido
 */
export function mapIfExists<T, R>(value: T | null | undefined, fn: (value: T) => R): R | undefined {
  return value !== null && value !== undefined ? fn(value) : undefined
}
