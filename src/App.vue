<script setup lang="ts">
  import Footer from './modules/common/components/Footer.vue';
  import { useNetworkStatus } from './composables/useNetworkStatus';
  import { useColorMode } from './composables/useColorMode';
  import { onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import ModalPagos from './modules/admin/components/pagos/ModalPagos.vue';
  import { usePagosStore } from './stores/pagosStore';

  const route = useRoute();
  const pagosStore = usePagosStore();
  const modalPagosVisible = computed(() => pagosStore.modalVisible);
  
  // Inicializar la detección de estado de red solo para rutas privadas
  useNetworkStatus(!route.path.startsWith('/auth/'));

  // Determinar si estamos en la página de inicio para ocultar el footer común
  const isHomePage = computed(() => route.name === 'home');

  // Inicializar y sincronizar el tema
  const { initializeColorMode } = useColorMode();
  onMounted(() => {
    initializeColorMode();
  });

  // Función para actualizar el estado del modal
  const updateModalPagosVisible = (value: boolean) => {
    if (!value) {
      pagosStore.cerrarModalPagos();
    }
  };
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="!isHomePage" />
    
    <!-- Modales Globales -->
    <ModalPagos 
      :modelValue="modalPagosVisible"
      @update:modelValue="updateModalPagosVisible"
      :plan-de-pago-id="pagosStore.planDePagoActivo || undefined"
      :cliente-id="pagosStore.clienteActivo?.id_cliente || ''"
    />
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
