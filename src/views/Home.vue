<template>
  <div class="home">
    <NavBar />
    <Hero />
    <Features />
    <!-- Aquí podemos añadir más secciones a medida que se vayan creando -->
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import Hero from '@/components/home/Hero.vue';
import Features from '@/components/home/Features.vue';
</script>

<style scoped>
.home {
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-background);
}
</style>
