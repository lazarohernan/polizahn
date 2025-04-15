<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1200px] mx-auto">
      <!-- Cabecera con acciones -->
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-text">Dashboard</h1>
        
        <div class="flex items-center gap-3">
          <!-- Botón de exportar, solo para admin y superadmin -->
          <PermissionWrapper role="admin">
            <button 
              class="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
              @click="exportDashboardData"
            >
              <FileText class="w-4 h-4" />
              <span>Exportar Datos</span>
            </button>
          </PermissionWrapper>
          
          <!-- Botón de configuración, solo para superadmin -->
          <PermissionWrapper superadminOnly>
            <button 
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg flex items-center gap-2"
              @click="configureSettings"
            >
              <Settings class="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </PermissionWrapper>
        </div>
      </div>
      
      <!-- Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex items-start gap-4"
        >
          <div
            class="p-3 rounded-xl"
            :class="{
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400':
                stat.color === 'blue',
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400':
                stat.color === 'green',
              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400':
                stat.color === 'purple',
              'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400':
                stat.color === 'yellow',
            }"
          >
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-text/70 mb-1">{{ stat.title }}</h3>
            <div class="text-xl font-semibold text-text mb-1">{{ stat.value }}</div>
            <div
              class="flex items-center text-sm font-medium"
              :class="stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'"
            >
              <component
                :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownRight"
                class="w-4 h-4"
              />
              {{ stat.change }}
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico y Resúmenes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Gráfico -->
        <div
          class="lg:col-span-2 bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
        >
          <h2 class="text-lg font-semibold text-text mb-6">Distribución de Pólizas</h2>
          <PolicyDistributionChart :data="policyDistribution" />
        </div>

        <!-- Resúmenes -->
        <div class="flex flex-col gap-6">
          <!-- Pólizas Recientes -->
          <div class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-text mb-4">Pólizas Recientes</h2>
            <div class="flex flex-col gap-3">
              <div
                v-for="policy in recentPolicies"
                :key="policy.id"
                class="flex items-center justify-between p-3 bg-input-bg rounded-xl border border-input-border"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-text truncate">{{ policy.client }}</span>
                    <span class="text-xs text-text/50">{{ policy.type }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs">
                    <component
                      :is="getStatusIcon(policy.status)"
                      class="w-3.5 h-3.5"
                      :class="getStatusColor(policy.status)"
                    />
                    <span :class="getStatusColor(policy.status)">
                      {{ policy.status === 'approved' ? 'Aprobada' : 'Pendiente' }}
                    </span>
                    <span class="text-text/50 ml-2"> Vence: {{ formatDate(policy.dueDate) }} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notificaciones -->
          <div class="bg-container-bg border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h2 class="text-lg font-semibold text-text mb-4">Notificaciones</h2>
            <div class="flex flex-col gap-3">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex gap-3 p-3 bg-input-bg rounded-xl border border-input-border"
              >
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="{
                    'bg-amber-100 dark:bg-amber-900/30': notification.type === 'renewal',
                    'bg-emerald-100 dark:bg-emerald-900/30': notification.type === 'policy',
                    'bg-blue-100 dark:bg-blue-900/30': notification.type === 'system',
                  }"
                >
                  <component
                    :is="getNotificationIcon(notification.type)"
                    class="w-4 h-4"
                    :class="getNotificationColor(notification.type)"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-sm font-medium text-text truncate">{{
                      notification.title
                    }}</span>
                    <span class="text-xs text-text/50 whitespace-nowrap">{{
                      formatTimeAgo(notification.date)
                    }}</span>
                  </div>
                  <p class="text-xs text-text/70 line-clamp-2">{{ notification.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { usePermissions } from '@/composables/usePermissions';
  import PolicyDistributionChart from '../components/PolicyDistributionChart.vue';
  import PermissionWrapper from '@/components/PermissionWrapper.vue';
  import {
    Users,
    FileText,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Bell,
    Settings
  } from 'lucide-vue-next';
  import { useToast } from 'vue-toastification';

  // Inicializar el composable de permisos
  const permissions = usePermissions();
  const toast = useToast();

  // Funciones para los nuevos botones
  const exportDashboardData = () => {
    if (!permissions.isAdmin.value && !permissions.isSuperAdmin.value) {
      toast.error('No tienes permisos para exportar datos');
      return;
    }
    toast.success('Exportando datos del dashboard...');
    // Lógica de exportación...
  };

  const configureSettings = () => {
    if (!permissions.isSuperAdmin.value) {
      toast.error('Solo el superadmin puede acceder a la configuración');
      return;
    }
    toast.info('Abriendo configuración del sistema...');
    // Lógica de configuración...
  };

  const stats = ref([
    {
      title: 'Total Clientes',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Pólizas Activas',
      value: '3,456',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'green',
    },
    {
      title: 'Clientes',
      value: '890',
      change: '+5.3%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Prima Total',
      value: 'L. 2.5M',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'yellow',
    },
  ]);

  const policyDistribution = ref([
    { type: 'Automóvil', count: 150 },
    { type: 'Vida', count: 80 },
    { type: 'Hogar', count: 60 },
    { type: 'Salud', count: 90 },
    { type: 'Negocio', count: 40 },
  ]);

  const recentPolicies = ref([
    {
      id: 'POL-001',
      client: 'Juan Pérez',
      type: 'Automóvil',
      status: 'approved',
      dueDate: '2024-03-15',
    },
    {
      id: 'POL-002',
      client: 'María López',
      type: 'Vida',
      status: 'pending',
      dueDate: '2024-03-20',
    },
    {
      id: 'POL-003',
      client: 'Carlos Mendoza',
      type: 'Hogar',
      status: 'approved',
      dueDate: '2024-03-25',
    },
    {
      id: 'POL-004',
      client: 'Ana Torres',
      type: 'Salud',
      status: 'pending',
      dueDate: '2024-03-30',
    },
  ]);

  const notifications = ref([
    {
      id: 1,
      type: 'renewal',
      title: 'Renovación Pendiente',
      message: 'La póliza de Juan Pérez vence en 7 días',
      date: '2024-02-13T10:30:00',
    },
    {
      id: 2,
      type: 'policy',
      title: 'Nueva Póliza',
      message: 'Se ha creado una nueva póliza para María López',
      date: '2024-02-13T09:15:00',
    },
    {
      id: 3,
      type: 'system',
      title: 'Actualización del Sistema',
      message: 'Se han actualizado las tarifas del sistema',
      date: '2024-02-13T08:45:00',
    },
  ]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-HN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'approved' ? 'text-emerald-500' : 'text-amber-500';
  };

  const getStatusIcon = (status: string) => {
    return status === 'approved' ? CheckCircle2 : Clock;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'renewal':
        return Clock;
      case 'policy':
        return FileText;
      case 'system':
        return Bell;
      default:
        return AlertCircle;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'renewal':
        return 'text-amber-500';
      case 'policy':
        return 'text-emerald-500';
      case 'system':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} horas`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} días`;
    }
  };

  // Cargar permisos al montar el componente
  onMounted(async () => {
    await permissions.loadPermissions();
  });
</script>
