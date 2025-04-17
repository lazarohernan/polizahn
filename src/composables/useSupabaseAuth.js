import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export function useSupabaseAuth() {
    const loading = ref(false);
    const error = ref(null);
    const signIn = async (email, password) => {
        try {
            loading.value = true;
            error.value = null;
            // Validación adicional
            if (!email || !password) {
                throw new Error('Email y contraseña son requeridos');
            }
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInError) {
                // Mejorar el manejo de errores
                if (signInError.message.includes('Invalid login credentials')) {
                    throw new Error('Credenciales inválidas');
                }
                throw signInError;
            }
            // Verificar el rol del usuario
            const userRole = data.user?.user_metadata?.role ||
                data.user?.app_metadata?.role;
            if (!userRole) {
                throw new Error('Usuario sin rol asignado');
            }
            return {
                ok: true,
                accessToken: data.session?.access_token,
                refreshToken: data.session?.refresh_token,
                user: data.user,
                role: userRole
            };
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al iniciar sesión';
            return {
                ok: false,
                error: error.value
            };
        }
        finally {
            loading.value = false;
        }
    };
    const signUp = async (email, password) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            });
            if (signUpError)
                throw signUpError;
            return {
                ok: true,
                user: data.user
            };
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al registrarse';
            return { ok: false };
        }
        finally {
            loading.value = false;
        }
    };
    const signOut = async () => {
        try {
            loading.value = true;
            error.value = null;
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError)
                throw signOutError;
            return { ok: true };
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al cerrar sesión';
            return { ok: false };
        }
        finally {
            loading.value = false;
        }
    };
    const resetPassword = async (email) => {
        try {
            loading.value = true;
            error.value = null;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
            if (resetError)
                throw resetError;
            return { ok: true };
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al restablecer contraseña';
            return { ok: false };
        }
        finally {
            loading.value = false;
        }
    };
    const updatePassword = async (newPassword) => {
        try {
            loading.value = true;
            error.value = null;
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (updateError)
                throw updateError;
            return { ok: true };
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al actualizar contraseña';
            return { ok: false };
        }
        finally {
            loading.value = false;
        }
    };
    return {
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword
    };
}
