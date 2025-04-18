import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'
import type { PlanDePago, CuotaPlanDePago } from '@/interfaces/plan_de_pago_interface'
import { useErrorHandler } from '@/composables/useErrorHandler'

export const usePlanesStore = defineStore('planes', () => {
  // Estado
  const planes = ref<PlanDePago[]>([])
  const planActivo = ref<PlanDePago | null>(null)
  const cuotasPlan = ref<CuotaPlanDePago[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()
  const { handleAndToastError } = useErrorHandler()

  // Getters
  const planById = computed(() => {
    return (id: string) => planes.value.find(plan => plan.id_plan === id) || null
  })

  const planesPorCliente = computed(() => {
    return (clienteId: string) => planes.value.filter(plan => plan.id_cliente === clienteId)
  })

  const totalPlanes = computed(() => planes.value.length)

  // Acciones
  async function cargarPlanes() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .select('*')
        .order('fecha_creado', { ascending: false })

      if (dbError) throw dbError

      planes.value = data as PlanDePago[]
      return data
    } catch (err) {
      error.value = handleAndToastError(err, 'PlanesStore/cargarPlanes', 'Error al cargar planes de pago')
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function cargarPlanesPorCliente(clienteId: string) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .select('*')
        .eq('id_cliente', clienteId)
        .order('fecha_creado', { ascending: false })

      if (dbError) throw dbError

      // Actualizar planes en el arreglo local
      const planesCliente = data as PlanDePago[]
      
      // Añadir los nuevos planes al estado si no existen ya
      planesCliente.forEach(plan => {
        const index = planes.value.findIndex(p => p.id_plan === plan.id_plan)
        if (index !== -1) {
          planes.value[index] = plan
        } else {
          planes.value.push(plan)
        }
      })

      return planesCliente
    } catch (err) {
      error.value = handleAndToastError(err, `PlanesStore/cargarPlanesPorCliente(${clienteId})`)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function obtenerPlanPorId(id: string) {
    // Primero verificar si ya está en el estado local
    const planEncontrado = planById.value(id)
    if (planEncontrado) {
      planActivo.value = planEncontrado
      return planEncontrado
    }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('plan_de_pago')
        .select('*')
        .eq('id_plan', id)
        .single()

      if (dbError) throw dbError

      // Actualizar el plan en el arreglo local
      const planNuevo = data as PlanDePago
      const index = planes.value.findIndex(p => p.id_plan === id)
      if (index !== -1) {
        planes.value[index] = planNuevo
      } else {
        planes.value.push(planNuevo)
      }

      planActivo.value = planNuevo
      await cargarCuotasPlan(id)
      return planNuevo
    } catch (err) {
      error.value = handleAndToastError(err, `PlanesStore/obtenerPlanPorId(${id})`)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function cargarCuotasPlan(planId: string) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('plan_de_pago_detalle')
        .select('*')
        .eq('id_plan', planId)
        .order('numero_pago', { ascending: true })

      if (dbError) throw dbError

      cuotasPlan.value = data.map(cuota => ({
        numero_cuota: cuota.numero_pago,
        monto: cuota.monto,
        fecha_vencimiento: cuota.fecha_vencimiento,
        estado: cuota.estado
      })) as CuotaPlanDePago[]

      return cuotasPlan.value
    } catch (err) {
      error.value = handleAndToastError(err, `PlanesStore/cargarCuotasPlan(${planId})`)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function crearPlan(plan: Omit<PlanDePago, 'id_plan' | 'fecha_creado'>, cuotas: Omit<CuotaPlanDePago, 'pagos_aplicados'>[]) {
    isLoading.value = true
    error.value = null

    try {
      // Insertar plan
      const { data: planData, error: planError } = await supabase
        .from('plan_de_pago')
        .insert({
          ...plan,
          estado: 'activo'
        })
        .select()
        .single()

      if (planError) throw planError
      const nuevoPlan = planData as PlanDePago

      // Insertar cuotas
      if (cuotas.length > 0) {
        const cuotasInsert = cuotas.map(cuota => ({
          id_plan: nuevoPlan.id_plan,
          numero_pago: cuota.numero_cuota,
          monto: cuota.monto,
          fecha_vencimiento: cuota.fecha_vencimiento,
          estado: cuota.estado
        }))

        const { error: cuotasError } = await supabase
          .from('plan_de_pago_detalle')
          .insert(cuotasInsert)

        if (cuotasError) throw cuotasError
      }

      // Actualizar el estado local
      planes.value.push(nuevoPlan)
      toast.success('Plan de pago creado exitosamente')
      return nuevoPlan
    } catch (err) {
      error.value = handleAndToastError(err, 'PlanesStore/crearPlan', 'Error al crear plan de pago')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function actualizarEstadoCuota(detalleId: string, nuevoEstado: 'pendiente' | 'pagado' | 'vencido') {
    isLoading.value = true
    error.value = null

    try {
      const { error: dbError } = await supabase
        .from('plan_de_pago_detalle')
        .update({
          estado: nuevoEstado,
          fecha_modificado: new Date().toISOString()
        })
        .eq('id_detalle', detalleId)

      if (dbError) throw dbError

      // Actualizar el estado local de las cuotas si tenemos el plan activo
      if (planActivo.value) {
        await cargarCuotasPlan(planActivo.value.id_plan)
      }

      return true
    } catch (err) {
      error.value = handleAndToastError(err, `PlanesStore/actualizarEstadoCuota(${detalleId})`)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    planes,
    planActivo,
    cuotasPlan,
    isLoading,
    error,

    // Getters
    planById,
    planesPorCliente,
    totalPlanes,

    // Acciones
    cargarPlanes,
    cargarPlanesPorCliente,
    obtenerPlanPorId,
    cargarCuotasPlan,
    crearPlan,
    actualizarEstadoCuota
  }
}) 