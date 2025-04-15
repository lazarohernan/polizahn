<!--
  ProfileNew.vue
  
  Componente de perfil de usuario rediseñado que permite visualizar y editar información personal.
  Integrado con Supabase para la gestión de datos y almacenamiento de avatares.
  
  Características:
  - Diseño responsivo usando Tailwind CSS
  - Soporte para tema oscuro/claro
  - Carga y edición de datos del perfil
  - Subida de avatar a Supabase Storage
  - Diseño de dos columnas para mejor organización
-->

<template>
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4 bg-background">
    <div class="w-full max-w-[1200px] mx-auto">
      <!-- Encabezado de página -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text">Mi Perfil</h1>
        <p class="text-text/60 mt-2">Administra tu información personal y preferencias</p>
      </div>
      
      <!-- Contenedor principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna izquierda: Avatar e información básica -->
        <div class="lg:col-span-1">
          <div class="bg-container-bg rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Sección de avatar -->
            <div class="p-6 flex flex-col items-center">
              <div class="relative group mb-4">
                <div class="w-[160px] h-[160px] relative">
                  <!-- Contenedor del avatar con overflow hidden -->
                  <div class="w-full h-full rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
                    <!-- Imagen o Placeholder con iniciales -->
                    <img
                      v-if="profileData.avatar_url && !avatarError" 
                      :src="profileData.avatar_url"
                      :alt="fullName || 'Perfil'"
                      class="w-full h-full object-cover transition-opacity duration-300"
                      :class="{ 'opacity-50': isUploadingAvatar }"
                      @error="handleImageError"
                      crossorigin="anonymous"
                      loading="eager"
                      referrerpolicy="no-referrer"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <span class="text-4xl font-bold text-gray-500 dark:text-gray-400">
                        {{ (profileData.firstName?.[0] || '') + (profileData.lastName?.[0] || '') }}
                      </span>
                    </div>
                    
                    <!-- Overlay de Carga -->
                    <div 
                      v-if="isUploadingAvatar" 
                      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                    >
                      <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Botón para cambiar/subir imagen (siempre visible) -->
                  <button
                    class="absolute bottom-0 right-0 p-2 bg-black/70 text-white rounded-full shadow-lg hover:bg-black/80 transform hover:scale-105 transition-all duration-200 z-50"
                    :title="profileData.avatar_url ? 'Cambiar imagen' : 'Subir imagen'"
                    @click.stop="showImageUploader = true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                </div>

                <!-- Badge de rol (movido debajo de la imagen) -->
                <div
                  class="flex justify-center mt-2"
                >
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-md"
                    :class="{
                      'bg-purple-600': profileData.role === 'superadmin',
                      'bg-primary': profileData.role === 'admin',
                      'bg-blue-500': profileData.role === 'tecnico',
                      'bg-emerald-500': profileData.role === 'agente',
                      'bg-gray-500': profileData.role === 'cliente',
                    }"
                  >
                    {{ getRoleText(profileData.role) }}
                  </span>
                </div>
                
                <!-- ImageUploader como modal -->
                <div 
                  v-if="showImageUploader"
                  class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] flex items-center justify-center"
                  @click.self="showImageUploader = false"
                >
                  <div class="bg-container-bg rounded-2xl p-4 max-w-md w-full shadow-xl">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-lg font-semibold text-text">{{ profileData.avatar_url ? 'Cambiar imagen' : 'Subir imagen' }}</h3>
                      <button
                        class="p-2 rounded-xl bg-input-bg border border-input-border text-text transition-all duration-300 hover:bg-container-bg"
                        @click="showImageUploader = false"
                      >
                        <X class="w-5 h-5" />
                      </button>
                    </div>
                    
                    <ImageUploader
                      :initial-image="profileData.avatar_url"
                      :aspect-ratio="1" 
                      :max-size="5 * 1024 * 1024" 
                      @update="handleImagePreview"
                      @save="handleAvatarUpdate"
                    />
                    
                    <!-- El botón Cancelar no es necesario aquí ya que ImageUploader ahora tiene su propio botón Guardar -->
                  </div>
                </div>
              </div>
              
              <h2 class="text-xl font-bold text-text">{{ fullName }}</h2>
              <p class="text-text/60 mb-4">{{ profileData.company }}</p>
              
              <div class="w-full flex justify-center">
                <button
                  v-if="!isEditing"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:shadow-md"
                  @click="isEditing = true"
                >
                  <Edit2 class="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
                <div v-else class="flex gap-3">
                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-text text-sm font-medium transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    @click="handleCancel"
                  >
                    <X class="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:shadow-md"
                    @click="handleSave"
                  >
                    <Save class="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Sección de tema -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-md font-semibold text-text mb-4">Preferencia de tema</h3>
              <div class="grid grid-cols-3 gap-2">
                <button
                  class="flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  :class="{ 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary': colorMode === 'light' }"
                  @click="handleThemeChange('light')"
                >
                  <Sun class="w-5 h-5 text-yellow-500 mb-1" />
                  <span class="text-xs font-medium text-text">Claro</span>
                </button>
                <button
                  class="flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  :class="{ 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary': colorMode === 'dark' }"
                  @click="handleThemeChange('dark')"
                >
                  <Moon class="w-5 h-5 text-indigo-400 mb-1" />
                  <span class="text-xs font-medium text-text">Oscuro</span>
                </button>
                <button
                  class="flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  :class="{ 'bg-gray-100 dark:bg-gray-800 ring-2 ring-primary': colorMode === 'system' }"
                  @click="handleThemeChange('system')"
                >
                  <Monitor class="w-5 h-5 text-gray-500 mb-1" />
                  <span class="text-xs font-medium text-text">Sistema</span>
                </button>
              </div>
            </div>
            
            <!-- Sección de ayuda -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-md font-semibold text-text mb-4">Soporte</h3>
              <div class="space-y-2">
                <button
                  class="w-full flex items-center gap-3 p-3 rounded-lg text-left text-text transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HelpCircle class="w-5 h-5 text-primary/70" />
                  <span class="text-sm">Centro de Ayuda</span>
                </button>
                <button
                  class="w-full flex items-center gap-3 p-3 rounded-lg text-left text-text transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FileText class="w-5 h-5 text-primary/70" />
                  <span class="text-sm">Documentación</span>
                </button>
                <button
                  class="w-full flex items-center gap-3 p-3 rounded-lg text-left text-text transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  @click="handleReportProblem"
                >
                  <AlertCircle class="w-5 h-5 text-primary/70" />
                  <span class="text-sm">Reportar Problema</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Columna derecha: Información detallada -->
        <div class="lg:col-span-2">
          <div class="bg-container-bg rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Sección de información personal -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-text mb-6 flex items-center">
                <User class="w-5 h-5 text-primary mr-2" />
                Información Personal
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nombre -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Nombre</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.firstName || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.firstName"
                      type="text"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese su nombre"
                    />
                  </div>
                </div>
                
                <!-- Apellido -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Apellido</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.lastName || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.lastName"
                      type="text"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese su apellido"
                    />
                  </div>
                </div>
                
                <!-- Fecha de Nacimiento -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Fecha de Nacimiento</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ formatDate(profileData.birthDate || '') || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.birthDate"
                      type="date"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <!-- Email -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Correo Electrónico</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.email || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.email"
                      type="email"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese su correo"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sección de información de contacto -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-text mb-6 flex items-center">
                <Phone class="w-5 h-5 text-primary mr-2" />
                Información de Contacto
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Teléfono -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Teléfono</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.phone || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.phone"
                      type="tel"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese su teléfono"
                    />
                  </div>
                </div>
                
                <!-- Dirección -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-text/70">Dirección</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.address || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.address"
                      type="text"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese su dirección"
                    />
                  </div>
                </div>
                
                <!-- Empresa -->
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-medium text-text/70">Empresa</label>
                  <div v-if="!isEditing" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="text-text">{{ profileData.company || 'No especificado' }}</p>
                  </div>
                  <div v-else>
                    <input
                      v-model="profileData.company"
                      type="text"
                      class="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-background text-text text-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ingrese el nombre de su empresa"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sección de actividad reciente -->
            <div class="p-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-text mb-6 flex items-center">
                <Clock class="w-5 h-5 text-primary mr-2" />
                Actividad Reciente
              </h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <LogIn class="w-4 h-4 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div>
                    <p class="text-sm text-text">Último inicio de sesión</p>
                    <p class="text-xs text-text/60">{{ formatDate(new Date().toISOString()) }}</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Edit3 class="w-4 h-4 text-green-500 dark:text-green-300" />
                  </div>
                  <div>
                    <p class="text-sm text-text">Última actualización de perfil</p>
                    <p class="text-xs text-text/60">{{ formatDate(new Date().toISOString()) }}</p>
                  </div>
                </div>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/stores/auth.store';
  import { supabase } from '@/lib/supabase';
  import ReportProblemModal from '@/components/ReportProblemModal.vue';
  import ImageUploader from '@/modules/admin/components/ImageUploader.vue';
  import { useAvatarStorage } from '@/composables/useAvatarStorage';
  import { useColorMode } from '@/composables/useColorMode';

  import {
    Phone,
    User,
    Edit2,
    Edit3,
    Save,
    X,
    Sun,
    Moon,
    Monitor,
    HelpCircle,
    FileText,
    AlertCircle,
    Clock,
    LogIn
  } from 'lucide-vue-next';

  const toast = useToast();
  const authStore = useAuthStore();
  const { colorMode, setColorMode } = useColorMode();
  const showReportModal = ref(false);

  interface ProfileData {
    firstName: string;
    lastName: string;
    role: 'superadmin' | 'admin' | 'tecnico' | 'agente' | 'cliente';
    email: string;
    phone: string;
    address: string;
    company: string;
    birthDate?: string;
    avatar_url?: string;
  }

  const isEditing = ref(false);
  const showImageUploader = ref(false);
  const { uploadAvatar, deleteOldAvatar, loading: isUploadingAvatar } = useAvatarStorage();
  const avatarError = ref(false);

  const profileData = ref<ProfileData>({
    firstName: '',
    lastName: '',
    role: 'admin',
    email: '',
    phone: '',
    address: '',
    company: '',
    birthDate: '',
    avatar_url: '',
  });

  const originalProfileData = ref<ProfileData | null>(null);

  const fullName = computed(() => `${profileData.value.firstName} ${profileData.value.lastName}`);

  const loadProfileData = async () => {
    try {
      if (!authStore.user) return;

      const { data, error } = await supabase
        .from('usuarios_corredurias')
        .select(`
          *,
          corredurias:id_correduria (nombre, direccion, tel)
        `)
        .eq('auth_user_id', authStore.user.id)
        .eq('estado', true)
        .single();

      if (error) throw error;

      if (data) {
        const userData = await supabase.auth.getUser();
        const userMetadata = userData.data.user?.user_metadata;

        // Intentar cargar avatar desde la tabla perfiles (fuente principal)
        try {
          const { data: perfilData, error: perfilError } = await supabase
            .from('perfiles')
            .select('avatar_url')
            .eq('auth_user_id', authStore.user.id)
            .single();
          
          if (!perfilError && perfilData?.avatar_url) {
            console.log('Avatar cargado desde perfiles:', perfilData.avatar_url);
            updateAvatarDisplay(perfilData.avatar_url);
          } else if (userMetadata?.avatar_url) {
            // Fallback: si no hay en perfiles, usar el de Auth metadata
            console.log('Avatar cargado desde Auth metadata:', userMetadata.avatar_url);
            updateAvatarDisplay(userMetadata.avatar_url);
            
            // Sincronizar el avatar desde Auth a la tabla perfiles
            try {
              const { data: existingPerfil } = await supabase
                .from('perfiles')
                .select('id_perfil')
                .eq('auth_user_id', authStore.user.id)
                .maybeSingle();
                
              if (existingPerfil) {
                console.log('Actualizando avatar en perfil existente (desde Auth metadata)');
                await supabase
                  .from('perfiles')
                  .update({ avatar_url: userMetadata.avatar_url })
                  .eq('id_perfil', existingPerfil.id_perfil);
              } else {
                console.log('Creando nuevo perfil con avatar (desde Auth metadata)');
                await supabase
                  .from('perfiles')
                  .insert({
                    auth_user_id: authStore.user.id,
                    nombre: userMetadata?.first_name || '',
                    apellido: userMetadata?.last_name || '',
                    correo: authStore.user.email || '',
                    avatar_url: userMetadata.avatar_url
                  });
              }
            } catch (syncError) {
              console.error('Error al sincronizar avatar de Auth metadata a perfiles:', syncError);
            }
          } else {
            console.log('No se encontró avatar ni en perfiles ni en Auth metadata');
          }
        } catch (e) {
          console.error('Error al cargar avatar desde perfiles:', e);
          // Si falla, intentar usar el de Auth metadata como respaldo
          if (userMetadata?.avatar_url) {
            updateAvatarDisplay(userMetadata.avatar_url);
          }
        }

        // Mapear el id_rol al nombre del rol correspondiente
        let userRole: 'superadmin' | 'admin' | 'tecnico' | 'agente' | 'cliente' = 'cliente';
        switch (data.id_rol) {
          case 1:
            userRole = 'superadmin';
            break;
          case 2:
            userRole = 'admin';
            break;
          case 3:
            userRole = 'tecnico';
            break;
          case 4:
            userRole = 'agente';
            break;
          case 5:
            userRole = 'cliente';
            break;
        }

        profileData.value = {
          firstName: userMetadata?.first_name || '',
          lastName: userMetadata?.last_name || '',
          role: userRole,
          email: authStore.user.email || '',
          phone: data.corredurias?.tel || '',
          address: data.corredurias?.direccion || '',
          company: data.corredurias?.nombre || '',
          birthDate: userMetadata?.birthDate || '',
        };
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      toast.error('Error al cargar los datos del perfil');
    }
  };

  const handleSave = async () => {
    try {
      if (!authStore.user) {
        toast.error('No se encontró usuario autenticado');
        return;
      }

      // Actualizar metadatos del usuario en Auth
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.value.firstName,
          last_name: profileData.value.lastName,
          birthDate: profileData.value.birthDate,
        }
      });

      if (metadataError) throw metadataError;
      
      // No necesitamos actualizar la tabla usuarios_corredurias ya que no contiene
      // los campos de perfil personal (nombre, apellido, email, etc.)
      // Estos datos se mantienen en los metadatos de Auth, que ya actualizamos arriba

      // Actualizar datos de la correduría si es necesario
      if (authStore.id_correduria) {
        const { error: correduriasError } = await supabase
          .from('corredurias')
          .update({
            tel: profileData.value.phone,
            direccion: profileData.value.address,
            nombre: profileData.value.company,
          })
          .eq('id_correduria', authStore.id_correduria);

        if (correduriasError) throw correduriasError;
      }

      isEditing.value = false;
      toast.success('Cambios guardados correctamente');
      
      // Recargar los datos para asegurar consistencia
      await loadProfileData();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      toast.error('Error al guardar los cambios: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleCancel = () => {
    isEditing.value = false;
    loadProfileData(); // Recargar datos originales
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setColorMode(theme);
  };

  // Manejar la vista previa de imagen (no guarda nada en el servidor)
  const handleImagePreview = (_imageData: { url: string; dominantColor: string | null }) => {
    console.log('Vista previa de imagen actualizada');
    // No hacemos nada aquí porque el ImageUploader ya muestra la vista previa internamente
  };

  const handleAvatarUpdate = async ({ url: dataUrl }: { url: string; dominantColor: string | null }) => {
    if (!dataUrl) {
      console.log('No se proporcionó dataUrl desde ImageUploader');
      return;
    }
    if (!authStore.user) {
      toast.error('Usuario no autenticado');
      return;
    }

    const userId = authStore.user.id;
    const oldAvatarUrl = profileData.value.avatar_url; // Guardar URL antigua ANTES de subir la nueva

    try {
      // 1. Subir el nuevo avatar usando el composable
      const { url: newPublicUrl, error: uploadErr } = await uploadAvatar(dataUrl, userId);

      if (uploadErr || !newPublicUrl) {
        throw new Error(uploadErr || 'No se pudo obtener la URL pública después de la subida.');
      }
      
      // Añadir timestamp para evitar caché (el composable ya lo hace)
      const finalAvatarUrl = newPublicUrl;
      console.log('Avatar subido, URL pública:', finalAvatarUrl);
      
      // 2. Actualizar Supabase Auth metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: finalAvatarUrl }
      });
      if (updateAuthError) {
        throw new Error(`Error al actualizar metadatos de Auth: ${updateAuthError.message}`);
      }
      
      // 3. Actualizar tabla 'perfiles' (Usando upsert para crear si no existe)
      const { error: upsertProfileError } = await supabase
        .from('perfiles')
        .upsert({
          auth_user_id: userId,
          nombre: profileData.value.firstName, // Asegúrate que estos datos estén disponibles
          apellido: profileData.value.lastName,
          correo: profileData.value.email,
          avatar_url: finalAvatarUrl,
        }, { onConflict: 'auth_user_id' });

      if (upsertProfileError) {
        // Si el upsert falla por otra razón que no sea el perfil ya existe
        console.error('Error al hacer upsert en perfiles:', upsertProfileError);
        // Considera si quieres lanzar un error o solo loggearlo
        toast.error(`Error al guardar URL en perfil: ${upsertProfileError.message}`);
        // Podríamos intentar revertir la subida aquí si es crítico
      }

      // 4. Actualizar estado local
      profileData.value.avatar_url = finalAvatarUrl;
      originalProfileData.value = { ...profileData.value }; // Actualizar original para evitar 'cambios pendientes'

      // Actualizar la visualización inmediatamente
      updateAvatarDisplay(finalAvatarUrl);

      toast.success('Avatar actualizado con éxito');

      // 5. Eliminar avatar antiguo (SOLO después de que todo lo demás fue exitoso)
      if (oldAvatarUrl) {
        const deleted = await deleteOldAvatar(oldAvatarUrl);
        if (!deleted) {
          console.warn('No se pudo eliminar el avatar antiguo:', oldAvatarUrl);
          // Opcional: Mostrar una advertencia no bloqueante al usuario
        }
      }
      
      // 6. Cerrar el modal de subida de imagen
      showImageUploader.value = false;
      
    } catch (err: Error | unknown) {
      console.error('Error en handleAvatarUpdate:', err);
      avatarError.value = true; // Marcar como error (type: boolean)
      toast.error(err instanceof Error ? err.message : 'Ocurrió un error al actualizar el avatar.');
      // Considerar revertir cambios si es posible/necesario
    }
  };

  const handleReportProblem = () => {
    showReportModal.value = true;
  };

  const handleSubmitReport = async () => {
    // TODO: Implementar envío de reporte
    showReportModal.value = false;
    toast.success('Reporte enviado correctamente');
  };

  const getRoleText = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'superadmin':
        return 'Superadmin';
      case 'tecnico':
        return 'Técnico';
      case 'agente':
        return 'Agente';
      case 'cliente':
        return 'Cliente';
      default:
        return role;
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-HN');
  };

  // Función mejorada para actualizar la URL del avatar con manejo de errores
  const updateAvatarDisplay = (avatarUrl: string) => {
    if (!avatarUrl) {
      console.warn('URL de avatar vacía o inválida');
      profileData.value.avatar_url = '';
      avatarError.value = false; // No es un error, simplemente no hay imagen
      return;
    }
    
    // Resetear el estado de error al intentar actualizar
    avatarError.value = false;
    
    // Limpiar la URL (quitar parámetros existentes que pueden causar problemas)
    const baseUrl = avatarUrl.split('?')[0];
    
    console.log('Actualizando avatar con URL:', baseUrl);
    
    // Verificar la imagen antes de actualizar el estado
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Importante para CORS
    
    img.onload = () => {
      console.log('Avatar verificado y cargado correctamente');
      // Solo actualizar el estado cuando la imagen se carga correctamente
      profileData.value.avatar_url = baseUrl;
      avatarError.value = false;
      
      // Guardar en localStorage para persistencia entre sesiones
      try {
        localStorage.setItem('user_avatar', baseUrl);
      } catch (e) {
        console.warn('No se pudo guardar avatar en localStorage:', e);
      }
    };
    
    img.onerror = () => {
      console.error('Error cargando imagen:', baseUrl);
      avatarError.value = true; // Marcar como error para mostrar iniciales
      profileData.value.avatar_url = ''; // Limpiar URL para forzar mostrar iniciales
    };
    
    // Iniciar la carga
    img.src = baseUrl;
  };
  
  // Manejador de errores para la etiqueta img en el template
  const handleImageError = (event: Event) => {
    console.error('Error al cargar imagen de perfil en el DOM');
    const imgElement = event.target as HTMLImageElement;
    
    // Extraer URL base sin parámetros
    const currentSrc = imgElement.src;
    const baseUrl = currentSrc.split('?')[0];
    
    if (currentSrc !== baseUrl) {
      console.log('Reintentando imagen con URL base:', baseUrl);
      // Reemplazar la URL en el DOM directamente
      imgElement.src = baseUrl;
    } else {
      // Si ya estamos usando la URL base y sigue fallando,
      // activar el estado de error y mostrar iniciales
      console.error('Fallo persistente cargando imagen, mostrando iniciales');
      avatarError.value = true;
      profileData.value.avatar_url = '';
    }
  };

  // Cargar datos al montar el componente
  onMounted(() => {
    loadProfileData();
    
    // Añadir listener para evento de avatar actualizado
    window.addEventListener('avatar-updated', (event: Event) => {
      // Extraer URL del evento personalizado si está disponible
      const customEvent = event as CustomEvent<{ avatarUrl: string }>;
      if (customEvent.detail?.avatarUrl) {
        console.log('Evento avatar-updated recibido con URL:', customEvent.detail.avatarUrl);
        // Actualizar directamente con la URL del evento
        updateAvatarDisplay(customEvent.detail.avatarUrl);
      } else {
        // Si no hay URL en el evento, recargar datos
        loadProfileData();
      }
      
      // Cerrar el modal
      showImageUploader.value = false;
    });
    
    // Intentar recuperar avatar guardado en localStorage
    try {
      const savedAvatar = localStorage.getItem('user_avatar');
      if (savedAvatar && (!profileData.value.avatar_url || profileData.value.avatar_url === '')) {
        console.log('Recuperando avatar guardado de localStorage');
        profileData.value.avatar_url = savedAvatar;
      }
    } catch (e) {
      console.warn('Error accediendo a localStorage:', e);
    }
  });
  
  // Limpiar listeners al desmontar
  onUnmounted(() => {
    window.removeEventListener('avatar-updated', () => {});
  });
</script>
