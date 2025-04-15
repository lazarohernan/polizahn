<!--
  NotificationsPopover.vue
  
  Componente para mostrar notificaciones en un popover.
  Características:
  - Muestra notificaciones de pólizas, renovaciones y sistema
  - Soporta estados de leído/no leído
  - Diseño responsivo para móvil/escritorio
  - Interacciones con animaciones suaves
  - Aparece por encima de todos los elementos (z-index: 9999)
-->

<template>
  <!-- Contenedor principal del popover con efecto de cristal -->
  <div
    class="absolute top-[calc(100%+1rem)] right-0 w-[380px] max-h-[480px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col z-[9999] isolate"
  >
    <!-- Flecha del popover -->
    <div
      class="absolute -top-1.5 right-6 w-3 h-3 bg-background border-l border-t border-container-border rotate-45"
    ></div>

    <!-- Encabezado -->
    <div class="p-4 border-b border-container-border">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Bell class="w-4 h-4 text-white" />
        </div>
        <h2 class="text-lg font-semibold text-text m-0">Notificaciones</h2>
      </div>
    </div>

    <!-- Contenido principal con scroll -->
    <div class="flex-1 overflow-y-auto p-3 max-h-[360px] sm:max-h-[calc(80vh-130px)]">
      <!-- Estado vacío -->
      <div v-if="notifications.length === 0" class="p-8 text-center text-text opacity-70">
        <Bell class="w-8 h-8 mx-auto mb-4" />
        <p class="m-0">No hay notificaciones nuevas</p>
      </div>

      <!-- Lista de notificaciones -->
      <div v-else class="flex flex-col gap-2">
        <!-- Elemento de notificación individual -->
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-3 rounded-lg bg-input-bg border border-input-border cursor-pointer transition-colors duration-300 flex items-start gap-3 hover:bg-container-bg"
          :class="{ 'bg-background border-primary': !notification.read }"
          @click="viewNotification(notification)"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="getNotificationColor(notification.type)"
          >
            <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getNotificationColor(notification.type)"
                >
                  {{ getNotificationTypeText(notification.type) }}
                </span>
                <span class="text-xs text-text/50">{{ formatDate(notification.date) }}</span>
              </div>
              <h3 class="m-0 text-sm font-semibold text-text">{{ notification.title }}</h3>
            </div>
            <p class="m-0 text-[13px] text-text/80 leading-relaxed">{{ notification.message }}</p>
          </div>
          <ArrowRight class="w-4 h-4 text-text/50 mt-1" />
        </div>
      </div>
    </div>

    <!-- Pie del popover con acciones -->
    <div class="p-3 border-t border-container-border flex items-center justify-between">
      <button
        class="p-2 rounded-lg bg-input-bg border border-input-border text-text cursor-pointer transition-colors duration-300 hover:bg-primary hover:text-white hover:border-primary"
        title="Marcar todas como leídas"
        @click="markAllAsRead"
      >
        <CheckCheck class="w-4 h-4" />
      </button>
      <router-link
        to="/notificaciones"
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary border-none text-white cursor-pointer transition-colors duration-300 hover:bg-primary-hover"
      >
        <span class="text-sm font-medium">Ver todas</span>
        <ArrowRight class="w-4 h-4" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Bell, Clock, ArrowRight, CheckCheck } from 'lucide-vue-next';
  import type { Notification, NotificationType } from '@/types';

  const router = useRouter();

  // Estado inicial de notificaciones (mock data)
  const notifications = ref<Notification[]>([
    {
      id: 1,
      type: 'policy_created',
      title: 'Nueva Póliza Aprobada',
      message: 'La póliza #AUTO-2024-001 ha sido aprobada exitosamente.',
      date: '2024-02-20T10:30:00',
      read: false,
    },
    {
      id: 2,
      type: 'policy_expiring',
      title: 'Renovación Próxima',
      message: 'La póliza de Juan Pérez vence en 7 días.',
      date: '2024-02-19T15:45:00',
      read: false,
    },
    {
      id: 3,
      type: 'system_update',
      title: 'Actualización del Sistema',
      message: 'Se han agregado nuevas funcionalidades a la plataforma.',
      date: '2024-02-18T09:15:00',
      read: true,
    },
  ]);

  // Formatea la fecha de la notificación al formato local
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-HN', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Marca una notificación como leída por su ID
  const markAsRead = (id: number) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };

  // Navega a la página de notificaciones
  const viewNotification = (notification: Notification) => {
    markAsRead(notification.id);
    router.push('/notificaciones');
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

  // Retorna el icono correspondiente según el tipo de notificación
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
      system_update: Clock,
    };
    return icons[type] || Bell;
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

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    notifications.value.forEach((n) => (n.read = true));
  };
</script>
