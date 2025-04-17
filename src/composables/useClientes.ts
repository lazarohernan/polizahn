import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth.store'

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
  const authStore = useAuthStore()

  const getClientes = async (page = 1, limit = 10) => {
    try {
      loading.value = true
      error.value = null
      
      const from = (page - 1) * limit
      const to = from + limit - 1

      console.log("Obteniendo clientes con parámetros:", { page, limit, from, to })
      console.log("ID Correduría (para RLS):", authStore.id_correduria)

      // Consulta modificada para obtener todos los clientes sin filtrar por correduría
      // La política RLS se encargará de filtrar según los permisos del usuario
      const { data, error: err, count } = await supabase
        .from('clientes')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('fecha_creado', { ascending: false })

      if (err) {
        console.error("Error al obtener clientes:", err)
        throw err
      }

      console.log("Clientes obtenidos:", data?.length || 0, "Total:", count)
      
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
      console.error("Error completo al obtener clientes:", err)
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

  /**
   * Asocia un cliente con una correduría
   */
  const associateClienteWithCorreduria = async (idCliente: string, idCorreduria: string) => {
    try {
      console.log("associateClienteWithCorreduria - iniciando con params:", { idCliente, idCorreduria })
      
      if (!idCliente || !idCorreduria) {
        const error = new Error('ID de cliente o correduría no válido')
        console.error("associateClienteWithCorreduria - error de validación:", error)
        throw error
      }

      // Verificar que el ID de correduría exista
      const { data: correduriaData, error: correduriaError } = await supabase
        .from('corredurias')
        .select('id_correduria')
        .eq('id_correduria', idCorreduria)
        .single()

      if (correduriaError) {
        console.error("associateClienteWithCorreduria - error al verificar correduría:", correduriaError)
        throw new Error(`La correduría con ID ${idCorreduria} no existe`)
      }

      console.log("associateClienteWithCorreduria - correduría verificada:", correduriaData)

      // Realizar la inserción
      const { data, error: err } = await supabase
        .from('clientes_por_correduria')
        .insert({
          id_cliente: idCliente,
          id_correduria: idCorreduria
        })
        .select()
        .single()

      if (err) {
        console.error("associateClienteWithCorreduria - error al insertar:", err)
        throw err
      }

      console.log("associateClienteWithCorreduria - asociación exitosa:", data)
      return data
    } catch (err) {
      error.value = (err as Error).message
      console.error('Error al asociar cliente con correduría:', err)
      throw err
    }
  }

  const createCliente = async (cliente: ClienteInsert) => {
    try {
      loading.value = true
      error.value = null

      console.log("1. Iniciando creación de cliente", cliente)
      console.log("2. ID correduria actual:", authStore.id_correduria)

      // Asegurarnos de que el cliente tenga fecha_creado y creado_por
      const clienteCompleto = {
        ...cliente,
        fecha_creado: new Date(),
        creado_por: authStore.user?.id
      }

      // Paso 1: Crear el cliente
      const { data, error: err } = await supabase
        .from('clientes')
        .insert(clienteCompleto)
        .select()
        .single()

      if (err) {
        console.error("3. Error al crear el cliente:", err)
        throw err
      }

      console.log("4. Cliente creado exitosamente:", data)

      // Paso 2: Si el cliente se creó correctamente y tenemos una correduría actual,
      // asociamos el cliente con esa correduría
      if (data && authStore.id_correduria) {
        try {
          console.log("5. Intentando asociar cliente con correduría:", {
            idCliente: data.id_cliente,
            idCorreduria: authStore.id_correduria
          })
          
          const asociacionResult = await associateClienteWithCorreduria(data.id_cliente, authStore.id_correduria)
          console.log("6. Resultado de la asociación:", asociacionResult)
        } catch (associationError) {
          console.error("7. Error al asociar cliente con correduría:", associationError)
          // No lanzamos error aquí, ya que el cliente se creó correctamente
          // Solo registramos el error para debugging
        }
      } else {
        console.warn("5. No se pudo asociar cliente con correduría porque:", !data ? "No hay datos del cliente" : "No hay ID de correduría")
      }

      toast.success('Cliente creado exitosamente')
      if (data) {
        clientes.value = [data as Cliente, ...clientes.value]
        totalRegistros.value++
      }

      return data as Cliente
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      console.error("Error completo al crear cliente:", err)
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
    deleteCliente,
    associateClienteWithCorreduria
  }
} 