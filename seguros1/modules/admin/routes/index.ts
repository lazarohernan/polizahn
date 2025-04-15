import type { RouteRecordRaw } from 'vue-router';
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated-guard';

export const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  beforeEnter: isAuthenticatedGuard,
  redirect: { name: 'dashboard' },
  component: () => import('@/modules/admin/layout/AdminLayout.vue'),
  children: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/modules/admin/views/Dashboard.vue'),
    },
    {
      path: '/polizas',
      name: 'polizas',
      component: () => import('@/modules/admin/views/Polizas.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('@/modules/admin/views/Clientes.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/aseguradoras',
      name: 'aseguradoras',
      component: () => import('@/modules/admin/views/Aseguradoras.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('@/modules/admin/views/Configuracion.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/modules/admin/views/Profile.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/notificaciones',
      name: 'notificaciones',
      component: () => import('@/modules/admin/views/Notificaciones.vue'),
      // meta: { requiresAuth: true }
    },
  ],
};
