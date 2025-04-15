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
            <h2 class="text-2xl sm:text-xl font-semibold text-text m-0">
              {{ editMode ? 'Editar Póliza' : 'Detalles de la Póliza' }}
            </h2>
          </div>
          <button
            class="p-2 rounded-lg border-none bg-transparent text-text cursor-pointer transition-all duration-300 hover:bg-input-bg hover:text-gray-500 hover:-translate-y-0.5 flex items-center justify-center dark:text-text"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Cuerpo del modal -->
        <div class="p-8 sm:p-5">
          <!-- Vista de detalles -->
          <div v-if="!editMode" class="flex flex-col gap-8">
            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <h3 class="text-lg font-semibold text-primary border-b-2 border-primary pb-2 mb-6">
                Información General
              </h3>
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <!-- Nombre de la Póliza -->
                <div
                  class="col-span-2 sm:col-span-1 bg-background border border-input-border rounded-xl p-4"
                >
                  <label class="block text-xs font-medium text-text/70 mb-2"
                    >Nombre de la Póliza</label
                  >
                  <p class="m-0 text-sm text-text">{{ policy.nombre }}</p>
                </div>

                <!-- Enlace al archivo de la Póliza -->
                <div
                  class="col-span-2 sm:col-span-1 bg-background border border-input-border rounded-xl p-4"
                >
                  <label class="block text-xs font-medium text-text/70 mb-2"
                    >Archivo de la Póliza</label
                  >
                  <a target="_blank" :href="policy.archivo_poliza as string">
                    <button class="m-0 text-sm text-text bg-gray-200">Ver archivo</button>
                  </a>
                </div>

                <div
                  class="col-span-2 sm:col-span-1 bg-background border border-input-border rounded-xl p-4"
                >
                  <label class="block text-xs font-medium text-text/70 mb-2">Descripción</label>
                  <p class="m-0 text-sm text-text whitespace-pre-line">{{ policy.descripcion }}</p>
                </div>
              </div>
            </div>

            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <h3 class="text-lg font-semibold text-primary border-b-2 border-primary pb-2 mb-6">
                Aseguradora asociada
              </h3>
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <div class="bg-background border border-input-border rounded-xl p-4">
                  <label class="block text-xs font-medium text-text/70 mb-2">Aseguradora</label>
                  <div class="flex items-center gap-2 text-sm text-text">
                    <Building2 class="w-4 h-4 text-primary opacity-70" />
                    <span>{{ policy.nombre_aseguradora }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de edición -->
          <form v-else class="flex flex-col gap-8" @submit.prevent="handleSave">
            <!-- Campos de edición -->
            <div class="bg-input-bg border border-input-border rounded-2xl p-6 sm:p-5">
              <div class="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <!-- Aseguradora -->
                <div class="col-span-2 flex flex-col gap-2">
                  <label
                    for="insurer"
                    class="flex items-center gap-2 text-sm font-medium text-text"
                  >
                    <Building2 class="w-5 h-5 text-primary" />
                    Aseguradora
                  </label>
                  <select
                    id="insurer"
                    v-model="editedPolicy!.id_aseguradora"
                    class="w-full py-3.5 pl-4 pr-10 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem]"
                    required
                    @change="checkChanges"
                  >
                    <option :value="editedPolicy?.id_aseguradora" hidden selected>
                      {{ editedPolicy?.nombre_aseguradora }}
                    </option>
                    <option
                      v-for="insurer in insurers"
                      :key="insurer.id_aseguradora"
                      :value="insurer.id_aseguradora"
                    >
                      {{ insurer.nombre }}
                    </option>
                  </select>
                </div>

                <!-- Nombre de la Póliza -->
                <div class="col-span-2 flex flex-col gap-2">
                  <label for="name" class="text-sm font-medium text-text"
                    >Nombre de la Póliza</label
                  >
                  <input
                    id="name"
                    v-model="editedPolicy!.nombre"
                    type="text"
                    class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingrese el nombre de la póliza"
                    required
                    @input="checkChanges"
                  />
                </div>

                <!-- Archivo de la póliza -->
                <div class="col-span-2 flex flex-col gap-2">
                  <label for="name" class="text-sm font-medium text-text"
                    >Archivo de la Póliza
                    <span class="text-red-700 font-light italic">* PDF o Word</span><br />
                    <span class="text-text font-thin italic small"
                      >Seleccione nuevo archivo solamente si desea reemplazarlo</span
                    >
                  </label>
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

                <!-- Descripción de la póliza -->
                <div class="col-span-2 flex flex-col gap-2">
                  <label for="description" class="text-sm font-medium text-text">Descripción</label>
                  <textarea
                    id="description"
                    v-model="editedPolicy!.descripcion"
                    class="w-full py-3.5 px-4 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
                    placeholder="Ingrese una descripción detallada de la póliza"
                    rows="4"
                    required
                    @input="checkChanges"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Pie del modal -->
        <div class="sticky bottom-0 bg-background border-t border-container-border p-8 sm:p-5">
          <div v-if="!editMode" class="flex justify-end gap-4 sm:flex-col-reverse sm:gap-3">
            <button
              class="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border bg-gray-50 border-red-500 text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white hover:-translate-y-0.5 sm:w-full sm:justify-center"
              @click="handleDelete"
            >
              <Trash2 class="w-5 h-5" />
              Eliminar
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full sm:justify-center"
              @click="handleEdit"
            >
              <Edit2 class="w-5 h-5" />
              Editar
            </button>
          </div>
          <div v-else class="flex justify-end gap-4 sm:flex-col-reverse sm:gap-3">
            <button
              type="button"
              class="px-7 py-3.5 rounded-xl text-sm font-medium border border-input-border text-text transition-all duration-300 hover:bg-input-bg hover:border-primary sm:w-full bg-gray-200 hover:text-gray-500 text-black dark:bg-transparent dark:text-text dark:hover:bg-input-bg"
              @click="cancelEdit"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-7 py-3.5 rounded-xl text-sm font-medium bg-primary text-white border-none min-w-[160px] transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg sm:w-full sm:min-w-0"
              @click="handleSave"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        <!-- Confirmación de eliminación -->
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
          @click="cancelDelete"
        >
          <div
            class="w-full max-w-[400px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] p-6 sm:p-5"
            @click.stop
          >
            <h3 class="text-xl font-semibold text-text mb-2">¿Eliminar póliza?</h3>
            <p class="text-sm text-text/70 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex gap-4 sm:flex-col sm:gap-3">
              <button
                class="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-red-500 text-white border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
                @click="confirmDelete"
              >
                Confirmar
              </button>
              <button
                class="flex-1 px-5 py-3 rounded-xl text-sm font-medium bg-gray-50 hover:bg-gray-200 border border-input-border hover:text-gray-500 dark:text-text transition-all duration-300 hover:bg-input-bg hover:border-primary"
                @click="cancelDelete"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Modal de confirmación para cerrar con cambios sin guardar -->
        <div
          v-if="showCloseConfirm"
          class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
          @click="showCloseConfirm = false"
        >
          <div
            class="w-full max-w-[400px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] p-6 sm:p-5"
            @click.stop
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-xl bg-amber-100">
                <AlertTriangle class="w-6 h-6 text-amber-500" />
              </div>
              <h3 class="text-xl font-semibold text-text">Confirmar Salida</h3>
            </div>
            <p class="text-sm text-text/70 mb-6">
              Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
            </p>
            <div class="flex justify-end gap-3">
              <button
                class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-white hover:-translate-y-0.5"
                @click="showCloseConfirm = false"
              >
                Cancelar
              </button>
              <button
                class="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
                @click="confirmClose"
              >
                Salir sin Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { X, Building2, Edit2, Trash2, AlertTriangle } from 'lucide-vue-next';
  import { Poliza } from '@/modules/admin/interfaces/polizas_interface';
  import { getPolizaAction } from '../actions/polizas_actions';
  import { Aseguradora } from '../interfaces/aseguradora_interface';
  import { getAseguradorasAction } from '../actions/aseguradoras_actions';

  const props = defineProps<{
    show: boolean;
    policy: Poliza;
    idPoliza: string;
  }>();

  const emit = defineEmits<{
    close: [];
    edit: [data: FormData];
    delete: [id_poliza: string];
  }>();

  const editMode = ref(false);
  const showDeleteConfirm = ref(false);
  const showCloseConfirm = ref(false);
  const hasChanges = ref(false);
  const archivoPoliza = ref<File | undefined>();
  //Validación de los tipos de archivo en póliza
  const fileError = ref('');
  const id_correduria = localStorage.getItem('id_correduria') ?? '';
  const insurers = ref<Aseguradora[]>([]);
  const editedPolicy = ref<Poliza | undefined>();
  const originalPolicy = ref<Poliza | undefined>();

  //FUNCIONES
  //Validar el tipo de archivo
  const validateFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize = 8 * 1024 * 1024; // 8MB en bytes

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        fileError.value = 'Solo se permiten archivos PDF o Word.';
        target.value = ''; // Borra el archivo no válido
      } else if (file.size > maxSize) {
        fileError.value = 'El archivo no debe superar los 8MB.';
        target.value = ''; // Borra el archivo no válido
      } else {
        fileError.value = '';
        archivoPoliza.value = file;
        hasChanges.value = true; // Marcar que hay cambios cuando se selecciona un archivo
      }
    }
  };

  // Función para verificar si hay cambios
  const checkChanges = () => {
    if (!editedPolicy.value || !originalPolicy.value) return;

    const original = JSON.stringify({
      nombre: originalPolicy.value.nombre,
      descripcion: originalPolicy.value.descripcion,
      id_aseguradora: originalPolicy.value.id_aseguradora,
    });

    const current = JSON.stringify({
      nombre: editedPolicy.value.nombre,
      descripcion: editedPolicy.value.descripcion,
      id_aseguradora: editedPolicy.value.id_aseguradora,
    });

    hasChanges.value = original !== current || archivoPoliza.value !== undefined;
  };

  const handleEdit = () => {
    editMode.value = true;
    editedPolicy.value = { ...props.policy };
    originalPolicy.value = JSON.parse(JSON.stringify(props.policy));
    hasChanges.value = false;
  };

  const cancelEdit = () => {
    if (hasChanges.value) {
      showCloseConfirm.value = true;
    } else {
      editMode.value = false;
    }
  };

  //Actualizar Póliza
  const handleSave = () => {
    if (
      editedPolicy.value?.nombre &&
      editedPolicy.value?.descripcion &&
      editedPolicy.value?.id_aseguradora
    ) {
      const formData = new FormData();
      formData.append('nombre', editedPolicy.value?.nombre);
      formData.append('descripcion', editedPolicy.value?.descripcion);
      formData.append('id_aseguradora', editedPolicy.value?.id_aseguradora);
      formData.append('id_poliza', props.policy.id_poliza!);

      if (archivoPoliza.value) {
        formData.append('archivo_poliza', archivoPoliza.value);
      }
      emit('edit', formData);
      editMode.value = false;
      editedPolicy.value = undefined;
      hasChanges.value = false;
      archivoPoliza.value = undefined;
    }
  };

  const handleDelete = () => {
    showDeleteConfirm.value = true;
  };

  const confirmDelete = () => {
    emit('delete', props.policy.id_poliza ?? '');
    showDeleteConfirm.value = false;
    handleClose();
  };

  const cancelDelete = () => {
    showDeleteConfirm.value = false;
  };

  const handleClose = () => {
    if (editMode.value && hasChanges.value) {
      showCloseConfirm.value = true;
    } else {
      confirmClose();
    }
  };

  const confirmClose = () => {
    editMode.value = false;
    showDeleteConfirm.value = false;
    showCloseConfirm.value = false;
    hasChanges.value = false;
    archivoPoliza.value = undefined;
    emit('close');
  };

  // Inicializar datos de edición cuando se abre el modal
  watch(
    () => props.idPoliza,
    async (idPoliza: string) => {
      //Llamado a la API para obtener los datos de la aseguradora
      const resp = await getPolizaAction(idPoliza);

      if (resp.data) {
        originalPolicy.value = JSON.parse(JSON.stringify(resp.data));
      }
    },
  );

  //Cargar la aseguradora al estar montado
  onMounted(async () => {
    try {
      const response = await getAseguradorasAction(id_correduria);
      insurers.value = response.data; // Asigna los datos a la variable reactiva
    } catch (error) {
      console.error('Error al cargar aseguradoras:', error);
    }
  });
</script>
