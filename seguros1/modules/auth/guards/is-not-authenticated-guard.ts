import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { AuthStatus } from '../interfaces';
import { useAuthStore } from '../stores/auth-store';

const isNotAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  await authStore.checkAuthStatus(); //Manda un apetición a la API para ver si su accessToken es válido

  if (authStore.authStatus === AuthStatus.Authenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
};

export default isNotAuthenticatedGuard;
