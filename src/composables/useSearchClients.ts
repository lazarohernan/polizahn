import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/types';

export function useSearchClients() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const filteredItems = ref<Cliente[]>([]);

  const searchClients = async (query: string, id_correduria: string) => {
    loading.value = true;
    error.value = null;

    try {
      if (!query.trim()) {
        const { data, error: searchError } = await supabase
          .from('clientes')
          .select()
          .eq('id_correduria', id_correduria)
          .order('nombres')
          .limit(50);

        if (searchError) throw searchError;
        filteredItems.value = data || [];
        return data;
      }

      // Preparar la consulta para búsqueda en español
      const searchQuery = query
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.toLowerCase())
        .join(' & ');

      const { data, error: searchError } = await supabase
        .from('clientes')
        .select()
        .eq('id_correduria', id_correduria)
        .textSearch('search_vector', searchQuery)
        .order('nombres')
        .limit(50);

      if (searchError) throw searchError;
      filteredItems.value = data || [];
      return data;
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      error.value = err as Error;
      filteredItems.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    searchClients,
    filteredItems
  };
} 