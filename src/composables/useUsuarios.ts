import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'

type UsuarioCorreduria = {
  id_usuario: string
  correo: string
  nombre: string
  fecha_creado: string
}

export const useUsuarios = () => {
  const toast = useToast()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const usuarios = ref<UsuarioCorreduria[]>([])

  const getUsuariosPorCorreduria = async (id_correduria: string) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: err } = await supabase
        .from('usuarios_corredurias')
        .select('id_usuario, correo, nombre, fecha_creado')
        .eq('id_correduria', id_correduria)
        .order('nombre', { ascending: true })

      if (err) throw err

      usuarios.value = data as UsuarioCorreduria[]
      return {
        ok: true,
        data: usuarios.value,
        message: 'Usuarios obtenidos correctamente'
      }
    } catch (err) {
      error.value = (err as Error).message
      toast.error(error.value)
      return {
        ok: false,
        data: [],
        message: 'Error al obtener los usuarios'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    usuarios,
    
    // Métodos
    getUsuariosPorCorreduria
  }
} 