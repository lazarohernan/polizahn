<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div
      class="w-full max-w-[1200px] mx-auto px-4 bg-container-bg border border-container-border rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
    >
      <!-- Encabezado y acciones -->
      <div class="mb-8 p-6">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Notificaciones</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar v-model="searchQuery" placeholder="Buscar notificaciones..." />
            </div>
            <div class="flex items-center gap-4">
              <button
                class="p-2.5 rounded-lg bg-[#1a84ef] text-white border-none transition-all duration-300 hover:bg-[#1a84ef]/90"
                title="Marcar todas como leídas"
                @click="markAllAsRead"
              >
                <CheckCheck class="w-4 h-4" />
              </button>
              <div class="flex items-center gap-2 text-sm text-text/70">
                <span>{{ notificationStats.unread }} sin leer</span>
                <span class="text-text/30">•</span>
                <span>{{ notificationStats.read }} leídas</span>
              </div>
            </div>
          </div>

          <!-- Acciones de filtro y filtros -->
          <div class="flex items-center gap-2">
            <!-- Botón eliminar todas -->
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-input-border/50 text-sm font-medium text-text transition-colors duration-300 hover:border-red-500 hover:text-red-500 whitespace-nowrap"
              @click="notifications = []"
            >
              <X class="w-4 h-4" />
              <span>Eliminar todas</span>
            </button>

            <!-- Menú de filtros -->
            <div class="relative">
              <button
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-input-bg border border-input-border text-sm font-medium text-text transition-colors duration-300 hover:bg-[#1a84ef] hover:text-white hover:border-[#1a84ef] whitespace-nowrap"
                @click="showFilters = !showFilters"
              >
                <Filter class="w-5 h-5" />
                <span>{{
                  activeFilter === 'all' ? 'Filtrar' : getNotificationTypeText(activeFilter)
                }}</span>
              </button>

              <!-- Lista de filtros -->
              <div
                v-if="showFilters"
                class="absolute right-0 top-full mt-2 w-64 bg-background border border-container-border rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden z-20"
              >
                <div class="p-2">
                  <button
                    class="w-full px-3 py-2 text-sm text-left rounded-lg transition-colors duration-300 hover:bg-[#1a84ef]/10 hover:text-[#1a84ef]"
                    :class="{ 'bg-[#1a84ef]/10 text-[#1a84ef]': activeFilter === 'all' }"
                    @click="
                      activeFilter = 'all';
                      showFilters = false;
                    "
                  >
                    Todas las notificaciones
                  </button>
                  <button
                    v-for="filter in filters"
                    :key="filter"
                    class="w-full px-3 py-2 text-sm text-left rounded-lg transition-colors duration-300 hover:bg-[#1a84ef]/10 hover:text-[#1a84ef]"
                    :class="{ 'bg-[#1a84ef]/10 text-[#1a84ef]': activeFilter === filter }"
                    @click="
                      activeFilter = filter;
                      showFilters = false;
                    "
                  >
                    {{ getNotificationTypeText(filter) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado sin notificaciones -->
      <div v-if="notifications.length === 0" class="p-12">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-[#1a84ef]/10">
            <Bell class="w-12 h-12 text-[#1a84ef]" />
          </div>
          <h3 class="text-xl font-medium text-text">No hay notificaciones</h3>
          <p class="text-text/70 text-center max-w-md">
            No tienes notificaciones pendientes en este momento.
          </p>
        </div>
      </div>

      <!-- Estado sin resultados de búsqueda -->
      <div v-else-if="searchQuery && filteredNotifications.length === 0" class="p-12">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="p-4 rounded-full bg-[#1a84ef]/10">
            <Search class="w-12 h-12 text-[#1a84ef]" />
          </div>
          <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
          <p class="text-text/70 text-center max-w-md">
            No se encontraron notificaciones que coincidan con tu búsqueda.
          </p>
        </div>
      </div>

      <!-- Lista de notificaciones -->
      <div v-else class="space-y-4 p-6">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="group relative bg-container-bg border border-container-border rounded-xl p-4 transition-all duration-300 hover:border-[#1a84ef] cursor-pointer"
          :class="{
            'bg-opacity-50': notification.read,
            'border-[#1a84ef]': expandedNotifications.includes(notification.id),
          }"
          @click="toggleExpansion(notification.id)"
        >
          <div class="flex items-start gap-4" @click.stop>
            <!-- Ícono -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="getNotificationColor(notification.type)"
            >
              <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <span
                  class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getNotificationColor(notification.type)"
                >
                  {{ getNotificationTypeText(notification.type) }}
                </span>
                <span class="text-xs text-text/50">
                  {{ formatRelativeDate(notification.date) }}
                </span>
              </div>
              <h4 class="text-base font-medium text-text mb-1">{{ notification.title }}</h4>
              <p class="text-sm text-text/70">
                {{ notification.message }}
                <template v-if="expandedNotifications.includes(notification.id)">
                  <br /><br />
                  <span class="font-medium text-text">Detalles adicionales:</span><br />
                  <span v-if="notification.metadata?.dueDate"
                    >Fecha de vencimiento:
                    {{ new Date(notification.metadata.dueDate).toLocaleDateString('es-HN') }}</span
                  >
                  <span v-if="notification.metadata?.amount"
                    >Monto: L. {{ notification.metadata.amount.toLocaleString() }}</span
                  >
                </template>
              </p>
            </div>

            <!-- Acciones -->
            <div class="flex items-center gap-2">
              <button
                v-if="!notification.read"
                class="p-2 rounded-lg border border-input-border bg-background text-text transition-colors duration-300 hover:bg-[#34be05] hover:text-white hover:border-[#34be05]"
                title="Marcar como leída"
                @click.stop="markAsRead(notification)"
              >
                <CheckCheck class="w-4 h-4" />
              </button>
              <button
                class="p-2 rounded-lg bg-white border border-input-border text-text transition-colors duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
                title="Eliminar notificación"
                @click.stop="removeNotification(notification.id)"
              >
                <X class="w-4 h-4 text-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Bell, Search, Filter, CheckCheck, X } from 'lucide-vue-next';
  import SearchBar from '@/modules/common/components/SearchBar.vue';
  import { useSearch } from '@/composables/useSearch';
  import type { Notification, NotificationType } from '@/types';

  // Datos de ejemplo de notificaciones
  const notifications = ref<Notification[]>([
    {
      id: 1,
      type: 'policy_expiring',
      title: 'Póliza próxima a vencer',
      message: 'La póliza #AUTO-2024-001 vencerá en 15 días',
      date: '2024-02-15T10:30:00',
      read: false,
      link: '/polizas/AUTO-2024-001',
      metadata: {
        policyId: 1,
        clientId: 1,
        dueDate: '2024-03-01',
      },
    },
    {
      id: 2,
      type: 'payment_due',
      title: 'Pago pendiente',
      message: 'Pago pendiente de L. 1,500 para la póliza #LIFE-2024-001',
      date: '2024-02-14T15:45:00',
      read: true,
      link: '/polizas/LIFE-2024-001/pagos',
      metadata: {
        policyId: 2,
        clientId: 1,
        paymentId: 1,
        amount: 1500,
        dueDate: '2024-02-28',
      },
    },
    {
      id: 3,
      type: 'client_updated',
      title: 'Información de cliente actualizada',
      message: 'Se actualizó la información de contacto del cliente Juan Pérez',
      date: '2024-02-13T09:15:00',
      read: false,
      link: '/clientes/1',
      metadata: {
        clientId: 1,
      },
    },
  ]);

  // Filtros disponibles
  const filters = ref<NotificationType[]>([
    'policy_expiring',
    'policy_expired',
    'payment_due',
    'payment_overdue',
    'client_updated',
    'policy_created',
    'policy_updated',
    'payment_received',
    'system_update',
  ]);

  // Estado del menú de filtros
  const showFilters = ref(false);

  // Filtro activo
  const activeFilter = ref<NotificationType | 'all'>('all');

  // Búsqueda y filtrado
  const { searchQuery, filteredItems } = useSearch(notifications.value, ['title', 'message']);

  // Estadísticas de notificaciones
  const notificationStats = computed(() => {
    const total = notifications.value.length;
    const unread = notifications.value.filter((n) => !n.read).length;
    const read = total - unread;
    return { total, unread, read };
  });

  // Watcher para mantener solo las últimas 20 notificaciones
  watch(
    notifications,
    (newNotifications: Notification[]) => {
      if (newNotifications.length > 20) {
        notifications.value = newNotifications.slice(-20);
      }
    },
    { immediate: true },
  );

  // Notificaciones filtradas por tipo y búsqueda
  const filteredNotifications = computed(() => {
    let filtered = filteredItems.value;
    if (activeFilter.value !== 'all') {
      filtered = filtered.filter((n) => n.type === activeFilter.value);
    }
    return filtered;
  });

  // Formatear fecha relativa
  const formatRelativeDate = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }
  };

  // Obtener ícono según tipo de notificación
  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      policy_expiring: Bell,
      policy_expired: Bell,
      payment_due: Bell,
      payment_overdue: Bell,
      client_updated: Bell,
      policy_created: Bell,
      policy_updated: Bell,
      payment_received: Bell,
      system_update: Bell,
    };
    return icons[type];
  };

  // Obtener color según tipo de notificación
  // Obtener color según tipo de notificación
  const getNotificationColor = (type: NotificationType) => {
    const colors = {
      policy_expiring: 'bg-[#ffc94a]/10 text-text',
      policy_expired: 'bg-[#ffc94a]/10 text-text',
      payment_due: 'bg-[#ffc94a]/10 text-text',
      payment_overdue: 'bg-[#ffc94a]/10 text-text',
      client_updated: 'bg-[#1a84ef]/10 text-text',
      policy_created: 'bg-[#34be05]/10 text-text',
      policy_updated: 'bg-[#1a84ef]/10 text-text',
      payment_received: 'bg-[#34be05]/10 text-text',
      system_update: 'bg-[#1a84ef]/10 text-text',
    };
    return colors[type];
  };

  // Obtener texto del tipo de notificación
  const getNotificationTypeText = (type: NotificationType) => {
    const texts = {
      policy_expiring: 'Póliza por vencer',
      policy_expired: 'Póliza vencida',
      payment_due: 'Pago pendiente',
      payment_overdue: 'Pago vencido',
      client_updated: 'Cliente actualizado',
      policy_created: 'Nueva póliza',
      policy_updated: 'Póliza actualizada',
      payment_received: 'Pago recibido',
      system_update: 'Actualización',
    };
    return texts[type];
  };

  // Marcar notificación como leída
  const markAsRead = (notification: Notification) => {
    notification.read = true;
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true));
  };

  // Estado de expansión de notificaciones
  const expandedNotifications = ref<number[]>([]);

  // Alternar expansión de notificación
  const toggleExpansion = (id: number) => {
    const index = expandedNotifications.value.indexOf(id);
    if (index === -1) {
      expandedNotifications.value.push(id);
    } else {
      expandedNotifications.value.splice(index, 1);
    }
  };

  // Eliminar notificación
  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
      // Remover de expandidos si estaba expandido
      const expandedIndex = expandedNotifications.value.indexOf(id);
      if (expandedIndex !== -1) {
        expandedNotifications.value.splice(expandedIndex, 1);
      }
    }
  };
</script>
