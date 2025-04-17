import { useAuthStore } from '@/stores/auth.store';
const isNotAuthenticatedGuard = async (_to, _from, next) => {
    const authStore = useAuthStore();
    // Asegurarse de que el store está inicializado
    if (authStore.loading) {
        await authStore.initialize();
    }
    if (authStore.isAuthenticated) {
        next({ name: 'dashboard' });
    }
    else {
        next();
    }
};
export default isNotAuthenticatedGuard;
