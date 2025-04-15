<template>
  <section class="relative overflow-hidden">
    <!-- Imagen de fondo del hero -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 m-8 rounded-3xl overflow-hidden shadow-inner">
        <img 
          src="@/assets/images/Fractal.jpg" 
          alt="Fondo de hero" 
          class="w-full h-full object-cover"
        />
        <!-- Overlay para mejorar la legibilidad del contenido -->
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-900/20 dark:from-gray-900/70 dark:to-gray-900/40"></div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Contenido -->
        <div class="relative z-10 space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Plataforma para Corredores de Seguros
          </div>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text">
            Potencia tu <span class="text-primary">Correduría</span>
          </h1>

          <p class="text-lg text-text/70 max-w-xl">
            Sistema integral de gestión para corredores de seguros. Optimiza tus operaciones, administra pólizas, clientes y cotizaciones desde una única plataforma intuitiva y eficiente.
          </p>

          <div class="flex justify-start">
            <button class="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              Solicitar Demo
              <PresentationIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-3 gap-8 pt-8 border-t border-input-border">
            <div>
              <h3 class="text-3xl font-bold text-text">+60%</h3>
              <p class="text-sm text-text/70 mt-1">Retención de clientes</p>
            </div>
            <div>
              <h3 class="text-3xl font-bold text-text">-70%</h3>
              <p class="text-sm text-text/70 mt-1">Tiempo en papeleo</p>
            </div>
            <div>
              <h3 class="text-3xl font-bold text-text">24/7</h3>
              <p class="text-sm text-text/70 mt-1">Acceso a la plataforma</p>
            </div>
          </div>
        </div>

        <!-- Espacio para equilibrar el layout -->
        <div class="relative lg:h-[600px] hidden lg:block">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PresentationIcon } from 'lucide-vue-next'
</script>
