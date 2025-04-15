<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Cotizaciones</h1>
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="w-full md:w-[400px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar cotizaciones..."
              />
            </div>
            
            <div class="flex gap-2">
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="openFilterModal"
              >
                <FilterIcon class="w-4 h-4" />
                <span class="text-sm">Filtros</span>
                <div v-if="activeFilters > 0" class="flex items-center justify-center w-5 h-5 bg-primary text-white text-xs rounded-full">
                  {{ activeFilters }}
                </div>
              </button>
              
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-800"
                @click="exportCotizaciones"
              >
                <DownloadIcon class="w-4 h-4" />
                <span class="text-sm">Exportar</span>
              </button>
            </div>
          </div>
          
          <button
            class="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover"
            @click="showAddModal = true"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Nueva Cotización</span>
          </button>
        </div>
      </div>

      <!-- Filtros aplicados -->
      <div v-if="activeFilters > 0" class="flex flex-wrap items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
        <span class="text-sm text-gray-500 dark:text-gray-400">Filtros:</span>
        
        <div v-if="filters.status.length > 0" class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
          <span>Estado: {{ filters.status.join(', ') }}</span>
          <XIcon class="w-3 h-3 cursor-pointer" @click="clearStatusFilter" />
        </div>
        
        <div v-if="filters.date" class="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs">
          <span>Fecha: {{ filters.date }}</span>
          <XIcon class="w-3 h-3 cursor-pointer" @click="clearDateFilter" />
        </div>
        
        <button 
          class="ml-auto text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          @click="clearAllFilters"
        >
          Limpiar todos
        </button>
      </div>

      <!-- Estado de carga -->
      <div
        v-if="loading"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="animate-spin">
            <svg class="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-text/70">Cargando cotizaciones...</p>
        </div>
      </div>

      <!-- Estado sin cotizaciones -->
      <div
        v-else-if="cotizaciones.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <ClipboardList class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay cotizaciones registradas</h3>
          <p class="text-text/70 text-center max-w-md">
            Crea tu primera cotización haciendo clic en el botón "Nueva Cotización".
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchQuery && filteredCotizaciones.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron cotizaciones que coincidan con tu búsqueda. Intenta con otros términos o
            modifica los filtros aplicados.
          </p>
        </div>
      </div>

      <!-- Lista de cotizaciones -->
      <div v-else>
        <!-- Vista de tabla en pantallas medianas y grandes -->
        <div class="hidden md:block overflow-hidden bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Código
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo de Seguro
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prima Total
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="cotizacion in filteredCotizaciones" 
                :key="cotizacion.id_cotizacion"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-text">
                  #{{ cotizacion.numero_cotizacion }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ cotizacion.nombre_cliente }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ cotizacion.tipo_seguro }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ formatCurrency(cotizacion.prima_total) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span 
                    :class="getStatusClass(cotizacion.estado)"
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ cotizacion.estado }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ formatDate(cotizacion.fecha_creacion) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Ver detalles"
                      @click="viewCotizacion(cotizacion)"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="p-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                      title="Editar"
                      @click="editCotizacion(cotizacion)"
                    >
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button
                      class="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      title="Eliminar"
                      @click="confirmDelete(cotizacion)"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vista de tarjetas en dispositivos móviles -->
        <div class="grid grid-cols-1 gap-4 md:hidden">
          <div 
            v-for="cotizacion in filteredCotizaciones" 
            :key="cotizacion.id_cotizacion"
            class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
          >
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Código</p>
                  <h3 class="font-medium text-text">#{{ cotizacion.numero_cotizacion }}</h3>
                </div>
                <span 
                  :class="getStatusClass(cotizacion.estado)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ cotizacion.estado }}
                </span>
              </div>
              
              <div class="mt-3 space-y-2">
                <div class="flex justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Cliente</p>
                    <p class="text-sm text-text">{{ cotizacion.nombre_cliente }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Tipo de Seguro</p>
                    <p class="text-sm text-text">{{ cotizacion.tipo_seguro }}</p>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Prima Total</p>
                    <p class="text-sm text-text font-medium">{{ formatCurrency(cotizacion.prima_total) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
                    <p class="text-sm text-text">{{ formatDate(cotizacion.fecha_creacion) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between">
              <button
                class="flex items-center justify-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm"
                @click="viewCotizacion(cotizacion)"
              >
                <EyeIcon class="w-4 h-4" />
                <span>Ver</span>
              </button>
              
              <button
                class="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm"
                @click="editCotizacion(cotizacion)"
              >
                <EditIcon class="w-4 h-4" />
                <span>Editar</span>
              </button>
              
              <button
                class="flex items-center justify-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
                @click="confirmDelete(cotizacion)"
              >
                <TrashIcon class="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span class="font-medium">{{ paginatedCotizaciones.length }}</span> de <span class="font-medium">{{ filteredCotizaciones.length }}</span> cotizaciones
          </div>
          
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Anterior
            </button>
            
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para añadir/editar cotización -->
  <AddCotizacionModal
    v-if="showAddModal"
    :cotizacion="selectedCotizacion"
    :is-edit-mode="isEditMode"
    @close="closeAddModal"
    @save="saveCotizacion"
  />

  <!-- Modal de filtros -->
  <FilterModal
    v-if="showFilterModal"
    :filters="filters"
    @close="showFilterModal = false"
    @apply="applyFilters"
  />

  <!-- Modal de confirmación de eliminación -->
  <ConfirmDeleteModal
    v-if="showDeleteModal"
    :item-name="`cotización #${selectedCotizacion?.numero_cotizacion || ''}`"
    @close="showDeleteModal = false"
    @confirm="deleteCotizacion"
  />

  <!-- Modal para ver detalles de cotización -->
  <ViewCotizacionModal
    v-if="showViewModal"
    :cotizacion="selectedCotizacion"
    @close="showViewModal = false"
    @edit="editFromView"
    @delete="confirmDeleteFromView"
    @convert="convertToPoliza"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { 
  ClipboardList, Search, FilterIcon, PlusIcon, DownloadIcon, 
  EyeIcon, EditIcon, TrashIcon, XIcon 
} from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import SearchBar from '@/modules/common/components/SearchBar.vue';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import { supabase } from '@/lib/supabase';
import type { Filter } from '@/types/filters';

// Importar composables
import { useSearch } from '@/composables/useSearch';

// Componente de modales 
// Nota: Estos componentes se deberían crear en la carpeta components
const AddCotizacionModal = defineAsyncComponent(() => 
  import('@/modules/admin/components/AddCotizacionModal.vue')
);
const FilterModal = defineAsyncComponent(() => 
  import('@/modules/admin/components/FilterModal.vue')
);
const ConfirmDeleteModal = defineAsyncComponent(() => 
  import('@/modules/common/components/ConfirmDeleteModal.vue')
);
const ViewCotizacionModal = defineAsyncComponent(() => 
  import('@/modules/admin/components/ViewCotizacionModal.vue')
);

// Definición de tipos
interface Cotizacion {
  id_cotizacion: string;
  id_correduria: string;
  numero_cotizacion: string;
  nombre_cliente: string;
  correo_cliente: string;
  telefono_cliente: string;
  tipo_seguro: string;
  descripcion: string;
  prima_total: number;
  prima_mensual: number;
  moneda: string;
  frecuencia_pago: string;
  suma_asegurada: number;
  deducible: number;
  id_aseguradora: string;
  nombre_aseguradora?: string;
  fecha_creacion: string;
  fecha_vencimiento: string;
  estado: 'pendiente' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida' | 'convertida';
  notas_internas: string;
  creado_por: string;
}

// Estados
const loading = ref(false);
const cotizaciones = ref<Cotizacion[]>([]);
const selectedCotizacion = ref<Cotizacion | null>(null);
const showAddModal = ref(false);
const showFilterModal = ref(false);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const isEditMode = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const authStore = useAuthStore();
const { id_correduria } = storeToRefs(authStore);
const toast = useToast();

// Filtros
const filters = ref<Filter>({
  status: [],
  date: '',
  aseguradora: '',
  tipo_seguro: '',
});

// Búsqueda
const { searchQuery, filteredItems: filteredCotizaciones } = useSearch(cotizaciones, [
  'numero_cotizacion',
  'nombre_cliente',
  'tipo_seguro',
  'descripcion',
]);

// Cálculos para paginación
const totalPages = computed(() => {
  return Math.ceil(filteredCotizaciones.value.length / itemsPerPage.value);
});

const paginatedCotizaciones = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCotizaciones.value.slice(start, end);
});

// Calcular filtros activos
const activeFilters = computed(() => {
  let count = 0;
  if (filters.value.status.length > 0) count++;
  if (filters.value.date) count++;
  if (filters.value.aseguradora) count++;
  if (filters.value.tipo_seguro) count++;
  return count;
});

// Métodos
const loadCotizaciones = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select(`
        *,
        aseguradoras (nombre)
      `)
      .eq('id_correduria', id_correduria.value);

    if (error) throw error;

    // Transformar datos si es necesario
    if (data && data.length > 0) {
      cotizaciones.value = data.map(item => ({
        ...item,
        nombre_aseguradora: item.aseguradoras?.nombre || 'N/A'
      })) as Cotizacion[];
    } else {
      // Si no hay datos, inicializamos con array vacío
      cotizaciones.value = [];
      toast.info('No hay cotizaciones registradas en el sistema');
    }

  } catch (error) {
    console.error('Error al cargar cotizaciones:', error);
    toast.error(error instanceof Error ? error.message : 'Error al cargar las cotizaciones');
    // En caso de error, asegurarnos de que cotizaciones esté vacío
    cotizaciones.value = [];
  } finally {
    loading.value = false;
  }
};

const openFilterModal = () => {
  showFilterModal.value = true;
};

const applyFilters = (newFilters: Filter) => {
  filters.value = newFilters;
  showFilterModal.value = false;
  // Aquí aplicaríamos los filtros a los datos
};

const clearStatusFilter = () => {
  filters.value.status = [];
};

const clearDateFilter = () => {
  filters.value.date = '';
};

const clearAllFilters = () => {
  filters.value = {
    status: [],
    date: '',
    aseguradora: '',
    tipo_seguro: '',
  };
};

const exportCotizaciones = () => {
  toast.info('Exportando cotizaciones...');
  // Lógica para exportar
};

const viewCotizacion = (cotizacion: Cotizacion) => {
  selectedCotizacion.value = cotizacion;
  showViewModal.value = true;
};

const editCotizacion = (cotizacion: Cotizacion) => {
  selectedCotizacion.value = cotizacion;
  isEditMode.value = true;
  showAddModal.value = true;
};

const editFromView = () => {
  showViewModal.value = false;
  isEditMode.value = true;
  showAddModal.value = true;
};

const confirmDelete = (cotizacion: Cotizacion) => {
  selectedCotizacion.value = cotizacion;
  showDeleteModal.value = true;
};

const confirmDeleteFromView = () => {
  showViewModal.value = false;
  showDeleteModal.value = true;
};

const deleteCotizacion = async () => {
  try {
    if (!selectedCotizacion.value) return;
    
    // Simulación de eliminación
    await new Promise(resolve => setTimeout(resolve, 500));
    
    cotizaciones.value = cotizaciones.value.filter(
      c => c.id_cotizacion !== selectedCotizacion.value?.id_cotizacion
    );
    
    toast.success('Cotización eliminada correctamente');
    showDeleteModal.value = false;
    selectedCotizacion.value = null;
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    toast.error('Error al eliminar la cotización');
  }
};

const closeAddModal = () => {
  showAddModal.value = false;
  isEditMode.value = false;
  selectedCotizacion.value = null;
};

const saveCotizacion = (cotizacion: Record<string, unknown>) => {
  try {
    const cotizacionTipada = cotizacion as unknown as Cotizacion;
    
    if (isEditMode.value) {
      // Actualizar cotización existente
      const index = cotizaciones.value.findIndex(c => c.id_cotizacion === cotizacionTipada.id_cotizacion);
      if (index >= 0) {
        cotizaciones.value[index] = cotizacionTipada;
        toast.success('Cotización actualizada correctamente');
      }
    } else {
      // Agregar nueva cotización
      cotizaciones.value.unshift({
        ...cotizacionTipada,
        id_cotizacion: Math.random().toString(36).substring(2, 11),
        numero_cotizacion: `COT-${new Date().getFullYear()}-${(cotizaciones.value.length + 1).toString().padStart(4, '0')}`,
        fecha_creacion: new Date().toISOString(),
      });
      toast.success('Cotización creada correctamente');
    }
    
    closeAddModal();
  } catch (error) {
    console.error('Error al guardar cotización:', error);
    toast.error('Error al guardar la cotización');
  }
};

const convertToPoliza = (cotizacion: Cotizacion) => {
  toast.info(`Convirtiendo cotización ${cotizacion.numero_cotizacion} a póliza...`);
  // Implementar lógica de conversión a póliza
  showViewModal.value = false;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Funciones de formato
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'enviada':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'aprobada':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'rechazada':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'vencida':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    case 'convertida':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  await loadCotizaciones();
});
</script>
