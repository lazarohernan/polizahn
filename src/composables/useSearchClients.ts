import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import type { Cliente } from '@/modules/admin/interfaces/cliente_interface';

// Tipo para los clientes como vienen de la base de datos (con fechas en formato string)
type ClienteDB = {
  id_cliente: string;
  identificacion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  dob: string | null;
  empresa: string | null;
  tel_1: string | null;
  tel_2: string | null;
  direccion: string | null;
  foto: string | null;
  fecha_creado: string | null;
  creado_por: string | null;
  fecha_modificado: string | null;
  modificado_por: string | null;
  total_polizas?: number;
  clientes_por_correduria?: {
    id_cliente_correduria: string;
    id_correduria: string;
    fecha_creado: string;
  }[];
  id_correduria?: string;
};

export function useSearchClients() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const filteredItems = ref<Cliente[]>([]);

  // Función auxiliar para convertir fechas string a Date
  const convertDatesToDateObjects = (clients: ClienteDB[]): Cliente[] => {
    return clients.map(client => ({
      id_cliente: client.id_cliente,
      identificacion: client.identificacion,
      correo: client.correo,
      nombres: client.nombres,
      apellidos: client.apellidos,
      dob: client.dob ? new Date(client.dob) : null,
      empresa: client.empresa ?? null,
      tel_1: client.tel_1 || null,
      tel_2: client.tel_2 ?? null,
      fecha_creado: client.fecha_creado ? new Date(client.fecha_creado) : null,
      creado_por: client.creado_por,
      fecha_modificado: client.fecha_modificado ? new Date(client.fecha_modificado) : null,
      modificado_por: client.modificado_por,
      id_correduria: client.id_correduria,
      foto: client.foto ?? null,
      direccion: client.direccion ?? null,
      // Agregar propiedades adicionales si es necesario
      ...(client.total_polizas !== undefined && { total_polizas: client.total_polizas }),
      ...(client.clientes_por_correduria !== undefined && { 
        clientes_por_correduria: client.clientes_por_correduria 
      })
    })) as Cliente[];
  };

  const searchClients = async (query: string, id_correduria?: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Verificar si se tiene un id_correduria
      if (!id_correduria) {
        console.warn("useSearchClients: id_correduria no proporcionada, no se pueden filtrar clientes por correduría");
        filteredItems.value = [];
        return [];
      }

      if (!query.trim()) {
        const { data, error: searchError } = await supabase
          .from('clientes')
          .select('*, clientes_por_correduria!inner(*)')
          .eq('clientes_por_correduria.id_correduria', id_correduria)
          .order('nombres')
          .limit(50);

        if (searchError) throw searchError;
        
        // Convertir fechas a Date antes de asignar
        const clientesConFechas = convertDatesToDateObjects(data || []);
        filteredItems.value = clientesConFechas;
        return clientesConFechas;
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
        .select('*, clientes_por_correduria!inner(*)')
        .eq('clientes_por_correduria.id_correduria', id_correduria)
        .textSearch('search_vector', searchQuery)
        .order('nombres')
        .limit(50);

      if (searchError) throw searchError;
      
      // Convertir fechas a Date antes de asignar
      const clientesConFechas = convertDatesToDateObjects(data || []);
      filteredItems.value = clientesConFechas;
      return clientesConFechas;
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