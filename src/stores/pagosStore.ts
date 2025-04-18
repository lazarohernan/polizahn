import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlanDePago } from '@/composables/usePlanDePago'
import { usePagos } from '@/composables/usePagos'
import type { Pago, CreatePagoDTO, UpdatePagoDTO, DetallePlan } from '@/modules/admin/interfaces/pagos_interface'
import type { PlanDePago } from '@/modules/admin/interfaces/plan_de_pago_interface'
import type { Cliente } from '@/modules/admin/interfaces/cliente_interface'
import { useToast } from 'vue-toastification'
import { supabase } from '@/lib/supabase'
import { useErrorHandler } from '@/composables/useErrorHandler'

export const usePagosStore = defineStore('pagos', () => {
  // State
  const planDePagoActivo = ref<string | null>(null)
  const clienteActivo = ref<Cliente | null>(null)
  const modalVisible = ref(false)
  const pagosData = ref<Pago[]>([])
  const planData = ref<PlanDePago | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const showFormularioNuevoPago = ref(false)
  const showDetallePago = ref(false)
  const pagoSeleccionado = ref<Pago | null>(null)
  const modoEdicion = ref(false)
  const toast = useToast()
  const detallesPlan = ref<DetallePlan[]>([])
  const { handleAndToastError } = useErrorHandler()

  // Getters
  const hasPlanActive = computed(() => !!planDePagoActivo.value)
  const totalPagos = computed(() => pagosData.value.length)
  const sumaPagos = computed(() => pagosData.value.reduce((sum, pago) => sum + pago.abono, 0))
  const primaRestante = computed(() => {
    const total = planData.value?.prima_total || 0
    return total - sumaPagos.value
  })
  const porcentajePagado = computed(() => {
    const total = planData.value?.prima_total || 0
    if (total === 0) return 0
    return Math.min(100, Math.round((sumaPagos.value / total) * 100))
  })

  // Actions
  async function abrirModalPagos(planId: string, cliente: Cliente | null) {
    console.log('[PagosStore] Abriendo modal para plan:', planId, 'con cliente:', cliente?.nombres);
    planDePagoActivo.value = planId
    clienteActivo.value = cliente
    modalVisible.value = true
    
    await cargarDatos()
  }

  function cerrarModalPagos() {
    modalVisible.value = false
    planDePagoActivo.value = null
    clienteActivo.value = null
    pagosData.value = []
    planData.value = null
    showFormularioNuevoPago.value = false
    showDetallePago.value = false
    pagoSeleccionado.value = null
    modoEdicion.value = false
    detallesPlan.value = []
  }

  async function cargarDatos() {
    if (!planDePagoActivo.value) return false
    
    isLoading.value = true
    error.value = null
    
    try {
      const { getPlanDePago } = usePlanDePago()
      const { getPagos } = usePagos()
      
      // Cargar datos en paralelo
      const [planResponse, pagosResponse] = await Promise.all([
        getPlanDePago(planDePagoActivo.value),
        getPagos(planDePagoActivo.value)
      ])
      
      if (!planResponse.ok) {
        throw new Error(`Error al cargar plan de pago: ${planResponse.message}`)
      }
      planData.value = planResponse.data
      
      if (!pagosResponse.ok) {
        throw new Error(`Error al cargar pagos: ${pagosResponse.message}`)
      }
      pagosData.value = pagosResponse.data
      
      await cargarDetallesPlan()
      return true
    } catch (err) {
      error.value = handleAndToastError(err, 'PagosStore/cargarDatos', 'Error al cargar los datos de pagos')
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  async function cargarDetallesPlan() {
    if (!planDePagoActivo.value) return []
    
    try {
      const { data, error: dbError } = await supabase
        .from('plan_de_pago_detalle')
        .select('*')
        .eq('id_plan', planDePagoActivo.value)
        .order('numero_pago', { ascending: true })
        
      if (dbError) throw dbError
      
      detallesPlan.value = data
      return data
    } catch (err) {
      console.error('[PagosStore/cargarDetallesPlan] Error:', err)
      detallesPlan.value = []
      return []
    }
  }
  
  async function obtenerPagosPorPlanId(planId: string) {
    try {
      const { data, error: dbError } = await supabase
        .from('pagos_de_polizas')
        .select('*')
        .eq('id_plan', planId)
        .order('fecha', { ascending: false })
        
      if (dbError) throw dbError
      
      return data as Pago[]
    } catch (err) {
      console.error(`[PagosStore/obtenerPagosPorPlanId(${planId})] Error:`, err)
      return []
    }
  }
  
  function mostrarFormularioNuevoPago() {
    showFormularioNuevoPago.value = true
    showDetallePago.value = false
    pagoSeleccionado.value = null
  }
  
  function cerrarFormularioNuevoPago() {
    showFormularioNuevoPago.value = false
  }
  
  function verPago(pago: Pago) {
    pagoSeleccionado.value = pago
    modoEdicion.value = false
    showDetallePago.value = true
    showFormularioNuevoPago.value = false
  }
  
  function editarPago(pago: Pago) {
    pagoSeleccionado.value = pago
    modoEdicion.value = true
    showDetallePago.value = true
    showFormularioNuevoPago.value = false
  }
  
  function cerrarDetallePago() {
    showDetallePago.value = false
    pagoSeleccionado.value = null
    modoEdicion.value = false
  }
  
  async function guardarNuevoPago(datosPago: CreatePagoDTO) {
    if (!planDePagoActivo.value) return false;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const { createPago } = usePagos();
      
      // Si el pago está asociado a una cuota, actualizar el estado de la cuota
      if (datosPago.id_detalle) {
        const detalleExiste = detallesPlan.value.find(d => d.id_detalle === datosPago.id_detalle);
        if (!detalleExiste) {
          throw new Error('La cuota seleccionada no existe o no pertenece a este plan de pago');
        }
        
        // Verificar si el monto del pago coincide con el monto de la cuota
        if (datosPago.abono !== undefined && detalleExiste.monto !== datosPago.abono) {
          const confirmar = confirm(
            `El monto del pago (L.${datosPago.abono.toLocaleString('es-HN')}) no coincide con el monto de la cuota seleccionada (L.${detalleExiste.monto.toLocaleString('es-HN')}). ¿Desea continuar de todas formas?`
          );
          if (!confirmar) {
            isLoading.value = false;
            return false;
          }
        }
        
        // Actualizar estado de la cuota a 'pagado'
        const { error: updateError } = await supabase
          .from('plan_de_pago_detalle')
          .update({ 
            estado: 'pagado',
            fecha_modificado: new Date().toISOString(),
          })
          .eq('id_detalle', datosPago.id_detalle);
          
        if (updateError) {
          console.error('Error al actualizar estado de la cuota:', updateError);
          toast.warning('Se creará el pago, pero hubo un problema al actualizar el estado de la cuota');
        }
      } else if (detallesPlan.value.length > 0) {
        // Si no se seleccionó cuota específica pero hay cuotas pendientes, mostrar advertencia
        toast.warning('El pago se ha registrado sin asociarse a una cuota específica. Esto puede dificultar el seguimiento de pagos.');
      }
      
      const pagoConPlan: CreatePagoDTO = {
        ...datosPago,
        id_plan: planDePagoActivo.value
      };
      
      const response = await createPago(pagoConPlan);
      
      if (!response.ok) {
        // Si hubo error al crear el pago pero ya se actualizó la cuota, revertir cambio
        if (datosPago.id_detalle) {
          await supabase
            .from('plan_de_pago_detalle')
            .update({ 
              estado: 'pendiente',
              fecha_modificado: new Date().toISOString() 
            })
            .eq('id_detalle', datosPago.id_detalle);
        }
        throw new Error(response.message || 'Error devuelto por createPago');
      }
      
      toast.success('Pago registrado correctamente');
      showFormularioNuevoPago.value = false;
      await cargarDatos();
      return true;
    } catch (err) {
      error.value = handleAndToastError(err, 'PagosStore/guardarNuevoPago', 'Error al registrar el nuevo pago');
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function actualizarPago(datosPago: UpdatePagoDTO & { id_pago: string }) {
    if (!datosPago.id_pago) return false;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const { updatePago } = usePagos();
      
      // Manejar cambios en la asociación de cuotas
      if (pagoSeleccionado.value?.id_detalle !== datosPago.id_detalle) {
        // Si había una cuota asociada anteriormente, cambiarla a pendiente
        if (pagoSeleccionado.value?.id_detalle) {
          const { error: resetError } = await supabase
            .from('plan_de_pago_detalle')
            .update({ 
              estado: 'pendiente',
              fecha_modificado: new Date().toISOString() 
            })
            .eq('id_detalle', pagoSeleccionado.value.id_detalle);
            
          if (resetError) {
            console.error('Error al restaurar estado de la cuota anterior:', resetError);
            toast.warning('Se actualizará el pago, pero hubo un problema al actualizar el estado de la cuota anterior');
          }
        }
        
        // Si se está asociando a una nueva cuota, verificar que exista y cambiarla a pagado
        if (datosPago.id_detalle) {
          const detalleExiste = detallesPlan.value.find(d => d.id_detalle === datosPago.id_detalle);
          if (!detalleExiste) {
            throw new Error('La cuota seleccionada no existe o no pertenece a este plan de pago');
          }
          
          // Verificar si el monto del pago coincide con el monto de la cuota
          if (datosPago.abono !== undefined && detalleExiste.monto !== datosPago.abono) {
            const confirmar = confirm(
              `El monto del pago (L.${datosPago.abono.toLocaleString('es-HN')}) no coincide con el monto de la cuota seleccionada (L.${detalleExiste.monto.toLocaleString('es-HN')}). ¿Desea continuar de todas formas?`
            );
            if (!confirmar) {
              isLoading.value = false;
              return false;
            }
          }
          
          const { error: updateError } = await supabase
            .from('plan_de_pago_detalle')
            .update({ 
              estado: 'pagado',
              fecha_modificado: new Date().toISOString() 
            })
            .eq('id_detalle', datosPago.id_detalle);
            
          if (updateError) {
            console.error('Error al actualizar estado de la nueva cuota:', updateError);
            toast.warning('Se actualizará el pago, pero hubo un problema al actualizar el estado de la nueva cuota');
          }
        } else if (detallesPlan.value.length > 0) {
          // Si se está desasociando de toda cuota, mostrar advertencia
          toast.warning('El pago se ha desasociado de cualquier cuota específica. Esto puede dificultar el seguimiento de pagos.');
        }
      }
      
      // Actualizar el pago en la base de datos
      const response = await updatePago(datosPago.id_pago, datosPago);
      
      if (!response.ok) {
        // Si hubo error al actualizar el pago, intentar revertir cambios en las cuotas
        if (pagoSeleccionado.value?.id_detalle !== datosPago.id_detalle) {
          // Revertir cuota anterior
          if (pagoSeleccionado.value?.id_detalle) {
            await supabase
              .from('plan_de_pago_detalle')
              .update({ estado: 'pagado' })
              .eq('id_detalle', pagoSeleccionado.value.id_detalle);
          }
          // Revertir nueva cuota
          if (datosPago.id_detalle) {
            await supabase
              .from('plan_de_pago_detalle')
              .update({ estado: 'pendiente' })
              .eq('id_detalle', datosPago.id_detalle);
          }
        }
        
        throw new Error(response.message || 'Error devuelto por updatePago');
      }
      
      toast.success('Pago actualizado correctamente');
      cerrarDetallePago();
      await cargarDatos();
      return true;
    } catch (err) {
      error.value = handleAndToastError(err, 'PagosStore/actualizarPago', 'Error al actualizar el pago');
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  
  async function eliminarPago(idPago: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { data: pago } = await supabase.from('pagos_de_polizas').select('id_detalle').eq('id_pago', idPago).single();
      if (pago?.id_detalle) {
        await supabase.from('plan_de_pago_detalle').update({ estado: 'pendiente' }).eq('id_detalle', pago.id_detalle);
      }
      
      const { error: updateError } = await supabase
        .from('pagos_de_polizas')
        .update({ estado: false })
        .eq('id_pago', idPago);
        
      const errorMessage = updateError ? updateError.message : undefined;
      if (updateError) throw new Error(errorMessage || 'Error desconocido al actualizar estado del pago');
      const response = { ok: !updateError, message: errorMessage };

      if (!response.ok) {
        throw new Error(response.message || 'Error devuelto al eliminar pago');
      }
      
      toast.success('Pago eliminado correctamente');
      
      pagosData.value = pagosData.value.filter(p => p.id_pago !== idPago);
      if (pagoSeleccionado.value?.id_pago === idPago) {
        cerrarDetallePago();
      }
      await cargarDetallesPlan();
      
      return true;
    } catch (err) {
      error.value = handleAndToastError(err, 'PagosStore/eliminarPago', 'Error al eliminar el pago');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    planDePagoActivo,
    clienteActivo,
    modalVisible,
    pagosData,
    planData,
    isLoading,
    error,
    showFormularioNuevoPago,
    showDetallePago,
    pagoSeleccionado,
    modoEdicion,
    detallesPlan,
    
    // Getters
    hasPlanActive,
    totalPagos,
    sumaPagos,
    primaRestante,
    porcentajePagado,
    
    // Actions
    abrirModalPagos,
    cerrarModalPagos,
    cargarDatos,
    cargarDetallesPlan,
    obtenerPagosPorPlanId,
    mostrarFormularioNuevoPago,
    cerrarFormularioNuevoPago,
    verPago,
    editarPago,
    cerrarDetallePago,
    guardarNuevoPago,
    actualizarPago,
    eliminarPago
  }
}) 