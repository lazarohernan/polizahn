import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import { useToast } from 'vue-toastification';
export const useUsuarios = () => {
    const toast = useToast();
    const loading = ref(false);
    const error = ref(null);
    const usuarios = ref([]);
    const getUsuariosPorCorreduria = async (id_correduria) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('usuarios_corredurias')
                .select('id_usuario_correduria, auth_user_id, fecha_creado')
                .eq('id_correduria', id_correduria)
                .order('fecha_creado', { ascending: false });
            if (err)
                throw err;
            usuarios.value = data;
            return {
                ok: true,
                data: usuarios.value,
                message: 'Usuarios obtenidos correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            toast.error(error.value);
            return {
                ok: false,
                data: [],
                message: 'Error al obtener los usuarios'
            };
        }
        finally {
            loading.value = false;
        }
    };
    return {
        // Estado
        loading,
        error,
        usuarios,
        // Métodos
        getUsuariosPorCorreduria
    };
};
