<script setup lang="ts">
  import Footer from './modules/common/components/Footer.vue';
  import { useNetworkStatus } from './composables/useNetworkStatus';

  // Inicializar la detección de estado de red
  useNetworkStatus();
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
  }

  .main-content {
    flex: 1;
    width: 100%;
  }
</style>
