<template>
  <Teleport to="body">
    <!-- Overlay del modal -->
    <div
      v-if="show && editedClient"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full h-[90vh] md:h-auto md:max-h-[90vh] md:w-[90%] lg:w-[700px] overflow-y-auto bg-background rounded-t-[2rem] md:rounded-[2rem] border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors duration-200"
        @click.stop
      >
        <!-- Encabezado -->
        <div
          class="sticky top-0 z-10 p-5 border-b border-container-border bg-background/80 backdrop-blur-xl"
        >
          <div class="flex items-center justify-between gap-3 md:gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-text dark:text-white m-0">
                  Información del Cliente
                </h2>
                <p class="text-sm text-text/60 dark:text-gray-400 mt-0.5 m-0">
                  Información detallada del cliente
                </p>
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
          <div class="flex flex-col gap-4">
            <!-- Información Personal -->
            <div
              class="bg-input-bg/50 dark:bg-gray-800/50 border border-input-border dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg dark:hover:bg-gray-800/80"
            >
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <User class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text dark:text-white m-0">
                    Información Personal
                  </h3>
                  <p class="text-xs text-text/60 dark:text-gray-400 m-0">
                    Datos básicos del cliente
                  </p>
                </div>
              </div>

              <!-- Avatar con iniciales -->
              <div class="flex items-start mb-4">
                <div
                  v-if="editedClient"
                  class="w-20 h-20 rounded-lg flex items-center justify-center bg-[#8CBFCF] text-white font-bold text-2xl shadow-md"
                  :title="editedClient.nombres"
                >
                  {{ getInitials(editedClient.nombres) }}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nombres -->
                <div class="flex items-start gap-3">
                  <Type class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Nombres</label
                    >
                    <template v-if="isEditing">
                      <input
                        type="text"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Nombres"
                        :value="nameParts.firstName"
                        @input="
                          (e) => updateName('firstName', (e.target as HTMLInputElement).value)
                        "
                        @keypress="onlyLetters"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ nameParts.firstName }}
                      </p>
                    </template>
                  </div>
                </div>

                <!-- Apellidos -->
                <div class="flex items-start gap-3">
                  <Type class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Apellidos</label
                    >
                    <template v-if="isEditing">
                      <input
                        type="text"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Apellidos"
                        :value="nameParts.lastName"
                        @input="(e) => updateName('lastName', (e.target as HTMLInputElement).value)"
                        @keypress="onlyLetters"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ nameParts.lastName }}
                      </p>
                    </template>
                  </div>
                </div>

                <!-- Identificación -->
                <div class="flex items-start gap-3">
                  <CreditCard class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Identificación</label
                    >
                    <template v-if="isEditing">
                      <input
                        v-model="editedClient.identificacion"
                        type="text"
                        maxlength="14"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        @keypress="onlyNumbers"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.identificacion }}
                      </p>
                    </template>
                  </div>
                </div>

                <!-- Fecha de Nacimiento -->
                <div class="flex items-start gap-3">
                  <Calendar class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Fecha de Nacimiento</label
                    >
                    <template v-if="isEditing">
                      <input
                        :value="editedClient.dob"
                        type="date"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        @input="handleDateInput"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.dob || 'No especificada' }}
                      </p>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de Contacto -->
            <div
              class="bg-input-bg/50 dark:bg-gray-800/50 border border-input-border dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:bg-input-bg dark:hover:bg-gray-800/80"
            >
              <div class="flex items-center gap-2 md:gap-3 mb-3">
                <Mail class="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <h3 class="text-sm md:text-base font-medium text-text dark:text-white m-0">
                    Información de Contacto
                  </h3>
                  <p class="text-xs text-text/60 dark:text-gray-400 m-0">
                    Datos de contacto del cliente
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Correo -->
                <div class="flex items-start gap-3">
                  <Mail class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Correo Electrónico</label
                    >
                    <template v-if="isEditing">
                      <input
                        v-model="editedClient.correo"
                        type="email"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.correo }}
                      </p>
                    </template>
                  </div>
                </div>

                <!-- Empresa -->
                <div class="flex items-start gap-3">
                  <Building2 class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Empresa</label
                    >
                    <template v-if="isEditing">
                      <input
                        v-model="editedClient.empresa"
                        type="text"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.empresa || 'N/A' }}
                      </p>
                    </template>
                  </div>
                </div>

                <!-- Teléfonos -->
                <div class="flex items-start gap-3">
                  <Phone class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Teléfono Principal</label
                    >
                    <template v-if="isEditing">
                      <input
                        v-model="editedClient.tel_1"
                        type="tel"
                        maxlength="8"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        @keypress="onlyNumbers"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.tel_1 }}
                      </p>
                    </template>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <Phone class="w-5 h-5 text-primary/70" />
                  <div class="flex-1 min-w-0">
                    <label class="block text-xs font-medium text-text/70 dark:text-gray-400 mb-1"
                      >Teléfono Alternativo</label
                    >
                    <template v-if="isEditing">
                      <input
                        v-model="editedClient.tel_2"
                        type="tel"
                        maxlength="8"
                        class="w-full px-3 py-1.5 rounded-lg border border-input-border dark:border-gray-700 bg-background dark:bg-gray-800/50 text-text dark:text-white text-sm transition-all duration-300 hover:border-primary dark:hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        @keypress="onlyNumbers"
                      />
                    </template>
                    <template v-else>
                      <p class="text-sm text-text dark:text-white break-words">
                        {{ editedClient.tel_2 || 'N/A' }}
                      </p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div
          class="sticky bottom-0 left-0 right-0 bg-background/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-container-border dark:border-gray-700 p-5"
        >
          <div class="flex justify-end gap-3">
            <!-- Botón de eliminar -->
            <button
              class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="confirmDelete"
            >
              <Trash2 class="w-5 h-5" />
              Eliminar Cliente
            </button>

            <!-- Botón de editar/guardar -->
            <button
              v-if="!isEditing"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
              @click="isEditing = true"
            >
              <Pencil class="w-5 h-5" />
              Editar
            </button>
            <button
              v-else
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
              @click="handleSave"
            >
              <Save class="w-5 h-5" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal de confirmación para cerrar -->
  <Teleport to="body">
    <div
      v-if="showCloseConfirm"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
      @click="showCloseConfirm = false"
    >
      <div
        class="w-full max-w-[400px] bg-background rounded-3xl border border-container-border shadow-lg p-6"
        @click.stop
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 rounded-xl bg-amber-100">
            <AlertTriangle class="w-6 h-6 text-amber-500" />
          </div>
          <h3 class="text-xl font-semibold text-text">Confirmar Salida</h3>
        </div>

        <p class="text-text/70 mb-6">
          Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
        </p>

        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
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
  </Teleport>

  <!-- Modal de confirmación para eliminar -->
  <template v-if="editedClient">
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
        @click="cancelDelete"
      >
        <div
          class="w-full max-w-[400px] bg-background rounded-3xl border border-container-border shadow-lg p-6"
          @click.stop
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 rounded-xl bg-red-100">
              <AlertTriangle class="w-6 h-6 text-red-500" />
            </div>
            <h3 class="text-xl font-semibold text-text">Confirmar Eliminación</h3>
          </div>

          <p class="text-text/70 mb-6">
            ¿Está seguro que desea eliminar al cliente
            <span class="font-medium text-text">{{ editedClient.nombres }}</span
            >? Esta acción no se puede deshacer.
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
              @click="cancelDelete"
            >
              Cancelar
            </button>
            <button
              class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="handleDelete"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Building2,
    Pencil,
    Trash2,
    AlertTriangle,
    Save,
    Type,
  } from 'lucide-vue-next';
  import { useToast } from 'vue-toastification';
  import { useClientes } from '@/composables/useClientes';
  import type { Database } from '@/lib/supabase';
  import { useAuthStore } from '@/stores/auth.store';

  // Definir interfaz para el cliente editable
  interface EditableClient extends Omit<Database['public']['Tables']['clientes']['Row'], 'dob'> {
    dob: string | Date | null;
  }

  const props = defineProps<{
    show: boolean;
    client: Database['public']['Tables']['clientes']['Row'] | null;
    usuarios?: {
      id_usuario: string;
      nombre: string;
      correo: string;
      auth_user_id?: string;
      fecha_creado?: string;
    }[];
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'refresh'): void;
    (e: 'updateClient', client: Database['public']['Tables']['clientes']['Row']): void;
    (e: 'deleteClient', id: string): void;
  }>();

  const toast = useToast();
  const { deleteCliente, updateCliente } = useClientes();
  const authStore = useAuthStore();
  const currentUser = authStore.user;

  // Estados
  const showDeleteConfirm = ref(false);
  const showCloseConfirm = ref(false);
  const isEditing = ref(false);
  const hasChanges = ref(false);
  const isLoading = ref(false);
  const editedClient = ref<EditableClient | null>(null);

  // Inicialización segura del cliente
  const initializeClient = async () => {
    try {
      if (props.client) {
        // Crear una copia profunda del cliente
        editedClient.value = JSON.parse(JSON.stringify(props.client));
      } else {
        editedClient.value = null;
      }
    } catch (error) {
      console.error('Error al inicializar cliente:', error);
      toast.error('Error al cargar los datos del cliente');
      editedClient.value = null;
    }
  };

  // Inicializar al montar el componente
  onMounted(async () => {
    try {
      await initializeClient();
      nextTick(() => {
        // Asegurar que todo está renderizado antes de añadir event listeners
        document.addEventListener('keydown', handleKeyDown);
      });
    } catch (error) {
      console.error('Error en onMounted:', error);
    }
  });

  onUnmounted(() => {
    try {
      document.removeEventListener('keydown', handleKeyDown);
    } catch (error) {
      console.error('Error al remover event listener:', error);
    }
  });

  // Watch para actualizar editedClient cuando cambia el cliente
  watch(
    () => props.client,
    async (newClient) => {
      try {
        if (newClient) {
          // Crear una copia profunda del cliente
          editedClient.value = JSON.parse(JSON.stringify(newClient));
          hasChanges.value = false;
        } else {
          editedClient.value = null;
        }
      } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        toast.error('Error al actualizar los datos del cliente');
        editedClient.value = null;
      }
    },
    { immediate: true },
  );

  // Watch para detectar cambios y actualizar hasChanges
  watch(
    () => editedClient.value,
    () => {
      if (isEditing.value && props.client && editedClient.value) {
        try {
          // Comparar para detectar cambios
          const originalJSON = JSON.stringify(props.client);
          const currentJSON = JSON.stringify(editedClient.value);
          hasChanges.value = originalJSON !== currentJSON;
        } catch (error) {
          console.error('Error al comparar cambios:', error);
        }
      }
    },
    { deep: true },
  );

  const handleClose = () => {
    if (isEditing.value && hasChanges.value) {
      showCloseConfirm.value = true;
    } else {
      confirmClose();
    }
  };

  const confirmClose = () => {
    isEditing.value = false;
    editedClient.value = props.client ? { ...props.client } : null;
    hasChanges.value = false;
    showCloseConfirm.value = false;
    emit('close');
  };

  const handleDelete = async () => {
    if (!editedClient.value?.id_cliente) {
      toast.error('No se puede eliminar: ID de cliente no válido');
      return;
    }

    try {
      console.log('Iniciando eliminación del cliente:', editedClient.value.id_cliente);
      isLoading.value = true;

      // Llamar a la función de eliminación
      const resultado = await deleteCliente(editedClient.value.id_cliente);

      console.log('Resultado de la eliminación:', resultado);

      if (resultado) {
        toast.success('Cliente eliminado exitosamente');

        // Emitir eventos al componente padre
        emit('deleteClient', editedClient.value.id_cliente);
        emit('refresh'); // Para refrescar la lista
        emit('close'); // Para cerrar el modal
      } else {
        throw new Error('No se pudo eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      let mensajeError = 'Error al eliminar el cliente';

      if (error instanceof Error) {
        mensajeError += ': ' + error.message;
      }

      toast.error(mensajeError);
    } finally {
      isLoading.value = false;
      showDeleteConfirm.value = false;
    }
  };

  const confirmDelete = () => {
    showDeleteConfirm.value = true;
  };

  const cancelDelete = () => {
    showDeleteConfirm.value = false;
  };

  // Separar el nombre en partes
  const nameParts = computed(() => {
    if (!editedClient.value?.nombres) {
      return { firstName: '', lastName: '' };
    }
    const parts = editedClient.value.nombres.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  });

  // Actualizar el nombre completo cuando cambian las partes
  const updateName = (part: 'firstName' | 'lastName', value: string) => {
    if (!editedClient.value) return;

    const parts = nameParts.value;
    if (part === 'firstName') {
      parts.firstName = value;
    } else {
      parts.lastName = value;
    }
    editedClient.value.nombres = `${parts.firstName} ${parts.lastName}`.trim();
    hasChanges.value = true;
  };

  // Manejador específico para cambios en el input de fecha
  const handleDateInput = (e: Event) => {
    if (!editedClient.value) return;
    const input = e.target as HTMLInputElement;
    editedClient.value.dob = input.value;
    hasChanges.value = true;
  };

  // Cerrar modal con la tecla Escape
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault(); // Prevenir comportamiento por defecto
      handleClose();
    }
  };

  // Funciones de validación
  const onlyLetters = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    const pattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s]$/;
    if (!pattern.test(char)) {
      e.preventDefault();
      toast.warning('Solo se permiten letras y espacios');
    }
  };

  const onlyNumbers = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    if (!/^[0-9]$/.test(char)) {
      e.preventDefault();
      toast.warning('Solo se permiten números');
    }
  };

  const handleSave = async () => {
    if (!editedClient.value) {
      toast.error('No hay datos del cliente para guardar');
      return;
    }

    try {
      // Validaciones
      if (!editedClient.value.nombres?.trim()) {
        toast.error('Por favor complete el nombre');
        return;
      }

      if (!editedClient.value.identificacion?.trim()) {
        toast.error('Por favor complete la identificación');
        return;
      }

      if (!editedClient.value.correo?.trim()) {
        toast.error('Por favor complete el correo electrónico');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedClient.value.correo)) {
        toast.error('Por favor ingrese un correo electrónico válido');
        return;
      }

      isLoading.value = true;

      // Verificar que existe id_cliente antes de enviar actualización
      if (!editedClient.value.id_cliente) {
        throw new Error('ID de cliente no válido');
      }

      console.log('Cliente antes de actualizar:', editedClient.value);

      // Crear un objeto simple con solo los campos que queremos actualizar
      const clienteParaActualizar = {
        identificacion: editedClient.value.identificacion,
        correo: editedClient.value.correo,
        nombres: editedClient.value.nombres,
        empresa: editedClient.value.empresa || null,
        tel_1: editedClient.value.tel_1 || null,
        tel_2: editedClient.value.tel_2 || null,
        dob: typeof editedClient.value.dob === 'string' ? new Date(editedClient.value.dob) : editedClient.value.dob,
        modificado_por: currentUser?.id || null,
      };

      console.log('Actualizando cliente...');
      console.log('ID:', editedClient.value.id_cliente);
      console.log('Datos a enviar:', JSON.stringify(clienteParaActualizar, null, 2));

      // Implementar actualización utilizando el composable
      const updatedClient = await updateCliente(
        editedClient.value.id_cliente,
        clienteParaActualizar,
      );

      // Procesar respuesta
      if (updatedClient) {
        console.log('Cliente actualizado correctamente:', JSON.stringify(updatedClient, null, 2));

        // Actualizar editedClient con los datos recibidos del servidor
        editedClient.value = { ...updatedClient };

        // Emitir el cliente actualizado directamente
        emit('updateClient', updatedClient);
        emit('refresh'); // Para asegurar que la lista de clientes se actualice

        toast.success('Cliente actualizado exitosamente');
        isEditing.value = false;
        hasChanges.value = false;
      } else {
        // Si no hay cliente actualizado pero no hubo error, mostrar un mensaje genérico
        console.warn('No se obtuvo respuesta con datos del cliente actualizado');
        toast.info('No se realizaron cambios en el cliente');
        isEditing.value = false;
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);

      // Mostrar mensaje de error específico si es posible
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      toast.error('Error al guardar los cambios: ' + errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return 'C';

    const names = name.trim().split(' ');
    if (names.length === 0) return 'C';

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
</script>
