<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center z-[1100]"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full h-[90vh] md:h-auto md:max-h-[90vh] md:w-[90%] lg:w-[700px] overflow-y-auto bg-background dark:bg-gray-900 rounded-t-[2rem] md:rounded-[2rem] border border-container-border dark:border-gray-700 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors duration-200"
        @click.stop
      >
        <!-- Encabezado -->
        <div class="sticky top-0 z-10 p-5 md:p-5 border-b border-container-border bg-background/80 backdrop-blur-xl">
          <div class="flex items-center justify-between gap-3 md:gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-text m-0">{{ editMode ? 'Editar Póliza' : 'Información de Póliza' }}</h2>
                <p class="text-sm text-text/60 mt-0.5 m-0">{{ editMode ? 'Modifique los detalles de la póliza' : 'Información detallada de la póliza' }}</p>
              </div>
            </div>
            <button
              class="p-2.5 rounded-xl border-none bg-input-bg text-text cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center"
              @click="handleClose"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Cuerpo del modal -->
        <div class="p-5">
          <!-- Vista de detalles -->
          <div v-if="!editMode" class="flex flex-col gap-4">
            <!-- Información General -->
            <div class="bg-input-bg/50 border border-input-border rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <FileText class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text m-0">Información General</h3>
                  <p class="text-xs text-text/60 m-0">Detalles básicos de la póliza</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <!-- Nombre -->
                <div class="bg-background border border-input-border rounded-xl p-3">
                  <label class="text-xs font-medium text-text/70 mb-1 block">Nombre de la Póliza</label>
                  <p class="m-0 text-sm text-text">{{ policy.nombre }}</p>
                </div>

                <!-- Archivo -->
                <div class="bg-background border border-input-border rounded-xl p-3">
                  <label class="text-xs font-medium text-text/70 mb-1 block">Archivo de la Póliza</label>
                  <div class="flex items-center gap-2">
                    <a 
                      :href="getPolicyFileUrl(policy.archivo_poliza)" 
                      target="_blank" 
                      class="px-3 py-1.5 rounded-lg bg-primary text-white text-sm flex items-center gap-1.5 no-underline hover:bg-primary-hover transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Ver documento
                    </a>
                  </div>
                </div>

                <!-- Descripción -->
                <div class="bg-background border border-input-border rounded-xl p-3">
                  <label class="text-xs font-medium text-text/70 mb-1 block">Descripción</label>
                  <p class="m-0 text-sm text-text whitespace-pre-line">{{ policy.descripcion }}</p>
                </div>
              </div>
            </div>

            <!-- Aseguradora -->
            <div class="bg-input-bg/50 border border-input-border rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <Building2 class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text m-0">Aseguradora</h3>
                  <p class="text-xs text-text/60 m-0">Información de la aseguradora asociada</p>
                </div>
              </div>

              <div class="bg-background border border-input-border rounded-xl p-3">
                <label class="text-xs font-medium text-text/70 mb-1 block">Nombre de la Aseguradora</label>
                <div class="flex items-center gap-2 text-sm text-text">
                  <Building2 class="w-4 h-4 text-primary opacity-70" />
                  <span>{{ policy.nombre_aseguradora }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario de edición -->
          <form v-else class="flex flex-col gap-4" @submit.prevent="handleSave">
            <!-- Aseguradora -->
            <div class="bg-input-bg/50 border border-input-border rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <Building2 class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text m-0">Aseguradora</h3>
                  <p class="text-xs text-text/60 m-0">Seleccione la aseguradora para esta póliza</p>
                </div>
              </div>

              <select
                id="insurer"
                v-model="editedPolicy!.id_aseguradora"
                class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border bg-background text-text text-xs md:text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem]"
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

            <!-- Detalles -->
            <div class="bg-input-bg/50 border border-input-border rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <FileText class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text m-0">Detalles de la Póliza</h3>
                  <p class="text-xs text-text/60 m-0">Modifique la información de la póliza</p>
                </div>
              </div>

              <div class="space-y-3">
                <!-- Nombre -->
                <div>
                  <label class="text-xs md:text-sm font-medium text-text flex items-center gap-2 mb-1.5">
                    <Type class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Nombre de la Póliza
                  </label>
                  <input
                    id="name"
                    v-model="editedPolicy!.nombre"
                    type="text"
                    class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border bg-background text-text text-xs md:text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Ingrese el nombre de la póliza"
                    required
                    @input="checkChanges"
                  />
                </div>

                <!-- Archivo -->
                <div>
                  <label class="text-xs md:text-sm font-medium text-text flex items-center gap-2 mb-1.5">
                    <Upload class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Archivo de la Póliza
                    <span class="text-xs text-red-500">(Solo PDF)</span>
                  </label>
                  <p class="text-xs text-text/60 mb-2">Seleccione nuevo archivo solamente si desea reemplazarlo</p>
                  <input
                    id="policy-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border bg-background text-text text-xs md:text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    @change="validateFile"
                  />
                  <p v-if="fileError" class="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
                    <AlertCircle class="w-3 h-3 md:w-4 md:h-4" />
                    {{ fileError }}
                  </p>
                </div>

                <!-- Descripción -->
                <div>
                  <label class="text-xs md:text-sm font-medium text-text flex items-center gap-2 mb-1.5">
                    <AlignLeft class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    v-model="editedPolicy!.descripcion"
                    class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border bg-background text-text text-xs md:text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px]"
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
        <div class="sticky bottom-0 left-0 right-0 bg-background/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-container-border dark:border-gray-700 p-5">
          <div v-if="!editMode" class="flex justify-end gap-3">
            <button
              class="inline-flex items-center justify-center rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors h-9 hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              @click="handleDelete" :disabled="loading"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Eliminar
            </button>
            <button
              class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors h-9 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              @click="handleEdit"
            >
              <Edit2 class="w-4 h-4 mr-2" />
              Editar
            </button>
          </div>
          <div v-else class="flex justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors h-9 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              @click="cancelEdit"
            >
              <X class="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!hasChanges || loading"
              class="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors h-9 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Save v-if="!loading" class="w-4 h-4 mr-2" />
              <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmación de eliminación -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1200] p-4"
        @click="cancelDelete"
      >
        <div
          class="w-full max-w-[400px] bg-background dark:bg-gray-900 rounded-2xl border border-container-border dark:border-gray-700 shadow-lg p-5"
          @click.stop
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-xl font-semibold text-text m-0">¿Eliminar póliza?</h3>
          </div>
          <p class="text-sm text-text/70 mb-5">Esta acción no se puede deshacer.</p>
          <div class="flex gap-3 sm:flex-col-reverse">
            <button
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-input-border bg-gray-50 text-gray-700 transition-all duration-300 hover:border-gray-400 hover:-translate-y-0.5"
              @click="cancelDelete"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="confirmDelete"
              :disabled="loading"
            >
              <Trash2 v-if="!loading" class="w-4 h-4 mr-2" />
              <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmación para cerrar con cambios sin guardar -->
      <div
        v-if="showCloseConfirm"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1200] p-4"
        @click="showCloseConfirm = false"
      >
        <div
          class="w-full max-w-[400px] bg-background dark:bg-gray-900 rounded-2xl border border-container-border dark:border-gray-700 shadow-lg p-5"
          @click.stop
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertCircle class="w-5 h-5 text-amber-500" />
            </div>
            <h3 class="text-xl font-semibold text-text m-0">Confirmar Salida</h3>
          </div>
          <p class="text-sm text-text/70 mb-5">
            Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2.5 rounded-xl text-sm font-medium border border-input-border bg-gray-50 text-gray-700 transition-all duration-300 hover:border-gray-400 hover:-translate-y-0.5"
              @click="showCloseConfirm = false"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-500 text-white border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="confirmClose"
            >
              Salir sin Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { X, Building2, Edit2, Trash2, FileText, Type, Upload, AlignLeft, AlertCircle, Save } from 'lucide-vue-next';
  import { usePolizas } from '@/composables/usePolizas';
  import { useAseguradoras } from '@/composables/useAseguradoras';
  import { useToast } from 'vue-toastification';
  import type { Aseguradora } from '@/modules/admin/interfaces/aseguradora_interface';

  // Definiciones de tipos
  interface Poliza {
    id_poliza: string;
    id_correduria: string;
    nombre: string;
    descripcion: string;
    archivo_poliza: string;
    fecha_poliza: string;
    fecha_creado: string;
    creado_por: string;
    fecha_modificado?: string | null;
    modificado_por?: string | null;
    id_aseguradora: string;
  }

  interface PolizaWithAseguradora extends Poliza {
    nombre_aseguradora: string;
  }

  const props = defineProps<{
    show: boolean;
    policy: PolizaWithAseguradora;
    idPoliza: string;
  }>();

  // Definición de eventos con tipos
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'edit'): void;
    (e: 'delete'): void;
    (e: 'error', message: string): void;
  }>();

  // Referencias y estados
  const editMode = ref(false);
  const showDeleteConfirm = ref(false);
  const showCloseConfirm = ref(false);
  const hasChanges = ref(false);
  const insurers = ref<Aseguradora[]>([]);
  const fileError = ref('');
  const editedPolicy = ref<PolizaWithAseguradora | null>(null);
  const originalPolicy = ref<PolizaWithAseguradora>({} as PolizaWithAseguradora);
  const archivoPoliza = ref<File | null>(null);

  // Composables
  const { getPoliza, updatePoliza, deletePoliza, loading } = usePolizas();
  const { getAseguradoras } = useAseguradoras();
  const toast = useToast();

  // Función para obtener URL del archivo de póliza
  const getPolicyFileUrl = (filePath: string) => {
    if (!filePath) return '#';
    
    // URL base de supabase
    const supabaseUrl = 'https://llecyyxwlicgmwmyrmtb.supabase.co';
    
    // Construir URL pública
    return `${supabaseUrl}/storage/v1/object/public/polizas/${filePath}`;
  };

  // Validar archivo
  const validateFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    fileError.value = '';

    if (files && files.length > 0) {
      const file = files[0];
      
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        fileError.value = 'Solo se permiten archivos PDF';
        target.value = '';
        return;
      }

      // Validar tamaño máximo
      if (file.size > 5 * 1024 * 1024) { // 5MB
        fileError.value = 'El archivo no debe superar los 5MB';
        target.value = '';
        return;
      }

      archivoPoliza.value = file;
      hasChanges.value = true;
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

    hasChanges.value = original !== current || archivoPoliza.value !== null;
  };

  const handleEdit = () => {
    editMode.value = true;
    
    editedPolicy.value = {
      ...JSON.parse(JSON.stringify(props.policy))
    };
    hasChanges.value = false;
    emit('edit');
  };

  const cancelEdit = () => {
    if (hasChanges.value) {
      showCloseConfirm.value = true;
    } else {
      editMode.value = false;
    }
  };

  //Actualizar Póliza
  const handleSave = async () => {
    // Validaciones
    if (!editedPolicy.value?.id_aseguradora) {
      toast.error('Selecciona una aseguradora');
      return;
    }

    if (!editedPolicy.value?.nombre) {
      toast.error('Ingresa un nombre para la póliza');
      return;
    }

    if (!editedPolicy.value) {
      toast.error('Error interno: datos de póliza no disponibles.');
      return;
    }

    // Preparamos los datos para actualizar
    const updateData = {
      id_aseguradora: editedPolicy.value.id_aseguradora,
      nombre: editedPolicy.value.nombre,
      descripcion: editedPolicy.value.descripcion || '',
      // Añade otros campos que permitas editar aquí
    };

    // TODO: Implementar lógica de subida de archivo si archivoPoliza.value existe
    if (archivoPoliza.value) {
      toast.warning('La subida de nuevo archivo aún no está implementada.');
      // Aquí iría la llamada a una función que suba el archivo y obtenga la nueva ruta
      // Luego, añadirías `archivo_poliza: nuevaRuta` a `updateData`
    }

    const result = await updatePoliza(props.idPoliza, updateData);

    if (result.ok) {
      toast.success(result.message);
      originalPolicy.value = { ...editedPolicy.value, ...result.data }; // Actualizar original con datos guardados
      editMode.value = false;
      hasChanges.value = false;
      archivoPoliza.value = null;
      emit('edit'); // O quizás un evento 'updated'
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = () => {
    showDeleteConfirm.value = true;
  };

  const confirmDelete = async () => { 
    if (props.idPoliza) {
      const result = await deletePoliza(props.idPoliza); 
      if (result.ok) {
        toast.success(result.message);
        emit('delete'); 
        showDeleteConfirm.value = false;
        handleClose(); 
      } else {
        toast.error(result.message);
      }
    }
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
    archivoPoliza.value = null;
    emit('close');
  };

  // Watch para cargar los datos cuando cambia el id_poliza
  watch(
    () => props.idPoliza,
    async (id) => {
      if (id) {
        const result = await getPoliza(id); 

        if (result.ok && result.data) {
          originalPolicy.value = result.data as PolizaWithAseguradora;
          editedPolicy.value = JSON.parse(JSON.stringify(originalPolicy.value));
        } else {
          console.error('Error fetching policy:', result.message);
          toast.error(`Error al cargar la póliza: ${result.message}`);
          emit('error', `Error al cargar la póliza: ${result.message}`);
        }
      }
    },
    { immediate: true } 
  );

  // Cargar aseguradoras al montar
  onMounted(async () => {
    try {
      const { data } = await getAseguradoras();
      if (data) {
        insurers.value = data;
      }
    } catch (error) {
      console.error('Error al cargar aseguradoras:', error);
      toast.error('Error al cargar las aseguradoras');
    }
  });
</script>
