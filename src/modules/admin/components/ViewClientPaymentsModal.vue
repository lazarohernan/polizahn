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
  import { usePlanDePago } from '@/composables/usePlanDePago';
  import { usePagos } from '@/composables/usePagos';
  import { Pago } from '../interfaces/pagos_interface';
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
  const payments = ref<Pago[]>([]);

  // Composables
  const { getPlanDePago } = usePlanDePago();
  const { getPagos, createPago, updatePago } = usePagos();

  const handleAddPayment = async (formData: FormData) => {
    try {
      // Crear el pago usando el composable
      const res = await createPago({
        id_plan: props.planDePagoId,
        abono: Number(formData.get('abono')),
        fecha: formData.get('fecha') as string,
        metodo_pago: formData.get('metodo_pago') as string,
        comprobante: formData.get('url_comprobante') as File
      });

      if (res.ok) {
        toast.success('Pago registrado exitosamente!');

        // Refetch los pagos
        const pagosRes = await getPagos(props.planDePagoId);
        if (pagosRes.ok) {
          payments.value = pagosRes.data;
        }
      } else {
        toast.error('Ocurrió un error al registrar el pago!');
      }

      showAddPaymentModal.value = false;
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al registrar el pago!');
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
    try {
      if (!payment.id_pago) {
        toast.error('ID de pago no válido');
        return;
      }

      const res = await updatePago(payment.id_pago, {
        abono: payment.abono,
        fecha: payment.fecha as string,
        metodo_pago: payment.metodo_pago,
        comprobante: payment.url_comprobante instanceof File ? payment.url_comprobante : undefined
      });

      if (res.ok) {
        toast.success('Pago actualizado exitosamente!');
        originalPayment.value = { ...payment };
        showPaymentDetailsModal.value = false;
        selectedPayment.value = null;
        originalPayment.value = null;
        isEditing.value = false;

        // Refetch los pagos
        const pagosRes = await getPagos(props.planDePagoId);
        if (pagosRes.ok) {
          payments.value = pagosRes.data;
        }
      } else {
        toast.error('Ocurrió un error al actualizar el pago!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al actualizar el pago!');
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
    if (props.planDePagoId) {
      // Obtener el plan de pago
      const response = await getPlanDePago(props.planDePagoId);
      if (response.ok) {
        planDePago.value = response.data;
      }

      // Obtener los pagos del plan de pago
      const pagosRes = await getPagos(props.planDePagoId);
      if (pagosRes.ok) {
        payments.value = pagosRes.data;
      }
    }
  });

  watchEffect(async () => {
    if (props.planDePagoId) {
      // Obtener el plan de pago
      const response = await getPlanDePago(props.planDePagoId);
      if (response.ok) {
        planDePago.value = response.data;
      }

      // Obtener los pagos del plan de pago
      const pagosRes = await getPagos(props.planDePagoId);
      if (pagosRes.ok) {
        payments.value = pagosRes.data;
      }
    }
  });
</script>
