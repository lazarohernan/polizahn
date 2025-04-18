<template>
  <footer
    class="fixed bottom-0 left-0 w-full py-4 sm:py-3 bg-[#1E4D64] dark:bg-[#0B1218] text-white text-sm sm:text-xs flex justify-center items-center z-10"
  >
    <div class="max-w-[1440px] w-full flex justify-center items-center">
      <p class="m-0 text-center inline-flex items-center gap-2 justify-center">
        2005 Desarrollado en Honduras 🇭🇳 con
        <span class="inline-block w-[100px] sm:w-[80px] h-[1.5em] relative overflow-hidden">
          <span class="words-wrapper absolute left-0 top-0 w-full h-full">
            <span
              v-for="(word, index) in words"
              :key="word"
              class="word absolute left-0 top-0 font-semibold text-white whitespace-nowrap w-max"
              :class="{
                'active': currentWordIndex === index,
                'initial': !hasStarted && index === 0
              }"
            >
              {{ word }}
            </span>
          </span>
        </span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const words = ['Pasión', 'Orgullo', 'Corazón'];
const currentWordIndex = ref(0);
const hasStarted = ref(false);
let interval: number | null = null;

const rotateWords = () => {
  if (!hasStarted.value) {
    hasStarted.value = true;
  }
  currentWordIndex.value = (currentWordIndex.value + 1) % words.length;
};

onMounted(() => {
  // Pequeño retraso para asegurar que la animación inicial se muestre correctamente
  setTimeout(() => {
    hasStarted.value = true;
    interval = window.setInterval(rotateWords, 3000);
  }, 100);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>

<style scoped>
footer {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}

.words-wrapper {
  perspective: 300px;
}

.word {
  opacity: 0;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  transform: translateY(20px) rotateX(-90deg);
  transform-origin: 50% 100%;
  pointer-events: none;
}

.word.initial {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

.word.active {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

/* Asegurar que las palabras no activas estén ocultas */
.word:not(.active):not(.initial) {
  opacity: 0;
  transform: translateY(-20px) rotateX(90deg);
}

/* Prevenir el parpadeo y mejorar el rendimiento */
.words-wrapper {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Optimización para dispositivos que prefieren menos movimiento */
@media (prefers-reduced-motion: reduce) {
  .word {
    transition: opacity 0.5s ease-in-out;
    transform: none !important;
  }
  
  .word.initial,
  .word.active {
    opacity: 1;
  }
  
  .word:not(.active):not(.initial) {
    opacity: 0;
    transform: none;
  }
}
</style>
