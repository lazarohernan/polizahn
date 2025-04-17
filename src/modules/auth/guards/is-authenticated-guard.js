import { useAuthStore } from '@/stores/auth.store';
const isAuthenticatedGuard = async (_to, _from, next) => {
    const authStore = useAuthStore();
    // Asegurarse de que el store está inicializado
    if (authStore.loading) {
        await authStore.initialize();
    }
    if (!authStore.isAuthenticated) {
        next({ name: 'login' });
    }
    else {
        next();
    }
};
export default isAuthenticatedGuard;
