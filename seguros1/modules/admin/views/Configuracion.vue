<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1200px] mx-auto px-4">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Configuración</h1>

        <!-- Acciones -->
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <!-- Buscador -->
          <div
            class="flex-1 min-w-[320px] flex items-center gap-3 px-4 py-3 rounded-xl bg-input-bg border border-input-border transition-all duration-300 hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search class="w-5 h-5 text-text opacity-50" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar usuario..."
              class="flex-1 bg-transparent border-none text-text text-sm outline-none placeholder:text-text/50"
            />
          </div>

          <!-- Botones de acción -->
          <div class="flex items-center gap-4">
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover"
            >
              <Users class="w-5 h-5" />
              Gestión de Usuarios
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-input-bg text-text text-sm font-medium border border-input-border transition-all duration-300 hover:border-primary hover:bg-input-bg"
            >
              <Shield class="w-5 h-5" />
              Roles y Permisos
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
              @click="handleAddBroker"
            >
              <Plus class="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <div
        class="bg-container-bg border border-container-border rounded-2xl shadow-[0_8px_32px_var(--container-shadow)] overflow-hidden"
      >
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border"
              >
                Usuario
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border"
              >
                Rol
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border"
              >
                Estado
              </th>
              <th
                class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="broker in brokers" :key="broker.id">
              <!-- Fila de usuario -->
              <tr class="border-b border-container-border last:border-b-0">
                <td class="p-4">
                  <div class="flex items-center gap-4">
                    <img
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(broker.name)}&background=8CBFCF&color=fff`"
                      :alt="broker.name"
                      class="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div class="font-medium text-text text-sm">{{ broker.name }}</div>
                      <div class="text-xs text-text/70">{{ broker.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="inline-block px-3 py-1 rounded-lg bg-input-bg text-sm font-medium">
                    {{ broker.role }}
                  </span>
                </td>
                <td class="p-4">
                  <span
                    class="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                    :class="
                      broker.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    "
                  >
                    {{ broker.status === 'active' ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <button
                      class="p-2 rounded-lg border border-input-border bg-input-bg text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5"
                      :class="{
                        'bg-primary !border-primary text-white': expandedUserId === broker.id,
                      }"
                      @click="toggleUserPermissions(broker.id)"
                    >
                      <Settings2 class="w-5 h-5" />
                    </button>
                    <button
                      class="p-2 rounded-lg border border-red-200 bg-red-50 text-red-500 transition-all duration-300 hover:bg-red-100 hover:border-red-300 hover:-translate-y-0.5"
                      @click="confirmDeleteBroker(broker.id)"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Fila de permisos expandible -->
              <tr v-if="expandedUserId === broker.id" class="bg-input-bg">
                <td colspan="4" class="p-6">
                  <div class="flex flex-col gap-6">
                    <!-- Sección de permisos de Pólizas -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Pólizas</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.viewPolicies"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Eye class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Ver Pólizas</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.createPolicies"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <PlusIcon class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Crear Pólizas</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.editPolicies"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <FileEdit class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Editar Pólizas</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sección de permisos de Clientes -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Clientes</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.viewClients"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Eye class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Ver Clientes</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.createClients"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <UserPlus class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Crear Clientes</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.editClients"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <UserCog class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Editar Clientes</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sección de permisos de Pagos -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Pagos</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.viewPayments"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <DollarSign class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Ver Pagos</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.createPayments"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <CreditCard class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Crear Pagos</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sección de permisos de Aseguradoras -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Aseguradoras</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.viewInsurers"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Eye class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Ver Aseguradoras</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.createInsurers"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Building2 class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Crear Aseguradoras</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.editInsurers"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <PenSquare class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Editar Aseguradoras</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sección de permisos de Reportes -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Reportes</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.viewReports"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <FileText class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Ver Reportes</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.exportReports"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Download class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Exportar Reportes</span>
                        </label>
                      </div>
                    </div>

                    <!-- Sección de permisos de Usuarios -->
                    <div class="bg-container-bg border border-container-border rounded-xl p-4">
                      <h4 class="text-sm font-semibold text-text mb-4">Usuarios</h4>
                      <div class="flex flex-row flex-wrap gap-6">
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.createBrokers"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <UserPlus class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Crear Corredores</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.editBrokers"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <UserCog class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Editar Corredores</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer min-w-[200px]">
                          <input
                            v-model="broker.permissions.manageRoles"
                            type="checkbox"
                            class="w-4 h-4 rounded border-input-border text-primary focus:ring-primary/20"
                          />
                          <Shield class="w-4 h-4 text-text/70" />
                          <span class="text-sm text-text">Gestionar Roles</span>
                        </label>
                      </div>
                    </div>

                    <!-- Botón de guardar -->
                    <div class="flex justify-end">
                      <button
                        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                        @click="handleSavePermissions(broker.id)"
                      >
                        <Save class="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación de eliminación -->
  <Teleport to="body">
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999] p-6"
      @click="showDeleteConfirm = false"
    >
      <div
        class="w-[min(480px,100%)] bg-background rounded-3xl border border-container-border shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden p-6"
        @click.stop
      >
        <h3 class="text-xl font-semibold text-text mb-4">Confirmar Eliminación</h3>
        <p class="text-text mb-6">
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-4">
          <button
            class="px-6 py-3 rounded-xl bg-input-bg text-text text-sm font-medium border border-input-border transition-all duration-300 hover:border-primary"
            @click="showDeleteConfirm = false"
          >
            Cancelar
          </button>
          <button
            class="px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600"
            @click="handleDeleteBroker"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Users,
    Shield,
    Plus,
    Search,
    Settings2,
    Eye,
    PenSquare,
    FileEdit,
    UserPlus,
    UserCog,
    FileText,
    Download,
    Building2,
    Plus as PlusIcon,
    DollarSign,
    CreditCard,
    Save,
    Trash2,
  } from 'lucide-vue-next';

  // Tipos y interfaces
  interface Broker {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    role: string;
    permissions: {
      // Permisos de Pólizas
      viewPolicies: boolean;
      createPolicies: boolean;
      editPolicies: boolean;

      // Permisos de Clientes
      viewClients: boolean;
      createClients: boolean;
      editClients: boolean;

      // Permisos de Pagos
      viewPayments: boolean;
      createPayments: boolean;

      // Permisos de Aseguradoras
      viewInsurers: boolean;
      createInsurers: boolean;
      editInsurers: boolean;

      // Permisos de Reportes
      viewReports: boolean;
      exportReports: boolean;

      // Permisos de Usuarios
      createBrokers: boolean;
      editBrokers: boolean;
      manageRoles: boolean;
    };
  }

  // Datos de ejemplo
  const brokers = ref<Broker[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      status: 'active',
      role: 'Subadministrador',
      permissions: {
        viewPolicies: true,
        createPolicies: true,
        editPolicies: true,
        viewClients: true,
        createClients: true,
        editClients: true,
        viewPayments: true,
        createPayments: true,
        viewInsurers: true,
        createInsurers: true,
        editInsurers: true,
        viewReports: true,
        exportReports: true,
        createBrokers: true,
        editBrokers: true,
        manageRoles: true,
      },
    },
    {
      id: '2',
      name: 'María López',
      email: 'maria@ejemplo.com',
      status: 'active',
      role: 'Corredor',
      permissions: {
        viewPolicies: true,
        createPolicies: false,
        editPolicies: false,
        viewClients: true,
        createClients: false,
        editClients: false,
        viewPayments: true,
        createPayments: false,
        viewInsurers: true,
        createInsurers: false,
        editInsurers: false,
        viewReports: true,
        exportReports: false,
        createBrokers: false,
        editBrokers: false,
        manageRoles: false,
      },
    },
  ]);

  // Estado local
  const searchQuery = ref('');
  const showAddModal = ref(false);
  const expandedUserId = ref<string | null>(null);
  const showDeleteConfirm = ref(false);
  const selectedBrokerToDelete = ref<string | null>(null);

  // Métodos
  const toggleUserPermissions = (userId: string) => {
    expandedUserId.value = expandedUserId.value === userId ? null : userId;
  };

  const handleAddBroker = () => {
    showAddModal.value = true;
  };

  const handleSavePermissions = (brokerId: string) => {
    // Aquí iría la lógica para guardar los permisos
    console.log('Guardando permisos para:', brokerId);
  };

  const confirmDeleteBroker = (brokerId: string) => {
    selectedBrokerToDelete.value = brokerId;
    showDeleteConfirm.value = true;
  };

  const handleDeleteBroker = () => {
    if (selectedBrokerToDelete.value) {
      brokers.value = brokers.value.filter((b) => b.id !== selectedBrokerToDelete.value);
      showDeleteConfirm.value = false;
      selectedBrokerToDelete.value = null;
      expandedUserId.value = null;
    }
  };
</script>
