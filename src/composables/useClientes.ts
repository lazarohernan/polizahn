import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { useToast } from 'vue-toastification'

type Cliente = Database['public']['Tables']['clientes']['Row']
type ClienteInsert = Database['public']['Tables']['clientes']['Insert']
type ClienteUpdate = Database['public']['Tables']['clientes']['Update']

export const useClientes = () => {
  const toast = useToast()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const clientes = ref<Cliente[]>([])
  const totalRegistros = ref(0)
  const paginaActual = ref(1)
  const limite = ref(10)

  const getClientes = async (page = 1, limit = 10) => {
    try {
      loading.value = true
      error.value = null
      
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error: err, count } = await supabase
        .from('clientes')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('fecha_creado', { ascending: false })

      if (err) throw err

      clientes.value = data as Cliente[]
      totalRegistros.value = count || 0
      paginaActual.value = page
      limite.value = limit

      return {
        clientes: clientes.value,
        total: totalRegistros.value,
        paginaActual: paginaActual.value,
        limite: limite.value,
        totalPaginas: Math.ceil(totalRegistros.value / limite.value)
      }
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return {
        clientes: [],
        total: 0,
        paginaActual: 1,
        limite: 10,
        totalPaginas: 0
      }
    } finally {
      loading.value = false
    }
  }

  const getClienteById = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_cliente', id)
        .single()

      if (err) throw err

      return data as Cliente
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const createCliente = async (cliente: ClienteInsert) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('clientes')
        .insert(cliente)
        .select()
        .single()

      if (err) throw err

      toast.success('Cliente creado exitosamente')
      if (data) {
        clientes.value = [data as Cliente, ...clientes.value]
        totalRegistros.value++
      }

      return data as Cliente
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateCliente = async (id: string, cliente: ClienteUpdate) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('clientes')
        .update(cliente)
        .eq('id_cliente', id)
        .select()
        .single()

      if (err) throw err

      toast.success('Cliente actualizado exitosamente')
      if (data) {
        const index = clientes.value.findIndex(c => c.id_cliente === id)
        if (index !== -1) {
          clientes.value[index] = data as Cliente
        }
      }

      return data as Cliente
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteCliente = async (id: string) => {
    try {
      loading.value = true
      error.value = null

      const { error: err } = await supabase
        .from('clientes')
        .delete()
        .eq('id_cliente', id)

      if (err) throw err

      toast.success('Cliente eliminado exitosamente')
      clientes.value = clientes.value.filter(c => c.id_cliente !== id)
      totalRegistros.value--

      return true
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    clientes,
    totalRegistros,
    paginaActual,
    limite,
    
    // Métodos
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
  }
} 