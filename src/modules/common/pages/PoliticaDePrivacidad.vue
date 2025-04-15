<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-screen w-full bg-background">
    <!-- Botón de regreso -->
    <div class="w-full max-w-[1200px] mx-auto px-4 pt-4">
      <button 
        class="px-4 py-2 rounded-lg bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover flex items-center gap-2"
        @click="router.back()"
      >
        <span>← Regresar</span>
      </button>
    </div>
    <!-- Contenido principal -->
    <div class="w-full min-h-screen flex justify-center py-8 px-4">
      <div class="w-full max-w-[1200px] mx-auto px-4 bg-container-bg border border-container-border rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
        <!-- Encabezado -->
        <div class="mb-8 p-6">
          <h1 class="text-[1.875rem] font-semibold text-text mb-6">Política de Privacidad</h1>
        </div>

        <!-- Contenido -->
        <div class="p-6">
          <!-- Aquí irá el contenido de la política de privacidad -->
        </div>
      </div>
    </div>
  </div>
</template>
