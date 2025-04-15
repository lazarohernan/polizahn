<!--
  NavBar.vue
  
  Barra de navegación principal para usuarios no autenticados.
  Incluye el logo, enlaces de navegación, botón de tema oscuro/claro y enlace de inicio de sesión.
  
  Características:
  - Diseño responsivo con soporte para móvil y escritorio
  - Navbar siempre en modo claro para mejor visibilidad
  - Menú móvil con soporte para tema oscuro/claro
  - Animaciones suaves en transiciones y efectos hover
-->

<script setup lang="ts">
  // Importaciones necesarias
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';
  import { Menu, X } from 'lucide-vue-next';
  
  // Estado para controlar la visibilidad del menú móvil
  const mobileMenuOpen = ref(false);
  
  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  // Función para cerrar el menú móvil
  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
</script>

<template>
  <!-- Navbar principal (siempre en modo claro) -->
  <nav
    class="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] flex justify-between items-center px-8 py-4 sm:px-4 sm:py-3 bg-white/95 backdrop-blur-xl rounded-2xl z-50 transition-all duration-300 shadow-md dark:shadow-gray-900/20"
  >
    <!-- Logo y nombre de la plataforma -->
    <div class="flex items-center">
      <RouterLink
        class="text-xl sm:text-base font-semibold text-gray-800 no-underline transition-colors duration-300 hover:text-primary"
        to="/"
        @click="closeMobileMenu"
      >
        Plataforma Seguros
      </RouterLink>
    </div>

    <!-- Enlaces de navegación (escritorio) -->
    <div class="hidden md:flex items-center gap-6">
      <RouterLink
        class="text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:text-white dark:hover:text-white/80"
        to="/"
      >
        Inicio
      </RouterLink>
      <RouterLink
        class="text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:text-white dark:hover:text-white/80"
        to="/soluciones"
      >
        Soluciones
      </RouterLink>
      <RouterLink
        class="text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:text-white dark:hover:text-white/80"
        to="/precios"
      >
        Precios
      </RouterLink>
      <RouterLink
        class="text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:text-white dark:hover:text-white/80"
        to="/blog"
      >
        Blog
      </RouterLink>
      <RouterLink
        class="text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-primary/10 dark:text-white dark:hover:text-white/80"
        to="/contacto"
      >
        Contacto
      </RouterLink>
    </div>

    <!-- Contenedor de botones y enlaces -->
    <div class="flex items-center gap-4">
      <!-- ThemeToggle con variante para navbar -->
      <ThemeToggle variant="navbar" />

      <!-- Enlace de inicio de sesión (visible en escritorio) -->
      <RouterLink
        class="hidden md:flex px-6 py-2.5 sm:px-4 sm:py-2 rounded-md text-gray-800 bg-white border-2 border-primary font-medium uppercase text-sm sm:text-xs tracking-wider transition-all duration-300 hover:bg-primary hover:text-white dark:text-gray-800 dark:bg-white dark:hover:text-white shadow-sm"
        to="/auth/login"
      >
        Iniciar
      </RouterLink>
      
      <!-- Botón de menú móvil -->
      <button 
        class="md:hidden flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-primary focus:outline-none bg-white/80 shadow-sm"
        @click="toggleMobileMenu"
        aria-label="Menú principal"
      >
        <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>
  </nav>
  
  <!-- Menú móvil (overlay) -->
  <div 
    v-if="mobileMenuOpen"
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
    @click="closeMobileMenu"
  ></div>
  
  <!-- Panel de menú móvil (adaptable al tema) -->
  <div 
    class="fixed top-28 right-[5%] w-[90%] max-w-[400px] bg-white dark:bg-primary rounded-xl shadow-xl overflow-hidden z-40 transform transition-all duration-300 origin-top-right"
    :class="mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'"
  >
    <div class="p-4 space-y-4">
      <!-- Enlaces de navegación (móvil) -->
      <RouterLink
        v-for="(link, index) in [
          { name: 'Inicio', path: '/' },
          { name: 'Soluciones', path: '/soluciones' },
          { name: 'Precios', path: '/precios' },
          { name: 'Blog', path: '/blog' },
          { name: 'Contacto', path: '/contacto' }
        ]"
        :key="index"
        :to="link.path"
        class="block px-4 py-3 text-base font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200 dark:text-white dark:hover:bg-white/10"
        @click="closeMobileMenu"
      >
        {{ link.name }}
      </RouterLink>
      
      <!-- Botón de inicio de sesión (móvil) -->
      <div class="px-4 pt-2 pb-4">
        <RouterLink
          to="/auth/login"
          class="w-full flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:bg-white dark:text-primary dark:hover:bg-gray-100"
          @click="closeMobileMenu"
        >
          Iniciar Sesión
        </RouterLink>
      </div>
    </div>
  </div>
</template>
