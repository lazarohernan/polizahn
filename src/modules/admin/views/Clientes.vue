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
          <div v-else-if="displayItems.length > 0" class="overflow-auto">
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
                  v-for="(client, index) in displayItems"
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
                    <div class="flex items-center justify-center space-x-3">
                      <PermissionWrapper requires="clientes_view">
                        <button
                          class="p-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 flex items-center justify-center"
                          @click="() => toClienteDetails(client.id_cliente)"
                          title="Ver detalles del cliente"
                        >
                          <Eye class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </PermissionWrapper>
                      <PermissionWrapper requires="polizas_view">
                        <button
                          class="p-2 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200 flex items-center justify-center"
                          @click="viewClientPolicies(client.id_cliente)"
                          title="Ver pólizas del cliente"
                        >
                          <FileText class="h-5 w-5" aria-hidden="true" />
                        </button>
                      </PermissionWrapper>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- No hay resultados -->
          <div v-else-if="searchQuery && displayItems.length === 0 && !loading" class="p-12 text-center">
            <Search class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-2">No se encontraron clientes para "{{ searchQuery }}"</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">
              Intenta con otros términos de búsqueda
            </p>
          </div>
          <div v-else-if="!searchQuery && displayItems.length === 0 && !loading" class="p-12 text-center">
            <UserX class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-2">Aún no hay clientes registrados</p>
            <PermissionWrapper requires="clientes_create">
                <button 
                  class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  @click="openAddClientModal"
                >Nuevo Cliente</button>
            </PermissionWrapper>
          </div>
        </div>
      </div>

      <!-- Modales basados en rutas -->
      <template v-if="!isListView">
        <!-- Mostrar el estado de modalCargando -->
        <div v-if="loading" class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100]">
          <div class="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <Loader class="w-12 h-12 animate-spin text-primary mb-4" />
            <h3 class="text-lg font-semibold">Cargando información...</h3>
            <p class="text-sm text-gray-500 mt-2">Por favor espere mientras cargamos los datos.</p>
          </div>
        </div>

        <!-- Modal de detalles del cliente -->
        <ModalVerCliente
          v-if="currentModal === 'details' && selectedClientWithCorreduria"
          :show="true"
          :client="selectedClientWithCorreduria"
          :id-usuario-correduria="selectedClientWithCorreduria.id_usuario_correduria ?? ''"
          @close="handleCloseModal"
          @updateClient="handleUpdateClient"
          @deleteClient="handleDeleteClient"
        />

        <!-- Modal de pólizas del cliente -->
        <ModalVerPolizasCliente
          v-if="currentModal === 'policies' && selectedClientWithCorreduria"
          :show="true"
          :client="selectedClientWithCorreduria"
          :id-cliente="selectedClientWithCorreduria.id_cliente"
          @close="handleCloseModal"
          @view-payments="handleViewPayments"
        />

        <!-- Debug información para modal de pagos -->
        <div 
          v-if="route.name === 'cliente-pagos' && !selectedClientWithCorreduria" 
          class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1100]"
        >
          <div class="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <AlertTriangle class="w-12 h-12 text-yellow-500 mb-4" />
            <h3 class="text-lg font-semibold">Error de Visualización</h3>
            <p class="text-sm text-gray-500 mt-2">
              La ruta de pagos ha sido reemplazada con un sistema centralizado de modales.
              <br>Si llegaste aquí desde un enlace antiguo, por favor utiliza la nueva interfaz.
            </p>
            <button 
              class="mt-4 px-4 py-2 bg-primary text-white rounded-lg" 
              @click="router.push({ name: 'clientes' })"
            >
              Volver a Clientes
            </button>
          </div>
        </div>

        <!-- Modal para agregar cliente -->
        <ModalAgregarCliente
          v-if="currentModal === 'new'"
          :show="true"
          :id-correduria="id_correduria"
          @close="handleCloseModal"
          @create="handleCreateClient"
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
  import ModalVerCliente from '@/modules/admin/components/ModalVerCliente.vue';
  import ModalAgregarCliente from '@/modules/admin/components/ModalAgregarCliente.vue';
  import ModalVerPolizasCliente from '@/modules/admin/components/ModalVerPolizasCliente.vue';
  import PermissionWrapper from '@/components/PermissionWrapper.vue';
  import { Plus, Mail, Phone, Eye, FileText, Users, Search, UserX, AlertCircle, Loader, AlertTriangle } from 'lucide-vue-next';
  import { useToast } from 'vue-toastification';
  import { useAuthStore } from '@/stores/auth.store';
  import { storeToRefs } from 'pinia';
  import type { Cliente as ClienteInterface } from '@/modules/admin/interfaces/cliente_interface';
  import { usePagosStore } from '@/stores/pagosStore';

  // Tipo de base de datos para la tabla clientes
  type ClienteDB = Database['public']['Tables']['clientes']['Row'];

  // Extender ClienteInterface con campos adicionales y asegurar valores null para opcionales
  interface Cliente extends ClienteInterface {
    empresa: string | null;
    tel_1: string | null;
    tel_2: string | null;
    dob: Date | null;
    foto: string | null; // Añadido temporalmente para compatibilidad, será eliminado más adelante
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
  const { getClientes, getClienteById } = useClientes();
  const { id_correduria } = storeToRefs(useAuthStore());
  const {
    searchClients,
    filteredItems,
  } = useSearchClients();
  const { getUsuariosPorCorreduria } = useUsuarios();
  const permissions = usePermissions();

  // Props inyectadas por la ruta
  const props = defineProps<{
    id?: string; // id del cliente
    planDePagoId?: string; // id del plan de pago (opcional)
  }>();

  // Estado - Usar el tipo Cliente extendido
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const clientes = ref<Cliente[]>([]);
  const selectedClient = ref<Cliente | null>(null);
  const searchQuery = ref('');
  const paginaActual = ref(1);
  const limite = ref(10);
  const totalRegistros = ref(0);
  const usuarios = ref<Usuario[]>([]);

  // Computed Properties
  const isListView = computed(() => {
    // Verificar si estamos en la ruta principal de clientes (lista) o en una subruta (modal)
    const modalRoutes = ['cliente-detalles', 'cliente-nuevo', 'cliente-polizas', 'cliente-pagos'];
    return !modalRoutes.includes(route.name as string);
  });
  
  const currentModal = computed(() => {
    let modal: 'details' | 'new' | 'policies' | 'payments' | null = null;
    switch (route.name) {
      case 'cliente-detalles':
        modal = 'details';
        break;
      case 'cliente-nuevo':
        modal = 'new';
        break;
      case 'cliente-polizas':
        modal = 'policies';
        break;
      case 'cliente-pagos':
        modal = 'payments';
        break;
    }
    console.log('currentModal:', modal, 'route.name:', route.name);
    return modal;
  });

  // Computed devuelve el tipo Cliente extendido
  const selectedClientWithCorreduria = computed<Cliente | null>(() => {
    const client = selectedClient.value;
    console.log('selectedClientWithCorreduria:', client ? 'Cliente disponible' : 'null');
    return client;
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
      fecha_creado: clienteDB.fecha_creado ? new Date(clienteDB.fecha_creado) : null,
      creado_por: clienteDB.creado_por,
      fecha_modificado: clienteDB.fecha_modificado ? new Date(clienteDB.fecha_modificado) : null,
      modificado_por: clienteDB.modificado_por,
      foto: null, // Añadido temporalmente como null hasta implementar la funcionalidad
      direccion: clienteDBExt.direccion || null,
      id_usuario_correduria: clienteDBExt.id_usuario_correduria || null,
      total_polizas: 0,
      clientes_por_correduria: correduriaRels, // Asignar el array mapeado
    };
  };

  // NUEVA PROPIEDAD COMPUTADA
  const displayItems = computed(() => {
    if (searchQuery.value && searchQuery.value.length >= 2) {
      return filteredItems.value;
    }
    return clientes.value;
  });

  // Watch para la búsqueda
  watch(searchQuery, async (newQuery) => {
    try {
      if (newQuery.length >= 2) {
        // searchClients actualiza filteredItems internamente
        await searchClients(newQuery, id_correduria.value);
        // No debemos modificar clientes.value aquí, displayItems se encarga
      } else if (newQuery.length === 0) {
        // Si la búsqueda se borra, recargar la lista completa
        await loadClientes();
      }
    } catch (error) {
      console.error("Error en el watcher de búsqueda:", error);
    }
  });

  // Watch para el cambio de ruta (usando props.id)
  watch(
    () => props.id,
    async (newId, oldId) => {
      console.log('Watch props.id: newId =', newId, 'oldId =', oldId, 'route.name =', route.name);
      
      // Solo cargar si estamos en una ruta que necesita los detalles del cliente
      if (newId && ['cliente-detalles', 'cliente-polizas', 'cliente-pagos'].includes(route.name as string)) {
        // Verificar si ya tenemos el cliente cargado con el mismo ID
        if (selectedClient.value?.id_cliente !== newId) {
          console.log('ID de cliente cambiado, cargando nuevo cliente...');
          selectedClient.value = null; // Limpiar el cliente actual
          await loadClienteDetalle(newId);
        } else {
          console.log('Cliente ya cargado, no es necesario volver a cargar');
        }
      } else if (!newId && selectedClient.value && isListView.value) {
        // Si no hay ID y estamos volviendo a la vista de lista, limpiar el cliente seleccionado
        console.log('Volviendo a vista de lista, limpiando cliente seleccionado');
        selectedClient.value = null;
      }
    },
    { immediate: true },
  );

  // Función para cargar detalles del cliente
  const loadClienteDetalle = async (id: string) => {
    if (!id) {
      console.error('loadClienteDetalle: ID es null o vacío');
      return;
    }

    console.log('loadClienteDetalle iniciado con id:', id);
    loading.value = true;
    error.value = null;
    
    try {
      // Verificar si ya tenemos el cliente en la lista local
      const clienteEnLista = clientes.value.find(c => c.id_cliente === id);
      if (clienteEnLista) {
        console.log('Cliente encontrado en la lista local:', clienteEnLista.nombres);
        selectedClient.value = clienteEnLista;
      } else {
        // Si no está en la lista, cargarlo desde el servidor
        console.log('Cliente no encontrado en lista local, cargando desde servidor...');
        const clienteDB = await getClienteById(id);
        console.log('getClienteById respuesta:', clienteDB ? 'Cliente encontrado' : 'Cliente no encontrado');
        
        if (clienteDB) {
          const clienteConvertido = convertClienteDBToCliente(clienteDB);
          console.log('convertClienteDBToCliente resultado:', clienteConvertido ? 'Conversión exitosa' : 'Error en conversión');
          
          if (clienteConvertido) {
            selectedClient.value = clienteConvertido;
            
            // Agregar a la lista local si no existe
            if (!clientes.value.some(c => c.id_cliente === id)) {
              clientes.value.push(clienteConvertido);
            }
          } else {
            throw new Error('Error al convertir los datos del cliente');
          }
        } else {
          throw new Error('No se encontró el cliente con ID: ' + id);
        }
      }
    } catch (err) {
      console.error('Error en loadClienteDetalle:', err);
      error.value = err as Error;
      toast.error('Error al cargar los detalles del cliente: ' + (err instanceof Error ? err.message : String(err)));
      selectedClient.value = null;
      router.push({ name: 'clientes' });
    } finally {
      loading.value = false;
      console.log('loadClienteDetalle completado, selectedClient:', selectedClient.value ? `Cliente ${selectedClient.value.nombres} asignado` : 'null');
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

  // Navegación a detalles del cliente
  const toClienteDetails = async (idCliente: string) => {
    console.log('toClienteDetails llamado con id:', idCliente);
    
    try {
      // Primero cargar los datos del cliente
      loading.value = true;
      
      // Verificar si ya tenemos el cliente en la lista local
      const clienteEnLista = clientes.value.find(c => c.id_cliente === idCliente);
      if (clienteEnLista) {
        console.log('Cliente encontrado en la lista local, asignando:', clienteEnLista.nombres);
        selectedClient.value = clienteEnLista;
      } else {
        // Si no está en la lista, cargarlo desde el servidor
        console.log('Cliente no encontrado en lista local, cargando desde servidor...');
        await loadClienteDetalle(idCliente);
      }
      
      // Verificar que se haya cargado correctamente
      if (selectedClient.value) {
        console.log('Cliente cargado correctamente, navegando a detalles:', selectedClient.value.nombres);
        
        // Ahora que tenemos el cliente, navegar a la ruta de detalles
        router.push({
          name: 'cliente-detalles',
          params: { id: idCliente },
        });
      } else {
        throw new Error('No se pudo cargar la información del cliente');
      }
    } catch (error) {
      console.error('Error al cargar detalles del cliente:', error);
      toast.error('Error al cargar los detalles del cliente: ' + 
                  (error instanceof Error ? error.message : String(error)));
    } finally {
      loading.value = false;
    }
  };

  // Navegación a "Nuevo Cliente"
  const openAddClientModal = () => {
    router.push({ name: 'cliente-nuevo' });
  };

  // Manejar el cierre del modal (volver a listado)
  const handleCloseModal = () => {
    if (isListView.value) return; // Solo realizar si estamos en vista modal
    router.push({ name: 'clientes' });
  };

  // Manejar la actualización de un cliente
  const handleUpdateClient = (cliente: Cliente) => {
    // Actualizar en el arreglo local primero
    const index = clientes.value.findIndex((c) => c.id_cliente === cliente.id_cliente);
    if (index !== -1) {
      clientes.value[index] = { ...clientes.value[index], ...cliente };
    }

    // Actualizar vista modal si es necesario
    if (selectedClient.value?.id_cliente === cliente.id_cliente) {
      selectedClient.value = { ...selectedClient.value, ...cliente };
    }

    // Navegar de vuelta al listado
    router.push({ name: 'clientes' });
    toast.success('Cliente actualizado exitosamente');
  };

  // Manejar el borrado de un cliente
  const handleDeleteClient = (idCliente: string) => {
    // Eliminar del arreglo local primero
    clientes.value = clientes.value.filter((c) => c.id_cliente !== idCliente);
    
    // Navegar de vuelta al listado
    router.push({ name: 'clientes' });
    toast.success('Cliente eliminado exitosamente');
  };

  // Manejar la creación de un cliente
  const handleCreateClient = () => {
    // Función simplificada para cerrar el modal y actualizar la UI
    router.push({ name: 'clientes' });
    toast.success('Cliente creado exitosamente');
  };

  // Methods - Acciones CRUD
  
  // Añadir una función para navegar a la vista completa de pólizas del cliente
  const viewClientPolicies = async (clientId: string) => {
    console.log("viewClientPolicies llamado con id:", clientId);
    
    // Validar que el ID del cliente sea válido
    if (!clientId || clientId.trim() === '') {
      console.error("Error: ID del cliente no válido:", clientId);
      toast.error("No se puede mostrar las pólizas: ID de cliente no válido");
      return;
    }
    
    // Asegurarnos de tener los datos del cliente antes de navegar
    try {
      loading.value = true;
      // Si el cliente seleccionado es diferente al que estamos intentando ver
      if (!selectedClient.value || selectedClient.value.id_cliente !== clientId) {
        console.log("Cliente actual no coincide, cargando nuevo cliente:", clientId);
        await loadClienteDetalle(clientId);
      }
      
      // Verificar que el cliente se haya cargado correctamente
      if (!selectedClient.value || selectedClient.value.id_cliente !== clientId) {
        console.error("Error: No se pudo cargar el cliente antes de mostrar pólizas");
        toast.error("No se pudo cargar el cliente. Inténtalo de nuevo.");
        return;
      }
      
      // Si llegamos aquí, tenemos el cliente cargado, navegamos
      console.log("Navegando a vista de pólizas con ID cliente:", clientId);
      router.push({
        name: 'cliente-polizas',
        params: { id: clientId }
      });
    } catch (error) {
      console.error("Error al preparar navegación a pólizas:", error);
      toast.error("Error al cargar información necesaria para mostrar pólizas");
    } finally {
      loading.value = false;
    }
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

    // Cargar detalles si estamos en una ruta de detalle (usando props.id)
    if (
      props.id &&
      (route.name === 'cliente-detalles' || route.name === 'cliente-polizas' || route.name === 'cliente-pagos')
    ) {
      console.log('[onMounted] Llamando a loadClienteDetalle con ID de prop...');
      await loadClienteDetalle(props.id);
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

  // Manejar el evento viewPayments en el componente ViewClientPolicyModal
  const handleViewPayments = async (planDePagoId: string) => {
    try {
      console.log("Abriendo modal de pagos para el plan:", planDePagoId);
      
      const clientId = selectedClientWithCorreduria.value?.id_cliente;
      console.log("Cliente seleccionado:", selectedClientWithCorreduria.value);
      
      if (!clientId) {
        console.error("Error: No se pudo obtener el ID del cliente");
        toast.error("No se pudo mostrar los pagos: ID de cliente no disponible");
        return;
      }

      // Verificar que tengamos datos del cliente antes de abrir el modal
      if (!selectedClient.value || selectedClient.value.id_cliente !== clientId) {
        loading.value = true;
        console.log("Cargando datos del cliente antes de abrir modal...");
        
        await loadClienteDetalle(clientId);
        
        // Verificar de nuevo después de la carga
        if (!selectedClient.value) {
          throw new Error("No se pudo cargar la información del cliente");
        }
      }
      
      // Usar el store de pagos para abrir el modal
      const pagosStore = usePagosStore();
      pagosStore.abrirModalPagos(planDePagoId, selectedClient.value);
      
      console.log("Modal de pagos abierto con éxito");
    } catch (error) {
      console.error("Error al abrir el modal de pagos:", error);
      toast.error(`Error al mostrar los pagos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      loading.value = false;
    }
  };
</script>
