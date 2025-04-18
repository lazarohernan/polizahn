<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1100] p-6"
      @click="$emit('update:modelValue', false)"
    >
      <div
        :class="[
          'max-h-[calc(100vh-3rem)] bg-background border border-container-border rounded-3xl shadow-[0_8px_32px_var(--container-shadow)] flex flex-col',
          width === 'sm' ? 'w-full max-w-[500px]' : 
          width === 'md' ? 'w-full max-w-[700px]' : 
          width === 'lg' ? 'w-full max-w-[900px]' : 
          width === 'xl' ? 'w-full max-w-[1100px]' : 
          width === 'full' ? 'w-full max-w-full' : 
          'w-full max-w-[700px]'
        ]"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-sm rounded-t-3xl"
        >
          <div class="flex items-center gap-3">
            <div 
              v-if="icon" 
              class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
            >
              <component :is="icon" class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-text">{{ title }}</h2>
          </div>
          <button
            v-if="!hideCloseButton"
            class="p-2 rounded-lg text-text transition-all duration-300 hover:bg-primary hover:text-white"
            @click="$emit('update:modelValue', false)"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Contenido principal -->
        <div 
          class="flex-1 overflow-y-auto"
          :class="contentClass"
        >
          <slot></slot>
        </div>

        <!-- Footer (opcional) -->
        <div v-if="$slots.footer" class="border-t border-container-border p-4">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next';

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  width: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  contentClass: {
    type: String,
    default: 'p-6'
  },
  hideCloseButton: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script> 