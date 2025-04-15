<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import LottieIcon from './LottieIcon.vue';

  // Importar animaciones Lottie
  import InicioAnimation from '@/assets/lottie/inicio.json';
  import AseguradoraAnimation from '@/assets/lottie/aseguradora.json';
  import PolizaAnimation from '@/assets/lottie/poliza.json';
  import ClienteAnimation from '@/assets/lottie/cliente.json';
  import ConfiguracionAnimation from '@/assets/lottie/configuracion.json';

  const route = useRoute();

  const menuOptions = [
    { id: 'dashboard', label: 'Inicio', animation: InicioAnimation },
    { id: 'aseguradoras', label: 'Aseguradoras', animation: AseguradoraAnimation },
    { id: 'polizas', label: 'Pólizas', animation: PolizaAnimation },
    { id: 'clientes', label: 'Clientes', animation: ClienteAnimation },
    { id: 'configuracion', label: 'Configuración', animation: ConfiguracionAnimation },
  ];

  const currentRoute = computed(() => route.path.substring(1));
</script>

<template>
  <nav
    class="fixed top-16 left-0 w-full bg-background/80 backdrop-blur-md shadow-sm z-[100] border-b border-container-border"
  >
    <div class="max-w-[1440px] mx-auto px-8 sm:px-4">
      <div
        class="flex justify-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3"
      >
        <div class="flex gap-8 sm:gap-4 relative w-full justify-center">
          <RouterLink
            v-for="option in menuOptions"
            :key="option.id"
            :to="{ name: option.id }"
            class="flex flex-col items-center gap-1 p-2 text-text no-underline transition-all duration-200 rounded-lg min-w-[64px] sm:min-w-[56px] opacity-70 hover:opacity-100 hover:bg-background/50 hover:backdrop-blur-md cursor-pointer"
            :class="{ 'opacity-100 bg-background/50 backdrop-blur-md': currentRoute === option.id }"
          >
            <div class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center">
              <LottieIcon :animation="option.animation" :loop="true" :autoplay="false" :speed="1" />
            </div>
            <span class="text-xs font-medium whitespace-nowrap">{{ option.label }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
