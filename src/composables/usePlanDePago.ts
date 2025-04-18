import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { useErrorHandler } from '@/composables/useErrorHandler'

type PlanDePago = Database['public']['Tables']['plan_de_pago']['Row']
type InsertPlanDePago = Database['public']['Tables']['plan_de_pago']['Insert']
type UpdatePlanDePago = Database['public']['Tables']['plan_de_pago']['Update']

export const usePlanDePago = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { handleAndToastError } = useErrorHandler()

  const getPlanesDePago = async (id_cliente: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .select('*, polizas(nombre)')
        .eq('id_cliente', id_cliente)

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as (PlanDePago & { polizas: { nombre: string } })[],
        message: 'Planes de pago obtenidos correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePlanDePago/getPlanesDePago(${id_cliente})`)
      return {
        ok: false,
        data: [],
        message: 'Error al obtener los planes de pago'
      }
    } finally {
      loading.value = false
    }
  }

  const getPlanDePago = async (id_plan: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .select('*, polizas(nombre)')
        .eq('id_plan', id_plan)
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as PlanDePago & { polizas: { nombre: string } },
        message: 'Plan de pago obtenido correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePlanDePago/getPlanDePago(${id_plan})`)
      return {
        ok: false,
        data: null,
        message: 'Error al obtener el plan de pago'
      }
    } finally {
      loading.value = false
    }
  }

  const createPlanDePago = async (planDePago: InsertPlanDePago) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .insert(planDePago)
        .select()
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as PlanDePago,
        message: 'Plan de pago creado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, 'usePlanDePago/createPlanDePago', 'Error al crear el plan de pago')
      return {
        ok: false,
        data: null,
        message: 'Error al crear el plan de pago'
      }
    } finally {
      loading.value = false
    }
  }

  const updatePlanDePago = async (id_plan: string, planDePago: UpdatePlanDePago) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .update(planDePago)
        .eq('id_plan', id_plan)
        .select()
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as PlanDePago,
        message: 'Plan de pago actualizado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePlanDePago/updatePlanDePago(${id_plan})`, 'Error al actualizar el plan de pago')
      return {
        ok: false,
        data: null,
        message: 'Error al actualizar el plan de pago'
      }
    } finally {
      loading.value = false
    }
  }

  const deletePlanDePago = async (id_plan: string) => {
    try {
      loading.value = true
      error.value = null

      // Soft delete - actualizar estado a false
      const { error: dbError } = await supabase
        .from('plan_de_pago')
        .update({ estado: false })
        .eq('id_plan', id_plan)

      if (dbError) throw dbError

      return {
        ok: true,
        message: 'Plan de pago eliminado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePlanDePago/deletePlanDePago(${id_plan})`, 'Error al eliminar el plan de pago')
      return {
        ok: false,
        message: 'Error al eliminar el plan de pago'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getPlanesDePago,
    getPlanDePago,
    createPlanDePago,
    updatePlanDePago,
    deletePlanDePago
  }
} 