import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import { useAuthStore } from '@/modules/auth/stores/auth-store';
import { useColorMode } from './composables/useColorMode';
import 'vue-toastification/dist/index.css';
import './style.css';
// Inicializar el tema antes de crear la aplicación
const { initializeColorMode } = useColorMode();
initializeColorMode();
// Configurar event listeners pasivos para mejorar el rendimiento de desplazamiento
const supportsPassive = (() => {
    let passive = false;
    try {
        const options = Object.defineProperty({}, 'passive', {
            get: function () {
                passive = true;
                return true;
            },
        });
        window.addEventListener('test', () => { }, options);
        window.removeEventListener('test', () => { }, options);
    }
    catch (e) {
        // Capturar error silenciosamente
    }
    return passive;
})();
if (supportsPassive) {
    const options = { passive: true };
    document.addEventListener('touchstart', () => { }, options);
    document.addEventListener('touchmove', () => { }, options);
    document.addEventListener('wheel', () => { }, options);
}
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);
app.use(Toast, {
    position: 'bottom-left',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: false,
    maxToasts: 3,
    newestOnTop: true,
    containerClassName: 'custom-toast-container',
    toastClassName: 'custom-toast flex items-center gap-2',
});
// Inicializar el store de autenticación
const authStore = useAuthStore();
await authStore.initialize();
app.mount('#app');
