import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const usePagination = () => {
  const route = useRoute(); //Necesario para obtener parámetros opcionales de la URL
  const page = ref(Number(route.query.page) || 1); //Reactiva para que vuelva a llamar la función getProductAction

  //Necesario para obligar a que se velva a
  watch(
    () => route.query.page,
    (newPage) => {
      page.value = Number(newPage) || 1;
      //Scroll hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  );

  return { page };
};
