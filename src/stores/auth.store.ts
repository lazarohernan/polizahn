import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const id_correduria = ref<string>('')
  const toast = useToast()

  const isAuthenticated = computed(() => !!user.value)

  /**
   * Obtiene el id_correduria del usuario actual de múltiples fuentes
   * Intenta primero recuperarlo del localStorage, luego de la base de datos
   */
  const fetchUserCorreduria = async (userId: string): Promise<string> => {
    try {
      // 1. Intentar primero obtener de localStorage como respaldo
      const storedIdCorreduria = localStorage.getItem('id_correduria')
      
      if (storedIdCorreduria) {
        console.log('✅ Se obtuvo id_correduria del localStorage:', storedIdCorreduria)
        return storedIdCorreduria
      }
      
      // 2. Si no está en localStorage, consultar a la base de datos
      const { data, error } = await supabase
        .from('usuarios_corredurias')
        .select('id_correduria')
        .eq('auth_user_id', userId)
        .eq('id_rol', 2)
        .eq('estado', true)
      
      // Si no se encuentra ningún registro, esto no es un error técnico
      // simplemente significa que el usuario no tiene corredurías asignadas
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error al obtener correduría:', error.message)
        throw new Error(`Error técnico al obtener correduría: ${error.message}`)
      }
      
      // Manejo para múltiples resultados o ninguno
      if (data && data.length > 0) {
        // Tomamos el primer registro que cumpla los criterios
        const correduriId = data[0].id_correduria
        console.log('✅ Se obtuvo id_correduria de la base de datos:', correduriId)
        
        if (correduriId) {
          // Guardar en localStorage para futuros accesos
          localStorage.setItem('id_correduria', correduriId)
          return correduriId
        }
      }
      
      throw new Error('No se encontró una correduría asociada al usuario')
    } catch (error) {
      console.error('❌ Error en fetchUserCorreduria:', error)
      // Propagar el error para manejarlo en la capa superior
      throw error
    }
  }
  
  /**
   * Inicializa el store con la sesión actual y los datos del usuario
   */
  const initialize = async () => {
    try {
      loading.value = true
      // Obtener sesión actual y establecer listener
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null

      // Establecer listener para cambios de sesión
      await supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          console.log(`🔄 Cambio en autenticación: ${event}`, session?.user?.email)
          user.value = session?.user ?? null
          
          if (event === 'SIGNED_OUT') {
            id_correduria.value = ''
            localStorage.removeItem('id_correduria')
          } else if (session?.user && event === 'SIGNED_IN') {
            try {
              const userCorreduriaId = await fetchUserCorreduria(session.user.id)
              id_correduria.value = userCorreduriaId
            } catch (error) {
              console.error('❌ Error al obtener correduría después del login:', error)
              toast.error('No se pudo acceder a la información de su correduría')
              id_correduria.value = ''
            }
          }
        }
      )

      if (user.value) {
        try {
          // Obtener y establecer el id_correduria
          const userCorreduriaId = await fetchUserCorreduria(user.value.id)
          id_correduria.value = userCorreduriaId
        } catch (error) {
          console.warn('⚠️ No se pudo obtener la correduría durante la inicialización:', error)
          // No mostramos toast aquí para evitar mensajes durante la carga inicial
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene el perfil completo del usuario con la información de correduría
   */
  const getUserProfile = async () => {
    if (!user.value) return null

    try {
      // No usar .single() para evitar error cuando hay múltiples registros
      const { data, error } = await supabase
        .from('usuarios_corredurias')
        .select('*')
        .eq('auth_user_id', user.value.id)
        .eq('id_rol', 2)
        .eq('estado', true)
      
      // Manejar errores excepto cuando es un error de "no registros"
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error técnico al obtener perfil:', error)
        throw error
      }
      
      // Procesar datos si hay resultados
      if (data && data.length > 0) {
        const firstProfile = data[0]
        // Actualizar el id_correduria en el store y localStorage
        if (firstProfile.id_correduria) {
          id_correduria.value = firstProfile.id_correduria
          localStorage.setItem('id_correduria', firstProfile.id_correduria)
          console.log('✅ Perfil de usuario actualizado con id_correduria:', firstProfile.id_correduria)
        }
        return firstProfile
      }
      
      console.warn('⚠️ No se encontraron perfiles para este usuario')
      return null
    } catch (error) {
      console.error('❌ Error al obtener perfil de usuario:', error)
      return null
    }
  }
  
  /**
   * Actualiza manualmente el id_correduria en el store y localStorage
   */
  const updateCorreduria = (id: string) => {
    if (id) {
      id_correduria.value = id
      localStorage.setItem('id_correduria', id)
      console.log('✅ ID de correduría actualizado:', id)
    } else {
      console.warn('⚠️ Intento de actualizar correduría con ID vacío')
    }
  }

  return {
    user,
    loading,
    id_correduria,
    isAuthenticated,
    initialize,
    getUserProfile,
    fetchUserCorreduria,
    updateCorreduria
  }
})