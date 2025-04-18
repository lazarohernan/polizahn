import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'
import type { Cliente } from '@/interfaces/cliente_interface'
import { useErrorHandler } from '@/composables/useErrorHandler'

export const useClientesStore = defineStore('clientes', () => {
  // Estado
  const clientes = ref<Cliente[]>([])
  const clienteActivo = ref<Cliente | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const toast = useToast()
  const { handleAndToastError } = useErrorHandler()

  // Getters
  const clienteById = computed(() => {
    return (id: string) => clientes.value.find(cliente => cliente.id_cliente === id) || null
  })

  const totalClientes = computed(() => clientes.value.length)

  // Acciones
  async function cargarClientes() {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('clientes')
        .select('*')
        .eq('estado', true)
        .order('nombres', { ascending: true })

      if (dbError) throw dbError

      clientes.value = (data || []) as Cliente[]
      return data || []
    } catch (err) {
      error.value = handleAndToastError(err, 'ClientesStore/cargarClientes', 'Error al cargar la lista de clientes')
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function obtenerClientePorId(id: string) {
    const clienteEncontrado = clienteById.value(id)
    if (clienteEncontrado) return clienteEncontrado

    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_cliente', id)
        .single()

      if (dbError) throw dbError

      const clienteNuevo = data as Cliente
      const index = clientes.value.findIndex(c => c.id_cliente === id)
      if (index !== -1) {
        clientes.value[index] = clienteNuevo
      } else {
        clientes.value.push(clienteNuevo)
      }

      return clienteNuevo
    } catch (err) {
      error.value = handleAndToastError(err, `ClientesStore/obtenerClientePorId(${id})`)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function crearCliente(clienteData: Omit<Cliente, 'id_cliente' | 'fecha_creado' | 'creado_por' | 'estado'>) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('clientes')
        .insert({
          ...clienteData,
          estado: true
        })
        .select()
        .single()

      if (dbError) throw dbError

      const nuevoCliente = data as Cliente
      clientes.value.push(nuevoCliente)
      toast.success('Cliente creado exitosamente')
      return nuevoCliente
    } catch (err) {
      error.value = handleAndToastError(err, 'ClientesStore/crearCliente', 'Error al crear el cliente')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function actualizarCliente(id: string, datosCliente: Partial<Cliente>) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: dbError } = await supabase
        .from('clientes')
        .update({
          ...datosCliente,
          fecha_modificado: new Date().toISOString()
        })
        .eq('id_cliente', id)
        .select()
        .single()

      if (dbError) throw dbError

      const clienteActualizado = data as Cliente
      const index = clientes.value.findIndex(c => c.id_cliente === id)
      if (index !== -1) {
        clientes.value[index] = clienteActualizado
      }

      toast.success('Cliente actualizado exitosamente')
      return clienteActualizado
    } catch (err) {
      error.value = handleAndToastError(err, `ClientesStore/actualizarCliente(${id})`, 'Error al actualizar el cliente')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function eliminarCliente(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const { error: dbError } = await supabase
        .from('clientes')
        .update({ estado: false })
        .eq('id_cliente', id)

      if (dbError) throw dbError

      clientes.value = clientes.value.filter(c => c.id_cliente !== id)
      toast.success('Cliente eliminado exitosamente')
      return true
    } catch (err) {
      error.value = handleAndToastError(err, `ClientesStore/eliminarCliente(${id})`, 'Error al eliminar el cliente')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    clientes,
    clienteActivo,
    isLoading,
    error,

    // Getters
    clienteById,
    totalClientes,

    // Acciones
    cargarClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
  }
}) 