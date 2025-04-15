<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-text">
        {{ isEditing ? 'Editar Pago' : 'Detalles del Pago' }}
      </h3>
      <button
        v-if="!isEditing"
        class="group flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
        @click="emit('edit')"
      >
        <Edit class="w-4 h-4 text-text group-hover:text-white" />
        <span>Editar</span>
      </button>
    </div>

    <div class="p-5 bg-input-bg rounded-xl flex flex-col gap-5">
      <div class="grid grid-cols-[1.5fr_1fr] gap-4">
        <!-- Monto del Abono -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text">Monto del Abono</label>
          <div class="relative flex items-center">
            <div class="absolute left-4 text-text/50">L</div>
            <input
              v-model="localPayment.abono"
              type="number"
              min="0"
              step="0.01"
              :disabled="!isEditing"
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Fecha de Pago -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-text">Fecha de Pago</label>
          <div class="relative flex items-center">
            <input
              :value="
                localPayment.fecha ? new Date(localPayment.fecha).toISOString().split('T')[0] : ''
              "
              type="date"
              :disabled="!isEditing"
              class="w-full px-4 py-3 rounded-lg border border-input-border bg-background text-text text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              @input="(e) => (localPayment.fecha = (e.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <!-- Método de Pago -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text">Método de Pago</label>
        <div class="flex gap-3">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex-1 relative flex flex-col items-center gap-2 p-4 rounded-xl border border-input-border bg-background cursor-pointer transition-all duration-300 hover:border-primary disabled:opacity-70 disabled:cursor-not-allowed"
            :class="{
              'border-primary bg-primary/10': localPayment.metodo_pago === method.id,
              'opacity-70 cursor-not-allowed hover:border-input-border': !isEditing,
            }"
          >
            <input
              v-model="localPayment.metodo_pago"
              type="radio"
              :value="method.id"
              name="viewPaymentMethod"
              :disabled="!isEditing"
              class="absolute opacity-0"
            />
            <component
              :is="method.icon"
              class="w-6 h-6 text-text/70 transition-colors duration-300"
              :class="{ 'text-primary': localPayment.metodo_pago === method.id }"
            />
            <span class="text-sm text-text">{{ method.label }}</span>
          </label>
        </div>
      </div>

      <!-- Comprobante -->
      <div v-if="!isEditing" class="flex flex-col gap-2">
        <label class="text-sm font-medium text-text">Comprobante</label>
        <div v-if="localPayment.url_comprobante" class="flex items-center gap-3">
          <a
            :href="localPayment.url_comprobante as string"
            target="_blank"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <Image class="w-4 h-4" />
            <span>Ver Comprobante</span>
          </a>
        </div>
        <div
          v-else
          class="flex items-center gap-3 p-3 border border-input-border rounded-lg bg-background"
        >
          <span class="text-sm text-text/70">Comprobante no subido</span>
        </div>
      </div>

      <div v-if="isEditing" class="flex flex-col gap-3">
        <label
          class="flex items-center gap-3 p-3 border border-dashed border-input-border rounded-lg bg-background cursor-pointer transition-all duration-300 hover:border-primary"
        >
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            class="hidden"
            @change="handleFileChange"
          />
          <Upload class="w-5 h-5 text-text/70" />
          <div class="flex flex-col gap-1 overflow-hidden">
            <span class="text-sm font-medium text-text truncate">
              {{ receipt ? receipt.name : 'Subir comprobante' }}
            </span>
            <span class="text-xs text-text/70 truncate">PNG, JPG o PDF hasta 5MB</span>
          </div>
        </label>

        <!-- Muestra error en caso de seleccionar un archivo inválido (NO pdf o Word) -->
        <p v-if="fileError" class="text-red-500 text-sm mt-2">{{ fileError }}</p>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex gap-4 pt-5 border-t border-input-border">
      <button
        type="button"
        class="flex-1 px-6 py-3 rounded-lg bg-input-bg border border-input-border text-text text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white"
        @click="emit('close')"
      >
        Cerrar
      </button>
      <button
        v-if="isEditing"
        type="button"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        Guardar Cambios
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import {
    Edit,
    Save,
    Image,
    ArrowLeftRight,
    CreditCard,
    BanknoteIcon,
    Upload,
  } from 'lucide-vue-next';
  import { Pago } from '../../interfaces/pagos_interface';

  const props = defineProps<{
    payment: Pago;
    isEditing: boolean;
  }>();

  const emit = defineEmits<{
    edit: [];
    save: [payment: Pago];
    close: [];
  }>();

  const receipt = ref<File | null | undefined>(
    props.payment.url_comprobante
      ? new File([props.payment.url_comprobante], props.payment.url_comprobante as string)
      : null,
  );
  const fileError = ref('');

  const localPayment = ref<Pago>({
    id_pago: props.payment.id_pago,
    id_plan: props.payment.id_plan,
    abono: props.payment.abono,
    fecha: props.payment.fecha,
    metodo_pago: props.payment.metodo_pago,
    url_comprobante: props.payment.url_comprobante,
    creado_por: props.payment.creado_por,
    fecha_creado: props.payment.fecha_creado,
    modificado_por: props.payment.modificado_por,
    fecha_modificado: props.payment.fecha_modificado,
    estado: props.payment.estado,
  });

  // Actualizar el pago local cuando cambia el prop
  watch(
    () => props.payment,
    (newPayment) => {
      localPayment.value = { ...newPayment };
    },
    { immediate: true },
  );

  const paymentMethods = [
    {
      id: 'efectivo' as const,
      label: 'Efectivo',
      icon: BanknoteIcon,
    },
    {
      id: 'tarjeta' as const,
      label: 'Tarjeta',
      icon: CreditCard,
    },
    {
      id: 'transferencia' as const,
      label: 'Transferencia',
      icon: ArrowLeftRight,
    },
  ];

  const handleSave = () => {
    emit('save', localPayment.value);
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file) {
      // Verificar el tipo de archivo
      let fileType = file.type;

      // Verificación adicional por extensión si el tipo MIME no es reconocido
      if (!fileType || fileType === '') {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') fileType = 'application/pdf';
        else if (extension === 'png') fileType = 'image/png';
        else if (extension === 'jpg' || extension === 'jpeg') fileType = 'image/jpeg';
      }

      if (!allowedTypes.includes(fileType)) {
        fileError.value = 'Solo se permiten archivos PNG, JPG, JPEG o PDF.';
        target.value = ''; // Clear the invalid file
        receipt.value = undefined;
      } else if (file.size > maxSize) {
        fileError.value = 'El archivo no debe superar los 5MB.';
        target.value = ''; // Clear the invalid file
        receipt.value = undefined;
      } else {
        fileError.value = '';
        receipt.value = file;
      }
    }
  };
</script>
