<template>
  <footer
    class="fixed bottom-0 left-0 w-full py-4 sm:py-3 bg-[#1E4D64] dark:bg-[#0B1218] text-white text-sm sm:text-xs flex justify-center items-center z-10"
  >
    <div class="max-w-[1440px] w-full flex justify-center items-center">
      <p class="m-0 text-center inline-flex items-center gap-2 justify-center">
        2005 Desarrollado en Honduras 🇭🇳 con
        <span class="inline-block w-[100px] sm:w-[80px] h-[1.5em] relative">
          <span class="absolute left-0 top-0 w-full h-full">
            <span
              class="absolute left-0 top-0 font-semibold text-white whitespace-nowrap w-max animate-fade"
            >
              Pasión
            </span>
            <span
              class="absolute left-0 top-0 font-semibold text-white whitespace-nowrap w-max animate-fade-delay-1"
            >
              Orgullo
            </span>
            <span
              class="absolute left-0 top-0 font-semibold text-white whitespace-nowrap w-max animate-fade-delay-2"
            >
              Corazón
            </span>
          </span>
        </span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
footer {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
