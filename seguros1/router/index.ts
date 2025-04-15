import { adminRoutes } from '@/modules/admin/routes';
import { authRoutes } from '@/modules/auth/routes';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    authRoutes,
    adminRoutes,

    //Registro pendiente
    {
      path: '/registration-pending',
      name: 'registration-pending',
      component: () => import('@/modules/common/pages/RegistrationPending.vue'),
    },

    //Revisar estatus de registro
    {
      path: '/check-registration-status',
      name: 'check-registration-status',
      component: () => import('@/modules/common/pages/CheckRegistrationStatus.vue'),
    },

    //Onboarding
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/modules/common/pages/Onboarding.vue'),
      // meta: { requiresAuth: true }
    },

    //Términos de USO
    {
      path: '/terminos-de-uso',
      name: 'terminos-de-uso',
      component: () => import('@/modules/common/pages/TerminosDeUso.vue'),
      beforeEnter: (_to, from, next) => {
        // Si viene de registro o login, permitir acceso
        if (from.name === 'register' || from.name === 'login') {
          next();
        } else {
          next('/dashboard');
        }
      },
    },

    //Política de Privacidad
    {
      path: '/politica-de-privacidad',
      name: 'politica-de-privacidad',
      component: () => import('@/modules/common/pages/PoliticaDePrivacidad.vue'),
      beforeEnter: (_to, from, next) => {
        // Si viene de registro o login, permitir acceso
        if (from.name === 'register' || from.name === 'login') {
          next();
        } else {
          next('/dashboard');
        }
      },
    },
  ],
});

export default router;
