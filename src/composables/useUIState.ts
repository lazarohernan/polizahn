import { ref, computed } from 'vue'

interface UIState {
  loading: boolean
  modals: Set<string>
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
  }>
}

const state = ref<UIState>({
  loading: false,
  modals: new Set(),
  notifications: []
})

export const useUIState = () => {
  // Getters
  const isLoading = computed(() => state.value.loading)
  const activeModals = computed(() => state.value.modals)
  const notifications = computed(() => state.value.notifications)

  // Métodos para modales
  const showModal = (modalId: string) => {
    state.value.modals.add(modalId)
  }

  const hideModal = (modalId: string) => {
    state.value.modals.delete(modalId)
  }

  const isModalActive = (modalId: string) => {
    return state.value.modals.has(modalId)
  }

  // Métodos para loading
  const startLoading = () => {
    state.value.loading = true
  }

  const stopLoading = () => {
    state.value.loading = false
  }

  // Métodos para notificaciones
  const addNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    state.value.notifications.push({ id, type, message })
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    state.value.notifications = state.value.notifications.filter(n => n.id !== id)
  }

  return {
    // Getters
    isLoading,
    activeModals,
    notifications,

    // Métodos
    showModal,
    hideModal,
    isModalActive,
    startLoading,
    stopLoading,
    addNotification,
    removeNotification
  }
} 