import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export const useSiniestros = () => {
    const loading = ref(false);
    const error = ref(null);
    const getSiniestros = async () => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('siniestros')
                .select(`
          *,
          cliente:clientes(nombre, email),
          poliza:polizas(numero, nombre)
        `)
                .order('fecha_creado', { ascending: false });
            if (err)
                throw err;
            if (!data || data.length === 0) {
                return {
                    ok: true,
                    data: [],
                    message: 'No hay siniestros registrados en el sistema'
                };
            }
            return {
                ok: true,
                data,
                message: 'Siniestros obtenidos correctamente'
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error al obtener los siniestros';
            error.value = message;
            console.error('Error en getSiniestros:', err);
            return { ok: false, data: null, message };
        }
        finally {
            loading.value = false;
        }
    };
    const getSiniestroById = async (id) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('siniestros')
                .select(`
          *,
          cliente:clientes(nombre, email),
          poliza:polizas(numero, nombre),
          documentos_siniestros(*)
        `)
                .eq('id_siniestro', id)
                .single();
            if (err) {
                if (err.code === 'PGRST116') {
                    return {
                        ok: true,
                        data: null,
                        message: 'El siniestro solicitado no existe'
                    };
                }
                throw err;
            }
            if (!data) {
                return {
                    ok: true,
                    data: null,
                    message: 'No se encontró el siniestro solicitado'
                };
            }
            return {
                ok: true,
                data,
                message: 'Siniestro obtenido correctamente'
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Error al obtener el siniestro';
            error.value = message;
            console.error('Error en getSiniestroById:', err);
            return { ok: false, data: null, message };
        }
        finally {
            loading.value = false;
        }
    };
    const updateSiniestroStatus = async (id, estatus) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('siniestros')
                .update({ estatus })
                .eq('id_siniestro', id)
                .select()
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data,
                message: 'Estado actualizado correctamente'
            };
        }
        catch (err) {
            const message = 'Error al actualizar el estado';
            error.value = message;
            console.error(message, err);
            return { ok: false, data: null, message };
        }
        finally {
            loading.value = false;
        }
    };
    return {
        loading,
        error,
        getSiniestros,
        getSiniestroById,
        updateSiniestroStatus
    };
};
