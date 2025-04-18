import { useToast } from 'vue-toastification';
import { ref } from 'vue';

// Un ref global (o podrías usar un store dedicado para errores globales si crece)
const globalError = ref<string | null>(null);

export function useErrorHandler() {
  const toast = useToast();

  /**
   * Maneja un error, lo muestra al usuario y lo registra en consola.
   * @param error El error capturado (puede ser Error, Supabase error, etc.)
   * @param context Un string describiendo dónde ocurrió el error (ej: 'cargarDatos PagosStore')
   * @param userMessage Mensaje opcional específico para mostrar al usuario.
   */
  const handleAndToastError = (error: unknown, context: string, userMessage?: string) => {
    let errorMessage = 'Ocurrió un error inesperado.';
    let errorDetails = error;

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      // Intentar extraer mensaje de errores tipo Supabase
      errorMessage = String((error as { message: string }).message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Mensaje para el usuario
    const finalUserMessage = userMessage || `Error en ${context}: ${errorMessage}`;
    toast.error(finalUserMessage);

    // Actualizar estado global de error (opcional, para mostrar en UI si se necesita)
    globalError.value = finalUserMessage;

    // Log detallado para desarrolladores
    console.error(`[Error Handler | ${context}]:`, {
      message: errorMessage,
      details: errorDetails,
    });

    // Puedes retornar el mensaje de error formateado si es útil
    return errorMessage;
  };

  const clearGlobalError = () => {
    globalError.value = null;
  };

  return {
    handleAndToastError,
    clearGlobalError,
    globalError, // Exponer el estado si se quiere observar
  };
} 