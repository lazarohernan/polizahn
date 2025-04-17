import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToast } from 'vue-toastification'

type UsuarioCorreduria = {
  auth_user_id: string
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

      // Consulta a usuarios_corredurias para obtener los auth_user_id
      const { data: usuariosData, error: err } = await supabase
        .from('usuarios_corredurias')
        .select('id_usuario_correduria, auth_user_id, fecha_creado')
        .eq('id_correduria', id_correduria)
        .order('fecha_creado', { ascending: false })

      if (err) throw err

      // Si no hay usuarios, devolvemos un array vacío
      if (!usuariosData || usuariosData.length === 0) {
        usuarios.value = []
        return {
          ok: true,
          data: [],
          message: 'No hay usuarios para esta correduría'
        }
      }

      // Consultamos los perfiles correspondientes a los auth_user_id
      const authUserIds = usuariosData.map(usuario => usuario.auth_user_id)
      
      const { data: perfilesData, error: perfilesErr } = await supabase
        .from('perfiles')
        .select('auth_user_id, nombre, correo')
        .in('auth_user_id', authUserIds)

      if (perfilesErr) throw perfilesErr

      // Combinamos los datos
      const usuariosFormateados = usuariosData.map(usuario => {
        const perfil = perfilesData?.find(p => p.auth_user_id === usuario.auth_user_id)
        return {
          auth_user_id: usuario.auth_user_id,
          correo: perfil?.correo || '',
          nombre: perfil?.nombre || '',
          fecha_creado: usuario.fecha_creado
        }
      })

      usuarios.value = usuariosFormateados
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