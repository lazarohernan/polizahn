<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  show: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1200] p-6"
      @click="emit('cancel')"
    >
      <div 
        class="w-full max-w-[400px] bg-background border border-container-border rounded-3xl shadow-[0_8px_32px_var(--container-shadow)] flex flex-col"
        @click.stop
      >
        <div class="p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-sm rounded-t-3xl">
          <h3 class="text-lg font-semibold text-text">{{ title }}</h3>
          <button 
            class="p-2 rounded-lg text-text transition-all duration-300 hover:bg-amber-500 hover:text-white"
            @click="emit('cancel')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6">
          <p class="text-text/70 mb-8">{{ message }}</p>
          
          <div class="flex gap-4">
            <button 
              type="button" 
              class="flex-1 px-6 py-3 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-amber-500 hover:text-white"
              @click="emit('cancel')"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="flex-1 px-6 py-3 rounded-lg bg-amber-500 text-white text-sm font-medium transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="emit('confirm')"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
