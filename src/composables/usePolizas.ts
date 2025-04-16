import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { ApiResponse } from '@/types/supabase-responses'

// Tipos base de la base de datos
type BasePoliza = Database['public']['Tables']['polizas']['Row']
type InsertPoliza = Database['public']['Tables']['polizas']['Insert']
type UpdatePoliza = Database['public']['Tables']['polizas']['Update']

// Tipo extendido para incluir el nombre de la aseguradora
export interface Poliza extends BasePoliza {
  nombre_aseguradora?: string
}

// Usar la interfaz ApiResponse genérica para respuestas consistentes
export type PolizaResponse<T> = ApiResponse<T>

export function usePolizas() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getPolizas = async (): Promise<PolizaResponse<Poliza[]>> => {
    loading.value = true
    error.value = null
    try {
      const { data: polizasData, error: polizasError } = await supabase
        .from('polizas')
        .select('*, aseguradoras(nombre)')

      if (polizasError) {
        throw new Error(polizasError.message || 'Error desconocido al obtener pólizas')
      }

      // Transformar los datos para incluir nombre_aseguradora
      const polizasTransformed = (polizasData || []).map(poliza => {
        const { aseguradoras, ...polizaBase } = poliza
        return {
          ...polizaBase,
          nombre_aseguradora: aseguradoras?.nombre || ''
        }
      })

      return {
        ok: true,
        data: polizasTransformed as Poliza[],
        message: 'Pólizas obtenidas correctamente'
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      error.value = errorMessage
      return {
        ok: false,
        data: [],
        message: `Error al obtener las pólizas: ${errorMessage}`
      }
    } finally {
      loading.value = false
    }
  }

  const getPoliza = async (id_poliza: string): Promise<PolizaResponse<Poliza | null>> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('polizas')
        .select('*, aseguradoras(nombre)')
        .eq('id_poliza', id_poliza)
        .single()

      if (err) {
        if (err.code === 'PGRST116') {
          return {
            ok: true,
            data: null,
            message: 'Póliza no encontrada'
          }
        }
        throw new Error(err.message || `Error desconocido al obtener la póliza ${id_poliza}`)
      }

      if (data) {
        const { aseguradoras, ...polizaBase } = data
        return {
          ok: true,
          data: {
            ...polizaBase,
            nombre_aseguradora: aseguradoras?.nombre || ''
          } as Poliza,
          message: 'Póliza obtenida correctamente'
        }
      }

      return {
        ok: true,
        data: null,
        message: 'Póliza no encontrada'
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      error.value = errorMessage
      return {
        ok: false,
        data: null,
        message: `Error al obtener la póliza: ${errorMessage}`
      }
    } finally {
      loading.value = false
    }
  }

  const createPoliza = async (poliza: InsertPoliza): Promise<PolizaResponse<Poliza | null>> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('polizas')
        .insert(poliza)
        .select()
        .single()

      if (err) {
        throw new Error(err.message || 'Error desconocido al crear la póliza')
      }

      return {
        ok: true,
        data: data as Poliza,
        message: 'Póliza creada correctamente'
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      error.value = errorMessage
      return {
        ok: false,
        data: null,
        message: `Error al crear la póliza: ${errorMessage}`
      }
    } finally {
      loading.value = false
    }
  }

  const updatePoliza = async (id_poliza: string, poliza: UpdatePoliza): Promise<PolizaResponse<BasePoliza | null>> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('polizas')
        .update(poliza)
        .eq('id_poliza', id_poliza)
        .select()
        .single()

      if (err) {
        console.error(`Supabase error updating poliza ${id_poliza}:`, err)
        throw new Error(err.message || 'Error desconocido al actualizar la póliza')
      }

      // Similar a create, la respuesta no incluye relaciones.
      return {
        ok: true,
        data: data as BasePoliza, // Devolvemos BasePoliza
        message: 'Póliza actualizada correctamente'
      }
    } catch (e) {
      console.error(`Error in updatePoliza (${id_poliza}):`, e)
      const errorMessage = e instanceof Error ? e.message : String(e)
      error.value = errorMessage
      return {
        ok: false,
        data: null,
        message: `Error al actualizar la póliza: ${errorMessage}`
      }
    } finally {
      loading.value = false
    }
  }

  const deletePoliza = async (id_poliza: string): Promise<PolizaResponse<null>> => {
    loading.value = true
    error.value = null
    try {
      // Eliminación real en lugar de soft delete
      const { error: err } = await supabase
        .from('polizas')
        .delete()
        .eq('id_poliza', id_poliza)

      if (err) {
        console.error(`Supabase error deleting poliza ${id_poliza}:`, err)
        throw new Error(err.message || 'Error desconocido al eliminar la póliza')
      }

      return {
        ok: true,
        data: null, // No data to return on delete
        message: 'Póliza eliminada correctamente'
      }
    } catch (e) {
      console.error(`Error in deletePoliza (${id_poliza}):`, e)
      const errorMessage = e instanceof Error ? e.message : String(e)
      error.value = errorMessage
      return {
        ok: false,
        data: null,
        message: `Error al eliminar la póliza: ${errorMessage}`
      }
    } finally {
      loading.value = false
    }
  }

  // Asegúrate de que todas las funciones y variables necesarias estén definidas y retornadas
  return {
    loading,
    error,
    getPolizas,
    getPoliza,
    createPoliza,
    updatePoliza,
    deletePoliza
  }
}