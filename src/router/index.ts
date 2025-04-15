import { adminRoutes } from '@/modules/admin/routes';
import { authRoutes } from '@/modules/auth/routes';
import { useAuthStore } from '@/stores/auth.store';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: false }
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

// Middleware global para proteger rutas y manejar la inicialización
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const publicRoutes = ['login', 'register', 'home', 'registration-pending', 'check-registration-status', 'terminos-de-uso', 'politica-de-privacidad'];

  // Si la ruta no requiere autenticación, permitir acceso
  if (publicRoutes.includes(to.name as string)) {
    return next();
  }

  // Asegurarse de que el store está inicializado
  if (authStore.loading) {
    await authStore.initialize();
  }

  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    // Guardar la ruta original para redireccionar después del login
    return next({ 
      name: 'login',
      query: { redirect: to.fullPath }
    });
  }

  // Usuario autenticado, permitir acceso
  return next();
});

export default router;
