<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useColorMode } from '@/composables/useColorMode'

// Props
interface Props {
  variant?: 'default' | 'navbar'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

// Composable
const { isDark, setColorMode } = useColorMode()

// Métodos
const toggleTheme = () => {
  setColorMode(isDark.value ? 'light' : 'dark')
}

// Clases computadas
const buttonClasses = computed(() => {
  const baseClasses = 'flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer transition-all duration-300 p-0'
  const variantClasses = props.variant === 'navbar'
    ? 'text-white hover:bg-white/10'
    : 'text-gray-600 dark:text-white hover:bg-primary hover:text-white dark:hover:bg-primary hover:-translate-y-0.5'
  
  return `${baseClasses} ${variantClasses}`
})
</script>

<template>
  <button 
    :class="buttonClasses"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="toggleTheme"
  >
    <!-- Sol para modo oscuro -->
    <Sun v-if="isDark" class="w-5 h-5 text-current" />
    <!-- Luna siempre blanca -->
    <Moon v-else class="w-5 h-5 text-white" />
  </button>
</template>
