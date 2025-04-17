<template>
  <!-- Contenedor principal con fondo adaptativo para modo oscuro -->
  <div
    class="min-h-screen w-full bg-background overflow-x-hidden public-page-gradient"
  >
    <div
      class="min-h-screen w-full flex flex-col items-center justify-center overflow-y-auto"
    >
      <div
        class="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-0 px-4"
      >
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
