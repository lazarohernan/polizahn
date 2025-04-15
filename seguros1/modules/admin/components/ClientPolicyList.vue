<template>
  <div class="flex flex-col gap-4">
    <!-- Información del Cliente - Siempre 3 columnas -->
    <div class="p-4 bg-input-bg rounded-xl">
      <div class="grid grid-cols-3 gap-4">
        <div
          class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
        >
          <User class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
          <div class="min-w-0">
            <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1"
              >Nombre Completo</label
            >
            <p class="m-0 text-sm font-medium text-text truncate">
              {{ client.nombres + ' ' + client.apellidos }}
            </p>
          </div>
        </div>
        <div
          class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
        >
          <Hash class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
          <div class="min-w-0">
            <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1"
              >DNI</label
            >
            <p class="m-0 text-sm font-medium text-text truncate">{{ client.identificacion }}</p>
          </div>
        </div>
        <div
          class="flex items-start gap-3 p-3 bg-background border border-input-border rounded-lg transition-all duration-300 hover:border-primary hover:-translate-y-0.5"
        >
          <Mail class="w-4 h-4 text-primary opacity-70 flex-shrink-0" />
          <div class="min-w-0">
            <label class="block text-xs font-semibold text-text/70 uppercase tracking-wider mb-1"
              >Correo</label
            >
            <p class="m-0 text-sm font-medium text-text truncate">{{ client.correo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Pólizas -->
    <div class="flex-1 min-h-0 flex flex-col gap-3">
      <h3 class="text-base font-semibold text-text m-0">Pólizas del Cliente</h3>

      <!-- Tabla de Pólizas Activas (Plan de Pago) -->
      <div
        v-if="planesDePago.length > 0"
        class="flex-1 min-h-0 overflow-auto border border-input-border rounded-xl bg-input-bg"
      >
        <table class="w-full border-separate border-spacing-0">
          <thead class="sticky top-0 z-[1] bg-input-bg">
            <tr>
              <th
                class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
              >
                #
              </th>
              <th
                class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
              >
                Póliza
              </th>
              <th
                class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
              >
                Plazo
              </th>
              <th
                class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
              >
                Estado
              </th>
              <th
                class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="policy in planesDePago" :key="policy.id_plan" class="hover:bg-background">
              <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                {{ policy.numero_poliza }}
              </td>
              <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                {{ policy.nombre_poliza }}
              </td>
              <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                {{ policy.plazo }} meses
              </td>
              <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                <!-- Badge de estado de póliza
                     - Verde (emerald) para pólizas vigentes
                     - Rojo para pólizas vencidas
                     Usando las mismas clases de color que en el resto del sistema -->
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-emerald-100 text-emerald-600':
                      policyStatuses.find((p) => p.id_plan === policy.id_plan)?.status ===
                      'vigente',
                    'bg-red-100 text-red-600':
                      policyStatuses.find((p) => p.id_plan === policy.id_plan)?.status ===
                      'vencida',
                  }"
                >
                  {{ policyStatuses.find((p) => p.id_plan === policy.id_plan)?.status }}
                </span>
              </td>
              <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                <div class="flex gap-2">
                  <button
                    class="p-1.5 rounded-lg border-none bg-background text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
                    title="Ver detalles"
                    @click="emit('viewPolicy', policy.id_plan ?? '')"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg border-none bg-background text-text transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
                    title="Ver pagos"
                    @click="emit('viewPayments', policy.id_plan ?? '')"
                  >
                    <CreditCard class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg border-none bg-background text-text transition-all duration-300 hover:bg-[#FF544E] hover:text-white hover:-translate-y-0.5 flex items-center justify-center"
                    title="Eliminar Póliza"
                    @click="handleDeletePlan(policy)"
                  >
                    <Trash class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay pólizas -->
      <div
        v-else
        class="flex-1 flex items-center justify-center p-8 bg-input-bg border border-input-border rounded-xl"
      >
        <div class="text-center">
          <User class="w-12 h-12 text-primary opacity-50 mx-auto mb-4" />
          <p class="m-0 text-sm text-text/70">Este usuario no tiene pólizas activas</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
      @click.self="showDeleteConfirmation = false"
    >
      <div class="w-full max-w-md bg-background rounded-2xl p-6 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle class="w-5 h-5 text-red-500" />
          </div>
          <h3 class="text-lg font-semibold text-text">Confirmar Eliminación</h3>
        </div>
        <p class="text-text/70">
          ¿Está seguro que desea eliminar el plan de pago
          <span class="font-medium text-text">{{ planToDelete?.nombre_poliza }}</span
          >? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-xl bg-input-bg border border-input-border text-sm font-medium text-text transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md"
            @click="showDeleteConfirmation = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium border-none transition-all duration-300 hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
            @click="confirmDelete"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { User, Mail, Hash, Eye, CreditCard, Trash, AlertTriangle } from 'lucide-vue-next';
  import { Cliente } from '../interfaces/cliente_interface';
  import { PlanDePago } from '../interfaces/plan_de_pago_interface';
  import { ref, computed } from 'vue';

  const props = defineProps<{
    client: Cliente;
    planesDePago: PlanDePago[];
  }>();

  const emit = defineEmits<{
    viewPolicy: [policyId: string];
    viewPayments: [planDePagoId: string];
    deletePlanDePago: [policyId: string];
  }>();

  const showDeleteConfirmation = ref(false);
  const planToDelete = ref<PlanDePago | null>(null);

  const handleDeletePlan = (plan: PlanDePago) => {
    planToDelete.value = plan;
    showDeleteConfirmation.value = true;
  };

  const confirmDelete = () => {
    if (planToDelete.value) {
      emit('deletePlanDePago', planToDelete.value.id_plan ?? '');
      showDeleteConfirmation.value = false;
      planToDelete.value = null;
    }
  };

  // Computed property to determine the status
  const policyStatuses = computed(() => {
    return props.planesDePago.map((policy) => {
      const paymentDate = new Date(policy.fecha_de_pago);
      const expirationDate = new Date(paymentDate);
      expirationDate.setMonth(expirationDate.getMonth() + policy.plazo);

      return {
        id_plan: policy.id_plan,
        status: new Date() < expirationDate ? 'vigente' : 'vencida',
      };
    });
  });
</script>
