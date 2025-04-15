<template>
  <div
    class="flex items-center justify-end w-full gap-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-b-lg border-t border-gray-200 dark:border-gray-700"
  >
    <!-- Selector de elementos por página -->
    <div class="flex items-center gap-2 text-sm text-text/70 dark:text-gray-400">
      <span>Mostrar</span>
      <select
        v-model="itemsPerPageValue"
        class="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-text dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary/30 dark:focus:ring-primary/50 transition-all duration-200"
        aria-label="Elementos por página"
        @change="handleItemsPerPageChange"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      <span>elementos</span>
    </div>

    <!-- Paginación con números de página - Diseño moderno -->
    <nav aria-label="Paginación" class="flex items-center">
      <ul class="flex items-center gap-1">
        <!-- Botón Anterior -->
        <li>
          <button
            class="flex items-center justify-center h-9 px-3 text-text dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
            :disabled="props.isFirstPage"
            title="Página anterior"
            aria-label="Ir a la página anterior"
            :aria-disabled="props.isFirstPage"
            @click="$router.push({ query: { page: props.page - 1 } })"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </li>

        <!-- Números de página -->
        <li v-for="pageNum in displayedPages" :key="pageNum">
          <button
            v-if="pageNum !== '...'"
            class="flex items-center justify-center w-9 h-9 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none"
            :class="
              pageNum === props.page
                ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary'
                : 'text-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary'
            "
            :aria-current="pageNum === props.page ? 'page' : undefined"
            @click="$router.push({ query: { page: pageNum } })"
          >
            {{ pageNum }}
          </button>
          <span
            v-else
            class="flex items-center justify-center w-9 h-9 text-sm text-text/50 dark:text-gray-400"
          >
            ···
          </span>
        </li>

        <!-- Botón Siguiente -->
        <li>
          <button
            class="flex items-center justify-center h-9 px-3 text-text dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white"
            :disabled="props.hasMoreData"
            title="Página siguiente"
            aria-label="Ir a la página siguiente"
            :aria-disabled="props.hasMoreData"
            @click="$router.push({ query: { page: props.page + 1 } })"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';

  interface Props {
    page: number;
    isFirstPage: boolean;
    hasMoreData: boolean;
    totalPages?: number;
    itemsPerPage?: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update:items-per-page']);

  // Valor local para el selector de elementos por página
  const itemsPerPageValue = ref(props.itemsPerPage || 10);

  // Manejar cambio en el número de elementos por página
  const handleItemsPerPageChange = () => {
    emit('update:items-per-page', itemsPerPageValue.value);
  };

  // Actualizar el valor local cuando cambia la prop
  watch(
    () => props.itemsPerPage,
    (newValue) => {
      if (newValue && newValue !== itemsPerPageValue.value) {
        itemsPerPageValue.value = newValue;
      }
    },
    { immediate: true },
  );

  // Calcular las páginas que se mostrarán
  const displayedPages = computed(() => {
    if (!props.totalPages) return [props.page];

    const pages = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles

    if (props.totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1);

      // Calcular el rango de páginas alrededor de la página actual
      let startPage = Math.max(2, props.page - 1);
      let endPage = Math.min(props.totalPages - 1, props.page + 1);

      // Ajustar si estamos cerca del inicio
      if (props.page <= 2) {
        endPage = 3;
      }
      // Ajustar si estamos cerca del final
      else if (props.page >= props.totalPages - 1) {
        startPage = props.totalPages - 2;
      }

      // Añadir elipsis si es necesario antes del rango
      if (startPage > 2) {
        pages.push('...');
      }

      // Añadir páginas del rango
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Añadir elipsis si es necesario después del rango
      if (endPage < props.totalPages - 1) {
        pages.push('...');
      }

      // Siempre mostrar la última página
      pages.push(props.totalPages);
    }

    return pages;
  });
</script>
