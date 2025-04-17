import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage
  }
})

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      aseguradoras: {
        Row: {
          id_aseguradora: string
          nombre: string
          nombre_gestor: string
          tel_gestor: string
          correo_gestor: string
          logo: string
          fecha_creado: string
          creado_por: string
          fecha_modificado: string | null
          modificado_por: string | null
          descripcion: string
        }
        Insert: {
          id_aseguradora?: string
          nombre: string
          nombre_gestor: string
          tel_gestor: string
          correo_gestor: string
          logo: string
          fecha_creado?: string
          creado_por: string
          fecha_modificado?: string | null
          modificado_por?: string | null
          descripcion: string
        }
        Update: {
          id_aseguradora?: string
          nombre?: string
          nombre_gestor?: string
          tel_gestor?: string
          correo_gestor?: string
          logo?: string
          fecha_creado?: string
          creado_por?: string
          fecha_modificado?: string | null
          modificado_por?: string | null
          descripcion?: string
        }
      }
      clientes: {
        Row: {
          id_cliente: string
          identificacion: string
          correo: string
          nombres: string
          apellidos: string
          dob: Date | null
          empresa: string | null
          tel_1: string | null
          tel_2: string | null
          fecha_creado: Date | null
          creado_por: string | null
          fecha_modificado: Date | null
          modificado_por: string | null
          foto: string | null
          direccion: string | null
        }
        Insert: {
          id_cliente?: string
          identificacion: string
          correo: string
          nombres: string
          apellidos: string
          dob?: Date | null
          empresa?: string | null
          tel_1?: string | null
          tel_2?: string | null
          fecha_creado?: Date | null
          creado_por?: string | null
          fecha_modificado?: Date | null
          modificado_por?: string | null
          foto?: string | null
          direccion?: string | null
        }
        Update: {
          id_cliente?: string
          identificacion?: string
          correo?: string
          nombres?: string
          apellidos?: string
          dob?: Date | null
          empresa?: string | null
          tel_1?: string | null
          tel_2?: string | null
          fecha_creado?: Date | null
          creado_por?: string | null
          fecha_modificado?: Date | null
          modificado_por?: string | null
          foto?: string | null
          direccion?: string | null
        }
      }
      clientes_por_correduria: {
        Row: {
          id_cliente_correduria: string
          id_cliente: string
          id_correduria: string
          fecha_creado: Date
        }
        Insert: {
          id_cliente_correduria?: string
          id_cliente: string
          id_correduria: string
          fecha_creado?: Date
        }
        Update: {
          id_cliente_correduria?: string
          id_cliente?: string
          id_correduria?: string
          fecha_creado?: Date
        }
      }
      polizas: {
        Row: {
          id_poliza: string
          nombre: string
          descripcion: string
          archivo_poliza: string
          fecha_poliza: string
          fecha_creado: string
          creado_por: string
          fecha_modificado: string | null
          modificado_por: string | null
          id_correduria: string
          id_aseguradora: string
        }
        Insert: {
          id_poliza?: string
          nombre: string
          descripcion: string
          archivo_poliza: string
          fecha_poliza: string
          fecha_creado?: string
          creado_por: string
          fecha_modificado?: string | null
          modificado_por?: string | null
          id_correduria: string
          id_aseguradora: string
        }
        Update: {
          id_poliza?: string
          nombre?: string
          descripcion?: string
          archivo_poliza?: string
          fecha_poliza?: string
          fecha_creado?: string
          creado_por?: string
          fecha_modificado?: string | null
          modificado_por?: string | null
          id_correduria?: string
          id_aseguradora?: string
        }
      }
      plan_de_pago: {
        Row: {
          id_plan: string
          id_cliente: string
          id_poliza: string
          prima_total: number
          plazo: number
          fecha_de_pago: string
          pago_uno: number
          numero_poliza: string
          archivo_poliza: string | null
          observacion: string | null
          estado: boolean
          creado_por: string
          fecha_creado: string
          modificado_por: string | null
          fecha_modificado: string | null
        }
        Insert: {
          id_plan?: string
          id_cliente: string
          id_poliza: string
          prima_total: number
          plazo: number
          fecha_de_pago: string
          pago_uno: number
          numero_poliza: string
          archivo_poliza?: string | null
          observacion?: string | null
          estado?: boolean
          creado_por: string
          fecha_creado?: string
          modificado_por?: string | null
          fecha_modificado?: string | null
        }
        Update: {
          id_plan?: string
          id_cliente?: string
          id_poliza?: string
          prima_total?: number
          plazo?: number
          fecha_de_pago?: string
          pago_uno?: number
          numero_poliza?: string
          archivo_poliza?: string | null
          observacion?: string | null
          estado?: boolean
          creado_por?: string
          fecha_creado?: string
          modificado_por?: string | null
          fecha_modificado?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 