/**
 * useNetworkStatus.ts
 *
 * Composable para detectar el estado de la conexión a internet.
 * Proporciona una variable reactiva que indica si hay conexión
 * y métodos para suscribirse a cambios en el estado.
 */

import { ref, onMounted, onUnmounted } from 'vue';
import { useToast, POSITION } from 'vue-toastification';

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine);
  const toast = useToast();

  // Manejadores de eventos para actualizar el estado
  const handleOnline = () => {
    isOnline.value = true;
    toast.success('¡Conexión a internet restablecida!', {
      position: POSITION.BOTTOM_RIGHT,
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: false,
      icon: true,
      rtl: false,
    });
  };

  const handleOffline = () => {
    isOnline.value = false;
    toast.error('Se perdió la conexión a internet', {
      position: POSITION.BOTTOM_RIGHT,
      timeout: false, // No se cierra automáticamente
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: false,
      icon: true,
      rtl: false,
    });
  };

  // Suscribirse a eventos de conexión al montar el componente
  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  // Limpiar eventos al desmontar el componente
  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return {
    isOnline, // Estado actual de la conexión
  };
}
