/**
 * useNetworkStatus.ts
 *
 * Composable para detectar el estado de la conexión a internet.
 * Proporciona una variable reactiva que indica si hay conexión
 * y métodos para suscribirse a cambios en el estado.
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
export function useNetworkStatus() {
    const isOnline = ref(navigator.onLine);
    const toast = useToast();
    let offlineToastId = null;
    // Manejadores de eventos para actualizar el estado
    const handleOnline = () => {
        isOnline.value = true;
        // Si existe un toast de offline, lo eliminamos
        if (offlineToastId !== null) {
            toast.dismiss(offlineToastId);
            offlineToastId = null;
        }
        // Mostramos el toast de reconexión
        toast.success('¡Conexión a internet restablecida!', {
            timeout: 3000,
            icon: true,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            toastClassName: 'custom-toast'
        });
    };
    const handleOffline = () => {
        isOnline.value = false;
        // Mostramos el toast de desconexión y guardamos su ID
        offlineToastId = toast.error('Se perdió la conexión a internet', {
            timeout: false, // No se cierra automáticamente
            icon: true,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            toastClassName: 'custom-toast'
        });
    };
    // Suscribirse a eventos de conexión al montar el componente
    onMounted(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Verificar estado inicial
        if (!navigator.onLine) {
            handleOffline();
        }
    });
    // Limpiar eventos al desmontar el componente
    onUnmounted(() => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        // Limpiar cualquier toast pendiente
        if (offlineToastId !== null) {
            toast.dismiss(offlineToastId);
        }
    });
    return {
        isOnline, // Estado actual de la conexión
    };
}
