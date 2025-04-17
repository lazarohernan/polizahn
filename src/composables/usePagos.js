import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export const usePagos = () => {
    const loading = ref(false);
    const error = ref(null);
    const getPagos = async (id_plan) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('pagos')
                .select('*')
                .eq('id_plan', id_plan)
                .eq('estado', true);
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Pagos obtenidos correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: [],
                message: 'Error al obtener los pagos'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const getPago = async (id_pago) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('pagos')
                .select('*')
                .eq('id_pago', id_pago)
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Pago obtenido correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al obtener el pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const createPago = async (pago) => {
        try {
            loading.value = true;
            error.value = null;
            // Si hay un comprobante, primero lo subimos al storage
            let url_comprobante = null;
            if (pago.comprobante) {
                const fileExt = pago.comprobante.name.split('.').pop();
                const fileName = `${crypto.randomUUID()}.${fileExt}`;
                const filePath = `comprobantes/${fileName}`;
                const { error: uploadError } = await supabase.storage
                    .from('pagos')
                    .upload(filePath, pago.comprobante);
                if (uploadError)
                    throw uploadError;
                // Obtener la URL pública del archivo
                const { data: { publicUrl } } = supabase.storage
                    .from('pagos')
                    .getPublicUrl(filePath);
                url_comprobante = publicUrl;
            }
            // Crear el registro del pago
            const { data, error: err } = await supabase
                .from('pagos')
                .insert({
                id_plan: pago.id_plan,
                abono: pago.abono,
                fecha: pago.fecha || new Date().toISOString(),
                metodo_pago: pago.metodo_pago,
                url_comprobante
            })
                .select()
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Pago creado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al crear el pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const updatePago = async (id_pago, pago) => {
        try {
            loading.value = true;
            error.value = null;
            // Si hay un nuevo comprobante, primero lo subimos al storage
            let url_comprobante = undefined;
            if (pago.comprobante) {
                const fileExt = pago.comprobante.name.split('.').pop();
                const fileName = `${crypto.randomUUID()}.${fileExt}`;
                const filePath = `comprobantes/${fileName}`;
                const { error: uploadError } = await supabase.storage
                    .from('pagos')
                    .upload(filePath, pago.comprobante);
                if (uploadError)
                    throw uploadError;
                // Obtener la URL pública del archivo
                const { data: { publicUrl } } = supabase.storage
                    .from('pagos')
                    .getPublicUrl(filePath);
                url_comprobante = publicUrl;
            }
            // Actualizar el registro del pago
            const { data, error: err } = await supabase
                .from('pagos')
                .update({
                abono: pago.abono,
                fecha: pago.fecha,
                metodo_pago: pago.metodo_pago,
                ...(url_comprobante && { url_comprobante })
            })
                .eq('id_pago', id_pago)
                .select()
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Pago actualizado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al actualizar el pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const deletePago = async (id_pago) => {
        try {
            loading.value = true;
            error.value = null;
            // Soft delete - actualizar estado a false
            const { error: err } = await supabase
                .from('pagos')
                .update({ estado: false })
                .eq('id_pago', id_pago);
            if (err)
                throw err;
            return {
                ok: true,
                message: 'Pago eliminado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                message: 'Error al eliminar el pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    return {
        loading,
        error,
        getPagos,
        getPago,
        createPago,
        updatePago,
        deletePago
    };
};
