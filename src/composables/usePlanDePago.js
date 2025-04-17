import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export const usePlanDePago = () => {
    const loading = ref(false);
    const error = ref(null);
    const getPlanesDePago = async (id_cliente) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('plan_de_pago')
                .select('*, polizas(nombre)')
                .eq('id_cliente', id_cliente);
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Planes de pago obtenidos correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: [],
                message: 'Error al obtener los planes de pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const getPlanDePago = async (id_plan) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('plan_de_pago')
                .select('*, polizas(nombre)')
                .eq('id_plan', id_plan)
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Plan de pago obtenido correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al obtener el plan de pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const createPlanDePago = async (planDePago) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('plan_de_pago')
                .insert(planDePago)
                .select()
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Plan de pago creado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al crear el plan de pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const updatePlanDePago = async (id_plan, planDePago) => {
        try {
            loading.value = true;
            error.value = null;
            const { data, error: err } = await supabase
                .from('plan_de_pago')
                .update(planDePago)
                .eq('id_plan', id_plan)
                .select()
                .single();
            if (err)
                throw err;
            return {
                ok: true,
                data: data,
                message: 'Plan de pago actualizado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                data: null,
                message: 'Error al actualizar el plan de pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    const deletePlanDePago = async (id_plan) => {
        try {
            loading.value = true;
            error.value = null;
            // Soft delete - actualizar estado a false
            const { error: err } = await supabase
                .from('plan_de_pago')
                .update({ estado: false })
                .eq('id_plan', id_plan);
            if (err)
                throw err;
            return {
                ok: true,
                message: 'Plan de pago eliminado correctamente'
            };
        }
        catch (err) {
            error.value = err.message;
            return {
                ok: false,
                message: 'Error al eliminar el plan de pago'
            };
        }
        finally {
            loading.value = false;
        }
    };
    return {
        loading,
        error,
        getPlanesDePago,
        getPlanDePago,
        createPlanDePago,
        updatePlanDePago,
        deletePlanDePago
    };
};
