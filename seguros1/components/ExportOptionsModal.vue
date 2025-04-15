/**
 * ExportOptionsModal.vue
 * 
 * Modal para configurar las opciones de exportación de datos.
 * Incluye:
 * - Selección de formato (PDF/CSV)
 * - Filtros por fecha y otros campos
 * - Vista previa de datos a exportar
 */

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Filter, FileDown, Download, X } from 'lucide-vue-next'

import { Client } from '@/types/client'

interface Props {
  show: boolean
  data: Client[]
}

interface Emits {
  (e: 'close'): void
  (e: 'export', format: 'pdf' | 'csv', filteredData: Client[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Estados de filtros
const startDate = ref('')
const endDate = ref('')
const status = ref<'all' | 'active' | 'inactive'>('all')
const insuranceCount = ref<'all' | 'with' | 'without'>('all')

// Datos filtrados
const filteredData = computed(() => {
  return props.data.filter(item => {
    // Filtro por fecha
    if (startDate.value && new Date(item.lastUpdate) < new Date(startDate.value)) {
      return false
    }
    if (endDate.value && new Date(item.lastUpdate) > new Date(endDate.value)) {
      return false
    }

    // Filtro por estado
    if (status.value !== 'all' && item.status !== status.value) {
      return false
    }

    // Filtro por pólizas
    if (insuranceCount.value === 'with' && item.insuranceCount === 0) {
      return false
    }
    if (insuranceCount.value === 'without' && item.insuranceCount > 0) {
      return false
    }

    return true
  })
})

// Métodos
const handleExport = (format: 'pdf' | 'csv') => {
  emit('export', format, filteredData.value)
  emit('close')
}

const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
  status.value = 'all'
  insuranceCount.value = 'all'
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1100]"
    @click="emit('close')"
  >
    <!-- Modal -->
    <div
      class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 animate-fade-in"
      @click.stop
    >
      <!-- Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <Filter class="w-5 h-5 text-primary" />
          <h2 class="text-lg font-semibold text-text dark:text-white">Opciones de Exportación</h2>
        </div>
        <button
          class="p-1 text-text/50 dark:text-gray-400 hover:text-text dark:hover:text-white transition-colors"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Filtros -->
      <div class="space-y-6 mb-8">
        <!-- Rango de fechas -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-text dark:text-gray-200">Rango de Fechas</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                v-model="startDate"
                type="date"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text dark:text-gray-200 text-sm focus:outline-none focus:border-primary dark:focus:border-primary"
              />
            </div>
            <div>
              <input
                v-model="endDate"
                type="date"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text dark:text-gray-200 text-sm focus:outline-none focus:border-primary dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-text dark:text-gray-200">Estado</label>
          <select
            v-model="status"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text dark:text-gray-200 text-sm focus:outline-none focus:border-primary dark:focus:border-primary"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        <!-- Pólizas -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-text dark:text-gray-200">Pólizas</label>
          <select
            v-model="insuranceCount"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text dark:text-gray-200 text-sm focus:outline-none focus:border-primary dark:focus:border-primary"
          >
            <option value="all">Todos</option>
            <option value="with">Con pólizas</option>
            <option value="without">Sin pólizas</option>
          </select>
        </div>
      </div>

      <!-- Resumen -->
      <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <p class="text-sm text-text dark:text-gray-200">
          {{ filteredData.length }} registros seleccionados
        </p>
      </div>

      <!-- Acciones -->
      <div class="space-y-3">
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg dark:shadow-primary/20"
          @click="handleExport('pdf')"
        >
          <FileDown class="w-5 h-5" />
          <span>Exportar como PDF</span>
        </button>
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-700 text-text dark:text-gray-200 text-sm font-medium border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:border-primary dark:hover:border-primary hover:-translate-y-0.5 hover:shadow-lg dark:shadow-gray-900/30"
          @click="handleExport('csv')"
        >
          <Download class="w-5 h-5" />
          <span>Exportar como CSV</span>
        </button>
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-text dark:text-gray-200 text-sm font-medium border border-transparent transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-text dark:hover:text-white"
          @click="resetFilters"
        >
          <span>Restablecer Filtros</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
