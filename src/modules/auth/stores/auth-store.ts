import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useSupabaseAuth } from '@/composables/useSupabaseAuth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const { signIn, signOut } = useSupabaseAuth();

  // Datos del perfil
  const nombre = ref(useLocalStorage('nombre', ''));
  const correo = ref(useLocalStorage('correo', ''));
  const foto = ref(useLocalStorage('foto', ''));
  const id_correduria = ref(useLocalStorage('id_correduria', ''));

  const isAuthenticated = computed(() => !!user.value);

  const initialize = async () => {
    try {
      loading.value = true;
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      user.value = session?.user ?? null;

      if (user.value) {
        // Obtener datos del perfil
        const { data: profile } = await supabase
          .from('perfiles')
          .select('*')
          .eq('auth_user_id', user.value.id)
          .single();

        if (profile) {
          nombre.value = profile.nombre || '';
          correo.value = profile.correo || '';
          foto.value = profile.avatar_url || '';
          // Debemos obtener la correduría de la tabla usuarios_corredurias
          const { data: userCorreduria } = await supabase
            .from('usuarios_corredurias')
            .select('id_correduria')
            .eq('auth_user_id', user.value.id)
            .single();
            
          id_correduria.value = userCorreduria?.id_correduria || '';
        }
      }

      // Escuchar cambios en la autenticación
      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        user.value = session?.user ?? null;
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
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
      console.error('Error during login:', error);
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
      console.error('Error during logout:', error);
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
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateAvatarUrl = (newUrl: string) => {
    if (newUrl) {
      foto.value = newUrl;
      console.log('AuthStore: Avatar URL actualizada a', newUrl);
    } else {
      console.warn('AuthStore: Se intentó actualizar el avatar con una URL vacía');
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
    updateAvatarUrl
  };
});
