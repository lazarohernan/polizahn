import { ref, watch, toRaw, Ref } from 'vue';

export function useSearch<T>(items: T[] | Ref<T[]>, searchFields: (keyof T)[]) {
  const searchQuery = ref('');

  // Crear una referencia reactiva que almacena los items
  const reactiveItems = ref<T[]>(
    Array.isArray(items) ? [...toRaw(items)] : [...toRaw(items.value)],
  );

  // `filteredItems` ahora es un `ref` con el tipo correcto
  const filteredItems = ref<T[]>([]);

  watch(
    () => [reactiveItems.value, searchQuery.value],
    () => {
      if (!searchQuery.value) {
        filteredItems.value = [...reactiveItems.value];
      } else {
        const queries = searchQuery.value
          .toLowerCase()
          .split(' ')
          .filter((q) => q.length > 0);

        filteredItems.value = reactiveItems.value.filter((item) =>
          searchFields.some((field) => {
            const value = (item as T)[field];
            if (typeof value !== 'string') return false;

            const fieldValue = value.toLowerCase();
            return queries.every((query) => fieldValue.includes(query));
          }),
        );
      }
    },
    { deep: true, immediate: true },
  );

  watch(
    () => items,
    (newItems) => {
      reactiveItems.value = Array.isArray(newItems)
        ? [...toRaw(newItems)]
        : [...toRaw(newItems.value)];
      filteredItems.value = [...reactiveItems.value]; // ✅ Se resuelve el problema de tipos
    },
    { deep: true, immediate: true },
  );

  return {
    searchQuery,
    filteredItems,
  };
}
