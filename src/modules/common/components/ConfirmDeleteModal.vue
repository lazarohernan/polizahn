<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-text">Confirmar eliminación</h2>
        <button @click="$emit('close')" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6">
        <div class="mb-6 text-center">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500 dark:text-red-400">
              <AlertTriangleIcon class="w-8 h-8" />
            </div>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            ¿Estás seguro?
          </h3>
          
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Estás a punto de eliminar {{ itemName }}. Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XIcon, AlertTriangleIcon } from 'lucide-vue-next';

defineProps<{
  itemName: string;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();
</script> 