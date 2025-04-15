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
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
              @click="showAddModal = true"
            >
              <Plus class="w-5 h-5" />
              <span>Agregar Aseguradora</span>
            </button>
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
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="aseguradora in filteredInsurers"
          :key="aseguradora.id_aseguradora"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
        >
          <div class="relative h-[120px] overflow-hidden">
            <!-- Fondo con efecto blur y gradiente -->
            <div class="absolute inset-0">
              <!-- Capa de imagen con blur (solo si no es un avatar generado) -->
              <div
                v-if="!isGeneratedAvatar(aseguradora.logo as string)"
                class="absolute inset-0 bg-cover bg-center"
                :style="{
                  backgroundImage: `url(${aseguradora.logo})`,
                  backgroundSize: '150%',
                  filter: 'blur(24px) saturate(1.2)',
                  transform: 'scale(1.2)',
                  opacity: 0.6,
                }"
              />

              <!-- Capa de gradiente de color -->
              <div
                class="absolute inset-0"
                :style="{
                  background: insurerColors.get(aseguradora.nombre)?.colors.length
                    ? `linear-gradient(135deg, ${insurerColors
                        .get(aseguradora.nombre)
                        ?.colors.map((color, index) => `${color} ${index * 33}%`)
                        .join(', ')})`
                    : 'var(--color-primary)',
                  opacity: 0.7,
                  mixBlendMode: 'soft-light',
                }"
              />

              <!-- Capa de overlay -->
              <div
                class="absolute inset-0"
                :style="{
                  background:
                    insurerColors.get(aseguradora.nombre)?.gradient ||
                    'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
                  mixBlendMode: 'multiply',
                }"
              />

              <!-- Capa de brillo -->
              <div
                class="absolute inset-0"
                :style="{
                  background:
                    'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent)',
                  mixBlendMode: 'overlay',
                }"
              />
            </div>

            <!-- Avatar con iniciales o imagen -->
            <div
              class="absolute top-4 left-4 w-16 h-16 rounded-xl bg-container-bg p-1 shadow-lg transition-transform duration-300 z-10 hover:scale-105"
            >
              <div
                v-if="isGeneratedAvatar(aseguradora.logo as string)"
                class="w-full h-full rounded-lg flex items-center justify-center text-xl font-semibold"
                :style="{
                  backgroundColor:
                    insurerColors.get(aseguradora.nombre)?.colors[0] || 'var(--color-primary)',
                  color: '#ffffff',
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
          <div class="p-6">
            <h3 class="text-xl font-semibold text-text mb-3">{{ aseguradora.nombre }}</h3>
            <p class="text-sm text-text/70 mb-4 line-clamp-2">{{ aseguradora.descripcion }}</p>
            <div class="p-3 bg-input-bg rounded-xl border border-input-border mb-4">
              <div class="flex flex-col items-center">
                <span class="text-lg font-semibold text-primary">{{
                  aseguradora.tel_gestor ?? 'Sin registro'
                }}</span>
                <span class="text-xs text-text/70">Contacto telefónico</span>
              </div>
            </div>
            <button
              class="w-full px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
              @click="handleViewInsurer(aseguradora)"
            >
              Ver más
            </button>
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
    @delete-insurer="deleteAseguradora"
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
  import {
    createAseguradoraAction,
    deleteAseguradoraAction,
    getAseguradorasAction,
    updateAseguradoraAction,
  } from '../actions/aseguradoras_actions';

  //Types
  import type { Aseguradora } from '../interfaces/aseguradora_interface';

  //Components
  import SearchBar from '@/modules/common/components/SearchBar.vue';
  import AddInsurerModal from '@/modules/admin/components/AddInsurerModal.vue';
  import ViewInsurerModal from '@/modules/admin/components/ViewInsurerModal.vue';

  const toast = useToast();

  const showAddModal = ref(false);
  const showViewModal = ref(false);
  const selectedInsurer = ref<Aseguradora | null>(null);
  const insurerColors = ref<Map<string, { colors: string[]; gradient: string }>>(new Map());

  //Obtener una instancia del queryClient
  const queryClient = useQueryClient();

  //Obtener el id_correduria del localstorage
  const id_correduria = localStorage.getItem('id_correduria') ?? '';

  //Llamada a la API para obtener todas las aseguradoras
  const { data: response } = useQuery({
    queryKey: [{ action: 'aseguradoras' }],
    queryFn: async () => {
      return await getAseguradorasAction(id_correduria);
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

  //-----------------FUNCIONES SOBRE COLORES, ESTILOS Y AVATARES
  const { extractColors, createOverlay } = useColorThief();

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
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8CBFCF&color=fff&size=120&bold=true&format=svg`;
  };

  // Función para obtener colores predefinidos para avatares generados
  const getDefaultColors = (name: string) => {
    // Usar el primer carácter del nombre para seleccionar un color
    const colors = [
      {
        base: '#8CBFCF',
        gradient: 'linear-gradient(to bottom, rgba(140,191,207,0.5), rgba(140,191,207,0.2))',
      },
      {
        base: '#9BC53D',
        gradient: 'linear-gradient(to bottom, rgba(155,197,61,0.5), rgba(155,197,61,0.2))',
      },
      {
        base: '#373F51',
        gradient: 'linear-gradient(to bottom, rgba(55,63,81,0.5), rgba(55,63,81,0.2))',
      },
      {
        base: '#E76F51',
        gradient: 'linear-gradient(to bottom, rgba(231,111,81,0.5), rgba(231,111,81,0.2))',
      },
      {
        base: '#2A9D8F',
        gradient: 'linear-gradient(to bottom, rgba(42,157,143,0.5), rgba(42,157,143,0.2))',
      },
    ];
    const index = name.charCodeAt(0) % colors.length;
    return {
      colors: [colors[index].base],
      gradient: colors[index].gradient,
    };
  };

  // Función para extraer y guardar colores del logo
  const extractLogoColors = async (insurer: Partial<Aseguradora>) => {
    // Si es un avatar generado, usar colores predefinidos
    if (isGeneratedAvatar(insurer.logo as string)) {
      insurerColors.value.set(insurer.nombre as string, getDefaultColors(insurer.nombre as string));
      return;
    }

    // Si es una imagen real, intentar extraer colores
    try {
      const colors = await extractColors(insurer.logo as string);
      insurerColors.value.set(insurer.nombre as string, {
        colors: [colors.dominantColor, ...colors.palette.slice(0, 2)],
        gradient: createOverlay(colors.dominantColor),
      });
    } catch (error) {
      console.error('Error al extraer colores:', error);
      // Usar colores predefinidos en caso de error
      insurerColors.value.set(insurer.nombre as string, getDefaultColors(insurer.nombre as string));
    }
  };

  // Inicializar colores para todas las aseguradoras
  onMounted(async () => {
    for (const insurer of aseguradoras.value) {
      await extractLogoColors(insurer);
    }
  });

  //!---------------------FUNCIONES PARA VER, EDITAR O AGREGAR ASEGURADORA
  //AGREGAR ASEGURADORA
  const handleAddInsurer = async (data: FormData) => {
    const newInsurer: Partial<Aseguradora> = {
      id_correduria,
      nombre: data.get('nombre') as string,
      descripcion: data.get('descripcion') as string,
      nombre_gestor: data.get('nombre_gestor') as string,
      tel_gestor: data.get('tel_gestor') as string,
      correo_gestor: data.get('correo_gestor') as string,
      logo: data.get('logo') as File | string, // Puede ser un archivo o una URL
    };

    try {
      // Llamar a la API para crear la aseguradora
      const resp = await createAseguradoraAction(newInsurer);
      if (resp.ok) {
        // ❗ Invalidar la consulta para forzar actualización de datos
        await queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });

        // Cerrar el modal
        showAddModal.value = false;

        toast.success('Registro agregado exitosamente!');
      } else {
        toast.error('Ocurrió un error al agregar el registro!');
      }
    } catch (error) {
      console.error('Error al agregar aseguradora:', error);
      toast.error('Ocurrió un error al agregar el registro!');
    }
  };

  //ACTIVAR MODAL PARA VER LA ASEGURADORA
  const handleViewInsurer = (insurer: Aseguradora) => {
    selectedInsurer.value = insurer;
    showViewModal.value = true;
  };

  //BORRAR ASEGURADORA
  const deleteAseguradora = async (id_aseguradora: string) => {
    try {
      const resp = await deleteAseguradoraAction(id_aseguradora);

      if (resp.ok) {
        if (resp.ok) {
          // ❗ Invalidar la consulta para forzar actualización de datos
          await queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });

          // Cerrar el modal
          showViewModal.value = false;
          selectedInsurer.value = null;

          toast.warning('Registro borrado exitosamente!');
        } else {
          toast.error('Ocurrió un error al borrar el registro!');
        }
      }
    } catch (error) {
      console.error('Error al borrar aseguradora:', error);
      toast.error('Ocurrió un error al borrar el registro!');
    }
  };

  //ACTUALIZAR ASEGURADORA
  const handleSaveInsurer = async (data: FormData) => {
    data.append('id_correduria', id_correduria);

    try {
      // Llamar a la API para crear la aseguradora
      const resp = await updateAseguradoraAction(data);
      if (resp.ok) {
        // ❗ Invalidar la consulta para forzar actualización de datos
        await queryClient.invalidateQueries({ queryKey: [{ action: 'aseguradoras' }] });

        // Cerrar el modal
        showViewModal.value = false;
        selectedInsurer.value = null;

        toast.info('Registro actualizado exitosamente!');
      } else {
        toast.error('Ocurrió un error al actualizar el registro!');
      }
    } catch (error) {
      console.error('Error al actualizar aseguradora:', error);
      toast.error('Ocurrió un error al actualizar el registro!');
    }
  };
</script>
