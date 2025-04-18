import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Pago, CreatePagoDTO, UpdatePagoDTO } from '@/modules/admin/interfaces/pagos_interface'
import { useErrorHandler } from '@/composables/useErrorHandler'

export const usePagos = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { handleAndToastError } = useErrorHandler()

  const getPagos = async (id_plan: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('pagos_de_polizas')
        .select('*')
        .eq('id_plan', id_plan)
        .eq('estado', true)

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as Pago[],
        message: 'Pagos obtenidos correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePagos/getPagos(${id_plan})`)
      return {
        ok: false,
        data: [],
        message: 'Error al obtener los pagos'
      }
    } finally {
      loading.value = false
    }
  }

  const getPago = async (id_pago: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: dbError } = await supabase
        .from('pagos_de_polizas')
        .select('*')
        .eq('id_pago', id_pago)
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as Pago,
        message: 'Pago obtenido correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePagos/getPago(${id_pago})`)
      return {
        ok: false,
        data: null,
        message: 'Error al obtener el pago'
      }
    } finally {
      loading.value = false
    }
  }

  const createPago = async (pago: CreatePagoDTO) => {
    try {
      loading.value = true
      error.value = null

      // Si hay un comprobante (que es un archivo), primero lo subimos al storage
      let url_comprobante_final: string | null = null;
      if (pago.url_comprobante && pago.url_comprobante instanceof File) {
        const file = pago.url_comprobante;
        const fileExt = file.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `comprobantes/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('comprobantes_pago')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Obtener la URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
          .from('comprobantes_pago')
          .getPublicUrl(filePath)

        url_comprobante_final = publicUrl;
      } else if (typeof pago.url_comprobante === 'string') {
        // Si ya es una URL, la mantenemos
        url_comprobante_final = pago.url_comprobante;
      }

      // Crear el registro del pago
      const { data, error: dbError } = await supabase
        .from('pagos_de_polizas')
        .insert({
          id_plan: pago.id_plan,
          abono: pago.abono,
          fecha: pago.fecha || new Date().toISOString(),
          metodo_pago: pago.metodo_pago,
          url_comprobante: url_comprobante_final,
          id_detalle: pago.id_detalle,
          estado: true // Marcar como activo por defecto
        })
        .select()
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as Pago,
        message: 'Pago creado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, 'usePagos/createPago', 'Error al crear el pago')
      return {
        ok: false,
        data: null,
        message: 'Error al crear el pago'
      }
    } finally {
      loading.value = false
    }
  }

  const updatePago = async (id_pago: string, pago: UpdatePagoDTO) => {
    try {
      loading.value = true
      error.value = null

      // Si hay un nuevo comprobante (archivo), primero lo subimos al storage
      let url_comprobante_final: string | null | undefined = undefined; // undefined significa no tocar, null significa eliminar
      if (pago.url_comprobante && pago.url_comprobante instanceof File) {
        const file = pago.url_comprobante;
        const fileExt = file.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `comprobantes/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('comprobantes_pago')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Obtener la URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
          .from('comprobantes_pago')
          .getPublicUrl(filePath)

        url_comprobante_final = publicUrl;
      } 
      // Si explícitamente se puso a null (eliminar comprobante)
      else if (pago.url_comprobante === null) {
        url_comprobante_final = null;
      } 
      // Si es una cadena y no un archivo, no se sube nada, pero se usa la cadena (poco probable en update)
      else if (typeof pago.url_comprobante === 'string'){
         url_comprobante_final = pago.url_comprobante;
      }
      // Si no se proporciona (es undefined), url_comprobante_final se queda como undefined

      // Construir los datos de actualización solo con campos definidos
      const datosActualizacion: Partial<UpdatePagoDTO> = {}
      if (pago.abono !== undefined) datosActualizacion.abono = pago.abono;
      if (pago.fecha !== undefined) datosActualizacion.fecha = pago.fecha;
      if (pago.metodo_pago !== undefined) datosActualizacion.metodo_pago = pago.metodo_pago;
      if (pago.id_detalle !== undefined) datosActualizacion.id_detalle = pago.id_detalle;
      if (pago.estado !== undefined) datosActualizacion.estado = pago.estado;

      // Añadir url_comprobante solo si se debe actualizar (no es undefined)
      if (url_comprobante_final !== undefined) {
        datosActualizacion.url_comprobante = url_comprobante_final;
      }

      // Solo actualizar si hay datos que cambiar
      if (Object.keys(datosActualizacion).length === 0) {
        // Si no hay datos para actualizar, retornar el pago existente (o buscarlo si fuera necesario)
        const pagoExistente = await getPago(id_pago);
        if (!pagoExistente.ok) throw new Error('Pago original no encontrado para actualización vacía')
        return {
          ok: true,
          data: pagoExistente.data as Pago,
          message: 'No se realizaron cambios en el pago'
        }
      }

      // Actualizar el registro del pago
      const { data, error: dbError } = await supabase
        .from('pagos_de_polizas')
        .update(datosActualizacion)
        .eq('id_pago', id_pago)
        .select()
        .single()

      if (dbError) throw dbError

      return {
        ok: true,
        data: data as Pago,
        message: 'Pago actualizado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePagos/updatePago(${id_pago})`, 'Error al actualizar el pago')
      return {
        ok: false,
        data: null,
        message: 'Error al actualizar el pago'
      }
    } finally {
      loading.value = false
    }
  }

  const deletePago = async (id_pago: string) => {
    try {
      loading.value = true
      error.value = null

      // Soft delete - actualizar estado a false
      const { error: dbError } = await supabase
        .from('pagos_de_polizas')
        .update({ estado: false })
        .eq('id_pago', id_pago)

      if (dbError) throw dbError

      return {
        ok: true,
        message: 'Pago eliminado correctamente'
      }
    } catch (err) {
      error.value = handleAndToastError(err, `usePagos/deletePago(${id_pago})`, 'Error al eliminar el pago')
      return {
        ok: false,
        message: 'Error al eliminar el pago'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getPagos,
    getPago,
    createPago,
    updatePago,
    deletePago
  }
} 