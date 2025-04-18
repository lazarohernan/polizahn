<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      sizeClasses,
      variantClasses,
      roundedClasses,
      fullWidth ? 'w-full' : '',
      className
    ]"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <Loader v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loader } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['default', 'primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'].includes(value);
    }
  },
  size: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['sm', 'default', 'lg', 'icon'].includes(value);
    }
  },
  rounded: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['none', 'sm', 'default', 'lg', 'full'].includes(value);
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click']);

const onClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs';
    case 'lg':
      return 'h-11 px-8 text-base';
    case 'icon':
      return 'h-9 w-9 p-0';
    default:
      return 'h-9 px-4 py-2 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
    case 'secondary':
      return 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80';
    case 'destructive':
      return 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90';
    case 'outline':
      return 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground';
    case 'ghost':
      return 'hover:bg-accent hover:text-accent-foreground';
    case 'link':
      return 'text-primary underline-offset-4 hover:underline';
    default:
      return 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
  }
});

const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded-sm';
    case 'lg':
      return 'rounded-lg';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-md';
  }
});
</script> 