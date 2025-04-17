<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[1.875rem] font-semibold text-text mb-6">Clientes</h1>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar por nombre, identificación, teléfono o correo electrónico..."
              />
            </div>
            <PermissionWrapper requires="clientes_create">
              <button
                class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none hover:bg-primary-hover whitespace-nowrap"
                @click="openAddClientModal"
              >
                <Plus class="w-5 h-5" />
                <span>Nuevo Cliente</span>
              </button>
            </PermissionWrapper>
          </div>
        </div>
      </div>

      <!-- Lista de clientes -->
      <div v-if="isListView">
        <!-- Estado sin clientes -->
        <div
          v-if="clientes.length === 0 && !loading"
          class="bg-container-bg border border-container-border rounded-2xl p-12"
        >
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="p-4 rounded-full bg-primary/10">
              <Users class="w-12 h-12 text-primary" />
            </div>
            <h3 class="text-xl font-medium text-text">No hay clientes registrados</h3>
            <p class="text-text/70 text-center max-w-md">
              Aún no hay clientes registrados en el sistema. Haz clic en el botón "Nuevo Cliente" para
              comenzar a agregar clientes.
            </p>
          </div>
        </div>

        <!-- Estado sin resultados de búsqueda -->
        <div
          v-else-if="searchQuery && filteredItems.length === 0 && !loading"
          class="bg-container-bg border border-container-border rounded-2xl p-12"
        >
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="p-4 rounded-full bg-primary/10">
              <Search class="w-12 h-12 text-primary" />
            </div>
            <h3 class="text-xl font-medium text-text">No se encontraron resultados</h3>
            <p class="text-text/70 text-center max-w-md">
              No se encontraron clientes que coincidan con tu búsqueda. Intenta con otros términos o
              revisa la ortografía.
            </p>
          </div>
        </div>

        <!-- Tabla de clientes -->
        <div
          v-else-if="clientes.length > 0 || loading"
          class="bg-container-bg border border-container-border rounded-2xl overflow-x-auto relative"
        >
          <!-- Indicador de carga -->
          <div
            v-if="loading || searchLoading"
            class="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10"
          >
            <div class="flex flex-col items-center gap-2">
              <div
                class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"
              ></div>
              <span class="text-sm font-medium text-text/70">Cargando datos...</span>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error || searchError" class="text-red-500 text-center mt-4">
            {{ error?.message || searchError?.message || 'Error al cargar los datos' }}
          </div>

          <table class="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  Cliente
                </th>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  Identificación
                </th>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  Contacto
                </th>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  Dirección
                </th>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  # Pólizas
                </th>
                <th
                  class="bg-input-bg text-text font-semibold text-left p-4 border-b border-container-border whitespace-nowrap"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="client in paginatedItems"
                :key="client.id_cliente"
                class="border-b border-container-border last:border-b-0 hover:bg-input-bg"
              >
                <!-- Información del cliente -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <!-- Verificar si el cliente tiene una foto -->
                    <div
                      v-if="client.foto"
                      class="w-12 h-12 rounded-lg overflow-hidden shadow-md"
                      :title="client.nombres"
                    >
                      <img
                        :src="getImageSrc(client.foto)"
                        alt="Foto del cliente"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <!-- Si no hay foto, mostrar las iniciales -->
                    <div
                      v-else
                      class="w-12 h-12 rounded-lg flex items-center justify-center bg-[#8CBFCF] text-white font-bold text-xl shadow-md"
                      :title="client.nombres"
                    >
                      {{ getInitials(client.nombres) }}
                    </div>

                    <div class="font-medium text-text">{{ client.nombres }} {{ client.apellidos }}</div>
                  </div>
                </td>

                <!-- IDENTIFICACIÓN -->
                <td class="p-4">
                  <div class="font-mono text-sm text-text/80 px-2 py-1 bg-input-bg rounded">
                    {{ client.identificacion }}
                  </div>
                </td>

                <!-- Información de contacto -->
                <td class="p-4">
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-text/50" />
                      <span class="text-sm text-text">{{ client.correo }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-text/50" />
                      <span class="text-sm text-text">{{ client.tel_1 }}</span>
                    </div>
                  </div>
                </td>

                <!-- Dirección -->
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-text/50 flex-shrink-0" />
                    <span class="text-sm text-text">{{ client.direccion }}</span>
                  </div>
                </td>

                <!-- Contador de pólizas -->
                <td class="p-4">
                  <div
                    class="flex items-center justify-center font-semibold text-primary rounded-full bg-gray-100"
                  >
                    {{ client.total_polizas || 0 }}
                  </div>
                </td>

                <!-- Botones de acción -->
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <!-- Ver detalles del cliente -->
                    <PermissionWrapper requires="clientes_view">
                      <button
                        title="Ver detalles del cliente"
                        class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                        @click="handleViewClient(client.id_cliente)"
                      >
                        <Eye class="w-4 h-4 text-text/50 group-hover:text-white" />
                        <span class="text-xs font-medium text-text group-hover:text-white">Ver</span>
                      </button>
                    </PermissionWrapper>

                    <!-- Ver pólizas del cliente -->
                    <PermissionWrapper requires="clientes_view">
                      <button
                        title="Ver pólizas del cliente"
                        class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input-border bg-input-bg transition-all duration-300 hover:border-primary hover:bg-primary hover:-translate-y-0.5"
                        @click="handleViewPolicies(client.id_cliente)"
                      >
                        <FileText class="w-4 h-4 text-text/50 group-hover:text-white" />
                        <span class="text-xs font-medium text-text group-hover:text-white"
                          >Pólizas</span
                        >
                      </button>
                    </PermissionWrapper>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Paginación -->
          <div class="mt-6 p-4">
            <PaginationButtons
              :page="paginaActual"
              :total-pages="Math.ceil(totalRegistros / limite)"
              :items-per-page="limite"
              :is-first-page="paginaActual === 1"
              :has-more-data="paginaActual >= Math.ceil(totalRegistros / limite)"
              @update:page="handlePageChange"
              @update:items-per-page="handleItemsPerPageChange"
            />
          </div>
        </div>
      </div>

      <!-- Modales basados en rutas -->
      <template v-else>
        <ViewClientModal
          v-if="currentModal === 'details'"
          :show="true"
          :client="selectedClientWithCorreduria"
          :usuarios="usuarios"
          @close="handleCloseModal"
          @update-client="handleUpdateClient"
          @delete-client="handleDeleteClient"
        />

        <AddClientModal
          v-else-if="currentModal === 'new'"
          :show="true"
          @close="handleCloseModal"
          @add-client="handleCreateClient"
        />

        <ViewClientPolicyModal
          v-else-if="currentModal === 'policies' && selectedClientWithCorreduria"
          :show="true"
          :client="selectedClientWithCorreduria"
          :id-cliente="selectedClientWithCorreduria.id_cliente"
          :usuarios="usuarios"
          @close="handleCloseModal"
        />

        <ViewClientPaymentsModal
          v-else-if="currentModal === 'payments' && selectedClientWithCorreduria"
          :show="true"
          :client="selectedClientWithCorreduria"
          :usuarios="usuarios"
          :plan-de-pago-id="selectedPlanDePagoId"
          @close="handleCloseModal"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSearchClients } from '@/composables/useSearchClients';
import { useClientes } from '@/composables/useClientes';
import { usePermissions } from '@/composables/usePermissions';
import { useUsuarios } from '@/composables/useUsuarios';
import type { Database } from '@/lib/supabase';
import SearchBar from '@/modules/common/components/SearchBar.vue';
import PaginationButtons from '@/modules/common/components/PaginationButtons.vue';
import ViewClientModal from '@/modules/admin/components/ViewClientModal.vue';
import AddClientModal from '@/modules/admin/components/AddClientModal.vue';
import ViewClientPolicyModal from '@/modules/admin/components/ViewClientPolicyModal.vue';
import ViewClientPaymentsModal from '@/modules/admin/components/ViewClientPaymentsModal.vue';
import PermissionWrapper from '@/components/PermissionWrapper.vue';
import {
  Plus,
  Mail,
  Phone,
  MapPin,
  Eye,
  FileText,
  Users,
  Search,
} from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.store';
import { storeToRefs } from 'pinia';
import type { Cliente as ClienteInterface } from '@/modules/admin/interfaces/cliente_interface';

// Tipo de base de datos para la tabla clientes
type ClienteDB = Database['public']['Tables']['clientes']['Row'];

// Extender ClienteInterface con campos adicionales y asegurar valores null para opcionales
interface Cliente extends ClienteInterface {
  empresa: string | null; 
  tel_1: string | null;   
  tel_2: string | null;   
  dob: Date | null;     
  foto: string | null; 
  direccion: string | null; // Forzar a string | null
  total_polizas?: number;
  clientes_por_correduria?: {
    id_cliente_correduria: string;
    id_correduria: string;
    fecha_creado: string;
  }[];
  id_usuario_correduria?: string | null; 
}

// Definir tipo Usuario
type Usuario = {
  id_usuario: string;
  nombre: string;
  correo: string;
  auth_user_id?: string;
  fecha_creado?: string;
};

// Composables
const router = useRouter();
const route = useRoute();
const toast = useToast();
const { 
  getClientes, // Devuelve { clientes: ClienteDB[], ... }
  updateCliente, 
  deleteCliente,
  getClienteById, // Devuelve ClienteDB | null
  createCliente
} = useClientes();
const permissions = usePermissions();
const authStore = useAuthStore();
const { id_correduria } = storeToRefs(authStore);
const currentUser = authStore.user;
const { searchClients, loading: searchLoading, error: searchError, filteredItems } = useSearchClients();
const { getUsuariosPorCorreduria } = useUsuarios();

// Estado - Usar el tipo Cliente extendido
const loading = ref(false);
const error = ref<Error | null>(null);
const clientes = ref<Cliente[]>([]); 
const selectedClient = ref<Cliente | null>(null);
const searchQuery = ref('');
const paginaActual = ref(1);
const limite = ref(10);
const totalRegistros = ref(0);
const selectedPlanDePagoId = ref<string>('');
const usuarios = ref<Usuario[]>([]);

// Computed Properties
const isListView = computed(() => route.name === 'clientes');
const currentModal = computed(() => {
  switch (route.name) {
    case 'cliente-detalles':
      return 'details';
    case 'cliente-nuevo':
      return 'new';
    case 'cliente-polizas':
      return 'policies';
    case 'cliente-pagos':
      return 'payments';
    default:
      return null;
  }
});

// Computed devuelve el tipo Cliente extendido
const selectedClientWithCorreduria = computed<Cliente | null>(() => {
  if (!selectedClient.value) return null;

  // Ya tenemos el tipo Cliente completo en selectedClient
  return selectedClient.value;
});

// Helper para convertir ClienteDB a Cliente
const convertClienteDBToCliente = (clienteDB: ClienteDB | null): Cliente | null => {
  if (!clienteDB) return null;

  // Tipo auxiliar para la relación esperada en Cliente
  type CorreduriaRel = {
    id_cliente_correduria: string;
    id_correduria: string;
    fecha_creado: string;
  };

  // Tipo auxiliar para la relación como podría venir de Supabase (ajustar si es necesario)
  type CorreduriaRelFromDB = {
    id_cliente_correduria?: string; // Puede ser opcional
    id_correduria: string;
    fecha_creado?: string; // Puede ser opcional
  }

  // Tratar como tipo extendido para acceder a posibles propiedades
  const clienteDBExt = clienteDB as ClienteDB & {
    clientes_por_correduria?: CorreduriaRelFromDB[]; // Usar tipo auxiliar
    foto?: string | null;
    direccion?: string | null;
    id_usuario_correduria?: string | null;
  };

  let determinedCorreduriaId = id_correduria.value || ''; // Default
  let correduriaRels: CorreduriaRel[] = [];

  if (clienteDBExt.clientes_por_correduria && clienteDBExt.clientes_por_correduria.length > 0) {
    // Mapear la relación del DB al formato esperado en Cliente
    correduriaRels = clienteDBExt.clientes_por_correduria.map(rel => ({
      id_cliente_correduria: rel.id_cliente_correduria || '', // Proveer default
      id_correduria: rel.id_correduria,
      fecha_creado: rel.fecha_creado || new Date().toISOString(), // Proveer default
    }));

    const userCorreduriaRelation = correduriaRels.find(
      rel => rel.id_correduria === id_correduria.value
    );
    if (userCorreduriaRelation) {
      determinedCorreduriaId = userCorreduriaRelation.id_correduria;
    } else {
      determinedCorreduriaId = correduriaRels[0].id_correduria; // Usar el mapeado
    }
  }
  
  return {
    id_cliente: clienteDB.id_cliente,
    id_correduria: determinedCorreduriaId,
    nombres: clienteDB.nombres,
    apellidos: clienteDB.apellidos,
    identificacion: clienteDB.identificacion,
    correo: clienteDB.correo,
    tel_1: clienteDB.tel_1 || null, 
    tel_2: clienteDB.tel_2 || null, 
    empresa: clienteDB.empresa || null, 
    dob: clienteDB.dob || null, 
    fecha_creado: clienteDB.fecha_creado,
    creado_por: clienteDB.creado_por,
    fecha_modificado: clienteDB.fecha_modificado,
    modificado_por: clienteDB.modificado_por,
    foto: clienteDBExt.foto || null,
    direccion: clienteDBExt.direccion || null,
    id_usuario_correduria: clienteDBExt.id_usuario_correduria || null,
    total_polizas: 0, 
    clientes_por_correduria: correduriaRels, // Asignar el array mapeado
  };
};

// Watch para la búsqueda
watch(searchQuery, async (newQuery) => {
  if (newQuery.length >= 2) {
    // searchClients devuelve ClienteInterface[], necesitamos convertirlos
    await searchClients(newQuery, id_correduria.value);
    // Asegurar que el map no devuelva nulls si convertClienteDBToCliente falla
    clientes.value = filteredItems.value
      .map(cliInterface => convertClienteDBToCliente(cliInterface as unknown as ClienteDB))
      .filter((cliente): cliente is Cliente => cliente !== null);
  } else if (newQuery.length === 0) {
    await loadClientes();
  }
});

// Watch para el cambio de ruta
watch(
  () => route.params.id,
  async (newId) => {
    if (newId && (route.name === 'cliente-detalles' || route.name === 'cliente-polizas')) {
      await loadClienteDetalle(newId.toString());
    }
  },
  { immediate: true }
);

// Función para cargar detalles del cliente
const loadClienteDetalle = async (id: string) => {
  if (!id) return;

  loading.value = true;
  try {
    const clienteDB = await getClienteById(id); // Devuelve ClienteDB | null
    if (clienteDB) {
      selectedClient.value = convertClienteDBToCliente(clienteDB);
    } else {
      toast.error('No se encontró el cliente');
      router.push({ name: 'clientes' });
    }
  } catch (err) {
    error.value = err as Error;
    toast.error('Error al cargar los detalles del cliente');
    console.error('Error al cargar los detalles del cliente:', err);
  } finally {
    loading.value = false;
  }
};

// Función para cargar clientes
const loadClientes = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getClientes(paginaActual.value, limite.value); // Devuelve { clientes: ClienteDB[], ... }
    if (response) {
      // Mapear ClienteDB[] a Cliente[]
      clientes.value = response.clientes.map(clienteDB => convertClienteDBToCliente(clienteDB) as Cliente); // Asegurar que no sea null
      totalRegistros.value = response.total;
    }
  } catch (err) {
    error.value = err as Error;
    toast.error('Error al cargar los clientes');
    console.error('Error al cargar los clientes:', err);
  } finally {
    loading.value = false;
  }
};

// Funciones auxiliares
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const getImageSrc = (foto: string): string => {
  return foto.startsWith('http') ? foto : `/uploads/${foto}`;
};

// Methods - Navegación
const openAddClientModal = () => {
  if (!permissions.hasPermission('clientes_create') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para crear clientes');
    return;
  }
  router.push({ name: 'cliente-nuevo' });
};

const handleViewClient = (id: string) => {
  if (!permissions.hasPermission('clientes_view') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para ver detalles de clientes');
    return;
  }
  
  router.push({ name: 'cliente-detalles', params: { id } });
};

const handleViewPolicies = (id: string) => {
  if (!permissions.hasPermission('clientes_view') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para ver pólizas de clientes');
    return;
  }
  
  router.push({ name: 'cliente-polizas', params: { id } });
};

const handleCloseModal = () => {
  selectedClient.value = null;
  router.push({ name: 'clientes' });
};

// Methods - Acciones CRUD
const handleCreateClient = async (formData: FormData) => {
  if (!permissions.hasPermission('clientes_create') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para crear clientes');
    return;
  }
  
  try {
    // Extraer los campos necesarios de FormData
    const clientData = {
      identificacion: formData.get('identificacion') as string,
      correo: formData.get('correo') as string,
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      tel_1: formData.get('tel_1') as string || null,
      tel_2: formData.get('tel_2') as string || null,
      empresa: formData.get('empresa') as string || null,
      direccion: formData.get('direccion') as string || null,
      dob: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
      creado_por: currentUser?.id || '',
      estado: true
    };
    
    // La función createCliente ahora se encarga de crear el cliente y asociarlo con la correduría
    const newClient = await createCliente(clientData);
    
    if (newClient && newClient.id_cliente) {
      // Recargar la lista de clientes
      await loadClientes();
      handleCloseModal();
      toast.success('Cliente creado correctamente');
    } else {
      toast.error('Error al crear el cliente: respuesta incompleta');
    }
  } catch (error) {
    console.error('Error al crear cliente:', error);
    toast.error('Error al crear el cliente');
  }
};

const handleUpdateClient = async (formData: FormData) => {
  if (!permissions.hasPermission('clientes_edit') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para editar clientes');
    return;
  }
  
  try {
    const clientId = formData.get('id_cliente');
    if (!clientId) {
      toast.error('Error: ID de cliente no válido');
      return;
    }
    
    // Extraer los campos necesarios de FormData
    const clientData = {
      identificacion: formData.get('identificacion') as string,
      correo: formData.get('correo') as string,
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      tel_1: formData.get('tel_1') as string || null,
      tel_2: formData.get('tel_2') as string || null,
      empresa: formData.get('empresa') as string || null,
      direccion: formData.get('direccion') as string || null,
      dob: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
      modificado_por: currentUser?.id || ''
    };
    
    await updateCliente(clientId.toString(), clientData);
    await loadClientes();
    handleCloseModal();
    toast.success('Cliente actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    toast.error('Error al actualizar el cliente');
  }
};

const handleDeleteClient = async (id: string) => {
  if (!permissions.hasPermission('clientes_delete') && !permissions.isSuperAdmin.value) {
    toast.error('No tienes permiso para eliminar clientes');
    return;
  }
  
  try {
    await deleteCliente(id);
    await loadClientes();
    handleCloseModal();
    toast.success('Cliente eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    toast.error('Error al eliminar el cliente');
  }
};

const handlePageChange = (newPage: number) => {
  paginaActual.value = newPage;
  loadClientes();
  // Scroll hacia arriba
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleItemsPerPageChange = (newValue: number) => {
  limite.value = newValue;
  paginaActual.value = 1; // Resetear a primera página cuando cambia el límite
  loadClientes();
};

// Cargar datos iniciales
onMounted(async () => {
  // Cargar permisos primero
  if (!permissions.permissionsLoaded.value) {
    await permissions.loadPermissions();
  }
  
  // Luego cargar datos
  await loadClientes();
  await loadUsuarios();
  
  // Cargar detalles si estamos en una ruta de detalle
  if (route.params.id && (route.name === 'cliente-detalles' || route.name === 'cliente-polizas')) {
    await loadClienteDetalle(route.params.id.toString());
  }
});

// Añadir la función para cargar usuarios
const loadUsuarios = async () => {
  try {
    const response = await getUsuariosPorCorreduria(id_correduria.value);
    if (response && response.data) {
      usuarios.value = response.data.map(user => ({
        id_usuario: user.auth_user_id,
        nombre: user.nombre,
        correo: user.correo,
        auth_user_id: user.auth_user_id,
        fecha_creado: user.fecha_creado
      }));
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

// Calcular elementos paginados
const paginatedItems = computed(() => {
  if (searchQuery.value && searchQuery.value.length >= 2) {
    return filteredItems.value;
  }
  return clientes.value;
});
</script>
