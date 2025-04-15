/**
 * useColorMode.ts
 * 
 * Composable para manejar el tema de color (claro/oscuro) de la aplicación.
 * Características:
 * - Soporta modos: claro, oscuro y sistema
 * - Persiste la preferencia del usuario en localStorage
 * - Se sincroniza con la preferencia del sistema
 * - Proporciona transiciones suaves entre temas
 */

import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

// Tipos de modo de color disponibles
type ColorMode = 'light' | 'dark' | 'system'

// Estado reactivo para el modo de color actual
const colorMode = ref<ColorMode>('system')
const preferredDark = usePreferredDark()
const isDark = ref(false)

/**
 * Inicializa el modo de color basado en la preferencia guardada
 * o usa la preferencia del sistema como valor predeterminado
 */
const initializeColorMode = () => {
  const storedMode = localStorage.getItem('color-mode') as ColorMode | null
  if (storedMode) {
    colorMode.value = storedMode
  }
  updateColorMode()
}

/**
 * Observa cambios en la preferencia del sistema cuando está en modo 'system'
 * Actualiza el tema automáticamente si el usuario tiene seleccionado el modo sistema
 */
watch(preferredDark, (newValue) => {
  if (colorMode.value === 'system') {
    isDark.value = newValue
    updateColorMode(true)
  }
})

/**
 * Observa cambios en el modo de color seleccionado
 * Actualiza el tema cuando el usuario cambia manualmente el modo
 */
watch(colorMode, () => {
  updateColorMode()
})

/**
 * Actualiza el modo de color en la aplicación
 * @param isSystemChange - Indica si el cambio viene de la preferencia del sistema
 */
const updateColorMode = (isSystemChange = false) => {
  // Determina si el modo oscuro debe estar activo
  if (colorMode.value === 'system') {
    isDark.value = preferredDark.value
  } else {
    isDark.value = colorMode.value === 'dark'
  }

  // Actualiza la clase del documento para el cambio de tema
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Actualiza el esquema de color CSS
  document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
  
  // Guarda la preferencia (solo si no es un cambio del sistema)
  if (!isSystemChange) {
    localStorage.setItem('color-mode', colorMode.value)
  }
}

/**
 * Hook principal para manejar el modo de color
 * @returns Objeto con el estado y métodos para controlar el tema
 */
export function useColorMode() {
  // Inicializa en el primer uso
  initializeColorMode()

  /**
   * Establece el modo de color
   * @param mode - Modo de color a establecer ('light', 'dark', 'system')
   */
  const setColorMode = (mode: ColorMode) => {
    colorMode.value = mode
  }

  /**
   * Alterna entre modo claro y oscuro
   * Si está en modo sistema, cambia al modo opuesto al actual
   */
  const toggleColorMode = () => {
    if (colorMode.value === 'system') {
      setColorMode(isDark.value ? 'light' : 'dark')
    } else {
      setColorMode(colorMode.value === 'dark' ? 'light' : 'dark')
    }
  }

  return {
    colorMode,  // Estado actual del modo de color
    isDark,     // Estado booleano que indica si el modo oscuro está activo
    setColorMode,   // Función para establecer el modo de color
    toggleColorMode // Función para alternar entre modos
  }
}
