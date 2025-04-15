<template>
  <!-- Barra de navegación principal para corredores -->
  <nav
    class="fixed top-0 left-0 w-full bg-[#1E4D64] dark:bg-[#0B1218] backdrop-blur-lg saturate-[1.8] shadow-navbar z-[200] transition-colors duration-300 rounded-b-2xl"
  >
    <div class="max-w-[1440px] mx-auto px-8 sm:px-4 py-3 flex justify-between items-center">
      <div class="flex items-center">
        <RouterLink
          to="/admin/dashboard"
          class="text-xl sm:text-base font-semibold text-text-inverse no-underline transition-colors duration-300 hover:text-primary"
        >
          Plataforma Seguros
        </RouterLink>
      </div>
      <div class="flex items-center gap-4">
        <!-- Sección de notificaciones con contexto de apilamiento propio -->
        <div class="relative z-[200]">
          <button
            class="relative p-2 rounded-lg border-none bg-transparent text-white dark:text-gray-100 cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-white/10 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 dark:focus:ring-white/10 notification-btn"
            title="Notificaciones"
            @click.stop="toggleNotifications"
          >
            <Bell class="w-5 h-5 sm:w-4.5 sm:h-4.5 text-current" />
            <span
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1"
              >3</span
            >
          </button>

          <NotificationsPopover v-if="showNotifications" />
        </div>

        <!-- Selector de tema -->
        <div class="flex items-center p-1">
          <ThemeToggle variant="navbar" />
        </div>
        <!-- Sección de perfil -->
        <div class="relative z-[200] profile-section">
          <div
            class="relative p-0.5 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none"
            role="button"
            tabindex="0"
            @click.stop="toggleProfileMenu"
          >
            <img
              :src="authStore.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName())}&background=8CBFCF&color=fff`"
              alt="Avatar"
              class="w-9 h-9 sm:w-8 sm:h-8 rounded-full object-cover"
            />
            <div
              class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-navbar"
            ></div>
          </div>

          <!-- Menú desplegable del perfil -->
          <div
            v-if="showProfileMenu"
            class="absolute top-[calc(100%+0.75rem)] right-0 w-[280px] sm:w-[250px] rounded-xl bg-background border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden z-[9999]"
            @click.stop
          >
            <!-- Encabezado del perfil -->
            <div class="p-5 flex items-center gap-4 border-b border-container-border mb-2">
              <img
                :src="authStore.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getFullName())}&background=8CBFCF&color=fff`"
                alt="Avatar"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <h3 class="m-0 text-base font-semibold text-text">{{ getFullName() }}</h3>
                <p class="m-0 text-sm text-text/70 truncate">{{ authStore.user?.email }}</p>
              </div>
            </div>

            <!-- Elementos del menú -->
            <div class="p-2">
              <RouterLink
                to="/admin/perfil"
                class="flex items-center gap-3 p-3 text-sm text-text no-underline transition-all duration-200 rounded-lg hover:bg-input-bg hover:text-primary"
              >
                <User
                  class="w-5 h-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span>Mi Perfil</span>
              </RouterLink>
              <RouterLink
                to="/admin/roles"
                class="flex items-center gap-3 p-3 text-sm text-text no-underline transition-all duration-200 rounded-lg hover:bg-input-bg hover:text-primary"
              >
                <Settings
                  class="w-5 h-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span>Gestionar Roles</span>
              </RouterLink>
              <button
                class="w-full flex items-center gap-3 p-3 text-sm text-text bg-transparent border-none cursor-pointer transition-all duration-200 rounded-lg hover:bg-input-bg hover:text-primary"
                @click="handleLogout"
              >
                <LogOut
                  class="w-5 h-5 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import { Bell, User, Settings, LogOut } from 'lucide-vue-next';
  import ThemeToggle from '../../common/components/ThemeToggle.vue';
  import NotificationsPopover from './NotificationsPopover.vue';
  import { useAuthStore } from '@/modules/auth/stores/auth-store';
  import { storeToRefs } from 'pinia';

  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const router = useRouter();

  const getFullName = () => {
    const metadata = user.value?.user_metadata;
    if (metadata?.firstName && metadata?.lastName) {
      return `${metadata.firstName} ${metadata.lastName}`;
    }
    return user.value?.email?.split('@')[0] || 'Usuario';
  };

  const showProfileMenu = ref(false);
  const showNotifications = ref(false);

  const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
    if (showNotifications.value) showNotifications.value = false;
  };

  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    if (showProfileMenu.value) showProfileMenu.value = false;
  };

  const handleAvatarUpdateEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ avatarUrl: string }>;
    if (customEvent.detail?.avatarUrl) {
      console.log('NavBar: Evento avatar-updated recibido, actualizando store...');
      authStore.updateAvatarUrl(customEvent.detail.avatarUrl);
    }
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', closeMenus);
      window.addEventListener('avatar-updated', handleAvatarUpdateEvent);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', closeMenus);
      window.removeEventListener('avatar-updated', handleAvatarUpdateEvent);
    }
  });

  const closeMenus = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-section') && !target.closest('.notification-btn')) {
      showProfileMenu.value = false;
      showNotifications.value = false;
    }
  };

  const handleLogout = async () => {
    try {
      const success = await authStore.logout();
      if (success) {
        router.replace({ name: 'login' });
      } else {
        console.error('Error durante el cierre de sesión');
      }
    } catch (error) {
      console.error('Error inesperado durante el cierre de sesión:', error);
    }
  };
</script>
