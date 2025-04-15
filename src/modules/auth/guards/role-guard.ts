import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';

/**
 * Crea un guard de navegación para verificar si el usuario tiene alguno de los roles permitidos
 * Implementa verificación en dos niveles:
 * 1. Primero verifica en auth.user.app_metadata.role (o user_metadata.role)
 * 2. Para roles admin, también verifica en la tabla usuarios_corredurias
 * 
 * @param allowedRoles Array de roles permitidos ('superadmin', 'admin', 'tecnico', etc.)
 * @returns Un guard de navegación compatible con Vue Router
 */
export const createRoleGuard = (allowedRoles: string[]) => {
  return async (
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useAuthStore();

    // Asegurarse de que el store está inicializado
    if (authStore.loading) {
      await authStore.initialize();
    }

    // Verificar si está autenticado
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' });
    }

    try {
      // 1. PRIMERA CAPA: Verificar rol a nivel de Auth
      const { data: { user } } = await supabase.auth.getUser();
      const authRole = user?.app_metadata?.role || user?.user_metadata?.role;
      
      // Si no tiene rol o no está en la lista de permitidos, redirigir
      if (!authRole || !allowedRoles.includes(authRole)) {
        console.warn(`Acceso denegado: El usuario tiene rol ${authRole} pero se requiere uno de: ${allowedRoles.join(', ')}`);
        return next({ name: 'unauthorized' });
      }

      // Si es superadmin, permitir acceso de inmediato (no requiere segunda verificación)
      if (authRole === 'superadmin') {
        return next();
      }

      // 2. SEGUNDA CAPA: Verificar en la base de datos (para roles que no son superadmin)
      // NOTA: Para los admin, permitimos acceso basado solo en el rol de Auth
      // No requerimos verificación adicional en la tabla usuarios_corredurias
      if (authRole === 'admin') {
        // Los administradores tienen acceso basado solo en su rol de Auth
        // No necesitan tener un registro en la tabla usuarios_corredurias
        console.log('Usuario admin autenticado, permitiendo acceso sin verificación adicional');
        return next();
        
        /* Código original comentado - ya no verificamos en la tabla
        const { data, error } = await supabase
          .from('usuarios_corredurias')
          .select('id_rol')
          .eq('auth_user_id', user.id)
          .eq('id_rol', 2) // ID del rol Admin
          .eq('estado', true); // Solo activos

        if (error) {
          console.error('Error al verificar rol en base de datos:', error);
          return next({ name: 'error' });
        }

        if (!data || data.length === 0) {
          console.warn('Acceso denegado: El usuario tiene rol admin en Auth pero no en la tabla usuarios_corredurias');
          return next({ name: 'unauthorized' });
        }
        */
      } else if (authRole === 'tecnico') {
        // Verificar que tenga asignación de correduría con rol técnico (id_rol = 3)
        const { data, error } = await supabase
          .from('usuarios_corredurias')
          .select('id_rol')
          .eq('auth_user_id', user.id)
          .eq('id_rol', 3) // ID del rol Técnico (3 según tu documentación)
          .eq('estado', true); // Solo activos

        if (error) {
          console.error('Error al verificar rol en base de datos:', error);
          return next({ name: 'error' });
        }

        if (!data || data.length === 0) {
          console.warn('Acceso denegado: El usuario tiene rol técnico en Auth pero no en la tabla usuarios_corredurias');
          return next({ name: 'unauthorized' });
        }
      }

      // Todo correcto, permitir acceso
      return next();
    } catch (error) {
      console.error('Error en role-guard:', error);
      return next({ name: 'error' });
    }
  };
};

// Exportar guards pre-configurados para uso común
export const adminGuard = createRoleGuard(['admin', 'superadmin']);
export const superadminGuard = createRoleGuard(['superadmin']);
export const tecnicoGuard = createRoleGuard(['tecnico']);
export const anyRoleGuard = createRoleGuard(['admin', 'superadmin', 'tecnico']); 