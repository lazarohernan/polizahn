<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6" @click.stop>
      <!-- Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <Filter class="w-5 h-5 text-primary" />
          <h2 class="text-lg font-semibold text-text dark:text-white">Filtros</h2>
        </div>
        <button
          class="p-1 text-text/50 dark:text-gray-400 hover:text-text dark:hover:text-white"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Contenido -->
      <div class="space-y-4">
        <slot></slot>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-3 mt-6">
        <button
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover"
          @click="applyFilters"
        >
          <span>Aplicar Filtros</span>
        </button>
        <button
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 text-sm font-medium border border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-text dark:hover:text-white"
          @click="resetFilters"
        >
          <span>Restablecer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Filter, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'apply'): void
  (e: 'reset'): void
}>()

const applyFilters = () => {
  emit('apply')
}

const resetFilters = () => {
  emit('reset')
}
</script>

<style scoped>
/* Eliminar animaciones innecesarias */
</style> 