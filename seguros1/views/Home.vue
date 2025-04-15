<template>
  <div class="home">
    <NavBar />
    <div class="content">
      <h1>Bienvenido</h1>
      <h2>Plataforma en Construcción</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue';
</script>

<style scoped>
  .home {
    min-height: 100vh;
    width: 100%;
    background-color: var(--color-background);
  }

  .content {
    max-width: 1440px;
    margin: 0 auto;
    padding-top: 8rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    color: var(--color-text);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 600;
  }

  h2 {
    color: var(--color-text);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 500;
    opacity: 0.7;
  }
</style>
