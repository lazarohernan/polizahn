import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
const userRole = ref(null);
const userPermissions = ref(new Set());
export function usePermissions() {
    const authStore = useAuthStore();
    const { user } = storeToRefs(authStore);
    // Estados
    const permissionsLoaded = ref(false);
    const permissions = ref({});
    const loading = ref(false);
    const error = ref(null);
    // Permisos base por rol
    const superadminPermissions = {
        polizas_view: true,
        polizas_create: true,
        polizas_edit: true,
        polizas_delete: true,
        clientes_view: true,
        clientes_create: true,
        clientes_edit: true,
        clientes_delete: true,
        aseguradoras_view: true,
        aseguradoras_create: true,
        aseguradoras_edit: true,
        aseguradoras_delete: true,
        sistema_configuracion: true,
        corredurias_gestion: true
    };
    const adminPermissions = {
        polizas_view: true,
        polizas_create: true,
        polizas_edit: true,
        polizas_delete: true,
        clientes_view: true,
        clientes_create: true,
        clientes_edit: true,
        clientes_delete: true,
        aseguradoras_view: true,
        aseguradoras_create: false,
        aseguradoras_edit: false,
        aseguradoras_delete: false,
        sistema_configuracion: true,
        corredurias_gestion: true
    };
    const tecnicoPermissions = {
        polizas_view: true,
        polizas_create: false,
        polizas_edit: false,
        polizas_delete: false,
        clientes_view: true,
        clientes_create: false,
        clientes_edit: false,
        clientes_delete: false,
        aseguradoras_view: false,
        aseguradoras_create: false,
        aseguradoras_edit: false,
        aseguradoras_delete: false,
        sistema_configuracion: false,
        corredurias_gestion: false
    };
    // Getters computados
    /**
     * Verifica si el usuario está autenticado
     */
    const isAuthenticated = computed(() => {
        return !!user.value;
    });
    /**
     * Verifica si el usuario es superadmin (solo basado en auth)
     */
    const isSuperAdmin = computed(() => {
        const authRole = user.value?.app_metadata?.role || user.value?.user_metadata?.role;
        return authRole === 'superadmin';
    });
    /**
     * Verifica si el usuario es admin (basado en auth)
     */
    const isAdmin = computed(() => {
        const authRole = user.value?.app_metadata?.role || user.value?.user_metadata?.role;
        return authRole === 'admin';
    });
    /**
     * Verifica si el usuario es técnico (basado en auth)
     */
    const isTecnico = computed(() => {
        const authRole = user.value?.app_metadata?.role || user.value?.user_metadata?.role;
        return authRole === 'tecnico';
    });
    /**
     * Carga los permisos del usuario desde la base de datos
     */
    const loadPermissions = async () => {
        // Reiniciar estado
        loading.value = true;
        error.value = null;
        permissions.value = {};
        try {
            // Verificar autenticación
            if (!user.value?.id) {
                throw new Error('Usuario no autenticado');
            }
            // Asignar permisos base según el rol
            if (isSuperAdmin.value) {
                permissions.value = { ...superadminPermissions };
            }
            else if (isAdmin.value) {
                permissions.value = { ...adminPermissions };
            }
            else if (isTecnico.value) {
                permissions.value = { ...tecnicoPermissions };
            }
            // Si no es superadmin, intentar cargar permisos específicos de la BD
            // Pero si hay error, mantener los permisos base
            if (!isSuperAdmin.value) {
                try {
                    // Primero verificamos si existe el registro
                    const { data: checkData, error: checkError } = await supabase
                        .from('permisos_de_acceso')
                        .select('count')
                        .eq('id_usuario', user.value.id);
                    // Si hay registros, entonces cargamos los permisos
                    if (!checkError && checkData && checkData.length > 0 && checkData[0].count > 0) {
                        const { data: userPermissions, error: permissionsError } = await supabase
                            .from('permisos_de_acceso')
                            .select('*')
                            .eq('id_usuario', user.value.id)
                            .single();
                        if (!permissionsError && userPermissions) {
                            // Combinar permisos base con específicos
                            permissions.value = {
                                ...permissions.value,
                                ...userPermissions
                            };
                        }
                    }
                    else {
                        console.log('No se encontraron permisos específicos para el usuario, usando permisos base por rol');
                    }
                }
                catch (err) {
                    console.warn('Error al verificar permisos específicos:', err);
                    // Continuamos con los permisos base
                }
            }
            permissionsLoaded.value = true;
        }
        catch (err) {
            console.error('Error al cargar permisos:', err);
            error.value = err instanceof Error ? err.message : 'Error inesperado al cargar permisos';
        }
        finally {
            loading.value = false;
        }
    };
    /**
     * Verifica si el usuario tiene un permiso específico
     * @param permissionKey Clave del permiso a verificar (ej: 'polizas_create')
     * @returns true si tiene permiso, false en caso contrario
     */
    const hasPermission = (permissionKey) => {
        // Si es superadmin, siempre tiene permiso
        if (isSuperAdmin.value)
            return true;
        // Si los permisos no están cargados, no tiene permiso
        if (!permissionsLoaded.value)
            return false;
        // Verificar el permiso específico
        return !!permissions.value[permissionKey];
    };
    /**
     * Verifica si el usuario puede acceder a un módulo específico
     * @param moduleName Nombre del módulo a verificar (ej: 'polizas', 'clientes', 'aseguradoras')
     * @returns true si tiene acceso, false en caso contrario
     */
    const canAccessModule = (moduleName) => {
        // Si es superadmin, siempre tiene acceso
        if (isSuperAdmin.value)
            return true;
        // Si los permisos no están cargados, no tiene acceso
        if (!permissionsLoaded.value)
            return false;
        // Verificar permisos de visualización para el módulo
        const viewPermissionKey = `${moduleName}_view`;
        // Si tiene permiso de visualización para el módulo, puede acceder
        return hasPermission(viewPermissionKey);
    };
    // Getters
    const role = computed(() => userRole.value);
    const permissionsComputed = computed(() => Array.from(userPermissions.value));
    // Métodos
    const setRole = (role) => {
        userRole.value = role;
        userPermissions.value = new Set(role.permissions);
    };
    const hasPermissionSet = (permission) => {
        return userPermissions.value.has(permission);
    };
    const hasAnyPermissionSet = (permissions) => {
        return permissions.some(p => userPermissions.value.has(p));
    };
    const hasAllPermissionSet = (permissions) => {
        return permissions.every(p => userPermissions.value.has(p));
    };
    const clearPermissions = () => {
        userRole.value = null;
        userPermissions.value.clear();
    };
    return {
        // Estados
        permissions,
        permissionsLoaded,
        loading,
        error,
        // Getters
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        isTecnico,
        role,
        permissionsComputed,
        // Métodos
        loadPermissions,
        hasPermission,
        canAccessModule,
        setRole,
        hasPermissionSet,
        hasAnyPermissionSet,
        hasAllPermissionSet,
        clearPermissions
    };
}
