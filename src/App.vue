<script setup lang="ts">
  import Footer from './modules/common/components/Footer.vue';
  import { useNetworkStatus } from './composables/useNetworkStatus';
  import { useColorMode } from './composables/useColorMode';
  import { onMounted } from 'vue';

  // Inicializar la detección de estado de red
  useNetworkStatus();

  // Inicializar y sincronizar el tema
  const { initializeColorMode } = useColorMode();
  onMounted(() => {
    initializeColorMode();
  });
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 4rem; /* Espacio para el footer */
  }

  .main-content {
    flex: 1;
    width: 100%;
  }

  @media (max-width: 640px) {
    .app-container {
      padding-bottom: 3rem; /* Espacio reducido en móviles */
    }
  }
</style>
