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
          <ClientPolicyList
            v-if="!isAssignPolicyVisible && formMode === 'create'"
            :client="client"
            :planes-de-pago="planesDePago"
            @view-policy="handleViewPolicy"
            @view-payments="
              (id) => {
                emit('viewPayments', id);
                handleClose();
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
  import { X, FileText, Plus, AlertTriangle } from 'lucide-vue-next';
  import ClientPolicyList from './ClientPolicyList.vue';
  import AssignPolicyForm from './AssignPolicyForm.vue';
  import {
    createPlanDePagoAction,
    deletePlanDePagoAction,
    getPlanesDePagoAction,
    updatePlanDePagoAction,
  } from '../actions/plan_de_pago_actions';
  import { Cliente } from '../interfaces/cliente_interface';
  import {
    CreatePlanDePagoDTO,
    PlanDePago,
    UpdatePlanDePagoDTO,
  } from '../interfaces/plan_de_pago_interface';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const props = defineProps<{
    show: boolean;
    client: Cliente;
    idCliente: string;
  }>();

  const emit = defineEmits<{
    close: [];
    viewPayments: [planDePagoId: string];
  }>();

  const formMode = ref<'view' | 'edit' | 'create'>('create');
  const selectedPlanDePagoId = ref<string | null>(null);
  const showCloseConfirm = ref(false);
  const hasFormChanges = ref(false);
  const planesDePago = ref<PlanDePago[]>([]);

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

  const handleFormChanges = (changes: boolean) => {
    hasFormChanges.value = changes;
  };

  const handleSavePolicy = async (data: CreatePlanDePagoDTO | UpdatePlanDePagoDTO) => {
    try {
      const formData = new FormData();
      //Propia para UpdatePlanDePagoDTO
      if ('id_plan' in data) {
        formData.append('id_plan', String(data.id_plan ?? ''));
      }
      if ('id_cliente' in data) {
        formData.append('id_cliente', String(data.id_cliente ?? ''));
      }
      formData.append('id_poliza', String(data.id_poliza ?? ''));
      formData.append('prima_total', String(data.prima_total ?? 0));
      formData.append('plazo', String(data.plazo ?? 0));
      formData.append('fecha_de_pago', String(data.fecha_de_pago ?? ''));
      formData.append('pago_uno', String(data.pago_uno ?? 0));

      if (data.numero_poliza) {
        formData.append('numero_poliza', data.numero_poliza);
      }

      if (data.observacion) {
        formData.append('observacion', data.observacion);
      }

      if ('archivo_poliza' in data && data.archivo_poliza instanceof File) {
        formData.append('archivo_poliza', data.archivo_poliza);
      }

      let response;
      // llamada a la API para guardar los datos
      if (formData.get('id_plan')) {
        response = await updatePlanDePagoAction(formData);
      } else {
        response = await createPlanDePagoAction(formData);
      }
      if (response.ok) {
        //Volver a cargar los planes de pago
        const response = await getPlanesDePagoAction(props.client.id_cliente ?? '');
        planesDePago.value = response.data;

        selectedPlanDePagoId.value = null;
        formMode.value = 'create';
        isAssignPolicyVisible.value = false;
        hasFormChanges.value = false;

        toast.success('Registro procesado exitosamente!');
      } else {
        toast.error('Ocurrió un error al procesar el registro!');
      }
    } catch (error) {
      console.error('Error al procesar el registro:', error);
      toast.error('Ocurrió un error al procesar el registro!');
    }
  };

  const handleDeletePlanDePago = async (planDePagoId: string) => {
    try {
      const response = await deletePlanDePagoAction(planDePagoId);
      if (response.ok) {
        //Volver a cargar los planes de pago
        const response = await getPlanesDePagoAction(props.client.id_cliente ?? '');
        planesDePago.value = response.data;
        toast.success('Póliza eliminada exitosamente!');
      } else {
        toast.error('Ocurrió un error al eliminar la póliza!');
      }
    } catch (error) {
      console.error('Error al eliminar la póliza:', error);
      toast.error('Ocurrió un error al eliminar la póliza!');
    }
  };

  onMounted(async () => {
    try {
      const response = await getPlanesDePagoAction(props.client.id_cliente ?? '');
      planesDePago.value = response.data;
    } catch (error) {
      console.error('Error al cargar aseguradoras:', error);
    }
  });

  //Si cambia de usuario, se actualiza la lista de pólizas
  watch(
    () => props.idCliente,
    async (newValue: string) => {
      try {
        const response = await getPlanesDePagoAction(newValue);
        planesDePago.value = response.data;
      } catch (error) {
        console.error('Error al cargar aseguradoras:', error);
      }
    },
  );
</script>
