<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1200px] mx-auto px-4">
      <div
        class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
      >
        <!-- Encabezado del perfil -->
        <div class="p-8 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-8 sm:flex-row flex-col text-center sm:text-left">
            <!-- Avatar -->
            <div class="relative w-[120px] h-[120px] flex-shrink-0">
              <img
                :src="
                  imagePreview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=8CBFCF&color=fff&size=120&bold=true`
                "
                :alt="fullName"
                class="w-full h-full rounded-2xl object-cover"
              />
              <!-- Badge de rol -->
              <div
                class="absolute -top-2 -right-2 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white"
                :class="{
                  'bg-primary': profileData.role === 'admin',
                  'bg-emerald-500': profileData.role === 'broker',
                  'bg-gray-500': profileData.role === 'agent',
                }"
              >
                {{ getRoleText(profileData.role) }}
              </div>
              <!-- Botón de cambiar avatar -->
              <label
                class="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer border-2 border-background transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Camera class="w-4 h-4" />
                <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
              </label>
            </div>

            <!-- Información básica -->
            <div class="flex-1">
              <h1 class="text-2xl font-semibold text-text mb-2">{{ fullName }}</h1>
              <p class="text-text/70">{{ profileData.company }}</p>
            </div>
          </div>
        </div>

        <!-- Contenido del perfil -->
        <div class="p-8">
          <!-- Encabezado de sección -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-text">Información Personal</h2>
            <div class="flex gap-3">
              <template v-if="!isEditing">
                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                  @click="isEditing = true"
                >
                  <Edit2 class="w-4 h-4" />
                  <span>Editar</span>
                </button>
              </template>
              <template v-else>
                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
                  @click="handleCancel"
                >
                  <X class="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                  @click="handleSave"
                >
                  <Save class="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </template>
            </div>
          </div>

          <!-- Grid de información -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <!-- Nombre -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <User class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Nombre</label>
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.firstName }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.firstName"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su nombre"
                  />
                </template>
              </div>
            </div>

            <!-- Apellido -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <User class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Apellido</label>
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.lastName }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.lastName"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su apellido"
                  />
                </template>
              </div>
            </div>

            <!-- Fecha de Nacimiento -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <Calendar class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1"
                  >Fecha de Nacimiento</label
                >
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ formatDate(profileData.birthDate || '') }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.birthDate"
                    type="date"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  />
                </template>
              </div>
            </div>

            <!-- Email -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <Mail class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1"
                  >Correo Electrónico</label
                >
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.email }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.email"
                    type="email"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su correo"
                  />
                </template>
              </div>
            </div>

            <!-- Teléfono -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <Phone class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Teléfono</label>
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.phone }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.phone"
                    type="tel"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su teléfono"
                  />
                </template>
              </div>
            </div>

            <!-- Dirección -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <MapPin class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Dirección</label>
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.address }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.address"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su dirección"
                  />
                </template>
              </div>
            </div>

            <!-- Empresa -->
            <div
              class="flex items-start gap-3 p-4 bg-input-bg border border-input-border rounded-xl"
            >
              <Building2 class="w-5 h-5 text-primary/70 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <label class="block text-xs font-medium text-text/70 mb-1">Empresa</label>
                <template v-if="!isEditing">
                  <p class="text-sm text-text">{{ profileData.company }}</p>
                </template>
                <template v-else>
                  <input
                    v-model="profileData.company"
                    type="text"
                    class="w-full px-3 py-1.5 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ingrese su empresa"
                  />
                </template>
              </div>
            </div>
          </div>

          <!-- Configuración y Ayuda -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 class="text-xl font-semibold text-text mb-6">Configuración y Ayuda</h2>

            <!-- Tema -->
            <div class="mb-8">
              <h3 class="text-base font-medium text-text mb-4">Tema</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  class="flex flex-col items-center gap-2 p-4 rounded-xl bg-input-bg border border-input-border transition-all duration-300 hover:border-primary hover:-translate-y-0.5 hover:shadow-md"
                  :class="{ 'border-primary bg-primary/5': colorMode === 'light' }"
                  @click="handleThemeChange('light')"
                >
                  <Sun class="w-6 h-6 text-primary" />
                  <span class="text-sm font-medium text-text">Claro</span>
                </button>
                <button
                  class="flex flex-col items-center gap-2 p-4 rounded-xl bg-input-bg border border-input-border transition-all duration-300 hover:border-primary hover:-translate-y-0.5 hover:shadow-md"
                  :class="{ 'border-primary bg-primary/5': colorMode === 'dark' }"
                  @click="handleThemeChange('dark')"
                >
                  <Moon class="w-6 h-6 text-primary" />
                  <span class="text-sm font-medium text-text">Oscuro</span>
                </button>
                <button
                  class="flex flex-col items-center gap-2 p-4 rounded-xl bg-input-bg border border-input-border transition-all duration-300 hover:border-primary hover:-translate-y-0.5 hover:shadow-md"
                  :class="{ 'border-primary bg-primary/5': colorMode === 'system' }"
                  @click="handleThemeChange('system')"
                >
                  <Monitor class="w-6 h-6 text-primary" />
                  <span class="text-sm font-medium text-text">Sistema</span>
                </button>
              </div>
            </div>

            <!-- Enlaces de Ayuda -->
            <div>
              <h3 class="text-base font-medium text-text mb-4">Ayuda</h3>
              <div class="flex flex-col gap-3">
                <a
                  href="#"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
                >
                  <FileText class="w-5 h-5" />
                  <span class="text-sm font-medium">Documentación</span>
                </a>
                <button
                  class="flex items-center gap-3 px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
                  @click="handleReportProblem"
                >
                  <AlertCircle class="w-5 h-5" />
                  <span class="text-sm font-medium">Reportar Problema</span>
                </button>
                <a
                  href="#"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
                >
                  <HelpCircle class="w-5 h-5" />
                  <span class="text-sm font-medium">Centro de Ayuda</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ReportProblemModal
    :show="showReportModal"
    @close="showReportModal = false"
    @submit="handleSubmitReport"
  />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import ReportProblemModal from '@/components/ReportProblemModal.vue';
  import {
    Mail,
    Phone,
    MapPin,
    Building2,
    User,
    Camera,
    Save,
    X,
    Edit2,
    Sun,
    Moon,
    Monitor,
    HelpCircle,
    AlertCircle,
    FileText,
    Calendar,
  } from 'lucide-vue-next';
  import { useColorMode } from '@/composables/useColorMode';

  interface ProfileData {
    firstName: string;
    lastName: string;
    role: 'admin' | 'broker' | 'agent';
    email: string;
    phone: string;
    address: string;
    company: string;
    birthDate?: string;
  }

  const isEditing = ref(false);
  const imageFile = ref<File | null>(null);
  const imagePreview = ref<string | null>(null);
  const { colorMode, setColorMode } = useColorMode();

  const profileData = ref<ProfileData>({
    firstName: 'Edgardo',
    lastName: 'Carmelino',
    role: 'admin',
    email: 'edgardocarmelino@admin.com',
    phone: '+504 9876-5432',
    address: 'Col. Palmira, Tegucigalpa',
    company: 'Seguros Ejemplo',
    birthDate: '1990-05-15',
  });

  const getRoleText = (role: string): string => {
    const roles = {
      admin: 'Admin',
      broker: 'Broker',
      agent: 'Agent',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const fullName = computed(() => `${profileData.value.firstName} ${profileData.value.lastName}`);

  const handleImageChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      imageFile.value = input.files[0];
      imagePreview.value = URL.createObjectURL(input.files[0]);
    }
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios en el servidor
    isEditing.value = false;
    // Resetear la URL del preview
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
  };

  const handleCancel = () => {
    isEditing.value = false;
    // Resetear la imagen preview si existe
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
      imagePreview.value = null;
    }
    imageFile.value = null;
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setColorMode(theme);
  };

  const showReportModal = ref(false);

  const handleReportProblem = () => {
    showReportModal.value = true;
  };

  const handleSubmitReport = (data: { description: string }) => {
    // Aquí iría la lógica para enviar el reporte al servidor
    console.log('Reporte enviado:', data.description);
    showReportModal.value = false;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-HN');
  };
</script>
