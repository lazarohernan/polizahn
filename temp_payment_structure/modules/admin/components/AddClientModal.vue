<template>
  <Teleport to="body">
    <!-- Overlay con efecto de desenfoque -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100] p-6 sm:p-4"
      @click="handleClose"
    >
      <!-- Contenedor del modal -->
      <div
        class="w-full max-w-[600px] max-h-[calc(100vh-3rem)] overflow-y-auto bg-background rounded-3xl border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-transform duration-300 sm:rounded-2xl"
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
            <h2 class="text-xl font-semibold text-text">Nuevo Cliente</h2>
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
          <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
            <!-- Sección de información personal -->
            <div class="bg-input-bg border border-input-border rounded-xl p-5">
              <div class="flex items-center gap-3 mb-4">
                <User class="w-5 h-5 text-primary/70" />
                <h3 class="text-base font-medium text-text">Información Personal</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- Primera fila: Nombres y Apellidos -->
                <div class="flex flex-col gap-1.5">
                  <label for="firstName" class="text-sm font-medium text-text/70">Nombres</label>
                  <div class="relative group">
                    <User
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="firstName"
                      v-model="firstName"
                      type="text"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Ingrese los nombres"
                      @keypress="onlyLetters"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="lastName" class="text-sm font-medium text-text/70">Apellidos</label>
                  <div class="relative group">
                    <User
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="lastName"
                      v-model="lastName"
                      type="text"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Ingrese los apellidos"
                      @keypress="onlyLetters"
                    />
                  </div>
                </div>

                <!-- Segunda fila: Identificación y Fecha de nacimiento -->
                <div class="flex flex-col gap-1.5">
                  <label for="dni" class="text-sm font-medium text-text/70">Identificación</label>
                  <div class="relative group">
                    <CreditCard
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="dni"
                      v-model="dni"
                      type="text"
                      maxlength="14"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Ej. 0801199012345"
                      @keypress="onlyNumbers"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="birthDate" class="text-sm font-medium text-text/70"
                    >Fecha de Nacimiento</label
                  >
                  <div class="relative group">
                    <Calendar
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="birthDate"
                      v-model="birthDate"
                      type="date"
                      :max="new Date().toISOString().split('T')[0]"
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      @change="validateBirthDate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de información de contacto -->
            <div class="bg-input-bg border border-input-border rounded-xl p-5">
              <div class="flex items-center gap-3 mb-4">
                <Mail class="w-5 h-5 text-primary/70" />
                <h3 class="text-base font-medium text-text">Información de Contacto</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- Primera fila: Correo Electrónico y Empresa -->
                <div class="flex flex-col gap-1.5">
                  <label for="email" class="text-sm font-medium text-text/70"
                    >Correo Electrónico</label
                  >
                  <div class="relative group">
                    <Mail
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      required
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="company" class="text-sm font-medium text-text/70">Empresa</label>
                  <div class="relative group">
                    <Building2
                      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                    />
                    <input
                      id="company"
                      v-model="company"
                      type="text"
                      class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>

                <!-- Teléfonos -->
                <div class="grid grid-cols-2 gap-4 col-span-2">
                  <!-- Teléfono Principal -->
                  <div class="flex flex-col gap-1.5">
                    <label for="phone" class="text-sm font-medium text-text/70"
                      >Teléfono Principal</label
                    >
                    <div class="relative group">
                      <Phone
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                      />
                      <input
                        id="phone"
                        v-model="phone"
                        type="tel"
                        maxlength="8"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>
                  </div>

                  <!-- Teléfono Alternativo -->
                  <div class="flex flex-col gap-1.5">
                    <label for="alternativePhone" class="text-sm font-medium text-text/70"
                      >Teléfono Alternativo</label
                    >
                    <div class="relative group">
                      <Phone
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                      />
                      <input
                        id="alternativePhone"
                        v-model="alternativePhone"
                        type="tel"
                        maxlength="8"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="3344-5566"
                        @keypress="onlyNumbers"
                      />
                    </div>
                  </div>
                </div>

                <!-- Dirección y Empresa -->
                <div class="grid grid-cols-2 gap-4 col-span-2">
                  <!-- Dirección -->
                  <div class="col-span-2 flex flex-col gap-1.5">
                    <label for="address" class="text-sm font-medium text-text/70">Dirección</label>
                    <div class="relative group">
                      <MapPin
                        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50 transition-colors group-focus-within:text-primary"
                      />
                      <input
                        id="address"
                        v-model="address"
                        type="text"
                        class="w-full h-11 pl-11 pr-4 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        placeholder="Ingrese la dirección completa"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de asignarlo a un usuario y fotografía -->
            <div class="bg-input-bg border border-input-border rounded-xl p-5">
              <div class="flex items-center gap-3 mb-4">
                <circle-user class="w-5 h-5 text-primary/70"></circle-user>
                <h3 class="text-base font-medium text-text">Asignación y fotografía</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <!-- Primera fila: Asignación de usuario responsable -->
                <div class="col-span-2 flex flex-col gap-1.5">
                  <label for="email" class="text-sm font-medium text-text/70">Asignar a:</label>

                  <select
                    id="usuarioAsociado"
                    v-model="selectedUsuario"
                    class="w-full py-3.5 pl-4 pr-10 rounded-xl border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_1rem]"
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
                </div>

                <!-- Segunda fila: Fotografía del cliente *opcional -->
                <div class="col-span-2 flex flex-col items-center justify-center gap-1.5">
                  <div
                    class="col-span-2 flex flex-col items-center justify-center gap-1.5 text-center"
                  >
                    <div
                      class="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-container-border hover:border-primary hover:scale-105 transition-all duration-300"
                    >
                      <img :src="foto" alt="Foto preview" class="w-full h-full object-cover" />
                    </div>
                    <!-- Botón para subir logo -->
                    <button
                      type="button"
                      class="flex items-center text-center gap-2 px-5 py-2.5 rounded-xl border border-input-border text-gray-200 bg-primary text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-0.5"
                      @click="selectImage"
                    >
                      <Upload class="w-5 h-5" />
                      <span>Subir Fotografía</span>
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

            <!-- Acciones del formulario -->
            <div
              class="sticky bottom-0 px-6 py-4 -mx-6 -mb-6 border-t border-container-border bg-background/80 backdrop-blur-xl"
            >
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  class="px-6 py-2.5 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
                  @click="handleClose"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Guardar Cliente
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

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
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import {
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    CircleUser,
    Building2,
    AlertTriangle,
    Upload,
  } from 'lucide-vue-next';
  import { getUsuariosPorCorreduriaAction } from '../actions/usuarios_actions';
  import { Usuario } from '../interfaces/usuarios_interface';

  defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
    save: [data: FormData];
  }>();

  //Obtener el id_correduria del localstorage
  const id_correduria = localStorage.getItem('id_correduria') ?? '';
  const firstName = ref('');
  const lastName = ref('');
  const dni = ref('');
  const birthDate = ref('');
  const email = ref('');
  const company = ref('');
  const phone = ref('');
  const alternativePhone = ref('');
  const address = ref('');
  const showCloseConfirm = ref(false);
  const hasChanges = ref(false);
  const selectedUsuario = ref('');
  const foto = ref('./user.png');
  const fileInput = ref<HTMLInputElement | null>(null);
  //En esta variable reactiva se grabarán las aseguradoras
  const usuarios = ref<Usuario[]>([]);

  // Observar cambios en los campos
  watch(
    [
      firstName,
      lastName,
      dni,
      birthDate,
      email,
      company,
      phone,
      alternativePhone,
      address,
      foto,
      selectedUsuario,
    ],
    () => {
      hasChanges.value =
        firstName.value !== '' ||
        lastName.value !== '' ||
        dni.value !== '' ||
        birthDate.value !== '' ||
        email.value !== '' ||
        company.value !== '' ||
        phone.value !== '' ||
        alternativePhone.value !== '' ||
        address.value !== '' ||
        foto.value !== './user.png' ||
        selectedUsuario.value !== '';
    },
    { deep: true },
  );

  // Función para abrir el selector de archivos
  const selectImage = () => {
    if (fileInput.value) {
      fileInput.value.click();
    }
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

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          foto.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      birthDate.value = today.toISOString().split('T')[0];
      // Opcional: Mostrar un mensaje al usuario
      alert('La fecha de nacimiento no puede ser en el futuro.');
    }
  };

  // Validación para permitir solo letras y espacios
  const onlyLetters = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]$/.test(char)) {
      e.preventDefault();
    }
  };

  // Validación para permitir solo números
  const onlyNumbers = (e: KeyboardEvent) => {
    const char = String.fromCharCode(e.keyCode || e.charCode);
    if (!/^[0-9]$/.test(char)) {
      e.preventDefault();
    }
  };

  //Agregar cliente
  const handleSubmit = () => {
    if (firstName.value && lastName.value && dni.value && email.value) {
      const formData = new FormData();
      //Agregar los campos al formData
      if (firstName.value && lastName && dni.value && email.value && phone.value) {
        formData.append('id_correduria', id_correduria);
        formData.append('nombres', firstName.value);
        formData.append('apellidos', lastName.value);
        formData.append('identificacion', dni.value);
        formData.append('dob', birthDate.value);
        formData.append('correo', email.value);
        formData.append('empresa', company.value);
        formData.append('tel_1', phone.value);
        formData.append('tel_2', alternativePhone.value);
        formData.append('direccion', address.value);
        formData.append('id_usuario_correduria', selectedUsuario.value);

        if (fileInput.value?.files?.[0]) {
          formData.append('foto', fileInput.value.files[0]); // Agregar el archivo al FormData
        }

        emit('save', formData);
      }
      resetForm();
    }
  };

  //Resetear el formulario
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
    foto.value = './user.png';
    fileInput.value = null;
    selectedUsuario.value = '';
    hasChanges.value = false;
  };

  //Cerrar el modal
  const handleClose = () => {
    if (hasChanges.value) {
      showCloseConfirm.value = true;
    } else {
      confirmClose();
    }
  };

  //Confirmar descartar los cambios detectados
  const confirmClose = () => {
    resetForm();
    showCloseConfirm.value = false;
    emit('close');
  };

  //Cargar los usuarios de la correduría al estar montado el modal
  onMounted(async () => {
    try {
      const response = await getUsuariosPorCorreduriaAction(id_correduria);
      usuarios.value = response.data; // Asigna los datos a la variable reactiva
    } catch (error) {
      console.error('Error al cargar usuarios de la correduría:', error);
    }
  });
</script>
