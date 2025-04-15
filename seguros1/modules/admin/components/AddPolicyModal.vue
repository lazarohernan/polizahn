<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-0"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full max-w-[800px] max-h-[calc(100vh-3rem)] sm:max-h-screen overflow-y-auto bg-background rounded-3xl sm:rounded-none border border-container-border shadow-[0_8px_32px_var(--container-shadow)]"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div
          class="sticky top-0 z-10 p-8 sm:p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-md"
        >
          <div class="flex items-center gap-4">
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">Nueva Póliza</h2>
          </div>
          <button
            class="p-2 rounded-lg border-none bg-transparent text-text cursor-pointer transition-all duration-300 hover:bg-input-bg hover:-translate-y-0.5 flex items-center justify-center"
            @click="handleClose"
          >
            <X class="w-5 h-5 text-text hover:text-primary dark:hover:text-white" />
          </button>
        </div>

        <!-- Cuerpo del modal -->
        <div class="p-8 sm:p-5">
          <form @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-8 sm:gap-6">
              <!-- Sección de selección de la aseguradora asociada -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <div class="flex flex-col gap-2">
                    <label
                      for="insurer"
                      class="flex items-center gap-2 text-sm font-medium text-text"
                    >
                      <Building2 class="w-5 h-5 text-primary" />
                      Aseguradora asociada
                    </label>
                    <select
                      id="insurer"
                      v-model="selectedInsurer"
                      class="w-full py-3.5 pl-4 pr-10 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem]"
                      required
                    >
                      <option value="" disabled>Seleccione una aseguradora</option>
                      <option
                        v-for="insurer in insurers"
                        :key="insurer.id_aseguradora"
                        :value="insurer.id_aseguradora"
                      >
                        {{ insurer.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Sección de detalles -->
              <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
                <div class="grid grid-cols-2 gap-5 sm:grid-cols-1 sm:gap-4">
                  <!-- Nombre de la póliza -->
                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="name" class="text-sm font-medium text-text"
                      >Nombre de la Póliza</label
                    >
                    <input
                      id="name"
                      v-model="name"
                      type="text"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese el nombre de la póliza"
                      required
                    />
                  </div>

                  <!-- Archivo de la póliza -->
                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="name" class="text-sm font-medium text-text"
                      >Archivo de la Póliza
                      <span class="text-red-700 font-light italic">* PDF o Word</span></label
                    >
                    <input
                      id="policy-file"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      @change="validateFile"
                    />
                    <!-- Muestra error en caso de seleccionar un archivo inválido (NO pdf o Word) -->
                    <p v-if="fileError" class="text-red-500 text-sm mt-2">{{ fileError }}</p>
                  </div>

                  <!-- Descripción de la Póliza -->
                  <div class="col-span-2 flex flex-col gap-2">
                    <label for="description" class="text-sm font-medium text-text"
                      >Descripción</label
                    >
                    <textarea
                      id="description"
                      v-model="description"
                      class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                      placeholder="Ingrese una descripción detallada de la póliza"
                      rows="4"
                      required
                    ></textarea>
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
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-transparent border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary hover:text-primary dark:hover:text-white sm:w-full"
                @click="handleClose"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 px-7 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full"
              >
                Guardar Póliza
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { X, Building2 } from 'lucide-vue-next';
  import { Aseguradora } from '@/modules/admin/interfaces/aseguradora_interface';
  import { getAseguradorasAction } from '@/modules/admin/actions/aseguradoras_actions';

  defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
    save: [data: FormData];
  }>();

  //En esta variable reactiva se grabarán las aseguradoras
  const insurers = ref<Aseguradora[]>([]);
  //Obtener el id_correduria del localstorage
  const id_correduria = localStorage.getItem('id_correduria') ?? '';
  const name = ref('');
  const description = ref('');
  const selectedInsurer = ref('');
  const archivoPoliza = ref<File | undefined>();

  //Validación de los tipos de archivo en póliza
  const fileError = ref('');

  //Validar el tipo de archivo
  const validateFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize = 8 * 1024 * 1024; // 10MB en bytes

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        fileError.value = 'Solo se permiten archivos PDF o Word.';
        target.value = ''; // Borra el archivo no válido
      } else if (file.size > maxSize) {
        fileError.value = 'El archivo no debe superar los 10MB.';
        target.value = ''; // Borra el archivo no válido
      } else {
        fileError.value = '';
        archivoPoliza.value = file;
      }
    }
  };

  //Acción de guardar la nueva póliza (envía los datos vía emit)
  const handleSubmit = () => {
    if (name.value && description.value && selectedInsurer.value && archivoPoliza.value) {
      const formData = new FormData();
      formData.append('nombre', name.value);
      formData.append('descripcion', description.value);
      formData.append('id_aseguradora', selectedInsurer.value);
      formData.append('archivo_poliza', archivoPoliza.value);

      emit('save', formData);
      resetForm();
    }
  };

  const resetForm = () => {
    name.value = '';
    description.value = '';
    selectedInsurer.value = '';
    archivoPoliza.value = undefined;
  };

  const handleClose = () => {
    resetForm();
    emit('close');
  };

  //Cargar las aseguradoras al estar montado
  onMounted(async () => {
    try {
      const response = await getAseguradorasAction(id_correduria);
      insurers.value = response.data; // Asigna los datos a la variable reactiva
    } catch (error) {
      console.error('Error al cargar aseguradoras:', error);
    }
  });
</script>
