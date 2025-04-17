import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
export function usePolizas() {
    const loading = ref(false);
    const error = ref(null);
    const getPolizas = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data: polizasData, error: polizasError } = await supabase
                .from('polizas')
                .select('*, aseguradoras(nombre)');
            if (polizasError) {
                throw new Error(polizasError.message || 'Error desconocido al obtener pólizas');
            }
            // Transformar los datos para incluir nombre_aseguradora
            const polizasTransformed = (polizasData || []).map(poliza => {
                const { aseguradoras, ...polizaBase } = poliza;
                return {
                    ...polizaBase,
                    nombre_aseguradora: aseguradoras?.nombre || ''
                };
            });
            return {
                ok: true,
                data: polizasTransformed,
                message: 'Pólizas obtenidas correctamente'
            };
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            error.value = errorMessage;
            return {
                ok: false,
                data: [],
                message: `Error al obtener las pólizas: ${errorMessage}`
            };
        }
        finally {
            loading.value = false;
        }
    };
    const getPoliza = async (id_poliza) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: err } = await supabase
                .from('polizas')
                .select('*, aseguradoras(nombre)')
                .eq('id_poliza', id_poliza)
                .single();
            if (err) {
                if (err.code === 'PGRST116') {
                    return {
                        ok: true,
                        data: null,
                        message: 'Póliza no encontrada'
                    };
                }
                throw new Error(err.message || `Error desconocido al obtener la póliza ${id_poliza}`);
            }
            if (data) {
                const { aseguradoras, ...polizaBase } = data;
                return {
                    ok: true,
                    data: {
                        ...polizaBase,
                        nombre_aseguradora: aseguradoras?.nombre || ''
                    },
                    message: 'Póliza obtenida correctamente'
                };
            }
            return {
                ok: true,
                data: null,
                message: 'Póliza no encontrada'
            };
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            error.value = errorMessage;
            return {
                ok: false,
                data: null,
                message: `Error al obtener la póliza: ${errorMessage}`
            };
        }
        finally {
            loading.value = false;
        }
    };
    const createPoliza = async (poliza) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: err } = await supabase
                .from('polizas')
                .insert(poliza)
                .select()
                .single();
            if (err) {
                throw new Error(err.message || 'Error desconocido al crear la póliza');
            }
            return {
                ok: true,
                data: data,
                message: 'Póliza creada correctamente'
            };
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            error.value = errorMessage;
            return {
                ok: false,
                data: null,
                message: `Error al crear la póliza: ${errorMessage}`
            };
        }
        finally {
            loading.value = false;
        }
    };
    const updatePoliza = async (id_poliza, poliza) => {
        loading.value = true;
        error.value = null;
        try {
            const { data, error: err } = await supabase
                .from('polizas')
                .update(poliza)
                .eq('id_poliza', id_poliza)
                .select()
                .single();
            if (err) {
                console.error(`Supabase error updating poliza ${id_poliza}:`, err);
                throw new Error(err.message || 'Error desconocido al actualizar la póliza');
            }
            // Similar a create, la respuesta no incluye relaciones.
            return {
                ok: true,
                data: data, // Devolvemos BasePoliza
                message: 'Póliza actualizada correctamente'
            };
        }
        catch (e) {
            console.error(`Error in updatePoliza (${id_poliza}):`, e);
            const errorMessage = e instanceof Error ? e.message : String(e);
            error.value = errorMessage;
            return {
                ok: false,
                data: null,
                message: `Error al actualizar la póliza: ${errorMessage}`
            };
        }
        finally {
            loading.value = false;
        }
    };
    const deletePoliza = async (id_poliza) => {
        loading.value = true;
        error.value = null;
        try {
            // Eliminación real en lugar de soft delete
            const { error: err } = await supabase
                .from('polizas')
                .delete()
                .eq('id_poliza', id_poliza);
            if (err) {
                console.error(`Supabase error deleting poliza ${id_poliza}:`, err);
                throw new Error(err.message || 'Error desconocido al eliminar la póliza');
            }
            return {
                ok: true,
                data: null, // No data to return on delete
                message: 'Póliza eliminada correctamente'
            };
        }
        catch (e) {
            console.error(`Error in deletePoliza (${id_poliza}):`, e);
            const errorMessage = e instanceof Error ? e.message : String(e);
            error.value = errorMessage;
            return {
                ok: false,
                data: null,
                message: `Error al eliminar la póliza: ${errorMessage}`
            };
        }
        finally {
            loading.value = false;
        }
    };
    // Asegúrate de que todas las funciones y variables necesarias estén definidas y retornadas
    return {
        loading,
        error,
        getPolizas,
        getPoliza,
        createPoliza,
        updatePoliza,
        deletePoliza
    };
}
