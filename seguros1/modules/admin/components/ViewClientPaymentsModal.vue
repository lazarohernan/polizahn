<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1100] p-6"
      @click="handleClose"
    >
      <div
        class="w-full max-w-[900px] max-h-[calc(100vh-3rem)] bg-background border border-container-border rounded-3xl shadow-[0_8px_32px_var(--container-shadow)] flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 p-5 border-b border-container-border flex items-center justify-between bg-background backdrop-blur-sm rounded-t-3xl"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-xl font-semibold text-text">Pagos de Póliza</h2>
          </div>
          <button
            class="p-2 rounded-lg text-text transition-all duration-300 hover:bg-primary hover:text-white"
            @click="handleClose"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <!-- Información del Cliente -->
          <ClientInfoCard :client="client" :plan-de-pago="planDePago" />

          <!-- Sección de Pagos o Formulario -->
          <div v-if="!showAddPaymentModal && !showPaymentDetailsModal" class="flex flex-col gap-4">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-baseline gap-3">
                <h3 class="text-lg font-semibold text-text">Pagos Realizados</h3>
                <span class="text-sm text-text/70">{{ payments.length }} pagos</span>
              </div>
              <button
                class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
                @click="showAddPaymentModal = true"
              >
                <Plus class="w-4 h-4" />
                <span>Agregar Pago</span>
              </button>
            </div>

            <!-- Tabla de Pagos -->
            <PaymentTable
              :payments="payments"
              @view="handleViewPayment"
              @edit="handleEditPayment"
            />
          </div>

          <!-- Formulario de Pago -->
          <AddPaymentForm
            v-else-if="showAddPaymentModal"
            @save="handleAddPayment"
            @cancel="showAddPaymentModal = false"
          />

          <!-- Vista/Edición de Pago -->
          <PaymentDetails
            v-else-if="showPaymentDetailsModal && selectedPayment"
            :payment="selectedPayment"
            :is-editing="isEditing"
            @edit="isEditing = true"
            @save="handleSavePayment"
            @close="showPaymentDetailsModal = false"
          />
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal de confirmación -->
  <div
    v-if="showConfirmDialog"
    class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1200] p-6"
    @click="showConfirmDialog = false"
  >
    <div
      class="w-full max-w-[400px] bg-background rounded-2xl border border-container-border shadow-[0_8px_32px_var(--container-shadow)] p-6 sm:p-5"
      @click.stop
    >
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle class="w-4 h-4 text-amber-500" />
        </div>
        <h3 class="text-lg font-semibold text-text">Confirmar Salida</h3>
      </div>

      <p class="text-base text-text/70 mb-6">
        Hay cambios sin guardar. ¿Está seguro que desea salir? Los cambios se perderán.
      </p>

      <div class="flex gap-3">
        <button
          class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none transition-all duration-300 hover:bg-primary hover:text-white"
          @click="showConfirmDialog = false"
        >
          Cancelar
        </button>
        <button
          class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-500 text-white border-none transition-all duration-300 hover:bg-amber-600"
          @click="handleConfirm"
        >
          Salir sin Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watchEffect } from 'vue';
  import { X, FileText, Plus, AlertTriangle } from 'lucide-vue-next';
  import ClientInfoCard from './payments/ClientInfoCard.vue';
  import PaymentTable from './payments/PaymentTable.vue';
  import AddPaymentForm from './payments/AddPaymentForm.vue';
  import PaymentDetails from './payments/PaymentDetails.vue';
  import { Cliente } from '../interfaces/cliente_interface';
  import { PlanDePago } from '../interfaces/plan_de_pago_interface';
  import { getPlanDePagoAction } from '../actions/plan_de_pago_actions';
  import { Pago } from '../interfaces/pagos_interface';
  import { createPagoAction, getPagosAction, updatePagoAction } from '../actions/pagos_actions';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const props = defineProps<{
    show: boolean;
    client: Cliente;
    planDePagoId: string;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  const showAddPaymentModal = ref(false);
  const showPaymentDetailsModal = ref(false);
  const isEditing = ref(false);
  const selectedPayment = ref<Pago | null>(null);
  const originalPayment = ref<Pago | null>(null);
  const showConfirmDialog = ref(false);

  const planDePago = ref<PlanDePago | null>(null);

  // Datos de ejemplo para la tabla de pagos
  const payments = ref<Pago[]>([]);

  const handleAddPayment = async (payment: FormData) => {
    // Verificar que el ID del plan sea un UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!props.planDePagoId || !uuidRegex.test(props.planDePagoId)) {
      toast.error('El ID del plan no es válido');
      return;
    }

    // Limpiar y formatear el UUID antes de agregarlo
    const cleanUUID = props.planDePagoId.trim();

    // Crear un nuevo FormData para tener mayor control
    const newFormData = new FormData();

    // Transferir todos los datos del FormData original
    for (const [key, value] of payment.entries()) {
      if (key !== 'id_plan') {
        // Excluir id_plan si ya existe
        newFormData.append(key, value);
      }
    }

    // Agregar el id_plan limpio
    newFormData.append('id_plan', cleanUUID);

    try {
      // Llamar a la API para crear el pago
      const res = await createPagoAction(newFormData);

      if (res.ok) {
        toast.success('Registro creado exitosamente!');

        // Refetch los pagos
        const res = await getPagosAction(props.planDePagoId);
        payments.value = res.data;
      } else {
        toast.error('Ocurrió un error al crear el registro!');
      }

      showAddPaymentModal.value = false;
    } catch (error: unknown) {
      console.error(error);
      toast.error('Ocurrió un error al crear el registro!');
    }
  };

  const handleViewPayment = (payment: Pago) => {
    selectedPayment.value = { ...payment };
    originalPayment.value = { ...payment };
    isEditing.value = false;
    showPaymentDetailsModal.value = true;
  };

  const handleEditPayment = (payment: Pago) => {
    selectedPayment.value = { ...payment };
    originalPayment.value = { ...payment };
    isEditing.value = true;
    showPaymentDetailsModal.value = true;
  };

  const handleSavePayment = async (payment: Pago) => {
    //Obtener el uuid del usuario autenticado
    //const uuid = localStorage.getItem('uuid');

    const id_pago = payment.id_pago;

    const formData = new FormData();
    //TODO: Agregar los datos del pago al FormData

    // Llamar a la API para actualizar el pago
    const res = await updatePagoAction(id_pago ?? '', formData);

    if (res.ok) {
      toast.success('Registro actualizado exitosamente!');
      originalPayment.value = { ...payment };
      showPaymentDetailsModal.value = false;
      selectedPayment.value = null;
      originalPayment.value = null;
      isEditing.value = false;
    } else {
      toast.error('Ocurrió un error al actualizar el registro!');
    }
  };

  const handleClose = () => {
    if (showAddPaymentModal.value || (showPaymentDetailsModal.value && isEditing.value)) {
      showConfirmDialog.value = true;
    } else {
      emit('close');
    }
  };

  const handleConfirm = () => {
    if (showAddPaymentModal.value) {
      showAddPaymentModal.value = false;
    } else if (showPaymentDetailsModal.value) {
      showPaymentDetailsModal.value = false;
      selectedPayment.value = null;
      originalPayment.value = null;
      isEditing.value = false;
    } else {
      emit('close');
    }
    showConfirmDialog.value = false;
  };

  onMounted(async () => {
    // Obtener el plan de pago
    if (props.planDePagoId) {
      const response = await getPlanDePagoAction(props.planDePagoId);
      planDePago.value = response.data;

      // Obtener los pagos del plan de pago
      const res = await getPagosAction(props.planDePagoId);
      payments.value = res.data;
    }
  });

  watchEffect(async () => {
    if (props.planDePagoId) {
      const response = await getPlanDePagoAction(props.planDePagoId);
      planDePago.value = response.data;

      // Obtener los pagos del plan de pago
      const res = await getPagosAction(props.planDePagoId);
      payments.value = res.data;
    }
  });
</script>
