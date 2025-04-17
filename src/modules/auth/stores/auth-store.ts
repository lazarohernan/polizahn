import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useSupabaseAuth } from '@/composables/useSupabaseAuth';
import { useToast } from 'vue-toastification';

// Función helper para logs condicionales
const devLog = (message: string, ...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(message, ...args);
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const { signIn, signOut } = useSupabaseAuth();
  const toast = useToast();

  // Datos del perfil
  const nombre = ref(useLocalStorage('nombre', ''));
  const correo = ref(useLocalStorage('correo', ''));
  const foto = ref(useLocalStorage('foto', ''));
  const id_correduria = ref(useLocalStorage('id_correduria', ''));

  const isAuthenticated = computed(() => !!user.value);

  /**
   * Intenta obtener el id_correduria para un usuario específico
   */
  const fetchUserCorreduria = async (userId: string): Promise<string> => {
    try {
      // Verificar el rol del usuario para no hacer consultas innecesarias
      const { data: { user } } = await supabase.auth.getUser();
      const authRole = user?.app_metadata?.role || user?.user_metadata?.role;
      
      // Si es superadmin, retornar string vacío ya que no necesita correduría
      if (authRole === 'superadmin') {
        devLog('Usuario superadmin: No requiere obtener correduría');
        return '';
      }
      
      // Consultar la correduría asignada al usuario
      const { data, error } = await supabase
        .from('usuarios_corredurias')
        .select('id_correduria')
        .eq('auth_user_id', userId)
        .single();
      
      if (error) {
        devLog('No se encontró correduría asignada:', error);
        return '';
      }
      
      return data?.id_correduria || '';
    } catch (error) {
      devLog('Error al obtener correduría:', error);
      return '';
    }
  };

  const initialize = async () => {
    try {
      loading.value = true;
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      user.value = session?.user ?? null;

      if (user.value) {
        // Verificar el rol del usuario
        const userRole = user.value?.app_metadata?.role || 
                        user.value?.user_metadata?.role;
        
        devLog('Rol del usuario:', userRole);
        
        // Si es superadmin, no necesitamos obtener datos adicionales de correduría
        if (userRole === 'superadmin') {
          devLog('Usuario superadmin: No requiere correduría');
          id_correduria.value = '';
          loading.value = false;
          return; // Finalizar inicialización temprano para superadmin
        }

        // Solo para roles que no son superadmin, obtenemos perfil y correduría
        try {
          // Obtener datos del perfil si existe
          const { data: profile } = await supabase
            .from('perfiles')
            .select('*')
            .eq('auth_user_id', user.value.id)
            .single();

          if (profile) {
            nombre.value = profile.nombre || '';
            correo.value = profile.correo || '';
            foto.value = profile.avatar_url || '';
          }
          
          // Obtener correduría solo para roles distintos de superadmin
          try {
            const userCorreduriaId = await fetchUserCorreduria(user.value.id);
            id_correduria.value = userCorreduriaId;
          } catch (corrError) {
            devLog('No se pudo obtener correduría:', corrError);
            id_correduria.value = '';
          }
        } catch (error) {
          devLog('Error al obtener datos de perfil:', error);
        }
      }

      // Configurar listener para cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        devLog(`Cambio en autenticación: ${event}`);
        user.value = session?.user ?? null;
        
        if (event === 'SIGNED_OUT') {
          nombre.value = '';
          correo.value = '';
          foto.value = '';
          id_correduria.value = '';
        } else if (event === 'SIGNED_IN' && session?.user) {
          const userRole = session.user?.app_metadata?.role || 
                          session.user?.user_metadata?.role;
                          
          // Si es superadmin, no hacer nada más
          if (userRole === 'superadmin') {
            return;
          }
          
          try {
            // Reintentar obtener datos de perfil y correduría
            await initialize();
          } catch (error) {
            devLog('Error al reinicializar después del login:', error);
            toast.error('Error al cargar los datos de tu perfil');
          }
        }
      });
    } catch (error) {
      devLog('Error initializing auth:', error);
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await signIn(email, password);
      
      if (!response.ok || !response.user) {
        return false;
      }

      // Actualizar el store
      user.value = response.user;
      await initialize(); // Esto cargará el perfil del usuario

      return true;
    } catch (error) {
      devLog('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      user.value = null;
      nombre.value = '';
      correo.value = '';
      foto.value = '';
      id_correduria.value = '';
      return true;
    } catch (error) {
      devLog('Error during logout:', error);
      return false;
    }
  };

  const getUserProfile = async () => {
    if (!user.value) return null;

    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('auth_user_id', user.value.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      devLog('Error fetching user profile:', error);
      return null;
    }
  };

  const updateAvatarUrl = (newUrl: string) => {
    if (newUrl) {
      foto.value = newUrl;
      devLog('AuthStore: Avatar URL actualizada a', newUrl);
    } else {
      devLog('AuthStore: Se intentó actualizar el avatar con una URL vacía');
    }
  };

  return {
    // Properties
    user,
    loading,
    nombre,
    correo,
    foto,
    id_correduria,

    // Getters
    isAuthenticated,

    // Actions
    initialize,
    login,
    logout,
    getUserProfile,
    updateAvatarUrl,
    fetchUserCorreduria
  };
});
