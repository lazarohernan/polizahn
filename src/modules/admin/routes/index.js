import { adminGuard } from '@/modules/auth/guards/role-guard';
export const adminRoutes = {
    path: '/admin',
    name: 'admin',
    beforeEnter: adminGuard,
    redirect: { name: 'dashboard' },
    component: () => import('@/modules/admin/layout/AdminLayout.vue'),
    children: [
        {
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('@/modules/admin/views/Dashboard.vue'),
        },
        {
            path: 'polizas',
            name: 'polizas',
            component: () => import('@/modules/admin/views/Polizas.vue'),
            // meta: { requiresAuth: true }
        },
        {
            path: 'clientes',
            name: 'clientes',
            component: () => import('@/modules/admin/views/Clientes.vue'),
            children: [
                {
                    path: ':id',
                    name: 'cliente-detalles',
                    component: () => import('@/modules/admin/views/Clientes.vue'),
                },
                {
                    path: ':id/polizas',
                    name: 'cliente-polizas',
                    component: () => import('@/modules/admin/views/Clientes.vue'),
                },
                {
                    path: ':id/pagos',
                    name: 'cliente-pagos',
                    component: () => import('@/modules/admin/views/Clientes.vue'),
                },
                {
                    path: 'nuevo',
                    name: 'cliente-nuevo',
                    component: () => import('@/modules/admin/views/Clientes.vue'),
                }
            ]
        },
        {
            path: 'aseguradoras',
            name: 'aseguradoras',
            component: () => import('@/modules/admin/views/Aseguradoras.vue'),
            beforeEnter: adminGuard, // Cambiado de superadminGuard a adminGuard para permitir acceso a admins
        },
        {
            path: 'cotizaciones',
            name: 'cotizaciones',
            component: () => import('@/modules/admin/views/Cotizaciones.vue'),
        },
        {
            path: 'siniestros',
            name: 'siniestros',
            component: () => import('@/modules/admin/views/Siniestros.vue'),
            children: [
                {
                    path: ':id',
                    name: 'siniestro-detalle',
                    component: () => import('@/modules/admin/views/SiniestroDetalle.vue'),
                }
            ]
        },
        {
            path: 'perfil',
            name: 'perfil',
            component: () => import('@/modules/admin/views/Profile.vue'),
            // meta: { requiresAuth: true }
        },
        {
            path: 'roles',
            name: 'roles',
            component: () => import('@/modules/admin/views/Usuarios.vue'), // Usando la vista de Usuarios.vue temporalmente
            beforeEnter: adminGuard,
        },
        {
            path: 'notificaciones',
            name: 'notificaciones',
            component: () => import('@/modules/admin/views/Notificaciones.vue'),
            // meta: { requiresAuth: true }
        },
        {
            path: 'usuarios',
            name: 'usuarios',
            component: () => import('@/modules/admin/views/Usuarios.vue'),
            // meta: { requiresAuth: true }
        },
    ],
};
