<script setup lang="ts">
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
</script>

<template>
  <button 
    class="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer transition-transform duration-300 p-0 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-opacity-focus"
    :class="{
      'text-text-inverse': props.variant === 'navbar',
      'text-text': props.variant === 'default'
    }"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="toggleTheme"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="scale-75 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-75 opacity-0"
    >
      <Sun v-if="isDark" class="w-5 h-5 text-yellow-400" />
      <Moon v-else class="w-5 h-5 text-white" />
    </Transition>
  </button>
</template>
