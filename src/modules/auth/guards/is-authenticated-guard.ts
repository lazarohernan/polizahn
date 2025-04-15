import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const isAuthenticatedGuard = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  // Asegurarse de que el store está inicializado
  if (authStore.loading) {
    await authStore.initialize();
  }

  if (!authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
};

export default isAuthenticatedGuard;
