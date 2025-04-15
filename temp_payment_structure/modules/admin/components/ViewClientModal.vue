<template>
  <Teleport to="body">
    <!-- Overlay del modal -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full max-w-[800px] max-h-[calc(100vh-3rem)] overflow-y-auto bg-background rounded-3xl border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-transform duration-300 sm:rounded-2xl"
        @click.stop
      >
        <!-- Encabezado del modal -->
        <div
          class="sticky top-0 z-10 px-6 py-4 border-b border-container-border flex items-center justify-between bg-background/80 backdrop-blur-xl"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-primary/10">
              <User class="w-5 h-5 text-primary" />
            </div>
            <div class="flex items-center gap-4">
              <h2 class="text-xl font-semibold text-text">Detalles del Cliente</h2>
              <button
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 bg-gray-100 text-primary text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5"
                @click="isEditing = !isEditing"
              >
                <Pencil class="w-4 h-4" />
                <span>{{ isEditing ? 'Cancelar' : 'Editar' }}</span>
              </button>
            </div>
          </div>
          <button
            class="p-2 rounded-lg hover:bg-input-bg text-text/70 transition-all duration-300 hover:text-text hover:-translate-y-0.5"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Cuerpo del modal -->
        <div class="p-6">
          <!-- Perfil del cliente -->
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <div class="flex-none">
              <div class="w-[120px] h-[120px] rounded-2xl shadow-lg">
                <img
                  :src="
                    (editedClient.foto as string) ??
                    `https://ui-avatars.com/api/?name=${editedClient.nombres}&background=8CBFCF&color=fff&size=120&bold=true&format=svg`
                  "
                  :alt="`${editedClient.nombres} ${editedClient.apellidos}`"
                  class="w-full h-full rounded-2xl object-cover ring-4 ring-background"
                />
              </div>
            </div>

            <!-- Información del cliente -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                  <!-- EN EDICIÓN -->
                  <template v-if="isEditing">
                    <div class="flex gap-2">
                      <input
                        type="text"
                        class="px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Nombres"
                        :value="nameParts.firstName"
                        @input="
                          (e) => updateName('firstName', (e.target as HTMLInputElement).value)
                        "
                        @keypress="onlyLetters"
                      />
                      <input
                        type="text"
                        class="px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Apellidos"
                        :value="nameParts.lastName"
                        @input="(e) => updateName('lastName', (e.target as HTMLInputElement).value)"
                        @keypress="onlyLetters"
                      />
                    </div>
                  </template>

                  <!-- EN VIEW -->
                  <template v-else>
                    <h3 class="text-xl font-semibold text-text">
                      {{ editedClient.nombres + ' ' + editedClient.apellidos }}
                    </h3>
                  </template>
                  <!-- <span
                    class="inline-flex px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300"
                    :class="
                      editedClient.estado === 'active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                    "
                  >
                    {{ editedClient.status === 'active' ? 'Activo' : 'Inactivo' }}
                  </span> TODO: tendrá estatus de AL DÍA | MOROSO | OTROS -->
                </div>
                <div
                  class="inline-flex items-center px-3 py-1.5 bg-input-bg border border-input-border rounded-lg font-mono text-sm text-text/90"
                >
                  {{
                    editedClient.identificacion.length === 14
                      ? `RTN: ${editedClient.identificacion}`
                      : `DNI: ${editedClient.identificacion}`
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Separador -->
          <div class="h-px bg-container-border my-6"></div>

          <!-- Grid de información -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- DNI -->
            <div
              class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <CreditCard class="w-5 h-5 text-primary/70" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">{{
                  editedClient.identificacion.length === 14 ? 'RTN' : 'DNI'
                }}</label>
                <template v-if="isEditing">
                  <input
                    v-model="editedClient.identificacion"
                    type="text"
                    maxlength="13"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    @keypress="onlyNumbers"
                  />
                </template>
                <template v-else>
                  <p class="text-sm text-text break-words font-mono">
                    {{ editedClient.identificacion }}
                  </p>
                </template>
              </div>
            </div>

            <!-- Email -->
            <div
              class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <Mail class="w-5 h-5 text-primary/70" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1"
                  >Correo Electrónico</label
                >
                <template v-if="isEditing">
                  <input
                    v-model="editedClient.correo"
                    type="email"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </template>
                <template v-else>
                  <p class="text-sm text-text break-words">{{ editedClient.correo }}</p>
                </template>
              </div>
            </div>

            <!-- Fecha de Nacimiento -->
            <div
              class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <Calendar class="w-5 h-5 text-primary/70" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1"
                  >Fecha de Nacimiento</label
                >
                <template v-if="isEditing">
                  <input
                    v-model="dobFormatted"
                    type="date"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    @change="validateBirthDate"
                  />
                </template>
                <template v-else>
                  <p class="text-sm text-text break-words">
                    {{ formatDate(editedClient.dob.toString()) }}
                  </p>
                </template>
              </div>
            </div>

            <!-- Empresa -->
            <div
              class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <Building2 class="w-5 h-5 text-primary/70" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Empresa</label>
                <template v-if="isEditing">
                  <input
                    v-model="editedClient.empresa"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </template>
                <template v-else>
                  <p class="text-sm text-text break-words">{{ editedClient.empresa || 'N/A' }}</p>
                </template>
              </div>
            </div>

            <!-- Teléfonos -->
            <div class="grid grid-cols-2 gap-4 md:col-span-2">
              <!-- Teléfono Principal -->
              <div
                class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <Phone class="w-5 h-5 text-primary/70" />
                <div class="flex-1 min-w-0">
                  <label class="block text-xs font-medium text-text/70 mb-1"
                    >Teléfono Principal</label
                  >
                  <template v-if="isEditing">
                    <input
                      v-model="editedClient.tel_1"
                      type="tel"
                      maxlength="8"
                      class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      @keypress="onlyNumbers"
                    />
                  </template>
                  <template v-else>
                    <p class="text-sm text-text break-words">{{ editedClient.tel_1 }}</p>
                  </template>
                </div>
              </div>

              <!-- Teléfono Alternativo -->
              <div
                class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <Phone class="w-5 h-5 text-primary/70" />
                <div class="flex-1 min-w-0">
                  <label class="block text-xs font-medium text-text/70 mb-1"
                    >Teléfono Alternativo</label
                  >
                  <template v-if="isEditing">
                    <input
                      v-model="editedClient.tel_2"
                      type="tel"
                      maxlength="8"
                      class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      @keypress="onlyNumbers"
                    />
                  </template>
                  <template v-else>
                    <p class="text-sm text-text break-words">
                      {{ editedClient.tel_2 || 'N/A' }}
                    </p>
                  </template>
                </div>
              </div>
            </div>

            <!-- Dirección -->
            <div
              class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 md:col-span-2"
            >
              <MapPin class="w-5 h-5 text-primary/70" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Dirección</label>
                <template v-if="isEditing">
                  <input
                    v-model="editedClient.direccion"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </template>
                <template v-else>
                  <p class="text-sm text-text break-words">{{ editedClient.direccion }}</p>
                </template>
              </div>
            </div>

            <!-- Asignar a -->
            <div class="grid grid-cols-2 gap-4 md:col-span-2">
              <div
                class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <User class="w-5 h-5 text-primary/70" />
                <div class="flex-1 min-w-0">
                  <label
                    for="usuarioAsociado"
                    class="block text-xs font-medium text-text/70 mb-1"
                    >{{ isEditing ? 'Asignar a' : 'Asignado a' }}</label
                  >
                  <template v-if="isEditing">
                    <select
                      id="usuarioAsociado"
                      v-model="editedClient.id_usuario_correduria"
                      class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      required
                    >
                      <option value="" disabled>Seleccione un usuario...</option>
                      <option
                        v-for="usuario in usuarios"
                        :key="usuario.id_usuario"
                        :value="usuario.id_usuario"
                      >
                        {{ usuario.nombre }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <div
                      class="group flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <p class="text-sm text-text break-words">
                        {{ getUsuarioNombre(editedClient.id_usuario_correduria) || 'No asignado' }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>

              <div class="flex items-center gap-2 justify-center">
                <button
                  v-if="isEditing"
                  type="button"
                  class="flex items-center text-center gap-1 px-4 py-2 rounded-lg border border-input-border text-gray-200 bg-primary text-xs font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5"
                  @click="selectImage"
                >
                  <Upload class="w-3 h-3" />
                  <span>Cambiar Fotografía</span>
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
          </div>
        </div>

        <!-- Pie del modal -->
        <div
          class="sticky bottom-0 px-6 py-4 border-t border-container-border bg-background/80 backdrop-blur-xl"
        >
          <div class="flex justify-between gap-3">
            <!-- Botón de eliminar -->
            <button
              class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="showDeleteConfirm = true"
            >
              <Trash2 class="w-5 h-5" />
              Eliminar Cliente
            </button>

            <!-- Botones de acción -->
            <div class="flex gap-3">
              <button
                class="px-6 py-2.5 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
                @click="handleClose"
              >
                Cerrar
              </button>
              <button
                v-if="isEditing"
                class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                @click="handleSave"
              >
                <Save class="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
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
  <Teleport to="body">
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
      @click="showDeleteConfirm = false"
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
          <span class="font-medium text-text">{{
            editedClient.nombres + ' ' + editedClient.apellidos
          }}</span
          >? Esta acción no se puede deshacer.
        </p>

        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
            @click="showDeleteConfirm = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="handleDeleteClient(editedClient.id_cliente ?? '')"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Building2,
    Pencil,
    Trash2,
    AlertTriangle,
    Save,
    Upload,
  } from 'lucide-vue-next';
  import { Cliente } from '../interfaces/cliente_interface';
  import { getUsuariosPorCorreduriaAction } from '../actions/usuarios_actions';
  import { Usuario } from '../interfaces/usuarios_interface';

  const props = defineProps<{
    show: boolean;
    idCliente: string;
    client: Cliente;
  }>();

  const emit = defineEmits<{
    close: [];
    'update-client': [data: FormData];
    'delete-client': [id_cliente: string];
  }>();

  const showDeleteConfirm = ref(false);
  const showCloseConfirm = ref(false);
  const isEditing = ref(false);
  const hasChanges = ref(false);
  const foto = ref('./user.png');

  // Crear copias reactivas de los datos del cliente para edición
  const editedClient = ref<Cliente>({ ...props.client });
  const usuarios = ref<Usuario[]>([]);
  const fileInput = ref<HTMLInputElement | null>(null);
  const selectedFile = ref<File | null>(null);

  onMounted(async () => {
    try {
      const id_correduria = localStorage.getItem('id_correduria') ?? '';
      const response = await getUsuariosPorCorreduriaAction(id_correduria);
      usuarios.value = response.data; // Assign the fetched data
      foto.value = editedClient.value.foto as string;

      // Agregar configuración para event listeners pasivos
      const options = { passive: true };
      document.addEventListener('touchstart', () => {}, options);
      document.addEventListener('touchmove', () => {}, options);
      document.addEventListener('wheel', () => {}, options);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  });

  onUnmounted(() => {
    // Limpiar los event listeners al desmontar el componente
    document.removeEventListener('touchstart', () => {});
    document.removeEventListener('touchmove', () => {});
    document.removeEventListener('wheel', () => {});
  });

  // Función para verificar cambios
  const checkChanges = () => {
    const original = JSON.stringify(props.client);
    const current = JSON.stringify(editedClient.value);
    hasChanges.value = original !== current;
  };

  // Observar cambios en editedClient
  watch(
    editedClient,
    () => {
      if (isEditing.value) {
        checkChanges();
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
    editedClient.value = { ...props.client };
    hasChanges.value = false;
    showCloseConfirm.value = false;
    emit('close');
  };

  const handleSave = () => {
    const formData = new FormData();
    if (
      editedClient.value.nombres &&
      editedClient.value.apellidos &&
      editedClient.value.correo &&
      editedClient.value.id_usuario_correduria
    ) {
      Object.entries(editedClient.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Append the selected file to the formData
      if (fileInput.value?.files?.[0]) {
        formData.append('foto', fileInput.value.files[0]); // Agregar el archivo al FormData
      }
    }

    emit('update-client', formData);
    isEditing.value = false;
    hasChanges.value = false;
  };

  const handleDeleteClient = (clientId: string) => {
    showDeleteConfirm.value = false;
    emit('delete-client', clientId);
    emit('close');
  };

  // Función para formatear fecha
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-HN');
  };

  // Función para validar solo letras y espacios
  const onlyLetters = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]$/.test(char)) {
      e.preventDefault();
    }
  };

  // Función para validar solo números
  const onlyNumbers = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    if (!/^[0-9]$/.test(char)) {
      e.preventDefault();
    }
  };

  //Formatear la fecha (DOB) para ser legible para el input
  const dobFormatted = computed({
    get: () => {
      if (!editedClient.value.dob) return ''; // Evitar errores en valores nulos
      const date = new Date(editedClient.value.dob);
      return date.toISOString().split('T')[0]; // Convierte a YYYY-MM-DD
    },
    set: (newValue: string) => {
      editedClient.value.dob = new Date(newValue); // Convertir de string a Date
    },
  });

  // Función para validar que la fecha de nacimiento no sea en el futuro
  const validateBirthDate = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const selectedDate = new Date(input.value);
    const today = new Date();

    // Si la fecha seleccionada es mayor que hoy (fecha futura)
    if (selectedDate > today) {
      // Revertir a la fecha actual o limpiar el campo
      input.value = today.toISOString().split('T')[0];
      // Actualizar el modelo
      editedClient.value.dob = today;
      // Opcional: Mostrar un mensaje al usuario
      alert('La fecha de nacimiento no puede ser en el futuro.');
    }
  };

  // Separar el nombre en partes
  const nameParts = computed(() => {
    const parts = editedClient.value.nombres.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  });

  // Actualizar el nombre completo cuando cambian las partes
  const updateName = (part: 'firstName' | 'lastName', value: string) => {
    const parts = nameParts.value;
    if (part === 'firstName') {
      parts.firstName = value;
    } else {
      parts.lastName = value;
    }
    editedClient.value.nombres = `${parts.firstName} ${parts.lastName}`.trim();
  };

  // Function to get the user's name by ID
  const getUsuarioNombre = (id: string) => {
    const usuario = usuarios.value.find((u) => u.id_usuario === id);
    return usuario ? usuario.nombre : '';
  };

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

      // Store the selected file
      selectedFile.value = file;

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          // Update the preview image
          const previewImage = e.target.result as string;
          editedClient.value.foto = previewImage; // Update the editedClient.foto with the preview URL
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to open the file input dialog
  const selectImage = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
  };
</script>
