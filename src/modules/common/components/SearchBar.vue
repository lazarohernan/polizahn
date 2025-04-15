<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-input-bg border border-input-border transition-all duration-300 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
  >
    <Search class="w-5 h-5 text-text opacity-50" />
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder || 'Buscar...'"
      class="flex-1 bg-transparent border-none text-text text-sm outline-none w-full placeholder:text-text/50"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
  import { Search } from 'lucide-vue-next';

  defineProps<{
    modelValue: string;
    placeholder?: string;
  }>();

  defineEmits<{
    'update:modelValue': [value: string];
  }>();
</script>
