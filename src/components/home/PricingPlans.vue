<!--
  PricingPlans.vue
  
  Componente que muestra tarjetas de planes de precios para la plataforma.
  Incluye un plan básico y un plan avanzado sin mostrar precios específicos.
-->

<script setup lang="ts">
import { ref } from 'vue';

// Estado para controlar la duración activa (mensual/anual)
const activeDuration = ref('monthly');

// Función para cambiar entre mensual y anual
const toggleDuration = (duration: string) => {
  activeDuration.value = duration;
};

// Características de los planes
const basicFeatures = [
  'Gestión de clientes (hasta 100)',
  'Gestión de pólizas básicas',
  'Seguimiento de pagos',
  'Recordatorios de renovación',
  'Reportes básicos',
  'Soporte por correo electrónico'
];

const advancedFeatures = [
  'Clientes ilimitados',
  'Gestión completa de pólizas',
  'Gestión avanzada de pagos y planes de pago',
  'Notificaciones automáticas a clientes',
  'Reportes avanzados y personalizados',
  'Integración con aseguradoras',
  'Soporte prioritario 24/7',
  'Almacenamiento ilimitado de documentos'
];
</script>

<template>
  <section class="w-full py-20 bg-transparent dark:bg-transparent">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Título de la sección -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Elige tu plan
        </h2>
        <p class="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
          Soluciones flexibles para corredores de todos los tamaños
        </p>
        
        <!-- Selector de duración (mensual/anual) -->
        <div class="flex items-center justify-center mt-8">
          <div class="bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 p-1 rounded-lg inline-flex">
            <button 
              @click="toggleDuration('monthly')" 
              :class="[
                'px-4 py-2 text-sm rounded-md transition-all',
                activeDuration === 'monthly' 
                  ? 'bg-white dark:bg-gray-700 shadow text-primary' 
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              Mensual
            </button>
            <button 
              @click="toggleDuration('annual')" 
              :class="[
                'px-4 py-2 text-sm rounded-md transition-all',
                activeDuration === 'annual' 
                  ? 'bg-white dark:bg-gray-700 shadow text-primary' 
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              Anual
            </button>
          </div>
        </div>
      </div>
      
      <!-- Contenedor de tarjetas de precios -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        <!-- Plan Básico -->
        <div class="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div class="p-8">
            <div class="absolute right-6 top-6">
              <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full">
                Popular
              </span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Básico
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Ideal para corredores independientes y pequeñas corredurías
            </p>
            
            <!-- Lista de características -->
            <ul class="space-y-4 mb-8">
              <li v-for="(feature, index) in basicFeatures" :key="index" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-600 dark:text-gray-300">{{ feature }}</span>
              </li>
            </ul>
            
            <!-- Botón de suscripción -->
            <button class="w-full py-3 px-6 text-center text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors">
              Comenzar Ahora
            </button>
          </div>
        </div>
        
        <!-- Plan Avanzado -->
        <div class="relative overflow-hidden rounded-2xl border-2 border-primary bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div class="absolute -right-10 -top-10 bg-primary w-20 h-20 transform rotate-45"></div>
          <div class="p-8">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Avanzado
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Para corredurías en crecimiento con necesidades avanzadas
            </p>
            
            <!-- Lista de características -->
            <ul class="space-y-4 mb-8">
              <li v-for="(feature, index) in advancedFeatures" :key="index" class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-600 dark:text-gray-300">{{ feature }}</span>
              </li>
            </ul>
            
            <!-- Botón de suscripción -->
            <button class="w-full py-3 px-6 text-center text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors">
              Contactar Ventas
            </button>
          </div>
        </div>
        
      </div>
      
      <!-- Texto adicional -->
      <div class="text-center mt-12">
        <p class="text-gray-700 dark:text-gray-400">
          ¿Necesitas una solución personalizada? <a href="#" class="text-primary hover:text-primary-hover">Contáctanos</a>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}

.border-primary {
  border-color: var(--color-primary);
}

.bg-primary-hover {
  background-color: var(--color-primary-hover);
}

.text-primary-hover {
  color: var(--color-primary-hover);
}
</style> 