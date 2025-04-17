import isNotAuthenticatedGuard from '../guards/is-not-authenticated-guard';
export const authRoutes = {
    path: '/auth',
    name: 'auth',
    beforeEnter: isNotAuthenticatedGuard,
    redirect: { name: 'login' },
    component: () => import('@/modules/auth/layout/AuthLayout.vue'),
    children: [
        {
            path: 'login',
            name: 'login',
            component: () => import('@/modules/auth/views/Login.vue'),
        },
        {
            path: 'recover-password',
            name: 'recover-password',
            component: () => import('@/modules/auth/views/RecoverPassword.vue'),
        },
    ],
};
