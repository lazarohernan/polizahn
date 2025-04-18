<!--
  ModalVerPolizasCliente.vue
  
  Modal para visualizar las pólizas asociadas a un cliente.
  Permite ver el listado de pólizas, crear nuevas y acceder a detalles de pagos.
-->

<template>
  <Teleport to="body">
    <!-- Modal principal -->
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1100] p-4"
      @click="handleModalClose"
    >
      <div
        class="w-full max-w-[800px] h-[calc(100vh-4rem)] max-h-[700px] bg-background rounded-xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] flex flex-col overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 flex-shrink-0 p-4 border-b border-container-border flex items-center justify-between bg-background"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-lg font-semibold text-text m-0">{{ modalTitle }}</h2>
            <button
              v-if="formMode === 'create' && !isAssignPolicyVisible"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
              @click="handleAssignPolicy"
            >
              <Plus class="w-4 h-4" />
              <span>Asignar Póliza</span>
            </button>
          </div>
          <button
            class="p-2 rounded-lg border-none bg-input-bg text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
            @click="handleModalClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 min-h-0 bg-background p-4">
          <!-- Información del cliente (mostrar solo en la vista de lista) -->
          <div 
            v-if="!isAssignPolicyVisible && formMode === 'create'"
            class="p-5 bg-input-bg rounded-xl mb-4"
          >
            <div class="grid grid-cols-3 gap-4">
              <div class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
                <User class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
                <div class="min-w-0">
                  <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5">Cliente</label>
                  <p class="text-sm font-medium text-text truncate">
                    {{ client.nombres + ' ' + (client.apellidos || '') }}
                  </p>
                </div>
              </div>
              <div class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
                <Hash class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
                <div class="min-w-0">
                  <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5">DNI</label>
                  <p class="text-sm font-medium text-text truncate">{{ client.identificacion }}</p>
                </div>
              </div>
              <div class="group relative flex items-start gap-3.5 p-4 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5">
                <Mail class="w-5 h-5 text-primary opacity-70 flex-shrink-0" />
                <div class="min-w-0">
                  <label class="block text-xs font-semibold text-text/70 uppercase tracking-wide mb-1.5">Correo</label>
                  <p class="text-sm font-medium text-text truncate">{{ client.correo }}</p>
                </div>
              </div>
            </div>
          </div>

          <ClientPolicyList
            v-if="!isAssignPolicyVisible && formMode === 'create'"
            :client="client"
            :planes-de-pago="planesDePago"
            @view-policy="handleViewPolicy"
            @view-payments="
              (planId) => {
                console.log('[ModalVerPolizasCliente] Abriendo modal de pagos con ID:', planId);
                pagosStore.abrirModalPagos(planId, client);
                console.log('[ModalVerPolizasCliente] Modal de pagos visible:', pagosStore.modalVisible);
              }
            "
            @delete-plan-de-pago="handleDeletePlanDePago"
          />

          <AssignPolicyForm
            v-else
            :mode="formMode"
            :client="client"
            :plan-de-pago-id="selectedPlanDePagoId ?? ''"
            @save="handleSavePolicy"
            @edit="handleEditPolicy"
            @cancel="handleCancelEdit"
            @has-changes="handleFormChanges"
          />
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div
      v-if="showCloseConfirm"
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[1200] p-4"
      @click="showCloseConfirm = false"
    >
      <div
        class="w-full max-w-[400px] bg-background rounded-xl border border-container-border shadow-lg p-4"
        @click.stop
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 rounded-lg bg-amber-100">
            <AlertTriangle class="w-5 h-5 text-amber-500" />
          </div>
          <h3 class="text-lg font-semibold text-text">Confirmar Salida</h3>
        </div>

        <p class="text-text/70 mb-4 text-sm">
          Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
        </p>

        <div class="flex justify-end gap-3">
          <button
            class="px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-md"
            @click="showCloseConfirm = false"
          >
            Cancelar
          </button>
          <button
            class="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="confirmClose"
          >
            Salir sin Guardar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { X, FileText, Plus, AlertTriangle, User, Hash, Mail } from 'lucide-vue-next';
  import ClientPolicyList from './ClientPolicyList.vue';
  import AssignPolicyForm from './AssignPolicyForm.vue';
  import { usePlanDePago } from '@/composables/usePlanDePago';
  import { Cliente } from '../interfaces/cliente_interface';
  import { usePagosStore } from '@/stores/pagosStore';
  import type { Database } from '@/lib/supabase';
  import { useToast } from 'vue-toastification';
  import { useRoute } from 'vue-router';

  type PlanDePago = Database['public']['Tables']['plan_de_pago']['Row'];

  const toast = useToast();
  const route = useRoute();

  // Obtener el ID del cliente desde las props o de la ruta
  const props = defineProps<{
    show: boolean;
    client: Cliente;
    idCliente: string;
  }>();

  // Computed property para obtener un ID de cliente válido (desde props o ruta)
  const clienteIdValido = computed(() => {
    // Primero intentar obtener desde props directamente
    if (props.idCliente && props.idCliente.trim() !== '') {
      console.log('[ModalVerPolizasCliente] Usando ID desde props:', props.idCliente);
      return props.idCliente;
    } 
    
    // Luego intentar obtener desde la prop client
    if (props.client && props.client.id_cliente) {
      console.log('[ModalVerPolizasCliente] Usando ID desde client.id_cliente:', props.client.id_cliente);
      return props.client.id_cliente;
    }
    
    // Finalmente intentar obtener desde la ruta
    if (route.params.id && typeof route.params.id === 'string') {
      console.log('[ModalVerPolizasCliente] Usando ID desde la ruta:', route.params.id);
      return route.params.id;
    }
    
    console.error('[ModalVerPolizasCliente] No se pudo obtener un ID de cliente válido');
    return '';
  });

  // Logs para depuración - Valores iniciales
  console.log('[ModalVerPolizasCliente] Props recibidos:', {
    show: props.show,
    idCliente: props.idCliente,
    clienteInfo: props.client
  });
  console.log('[ModalVerPolizasCliente] ID de cliente calculado:', clienteIdValido.value);
  console.log('[ModalVerPolizasCliente] Parámetros de ruta:', route.params);
  
  // Si hay un ID calculado, verificar su formato
  if (clienteIdValido.value) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    console.log('[ModalVerPolizasCliente] ¿ID calculado cumple patrón UUID?', uuidPattern.test(clienteIdValido.value));
  }
  
  const emit = defineEmits<{
    close: [];
    viewPayments: [planDePagoId: string];
  }>();

  const formMode = ref<'view' | 'edit' | 'create'>('create');
  const selectedPlanDePagoId = ref<string | null>(null);
  const showCloseConfirm = ref(false);
  const hasFormChanges = ref(false);
  const planesDePago = ref<PlanDePago[]>([]);

  // Composable
  const { getPlanesDePago, deletePlanDePago } = usePlanDePago();

  const pagosStore = usePagosStore();

  const handleViewPolicy = async (planDePagoId: string) => {
    selectedPlanDePagoId.value = planDePagoId;
    formMode.value = 'view';
  };

  const handleEditPolicy = () => {
    formMode.value = 'edit';
  };

  const handleCancelEdit = () => {
    if (formMode.value === 'edit') {
      formMode.value = 'view';
      isAssignPolicyVisible.value = true;
    } else {
      selectedPlanDePagoId.value = null;
      formMode.value = 'create';
      isAssignPolicyVisible.value = false;
    }
  };

  const modalTitle = computed(() => {
    if (formMode.value === 'view') {
      return 'Detalles de la Póliza';
    }
    if (formMode.value === 'edit') {
      return 'Editar Póliza';
    }
    return isAssignPolicyVisible.value ? 'Asignar Nueva Póliza' : 'Pólizas del Cliente';
  });

  const isAssignPolicyVisible = ref(false);

  const handleModalClose = () => {
    if (!hasFormChanges.value || formMode.value === 'view') {
      handleClose();
      return;
    }
    showCloseConfirm.value = true;
  };

  const handleClose = () => {
    isAssignPolicyVisible.value = false;
    hasFormChanges.value = false;
    emit('close');
  };

  const confirmClose = () => {
    showCloseConfirm.value = false;
    handleClose();
  };

  const handleAssignPolicy = () => {
    isAssignPolicyVisible.value = true;
  };

  const handleFormChanges = (hasChanges: boolean) => {
    hasFormChanges.value = hasChanges;
  };

  const handleSavePolicy = async () => {
    try {
      // La lógica de guardar ahora está en AssignPolicyForm usando usePlanDePago
      handleClose();
      await loadPlanesDePago();
      toast.success('Póliza guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la póliza:', error);
      toast.error('Error al guardar la póliza');
    }
  };

  const handleDeletePlanDePago = async (id: string) => {
    try {
      const { ok, message } = await deletePlanDePago(id);
      if (ok) {
        await loadPlanesDePago();
        toast.success('Plan de pago eliminado correctamente');
      } else {
        throw new Error(message);
      }
    } catch (error) {
      console.error('Error al eliminar el plan de pago:', error);
      toast.error('Error al eliminar el plan de pago');
    }
  };

  const loadPlanesDePago = async () => {
    try {
      // Usar el clienteId computado para validación y carga
      const idCliente = clienteIdValido.value;
      
      // Verificar que idCliente es un UUID válido
      if (!idCliente || idCliente.trim() === '') {
        console.error('[ModalVerPolizasCliente] Error: No se pudo obtener un ID de cliente válido para cargar pólizas', {
          propsIdCliente: props.idCliente,
          clienteObjeto: props.client,
          rutaParams: route.params,
          idCalculado: idCliente
        });
        toast.error('No se puede cargar las pólizas: ID de cliente no válido');
        return;
      }
      
      // Verificar formato UUID básico (patrón simplificado)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(idCliente)) {
        console.error('[ModalVerPolizasCliente] Error: ID cliente no tiene formato UUID válido', {
          idClienteRecibido: idCliente,
          formatoEsperado: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (UUID v4)'
        });
        toast.error('ID de cliente con formato inválido');
        return;
      }
      
      console.log('[ModalVerPolizasCliente] Cargando planes de pago para cliente:', idCliente);
      const { data, ok, message } = await getPlanesDePago(idCliente);
      
      if (!ok) {
        console.error('[ModalVerPolizasCliente] Error al cargar planes de pago:', message);
        toast.error(`Error al cargar planes de pago: ${message}`);
        return;
      }
      
      planesDePago.value = data;
      console.log('[ModalVerPolizasCliente] Planes de pago cargados:', {
        cantidad: data.length,
        datos: data
      });
    } catch (error) {
      console.error('[ModalVerPolizasCliente] Error al cargar los planes de pago:', error);
      toast.error('Error al cargar los planes de pago');
    }
  };

  onMounted(async () => {
    console.log('[ModalVerPolizasCliente] Componente montado. ID cliente calculado:', clienteIdValido.value);
    await loadPlanesDePago();
  });

  watch(
    () => props.show,
    async (newValue) => {
      console.log('[ModalVerPolizasCliente] Modal visibilidad cambiada:', {
        visible: newValue,
        idClienteCalculado: clienteIdValido.value
      });
      if (newValue) {
        await loadPlanesDePago();
      }
    }
  );
  
  // Añadir vigilancia específica para el ID calculado
  watch(
    clienteIdValido,
    (newValue, oldValue) => {
      console.log('[ModalVerPolizasCliente] ID calculado ha cambiado:', {
        anterior: oldValue,
        nuevo: newValue
      });
      if (newValue && newValue !== oldValue) {
        loadPlanesDePago();
      }
    }
  );
</script>
