import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/composables/useSupabaseAuth';
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
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
                // Verificar el rol del usuario
                const userRole = user.value?.app_metadata?.role || 
                                user.value?.user_metadata?.role;
                
                console.log('Rol del usuario:', userRole);
                
                // Si es superadmin, no necesitamos obtener datos adicionales de correduría
                if (userRole === 'superadmin') {
                    console.log('Usuario superadmin: No requiere correduría');
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
                        const { data: userCorreduria } = await supabase
                            .from('usuarios_corredurias')
                            .select('id_correduria')
                            .eq('auth_user_id', user.value.id)
                            .single();
                        id_correduria.value = userCorreduria?.id_correduria || '';
                    } catch (corrError) {
                        console.warn('No se pudo obtener correduría:', corrError);
                        id_correduria.value = '';
                    }
                } catch (error) {
                    console.warn('Error al obtener datos de perfil:', error);
                }
            }

            // Configurar listener para cambios de autenticación
            supabase.auth.onAuthStateChange((event, session) => {
                console.log(`Cambio en autenticación: ${event}`);
                user.value = session?.user ?? null;
                
                if (event === 'SIGNED_OUT') {
                    nombre.value = '';
                    correo.value = '';
                    foto.value = '';
                    id_correduria.value = '';
                }
            });
        }
        catch (error) {
            console.error('Error initializing auth:', error);
        }
        finally {
            loading.value = false;
        }
    };
    const login = async (email, password) => {
        try {
            const response = await signIn(email, password);
            if (!response.ok || !response.user) {
                return false;
            }
            // Actualizar el store
            user.value = response.user;
            await initialize(); // Esto cargará el perfil del usuario
            return true;
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    };
    const getUserProfile = async () => {
        if (!user.value)
            return null;
        try {
            const { data, error } = await supabase
                .from('perfiles')
                .select('*')
                .eq('auth_user_id', user.value.id)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };
    const updateAvatarUrl = (newUrl) => {
        if (newUrl) {
            foto.value = newUrl;
            console.log('AuthStore: Avatar URL actualizada a', newUrl);
        }
        else {
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
