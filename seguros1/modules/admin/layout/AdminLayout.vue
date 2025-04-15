<template>
  <div class="min-h-screen w-full bg-background">
    <NavBarCorredor />
    <SubNavBar />
    <!--Contenido principal-->
    <RouterView />
    <!--Contenido principal-->
  </div>
</template>

<script lang="ts" setup>
  import NavBarCorredor from '../components/NavBarCorredor.vue';
  import SubNavBar from '../components/SubNavBar.vue';
</script>
