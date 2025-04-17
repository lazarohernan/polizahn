<template>
  <!-- Contenido principal -->
  <div class="w-full min-h-[calc(100vh-120px)] flex justify-center mt-[180px] pb-8 px-4">
    <div class="w-full max-w-[1500px] mx-auto px-4">
      <!-- Encabezado y acciones -->
      <div class="mb-8">
        <h1 class="text-[2rem] font-bold text-text mb-6 flex items-center gap-3">
          <div class="p-2 rounded-xl bg-primary/10">
            <Users class="w-8 h-8 text-primary" />
          </div>
          Clientes
        </h1>
        <div class="flex items-center justify-between bg-container-bg border border-container-border rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-4 w-full">
            <div class="w-full max-w-[600px]">
              <SearchBar
                v-model="searchQuery"
                placeholder="Buscar por nombre, identificación, teléfono o correo electrónico..."
                class="shadow-sm"
              />
            </div>
            <PermissionWrapper requires="clientes_create">
              <button
                class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium border-none hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
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
              Aún no hay clientes registrados en el sistema. Haz clic en el botón "Nuevo Cliente"
              para comenzar a agregar clientes.
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
        <div class="overflow-hidden rounded-2xl border border-container-border bg-container-bg shadow-md hover:shadow-lg transition-all duration-300">
          <!-- Spinner de carga -->
          <div v-if="loading" class="flex justify-center items-center p-20 bg-container-bg/50 backdrop-blur-sm">
            <Loader class="w-12 h-12 animate-spin text-primary" />
          </div>
          <!-- Mensaje de error -->
          <div v-else-if="error" class="p-6 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl m-4">
            <AlertCircle class="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
          <!-- Tabla -->
          <div v-else-if="filteredItems.length > 0" class="overflow-auto">
            <table class="min-w-full">
              <thead class="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contacto</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha de Registro</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pólizas</th>
                  <th class="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(client, index) in filteredItems"
                  :key="client.id_cliente"
                  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  :class="{ 'bg-gray-50/50 dark:bg-gray-800/30': index % 2 === 0 }"
                >
                  <!-- Información del cliente -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-lg font-medium text-primary">
                        {{ getInitials(client.nombres) }}
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-text">{{ client.nombres }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">{{ client.identificacion || '<No disponible>' }}</div>
                      </div>
                    </div>
                  </td>
                  <!-- Contacto -->
                  <td class="px-6 py-4">
                    <div class="flex flex-col space-y-1">
                      <div v-if="client.correo" class="text-sm flex items-center">
                        <Mail class="w-4 h-4 mr-2 text-gray-400" />
                        <span>{{ client.correo }}</span>
                      </div>
                      <div v-else class="text-sm text-gray-400 italic flex items-center">
                        <Mail class="w-4 h-4 mr-2" />
                        <span>Sin correo</span>
                      </div>
                      
                      <div v-if="client.tel_1" class="text-sm flex items-center">
                        <Phone class="w-4 h-4 mr-2 text-gray-400" />
                        <span>{{ client.tel_1 }}</span>
                      </div>
                      <div v-else class="text-sm text-gray-400 italic flex items-center">
                        <Phone class="w-4 h-4 mr-2" />
                        <span>Sin teléfono</span>
                      </div>
                    </div>
                  </td>
                  <!-- Fecha de registro -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-gray-200">{{ formatDate(client.fecha_creado) }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(client.fecha_creado) }}</div>
                  </td>
                  <!-- Pólizas -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <FileText class="w-4 h-4 mr-2 text-gray-400" />
                      <span class="text-sm">{{ client.total_polizas || 0 }} pólizas</span>
                    </div>
                  </td>
                  <!-- Acciones -->
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <PermissionWrapper requires="clientes_read">
                        <button
                          @click="handleViewClient(client.id_cliente)"
                          class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye class="w-5 h-5" />
                        </button>
                      </PermissionWrapper>
                      <PermissionWrapper requires="clientes_update">
                        <button
                          @click="handleEditClient(client.id_cliente)"
                          class="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                          title="Editar cliente"
                        >
                          <Edit class="w-5 h-5" />
                        </button>
                      </PermissionWrapper>
                      <PermissionWrapper requires="clientes_delete">
                        <button
                          @click="confirmDelete(client)"
                          class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash class="w-5 h-5" />
                        </button>
                      </PermissionWrapper>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- No hay resultados -->
          <div v-else class="p-12 text-center">
            <UserX class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-2">No se encontraron clientes</p>
            <p v-if="searchQuery" class="text-sm text-gray-400 dark:text-gray-500">
              Intenta con otros términos de búsqueda
            </p>
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
  import { Plus, Mail, Phone, MapPin, Eye, FileText, Users, Search, Edit, Trash, UserX, AlertCircle, Loader } from 'lucide-vue-next';
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
    createCliente,
  } = useClientes();
  const permissions = usePermissions();
  const authStore = useAuthStore();
  const { id_correduria } = storeToRefs(authStore);
  const currentUser = authStore.user;
  const {
    searchClients,
    loading: searchLoading,
    error: searchError,
    filteredItems,
  } = useSearchClients();
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
    };

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
      correduriaRels = clienteDBExt.clientes_por_correduria.map((rel) => ({
        id_cliente_correduria: rel.id_cliente_correduria || '', // Proveer default
        id_correduria: rel.id_correduria,
        fecha_creado: rel.fecha_creado || new Date().toISOString(), // Proveer default
      }));

      const userCorreduriaRelation = correduriaRels.find(
        (rel) => rel.id_correduria === id_correduria.value,
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
        .map((cliInterface) => convertClienteDBToCliente(cliInterface as unknown as ClienteDB))
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
    { immediate: true },
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
    console.log('[loadClientes] Iniciando carga...');
    loading.value = true;
    error.value = null;
    try {
      console.log('[loadClientes] Pagina:', paginaActual.value, 'Limite:', limite.value);

      const response = await getClientes(paginaActual.value, limite.value); // Devuelve { clientes: ClienteDB[], ... }
      console.log('[loadClientes] Respuesta recibida:', response);

      if (!response) {
        console.error('[loadClientes] Error: No se recibió respuesta de getClientes.');
        throw new Error('No se recibió respuesta al cargar los clientes');
      }

      if (response && response.clientes) {
        console.log('[loadClientes] Mapeando clientes:', response.clientes.length, 'clientes recibidos. Total:', response.total);
        // Mapear ClienteDB[] a Cliente[]
        clientes.value = response.clientes
          .map((clienteDB) => {
            const clienteMapped = convertClienteDBToCliente(clienteDB);
            if (!clienteMapped) {
              console.warn('[loadClientes] Advertencia: Error al convertir clienteDB:', clienteDB);
            }
            return clienteMapped as Cliente; // Asegurar que no sea null
          })
          .filter(Boolean); // Filtrar los nulos

        totalRegistros.value = response.total;
        console.log('[loadClientes] Mapeo completo. Clientes en ref:', clientes.value.length);
      } else {
        console.warn("[loadClientes] Advertencia: La respuesta no contiene la propiedad 'clientes'.");
        clientes.value = [];
        totalRegistros.value = 0;
      }
    } catch (err) {
      console.error('[loadClientes] Error capturado:', err);
      error.value = err as Error;
      toast.error(
        'Error al cargar los clientes: ' + (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      loading.value = false;
      console.log('[loadClientes] Carga finalizada. Estado de loading:', loading.value);
      console.log('[loadClientes] Clientes finales:', clientes.value);
      console.log('[loadClientes] Items filtrados finales:', filteredItems.value); // Añadido para ver qué se muestra
    }
  };

  // Funciones auxiliares
  const getInitials = (name: string): string => {
    if (!name) return '??';
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

  const handleEditClient = (id: string) => {
    if (!permissions.hasPermission('clientes_edit') && !permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para editar clientes');
      return;
    }

    router.push({ name: 'cliente-detalles', params: { id } });
  };

  const confirmDelete = (client: Cliente) => {
    if (!permissions.hasPermission('clientes_delete') && !permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para eliminar clientes');
      return;
    }

    if (confirm(`¿Estás seguro que deseas eliminar al cliente ${client.nombres}?`)) {
      handleDeleteClient(client.id_cliente);
    }
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
        tel_1: (formData.get('tel_1') as string) || null,
        tel_2: (formData.get('tel_2') as string) || null,
        empresa: (formData.get('empresa') as string) || null,
        direccion: (formData.get('direccion') as string) || null,
        dob: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
        creado_por: currentUser?.id || '',
        estado: true,
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

  const handleUpdateClient = async (client: Database['public']['Tables']['clientes']['Row']) => {
    if (!permissions.hasPermission('clientes_edit') && !permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para editar clientes');
      return;
    }

    try {
      console.log('Actualizando cliente desde el componente padre:', client);

      if (!client.id_cliente) {
        toast.error('Error: ID de cliente no válido');
        return;
      }

      // Preparar datos para actualización
      const clientData = {
        identificacion: client.identificacion,
        correo: client.correo,
        nombres: client.nombres,
        tel_1: client.tel_1,
        tel_2: client.tel_2,
        empresa: client.empresa,
        direccion: client.direccion,
        dob: client.dob,
        modificado_por: currentUser?.id || '',
      };

      // Guardar el resultado para verificar si fue exitoso
      const result = await updateCliente(client.id_cliente, clientData);

      if (!result) {
        throw new Error('No se pudo actualizar el cliente');
      }

      // Recargar la lista completa para reflejar los cambios
      await loadClientes();

      // Actualizar clienteDetalle si es el mismo que estamos editando
      if (selectedClient.value && selectedClient.value.id_cliente === client.id_cliente) {
        selectedClient.value = { ...selectedClient.value, ...result };
      }

      handleCloseModal();
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      let errorMsg = 'Error al actualizar el cliente';

      if (error instanceof Error) {
        errorMsg += `: ${error.message}`;
      }

      toast.error(errorMsg);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!permissions.hasPermission('clientes_delete') && !permissions.isSuperAdmin.value) {
      toast.error('No tienes permiso para eliminar clientes');
      return;
    }

    try {
      console.log('Eliminando cliente desde el componente padre, ID:', id);

      // Guardar el resultado para verificar si fue exitoso
      const result = await deleteCliente(id);

      if (!result) {
        throw new Error('No se pudo eliminar el cliente');
      }

      // Si llegamos aquí, la eliminación fue exitosa
      await loadClientes();
      handleCloseModal();
      toast.success('Cliente eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      let errorMsg = 'Error al eliminar el cliente';

      if (error instanceof Error) {
        errorMsg += `: ${error.message}`;
      }

      toast.error(errorMsg);
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
    console.log('[onMounted] Hook ejecutado.');
    // Cargar permisos primero
    if (!permissions.permissionsLoaded.value) {
      console.log('[onMounted] Cargando permisos...');
      await permissions.loadPermissions();
      console.log('[onMounted] Permisos cargados.');
    }

    // Luego cargar datos
    console.log('[onMounted] Llamando a loadClientes y loadUsuarios...');
    await loadClientes();
    await loadUsuarios();
    console.log('[onMounted] loadClientes y loadUsuarios completados.');

    // Cargar detalles si estamos en una ruta de detalle
    if (
      route.params.id &&
      (route.name === 'cliente-detalles' || route.name === 'cliente-polizas')
    ) {
      console.log('[onMounted] Llamando a loadClienteDetalle...');
      await loadClienteDetalle(route.params.id.toString());
      console.log('[onMounted] loadClienteDetalle completado.');
    }
    console.log('[onMounted] Hook finalizado.');
  });

  // Añadir la función para cargar usuarios
  const loadUsuarios = async () => {
    try {
      const response = await getUsuariosPorCorreduria(id_correduria.value);
      if (response && response.data) {
        usuarios.value = response.data.map((user) => ({
          id_usuario: user.auth_user_id,
          nombre: user.nombre,
          correo: user.correo,
          auth_user_id: user.auth_user_id,
          fecha_creado: user.fecha_creado,
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

  // Funciones de formato de fecha
  function formatDate(dateString) {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  }

  function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  }
</script>
