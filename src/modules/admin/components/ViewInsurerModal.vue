<template>
  <!-- Overlay con efecto de desenfoque -->
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[999]"
    :class="overlayClasses"
    @click="handleClose"
  >
    <!-- Contenedor del modal -->
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] max-h-[90vh] bg-background rounded-2xl shadow-xl transition-all duration-300 overflow-hidden"
      :class="modalClasses"
      @click.stop
    >
      <!-- Encabezado del modal -->
      <div class="relative h-[180px] overflow-hidden">
        <!-- Fondo con gradiente -->
        <div class="absolute inset-0">
          <div
            class="absolute inset-0"
            :style="{
              background: bannerGradient || getDefaultGradient()
            }"
          />
        </div>

        <!-- Botón de cerrar -->
        <button
          class="absolute top-4 right-4 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 text-white transition-transform duration-300 hover:scale-110 z-10"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- Logo y botón de cambiar -->
        <div class="absolute top-6 left-6 flex items-center gap-3">
          <div class="w-20 h-20 rounded-2xl bg-background p-2 shadow-lg z-10">
            <img
              v-if="editedInsurer"
              :src="imagePreview || (editedInsurer.logo as string)"
              :alt="editedInsurer?.nombre"
              class="w-full h-full rounded-xl object-cover"
            />
          </div>
          <button
            v-if="isEditing"
            class="px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 text-white text-sm font-medium transition-all duration-300 hover:bg-black/30 hover:-translate-y-0.5 hover:shadow-lg z-10"
            @click="selectImage"
          >
            Cambiar imagen
          </button>

          <!-- Input de archivo oculto -->
          <input
            ref="fileInput"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/bmp, image/tiff, image/gif"
            class="hidden"
            @change="handleImageUpload"
          />
        </div>
      </div>

      <!-- Contenido del modal -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
        <div v-if="editedInsurer" class="space-y-6">
          <!-- Información principal -->
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <input
                  v-if="isEditing"
                  v-model="editedInsurer.nombre"
                  type="text"
                  class="w-full text-2xl font-semibold text-text bg-input-bg border border-input-border rounded-xl px-4 py-2 transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  @input="handleInputChange"
                />
                <h2 v-else class="text-2xl font-semibold text-text">{{ editedInsurer.nombre }}</h2>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
                  @click="showDeleteConfirmation = true"
                >
                  <Trash2 class="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
                <button
                  v-if="isEditing"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                  @click="handleSave"
                >
                  <Save class="w-4 h-4" />
                  <span>Guardar</span>
                </button>
                <button
                  v-else
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                  @click="handleEdit"
                >
                  <Edit3 class="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
            <div>
              <textarea
                v-if="isEditing"
                v-model="editedInsurer.descripcion"
                rows="3"
                class="w-full text-text bg-input-bg border border-input-border rounded-xl px-4 py-2 resize-none transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                @input="handleInputChange"
              />
              <p v-else class="text-text/70">{{ editedInsurer.descripcion }}</p>
            </div>
          </div>

          <!-- Información de contacto -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-text">Información de Contacto</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                class="flex items-center gap-3 p-3 bg-input-bg rounded-xl border border-input-border transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <input
                  v-if="isEditing"
                  v-model="editedInsurer.nombre_gestor"
                  type="text"
                  placeholder="Nombre"
                  class="flex-1 bg-transparent border-none text-sm text-text focus:outline-none"
                  @input="handleInputChange"
                />
                <span v-else class="text-sm text-text">{{
                  editedInsurer.nombre_gestor || 'Sin registro'
                }}</span>
              </div>
              <div
                class="flex items-center gap-3 p-3 bg-input-bg rounded-xl border border-input-border transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <input
                  v-if="isEditing"
                  v-model="editedInsurer.tel_gestor"
                  type="tel"
                  placeholder="Teléfono"
                  class="flex-1 bg-transparent border-none text-sm text-text focus:outline-none"
                  @input="handleInputChange"
                />
                <span v-else class="text-sm text-text">{{
                  editedInsurer.tel_gestor || 'Sin registro'
                }}</span>
              </div>
            </div>
            <div
              class="flex items-center gap-3 p-3 bg-input-bg rounded-xl border border-input-border transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <input
                v-if="isEditing"
                v-model="editedInsurer.correo_gestor"
                type="email"
                placeholder="Correo"
                class="flex-1 bg-transparent border-none text-sm text-text focus:outline-none"
                @input="handleInputChange"
              />
              <span v-else class="text-sm text-text">{{
                editedInsurer.correo_gestor || 'Sin registro'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para cerrar -->
    <div
      v-if="showCloseConfirmation"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
      @click.self="cancelClose"
    >
      <div class="w-full max-w-md bg-background rounded-2xl p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle class="w-5 h-5 text-amber-500" />
          </div>
          <h3 class="text-lg font-semibold text-text">¿Descartar cambios?</h3>
        </div>
        <p class="text-text/70">Hay cambios sin guardar. ¿Estás seguro de que deseas cerrar?</p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
            @click="cancelClose"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="closeModal"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
      @click.self="showDeleteConfirmation = false"
    >
      <div class="w-full max-w-md bg-background rounded-2xl p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle class="w-5 h-5 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-text">Confirmar Eliminación</h3>
        </div>
        <p class="text-text/70">
          ¿Está seguro que desea eliminar la aseguradora
          <span class="font-medium text-text">{{ editedInsurer?.nombre }}</span
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
            @click="showDeleteConfirmation = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="handleDeleteInsurer(editedInsurer?.id_aseguradora ?? '')"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de subida de imagen -->
    <div
      v-if="showImageUploader"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
      @click.stop
    >
      <div class="w-full max-w-md bg-background rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-text">Cambiar imagen</h3>
          <button
            class="p-2 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
            @click="showImageUploader = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { Edit3, Save, Trash2, X, AlertTriangle } from 'lucide-vue-next';
  import { useColorThief } from '@/composables/useColorThief';
  import { useAseguradoras } from '@/composables/useAseguradoras';
  import type { Aseguradora } from '../interfaces/aseguradora_interface';

  const props = defineProps<{
    show: boolean;
    idAseguradora: string;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', aseguradora: Aseguradora): void;
    (e: 'delete-insurer', id: string): void;
  }>();

  // Composables
  const { getAseguradora } = useAseguradoras();
  const { extractColors, createGradient, getDefaultGradient, getAvatarBackground } = useColorThief();

  // Referencias
  const fileInput = ref<HTMLInputElement | null>(null);
  const editedInsurer = ref<Aseguradora | null>(null);
  const originalInsurer = ref<Aseguradora | null>(null);
  const isEditing = ref(false);
  const showCloseConfirmation = ref(false);
  const showDeleteConfirmation = ref(false);
  const showImageUploader = ref(false);
  const imagePreview = ref<string | null>(null);
  const bannerGradient = ref<string | null>(null);

  // Clases computadas
  const overlayClasses = computed(() => ({
    'opacity-0 pointer-events-none': !props.show,
    'opacity-100': props.show,
  }));

  const modalClasses = computed(() => ({
    'opacity-0 scale-95': !props.show,
    'opacity-100 scale-100': props.show,
  }));

  // Funciones
  const selectImage = () => {
    showImageUploader.value = true;
    fileInput.value?.click();
  };

  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      editedInsurer.value!.logo = file;
      imagePreview.value = URL.createObjectURL(file);
      showImageUploader.value = false;
    }
  };

  const handleInputChange = () => {
    // Aquí puedes agregar validaciones si es necesario
  };

  const handleEdit = () => {
    isEditing.value = true;
  };

  const handleSave = () => {
    if (editedInsurer.value) {
      emit('save', editedInsurer.value);
      isEditing.value = false;
    }
  };

  const handleClose = () => {
    if (isEditing.value && hasChanges.value) {
      showCloseConfirmation.value = true;
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    isEditing.value = false;
    showCloseConfirmation.value = false;
    showImageUploader.value = false;
    editedInsurer.value = null;
    originalInsurer.value = null;
    imagePreview.value = null;
    emit('close');
  };

  const cancelClose = () => {
    showCloseConfirmation.value = false;
  };

  const handleDeleteInsurer = (idAseguradora: string) => {
    showDeleteConfirmation.value = false;
    emit('close');
    emit('delete-insurer', idAseguradora);
  };

  // Verificar si hay cambios sin guardar
  const hasChanges = computed(() => {
    if (!editedInsurer.value || !originalInsurer.value) return false;

    return (
      editedInsurer.value.nombre !== originalInsurer.value.nombre ||
      editedInsurer.value.descripcion !== originalInsurer.value.descripcion ||
      editedInsurer.value.nombre_gestor !== originalInsurer.value.nombre_gestor ||
      editedInsurer.value.tel_gestor !== originalInsurer.value.tel_gestor ||
      editedInsurer.value.correo_gestor !== originalInsurer.value.correo_gestor ||
      editedInsurer.value.logo !== originalInsurer.value.logo
    );
  });

  // Cargar datos de la aseguradora
  watch(
    () => props.show,
    async (newValue) => {
      if (newValue && props.idAseguradora) {
        const response = await getAseguradora(props.idAseguradora);
        if (response.ok && response.data) {
          editedInsurer.value = { ...response.data };
          originalInsurer.value = { ...response.data };

          // Extraer colores del logo o usar el color por defecto para avatares generados
          if (typeof editedInsurer.value.logo === 'string') {
            if (editedInsurer.value.logo.includes('ui-avatars.com')) {
              bannerGradient.value = `linear-gradient(135deg, 
                ${getAvatarBackground()},
                ${getAvatarBackground()}DD,
                ${getAvatarBackground()}AA
              )`;
            } else {
              try {
                const { dominantColor } = await extractColors(editedInsurer.value.logo);
                bannerGradient.value = createGradient(dominantColor);
              } catch (error) {
                console.error('Error extracting colors:', error);
                bannerGradient.value = getDefaultGradient();
              }
            }
          } else {
            bannerGradient.value = getDefaultGradient();
          }
        }
      }
    },
    { immediate: true }
  );
</script>

<style>
  .vue-advanced-cropper {
    background: transparent !important;
  }
  .vue-advanced-cropper__background {
    background: var(--color-input-bg) !important;
    opacity: 0.5 !important;
  }
  .vue-advanced-cropper__foreground {
    border-radius: 0.75rem !important;
  }
  .vue-advanced-cropper__stencil {
    border-radius: 0.75rem !important;
  }
</style>
