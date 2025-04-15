<template>
  <div class="rounded-full flex items-center justify-center overflow-hidden" :class="sizeClasses">
    <template v-if="image">
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
    </template>
    <template v-else>
      <div
        class="w-full h-full flex items-center justify-center text-white font-medium"
        :class="backgroundColor"
      >
        {{ initials }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    name: string;
    image?: string;
    size?: 'sm' | 'md' | 'lg';
  }>();

  // Obtener iniciales del nombre
  const initials = computed(() => {
    return props.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  // Obtener color basado en el nombre
  const backgroundColor = computed(() => {
    const colors = ['bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-400', 'bg-gray-300'];
    const index =
      props.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  });

  // Tamaños del avatar
  const sizeClasses = computed(() => {
    const sizes = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-32 h-32 sm:w-40 sm:h-40 text-4xl',
    };
    return sizes[props.size || 'md'];
  });
</script>
