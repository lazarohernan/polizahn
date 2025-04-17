<template>
  <div class="home public-page-gradient">
    <NavBar />
    <Hero />
    <Features />
    <PricingPlans />
    <HomeFooter />
    <!-- Aquí podemos añadir más secciones a medida que se vayan creando -->
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import Hero from '@/components/home/Hero.vue';
import Features from '@/components/home/Features.vue';
import PricingPlans from '@/components/home/PricingPlans.vue';
import HomeFooter from '@/components/home/Footer.vue';
</script>

<style scoped>
.home {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Asegurarse de que el contenido es al menos tan alto como la pantalla */
:deep(section), :deep(footer) {
  z-index: 1;
  position: relative;
}
</style>
