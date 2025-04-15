<template>
  <div v-if="!permissions.loading.value && shouldRender">
    <slot></slot>
  </div>
  <div v-else-if="permissions.loading.value" class="opacity-50">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePermissions } from '@/composables/usePermissions';

const props = defineProps<{
  /** 
   * Permiso requerido para mostrar el contenido 
   * Ejemplos: polizas_create, clientes_edit, aseguradoras_view
   */
  requires?: string;
  
  /**
   * Rol requerido para mostrar el contenido
   * Superadmin siempre verá el contenido
   */
  role?: 'admin' | 'superadmin' | 'tecnico';
  
  /**
   * Si es true, el contenido se mostrará solo para superadmin
   */
  superadminOnly?: boolean;
}>();

const permissions = usePermissions();

// Cargar permisos al montar el componente
onMounted(async () => {
  try {
    if (!permissions.permissionsLoaded.value) {
      await permissions.loadPermissions();
    }
  } catch (error) {
    console.error('Error al cargar permisos:', error);
  }
});

// Determinar si debe mostrar el contenido basado en los permisos y roles
const shouldRender = computed(() => {
  // Si los permisos no están cargados y se requiere un permiso específico, no mostrar
  if (!permissions.permissionsLoaded.value && props.requires) {
    return false;
  }
  // Si es superadmin, siempre mostrar
  if (permissions.isSuperAdmin.value) {
    return true;
  }
  
  // Si es solo para superadmin y no lo es, no mostrar
  if (props.superadminOnly) {
    return false;
  }
  
  // Verificar rol específico si se proporciona
  if (props.role) {
    if (props.role === 'admin' && !permissions.isAdmin.value) {
      return false;
    }
    if (props.role === 'tecnico' && !permissions.isTecnico.value) {
      return false;
    }
  }
  
  // Verificar permiso específico si se proporciona
  if (props.requires) {
    try {
      const hasAccess = permissions.hasPermission(props.requires as any);
      if (!hasAccess) return false;
    } catch (error) {
      console.error(`Error al verificar permiso ${props.requires}:`, error);
      return false;
    }
  }
  
  // Si pasa todas las verificaciones, mostrar
  return true;
});
</script> 