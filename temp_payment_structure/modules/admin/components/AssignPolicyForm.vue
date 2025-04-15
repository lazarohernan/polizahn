<template>
  <div class="flex flex-col min-h-full">
    <div class="flex flex-col gap-4 mb-4">
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

      <!-- Formulario de Asignación -->
      <div class="p-4 bg-input-bg rounded-xl">
        <div class="flex flex-col gap-4">
          <!-- Primera fila: Póliza, Prima total y Fecha de pago -->
          <div class="grid grid-cols-[2fr_1fr_1fr] gap-4 sm:grid-cols-1">
            <div class="flex flex-col gap-1.5 min-w-0">
              <label
                for="policy"
                class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
                >Póliza</label
              >
              <select
                id="policy"
                v-model="selectedPolicy"
                class="w-full h-[1.875rem] px-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:0.875rem] bg-[center_right_0.5rem] pr-7 disabled:bg-none"
                required
                :disabled="isViewMode"
              >
                <option value="" disabled>Seleccione una póliza</option>
                <option v-for="poliza in polizas" :key="poliza.id_poliza" :value="poliza.id_poliza">
                  {{ poliza.nombre }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <label
                for="premium"
                class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
                >Prima Total (LP)</label
              >
              <div class="relative flex items-center min-w-0">
                <span class="absolute left-2.5 text-sm font-medium text-text/80 pointer-events-none"
                  >L.</span
                >
                <input
                  id="premium"
                  v-model.number="totalPremium"
                  type="number"
                  class="w-full h-[1.875rem] pl-7 pr-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  :disabled="isViewMode"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <label
                for="payment-date"
                class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
                >Fecha de Pago</label
              >
              <div class="relative flex items-center min-w-0">
                <input
                  v-if="props.mode !== 'view'"
                  id="payment-date"
                  v-model="paymentDate"
                  type="date"
                  class="w-full h-[1.875rem] px-2 pr-7 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border cursor-pointer"
                  required
                  :disabled="isViewMode"
                />

                <p v-else class="text-sm text-text/80 px-2">
                  {{ paymentDate ?? 'no provista' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Segunda fila: Plazo -->
          <div class="flex flex-col gap-1.5 min-w-0">
            <label for="term" class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
              >Plazo (Meses)</label
            >
            <div class="relative flex items-center min-w-0">
              <input
                id="term"
                v-model.number="term"
                type="number"
                class="w-full h-[1.875rem] px-2 pr-12 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                min="1"
                required
                placeholder="0"
                :disabled="isViewMode"
              />
              <span class="absolute right-2.5 text-sm font-medium text-text/80 pointer-events-none"
                >meses</span
              >
            </div>
          </div>

          <!-- Tercera fila: Primer pago y Número de póliza -->
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
            <div class="flex flex-col gap-1.5 min-w-0">
              <label
                for="first-payment"
                class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
                >Primer Pago (LP)</label
              >
              <div class="relative flex items-center min-w-0">
                <span class="absolute left-2.5 text-sm font-medium text-text/80 pointer-events-none"
                  >L.</span
                >
                <input
                  id="first-payment"
                  v-model.number="pagoUno"
                  type="number"
                  class="w-full h-[1.875rem] pl-7 pr-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  :disabled="isViewMode"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <label
                for="policy-number"
                class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
                >Número de Póliza</label
              >
              <input
                id="policy-number"
                v-model="numeroPoliza"
                type="text"
                class="w-full h-[1.875rem] px-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                required
                placeholder="Ingrese el número de póliza"
                :disabled="isViewMode"
              />
            </div>
          </div>

          <!-- Cuarta fila: Estado de la póliza -->
          <div class="flex flex-col gap-1.5 min-w-0">
            <label
              for="policy-status"
              class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
              >Estado de la Póliza</label
            >
            <select
              id="policy-status"
              v-model="statusPoliza"
              class="w-full h-[1.875rem] px-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:0.875rem] bg-[center_right_0.5rem] pr-7 disabled:bg-none"
              required
              :disabled="isViewMode"
            >
              <option value="" disabled>Seleccione un estado</option>
              <option value="vigente">Vigente</option>
              <option value="vencido">Vencido</option>
              <option value="cancelado">Cancelado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <!-- Quinta fila: Archivo de póliza -->
          <div class="flex flex-col gap-1.5 min-w-0">
            <label
              for="policy-file"
              class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
              >Archivo de Póliza</label
            >
            <div class="relative">
              <input
                id="policy-file"
                type="file"
                class="hidden"
                accept=".pdf,.doc,.docx"
                :disabled="isViewMode"
                required
                @change="validateFile"
              />
              <label
                for="policy-file"
                class="flex items-center justify-between w-full h-[1.875rem] px-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border"
                :class="{ 'opacity-70 cursor-not-allowed': isViewMode }"
              >
                <span class="truncate">
                  <a :href="archivoPolizaUrl ?? '#'" target="_blank" class="text-primary"
                    >{{ displayFileName }}
                  </a>
                </span>
                <span class="text-primary text-xs">PDF o Word</span>
              </label>
              <p v-if="fileError" class="text-red-500 text-xs mt-1">{{ fileError }}</p>
            </div>
          </div>

          <!-- Sexta fila: Observación -->
          <div class="flex flex-col gap-1.5 min-w-0">
            <label
              for="observation"
              class="text-xs font-semibold text-text uppercase tracking-wider pl-1"
              >Observación</label
            >
            <textarea
              id="observation"
              v-model="observacion"
              class="w-full h-20 px-2 py-2 rounded-md border border-input-border bg-background text-text text-sm font-medium transition-all duration-300 hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-input-bg disabled:border-input-border resize-none"
              placeholder="Ingrese alguna observación (opcional)"
              :disabled="isViewMode"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Plan de Pagos -->
      <div class="flex flex-col gap-3 p-4 bg-input-bg rounded-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-base font-semibold text-text m-0">Plan de Pagos</h3>
          <div
            v-if="term && totalPremium && pagoUno"
            class="flex gap-6 text-sm text-text font-medium"
          >
            <span>{{ term }} meses</span>
            <span>L. {{ totalPremium.toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="paymentPlan.length > 0" class="-mx-2 px-2">
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
                  Cuota
                </th>
                <th
                  class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
                >
                  Fecha
                </th>
                <th
                  class="py-2 px-3 text-xs font-semibold text-text text-left uppercase tracking-wider border-b-2 border-input-border"
                >
                  Pendiente
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paymentPlan" :key="row.number" class="hover:bg-background">
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                  {{ row.number }}
                </td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                  L. {{ row.amount.toFixed(2) }}
                </td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                  {{
                    new Date(row.dueDate).toLocaleDateString('es-HN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                </td>
                <td class="py-2 px-3 text-sm text-text border-b border-input-border">
                  L. {{ row.pending.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          class="flex-1 flex items-center justify-center text-center p-6 text-sm text-text/70"
        >
          <p class="m-0">Complete los campos del formulario para generar el plan de pagos</p>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex justify-end gap-3 py-4 bg-background border-t border-input-border mt-auto">
      <button
        v-if="props.mode === 'view' || 'edit'"
        class="px-4 py-2 rounded-lg text-sm font-semibold border border-input-border text-text transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5"
        @click="handleCancel"
      >
        Cancelar
      </button>
      <button
        v-if="isViewMode"
        class="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
        @click="$emit('edit')"
      >
        {{ buttonText }}
      </button>
      <button
        v-else
        :disabled="
          !selectedPolicy ||
          !totalPremium ||
          !term ||
          !paymentDate ||
          pagoUno === 0 ||
          !numeroPoliza ||
          (props.mode === 'create' && !archivoPoliza)
        "
        class="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white border-none transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleSave"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { User, Mail, Hash } from 'lucide-vue-next';
  import { Cliente } from '../interfaces/cliente_interface';
  import {
    PlanDePago,
    CreatePlanDePagoDTO,
    UpdatePlanDePagoDTO,
  } from '../interfaces/plan_de_pago_interface';
  import { Poliza } from '../interfaces/polizas_interface';
  import { getPolizasAction } from '../actions/polizas_actions';
  import { getPlanDePagoAction } from '../actions/plan_de_pago_actions';

  interface PaymentRow {
    number: number;
    amount: number;
    dueDate: string;
    pending: number;
  }

  const props = defineProps<{
    mode: 'view' | 'edit' | 'create';
    client: Cliente;
    planDePagoId: string;
  }>();

  const emit = defineEmits<{
    save: [data: CreatePlanDePagoDTO | UpdatePlanDePagoDTO];
    cancel: [];
    edit: [];
    hasChanges: [hasChanges: boolean];
  }>();

  // Form state
  const selectedPolicy = ref<string | null>(null); //Póliza seleccionada
  const polizas = ref<Poliza[]>([]); //Lista de pólizas
  const totalPremium = ref<number>(0); //Prima total
  const term = ref<number>(0); //Plazo
  const paymentDate = ref<string | null>(null); //Fecha de pago
  const pagoUno = ref<number>(0); //Primer pago
  const numeroPoliza = ref<string | null>(null); //Número de póliza
  const statusPoliza = ref<string | null>(null); //Estado de la póliza
  const observacion = ref<string | null>(null); //Observación

  //Just for view mode
  const archivoPolizaUrl = ref<string | null>(null);

  //id_correduria del localstorage
  const idCorreduria = localStorage.getItem('id_correduria');
  const existingPlanDePago = ref<PlanDePago | null>(null); //Plan de pago existente

  const archivoPoliza = ref<File | undefined>();

  //Validación de los tipos de archivo en póliza
  const fileError = ref('');

  //Validar el tipo de archivo
  const validateFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const maxSize = 8 * 1024 * 1024; // 10MB en bytes

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        fileError.value = 'Solo se permiten archivos PDF o Word.';
        target.value = ''; // Borra el archivo no válido
      } else if (file.size > maxSize) {
        fileError.value = 'El archivo no debe superar los 8MB.';
        target.value = ''; // Borra el archivo no válido
      } else {
        fileError.value = '';
        archivoPoliza.value = file;
      }
    }
  };

  // Watch for changes
  watch(
    [
      selectedPolicy,
      totalPremium,
      term,
      paymentDate,
      pagoUno,
      numeroPoliza,
      statusPoliza,
      observacion,
      archivoPoliza,
    ],
    () => {
      if (props.mode === 'view') {
        emit('hasChanges', false);
        return;
      }

      const hasChanges =
        selectedPolicy.value !== (existingPlanDePago.value?.id_poliza ?? null) ||
        totalPremium.value !== (existingPlanDePago.value?.prima_total ?? 0) ||
        term.value !== (existingPlanDePago.value?.plazo ?? 0) ||
        paymentDate.value !== (existingPlanDePago.value?.fecha_de_pago ?? '') ||
        pagoUno.value !== (existingPlanDePago.value?.pago_uno ?? 0) ||
        numeroPoliza.value !== (existingPlanDePago.value?.numero_poliza ?? null) ||
        statusPoliza.value !== (existingPlanDePago.value?.status ?? null) ||
        observacion.value !== (existingPlanDePago.value?.observacion ?? null) ||
        !!archivoPoliza.value;

      emit('hasChanges', hasChanges);
    },
    { deep: true, immediate: true },
  );

  onMounted(async () => {
    try {
      const response = await getPolizasAction(idCorreduria ?? '');
      polizas.value = response.data;

      if (props.mode === 'view' && props.planDePagoId) {
        try {
          const planElegido = await getPlanDePagoAction(props.planDePagoId);
          if (planElegido && planElegido.data) {
            existingPlanDePago.value = planElegido.data;
            inicitalizeFormData();
          }
        } catch (planError) {
          console.error('Error al cargar el plan de pago:', planError);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    }
  });

  const inicitalizeFormData = () => {
    if (existingPlanDePago.value) {
      selectedPolicy.value = existingPlanDePago.value.id_poliza;
      totalPremium.value = Number(existingPlanDePago.value.prima_total?.toString() || '0');
      term.value = existingPlanDePago.value.plazo;
      numeroPoliza.value = existingPlanDePago.value.numero_poliza;
      statusPoliza.value = existingPlanDePago.value.status ?? 'sin estatus';
      observacion.value = existingPlanDePago.value.observacion ?? 'sin observación';
      pagoUno.value = Number(existingPlanDePago.value.pago_uno?.toString() || '0');
      paymentDate.value = existingPlanDePago.value.fecha_de_pago.toString().split('T')[0];
      archivoPolizaUrl.value = existingPlanDePago.value.archivo_poliza as string;
    }
  };

  // Computed properties
  const isViewMode = computed(() => props.mode === 'view');

  const displayFileName = computed(() => {
    if (isViewMode.value && existingPlanDePago.value?.archivo_poliza) {
      // In view mode, show the filename from the existingPlanDePago if available
      const filePath = existingPlanDePago.value.archivo_poliza;
      // Extract filename from path (if it's a path)
      if (typeof filePath === 'string') {
        const parts = filePath.split('/');
        return parts[parts.length - 1]; // Get last part (filename)
      }
      return 'Archivo adjunto';
    }

    // In edit/create mode, show the selected file name or default text
    return archivoPoliza?.value?.name || 'Seleccionar archivo';
  });

  const buttonText = computed(() => {
    switch (props.mode) {
      case 'view':
        return 'Editar Póliza';
      case 'edit':
        return 'Guardar Cambios';
      case 'create':
        return 'Asignar Póliza';
      default:
        return 'Asignar Póliza';
    }
  });

  // Computed payment plan
  const paymentPlan = computed(() => {
    try {
      // Ensure all required values are present and valid
      if (
        !totalPremium.value ||
        totalPremium.value <= 0 ||
        !term.value ||
        term.value <= 0 ||
        !paymentDate.value ||
        pagoUno.value === undefined ||
        pagoUno.value < 0
      ) {
        return [];
      }

      // Handle the case where term is 1 (only one payment)
      if (term.value === 1) {
        const startDate = new Date(paymentDate.value);
        if (isNaN(startDate.getTime())) return []; // Invalid date

        return [
          {
            number: 1,
            amount: totalPremium.value,
            dueDate: startDate.toISOString().split('T')[0],
            pending: 0,
          },
        ];
      }

      const rows: PaymentRow[] = [];
      const monthlyPayment = (totalPremium.value - pagoUno.value) / (term.value - 1);

      // Validate date
      const startDate = new Date(paymentDate.value);
      if (isNaN(startDate.getTime())) return []; // Invalid date

      let pendingAmount = totalPremium.value;

      // Generar filas de pagos mensuales
      for (let i = 0; i < term.value; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);

        if (i === 0) {
          rows.push({
            number: i + 1,
            amount: pagoUno.value,
            dueDate: date.toISOString().split('T')[0],
            pending: pendingAmount,
          });
          pendingAmount -= pagoUno.value;
        } else {
          rows.push({
            number: i + 1,
            amount: monthlyPayment,
            dueDate: date.toISOString().split('T')[0],
            pending: pendingAmount,
          });
          pendingAmount -= monthlyPayment;
        }
      }

      return rows;
    } catch (error) {
      console.error('Error calculating payment plan:', error);
      return [];
    }
  });

  const handleSave = () => {
    if (
      !selectedPolicy.value ||
      !totalPremium.value ||
      !term.value ||
      !paymentDate.value ||
      pagoUno.value === 0 ||
      !numeroPoliza.value
    )
      return;

    if (props.mode === 'edit' && existingPlanDePago.value?.id_plan) {
      // Para edición
      const updateData: UpdatePlanDePagoDTO = {
        id_plan: existingPlanDePago.value.id_plan,
        id_poliza: selectedPolicy.value,
        prima_total: totalPremium.value,
        plazo: term.value,
        fecha_de_pago: paymentDate.value,
        pago_uno: pagoUno.value,
        numero_poliza: numeroPoliza.value,
        archivo_poliza: archivoPoliza.value,
        status: statusPoliza.value || undefined,
        observacion: observacion.value || undefined,
      };

      emit('save', updateData);
    } else {
      // Para creación
      const createData: CreatePlanDePagoDTO = {
        id_cliente: props.client.id_cliente || '',
        id_poliza: selectedPolicy.value,
        prima_total: totalPremium.value,
        plazo: term.value,
        fecha_de_pago: paymentDate.value,
        pago_uno: pagoUno.value,
        numero_poliza: numeroPoliza.value,
        archivo_poliza: archivoPoliza.value,
        status: statusPoliza.value || undefined,
        observacion: observacion.value || undefined,
      };

      emit('save', createData);
    }
  };

  const handleCancel = () => {
    // Solo emitir cancel si no hay cambios o si estamos en modo vista
    const hasChanges =
      selectedPolicy.value !== (existingPlanDePago.value?.id_poliza ?? null) ||
      totalPremium.value !== (existingPlanDePago.value?.prima_total ?? 0) ||
      term.value !== (existingPlanDePago.value?.plazo ?? 0) ||
      paymentDate.value !== (existingPlanDePago.value?.fecha_de_pago ?? '') ||
      pagoUno.value !== (existingPlanDePago.value?.pago_uno ?? 0) ||
      numeroPoliza.value !== (existingPlanDePago.value?.numero_poliza ?? null) ||
      statusPoliza.value !== (existingPlanDePago.value?.status ?? null) ||
      observacion.value !== (existingPlanDePago.value?.observacion ?? null) ||
      !!archivoPoliza.value;

    if (!hasChanges || props.mode === 'view' || props.mode === 'edit') {
      emit('cancel');
    }
  };
</script>
