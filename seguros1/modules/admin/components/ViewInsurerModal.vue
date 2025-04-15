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
        <!-- Fondo con efecto blur y gradiente -->
        <div class="absolute inset-0">
          <!-- Capa de imagen con blur -->
          <div
            v-if="editedInsurer"
            class="absolute inset-0 bg-cover bg-center"
            :style="{
              backgroundImage: `url(${editedInsurer.logo})`,
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
              background:
                bannerColors.length > 0
                  ? `linear-gradient(135deg, ${bannerColors
                      .map((color, index) => `${color} ${index * 33}%`)
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
                bannerGradient || 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
              mixBlendMode: 'multiply',
            }"
          />

          <!-- Capa de brillo -->
          <div
            class="absolute inset-0"
            :style="{
              background: 'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent)',
              mixBlendMode: 'overlay',
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
  import { computed, ref, watch } from 'vue';
  import { X, Edit3, Save, AlertTriangle, Trash2 } from 'lucide-vue-next';
  import { useColorThief } from '@/composables/useColorThief';
  import { getAseguradoraAction } from '../actions/aseguradoras_actions';
  import { Aseguradora } from '../interfaces/aseguradora_interface';

  const props = defineProps<{
    show: boolean;
    idAseguradora: string;
  }>();

  const emit = defineEmits<{
    close: [];
    save: [insurer: FormData];
    'delete-insurer': [name: string];
  }>();

  // Estado local para edición
  const isEditing = ref(false);
  const editedInsurer = ref<Aseguradora | null>(null);
  const hasUnsavedChanges = ref(false);
  const showCloseConfirmation = ref(false);
  const showDeleteConfirmation = ref(false);
  const showImageUploader = ref(false);
  const bannerColors = ref<string[]>([]);
  const bannerGradient = ref<string>('');
  const fileInput = ref<HTMLInputElement | null>(null);
  const imagePreview = ref<string | null>(null);

  // Función para abrir el selector de archivos
  const selectImage = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  const { extractColors, createOverlay } = useColorThief();

  // Computar clases dinámicas para la animación del modal
  const modalClasses = computed(() => ({
    'opacity-0 scale-95': !props.show,
    'opacity-100 scale-100': props.show,
  }));

  const overlayClasses = computed(() => ({
    'opacity-0 pointer-events-none': !props.show,
    'opacity-100 pointer-events-auto': props.show,
  }));

  // Manejar cambios en los datos
  const handleInputChange = () => {
    hasUnsavedChanges.value = true;
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (hasUnsavedChanges.value && isEditing.value) {
      showCloseConfirmation.value = true;
    } else {
      closeModal();
    }
  };

  const handleEdit = () => {
    isEditing.value = !isEditing.value;
  };

  const closeModal = () => {
    isEditing.value = false;
    hasUnsavedChanges.value = false;
    showCloseConfirmation.value = false;
    showImageUploader.value = false;
    bannerColors.value = [];
    bannerGradient.value = '';
    emit('close');
  };

  const cancelClose = () => {
    setTimeout(() => {
      showCloseConfirmation.value = false;
    }, 10);
  };

  // Manejar guardado de cambios
  const handleSave = () => {
    const formData = new FormData();
    if (editedInsurer.value) {
      // Agregar id_aseguradora solo si existe
      if (editedInsurer.value.id_aseguradora) {
        formData.append('id_aseguradora', editedInsurer.value.id_aseguradora);
      }

      formData.append('nombre', editedInsurer.value.nombre);
      formData.append('descripcion', editedInsurer.value.descripcion);
      formData.append('nombre_gestor', editedInsurer.value.nombre_gestor);
      formData.append('tel_gestor', editedInsurer.value.tel_gestor);
      formData.append('correo_gestor', editedInsurer.value.correo_gestor);

      // Agregar la imagen si fue cambiada
      if (editedInsurer.value.logo instanceof File) {
        formData.append('logo', editedInsurer.value.logo);
      }
    }

    if (editedInsurer.value) {
      emit('save', formData);
      isEditing.value = false;
      editedInsurer.value = null;
      hasUnsavedChanges.value = false;
    }
  };

  // Manejar eliminación de aseguradora
  const handleDeleteInsurer = (idAseguradora: string) => {
    showDeleteConfirmation.value = false;
    emit('close');
    emit('delete-insurer', idAseguradora);
  };

  // Función para manejar la carga de la imagen
  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const acceptedFormats = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/bmp',
        'image/tiff',
        'image/gif',
      ];

      if (!acceptedFormats.includes(file.type)) {
        alert('Formato de imagen no permitido. Usa PNG, JPG, JPEG, BMP, TIFF o GIF.');
        return;
      }

      // Guardar el archivo en `editedInsurer.logo`
      if (editedInsurer.value) {
        editedInsurer.value.logo = file;
      }

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          imagePreview.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Inicializar datos de edición cuando se abre el modal
  watch(
    () => props.idAseguradora,
    async (idAseguradora: string) => {
      //Llamado a la API para obtener los datos de la aseguradora
      const resp = await getAseguradoraAction(idAseguradora);

      if (resp.data) {
        editedInsurer.value = JSON.parse(JSON.stringify(resp.data));

        // Extraer colores del logo inicial (si está definido)
        if (resp.data.logo as string) {
          try {
            const colors = await extractColors(resp.data.logo as string);
            bannerColors.value = [colors.dominantColor, ...colors.palette.slice(0, 2)];
            bannerGradient.value = createOverlay(colors.dominantColor);
          } catch (error) {
            console.error('Error al extraer colores:', error);
          }
        }
      }
    },
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
