import { useToast as useVueToast } from 'vue-toastification';
/**
 * Custom composable to wrap vue-toastification's useToast.
 * This provides a single point of configuration and makes it easier
 * to potentially swap out the toast library in the future.
 */
export function useToast() {
    // You can add custom logic or default options here if needed
    return useVueToast();
}
