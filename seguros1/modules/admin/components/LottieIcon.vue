<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useLottie, type LottieAnimationData } from '../composables/useLottie';

  const props = defineProps<{
    animation: LottieAnimationData;
    loop?: boolean;
    autoplay?: boolean;
    speed?: number;
  }>();

  const container = ref<HTMLDivElement | null>(null);
  const isPlaying = ref(false);
  const isHovered = ref(false);
  const { containerRef, animation, createAnimation } = useLottie(props.animation, {
    loop: props.loop,
    autoplay: false,
    speed: props.speed,
  });

  onMounted(() => {
    if (container.value) {
      containerRef.value = container.value;
      createAnimation();
    }
  });

  // Métodos para controlar la animación
  const play = () => {
    if (animation.value && !isPlaying.value) {
      isHovered.value = true;
      // Pequeño delay para la transición visual
      requestAnimationFrame(() => {
        animation.value?.goToAndPlay(0);
        isPlaying.value = true;
      });
    }
  };

  const pause = () => {
    if (animation.value && isPlaying.value) {
      isHovered.value = false;
      // Pequeño delay para la transición visual
      requestAnimationFrame(() => {
        animation.value?.pause();
        // Reiniciar al primer frame
        animation.value?.goToAndStop(0, true);
        isPlaying.value = false;
      });
    }
  };

  // Observar cambios en las propiedades
  watch(
    () => props.animation,
    () => {
      if (container.value) {
        containerRef.value = container.value;
        createAnimation();
      }
    },
    { deep: true },
  );

  // Exponer métodos al componente padre
  defineExpose({
    play,
    pause,
  });

  let touchTimeout: number | null = null;

  const handleTouchStart = () => {
    play();
    // Limpiar timeout existente si hay uno
    if (touchTimeout) {
      window.clearTimeout(touchTimeout);
    }
  };

  const handleTouchEnd = () => {
    // Agregar un pequeño delay antes de pausar para mejor UX en móviles
    touchTimeout = window.setTimeout(() => {
      pause();
    }, 300);
  };
</script>

<template>
  <div
    ref="container"
    class="w-full h-full transition-transform duration-200"
    :class="{ 'scale-110': isHovered }"
    @mouseenter="play"
    @mouseleave="pause"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  />
</template>
