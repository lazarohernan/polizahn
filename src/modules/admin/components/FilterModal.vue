<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg shadow-xl">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-text">Filtrar Cotizaciones</h2>
        <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <form @submit.prevent="applyFilters">
          <div class="space-y-6">
            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <div class="flex flex-wrap gap-2">
                <label 
                  v-for="estado in estados" 
                  :key="estado.value"
                  class="inline-flex items-center"
                >
                  <input
                    v-model="localFilters.status"
                    type="checkbox"
                    :value="estado.value"
                    class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ estado.label }}</span>
                </label>
              </div>
            </div>
            
            <!-- Rango de fechas -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de creación
              </label>
              <select
                id="date"
                v-model="localFilters.date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
            </div>
            
            <!-- Aseguradora -->
            <div>
              <label for="aseguradora" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aseguradora
              </label>
              <select
                id="aseguradora"
                v-model="localFilters.aseguradora"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas las aseguradoras</option>
                <option value="1">Seguros Atlántida</option>
                <option value="2">Ficohsa Seguros</option>
                <option value="3">Mapfre</option>
              </select>
            </div>
            
            <!-- Tipo de seguro -->
            <div>
              <label for="tipo_seguro" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Seguro
              </label>
              <select
                id="tipo_seguro"
                v-model="localFilters.tipo_seguro"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los tipos</option>
                <option value="Automóvil">Automóvil</option>
                <option value="Vida">Vida</option>
                <option value="Hogar">Hogar</option>
                <option value="Médico">Médico</option>
                <option value="Viaje">Viaje</option>
                <option value="Empresarial">Empresarial</option>
              </select>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="resetFilters"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Limpiar
            </button>
            
            <button
              type="submit"
              class="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { XIcon } from 'lucide-vue-next';
import type { Filter } from '@/types/filters';

interface Props {
  filters: Filter;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply', filters: Filter): void;
}>();

// Estados disponibles
const estados = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
  { value: 'vencida', label: 'Vencida' },
  { value: 'convertida', label: 'Convertida a Póliza' }
];

// Copia local de los filtros
const localFilters = ref<Filter>({
  status: [],
  date: '',
  aseguradora: '',
  tipo_seguro: ''
});

// Al montar, cargamos los filtros actuales
onMounted(() => {
  localFilters.value = {
    status: [...props.filters.status],
    date: props.filters.date,
    aseguradora: props.filters.aseguradora,
    tipo_seguro: props.filters.tipo_seguro
  };
});

// Resetear filtros
const resetFilters = () => {
  localFilters.value = {
    status: [],
    date: '',
    aseguradora: '',
    tipo_seguro: ''
  };
};

// Aplicar filtros
const applyFilters = () => {
  emit('apply', localFilters.value);
};
</script> 