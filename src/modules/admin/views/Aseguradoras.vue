<template>
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Aseguradoras</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar aseguradora por nombre, descripción o servicios..."
              />
            </div>
            <PermissionWrapper superadminOnly>
              <button
                class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
                @click="showAddModal = true"
              >
                <Plus class="w-5 h-5" />
                <span>Agregar Aseguradora</span>
              </button>
            </PermissionWrapper>
          </div>
        </div>
      </div>

      <!--MENSAJE SI NO HAY REGISTROS-->
      <div
        v-if="aseguradoras !== undefined && aseguradoras.length === 0"
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-12"
      >
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-primary/10">
            <Search class="w-12 h-12 text-primary" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay registros aún</h3>
          <p class="text-text/70 text-center max-w-md">Ingresa registros.</p>
        </div>
      </div>

      <!--REGISTROS DE BD-->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="aseguradora in filteredInsurers"
          :key="aseguradora.id_aseguradora"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
        >
          <div class="relative h-[100px] overflow-hidden">
            <!-- Header con gradiente -->
            <div 
              class="absolute inset-0"
              :style="{
                background: insurerColors.get(aseguradora.nombre) || getDefaultGradient()
              }"
            />

            <!-- Avatar con iniciales o imagen -->
            <div
              class="absolute top-3 left-3 w-14 h-14 rounded-xl bg-container-bg p-1 shadow-lg transition-transform duration-300 z-10 hover:scale-105"
            >
              <div
                v-if="isGeneratedAvatar(aseguradora.logo as string)"
                class="w-full h-full rounded-lg flex items-center justify-center text-xl font-semibold text-white"
                :style="{
                  background: getAvatarBackground()
                }"
              >
                {{ generateAvatarUrl(aseguradora.nombre).split('name=')[1].split('&')[0] }}
              </div>
              <img
                v-else
                :src="aseguradora.logo as string"
                :alt="aseguradora.nombre"
                class="w-full h-full rounded-lg object-cover"
                crossorigin="anonymous"
              />
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-text mb-2">{{ aseguradora.nombre }}</h3>
            <p class="text-sm text-text/70 mb-3 line-clamp-2">{{ aseguradora.descripcion }}</p>
            <div class="p-2 bg-input-bg rounded-xl border border-input-border mb-3">
              <div class="flex flex-col items-center">
                <span class="text-base font-semibold text-primary">{{
                  aseguradora.tel_gestor ?? 'Sin registro'
                }}</span>
                <span class="text-xs text-text/70">Contacto telefónico</span>
              </div>
            </div>
            <PermissionWrapper requires="aseguradoras_view">
              <button
                class="w-full px-3 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
                @click="handleViewInsurer(aseguradora)"
              >
                Ver más
              </button>
            </PermissionWrapper>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddInsurerModal :show="showAddModal" @close="showAddModal = false" @save="handleAddInsurer" />

  <ViewInsurerModal
    :show="showViewModal"
    :id-aseguradora="selectedInsurer?.id_aseguradora ?? ''"
    @close="showViewModal = false"
    @save="handleSaveInsurer"
    @delete-insurer="handleDeleteInsurer"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useQuery, useQueryClient } from '@tanstack/vue-query';
  import { Plus, Search } from 'lucide-vue-next';
  import { useToast } from 'vue-toastification';

  //Composables y otras funciones
  import { useColorThief } from '@/composables/useColorThief';
  import { useSearch } from '@/composables/useSearch';
  import { useAseguradoras } from '@/composables/useAseguradoras';
  import { usePermissions } from '@/composables/usePermissions';
  
  //Components
  import SearchBar from '@/modules/common/components/SearchBar.vue';
  import AddInsurerModal from '@/modules/admin/components/AddInsurerModal.vue';
  import ViewInsurerModal from '@/modules/admin/components/ViewInsurerModal.vue';
  import PermissionWrapper from '@/components/PermissionWrapper.vue';

  //Types
  import type { Aseguradora } from '../interfaces/aseguradora_interface';

  const toast = useToast();
  const permissions = usePermissions();

  // Cargar permisos al iniciar el componente
  onMounted(async () => {
    if (!permissions.permissionsLoaded.value) {
      await permissions.loadPermissions();
    }
  });

  const showAddModal = ref(false);
  const showViewModal = ref(false);
  const selectedInsurer = ref<Aseguradora | null>(null);
  const insurerColors = ref<Map<string, string>>(new Map());

  //Obtener una instancia del queryClient
  const queryClient = useQueryClient();

  // Composables
  const { getAseguradoras, createAseguradora, updateAseguradora, deleteAseguradora } = useAseguradoras();

  //Llamada a la API para obtener todas las aseguradoras
  const { data: response } = useQuery({
    queryKey: [{ action: 'aseguradoras' }],
    queryFn: async () => {
      return await getAseguradoras();
    },
  });

  // Desestructuramos response para obtener aseguradoras
  const aseguradoras = computed(() => response.value?.data ?? []);

  //Variables para habilitar el SEARCH
  const { searchQuery, filteredItems } = useSearch(aseguradoras, ['nombre', 'descripcion']);
  const filteredInsurers = ref(filteredItems.value);

  // Sincronizar filteredInsurers con filteredItems
  watch(filteredItems, (newVal) => {
    filteredInsurers.value = newVal;
  });

  //-----------------FUNCIONES SOBRE COLORES Y AVATARES
  const { extractColors, createGradient, getDefaultGradient, getAvatarBackground } = useColorThief();

  // Función para verificar si es una URL de avatar generado
  const isGeneratedAvatar = (url?: string): boolean => {
    return typeof url === 'string' && url.includes('ui-avatars.com');
  };

  // Función para generar URL del avatar con iniciales
  const generateAvatarUrl = (name: string): string => {
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=124559&color=fff&size=120&bold=true&format=svg`;
  };

  // Función para manejar la vista de una aseguradora
  const handleViewInsurer = (aseguradora: Aseguradora) => {
    // Verificar si tiene permiso para ver aseguradoras
    if (!permissions.hasPermission('aseguradoras_view')) {
      toast.error('No tienes permiso para ver detalles de aseguradoras');
      return;
    }
    
    selectedInsurer.value = aseguradora;
    showViewModal.value = true;
  };

  // Función para manejar la adición de una aseguradora
  const handleAddInsurer = async (aseguradora: Partial<Aseguradora>) => {
    if (!permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para crear aseguradoras');
      return;
    }
    
    try {
      const res = await createAseguradora(aseguradora);

      if (res.ok) {
        toast.success('Aseguradora creada exitosamente!');
        showAddModal.value = false;
        queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });
      }
    } catch (error) {
      toast.error('Error al crear la aseguradora');
    }
  };

  // Función para manejar la actualización de una aseguradora
  const handleSaveInsurer = async (aseguradora: Aseguradora) => {
    if (!permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para editar aseguradoras');
      return;
    }
    
    try {
      const res = await updateAseguradora(aseguradora.id_aseguradora!, aseguradora);

      if (res.ok) {
        toast.success('Aseguradora actualizada exitosamente!');
        showViewModal.value = false;
        queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });
      }
    } catch (error) {
      toast.error('Error al actualizar la aseguradora');
    }
  };

  // Función para eliminar una aseguradora
  const handleDeleteInsurer = async (id_aseguradora: string) => {
    if (!permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para eliminar aseguradoras');
      return;
    }
    
    try {
      const res = await deleteAseguradora(id_aseguradora);

      if (res.ok) {
        toast.success('Aseguradora eliminada exitosamente!');
        showViewModal.value = false;
        queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });
      }
    } catch (error) {
      toast.error('Error al eliminar la aseguradora');
    }
  };

  onMounted(async () => {
    await permissions.loadPermissions();
    
    for (const aseguradora of aseguradoras.value) {
      if (!isGeneratedAvatar(aseguradora.logo as string)) {
        try {
          const { dominantColor } = await extractColors(aseguradora.logo as string);
          const gradient = createGradient(dominantColor);
          insurerColors.value.set(aseguradora.nombre, gradient);
        } catch {
          insurerColors.value.set(aseguradora.nombre, getDefaultGradient());
        }
      } else {
        insurerColors.value.set(aseguradora.nombre, getDefaultGradient());
      }
    }
  });
</script>
