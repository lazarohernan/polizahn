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
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 class="text-xl font-semibold text-text m-0">Nuevo Cliente</h2>
                    <p class="text-sm text-text/60 mt-0.5 m-0">Complete los datos del cliente</p>
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

            <!-- Cuerpo -->
            <div class="p-5">
              <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
                <!-- Información Personal -->
                <div class="bg-input-bg/50 border border-input-border rounded-xl p-4 transition-all duration-300 hover:bg-input-bg">
                  <div class="flex items-center gap-3 mb-3">
                    <User class="w-5 h-5 text-primary" />
                    <div>
                      <h3 class="text-base font-medium text-text m-0">Información Personal</h3>
                      <p class="text-xs text-text/60 m-0">Datos básicos del cliente</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <!-- Nombres y Apellidos -->
                    <div>
                      <label for="firstName" class="text-xs font-medium text-text/70 mb-1.5 block">Nombres</label>
                      <input
                        id="firstName"
                        v-model="firstName"
                        type="text"
                        required
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese los nombres"
                        @keypress="onlyLetters"
                      />
                    </div>

                    <div>
                      <label for="lastName" class="text-xs font-medium text-text/70 mb-1.5 block">Apellidos</label>
                      <input
                        id="lastName"
                        v-model="lastName"
                        type="text"
                        required
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ingrese los apellidos"
                        @keypress="onlyLetters"
                      />
                    </div>

                    <!-- Identificación y Fecha de nacimiento -->
                    <div>
                      <label for="dni" class="text-xs font-medium text-text/70 mb-1.5 block">Identificación</label>
                      <input
                        id="dni"
                        v-model="dni"
                        type="text"
                        maxlength="14"
                        required
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Ej. 0801199012345"
                        @keypress="onlyNumbers"
                      />
                    </div>

                    <div>
                      <label for="birthDate" class="text-xs font-medium text-text/70 mb-1.5 block">Fecha de Nacimiento</label>
                      <input
                        id="birthDate"
                        v-model="birthDate"
                        type="date"
                        :max="new Date().toISOString().split('T')[0]"
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        @change="validateBirthDate"
                      />
                    </div>
                  </div>
                </div>

                <!-- Información de Contacto -->
                <div class="bg-input-bg/50 border border-input-border rounded-xl p-4 transition-all duration-300 hover:bg-input-bg">
                  <div class="flex items-center gap-3 mb-3">
                    <Mail class="w-5 h-5 text-primary" />
                    <div>
                      <h3 class="text-base font-medium text-text m-0">Información de Contacto</h3>
                      <p class="text-xs text-text/60 m-0">Datos de contacto del cliente</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <!-- Email y Empresa -->
                    <div>
                      <label for="email" class="text-xs font-medium text-text/70 mb-1.5 block">Correo Electrónico</label>
                      <input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label for="company" class="text-xs font-medium text-text/70 mb-1.5 block">Empresa</label>
                      <input
                        id="company"
                        v-model="company"
                        type="text"
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Nombre de la empresa"
                      />
                    </div>

                    <!-- Teléfonos -->
                    <div>
                      <label for="phone" class="text-xs font-medium text-text/70 mb-1.5 block">Teléfono Principal</label>
                      <input
                        id="phone"
                        v-model="phone"
                        type="tel"
                        maxlength="8"
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>

                    <div>
                      <label for="alternativePhone" class="text-xs font-medium text-text/70 mb-1.5 block">Teléfono Alternativo</label>
                      <input
                        id="alternativePhone"
                        v-model="alternativePhone"
                        type="tel"
                        maxlength="8"
                        class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>
                  </div>
                </div>

                <!-- Asignación de Usuario -->
                <div class="bg-input-bg/50 border border-input-border rounded-xl p-4 transition-all duration-300 hover:bg-input-bg">
                  <div class="flex items-center gap-3 mb-3">
                    <User class="w-5 h-5 text-primary" />
                    <div>
                      <h3 class="text-base font-medium text-text m-0">Asignación</h3>
                      <p class="text-xs text-text/60 m-0">Asignar usuario responsable</p>
                    </div>
                  </div>

                  <div>
                    <label for="selectedUsuario" class="text-xs font-medium text-text/70 mb-1.5 block">Usuario Asignado</label>
                    <select
                      id="selectedUsuario"
                      v-model="selectedUsuario"
                      class="w-full py-2.5 px-3 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="" disabled>Seleccione un usuario</option>
                      <option v-for="usuario in usuarios" :key="usuario.id_usuario" :value="usuario.id_usuario">
                        {{ usuario.nombre }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    class="px-4 py-2.5 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
                    @click="handleClose"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                    :disabled="loading"
                  >
                    <Save v-if="!loading" class="w-5 h-5" />
                    <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    {{ loading ? 'Guardando...' : 'Guardar Cliente' }}
                  </button>
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
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  User,
  X,
  Mail,
  Save,
} from 'lucide-vue-next';
import { useUsuarios } from '@/composables/useUsuarios';

// Definir tipo para Usuario (similar al de Clientes.vue)
type Usuario = {
  id_usuario: string;
  nombre: string;
  correo?: string; // Hacer opcional si no siempre está
  auth_user_id?: string;
  fecha_creado?: string;
};

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{ 
  (e: 'close'): void;
  (e: 'add-client', formData: FormData): void;
}>();

const toast = useToast();

// Composables
const { getUsuariosPorCorreduria } = useUsuarios();

// Estados del formulario
const firstName = ref('');
const lastName = ref('');
const dni = ref('');
const birthDate = ref('');
const email = ref('');
const company = ref('');
const phone = ref('');
const alternativePhone = ref('');
const address = ref(''); // address no parece usarse en el form, considerar si es necesario
const showCloseConfirm = ref(false);
const hasChanges = ref(false);
const selectedUsuario = ref(''); 
// const foto = ref('./user.png'); // La lógica de foto no está implementada
// const fileInput = ref<HTMLInputElement | null>(null);
const usuarios = ref<Usuario[]>([]); // Usar tipo Usuario
const loading = ref(false);
// Eliminar showError y errorMessage si no se usan
// const showError = ref(false);
// const errorMessage = ref('');

// Watch para detectar cambios (si se necesita showCloseConfirm)
// Watch all form refs to set hasChanges
// Example: watch([firstName, lastName, ...], () => { hasChanges.value = true; });
// Por ahora, asumiremos que cualquier intento de guardar implica cambios o se maneja externamente.

// Validaciones
const onlyLetters = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode);
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(char)) {
    e.preventDefault();
  }
};

const onlyNumbers = (e: KeyboardEvent) => {
  const char = String.fromCharCode(e.keyCode);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
};

const validateBirthDate = () => {
  const selectedDate = new Date(birthDate.value);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100);

  if (selectedDate > today) {
    toast.error('La fecha de nacimiento no puede ser mayor a la fecha actual');
    birthDate.value = '';
    return;
  }

  if (selectedDate < minDate) {
    toast.error('La fecha de nacimiento no puede ser menor a 100 años');
    birthDate.value = '';
    return;
  }
};

// Manejadores
const handleClose = () => {
  // Simplificado: preguntar siempre si hay algo escrito o quitar confirmación
  // if (hasChanges.value) { 
  //   showCloseConfirm.value = true;
  // } else {
    confirmClose();
  // }
};

const resetForm = () => {
  firstName.value = '';
  lastName.value = '';
  dni.value = '';
  birthDate.value = '';
  email.value = '';
  company.value = '';
  phone.value = '';
  alternativePhone.value = '';
  address.value = '';
  // foto.value = './user.png';
  // if (fileInput.value) fileInput.value.value = ''; // Reset file input if used
  selectedUsuario.value = '';
  hasChanges.value = false;
  loading.value = false;
};

const handleSubmit = async () => {
  // Validaciones básicas
  if (!firstName.value.trim() || !lastName.value.trim() || !dni.value.trim() || !email.value.trim()) {
    toast.error('Por favor complete los campos requeridos: Nombres, Apellidos, Identificación y Correo.');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('nombres', firstName.value.trim());
    formData.append('apellidos', lastName.value.trim());
    formData.append('identificacion', dni.value.trim());
    if (birthDate.value) {
      formData.append('dob', birthDate.value);
    }
    formData.append('correo', email.value.trim());
    if (company.value.trim()) {
      formData.append('empresa', company.value.trim());
    }
    if (phone.value.trim()) {
      formData.append('tel_1', phone.value.trim());
    }
    if (alternativePhone.value.trim()) {
      formData.append('tel_2', alternativePhone.value.trim());
    }
    if (selectedUsuario.value) {
       formData.append('id_usuario_asignado', selectedUsuario.value);
    }
    // Si se implementa la subida de foto, añadirla aquí:
    // if (selectedFile.value) { 
    //   formData.append('foto', selectedFile.value);
    // }

    // Emitir los datos
    emit('add-client', formData);

    // El componente padre (Clientes.vue) maneja la llamada a la API y el cierre.
    // No cerramos aquí directamente, esperamos al padre.
    // resetForm(); // Resetear podría ser responsabilidad del padre tras éxito
    // emit('close'); // El padre cierra el modal

  } catch (error) {
    console.error('Error preparando datos del cliente:', error);
    toast.error('Error al preparar los datos del cliente.');
  } finally {
    // El loading debe desactivarse en el componente padre (Clientes.vue) 
    // después de que la operación (createCliente) termine.
    // Si dejamos loading=false aquí, el botón se reactiva inmediatamente.
    // Considerar añadir un prop para controlar el estado de carga desde el padre
    // o quitar el finally aquí.
     loading.value = false; // Temporalmente lo dejamos aquí
  }
};

// Eliminar selectImage y handleImageUpload si no se usan
// const selectImage = () => { ... };
// const handleImageUpload = (event: Event) => { ... };

//Cerrar el modal
const confirmClose = () => {
  resetForm();
  showCloseConfirm.value = false;
  emit('close');
};

//Cargar los usuarios al estar montado
onMounted(async () => {
  try {
    const id_correduria = localStorage.getItem('id_correduria') ?? '';
    const { data } = await getUsuariosPorCorreduria(id_correduria);
    if (data) {
      // Asegurar que los datos coincidan con el tipo Usuario
      usuarios.value = data.map(user => ({ 
        id_usuario: user.auth_user_id, // Mapear auth_user_id a id_usuario
        nombre: user.nombre,
        correo: user.correo,
        auth_user_id: user.auth_user_id,
        fecha_creado: user.fecha_creado
      }));
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    toast.error('Error al cargar los usuarios');
  }
});
</script>
