<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center z-[1100]"
        @click="handleClose"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-8 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-8 opacity-0"
        >
          <div
            v-if="show"
            class="w-full h-[90vh] md:h-auto md:max-h-[90vh] md:w-[90%] lg:w-[700px] overflow-y-auto bg-background rounded-t-[2rem] md:rounded-[2rem] border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors duration-200"
            @click.stop
          >
        <!-- Encabezado -->
        <div class="sticky top-0 z-10 p-5 border-b border-container-border bg-background/80 backdrop-blur-xl">
          <div class="flex items-center justify-between gap-3 md:gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-text dark:text-white m-0">Nueva Póliza</h2>
                <p class="text-sm text-text/60 dark:text-gray-400 mt-0.5 m-0">Complete los detalles de la nueva póliza</p>
              </div>
            </div>
            <button
              class="p-2.5 rounded-xl border-none bg-input-bg dark:bg-gray-800 text-text dark:text-white cursor-pointer transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center"
              @click="handleClose"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="p-5">
          <form 
            class="flex flex-col gap-4"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <!-- Aseguradora -->
            <div class="bg-input-bg/50 border border-input-border rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <Building2 class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text dark:text-white m-0">Aseguradora</h3>
                  <p class="text-xs text-text/60 dark:text-gray-400 m-0">Seleccione la aseguradora para esta póliza</p>
                </div>
              </div>

              <!-- Estado de carga y select -->
              <TransitionGroup
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div 
                  v-if="loading" 
                  key="loading"
                  class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-background dark:bg-gray-800 border border-input-border dark:border-gray-700"
                >
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <span class="text-xs md:text-sm text-text/70">Cargando aseguradoras...</span>
                </div>

                <!-- Select de aseguradoras -->
                <select
                  v-else
                  id="insurer"
                  key="select"
                  v-model="selectedInsurer"
                  class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-xs md:text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem] disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:bg-gray-700/50"
                  :disabled="loading || insurers.length === 0"
                  required
                >
                  <option value="" disabled selected class="bg-background dark:bg-gray-800">{{ insurers.length === 0 ? 'No hay aseguradoras disponibles' : 'Seleccione una aseguradora' }}</option>
                  <option
                    v-for="insurer in insurers"
                    :key="insurer.id_aseguradora"
                    :value="insurer.id_aseguradora"
                    class="bg-background dark:bg-gray-800"
                  >
                    {{ insurer.nombre }}
                  </option>
                </select>
              </TransitionGroup>

              <!-- Mensaje cuando no hay aseguradoras -->
              <div v-if="!loading && insurers.length === 0" class="mt-2">
                <p class="flex items-center gap-2 text-xs text-text/60 group relative">
                  <AlertTriangle class="w-3 h-3 md:w-4 md:h-4 text-yellow-600 dark:text-yellow-500" />
                  No hay aseguradoras disponibles
                  <span class="ml-1 cursor-help">
                    <AlertCircle class="w-3 h-3 md:w-4 md:h-4 text-text/60" />
                    <!-- Tooltip -->
                    <span class="absolute left-0 bottom-full mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      Debe haber una aseguradora para poder crear una póliza
                    </span>
                  </span>
                </p>
              </div>
            </div>

            <!-- Detalles -->
            <div class="bg-input-bg/50 dark:bg-gray-800/50 border border-input-border dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg dark:hover:bg-gray-800/80">
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <FileText class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text dark:text-white m-0">Detalles de la Póliza</h3>
                  <p class="text-xs text-text/60 dark:text-gray-400 m-0">Ingrese la información básica de la póliza</p>
                </div>
              </div>

              <div class="space-y-3">
                <!-- Nombre -->
                <div>
                  <label for="name" class="text-xs md:text-sm font-medium text-text dark:text-white flex items-center gap-2 mb-1.5">
                    <Type class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Nombre de la Póliza
                  </label>
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-xs md:text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 dark:placeholder-gray-500"
                    placeholder="Ingrese el nombre de la póliza"
                    required
                  />
                </div>

                <!-- Archivo -->
                <div>
                  <label class="text-xs md:text-sm font-medium text-text dark:text-white flex items-center gap-2 mb-1.5">
                    <Upload class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Archivo de la Póliza
                    <span class="text-[10px] md:text-xs font-normal text-primary/70">(PDF o Word, máx. 10MB)</span>
                  </label>
                  <div
                    class="relative border-2 border-dashed border-input-border rounded-xl p-3 md:p-4 transition-all duration-300 hover:border-primary"
                    :class="{ 'border-primary bg-primary/5': isDragging }"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                      @change="validateFile"
                    />
                    <div class="flex flex-col items-center justify-center text-center">
                      <Upload class="w-6 h-6 md:w-8 md:h-8 text-primary mb-2" />
                      <p class="text-xs md:text-sm text-text dark:text-white m-0">
                        {{ selectedFileName || 'Arrastra y suelta aquí o haz clic para seleccionar' }}
                      </p>
                      <p class="text-[10px] md:text-xs text-text/60 dark:text-gray-400 mt-1">PDF o Word (.doc, .docx) hasta 10MB</p>
                    </div>
                  </div>
                  <!-- Error de archivo -->
                  <p v-if="fileError" class="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-red-500 mt-1.5">
                    <AlertCircle class="w-3 h-3 md:w-4 md:h-4" />
                    {{ fileError }}
                  </p>
                  
                  <!-- Barra de progreso para la subida -->
                  <div v-if="isUploading || uploadProgress > 0" class="mt-2">
                    <p class="text-xs text-primary mb-1">{{ uploadStatus || 'Subiendo archivo...' }}</p>
                    <div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-primary transition-all duration-300 ease-out" 
                        :style="{ width: `${uploadProgress}%` }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Descripción -->
                <div>
                  <label for="description" class="text-xs md:text-sm font-medium text-text dark:text-white flex items-center gap-2 mb-1.5">
                    <AlignLeft class="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    v-model="description"
                    class="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-xl border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-xs md:text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 dark:placeholder-gray-500 resize-y min-h-[80px] md:min-h-[100px]"
                    placeholder="Ingrese una descripción detallada de la póliza"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="sticky bottom-0 left-0 right-0 bg-background/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-container-border dark:border-gray-700 p-5">
              <div class="flex items-center justify-end gap-3">
                <div class="flex-grow"> <!-- Takes up remaining space -->
                  <div v-if="formErrors.length > 0" class="flex items-center gap-2">
                    <AlertTriangle 
                      class="w-5 h-5 text-red-500" 
                    />
                    <span 
                      class="text-sm text-red-500"
                    >
                      Por favor, corrija los errores antes de continuar
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  class="flex-1 md:flex-none px-6 py-3.5 rounded-xl text-sm font-medium bg-input-bg border border-input-border text-text transition-all duration-300 hover:border-primary hover:text-primary flex items-center justify-center gap-2 min-w-[120px]"
                  @click="handleClose"
                >
                  <X class="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none group relative"
                  :disabled="loading || insurers.length === 0"
                  :title="insurers.length === 0 ? 'Primero debe crear una aseguradora' : ''"
                >
                  <Save v-if="!loading" class="w-4 h-4 md:w-5 md:h-5" />
                  <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{{ loading ? 'Guardando...' : 'Guardar Póliza' }}</span>
                  
                  <!-- Tooltip -->
                  <div
                    v-if="insurers.length === 0"
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
                  >
                    Primero debe crear una aseguradora
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { X, Building2, Shield, Type, Upload, FileText, Save, AlertTriangle, AlertCircle, AlignLeft } from 'lucide-vue-next';
  import { useToast } from 'vue-toastification';
  import { useAseguradoras } from '@/composables/useAseguradoras';
  import { usePolizas } from '@/composables/usePolizas';
  import { supabase } from '@/lib/supabase';
  import { useAuthStore } from '@/stores/auth.store';
  import { storeToRefs } from 'pinia';

  import type { Database } from '@/lib/supabase';

  type Aseguradora = Database['public']['Tables']['aseguradoras']['Row'];
  type Poliza = Database['public']['Tables']['polizas']['Row'];
  type InsertPoliza = Database['public']['Tables']['polizas']['Insert'];

  interface FormError {
    field: string;
    message: string;
  }

  const { show } = defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'created', poliza: Poliza): void
    (e: 'save', formData: FormData): void
  }>();

  // Composables
  const { getAseguradoras } = useAseguradoras();
  const { createPoliza } = usePolizas();
  const toast = useToast();
  const authStore = useAuthStore();
  const { id_correduria } = storeToRefs(authStore);

  // Referencias y estados
  const fileInput = ref<HTMLInputElement | null>(null);
  const isDragging = ref(false);
  const selectedFileName = ref('');
  const insurers = ref<Aseguradora[]>([]);
  const loading = ref(false);
  const name = ref('');
  const fecha_poliza = ref(new Date());
  const selectedFile = ref<File | null>(null);
  const selectedInsurer = ref<number | ''>('');
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const uploadStatus = ref('');
  const description = ref('');
  const fileError = ref<string | null>(null);
  const formErrors = ref<FormError[]>([]);

  const validateForm = () => {
    formErrors.value = [];
    
    if (!selectedInsurer.value) {
      formErrors.value.push({
        field: 'aseguradora',
        message: 'Seleccione una aseguradora'
      });
    }

    if (!name.value) {
      formErrors.value.push({
        field: 'nombre',
        message: 'El nombre de la póliza es requerido'
      });
    }

    if (!fecha_poliza.value) {
      formErrors.value.push({
        field: 'fecha_poliza',
        message: 'La fecha de la póliza es requerida'
      });
    }

    if (!selectedFile.value && !selectedFileName.value) {
      formErrors.value.push({
        field: 'archivo_poliza',
        message: 'El archivo de la póliza es requerido'
      });
    }

    return formErrors.value.length === 0;
  };

  // Manejar el drop de archivos
  const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      validateFile(file); // Reutilizamos la lógica de validación
    } else {
      fileError.value = 'Error al procesar el archivo soltado.';
      selectedFile.value = null;
      selectedFileName.value = '';
    }
  };

  /**
   * Valida el archivo seleccionado por el usuario
   * Verifica:
   * 1. Que el tipo de archivo sea permitido (PDF o Word)
   * 2. Que el tamaño no exceda el límite (10MB)
   */
  const validateFile = (fileOrEvent: File | Event) => {
    let file: File | null = null;

    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else {
      // Es un evento del input file
      const target = fileOrEvent.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        file = target.files[0];
      }
    }

    if (!file) {
      fileError.value = 'No se seleccionó ningún archivo.';
      selectedFile.value = null;
      selectedFileName.value = '';
      // Resetear el input si es necesario
      if (fileInput.value) fileInput.value.value = '';
      return;
    }

    // Resetear error y nombre previo
    fileError.value = null;
    selectedFileName.value = '';
    selectedFile.value = null;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedTypes.includes(file.type)) {
      fileError.value = 'Tipo de archivo no permitido. Solo se aceptan PDF y Word (.doc, .docx).';
      if (fileInput.value) fileInput.value.value = ''; // Limpiar el input
      return;
    }

    if (file.size > maxSize) {
      fileError.value = `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo es 10 MB.`;
      if (fileInput.value) fileInput.value.value = ''; // Limpiar el input
      return;
    }

    // Si todo está bien
    selectedFile.value = file;
    selectedFileName.value = file.name;

    // Aquí puedes agregar lógica adicional si es necesario,
    // como mostrar una vista previa o preparar la subida.
    console.log('Archivo validado:', file.name, file.size);
    // Resetear el estado de subida si se cambia el archivo
    isUploading.value = false;
    uploadProgress.value = 0;
    uploadStatus.value = '';
  };


  
  // Guardar póliza
  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const user_id = authStore.user?.id;
      
      if (!user_id) {
        toast.error('Error: No se pudo obtener la información necesaria. Por favor, inicie sesión nuevamente.');
        return;
      }
      


      loading.value = true;

      try {
        
        // 2. Subir el archivo con mejor organización
        if (!selectedFile.value) {
          // Este error debería ser capturado por validateForm, pero lo dejamos como una salvaguarda.
          formErrors.value.push({ field: 'file', message: 'No se ha seleccionado ningún archivo.' });
          toast.error('Error: No se ha seleccionado ningún archivo.');
          loading.value = false;
          return; // Detener la ejecución si no hay archivo
        }

        const fileExt = selectedFile.value.name.split('.').pop();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        
        // Crear nombre de archivo con timestamp y UUID para evitar colisiones
        const timestamp = currentDate.getTime();
        const uniqueId = crypto.randomUUID();
        const fileName = `${timestamp}_${uniqueId}.${fileExt}`;
        
        // Estructura organizada de carpetas:
        // 1. polizas/templates/ - Para plantillas generales
        // 2. polizas/clientes/{id_cliente}/ - Para pólizas asignadas a clientes específicos
        // 3. polizas/corredurias/{id_correduria}/ - Para pólizas a nivel de correduría
        
        // Por defecto, usamos la estructura de corredurías ya que estamos creando una póliza general
        const filePath = `corredurias/${id_correduria.value}/${year}/${month}/${fileName}`;
        
        console.log('Intentando subir archivo a:', filePath, {
          fileName: selectedFile.value.name,
          fileType: selectedFile.value.type,
          fileExt,
        });
        
        /**
         * Subir archivo al bucket 'polizas' en Supabase Storage
         * Implementa:
         * 1. Barra de progreso para seguimiento visual
         * 2. Manejo de errores detallado
         * 3. Estructura organizada de carpetas
         */
        isUploading.value = true;
        uploadStatus.value = 'Preparando archivo...';
        uploadProgress.value = 5;
        
        try {
          // Crear un objeto FormData para monitorear el progreso
          const xhr = new XMLHttpRequest();
          
          // Configurar eventos para monitorear el progreso
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              // Calcular y actualizar el progreso (0-100)
              const progress = Math.round((event.loaded / event.total) * 90) + 5; // 5-95%
              uploadProgress.value = progress;
              uploadStatus.value = `Subiendo archivo: ${progress}%`;
              console.log(`Progreso de subida: ${progress}%`);
            }
          });
          
          // Usar el método upload del SDK de Supabase con opciones
          uploadStatus.value = 'Iniciando subida...';
          
          // Determinar el tipo de contenido basado en la extensión
          const fileExtLower = fileExt?.toLowerCase() || '';
          let contentType;
          
          switch(fileExtLower) {
            case 'pdf':
              contentType = 'application/pdf';
              break;
            case 'doc':
              contentType = 'application/msword';
              break;
            case 'docx':
              contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              break;
            default:
              contentType = selectedFile.value.type || 'application/octet-stream';
          }
          
          console.log('Intentando subir archivo a:', filePath, {
            fileName: selectedFile.value.name,
            fileType: selectedFile.value.type,
            contentType,
          });
          
          // Subir el archivo usando el SDK oficial de Supabase
          const { data, error } = await supabase.storage
            .from('polizas')
            .upload(filePath, selectedFile.value, {
              cacheControl: '3600',
              contentType,
              upsert: true // Sobrescribir si existe
            });
          
          if (error) {
            console.error('Error al subir el archivo:', error);
            
            // Si falla, intentar con un método alternativo (convertir a Blob)
            uploadStatus.value = 'Reintentando con método alternativo...';
            
            const fileContent = await selectedFile.value.arrayBuffer();
            const fileBlob = new Blob([fileContent], { type: contentType });
            
            const secondAttempt = await supabase.storage
              .from('polizas')
              .upload(filePath, fileBlob, {
                cacheControl: '3600',
                contentType,
                upsert: true
              });
              
            if (secondAttempt.error) {
              console.error('Error en el segundo intento:', secondAttempt.error);
              throw secondAttempt.error;
            }
            
            console.log('Archivo subido con método alternativo:', secondAttempt.data);
          } else {
            console.log('Archivo subido exitosamente:', data);
          }
          
          // Actualizar progreso a 100%
          uploadProgress.value = 100;
          uploadStatus.value = 'Archivo subido correctamente';

          // Obtener la URL pública del archivo
          const { data: { publicUrl } } = supabase.storage
            .from('polizas')
            .getPublicUrl(filePath);
          
          // 4. Crear la póliza con la URL del archivo
          // Crear objeto base con propiedades conocidas
          const newPolizaBase = {
            nombre: name.value.trim(),
            descripcion: description.value.trim(),
            archivo_poliza: publicUrl, // Usar la URL pública del archivo
            fecha_poliza: currentDate.toISOString(), // Usar timestamp actual
            fecha_creado: currentDate.toISOString(),
            creado_por: user_id,
            id_correduria: id_correduria.value,
          };

          // Añadir id_aseguradora con aserción de tipo
          const newPoliza = {
            ...newPolizaBase,
            id_aseguradora: selectedInsurer.value
          } as InsertPoliza;

          const { ok, message, data: polizaData } = await createPoliza(newPoliza);

          if (!ok || !polizaData) {
            // Si falla la creación de la póliza, eliminar el archivo subido
            await supabase.storage
              .from('polizas')
              .remove([filePath]);
              
            throw new Error(message);
          }

          toast.success('Póliza creada correctamente');
          emit('created', polizaData);
          resetForm();
          
        } catch (uploadError) {
          console.error('Error en la subida:', uploadError);
          uploadStatus.value = 'Error en la subida';
          uploadProgress.value = 0;
          throw new Error(`No se pudo subir el archivo: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
        } finally {
          // Restaurar estado después de completar (exitosamente o con error)
          setTimeout(() => {
            isUploading.value = false;
          }, 1000);
        }
      } catch (error) {
        console.error('Error al guardar la póliza:', error);
        
        // Manejo específico para errores de tipo MIME
        if (error instanceof Error && error.message.includes('mime type')) {
          console.error('Error detallado de tipo MIME:', error);
          console.error('Información del archivo:', {
            nombre: selectedFile.value?.name,
            tipo: selectedFile.value?.type,
            tamaño: selectedFile.value?.size
          });
          toast.error('Error de tipo de archivo: El tipo de archivo no es compatible con el bucket. Por favor, asegúrate de que sea un PDF o Word válido.');
        } else if (error instanceof Error && error.message.includes('storage/object_too_large')) {
          toast.error('El archivo es demasiado grande. El tamaño máximo permitido es de 10MB.');
        } else {
          console.error('Error completo:', error);
          toast.error('Error al guardar la póliza: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
      } finally {
        loading.value = false;
      }
    } catch (error) {
      toast.error('Error al validar el formulario');
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    selectedInsurer.value = '';
    name.value = '';
    description.value = '';
    selectedFile.value = null;
    selectedFileName.value = '';
    fileError.value = '';
    if (fileInput.value) fileInput.value.value = '';
    
    emit('close');
  };

  const handleClose = () => {
    resetForm();
    emit('close');
  };

  // Cargar aseguradoras
  onMounted(async () => {
    try {
      loading.value = true;
      const { data, ok, message } = await getAseguradoras();
      
      if (!ok || !data) {
        throw new Error(message || 'Error al cargar las aseguradoras');
      }
      
      insurers.value = data;
    } catch (error) {
      console.error('Error al cargar aseguradoras:', error);
      toast.error('Error al cargar las aseguradoras');
    } finally {
      loading.value = false;
    }
  });
</script>
