<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Pólizas</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar pólizas..."
              />
            </div>
            <div class="flex gap-4">
              <!-- Botón de Agregar Póliza -->
              <PermissionWrapper :requires="'polizas_create'">
                <button
                  @click="showAddModal = true"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90"
                >
                  <Plus class="w-4 h-4" />
                  <span>Agregar Póliza</span>
                </button>
              </PermissionWrapper>
            </div>
          </div>
        </div>
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
          <p class="text-text/70">Cargando pólizas...</p>
        </div>
      </div>

      <!-- Estado sin pólizas -->
      <div
        v-else-if="polizas.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Shield class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay pólizas registradas</h3>
          <p class="text-text/70 text-center max-w-md">
            Aún no hay pólizas registradas en el sistema. Haz clic en el botón "Nueva Póliza" para
            comenzar a agregar pólizas.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div
        v-else-if="searchQuery && filteredPolicies.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron pólizas que coincidan con tu búsqueda. Intenta con otros términos o
            revisa la ortografía.
          </p>
        </div>
      </div>

      <!-- Lista de pólizas -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="poliza in filteredPolicies"
          :key="poliza.id_poliza"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <component :is="getPolicyIcon()" class="w-8 h-8 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-text mb-2">{{ poliza.nombre }}</h3>
                <p class="text-sm text-text/70 line-clamp-2">{{ poliza.descripcion }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-text/50">Aseguradora:</span>
                  <span 
                    v-if="poliza.nombre_aseguradora" 
                    class="text-sm text-text"
                  >
                    {{ poliza.nombre_aseguradora }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5"
              @click="handleViewPolicy(poliza)"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Crear una Póliza -->
  <AddPolicyModal 
    :show="showAddModal" 
    @close="showAddModal = false" 
    @created="handleCreatedPolicy" 
  />

  <!-- Modal para visualizar o editar Póliza -->
  <ViewPolicyModal
    v-if="selectedPolicy"
    :show="showViewModal"
    :policy="selectedPolicy"
    :id-poliza="selectedPolicy?.id_poliza ?? ''"
    @edit="handleEditComplete"
    @delete="handleDeleteComplete"
    @close="handleCloseViewModal"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Shield, Search, Plus } from 'lucide-vue-next';
import AddPolicyModal from '@/modules/admin/components/AddPolicyModal.vue';
import ViewPolicyModal from '@/modules/admin/components/ViewPolicyModal.vue';
import SearchBar from '@/modules/common/components/SearchBar.vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import PermissionWrapper from '@/components/PermissionWrapper.vue';
import { usePermissions } from '@/composables/usePermissions';
import { usePolizas } from '@/composables/usePolizas';
import type { Poliza } from '@/composables/usePolizas';

// Definimos la interfaz que espera ViewPolicyModal
interface PolizaWithAseguradora extends Poliza {
  nombre_aseguradora: string;
}

// Estados
const polizas = ref<Poliza[]>([]);
const showAddModal = ref(false);
const showViewModal = ref(false);
const selectedPolicy = ref<PolizaWithAseguradora | null>(null);

// Composables
const { loading, getPolizas } = usePolizas();
const toast = useToast();
const authStore = useAuthStore();
const { id_correduria } = storeToRefs(authStore);
const permissions = usePermissions();

// Función para cargar pólizas
const loadPolizas = async () => {
  try {
    if (!id_correduria.value) {
      await authStore.getUserProfile()
    }
    
    if (id_correduria.value) {
      await fetchPolizas()
    } else {
      toast.error('No se pudo encontrar la información de la correduría')
    }
  } catch (error) {
    toast.error('Error al cargar las pólizas')
  }
};

// Función para obtener pólizas
const fetchPolizas = async () => {
  try {
    const { ok, data, message } = await getPolizas()
    
    if (!ok) {
      toast.error(message || 'Error al cargar las pólizas')
      return
    }

    polizas.value = data;
  } catch (error) {
    toast.error('Error al cargar las pólizas');
  }
};

// Manejador para cuando se crea una nueva póliza desde el modal
const handleCreatedPolicy = async (): Promise<void> => {
  showAddModal.value = false;
  await loadPolizas();
};

const handleViewPolicy = (policy: Poliza) => {
  selectedPolicy.value = {
    ...policy,
    nombre_aseguradora: policy.nombre_aseguradora || ''
  };
  showViewModal.value = true;
};

const handleCloseViewModal = () => {
  showViewModal.value = false;
  selectedPolicy.value = null;
};

// Manejadores para eventos del ViewPolicyModal
const handleEditComplete = async (): Promise<void> => {
  await loadPolizas();
};

const handleDeleteComplete = async (): Promise<void> => {
  await loadPolizas();
};

// Cargar pólizas al montar el componente
onMounted(async () => {
  await loadPolizas();
  await permissions.loadPermissions();
});

const searchQuery = ref('');
const filteredPolicies = computed(() => {
  if (!searchQuery.value) return polizas.value;
  
  const query = searchQuery.value.toLowerCase();
  return polizas.value.filter(
    poliza => 
      (poliza.nombre ? poliza.nombre.toLowerCase().includes(query) : false) ||
      (poliza.descripcion ? poliza.descripcion.toLowerCase().includes(query) : false)
  );
});

const getPolicyIcon = () => Shield;
</script>
