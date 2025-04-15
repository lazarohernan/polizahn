<!--
  NavBar.vue
  
  Barra de navegación principal para usuarios no autenticados.
  Incluye el logo, botón de tema oscuro/claro y enlaces de autenticación.
  
  Características:
  - Diseño responsivo usando Tailwind CSS
  - Soporte para tema oscuro/claro
  - Animaciones suaves en hover y transiciones
  - Adaptación a diferentes tamaños de pantalla (móvil/escritorio)
-->

<script setup lang="ts">
  // Importaciones necesarias
  import { RouterLink } from 'vue-router';
  import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';
</script>

<template>
  <!-- Contenedor principal del navbar -->
  <!-- fixed top-8: Fijo en la parte superior con margen -->
  <!-- left-1/2 -translate-x-1/2: Centrado horizontal -->
  <!-- w-[90%] max-w-[1200px]: Ancho responsivo con máximo -->
  <nav
    class="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] flex justify-between items-center px-8 py-4 sm:px-4 sm:py-3 bg-navbar backdrop-blur-md rounded-xl sm:rounded-lg shadow-navbar z-50 transition-all duration-300"
  >
    <!-- Logo y nombre de la plataforma -->
    <div class="flex items-center">
      <RouterLink
        class="text-xl sm:text-base font-semibold text-text no-underline transition-colors duration-300 hover:text-primary"
        to="/"
      >
        Plataforma Seguros
      </RouterLink>
    </div>

    <!-- Contenedor de botones y enlaces -->
    <div class="flex items-center gap-4">
      <!-- ThemeToggle con variante para navbar -->
      <ThemeToggle variant="navbar" />

      <!-- Enlace de inicio de sesión -->
      <!-- Estilo outline con hover a color sólido -->
      <RouterLink
        class="px-6 py-2.5 sm:px-4 sm:py-2 rounded-md text-text bg-transparent border-2 border-primary font-medium uppercase text-sm sm:text-xs tracking-wider transition-all duration-300 hover:bg-primary hover:text-white"
        :to="{ name: 'login' }"
      >
        Iniciar
      </RouterLink>

      <!-- Enlace de registro -->
      <!-- Estilo sólido con hover de elevación -->
      <RouterLink
        class="px-6 py-2.5 sm:px-4 sm:py-2 rounded-md text-white bg-primary font-medium uppercase text-sm sm:text-xs tracking-wider transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
        :to="{ name: 'register' }"
      >
        Registro
      </RouterLink>
    </div>
  </nav>
</template>
