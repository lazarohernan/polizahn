<!--
  Features.vue
  
  Componente que muestra las características principales de la plataforma.
  Versión simplificada sin imágenes, solo con fondo y texto.
-->

<script setup lang="ts">
// Sin importaciones de iconos por ahora
</script>

<template>
  <section class="w-full py-20 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Título de la sección -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Soluciones para Corredores de Seguros
        </h2>
        <p class="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Optimiza tu correduría con nuestras herramientas especializadas
        </p>
      </div>
      
      <!-- Contenedor de las tarjetas de características -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Tarjeta 1: Gestión de Pólizas -->
        <div class="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Gestión de Pólizas
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Administra todas tus pólizas en un solo lugar. Seguimiento de vencimientos, renovaciones y documentación centralizada.
            </p>
          </div>
        </div>
        
        <!-- Tarjeta 2: Ahorro de Tiempo -->
        <div class="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Ahorro de Tiempo
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Automatiza tareas administrativas y reduce hasta un 70% el tiempo dedicado al papeleo. Flujos de trabajo optimizados.
            </p>
          </div>
        </div>
        
        <!-- Tarjeta 3: Análisis de Datos -->
        <div class="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Análisis de Datos
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Visualiza el rendimiento de tu cartera con informes personalizados. Identifica oportunidades y optimiza tu estrategia.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
