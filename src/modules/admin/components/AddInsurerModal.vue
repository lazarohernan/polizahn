<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full max-w-[800px] max-h-[calc(100vh-3rem)] overflow-y-auto bg-background rounded-3xl sm:rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)]"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div
          class="sticky top-0 z-10 p-8 sm:p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-md"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: #2997C2">
              <Building2 class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">Nueva Aseguradora</h2>
          </div>
          <button
            class="p-2 rounded-lg border-none bg-transparent text-text cursor-pointer transition-all duration-300 hover:bg-input-bg hover:-translate-y-0.5 hover:text-black flex items-center justify-center"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Cuerpo del modal -->
        <div class="p-8 sm:p-5">
          <form @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-8 sm:gap-6">
              <!-- Sección de logo -->
              <div class="flex flex-col items-center gap-4">
                <div
                  class="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-container-border hover:border-primary hover:scale-105 transition-all duration-300"
                >
                  <img :src="logoPreview" alt="Logo preview" class="w-full h-full object-cover" />
                </div>
                <!-- Botón para subir logo -->
                <button
                  type="button"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5"
                  @click="selectImage"
                >
                  <Upload class="w-5 h-5" />
                  <span>Subir Logo</span>
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

              <!-- Sección de información de la aseguradora -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="flex items-center gap-3 mb-6 sm:mb-5">
                  <Building2 class="w-5 h-5 text-primary" />
                  <h3 class="text-lg font-semibold text-text m-0">Información de la Aseguradora</h3>
                </div>
                <div class="flex flex-col gap-5">
                  <div class="flex flex-col gap-2">
                    <label for="name" class="text-sm font-medium text-text"
                      >Nombre de la Aseguradora</label
                    >
                    <div class="relative flex items-center">
                      <Building2
                        class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100"
                      />
                      <input
                        id="name"
                        v-model="nombre"
                        type="text"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese el nombre"
                        required
                      />
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="description" class="text-sm font-medium text-text"
                      >Descripción</label
                    >
                    <textarea
                      id="description"
                      v-model="descripcion"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                      placeholder="Ingrese una descripción detallada de la aseguradora"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Sección de información del gestor -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="flex items-center gap-3 mb-6 sm:mb-5">
                  <User class="w-5 h-5 text-primary" />
                  <h3 class="text-lg font-semibold text-text m-0">
                    Información del Gestor de la Aseguradora
                  </h3>
                </div>
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <div class="flex flex-col gap-2">
                    <label for="managerName" class="text-sm font-medium text-text"
                      >Nombre del Gestor</label
                    >
                    <div class="relative flex items-center">
                      <User
                        class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100"
                      />
                      <input
                        id="managerName"
                        v-model="nombre_gestor"
                        type="text"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese el nombre completo"
                      />
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="managerPhone" class="text-sm font-medium text-text"
                      >Teléfono del Gestor</label
                    >
                    <div class="relative flex items-center">
                      <Phone
                        class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100"
                      />
                      <input
                        id="managerPhone"
                        v-model="tel_gestor"
                        type="tel"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="+504 XXXX XXXX"
                      />
                    </div>
                  </div>

                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="managerEmail" class="text-sm font-medium text-text"
                      >Correo del Gestor</label
                    >
                    <div class="relative flex items-center">
                      <Mail
                        class="absolute left-4 w-5 h-5 text-text opacity-50 transition-opacity duration-300 group-focus-within:opacity-100"
                      />
                      <input
                        id="managerEmail"
                        v-model="correo_gestor"
                        type="email"
                        class="w-full py-3.5 pl-12 pr-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones del formulario -->
            <div
              class="flex flex-row gap-4 mt-8 pt-6 border-t border-container-border sm:flex-col-reverse sm:gap-3"
            >
              <button
                type="button"
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-transparent border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary hover:text-[#3C7A89] sm:w-full"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full"
              >
                Guardar Aseguradora
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { X, Upload, Building2, User, Phone, Mail } from 'lucide-vue-next';
  import { useAseguradoras } from '@/composables/useAseguradoras';
  import { useStorage } from '@/composables/useStorage';
  import { useToast } from 'vue-toastification';
  import type { Aseguradora } from '../interfaces/aseguradora_interface';

  const props = defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', aseguradora: Aseguradora): void;
  }>();

  const toast = useToast();
  const { uploadLogo } = useStorage();
  const fileInput = ref<HTMLInputElement | null>(null);

  // Variables del formulario
  const nombre = ref('');
  const descripcion = ref('');
  const nombre_gestor = ref('');
  const tel_gestor = ref('');
  const correo_gestor = ref('');
  const logo = ref<File | string | null>(null);
  const logoPreview = ref<string>('https://ui-avatars.com/api/?background=124559&color=fff&size=100&bold=true&format=svg');

  const handleClose = () => {
    resetForm();
    emit('close');
  };

  const resetForm = () => {
    nombre.value = '';
    descripcion.value = '';
    nombre_gestor.value = '';
    tel_gestor.value = '';
    correo_gestor.value = '';
    logo.value = null;
    logoPreview.value = 'https://ui-avatars.com/api/?background=124559&color=fff&size=100&bold=true&format=svg';
  };

  const selectImage = () => {
    fileInput.value?.click();
  };

  const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      logo.value = file;
      logoPreview.value = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      let logoUrl = logoPreview.value;

      // Si hay un nuevo logo, subirlo primero
      if (logo.value instanceof File) {
        try {
          // Generar un ID temporal para el archivo
          const tempId = Math.random().toString(36).substring(2);
          logoUrl = await uploadLogo(logo.value, tempId);
        } catch (error) {
          toast.error('Error al subir el logo: ' + (error as Error).message);
          return;
        }
      }

      // Crear la aseguradora
      const aseguradora: Partial<Aseguradora> = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        nombre_gestor: nombre_gestor.value || null,
        tel_gestor: tel_gestor.value || null,
        correo_gestor: correo_gestor.value || null,
        logo: logoUrl
      };

      emit('save', aseguradora as Aseguradora);
      resetForm();
    } catch (error) {
      toast.error('Error al crear la aseguradora');
      console.error(error);
    }
  };
</script>
