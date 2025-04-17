import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useStorage } from './useStorage'
import type { Aseguradora } from '@/modules/admin/interfaces/aseguradora_interface'

export const useAseguradoras = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { uploadLogo } = useStorage()

  const getAseguradoras = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('aseguradoras')
        .select('*')

      if (err) throw err

      return {
        ok: true,
        data: data as Aseguradora[],
        message: 'Aseguradoras obtenidas correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      return {
        ok: false,
        data: [],
        message: 'Error al obtener las aseguradoras'
      }
    } finally {
      loading.value = false
    }
  }

  const getAseguradora = async (id_aseguradora: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('aseguradoras')
        .select('*')
        .eq('id_aseguradora', id_aseguradora)
        .single()

      if (err) throw err

      return {
        ok: true,
        data: data as Aseguradora,
        message: 'Aseguradora obtenida correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      return {
        ok: false,
        data: null,
        message: 'Error al obtener la aseguradora'
      }
    } finally {
      loading.value = false
    }
  }

  const createAseguradora = async (aseguradora: Partial<Aseguradora>) => {
    try {
      loading.value = true
      error.value = null

      // Si hay un logo, primero lo subimos al storage
      let logo_url: string | null = null
      if (aseguradora.logo && typeof aseguradora.logo !== 'string') {
        logo_url = await uploadLogo(aseguradora.logo as File, aseguradora.id_aseguradora || crypto.randomUUID())
      }

      const userId = localStorage.getItem('userId')
      
      // Crear el registro de la aseguradora
      const { data, error: err } = await supabase
        .from('aseguradoras')
        .insert({
          nombre: aseguradora.nombre,
          descripcion: aseguradora.descripcion,
          nombre_gestor: aseguradora.nombre_gestor,
          tel_gestor: aseguradora.tel_gestor,
          correo_gestor: aseguradora.correo_gestor,
          logo: logo_url || aseguradora.logo,
          fecha_creado: new Date().toISOString(),
          ...(userId && { creado_por: userId })
        })
        .select()
        .single()

      if (err) throw err

      return {
        ok: true,
        data: data as Aseguradora,
        message: 'Aseguradora creada correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      return {
        ok: false,
        data: null,
        message: 'Error al crear la aseguradora'
      }
    } finally {
      loading.value = false
    }
  }

  const updateAseguradora = async (id_aseguradora: string, aseguradora: Partial<Aseguradora>) => {
    try {
      loading.value = true
      error.value = null

      // Si hay un nuevo logo, primero lo subimos al storage
      let logo_url: string | undefined = undefined
      if (aseguradora.logo && typeof aseguradora.logo !== 'string') {
        logo_url = await uploadLogo(aseguradora.logo as File, id_aseguradora)
      }

      // Actualizar el registro de la aseguradora
      const { data, error: err } = await supabase
        .from('aseguradoras')
        .update({
          nombre: aseguradora.nombre,
          descripcion: aseguradora.descripcion,
          nombre_gestor: aseguradora.nombre_gestor,
          tel_gestor: aseguradora.tel_gestor,
          correo_gestor: aseguradora.correo_gestor,
          ...(logo_url ? { logo: logo_url } : {})
        })
        .eq('id_aseguradora', id_aseguradora)
        .select()
        .single()

      if (err) throw err

      return {
        ok: true,
        data: data as Aseguradora,
        message: 'Aseguradora actualizada correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      return {
        ok: false,
        data: null,
        message: 'Error al actualizar la aseguradora'
      }
    } finally {
      loading.value = false
    }
  }

  const deleteAseguradora = async (id_aseguradora: string) => {
    try {
      loading.value = true
      error.value = null

      // Eliminar la aseguradora
      const { error: err } = await supabase
        .from('aseguradoras')
        .delete()
        .eq('id_aseguradora', id_aseguradora)

      if (err) throw err

      return {
        ok: true,
        message: 'Aseguradora eliminada correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      return {
        ok: false,
        message: 'Error al eliminar la aseguradora'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getAseguradoras,
    getAseguradora,
    createAseguradora,
    updateAseguradora,
    deleteAseguradora
  }
} 