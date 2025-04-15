import { computed, defineComponent, defineAsyncComponent, ref, watch } from 'vue';
import { usePagination } from '@/modules/admin/composables/usePagination';
import SearchBar from '@/modules/common/components/SearchBar.vue';
import PaginationButtons from '@/modules/common/components/PaginationButtons.vue';
import { useSearch } from '@/composables/useSearch';
import { useExport } from '@/composables/useExport';
import ViewClientPolicyModal from '@/modules/admin/components/ViewClientPolicyModal.vue';
import {
  Plus,
  Mail,
  Phone,
  MapPin,
  Eye,
  FileText,
  Coins,
  Filter as Fl,
  Users,
  Search,
} from 'lucide-vue-next';
import type { Client } from '@/types/client';
import { useQueryClient } from '@tanstack/vue-query';
import {
  createClienteAction,
  deleteClienteAction,
  getClientesAction,
  updateClienteAction,
} from '../actions/clientes_actions';
import { Cliente } from '../interfaces/cliente_interface';
import { useToast } from 'vue-toastification';

// Lazy load modals
const ViewClientModal = defineAsyncComponent(
  () => import('@/modules/admin/components/ViewClientModal.vue'),
);
const AddClientModal = defineAsyncComponent(
  () => import('@/modules/admin/components/AddClientModal.vue'),
);
const ViewClientPaymentsModal = defineAsyncComponent(
  () => import('@/modules/admin/components/ViewClientPaymentsModal.vue'),
);

const ExportOptionsModal = defineAsyncComponent(
  () => import('@/components/ExportOptionsModal.vue'),
);

// Interfaz para las pólizas de clientes
interface Policy {
  id: number;
  number: string;
  name: string;
  term: number;
  status: 'vigente' | 'vencida';
}

export default defineComponent({
  components: {
    SearchBar,
    ViewClientModal,
    AddClientModal,
    ViewClientPaymentsModal,
    ViewClientPolicyModal,
    ExportOptionsModal,
    PaginationButtons,
    Plus,
    Mail,
    Phone,
    MapPin,
    Eye,
    FileText,
    Coins,
    Fl,
    Users,
    Search,
  },
  setup() {
    const toast = useToast();
    //Obtener una instancia del queryClient
    const queryClient = useQueryClient();

    // Estados para control de modales
    const showClientModal = ref(false);
    const showAddModal = ref(false);
    const showPaymentsModal = ref(false);
    const showPolicyModal = ref(false);
    const showExportModal = ref(false);
    const selectedClient = ref<Cliente | null>(null);
    const selectedPolicy = ref<Policy | null>(null);
    const selectedPlanDePagoId = ref<string>('');
    //Obtener el id_correduria del localstorage
    const id_correduria = localStorage.getItem('id_correduria') ?? '';
    const isLoading = ref(false);
    // Configuración de paginación
    const { page } = usePagination();
    const itemsPerPage = ref(10);
    const totalPages = ref(1);
    const clientes = ref<Cliente[]>([]);

    // Cargar datos desde la API
    const loadClientes = async () => {
      isLoading.value = true;
      try {
        const response = await getClientesAction(id_correduria, page.value, itemsPerPage.value);
        clientes.value = response.data;
        totalPages.value = response.totalPaginas;
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        // En caso de error, mostrar lista vacía
        clientes.value = [];
        totalPages.value = 1;
      } finally {
        isLoading.value = false;
      }
    };

    // Cargar datos iniciales
    loadClientes();

    // Recargar cuando cambie la página
    watch(page, () => {
      loadClientes();
      // Scroll hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Prefetch de la siguiente página
    const prefetchNextPage = async () => {
      const nextPage = page.value + 1;
      if (nextPage <= totalPages.value) {
        try {
          await getClientesAction(id_correduria, nextPage, itemsPerPage.value);
        } catch (error) {
          console.warn('Error al precargar la siguiente página:', error);
        }
      }
    };

    // Precargar la siguiente página después de cargar la actual
    watch(isLoading, (loading) => {
      if (!loading) {
        prefetchNextPage();
      }
    });

    // Composables para funcionalidades específicas
    const { searchQuery, filteredItems } = useSearch<Cliente>(clientes, [
      'nombres',
      'identificacion',
      'apellidos',
      'tel_1',
      'correo',
    ]);
    const { exportToCSV, exportToPDF } = useExport();

    // Calcular elementos paginados (para búsqueda local)
    const paginatedItems = computed(() => {
      // Si hay una búsqueda activa, paginar los resultados filtrados localmente
      if (searchQuery.value) {
        const startIndex = (page.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredItems.value.slice(startIndex, endIndex);
      }
      // Si no hay búsqueda, usar los datos ya paginados desde la API
      return filteredItems.value;
    });

    // Calcular si es la primera página
    const isFirstPage = computed(() => page.value <= 1);

    // Calcular si hay más páginas
    const hasMorePages = computed(() => {
      if (searchQuery.value) {
        // Si hay búsqueda, calcular basado en resultados filtrados
        return page.value >= Math.ceil(filteredItems.value.length / itemsPerPage.value);
      }
      // Si no hay búsqueda, usar totalPages de la API
      return page.value >= totalPages.value;
    });

    /**
     * Obtiene las iniciales de un nombre completo
     * @param name Nombre completo
     * @returns Las dos primeras iniciales
     */
    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    };

    /**
     * Maneja la visualización del modal de detalles del cliente
     */
    const handleViewClient = (clientId: string): void => {
      selectedClient.value = clientes.value.find((c) => c.id_cliente === clientId) || null;
      showClientModal.value = true;
    };

    /**
     * Cierra el modal de detalles del cliente y limpia la selección
     */
    const handleCloseModal = (): void => {
      showClientModal.value = false;
      selectedClient.value = null;
    };

    /**
     * Maneja la visualización del modal de pólizas del cliente
     */
    const handleViewPolicies = (clientId: string): void => {
      selectedClient.value = clientes.value.find((c) => c.id_cliente === clientId) || null;
      if (selectedClient.value) {
        showPolicyModal.value = true;
      }
    };

    const handleViewPayments = (planDePagoId: string): void => {
      selectedPlanDePagoId.value = planDePagoId;
      if (selectedClient.value) {
        showPaymentsModal.value = true;
      }
    };

    /**
     * Actualiza los datos de un cliente existente
     */
    const handleUpdateClient = async (data: FormData): Promise<void> => {
      try {
        // Llamar a la API para actualizar el cliente
        const resp = await updateClienteAction(data);
        if (resp.ok) {
          // ❗ Invalidar la consulta para forzar actualización de datos
          await queryClient.invalidateQueries({ queryKey: [{ action: 'clientes' }] });

          // Cerrar el modal
          handleCloseModal();

          toast.success('Cliente actualizado exitosamente!');
        } else {
          toast.error('Ocurrió un error al actualizar el cliente!');
        }
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
        toast.error('Ocurrió un error al actualizar el cliente!');
      }
    };

    /**
     * Elimina un cliente existente
     */
    const handleDeleteClient = async (clientId: string): Promise<void> => {
      try {
        // Llamar a la API para eliminar el cliente
        const resp = await deleteClienteAction(clientId);
        if (resp.ok) {
          // ❗ Invalidar la consulta para forzar actualización de datos
          await queryClient.invalidateQueries({ queryKey: [{ action: 'clientes' }] });

          // Cerrar el modal
          handleCloseModal();

          toast.success('Cliente eliminado exitosamente!');
        } else {
          toast.error('Ocurrió un error al eliminar el cliente!');
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        toast.error('Ocurrió un error al eliminar el cliente!');
      }
    };

    /**
     * Agrega un nuevo cliente a la lista
     */
    const handleAddClient = async (data: FormData): Promise<void> => {
      try {
        // Llamar a la API para crear la aseguradora
        const resp = await createClienteAction(data);
        if (resp.ok) {
          // ❗ Invalidar la consulta para forzar actualización de datos
          await queryClient.invalidateQueries({ queryKey: [{ action: 'clientes' }] });

          // Cerrar el modal
          showAddModal.value = false;

          toast.success('Registro agregado exitosamente!');
        } else {
          toast.error('Ocurrió un error al agregar el registro!');
        }
      } catch (error) {
        console.error('Error al agregar cliente:', error);
        toast.error('Ocurrió un error al agregar el registro!');
      }
    };

    const handleExport = (format: 'pdf' | 'csv', data: Client[]) => {
      const exportData = data.map((client) => ({
        Nombre: client.name,
        DNI: client.dni,
        RTN: client.rtn || 'N/A',
        'Fecha de Nacimiento': client.birthDate
          ? new Date(client.birthDate).toLocaleDateString('es-HN')
          : 'N/A',
        Email: client.email,
        Empresa: client.company || 'N/A',
        'Teléfono Principal': client.phone || 'N/A',
        'Teléfono Alternativo': client.alternativePhone || 'N/A',
        Dirección: client.address || 'N/A',
        Pólizas: client.insuranceCount,
        Estado: client.status === 'active' ? 'Activo' : 'Inactivo',
        'Última Actualización': new Date(client.lastUpdate).toLocaleDateString('es-HN'),
      }));

      if (format === 'pdf') {
        exportToPDF(exportData, { filename: 'clientes.pdf' });
      } else {
        exportToCSV(exportData, { filename: 'clientes.csv' });
      }
    };

    /**
     * Maneja el cambio en el número de elementos por página
     */
    const handleItemsPerPageChange = (newValue: number) => {
      // Actualizar el valor de itemsPerPage
      itemsPerPage.value = newValue;

      // Resetear a la página 1 cuando cambie el número de elementos por página
      if (page.value !== 1) {
        page.value = 1;
      } else {
        // Si ya estamos en la página 1, forzar la recarga
        loadClientes();
      }
    };

    return {
      //Properties
      searchQuery,
      filteredItems,
      showClientModal,
      showAddModal,
      showPaymentsModal,
      showPolicyModal,
      showExportModal,
      selectedClient,
      selectedPolicy,
      clientes,
      isLoading,
      page,
      itemsPerPage,
      totalPages,
      paginatedItems,
      isFirstPage,
      hasMorePages,
      selectedPlanDePagoId,

      //Actions
      getInitials,
      handleViewClient,
      handleCloseModal,
      handleViewPolicies,
      handleUpdateClient,
      handleAddClient,
      handleExport,
      handleDeleteClient,
      prefetchNextPage,
      handleItemsPerPageChange,
      handleViewPayments,
    };
  },

  methods: {
    getImageSrc(foto: string | File | undefined): string {
      if (!foto) return ''; // Si no hay foto, devuelve una cadena vacía
      if (typeof foto === 'string') return foto; // Si ya es una URL, úsala directamente
      return URL.createObjectURL(foto); // Si es un File, crea una URL temporal
    },
  },
});
