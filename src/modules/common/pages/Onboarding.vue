<script setup lang="ts">
  /**
   * Vista de Onboarding
   *
   * Permite al usuario configurar su perfil inicial:
   * - Subir/cambiar foto de perfil con recorte
   * - Ver datos personales verificados
   * - Estado de activación de cuenta
   * - Cambiar tema claro/oscuro
   */

  import { ref, reactive } from 'vue';
  import { Camera, Save } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import ImageUploader from '@/modules/admin/components/ImageUploader.vue';
  import Avatar from '@/components/Avatar.vue';
  import ThemeToggle from '@/modules/common/components/ThemeToggle.vue';

  // Router para navegación
  const router = useRouter();

  // Estados
  const profileImage = ref('');
  const showUploadModal = ref(false);
  const userName = ref('John Doe');
  const showContent = ref(true);
  const showVerifications = ref(false);

  // Verificaciones
  const verifications = [
    {
      title: 'Cuenta Activada',
      message: 'Tu cuenta ha sido verificada y activada exitosamente',
    },
    {
      title: 'Datos Verificados',
      message: 'Tus datos han sido validados por nuestro equipo',
    },
    {
      title: 'Permisos Asignados',
      message: 'Se han configurado tus permisos según tu rol en la plataforma',
    },
  ];

  // Datos editables del usuario
  const userData = reactive({
    phone: '',
    birthDate: '',
  });

  // Manejador de actualización de imagen
  const handleImageUpdate = (data: { url: string; dominantColor: string | null }) => {
    profileImage.value = data.url;
    showUploadModal.value = false;
  };

  // Manejador para guardar información
  const handleSave = () => {
    showContent.value = false;
    window.setTimeout(() => {
      showVerifications.value = true;
    }, 300);
  };

  // Manejador para ir al dashboard
  const handleStart = () => {
    router.push('/dashboard');
  };

  // Manejador para regresar
  const handleBack = () => {
    showVerifications.value = false;
    window.setTimeout(() => {
      showContent.value = true;
    }, 300);
  };
</script>

<template>
  <div class="min-h-screen public-page-gradient flex items-center justify-center p-4 sm:p-6">
    <div
      class="w-full max-w-[1000px] bg-background rounded-3xl border border-container-border shadow-lg overflow-hidden relative"
    >
      <!-- Contenido -->
      <div class="p-6 sm:p-8 md:p-12">
        <!-- Mensaje de bienvenida -->
        <div class="relative text-center mb-8 animate-fade-in">
          <!-- ThemeToggle -->
          <div class="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text mb-2">
            ¡Bienvenido a la Plataforma!
          </h1>
          <p class="text-text/70">
            Estamos emocionados de tenerte con nosotros. Comencemos a configurar tu perfil.
          </p>
        </div>

        <!-- Contenido principal -->
        <template v-if="showContent">
          <div class="space-y-8 animate-fade-out">
            <!-- Sección superior: Foto y datos personales -->
            <div class="flex flex-col md:flex-row gap-8 md:gap-12">
              <!-- Columna de foto -->
              <div class="flex flex-col items-center gap-6">
                <Avatar :name="userName" :image="profileImage" size="lg" />
                <button
                  class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg h-12 w-full sm:w-auto"
                  @click="showUploadModal = true"
                >
                  <Camera class="w-5 h-5" />
                  <span>{{ profileImage ? 'Cambiar Foto' : 'Subir Foto' }}</span>
                </button>

                <!-- Modal de subida de imagen -->
                <div
                  v-if="showUploadModal"
                  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
                  @click.self="showUploadModal = false"
                >
                  <!-- Contenedor del modal -->
                  <div class="w-full max-w-xs bg-background rounded-2xl p-4 shadow-xl">
                    <!-- Encabezado del modal -->
                    <div class="flex items-center justify-between mb-3">
                      <h3 class="text-base font-medium text-text">Subir foto de perfil</h3>
                      <button
                        class="p-1.5 rounded-lg bg-input-bg border border-input-border text-text/70 transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary"
                        title="Cerrar"
                        @click="showUploadModal = false"
                      >
                        <span class="sr-only">Cerrar</span>
                        <svg
                          class="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <!-- Área de subida de imagen -->
                    <div
                      class="relative aspect-square w-full bg-input-bg rounded-lg overflow-hidden ring-1 ring-input-border/5 flex items-center justify-center group"
                    >
                      <div
                        class="absolute inset-0 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/10"
                      >
                        <div class="text-center px-4">
                          <p class="text-text/70 text-sm group-hover:text-primary">
                            Arrastra una imagen o haz clic para seleccionar
                          </p>
                          <p class="text-text/50 text-xs mt-1 group-hover:text-white">
                            PNG, JPG o GIF (máx. 5MB)
                          </p>
                        </div>
                      </div>
                      <ImageUploader
                        :initial-image="profileImage"
                        :aspect-ratio="1"
                        :max-size="5 * 1024 * 1024"
                        @update="handleImageUpdate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Columna de datos -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1 animate-slide-up">
                <!-- Primera fila: Nombre y Correo -->
                <!-- Tarjeta de datos con fondo suave y sombra -->
                <div
                  class="flex flex-col p-4 sm:p-5 bg-white/50 dark:bg-gray-800/50 border border-input-border/50 rounded-xl shadow-sm backdrop-blur-sm min-h-[100px] transition-colors duration-300"
                >
                  <label class="text-sm font-medium text-text/70 mb-2">Nombre Completo</label>
                  <div class="text-text text-lg font-medium">John Doe</div>
                </div>

                <!-- Tarjeta de correo con fondo adaptativo -->
                <div
                  class="flex flex-col p-4 sm:p-5 bg-white/50 dark:bg-gray-800/50 border border-input-border/50 rounded-xl shadow-sm backdrop-blur-sm min-h-[100px] transition-colors duration-300"
                >
                  <label class="text-sm font-medium text-text/70 mb-2">Correo Electrónico</label>
                  <div class="text-text break-all">john.doe@example.com</div>
                </div>

                <!-- Segunda fila: Teléfono y Fecha de Nacimiento -->
                <p class="text-xs text-text/50 col-span-2 mb-2 text-center">
                  Agrega tu número de teléfono y fecha de nacimiento, sino los puedes agregar más
                  tarde.
                </p>
                <!-- Tarjeta de teléfono con input estilizado -->
                <div
                  class="flex flex-col p-4 sm:p-5 bg-white/50 dark:bg-gray-800/50 border border-input-border/50 rounded-xl shadow-sm backdrop-blur-sm min-h-[100px] transition-colors duration-300"
                >
                  <label class="text-sm font-medium text-text/70 mb-2">Teléfono</label>
                  <input
                    v-model="userData.phone"
                    type="tel"
                    placeholder="+504 9999-9999"
                    pattern="[\+]?[0-9]{3}[\s]?[0-9]{4}[-]?[0-9]{4}"
                    class="bg-transparent border-none text-text focus:outline-none placeholder:text-text/30 transition-colors duration-300"
                    @input="
                      (e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9+\s-]/g, '');
                        userData.phone = target.value;
                      }
                    "
                  />
                </div>

                <!-- Tarjeta de fecha con calendario personalizado -->
                <div
                  class="flex flex-col p-4 sm:p-5 bg-white/50 dark:bg-gray-800/50 border border-input-border/50 rounded-xl shadow-sm backdrop-blur-sm min-h-[100px] transition-colors duration-300"
                >
                  <label class="text-sm font-medium text-text/70 mb-2">Fecha de Nacimiento</label>
                  <input
                    v-model="userData.birthDate"
                    type="date"
                    :max="new Date().toISOString().split('T')[0]"
                    class="bg-transparent border-none text-text focus:outline-none w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <!-- Botón de guardar con icono y efecto hover -->
            <div class="flex justify-end">
              <button
                class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                @click="handleSave"
              >
                <Save class="w-5 h-5" />
                <span>Guardar Información</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Verificaciones -->
        <div v-if="showVerifications" class="flex flex-col items-center gap-6 animate-fade-in">
          <!-- Grid de verificaciones -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto w-full"
          >
            <div
              v-for="(verification, index) in verifications"
              :key="index"
              class="flex items-start gap-3 p-4 sm:p-5 bg-white/50 dark:bg-gray-800/50 border border-input-border/50 rounded-xl shadow-sm backdrop-blur-sm transition-colors duration-300"
            >
              <svg
                class="w-5 h-5 text-emerald-500 flex-none mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <h4 class="text-sm font-medium text-text mb-1.5">
                  {{ verification.title }}
                </h4>
                <p class="text-sm text-text/70">
                  {{ verification.message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-center gap-4 mt-6">
            <button
              class="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-lg"
              @click="handleBack"
            >
              Regresar
            </button>
            <button
              class="px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
              @click="handleStart"
            >
              Vamos a Iniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
